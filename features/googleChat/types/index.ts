// Types theo spec 6.6 - Google Chat Integration
// Tất cả field names sử dụng snake_case để khớp với backend API

export interface GoogleChatSpace {
  id: string;
  name: string;
  description: string | null;
  is_whitelisted: boolean;
  display_name?: string | null;
  space_type?: string | null;
}

export interface IntegrationStatus {
  status: "connected" | "not_connected" | "error";
  provider?: string | null;
  last_sync_at?: string | null;
  last_error?: string | null;
}

// Theo spec 6.6.4: PUT /api/v1/integration/spaces/whitelist
export interface UpdateWhitelistDto {
  space_ids: string[];
}

// Theo spec 6.6.1: POST /api/v1/integration/connect
export interface ConnectIntegrationDto {
  refreshToken: string;
}

// Disconnect không cần body theo spec 6.6.5
export interface DisconnectIntegrationDto {
  // Empty - không cần body
}

// Theo spec 6.6.7: POST /api/v1/integration/spaces/{space_id}/generate-todos
export interface GenerateTodosDto {
  message_ids: string[];
  auto_save?: boolean;
}

export interface GenerateTodosResponse {
  total_messages_processed: number;
  total_todos_generated: number;
  total_todos_saved: number;
  summary: string;
}

// Theo spec 6.6.6: POST /api/v1/integration/spaces/{space_id}/messages
export interface FetchMessagesDto {
  start_date?: string | null;
  end_date?: string | null;
  sender_filter?: string | null;
  keyword?: string | null;
  limit?: number;
}

export interface GoogleChatMessage {
  message_id: string;
  space_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  timestamp: string;
  thread_id: string | null;
}

export interface FetchMessagesResponse {
  messages: GoogleChatMessage[];
  total_count: number;
  space_name: string;
}

// Theo spec 6.6.8: POST /api/v1/integration/spaces/whitelist/generate-todos
export interface GenerateTodosFromWhitelistDto {
  auto_save?: boolean;
  limit_per_space?: number;
}

export interface GenerateTodosFromWhitelistResponse {
  total_messages_processed: number;
  total_todos_generated: number;
  total_todos_saved: number;
  summary: string;
}


// =============================================================================
// Async Task Types - Update v1
// Theo docs/tasks.md: Async job flow for generating todos
// =============================================================================

export type TaskStatus = 
  | "PENDING" 
  | "STARTED" 
  | "PROGRESS" 
  | "SUCCESS" 
  | "FAILURE" 
  | "REVOKED";

// POST /api/v1/google-chat/integration/tasks/whitelist/generate-todos
export interface StartTaskDto {
  autoSave?: boolean;
  limitPerSpace?: number;
}

export interface StartTaskResponse {
  taskId: string;
  status: "PENDING";
  message: string;
  pollUrl: string;
}

// GET /api/v1/google-chat/integration/tasks/{taskId}
export interface TaskProgress {
  progress: string;
  percent: number;
  completed_spaces: number;
  total_spaces: number;
}

export interface GeneratedTodo {
  todoId: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string | null;
  estimatedTime?: number;
  tags: string[];
  eisenhower: string;
  sourceSpaceId: string;
  sourceSpaceName: string;
  sourceMessageId: string;
  sourceThreadName: string[];
}

export interface TaskResultData {
  total_messages_processed: number;
  total_todos_generated: number;
  total_todos_saved: number;
  processed_spaces: string[];
  todos: GeneratedTodo[];
  summary: string;
}

export interface TaskResult {
  status: "SUCCESS";
  result: TaskResultData;
}

export interface TaskStatusResponse {
  taskId: string;
  status: TaskStatus;
  progress: TaskProgress | null;
  result: TaskResult | null;
  error: string | null;
}

// DELETE /api/v1/google-chat/integration/tasks/{taskId}
// Returns 204 No Content on success


// =============================================================================
// AI Extract Types - Theo OpenAPI spec
// POST /api/v1/ai/extract
// =============================================================================

/**
 * Request body for AI extract endpoint
 * POST /api/v1/ai/extract
 */
export interface ExtractTextRequest {
  text: string; // required - Text to analyze for todos
  auto_save?: boolean; // default: false - Automatically save extracted todos
  source_type?: "chat" | "email" | "meeting"; // default: "chat"
  source_id?: string | null; // optional source ID
}

/**
 * ExtractedTodoResponse - Response for a single extracted todo
 * Matches TodoItem DB structure
 */
export interface ExtractedTodoItem {
  title: string; // required
  description?: string | null;
  priority: "low" | "medium" | "high" | "urgent"; // required
  due_date?: string | null; // ISO datetime
  estimated_time?: number | null; // minutes
  tags?: string[]; // default: []
  eisenhower?: string | null;
}

/**
 * ExtractionResult - Response from AI extract endpoint
 */
export interface ExtractTextResponse {
  todos: ExtractedTodoItem[];
  confidence: number; // 0-1
  summary: string;
  saved_count?: number; // Number of todos saved (if auto_save=true), default: 0
}
