"use client";

import { useState, useCallback, useMemo } from "react";
import type { Todo } from "../types";
import type { ConnectedThread, ThreadFilterState } from "../types/thread";

/**
 * Helper to normalize space ID by removing "spaces/" prefix if present
 * Google Chat API may return IDs as "spaces/ABC123" or just "ABC123"
 */
const normalizeSpaceId = (id: string | null | undefined): string | null => {
  if (!id) return null;
  // Remove "spaces/" prefix if present
  return id.startsWith("spaces/") ? id.substring(7) : id;
};

/**
 * Hook for filtering todos by connected Chat Thread (multi-select)
 * **Feature: fe-update-v1, Requirements 1.2, 1.3, 1.5**
 */
export const useThreadFilter = (todos: Todo[], threads: ConnectedThread[]) => {
  // Support multi-select with array of thread IDs
  const [selectedThreadIds, setSelectedThreadIds] = useState<string[]>([]);

  // Build lookup maps for matching todos to threads
  // We need to match by: normalized ID, normalized name, or displayName
  const threadLookup = useMemo(() => {
    const byNormalizedId: Record<string, string> = {};
    const byName: Record<string, string> = {};

    threads.forEach((thread) => {
      // Map normalized ID -> original thread ID
      const normalizedId = normalizeSpaceId(thread.id);
      if (normalizedId) {
        byNormalizedId[normalizedId] = thread.id;
      }

      // Also map by normalized name (in case name is "spaces/xxx" format)
      if (thread.name) {
        const normalizedName = normalizeSpaceId(thread.name);
        if (normalizedName) {
          byNormalizedId[normalizedName] = thread.id;
        }
        // Also map by name as-is (case-insensitive)
        byName[thread.name.toLowerCase()] = thread.id;
      }

      // Also map by displayName (case-insensitive)
      if (thread.displayName) {
        byName[thread.displayName.toLowerCase()] = thread.id;
      }
    });

    return { byNormalizedId, byName };
  }, [threads]);

  /**
   * Find the thread ID that matches a todo's source
   * Tries to match by: sourceSpaceId (normalized), sourceSpaceName
   */
  const findMatchingThreadId = useCallback((todo: Todo): string | null => {
    // Try matching by normalized sourceSpaceId
    const normalizedSourceId = normalizeSpaceId(todo.sourceSpaceId);
    if (normalizedSourceId && threadLookup.byNormalizedId[normalizedSourceId]) {
      return threadLookup.byNormalizedId[normalizedSourceId];
    }

    // Try matching sourceSpaceId directly (in case it's already normalized differently)
    if (todo.sourceSpaceId && threadLookup.byNormalizedId[todo.sourceSpaceId]) {
      return threadLookup.byNormalizedId[todo.sourceSpaceId];
    }

    // Try matching by sourceSpaceName (case-insensitive)
    if (todo.sourceSpaceName) {
      const lowerName = todo.sourceSpaceName.toLowerCase();
      if (threadLookup.byName[lowerName]) {
        return threadLookup.byName[lowerName];
      }
      // Also try normalized sourceSpaceName
      const normalizedSourceName = normalizeSpaceId(todo.sourceSpaceName);
      if (normalizedSourceName && threadLookup.byNormalizedId[normalizedSourceName]) {
        return threadLookup.byNormalizedId[normalizedSourceName];
      }
    }

    return null;
  }, [threadLookup]);

  /**
   * Filter todos by selected threads (multi-select)
   * **Property 1: Thread Filter Correctness**
   * For any selected thread IDs, all displayed todos SHALL have sourceSpaceId matching one of the selected thread IDs
   */
  const filteredTodos = useMemo(() => {
    // Debug: Log thread IDs and todo sourceSpaceIds
    console.log("🔍 [ThreadFilter] Threads:", threads.map(t => ({
      id: t.id,
      normalizedId: normalizeSpaceId(t.id),
      name: t.name,
      displayName: t.displayName
    })));
    console.log("🔍 [ThreadFilter] Selected thread IDs:", selectedThreadIds);
    console.log("🔍 [ThreadFilter] Todos:", todos.map(t => ({
      id: t.id,
      title: t.title,
      sourceSpaceId: t.sourceSpaceId,
      sourceSpaceName: t.sourceSpaceName,
      matchingThreadId: findMatchingThreadId(t)
    })));

    if (selectedThreadIds.length === 0) {
      // **Property 2: Thread Filter Clear**
      // When no filter is applied, return all todos
      return todos;
    }

    // Create set of selected thread IDs for fast lookup
    const selectedSet = new Set(selectedThreadIds);

    const filtered = todos.filter((todo) => {
      const matchingThreadId = findMatchingThreadId(todo);
      return matchingThreadId && selectedSet.has(matchingThreadId);
    });

    console.log("🔍 [ThreadFilter] Filtered todos count:", filtered.length);
    return filtered;
  }, [todos, selectedThreadIds, threads, findMatchingThreadId]);

  /**
   * Calculate todo counts per thread
   * **Property 3: Thread Todo Count Accuracy**
   * The count SHALL equal the actual count of todos with sourceSpaceId matching that thread's ID
   */
  const todoCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    // Initialize counts for all threads (using original thread.id as key)
    threads.forEach((thread) => {
      counts[thread.id] = 0;
    });

    // Count todos per thread using the same matching logic as filtering
    todos.forEach((todo) => {
      const matchingThreadId = findMatchingThreadId(todo);
      if (matchingThreadId && counts[matchingThreadId] !== undefined) {
        counts[matchingThreadId]++;
      }
    });

    return counts;
  }, [todos, threads, findMatchingThreadId]);

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
