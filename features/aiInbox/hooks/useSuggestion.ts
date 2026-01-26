/**
 * useSuggestion Hook
 * Hook for individual suggestion operations
 */

"use client";

import { useState } from "react";
import { useAiInboxStore } from "../stores/aiInbox.store";
import type {
  AcceptSuggestionRequest,
  RejectSuggestionRequest,
  UpdateSuggestionRequest,
} from "../types";

export function useSuggestion(suggestionId: string) {
  const {
    suggestions,
    accepting,
    rejecting,
    updating,
    acceptSuggestion,
    rejectSuggestion,
    updateSuggestion,
  } = useAiInboxStore();

  const suggestion = suggestions.find((s) => s.suggestion_id === suggestionId);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAccept = async (
    edits?: AcceptSuggestionRequest["apply_edits"]
  ) => {
    setLocalError(null);
    try {
      await acceptSuggestion(suggestionId, edits);
      return true;
    } catch (error: any) {
      setLocalError(error.message || "Failed to accept suggestion");
      return false;
    }
  };

  const handleReject = async (reason?: RejectSuggestionRequest) => {
    setLocalError(null);
    try {
      await rejectSuggestion(suggestionId, reason);
      return true;
    } catch (error: any) {
      setLocalError(error.message || "Failed to reject suggestion");
      return false;
    }
  };

  const handleUpdate = async (data: UpdateSuggestionRequest) => {
    setLocalError(null);
    try {
      await updateSuggestion(suggestionId, data);
      return true;
    } catch (error: any) {
      setLocalError(error.message || "Failed to update suggestion");
      return false;
    }
  };

  return {
    suggestion,
    isAccepting: accepting.has(suggestionId),
    isRejecting: rejecting.has(suggestionId),
    isUpdating: updating.has(suggestionId),
    error: localError,
    accept: handleAccept,
    reject: handleReject,
    update: handleUpdate,
  };
}
