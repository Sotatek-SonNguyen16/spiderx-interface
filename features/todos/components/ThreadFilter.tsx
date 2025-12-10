"use client";

import { useState } from "react";
import { ChevronDown, MessageSquare, Check } from "lucide-react";
import type { ConnectedThread } from "../types/thread";

interface ThreadFilterProps {
  threads: ConnectedThread[];
  selectedThreadId: string | null;
  onThreadSelect: (threadId: string | null) => void;
  todoCounts: Record<string, number>;
  totalCount: number;
  loading?: boolean;
}

/**
 * ThreadFilter - Dropdown component for filtering todos by Chat Thread
 * **Feature: fe-update-v1, Requirements 1.1, 1.2**
 */
export const ThreadFilter = ({
  threads,
  selectedThreadId,
  onThreadSelect,
  todoCounts,
  totalCount,
  loading = false,
}: ThreadFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedThread = threads.find((t) => t.id === selectedThreadId);
  const displayName = selectedThread
    ? selectedThread.displayName || selectedThread.name
    : "All Threads";

  if (loading) {
    return (
      <div className="h-9 w-40 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
    );
  }

  // Don't show filter if no threads
  if (threads.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 
                 border border-gray-200 dark:border-gray-700 rounded-lg
                 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <MessageSquare className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
          {displayName}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 
                        rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="p-2 max-h-80 overflow-y-auto">
              {/* All Threads option */}
              <button
                onClick={() => {
                  onThreadSelect(null);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedThreadId === null
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <span className="flex-1 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  All Threads
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {totalCount}
                </span>
                {selectedThreadId === null && (
                  <Check className="w-4 h-4 text-blue-500" />
                )}
              </button>

              {/* Divider */}
              <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

              {/* Thread list */}
              {threads.map((thread) => {
                const isSelected = selectedThreadId === thread.id;
                const count = todoCounts[thread.id] || 0;

                return (
                  <button
                    key={thread.id}
                    onClick={() => {
                      onThreadSelect(thread.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span className="flex-1 text-left text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {thread.displayName || thread.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {count}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThreadFilter;
