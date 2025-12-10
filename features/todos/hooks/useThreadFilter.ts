"use client";

import { useState, useCallback, useMemo } from "react";
import type { Todo } from "../types";
import type { ConnectedThread, ThreadFilterState } from "../types/thread";

/**
 * Hook for filtering todos by connected Chat Thread (multi-select)
 * **Feature: fe-update-v1, Requirements 1.2, 1.3, 1.5**
 */
export const useThreadFilter = (todos: Todo[], threads: ConnectedThread[]) => {
  // Support multi-select with array of thread IDs
  const [selectedThreadIds, setSelectedThreadIds] = useState<string[]>([]);

  /**
   * Filter todos by selected threads (multi-select)
   * **Property 1: Thread Filter Correctness**
   * For any selected thread IDs, all displayed todos SHALL have sourceSpaceId matching one of the selected thread IDs
   */
  const filteredTodos = useMemo(() => {
    if (selectedThreadIds.length === 0) {
      // **Property 2: Thread Filter Clear**
      // When no filter is applied, return all todos
      return todos;
    }
    const selectedSet = new Set(selectedThreadIds);
    return todos.filter((todo) => todo.sourceSpaceId && selectedSet.has(todo.sourceSpaceId));
  }, [todos, selectedThreadIds]);

  /**
   * Calculate todo counts per thread
   * **Property 3: Thread Todo Count Accuracy**
   * The count SHALL equal the actual count of todos with sourceSpaceId matching that thread's ID
   */
  const todoCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    // Initialize counts for all threads
    threads.forEach((thread) => {
      counts[thread.id] = 0;
    });

    // Count todos per thread
    todos.forEach((todo) => {
      if (todo.sourceSpaceId && counts[todo.sourceSpaceId] !== undefined) {
        counts[todo.sourceSpaceId]++;
      }
    });

    return counts;
  }, [todos, threads]);

  /**
   * Total count of all todos
   */
  const totalTodoCount = useMemo(() => todos.length, [todos]);

  /**
   * Toggle a thread selection (add/remove from selected list)
   */
  const toggleThread = useCallback((threadId: string) => {
    setSelectedThreadIds((prev) => {
      if (prev.includes(threadId)) {
        return prev.filter((id) => id !== threadId);
      }
      return [...prev, threadId];
    });
  }, []);

  /**
   * Select a single thread (for backward compatibility)
   */
  const selectThread = useCallback((threadId: string | null) => {
    if (threadId === null) {
      setSelectedThreadIds([]);
    } else {
      setSelectedThreadIds([threadId]);
    }
  }, []);

  /**
   * Clear the thread filter (show all todos)
   */
  const clearSelection = useCallback(() => {
    setSelectedThreadIds([]);
  }, []);

  /**
   * Check if a specific thread is selected
   */
  const isThreadSelected = useCallback(
    (threadId: string) => selectedThreadIds.includes(threadId),
    [selectedThreadIds]
  );

  return {
    // State
    selectedThreadIds,
    selectedThreadId: selectedThreadIds[0] || null, // backward compatibility
    filteredTodos,
    todoCounts,
    totalTodoCount,

    // Actions
    toggleThread,
    selectThread,
    clearSelection,
    clearFilter: clearSelection, // alias for backward compatibility
    isThreadSelected,
  };
};
