"use client";

import { useSyncTodo } from "../hooks/useSyncTodo";
import { Loader2, X, Check, AlertCircle, ListTodo } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export function GlobalSyncProgress() {
  const {
    isSyncing,
    syncProgress,
    taskStatus,
    taskProgress,
    cancelSync,
    taskId,
    lastSyncResult,
    resetSyncState,
    resumePolling,
  } = useSyncTodo();

  const [isVisible, setIsVisible] = useState(false);

  // Show progress if syncing or just finished
  useEffect(() => {
    if (isSyncing || (taskStatus === "SUCCESS" && !isVisible)) {
      setIsVisible(true);
    }
  }, [isSyncing, taskStatus, isVisible]);

  // Restore polling on mount if needed
  useEffect(() => {
    if (
      !isSyncing &&
      taskId &&
      (taskStatus === "PENDING" || taskStatus === "PROGRESS")
    ) {
      resumePolling(taskId);
    }
  }, []); // Only once on mount

  if (!isVisible && !isSyncing) return null;

  // Render nothing if finished and been auto-closed
  if (taskStatus === "IDLE") return null;

  const getStatusText = () => {
    if (taskStatus === "SUCCESS") return "Sync Complete";
    if (taskStatus === "FAILURE") return "Sync Failed";
    if (taskStatus === "REVOKED") return "Sync Cancelled";

    if (taskStatus === "PROGRESS" && taskProgress) {
      return taskProgress.progress || "Analyzing...";
    }
    return "Starting Sync...";
  };

  const handleClose = () => {
    setIsVisible(false);
    // If not syncing, reset to idle so it doesn't reappear
    if (!isSyncing) {
      resetSyncState();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-80 animate-slideUp">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-bg shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-bg/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-md ${
                isSyncing
                  ? "bg-primarySoft text-primary"
                  : taskStatus === "SUCCESS"
                  ? "bg-successSoft text-success"
                  : "bg-surface2 text-ink3"
              }`}
            >
              {isSyncing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : taskStatus === "SUCCESS" ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
            </div>
            <span className="text-sm font-bold text-ink">Sync Progress</span>
          </div>
          <button
            onClick={handleClose}
            className="text-ink3 hover:text-ink transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink2 truncate pr-4">
                {getStatusText()}
              </span>
              <span className="text-xs font-bold text-primary shrink-0">
                {syncProgress}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface2">
              <div
                className={`h-full transition-all duration-500 bg-primary`}
                style={{ width: `${syncProgress}%` }}
              />
            </div>

            {/* Footer Actions */}
            <div className="mt-1 flex items-center justify-between">
              {isSyncing ? (
                <button
                  onClick={() => cancelSync()}
                  className="text-xs font-semibold text-danger hover:underline"
                >
                  Stop Sync
                </button>
              ) : taskStatus === "SUCCESS" && lastSyncResult ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/todos"
                    className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <ListTodo className="h-3 w-3" />
                    Review {lastSyncResult.totalTodosGenerated} new tasks
                  </Link>
                </div>
              ) : null}

              <span className="text-[10px] uppercase tracking-wider text-ink3 font-bold">
                SpiderX Background
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
