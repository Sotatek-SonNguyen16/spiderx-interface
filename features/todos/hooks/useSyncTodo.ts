"use client";

import { useState, useCallback, useRef } from "react";
import { googleChatService } from "@/features/googleChat";
import type { SyncState, SyncResult, SyncTodoParams, TimeRange } from "../types/sync";
import type { TaskStatusResponse, TaskStatus } from "@/features/googleChat/types";

const LAST_SYNC_KEY = "spiderx_last_sync_at";
const POLL_INTERVAL_MS = 2000;

/**
 * Get last sync timestamp from localStorage
 */
const getLastSyncAt = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LAST_SYNC_KEY);
};

/**
 * Save last sync timestamp to localStorage
 */
const setLastSyncAt = (timestamp: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_SYNC_KEY, timestamp);
};

/**
 * Hook for syncing todos from Google Chat messages
 * Update v1: Uses async task flow with polling
 */
export const useSyncTodo = () => {
  const [syncState, setSyncState] = useState<SyncState>({
    lastSyncAt: getLastSyncAt(),
    isSyncing: false,
    syncProgress: 0,
    syncError: null,
    lastSyncResult: null,
    // Async task fields
    taskId: null,
    taskStatus: "IDLE",
    taskProgress: null,
  });

  // Ref to track if we should continue polling
  const shouldPollRef = useRef(true);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Handle task status update during polling
   */
  const handleTaskStatusUpdate = useCallback((status: TaskStatusResponse) => {
    setSyncState((prev) => ({
      ...prev,
      taskStatus: status.status,
      taskProgress: status.progress,
      syncProgress: status.progress?.percent ?? prev.syncProgress,
    }));
  }, []);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    shouldPollRef.current = false;
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);


  /**
   * Poll task status
   */
  const pollTaskStatus = useCallback(async (taskId: string): Promise<TaskStatusResponse | null> => {
    const result = await googleChatService.getTaskStatus(taskId);
    if (result.error || !result.data) {
      return null;
    }
    return result.data;
  }, []);

  /**
   * Start async sync task and poll until completion
   */
  const syncTodosAsync = useCallback(async (params?: SyncTodoParams): Promise<{
    success: boolean;
    data?: SyncResult;
    error?: string;
  }> => {
    // Reset state and start syncing
    setSyncState((prev) => ({
      ...prev,
      isSyncing: true,
      syncProgress: 0,
      syncError: null,
      taskId: null,
      taskStatus: "PENDING",
      taskProgress: null,
    }));
    shouldPollRef.current = true;

    try {
      // Start the async task
      const startResult = await googleChatService.startGenerateTodosTask({
        autoSave: params?.autoSave ?? true,
        limitPerSpace: params?.limitPerSpace ?? 100,
      });

      if (startResult.error || !startResult.data) {
        setSyncState((prev) => ({
          ...prev,
          isSyncing: false,
          syncProgress: 0,
          syncError: startResult.error || "Failed to start sync task",
          taskStatus: "FAILURE",
        }));
        return { success: false, error: startResult.error || "Failed to start sync task" };
      }

      const taskId = startResult.data.taskId;
      setSyncState((prev) => ({
        ...prev,
        taskId,
        taskStatus: "PENDING",
      }));

      // Poll until completion
      const pollResult = await googleChatService.pollTaskUntilComplete(
        taskId,
        handleTaskStatusUpdate,
        POLL_INTERVAL_MS
      );

      if (pollResult.error || !pollResult.data) {
        setSyncState((prev) => ({
          ...prev,
          isSyncing: false,
          syncProgress: 0,
          syncError: pollResult.error || "Polling failed",
          taskStatus: "FAILURE",
        }));
        return { success: false, error: pollResult.error || "Polling failed" };
      }

      const finalStatus = pollResult.data;

      // Handle different final states
      if (finalStatus.status === "SUCCESS" && finalStatus.result) {
        const resultData = finalStatus.result.result;
        const syncResult: SyncResult = {
          totalMessagesProcessed: resultData.total_messages_processed,
          totalTodosGenerated: resultData.total_todos_generated,
          totalTodosSaved: resultData.total_todos_saved,
          summary: resultData.summary,
          processedSpaces: resultData.processed_spaces,
          todos: resultData.todos,
        };

        // Save the sync timestamp
        const syncTimestamp = new Date().toISOString();
        setLastSyncAt(syncTimestamp);

        setSyncState({
          lastSyncAt: syncTimestamp,
          isSyncing: false,
          syncProgress: 100,
          syncError: null,
          lastSyncResult: syncResult,
          taskId,
          taskStatus: "SUCCESS",
          taskProgress: null,
        });

        return { success: true, data: syncResult };
      }

      if (finalStatus.status === "FAILURE") {
        setSyncState((prev) => ({
          ...prev,
          isSyncing: false,
          syncProgress: 0,
          syncError: finalStatus.error || "Sync task failed",
          taskStatus: "FAILURE",
        }));
        return { success: false, error: finalStatus.error || "Sync task failed" };
      }

      if (finalStatus.status === "REVOKED") {
        setSyncState((prev) => ({
          ...prev,
          isSyncing: false,
          syncProgress: 0,
          syncError: "Sync was cancelled",
          taskStatus: "REVOKED",
        }));
        return { success: false, error: "Sync was cancelled" };
      }

      return { success: false, error: "Unknown task status" };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setSyncState((prev) => ({
        ...prev,
        isSyncing: false,
        syncProgress: 0,
        syncError: errorMessage,
        taskStatus: "FAILURE",
      }));
      return { success: false, error: errorMessage };
    }
  }, [handleTaskStatusUpdate]);


  /**
   * Cancel the current sync task
   */
  const cancelSync = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    const taskId = syncState.taskId;
    if (!taskId) {
      return { success: false, error: "No active task to cancel" };
    }

    stopPolling();

    const result = await googleChatService.cancelTask(taskId);
    if (result.error) {
      return { success: false, error: result.error };
    }

    setSyncState((prev) => ({
      ...prev,
      isSyncing: false,
      syncProgress: 0,
      syncError: null,
      taskStatus: "REVOKED",
    }));

    return { success: true };
  }, [syncState.taskId, stopPolling]);

  /**
   * Sync todos with a custom time range
   */
  const syncTodosWithRange = useCallback(async (timeRange: TimeRange): Promise<{
    success: boolean;
    data?: SyncResult;
    error?: string;
  }> => {
    return syncTodosAsync({
      startDate: timeRange.startDate.toISOString(),
      endDate: timeRange.endDate.toISOString(),
    });
  }, [syncTodosAsync]);

  /**
   * Get default time range (last sync to now)
   */
  const getDefaultTimeRange = useCallback((): TimeRange => {
    const endDate = new Date();
    const lastSync = syncState.lastSyncAt;
    
    // Default to 24 hours ago if no previous sync
    const startDate = lastSync 
      ? new Date(lastSync)
      : new Date(endDate.getTime() - 24 * 60 * 60 * 1000);

    return { startDate, endDate };
  }, [syncState.lastSyncAt]);

  /**
   * Clear sync error
   */
  const clearError = useCallback(() => {
    setSyncState((prev) => ({ ...prev, syncError: null }));
  }, []);

  /**
   * Reset sync state
   */
  const resetSyncState = useCallback(() => {
    stopPolling();
    setSyncState({
      lastSyncAt: getLastSyncAt(),
      isSyncing: false,
      syncProgress: 0,
      syncError: null,
      lastSyncResult: null,
      taskId: null,
      taskStatus: "IDLE",
      taskProgress: null,
    });
  }, [stopPolling]);

  return {
    // State
    ...syncState,
    
    // Actions
    syncTodos: syncTodosAsync,
    syncTodosWithRange,
    cancelSync,
    getDefaultTimeRange,
    clearError,
    resetSyncState,
  };
};
