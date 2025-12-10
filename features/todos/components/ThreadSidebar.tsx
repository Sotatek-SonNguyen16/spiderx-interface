"use client";

import { MessageSquare, Link2 } from "lucide-react";
import type { ThreadSidebarProps } from "../types/thread";

/**
 * ThreadSidebar - Displays connected Chat Threads with todo counts
 * **Feature: fe-update-v1, Requirements 1.1, 1.2, 1.3, 1.4, 1.5**
 */
export const ThreadSidebar = ({
  threads,
  selectedThreadId,
  onThreadSelect,
  todoCounts,
  loading = false,
}: ThreadSidebarProps) => {
  // Calculate total todos across all threads
  const totalTodos = Object.values(todoCounts).reduce((sum, count) => sum + count, 0);

  // Skeleton loader
  if (loading) {
    return (
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              </div>
              <div className="w-6 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state - no threads connected
  if (threads.length === 0) {
    return (
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Chat Threads
        </h3>
        <div className="text-center py-8">
          <Link2 className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            No threads connected
          </p>
          <a
            href="/integration"
            className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
          >
            Connect Google Chat
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Chat Threads
        </h3>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* All Threads option */}
        <button
          onClick={() => onThreadSelect(null)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            selectedThreadId === null
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
            selectedThreadId === null
              ? "bg-blue-100 dark:bg-blue-800"
              : "bg-gray-100 dark:bg-gray-700"
          }`}>
            <MessageSquare className={`w-4 h-4 ${
              selectedThreadId === null ? "text-blue-600" : "text-gray-500"
            }`} />
          </div>
          <span className="flex-1 text-left text-sm font-medium truncate">
            All Threads
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            selectedThreadId === null
              ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}>
            {totalTodos}
          </span>
        </button>

        {/* Individual threads */}
        <div className="mt-1 space-y-1">
          {threads.map((thread) => {
            const isSelected = selectedThreadId === thread.id;
            const count = todoCounts[thread.id] || 0;

            return (
              <button
                key={thread.id}
                onClick={() => onThreadSelect(thread.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                  isSelected
                    ? "bg-blue-100 dark:bg-blue-800"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}>
                  <MessageSquare className={`w-4 h-4 ${
                    isSelected ? "text-blue-600" : "text-gray-500"
                  }`} />
                </div>
                <span className="flex-1 text-left text-sm font-medium truncate">
                  {thread.displayName || thread.name}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isSelected
                    ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThreadSidebar;
