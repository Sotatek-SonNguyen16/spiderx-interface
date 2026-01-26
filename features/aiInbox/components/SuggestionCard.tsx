/**
 * SuggestionCard Component
 * Displays an individual AI suggestion with all details and actions
 */

"use client";

import React, { useState } from "react";
import type { SuggestionWithConfidenceLevel } from "../types";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { EvidenceViewer } from "./EvidenceViewer";
import { QualityFlags } from "./QualityFlags";
import { SuggestionActions } from "./SuggestionActions";
import { getPriorityColor } from "../services/aiInbox.service";

interface SuggestionCardProps {
  suggestion: SuggestionWithConfidenceLevel;
  isSelected?: boolean;
  onSelect?: () => void;
  showCheckbox?: boolean;
}

export function SuggestionCard({
  suggestion,
  isSelected = false,
  onSelect,
  showCheckbox = false,
}: SuggestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  const priorityColor = getPriorityColor(suggestion.priority);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`bg-white rounded-lg border-2 transition-all ${
        isSelected
          ? "border-blue-500 shadow-md"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Header */}
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          {showCheckbox && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          )}

          <div className="flex-1 space-y-2">
            {/* Title and Priority */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold text-gray-900 flex-1">
                {suggestion.title}
              </h3>
              <div
                className="text-xs font-bold px-2 py-1 rounded uppercase"
                style={{
                  backgroundColor: `${priorityColor}15`,
                  color: priorityColor,
                }}
              >
                {suggestion.priority}
              </div>
            </div>

            {/* Description */}
            {suggestion.description && (
              <p className="text-sm text-gray-600">{suggestion.description}</p>
            )}

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <ConfidenceBadge
                confidence={suggestion.ai_confidence}
                size="sm"
              />

              {suggestion.due_date && (
                <div className="flex items-center gap-1 text-gray-600">
                  <span>📅</span>
                  <span>{formatDate(suggestion.due_date)}</span>
                </div>
              )}

              {suggestion.assignee && (
                <div className="flex items-center gap-1 text-gray-600">
                  <span>👤</span>
                  <span>{suggestion.assignee}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {suggestion.tags && suggestion.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {suggestion.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quality Flags */}
            {suggestion.quality_flags.length > 0 && (
              <QualityFlags flags={suggestion.quality_flags} />
            )}

            {/* Compact Evidence */}
            {suggestion.evidence && !expanded && (
              <EvidenceViewer evidence={suggestion.evidence} compact />
            )}
          </div>
        </div>

        {/* Actions */}
        <SuggestionActions suggestion={suggestion} />
      </div>

      {/* Expandable Details */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-200 pt-4">
          <EvidenceViewer evidence={suggestion.evidence} />

          {suggestion.follow_up_questions &&
            suggestion.follow_up_questions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  Follow-up Questions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {suggestion.follow_up_questions.map((question, idx) => (
                    <button
                      key={idx}
                      className="text-sm px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

          <div className="text-xs text-gray-500">
            Created: {formatDate(suggestion.created_at)}
          </div>
        </div>
      )}

      {/* Toggle Details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 border-t border-gray-200 transition-colors"
      >
        {expanded ? "Show Less ▲" : "Show More ▼"}
      </button>
    </div>
  );
}
