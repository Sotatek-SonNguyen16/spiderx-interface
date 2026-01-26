"use client";

import { useState, useCallback } from "react";
import {
  RefreshCw,
  ChevronDown,
  Calendar,
  Check,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { useSyncTodo } from "../hooks/useSyncTodo";
import { TimeRangePicker } from "./TimeRangePicker";
import type { SyncResult } from "../types/sync";
import type { TaskStatus } from "@/features/googleChat/types";

interface SyncTodoButtonProps {
  onSyncComplete?: (result: SyncResult) => void;
  className?: string;
}

/**
 * Get status indicator text for task status
 * **Feature: fe-update-v1, Property 4: Sync Status Display Consistency**
 */
const getStatusIndicator = (status: TaskStatus | "IDLE"): string => {
  switch (status) {
    case "IDLE":
      return "";
    case "PENDING":
    case "STARTED":
      return "Starting...";
    case "PROGRESS":
      return "Syncing...";
    case "SUCCESS":
      return "Completed";
    case "FAILURE":
      return "Failed";
    case "REVOKED":
      return "Cancelled";
    default:
      return "Unknown";
  }
};

/**
 * SyncTodoButton - Button component for syncing todos from Google Chat
 * Update v2: Modeless design - chip + drawer pattern for better UX
 */
export const SyncTodoButton = ({
  onSyncComplete,
  className = "",
}: SyncTodoButtonProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTimeRangePicker, setShowTimeRangePicker] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false); // Drawer for details

  const {
    isSyncing,
    syncProgress,
    syncError,
    lastSyncResult,
    lastSyncAt,
    taskStatus,
    taskProgress,
    syncTodos,
    syncTodosWithRange,
    cancelSync,
    getDefaultTimeRange,
    clearError,
  } = useSyncTodo();

  const handleQuickSync = useCallback(async () => {
    setShowDropdown(false);
    setShowResult(false);
    const result = await syncTodos();

    if (result.success && result.data) {
      setShowResult(true);
      onSyncComplete?.(result.data);

      // Auto-hide result after 5 seconds
      setTimeout(() => setShowResult(false), 5000);
    }
  }, [syncTodos, onSyncComplete]);

  const handleCustomRangeSync = useCallback(
    async (startDate: Date, endDate: Date) => {
      setShowResult(false);
      const result = await syncTodosWithRange({ startDate, endDate });

      if (result.success && result.data) {
        setShowResult(true);
        onSyncComplete?.(result.data);

        // Auto-hide result after 5 seconds
        setTimeout(() => setShowResult(false), 5000);
      }
    },
    [syncTodosWithRange, onSyncComplete]
  );

  const handleCancel = useCallback(async () => {
    await cancelSync();
  }, [cancelSync]);

  const openCustomRange = useCallback(() => {
    setShowDropdown(false);
    setShowTimeRangePicker(true);
  }, []);

  const formatLastSync = (timestamp: string | null): string => {
    if (!timestamp) return "Never synced";

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const defaultRange = getDefaultTimeRange();
  const statusText = getStatusIndicator(taskStatus);

  return (
    <div className={`relative ${className}`}>
      {/* Main Button - Terracotta themed split-button */}
      <div
        className="flex items-center"
        style={{ boxShadow: "0px 0px 1px #171a1f12, 0px 0px 2px #171a1f1F" }}
      >
        {/* Button 44: Main Sync section - 90px x 36px */}
        <button
          onClick={handleQuickSync}
          disabled={isSyncing}
          className="flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{
            width: "90px",
            height: "36px",
            backgroundColor: "#EA916EFF",
            color: "#FFFFFFFF",
            borderRadius: "6px 0px 0px 6px",
          }}
          onMouseEnter={(e) => {
            if (!isSyncing) e.currentTarget.style.backgroundColor = "#E5784CFF";
          }}
          onMouseLeave={(e) => {
            if (!isSyncing) e.currentTarget.style.backgroundColor = "#EA916EFF";
          }}
          onMouseDown={(e) => {
            if (!isSyncing) e.currentTarget.style.backgroundColor = "#E1602CFF";
          }}
          onMouseUp={(e) => {
            if (!isSyncing) e.currentTarget.style.backgroundColor = "#E5784CFF";
          }}
        >
          {isSyncing ? (
            <Loader2
              className="w-4 h-4 animate-spin"
              style={{ color: "#FFFFFFFF" }}
            />
          ) : (
            <RefreshCw className="w-4 h-4" style={{ color: "#FFFFFFFF" }} />
          )}
          <span className="text-sm font-medium" style={{ color: "#FFFFFFFF" }}>
            {isSyncing
              ? `${Math.round(taskProgress?.percent ?? syncProgress)}%`
              : "Sync"}
          </span>
        </button>

        {isSyncing ? (
          <button
            onClick={handleCancel}
            className="flex items-center justify-center transition-colors"
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#ef4444",
              color: "#FFFFFFFF",
              borderRadius: "0px 6px 6px 0px",
              borderLeft: "1px solid #dc2626",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#dc2626";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ef4444";
            }}
            title="Cancel sync"
          >
            <X className="w-4 h-4" style={{ color: "#FFFFFFFF" }} />
          </button>
        ) : (
          /* Button 45: Dropdown section - 36px x 36px */
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={isSyncing}
            className="flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#EA916EFF",
              color: "#FFFFFFFF",
              borderRadius: "0px 6px 6px 0px",
              borderLeft: "1px solid #E5784CFF",
            }}
            onMouseEnter={(e) => {
              if (!isSyncing)
                e.currentTarget.style.backgroundColor = "#E5784CFF";
            }}
            onMouseLeave={(e) => {
              if (!isSyncing)
                e.currentTarget.style.backgroundColor = "#EA916EFF";
            }}
            onMouseDown={(e) => {
              if (!isSyncing)
                e.currentTarget.style.backgroundColor = "#E1602CFF";
            }}
            onMouseUp={(e) => {
              if (!isSyncing)
                e.currentTarget.style.backgroundColor = "#E5784CFF";
            }}
          >
            <ChevronDown className="w-4 h-4" style={{ color: "#FFFFFFFF" }} />
          </button>
        )}
      </div>

      {/* Dropdown Menu - Enhanced UX with Light Theme */}
      {showDropdown && !isSyncing && (
        <div
          className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 
                      rounded-lg shadow-lg z-50"
        >
          <div className="p-2">
            <button
              onClick={handleQuickSync}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                       hover:bg-gray-50 transition-colors text-left"
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Sync latest messages
                </p>
                <p className="text-xs text-gray-500">
                  Fetch new messages since last sync
                </p>
              </div>
            </button>

            <button
              onClick={openCustomRange}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                       hover:bg-gray-50 transition-colors text-left"
            >
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Sync by time range
                </p>
                <p className="text-xs text-gray-500">
                  Choose a specific period to sync
                </p>
              </div>
            </button>
          </div>

          {lastSyncAt && (
            <div className="px-4 py-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Last synced:{" "}
                {new Date(lastSyncAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Progress Chip - REMOVED (Handled by GlobalSyncProgress) */}

      {/* Sync Drawer - Chi tiết, chỉ mở khi cần */}
      {isSyncing && showDrawer && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowDrawer(false)}
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">
                Sync Progress
              </h3>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* TẦNG 1: Primary Status */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-base font-medium text-gray-900">
                      Syncing messages...
                    </p>
                    <p className="text-sm text-gray-600">Google Chat & Gmail</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {Math.round(taskProgress?.percent ?? syncProgress)}%
                      complete
                    </span>
                    <span className="text-gray-500">
                      May take a few minutes
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500 ease-out"
                      style={{
                        width: `${taskProgress?.percent ?? syncProgress}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* TẦNG 2: Current Step */}
              <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  {taskProgress &&
                    taskProgress.percent < 25 &&
                    "Step 1 of 4: Scanning messages"}
                  {taskProgress &&
                    taskProgress.percent >= 25 &&
                    taskProgress.percent < 50 &&
                    "Step 2 of 4: Detecting tasks"}
                  {taskProgress &&
                    taskProgress.percent >= 50 &&
                    taskProgress.percent < 75 &&
                    "Step 3 of 4: Creating todos"}
                  {taskProgress &&
                    taskProgress.percent >= 75 &&
                    "Step 4 of 4: Finalizing"}
                  {!taskProgress && "Initializing..."}
                </p>
              </div>

              {/* TẦNG 3: Details (collapsible) */}
              {taskProgress && (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Details
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    {taskProgress.completed_spaces > 0 && (
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>
                          {taskProgress.completed_spaces} conversation
                          {taskProgress.completed_spaces > 1 ? "s" : ""}{" "}
                          processed
                        </span>
                      </div>
                    )}
                    {taskProgress.total_spaces && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {taskProgress.total_spaces} total conversations
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Stop Action */}
            <div className="p-4 border-t border-gray-200 space-y-3">
              <button
                onClick={handleCancel}
                className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-lg
                         hover:bg-gray-50 transition-colors"
              >
                Stop sync
              </button>
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                Created tasks will be kept. Review or delete later.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Enhanced Error Message - User-Friendly */}
      {syncError && !isSyncing && (
        <div className="fixed bottom-4 right-4 z-50 w-96">
          <div className="bg-white border border-red-200 rounded-lg shadow-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-700 leading-relaxed">
                  Sync interrupted
                </p>
                <p className="text-xs text-red-600 mt-1 leading-relaxed">
                  Some conversations may not have been processed
                </p>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={handleQuickSync}
                    className="text-xs text-red-700 hover:text-red-800 font-medium hover:underline"
                  >
                    Try again
                  </button>
                  <button
                    onClick={() => clearError()}
                    className="text-xs text-red-500 hover:text-red-600 hover:underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <button
                onClick={() => clearError()}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Success Result - Toast style */}
      {showResult && lastSyncResult && !syncError && !isSyncing && (
        <div className="fixed bottom-4 right-4 z-50 w-96">
          <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-700 leading-relaxed">
                  Sync completed successfully
                </p>
                <p className="text-xs text-green-600 mt-1 leading-relaxed">
                  {lastSyncResult.totalTodosSaved} tasks added to Queue
                </p>
                {lastSyncResult.totalTodosSaved > 0 && (
                  <button className="mt-3 text-xs text-green-700 hover:text-green-800 font-medium hover:underline">
                    Review now →
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowResult(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time Range Picker Modal */}
      <TimeRangePicker
        isOpen={showTimeRangePicker}
        onClose={() => setShowTimeRangePicker(false)}
        onConfirm={handleCustomRangeSync}
        defaultStartDate={defaultRange.startDate}
        defaultEndDate={defaultRange.endDate}
      />

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default SyncTodoButton;
