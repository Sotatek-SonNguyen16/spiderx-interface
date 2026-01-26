/**
 * AI Inbox Service
 * Business logic for AI Inbox feature
 */

import type {
  TodoSuggestion,
  SuggestionWithConfidenceLevel,
  SuggestionFilters,
  SortOptions,
  SuggestionStats,
} from "../types";
import { ReviewStatus, ConfidenceLevel } from "../types";

/**
 * Calculate confidence level from confidence score
 * High: > 0.85
 * Medium: 0.6 - 0.85
 * Low: < 0.6
 */
export function getConfidenceLevel(confidence: number | null): ConfidenceLevel {
  if (confidence === null) return ConfidenceLevel.LOW;
  if (confidence > 0.85) return ConfidenceLevel.HIGH;
  if (confidence >= 0.6) return ConfidenceLevel.MEDIUM;
  return ConfidenceLevel.LOW;
}

/**
 * Enrich suggestion with confidence level
 */
export function enrichSuggestionWithConfidenceLevel(
  suggestion: TodoSuggestion
): SuggestionWithConfidenceLevel {
  return {
    ...suggestion,
    confidenceLevel: getConfidenceLevel(suggestion.ai_confidence),
  };
}

/**
 * Enrich multiple suggestions
 */
export function enrichSuggestions(
  suggestions: TodoSuggestion[]
): SuggestionWithConfidenceLevel[] {
  return suggestions.map(enrichSuggestionWithConfidenceLevel);
}

/**
 * Filter suggestions based on filters
 */
export function filterSuggestions(
  suggestions: SuggestionWithConfidenceLevel[],
  filters: SuggestionFilters
): SuggestionWithConfidenceLevel[] {
  return suggestions.filter((suggestion) => {
    // Status filter
    if (
      filters.status !== "all" &&
      suggestion.review_status !== filters.status
    ) {
      return false;
    }

    // Context filter
    if (filters.context_id && suggestion.context_id !== filters.context_id) {
      return false;
    }

    // Source type filter - would need to be added to suggestion type if needed
    // if (filters.source_type && suggestion.source_type !== filters.source_type) {
    //   return false;
    // }

    // Confidence level filter
    if (
      filters.confidence_level &&
      suggestion.confidenceLevel !== filters.confidence_level
    ) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchTitle = suggestion.title.toLowerCase().includes(searchLower);
      const matchDescription = suggestion.description
        ?.toLowerCase()
        .includes(searchLower);
      const matchTags = suggestion.tags.some((tag) =>
        tag.toLowerCase().includes(searchLower)
      );

      if (!matchTitle && !matchDescription && !matchTags) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort suggestions based on sort options
 */
export function sortSuggestions(
  suggestions: SuggestionWithConfidenceLevel[],
  sort: SortOptions
): SuggestionWithConfidenceLevel[] {
  const sorted = [...suggestions];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sort.field) {
      case "confidence":
        comparison = (a.ai_confidence || 0) - (b.ai_confidence || 0);
        break;
      case "due_date":
        const aDate = a.due_date ? new Date(a.due_date).getTime() : 0;
        const bDate = b.due_date ? new Date(b.due_date).getTime() : 0;
        comparison = aDate - bDate;
        break;
      case "created_at":
        comparison =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
    }

    return sort.order === "asc" ? comparison : -comparison;
  });

  return sorted;
}

/**
 * Format evidence for display
 */
export function formatEvidence(suggestion: TodoSuggestion): {
  quote: string;
  reason: string;
  hasEvidence: boolean;
} {
  const { evidence } = suggestion;

  return {
    quote: evidence.quote || "No quote available",
    reason: evidence.reason || "No reason provided",
    hasEvidence: Boolean(evidence.quote || evidence.reason),
  };
}

/**
 * Get quality flag display info
 */
export function getQualityFlagInfo(flag: string): {
  label: string;
  severity: "warning" | "error" | "info";
  icon: string;
} {
  const flagMap: Record<
    string,
    { label: string; severity: "warning" | "error" | "info"; icon: string }
  > = {
    missing_deadline: {
      label: "Missing Deadline",
      severity: "warning",
      icon: "⏰",
    },
    missing_assignee: {
      label: "Missing Assignee",
      severity: "info",
      icon: "👤",
    },
    ambiguous_content: {
      label: "Unclear Content",
      severity: "warning",
      icon: "❓",
    },
    low_confidence: {
      label: "Low Confidence",
      severity: "error",
      icon: "⚠️",
    },
    duplicate_possible: {
      label: "Possible Duplicate",
      severity: "warning",
      icon: "🔄",
    },
  };

  return (
    flagMap[flag] || {
      label: flag,
      severity: "info",
      icon: "ℹ️",
    }
  );
}

/**
 * Calculate suggestion statistics
 */
export function calculateStats(
  suggestions: SuggestionWithConfidenceLevel[]
): SuggestionStats {
  return {
    total: suggestions.length,
    pending: suggestions.filter((s) => s.review_status === ReviewStatus.PENDING)
      .length,
    accepted: suggestions.filter(
      (s) => s.review_status === ReviewStatus.ACCEPTED
    ).length,
    rejected: suggestions.filter(
      (s) => s.review_status === ReviewStatus.REJECTED
    ).length,
    high_confidence: suggestions.filter(
      (s) => s.confidenceLevel === ConfidenceLevel.HIGH
    ).length,
    medium_confidence: suggestions.filter(
      (s) => s.confidenceLevel === ConfidenceLevel.MEDIUM
    ).length,
    low_confidence: suggestions.filter(
      (s) => s.confidenceLevel === ConfidenceLevel.LOW
    ).length,
  };
}

/**
 * Check if suggestion needs review (has quality flags or low confidence)
 */
export function needsReview(
  suggestion: SuggestionWithConfidenceLevel
): boolean {
  return (
    suggestion.quality_flags.length > 0 ||
    suggestion.confidenceLevel === ConfidenceLevel.LOW
  );
}

/**
 * Get priority color
 */
export function getPriorityColor(
  priority: "low" | "medium" | "high" | "urgent"
): string {
  const colorMap = {
    low: "#10b981", // green
    medium: "#3b82f6", // blue
    high: "#f59e0b", // orange
    urgent: "#ef4444", // red
  };
  return colorMap[priority];
}

/**
 * Get confidence color
 */
export function getConfidenceColor(level: ConfidenceLevel): string {
  const colorMap = {
    [ConfidenceLevel.HIGH]: "#10b981", // green
    [ConfidenceLevel.MEDIUM]: "#f59e0b", // orange
    [ConfidenceLevel.LOW]: "#ef4444", // red
  };
  return colorMap[level];
}
