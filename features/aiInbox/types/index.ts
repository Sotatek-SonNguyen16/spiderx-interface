/**
 * AI Inbox Types
 * Types for AI-suggested todos and human-in-the-loop review workflow
 */

// ============================================================================
// Enums
// ============================================================================

export enum ReviewStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired",
}

export enum ConfidenceLevel {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export enum QualityFlagType {
  MISSING_DEADLINE = "missing_deadline",
  MISSING_ASSIGNEE = "missing_assignee",
  AMBIGUOUS_CONTENT = "ambiguous_content",
  LOW_CONFIDENCE = "low_confidence",
  DUPLICATE_POSSIBLE = "duplicate_possible",
}

export enum SourceType {
  CHAT = "chat",
  EMAIL = "email",
  MEETING = "meeting",
  MANUAL = "manual",
}

export enum RejectReasonCode {
  NOT_A_TASK = "not_a_task",
  DUPLICATE = "duplicate",
  ALREADY_DONE = "already_done",
  NOT_RELEVANT = "not_relevant",
  INCORRECT_EXTRACTION = "incorrect_extraction",
  OTHER = "other",
}

// ============================================================================
// Core Domain Types
// ============================================================================

export interface Evidence {
  quote?: string;
  reason?: string;
  message_index?: number;
}

export interface TodoSuggestion {
  suggestion_id: string;
  run_id: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  due_date: string | null; // ISO8601
  assignee: string | null;
  context_id: string | null;
  tags: string[];
  ai_confidence: number | null; // 0-1
  quality_flags: string[];
  follow_up_questions: string[];
  evidence: Evidence;
  review_status: ReviewStatus;
  linked_todo_id: string | null;
  created_at: string; // ISO8601
  updated_at?: string; // ISO8601
}

export interface AIExtractionRun {
  run_id: string;
  request_type: "single_text" | "batch_messages" | "platform_sync";
  prompt_version: string;
  provider_used: string | null;
  model_used: string | null;
  todo_count: number;
  confidence: number | null;
  latency_ms: number | null;
  status: "success" | "failed";
  created_at?: string;
}

// ============================================================================
// UI Helper Types
// ============================================================================

export interface SuggestionWithConfidenceLevel extends TodoSuggestion {
  confidenceLevel: ConfidenceLevel;
}

export interface SuggestionStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  high_confidence: number;
  medium_confidence: number;
  low_confidence: number;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface ExtractRequest {
  text: string;
  context_id?: string;
  source?: {
    source_type: SourceType;
    source_space_id?: string;
    source_message_id?: string;
  };
}

export interface ExtractResponse {
  run: AIExtractionRun;
  suggestions: TodoSuggestion[];
}

export interface GetSuggestionsParams {
  status?: ReviewStatus;
  context_id?: string;
  source_type?: SourceType;
  limit?: number;
  offset?: number;
  sort_by?: "confidence" | "due_date" | "created_at";
  sort_order?: "asc" | "desc";
  search?: string;
}

export interface GetSuggestionsResponse {
  items: TodoSuggestion[];
  total: number;
  next_cursor?: string;
}

export interface AcceptSuggestionRequest {
  apply_edits?: {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high" | "urgent";
    due_date?: string;
    assignee?: string;
    context_id?: string;
    tags?: string[];
  };
}

export interface AcceptSuggestionResponse {
  status: "accepted";
  suggestion_id: string;
  linked_todo_id: string;
  saved_count: number;
}

export interface RejectSuggestionRequest {
  reason_code?: RejectReasonCode;
  comment?: string;
}

export interface RejectSuggestionResponse {
  status: "rejected";
  suggestion_id: string;
}

export interface UpdateSuggestionRequest {
  title?: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  due_date?: string;
  assignee?: string;
  context_id?: string;
  tags?: string[];
}

export interface BulkActionResponse {
  success_count: number;
  failed_count: number;
  errors?: Array<{
    suggestion_id: string;
    error: string;
  }>;
}

// ============================================================================
// Filter & Sort Types
// ============================================================================

export interface SuggestionFilters {
  status: ReviewStatus | "all";
  context_id: string | null;
  source_type: SourceType | null;
  confidence_level: ConfidenceLevel | null;
  search: string;
}

export interface SortOptions {
  field: "confidence" | "due_date" | "created_at";
  order: "asc" | "desc";
}
