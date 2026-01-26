/**
 * AI Inbox API Client
 * Handles all API calls for AI Inbox feature
 */

import { apiClient, type ApiResponse } from "@/lib/api/client";
import {
  ExtractRequest,
  ExtractResponse,
  GetSuggestionsParams,
  GetSuggestionsResponse,
  AcceptSuggestionRequest,
  AcceptSuggestionResponse,
  RejectSuggestionRequest,
  RejectSuggestionResponse,
  UpdateSuggestionRequest,
  TodoSuggestion,
  BulkActionResponse,
  ReviewStatus,
} from "../types";

const BASE_PATH = "/api/v1/ai/inbox";

/**
 * Extract todos from text and create suggestions
 */
export async function extract(data: ExtractRequest): Promise<ExtractResponse> {
  const response = await apiClient.post<ExtractResponse>(
    `${BASE_PATH}/extract`,
    data
  );
  return response.data;
}

/**
 * Get list of suggestions with optional filters
 */
export async function getSuggestions(
  params?: GetSuggestionsParams
): Promise<GetSuggestionsResponse> {
  const queryParams = new URLSearchParams();

  if (params?.status) queryParams.append("status", params.status);
  if (params?.context_id) queryParams.append("context_id", params.context_id);
  if (params?.source_type)
    queryParams.append("source_type", params.source_type);
  if (params?.limit !== undefined)
    queryParams.append("limit", params.limit.toString());
  if (params?.offset !== undefined)
    queryParams.append("offset", params.offset.toString());
  if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
  if (params?.sort_order) queryParams.append("sort_order", params.sort_order);
  if (params?.search) queryParams.append("search", params.search);

  const query = queryParams.toString();
  const url = query
    ? `${BASE_PATH}/suggestions?${query}`
    : `${BASE_PATH}/suggestions`;

  const response = await apiClient.get<GetSuggestionsResponse>(url);
  return response.data;
}

/**
 * Get a single suggestion by ID
 */
export async function getSuggestion(id: string): Promise<TodoSuggestion> {
  const response = await apiClient.get<TodoSuggestion>(
    `${BASE_PATH}/suggestions/${id}`
  );
  return response.data;
}

/**
 * Accept a suggestion and create a todo
 */
export async function acceptSuggestion(
  id: string,
  data?: AcceptSuggestionRequest
): Promise<AcceptSuggestionResponse> {
  const response = await apiClient.post<AcceptSuggestionResponse>(
    `${BASE_PATH}/suggestions/${id}/accept`,
    data || {}
  );
  return response.data;
}

/**
 * Reject a suggestion
 */
export async function rejectSuggestion(
  id: string,
  data?: RejectSuggestionRequest
): Promise<RejectSuggestionResponse> {
  const response = await apiClient.post<RejectSuggestionResponse>(
    `${BASE_PATH}/suggestions/${id}/reject`,
    data || {}
  );
  return response.data;
}

/**
 * Update a suggestion before accepting/rejecting
 */
export async function updateSuggestion(
  id: string,
  data: UpdateSuggestionRequest
): Promise<TodoSuggestion> {
  const response = await apiClient.patch<TodoSuggestion>(
    `${BASE_PATH}/suggestions/${id}`,
    data
  );
  return response.data;
}

/**
 * Bulk accept multiple suggestions
 */
export async function bulkAcceptSuggestions(
  suggestionIds: string[]
): Promise<BulkActionResponse> {
  const promises = suggestionIds.map((id) => acceptSuggestion(id));

  try {
    const results = await Promise.allSettled(promises);
    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failedCount = results.filter((r) => r.status === "rejected").length;
    const errors = results
      .map((r, index) =>
        r.status === "rejected"
          ? {
              suggestion_id: suggestionIds[index],
              error:
                (r as PromiseRejectedResult).reason?.message || "Unknown error",
            }
          : null
      )
      .filter((e): e is { suggestion_id: string; error: string } => e !== null);

    return {
      success_count: successCount,
      failed_count: failedCount,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    throw new Error("Failed to bulk accept suggestions");
  }
}

/**
 * Bulk reject multiple suggestions
 */
export async function bulkRejectSuggestions(
  suggestionIds: string[],
  reason?: RejectSuggestionRequest
): Promise<BulkActionResponse> {
  const promises = suggestionIds.map((id) => rejectSuggestion(id, reason));

  try {
    const results = await Promise.allSettled(promises);
    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failedCount = results.filter((r) => r.status === "rejected").length;
    const errors = results
      .map((r, index) =>
        r.status === "rejected"
          ? {
              suggestion_id: suggestionIds[index],
              error:
                (r as PromiseRejectedResult).reason?.message || "Unknown error",
            }
          : null
      )
      .filter((e): e is { suggestion_id: string; error: string } => e !== null);

    return {
      success_count: successCount,
      failed_count: failedCount,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    throw new Error("Failed to bulk reject suggestions");
  }
}

/**
 * Get suggestion statistics
 */
export async function getSuggestionStats() {
  // This could be a separate endpoint or computed from suggestions
  const [pending, accepted, rejected] = await Promise.all([
    getSuggestions({ status: ReviewStatus.PENDING, limit: 0 }),
    getSuggestions({ status: ReviewStatus.ACCEPTED, limit: 0 }),
    getSuggestions({ status: ReviewStatus.REJECTED, limit: 0 }),
  ]);

  return {
    total: pending.total + accepted.total + rejected.total,
    pending: pending.total,
    accepted: accepted.total,
    rejected: rejected.total,
  };
}
