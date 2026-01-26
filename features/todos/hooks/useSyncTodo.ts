import { useCallback, useRef, useEffect } from "react";
import { googleChatService } from "@/features/googleChat";
import { useSyncStore } from "../stores/syncStore";
import type { SyncResult, SyncTodoParams, TimeRange } from "../types/sync";
import type { TaskStatusResponse } from "@/features/googleChat/types";

const POLL_INTERVAL_MS = 2000;

/**
 * Hook for syncing todos from Google Chat messages
 * Update v2: Uses Global Zustand Store for persistence
 */
export const useSyncTodo = () => {
  const isSyncing = useSyncStore((state) => state.isSyncing);
  const taskId = useSyncStore((state) => state.taskId);
  const taskStatus = useSyncStore((state) => state.taskStatus);
  const taskProgress = useSyncStore((state) => state.taskProgress);
  const syncProgress = useSyncStore((state) => state.syncProgress);
  const syncError = useSyncStore((state) => state.syncError);
  const lastSyncAt = useSyncStore((state) => state.lastSyncAt);
  const lastSyncResult = useSyncStore((state) => state.lastSyncResult);

  const {
    setSyncing,
    setSyncProgress,
    setSyncError,
    setTaskId,
    setTaskStatus,
    setTaskProgress,
    setLastSyncResult,
    updateLastSyncAt,
    resetSyncState,
  } = useSyncStore();

  // Ref to track if we should continue polling
  const shouldPollRef = useRef(true);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Handle task status update during polling
   * STABLE: Does not depend on store state, only actions
   */
  const handleTaskStatusUpdate = useCallback((status: TaskStatusResponse) => {
    const { setTaskStatus, setTaskProgress, setSyncProgress } =
      useSyncStore.getState();
    setTaskStatus(status.status);
    setTaskProgress(status.progress);
    if (status.progress?.percent !== undefined) {
      setSyncProgress(status.progress.percent);
    }
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
   * Start async sync task and poll until completion
   */
  const syncTodosAsync = useCallback(
    async (
      params?: SyncTodoParams
    ): Promise<{
      success: boolean;
      data?: SyncResult;
      error?: string;
    }> => {
      // Reset state and start syncing in store
      setSyncing(true);
      setSyncProgress(0);
      setSyncError(null);
      setTaskId(null);
      setTaskStatus("PENDING");
      setTaskProgress(null);

      shouldPollRef.current = true;

      try {
        const startResult = await googleChatService.startGenerateTodosTask({
          autoSave: params?.autoSave ?? true,
          limitPerSpace: params?.limitPerSpace ?? 100,
        });

        if (startResult.error || !startResult.data) {
          const error = startResult.error || "Failed to start sync task";
          setSyncError(error);
          setTaskStatus("FAILURE");
          return { success: false, error };
        }

        const taskId = startResult.data.taskId;
        setTaskId(taskId);
        setTaskStatus("PENDING");

        const pollResult = await googleChatService.pollTaskUntilComplete(
          taskId,
          handleTaskStatusUpdate,
          POLL_INTERVAL_MS
        );

        if (pollResult.error || !pollResult.data) {
          const error = pollResult.error || "Polling failed";
          setSyncError(error);
          setTaskStatus("FAILURE");
          return { success: false, error };
        }

        const finalStatus = pollResult.data;

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

          const syncTimestamp = new Date().toISOString();
          updateLastSyncAt(syncTimestamp);
          setSyncing(false);
          setSyncProgress(100);
          setLastSyncResult(syncResult);
          setTaskStatus("SUCCESS");
          setTaskProgress(null);

          return { success: true, data: syncResult };
        }

        if (finalStatus.status === "FAILURE") {
          const error = finalStatus.error || "Sync task failed";
          setSyncError(error);
          setTaskStatus("FAILURE");
          return { success: false, error };
        }

        if (finalStatus.status === "REVOKED") {
          setSyncing(false);
          setTaskStatus("REVOKED");
          return { success: false, error: "Sync was cancelled" };
        }

        return { success: false, error: "Unknown task status" };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setSyncError(errorMessage);
        setTaskStatus("FAILURE");
        return { success: false, error: errorMessage };
      }
    },
    [
      handleTaskStatusUpdate,
      setSyncing,
      setSyncProgress,
      setSyncError,
      setTaskId,
      setTaskStatus,
      setTaskProgress,
      setLastSyncResult,
      updateLastSyncAt,
    ]
  );

  /**
   * Cancel the current sync task
   */
  const cancelSync = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!taskId) {
      return { success: false, error: "No active task to cancel" };
    }

    stopPolling();
    const result = await googleChatService.cancelTask(taskId);
    if (result.error) {
      return { success: false, error: result.error };
    }

    setSyncing(false);
    setSyncProgress(0);
    setTaskStatus("REVOKED");

    return { success: true };
  }, [taskId, stopPolling, setSyncing, setSyncProgress, setTaskStatus]);

  return {
    isSyncing,
    taskId,
    taskStatus,
    taskProgress,
    syncProgress,
    syncError,
    lastSyncAt,
    lastSyncResult,
    syncTodos: syncTodosAsync,
    syncTodosWithRange: useCallback(
      async (range: TimeRange) =>
        syncTodosAsync({
          startDate: range.startDate.toISOString(),
          endDate: range.endDate.toISOString(),
        }),
      [syncTodosAsync]
    ),
    cancelSync,
    getDefaultTimeRange: useCallback(() => {
      const endDate = new Date();
      const startDate = lastSyncAt
        ? new Date(lastSyncAt)
        : new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
      return { startDate, endDate };
    }, [lastSyncAt]),
    clearError: useCallback(() => setSyncError(null), [setSyncError]),
    resetSyncState,
    resumePolling: useCallback(
      async (taskId: string) => {
        setSyncing(true);
        setTaskId(taskId);
        setTaskStatus("PROGRESS");

        const pollResult = await googleChatService.pollTaskUntilComplete(
          taskId,
          handleTaskStatusUpdate,
          POLL_INTERVAL_MS
        );

        if (pollResult.data) {
          const finalStatus = pollResult.data;
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

            const syncTimestamp = new Date().toISOString();
            updateLastSyncAt(syncTimestamp);
            setSyncing(false);
            setSyncProgress(100);
            setLastSyncResult(syncResult);
            setTaskStatus("SUCCESS");
            setTaskProgress(null);
          } else if (
            finalStatus.status === "FAILURE" ||
            finalStatus.status === "REVOKED"
          ) {
            setSyncing(false);
            setTaskStatus(finalStatus.status);
            if (finalStatus.error) setSyncError(finalStatus.error);
          }
        }
      },
      [
        handleTaskStatusUpdate,
        setSyncing,
        setTaskId,
        setTaskStatus,
        updateLastSyncAt,
        setSyncProgress,
        setLastSyncResult,
        setTaskProgress,
        setSyncError,
      ]
    ),
  };
};
