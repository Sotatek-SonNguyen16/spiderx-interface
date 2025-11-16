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

