import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { SyncState, SyncResult } from "../types/sync";
import type { TaskStatus, TaskProgress } from "@/features/googleChat/types";

interface SyncActions {
  setSyncing: (isSyncing: boolean) => void;
  setTaskId: (taskId: string | null) => void;
  setTaskStatus: (status: TaskStatus | "IDLE") => void;
  setTaskProgress: (progress: TaskProgress | null) => void;
  setSyncProgress: (progress: number) => void;
  setSyncError: (error: string | null) => void;
  setLastSyncResult: (result: SyncResult | null) => void;
  updateLastSyncAt: (timestamp: string) => void;
  resetSyncState: () => void;
}

const initialState: SyncState = {
  lastSyncAt: null,
  isSyncing: false,
  syncProgress: 0,
  syncError: null,
  lastSyncResult: null,
  taskId: null,
  taskStatus: "IDLE",
  taskProgress: null,
};

export const useSyncStore = create<SyncState & SyncActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setSyncing: (isSyncing) => set({ isSyncing }),
        setTaskId: (taskId) => set({ taskId }),
        setTaskStatus: (taskStatus) => set({ taskStatus }),
        setTaskProgress: (taskProgress) => set({ taskProgress }),
        setSyncProgress: (syncProgress) => set({ syncProgress }),
        setSyncError: (syncError) => set({ syncError, isSyncing: false }),
        setLastSyncResult: (lastSyncResult) => set({ lastSyncResult }),
        updateLastSyncAt: (lastSyncAt) => set({ lastSyncAt }),
        resetSyncState: () => set({ ...initialState, isSyncing: false }),
      }),
      {
        name: "spiderx-sync-storage",
        // Only persist these fields
        partialize: (state) => ({
          lastSyncAt: state.lastSyncAt,
          taskId: state.taskId,
          isSyncing: state.isSyncing,
          taskStatus: state.taskStatus,
        }),
      }
    ),
    { name: "SyncStore" }
  )
);
