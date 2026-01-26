/**
 * AiInboxList Component
 * Main list view for AI Inbox suggestions
 */

"use client";

import React from "react";
import { useAiInbox } from "../hooks/useAiInbox";
import { SuggestionCard } from "./SuggestionCard";
import { SuggestionFilters } from "./SuggestionFilters";
import { SortControls } from "./SortControls";
import { BulkActions } from "./BulkActions";

export function AiInboxList() {
  const {
    suggestions,
    selectedSuggestionIds,
    selectedCount,
    filters,
    sort,
    total,
    loading,
    error,
    hasMore,
    pendingCount,
    loadMore,
    refresh,
    toggleSelection,
    setFilters,
    setSort,
    resetFilters,
  } = useAiInbox();

  // Empty state
  if (!loading && suggestions.length === 0 && filters.status === "all") {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16 space-y-4">
          <div className="text-6xl">📭</div>
          <h2 className="text-2xl font-bold text-gray-900">
            No Suggestions Yet
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Extract tasks from Google Chat or text to see AI suggestions here.
            You'll be able to review and accept them before they become todos.
          </p>
        </div>
      </div>
    );
  }

  // No results for current filters
  if (!loading && suggestions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <SuggestionFilters
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
        />
        <div className="text-center py-16 space-y-4">
          <div className="text-6xl">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900">No Results Found</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Try adjusting your filters or search query.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Inbox</h1>
          <p className="text-gray-600 mt-1">
            Review and manage AI-suggested tasks
          </p>
        </div>

        <div className="flex items-center gap-4">
          {pendingCount > 0 && (
            <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium">
              {pendingCount} pending
            </div>
          )}
          <button
            onClick={refresh}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Refreshing..." : "🔄 Refresh"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-2xl font-bold text-gray-900">{total}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {pendingCount}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Currently Showing</div>
          <div className="text-2xl font-bold text-gray-900">
            {suggestions.length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Selected</div>
          <div className="text-2xl font-bold text-blue-600">
            {selectedCount}
          </div>
        </div>
      </div>

      {/* Filters */}
      <SuggestionFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
      />

      {/* Sort and Bulk Actions */}
      <div className="flex items-center justify-between">
        <SortControls sort={sort} onSortChange={setSort} />
        {selectedCount > 0 && (
          <div className="text-sm text-gray-600">
            {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      <BulkActions />

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          ⚠️ {error}
        </div>
      )}

      {/* Suggestions List */}
      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.suggestion_id}
            suggestion={suggestion}
            isSelected={selectedSuggestionIds.has(suggestion.suggestion_id)}
            onSelect={() => toggleSelection(suggestion.suggestion_id)}
            showCheckbox={true}
          />
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading suggestions...</p>
        </div>
      )}

      {/* Load More */}
      {!loading && hasMore && (
        <div className="text-center py-4">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Load More
          </button>
        </div>
      )}

      {/* End of list */}
      {!loading && !hasMore && suggestions.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          — End of list —
        </div>
      )}
    </div>
  );
}
