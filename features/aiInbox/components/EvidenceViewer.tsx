/**
 * EvidenceViewer Component
 * Displays evidence (quote and reason) for AI suggestion
 */

"use client";

import React from "react";
import type { Evidence } from "../types";

interface EvidenceViewerProps {
  evidence: Evidence;
  compact?: boolean;
}

export function EvidenceViewer({
  evidence,
  compact = false,
}: EvidenceViewerProps) {
  const { quote, reason } = evidence;

  if (!quote && !reason) {
    return (
      <div className="text-sm text-gray-500 italic">No evidence available</div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-1">
        {quote && (
          <div className="text-sm">
            <span className="text-gray-600">"{quote}"</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
      <div className="flex items-center gap-2">
        <span className="text-lg">💡</span>
        <h4 className="font-semibold text-gray-900">Evidence</h4>
      </div>

      {quote && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-500 uppercase">
            Quote
          </div>
          <blockquote className="pl-3 border-l-3 border-blue-500 text-sm text-gray-700 italic">
            "{quote}"
          </blockquote>
        </div>
      )}

      {reason && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-500 uppercase">
            AI Reasoning
          </div>
          <p className="text-sm text-gray-700">{reason}</p>
        </div>
      )}
    </div>
  );
}
