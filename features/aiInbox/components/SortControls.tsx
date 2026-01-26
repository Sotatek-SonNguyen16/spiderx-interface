/**
 * SortControls Component
 * Sort dropdown for suggestions list
 */

"use client";

import React from "react";
import type { SortOptions } from "../types";

interface SortControlsProps {
  sort: SortOptions;
  onSortChange: (sort: SortOptions) => void;
}

export function SortControls({ sort, onSortChange }: SortControlsProps) {
  const sortOptions = [
    { field: "created_at", label: "Created Date" },
    { field: "confidence", label: "Confidence" },
    { field: "due_date", label: "Due Date" },
  ] as const;

  const handleFieldChange = (field: SortOptions["field"]) => {
    onSortChange({ ...sort, field });
  };

  const toggleOrder = () => {
    onSortChange({
      ...sort,
      order: sort.order === "asc" ? "desc" : "asc",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Sort by:</span>

      <select
        value={sort.field}
        onChange={(e) => handleFieldChange(e.target.value as any)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        {sortOptions.map((option) => (
          <option key={option.field} value={option.field}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        onClick={toggleOrder}
        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        title={sort.order === "asc" ? "Ascending" : "Descending"}
      >
        {sort.order === "asc" ? "↑" : "↓"}
      </button>
    </div>
  );
}
