/**
 * useAiInbox Hook
 * Main hook for AI Inbox functionality
 */

"use client";

import { useEffect } from "react";
import { useAiInboxStore } from "../stores/aiInbox.store";

export function useAiInbox() {
  const {
    suggestions,
    selectedSuggestionIds,
    filters,
    sort,
    loading,
    error,
    total,
    hasMore,
    accepting,
    rejecting,
    updating,

    loadSuggestions,
    refreshSuggestions,
    toggleSelection,
    selectAll,
    clearSelection,
    setFilters,
    setSort,
    resetFilters,
    acceptSuggestion,
    rejectSuggestion,
    updateSuggestion,
    bulkAccept,
    bulkReject,
    getFilteredSuggestions,
    getPendingCount,
  } = useAiInboxStore();

  // Load suggestions on mount
  useEffect(() => {
    loadSuggestions({ reset: true });
  }, []); // Only on mount

  return {
    // Data
    suggestions,
    selectedSuggestionIds,
    selectedCount: selectedSuggestionIds.size,
    filters,
    sort,
    total,
    hasMore,
    pendingCount: getPendingCount(),

    // Loading states
    loading,
    error,
    isAccepting: (id: string) => accepting.has(id),
    isRejecting: (id: string) => rejecting.has(id),
    isUpdating: (id: string) => updating.has(id),

    // Actions
    loadMore: () => loadSuggestions({ reset: false }),
    refresh: refreshSuggestions,
    toggleSelection,
    selectAll,
    clearSelection,
    setFilters,
    setSort,
    resetFilters,
    acceptSuggestion,
    rejectSuggestion,
    updateSuggestion,
    bulkAccept,
    bulkReject,
  };
}
