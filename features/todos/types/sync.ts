/**
 * Sync Todo Types
 * Types for syncing todos from Google Chat messages
 * Update v1: Added async task support
 */

import type { TaskStatus, TaskProgress, GeneratedTodo } from "@/features/googleChat/types";

export interface SyncResult {
  totalMessagesProcessed: number;
  totalTodosGenerated: number;
  totalTodosSaved: number;
  summary: string;
  processedSpaces?: string[];
  todos?: GeneratedTodo[];
}

// Update v1: Extended sync state with async task support
export interface SyncState {
  lastSyncAt: string | null;
  isSyncing: boolean;
  syncProgress: number;
  syncError: string | null;
  lastSyncResult: SyncResult | null;
  // Async task fields
  taskId: string | null;
  taskStatus: TaskStatus | "IDLE";
  taskProgress: TaskProgress | null;
}

export interface SyncTodoParams {
  startDate?: string;
  endDate?: string;
  spaceIds?: string[];
  autoSave?: boolean;
  limitPerSpace?: number;
}

export interface TimeRange {
  startDate: Date;
  endDate: Date;
}

export interface SyncApiResponse {
  total_messages_processed: number;
  total_todos_generated: number;
  total_todos_saved: number;
  summary: string;
}

// Helper to convert API response to frontend model
export const mapSyncApiResponse = (response: SyncApiResponse): SyncResult => ({
  totalMessagesProcessed: response.total_messages_processed,
  totalTodosGenerated: response.total_todos_generated,
  totalTodosSaved: response.total_todos_saved,
  summary: response.summary,
});
