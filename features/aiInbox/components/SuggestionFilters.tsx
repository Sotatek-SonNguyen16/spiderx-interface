/**
 * SuggestionFilters Component
 * Filters and search controls for suggestions list
 */

"use client";

import React from "react";
import type { SuggestionFilters as Filters, ReviewStatus } from "../types";

interface SuggestionFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Partial<Filters>) => void;
  onReset: () => void;
}

export function SuggestionFilters({
  filters,
  onFiltersChange,
  onReset,
}: SuggestionFiltersProps) {
  const statusOptions: Array<{ value: string; label: string }> = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
  ];

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.context_id ||
    filters.source_type ||
    filters.confidence_level ||
    filters.search;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          placeholder="Search suggestions..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() =>
              onFiltersChange({ status: option.value as ReviewStatus | "all" })
            }
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filters.status === option.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Confidence Level Filter */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Confidence
          </label>
          <select
            value={filters.confidence_level || ""}
            onChange={(e) =>
              onFiltersChange({
                confidence_level: e.target.value || null,
              } as any)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Levels</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Source Type Filter */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Source
          </label>
          <select
            value={filters.source_type || ""}
            onChange={(e) =>
              onFiltersChange({
                source_type: e.target.value || null,
              } as any)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Sources</option>
            <option value="chat">Chat</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              Search: "{filters.search}"
              <button
                onClick={() => onFiltersChange({ search: "" })}
                className="hover:text-blue-900"
              >
                ✕
              </button>
            </span>
          )}
          {filters.status !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              Status: {filters.status}
              <button
                onClick={() => onFiltersChange({ status: "all" })}
                className="hover:text-blue-900"
              >
                ✕
              </button>
            </span>
          )}
          {filters.confidence_level && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              Confidence: {filters.confidence_level}
              <button
                onClick={() => onFiltersChange({ confidence_level: null })}
                className="hover:text-blue-900"
              >
                ✕
              </button>
            </span>
          )}
          {filters.source_type && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              Source: {filters.source_type}
              <button
                onClick={() => onFiltersChange({ source_type: null })}
                className="hover:text-blue-900"
              >
                ✕
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
