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

