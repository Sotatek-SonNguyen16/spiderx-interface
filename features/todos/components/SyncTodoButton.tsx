"use client";

import { useState, useCallback } from "react";
import { RefreshCw, ChevronDown, Calendar, Check, AlertCircle, X, Loader2 } from "lucide-react";
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
 * Update v1: Supports async task flow with progress indicator and cancel
 */
export const SyncTodoButton = ({ onSyncComplete, className = "" }: SyncTodoButtonProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTimeRangePicker, setShowTimeRangePicker] = useState(false);
  const [showResult, setShowResult] = useState(false);

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

  const handleCustomRangeSync = useCallback(async (startDate: Date, endDate: Date) => {
    setShowResult(false);
    const result = await syncTodosWithRange({ startDate, endDate });
    
    if (result.success && result.data) {
      setShowResult(true);
      onSyncComplete?.(result.data);
      
      // Auto-hide result after 5 seconds
      setTimeout(() => setShowResult(false), 5000);
    }
  }, [syncTodosWithRange, onSyncComplete]);

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
        style={{ boxShadow: '0px 0px 1px #171a1f12, 0px 0px 2px #171a1f1F' }}
      >
        {/* Button 44: Main Sync section - 90px x 36px */}
        <button
          onClick={handleQuickSync}
          disabled={isSyncing}
          className="flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{
            width: '90px',
            height: '36px',
            backgroundColor: '#EA916EFF',
            color: '#FFFFFFFF',
            borderRadius: '6px 0px 0px 6px',
          }}
          onMouseEnter={(e) => { if (!isSyncing) e.currentTarget.style.backgroundColor = '#E5784CFF'; }}
          onMouseLeave={(e) => { if (!isSyncing) e.currentTarget.style.backgroundColor = '#EA916EFF'; }}
          onMouseDown={(e) => { if (!isSyncing) e.currentTarget.style.backgroundColor = '#E1602CFF'; }}
          onMouseUp={(e) => { if (!isSyncing) e.currentTarget.style.backgroundColor = '#E5784CFF'; }}
        >
          {isSyncing ? (
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#FFFFFFFF' }} />
          ) : (
            <RefreshCw className="w-4 h-4" style={{ color: '#FFFFFFFF' }} />
          )}
          <span className="text-sm font-medium" style={{ color: '#FFFFFFFF' }}>
            {isSyncing ? statusText || "Syncing..." : "Sync"}
          </span>
        </button>
        
        {isSyncing ? (
          <button
            onClick={handleCancel}
            className="flex items-center justify-center transition-colors"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#ef4444',
              color: '#FFFFFFFF',
              borderRadius: '0px 6px 6px 0px',
              borderLeft: '1px solid #dc2626',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; }}
            title="Cancel sync"
          >
            <X className="w-4 h-4" style={{ color: '#FFFFFFFF' }} />
          </button>
        ) : (
          /* Button 45: Dropdown section - 36px x 36px */
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={isSyncing}
            className="flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#EA916EFF',
              color: '#FFFFFFFF',
              borderRadius: '0px 6px 6px 0px',
              borderLeft: '1px solid #E5784CFF',
            }}
            onMouseEnter={(e) => { if (!isSyncing) e.currentTarget.style.backgroundColor = '#E5784CFF'; }}
            onMouseLeave={(e) => { if (!isSyncing) e.currentTarget.style.backgroundColor = '#EA916EFF'; }}
            onMouseDown={(e) => { if (!isSyncing) e.currentTarget.style.backgroundColor = '#E1602CFF'; }}
            onMouseUp={(e) => { if (!isSyncing) e.currentTarget.style.backgroundColor = '#E5784CFF'; }}
          >
            <ChevronDown className="w-4 h-4" style={{ color: '#FFFFFFFF' }} />
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {showDropdown && !isSyncing && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-white dark:bg-gray-800 
                      rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <div className="p-2">
            <button
              onClick={handleQuickSync}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Sync Now
                </p>
                <p className="text-xs text-gray-500">
                  From {formatLastSync(lastSyncAt)} to now
                </p>
              </div>
            </button>
            
            <button
              onClick={openCustomRange}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Sync by Time Range
                </p>
                <p className="text-xs text-gray-500">
                  Fetch messages from a specific period
                </p>
              </div>
            </button>
          </div>
          
          {lastSyncAt && (
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500">
                Last synced: {new Date(lastSyncAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}


      {/* Sync Progress - Update v1: Enhanced progress display */}
      {isSyncing && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 
                      border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {statusText}
            </span>
            {taskProgress && (
              <span className="text-xs text-blue-600 dark:text-blue-400">
                {taskProgress.completed_spaces}/{taskProgress.total_spaces} spaces
              </span>
            )}
          </div>
          <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${taskProgress?.percent ?? syncProgress}%` }}
            />
          </div>
          {taskProgress?.progress && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {taskProgress.progress}
            </p>
          )}
        </div>
      )}

      {/* Error Message */}
      {syncError && !isSyncing && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 dark:bg-red-900/20 
                      border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700 dark:text-red-300">{syncError}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleQuickSync}
                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                >
                  Retry
                </button>
                <button
                  onClick={clearError}
                  className="text-xs text-red-500 hover:underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Result - Update v1: Enhanced summary display */}
      {showResult && lastSyncResult && !syncError && !isSyncing && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-green-50 dark:bg-green-900/20 
                      border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Sync Complete
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {lastSyncResult.totalMessagesProcessed} messages processed, {" "}
                {lastSyncResult.totalTodosGenerated} todos found, {" "}
                {lastSyncResult.totalTodosSaved} saved
              </p>
              {lastSyncResult.processedSpaces && lastSyncResult.processedSpaces.length > 0 && (
                <p className="text-xs text-green-500 dark:text-green-500 mt-1">
                  Spaces: {lastSyncResult.processedSpaces.join(", ")}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowResult(false)}
              className="text-green-500 hover:text-green-700"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
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
          className="fixed inset-0 z-0" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default SyncTodoButton;
