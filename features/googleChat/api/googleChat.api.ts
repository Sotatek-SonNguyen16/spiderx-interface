import { apiClient } from "@/lib/api";
import type {
  GoogleChatSpace,
  IntegrationStatus,
  UpdateWhitelistDto,
  GenerateTodosDto,
  GenerateTodosResponse,
} from "../types";

// API response types theo spec (snake_case)
type SpacesApiResponse = { spaces: GoogleChatSpace[] };
type StatusApiResponse = IntegrationStatus;
type WhitelistApiResponse = { status: "ok"; updated_spaces: string[] };
type ConnectApiResponse = IntegrationStatus; // Theo spec 6.6.1, trả về IntegrationStatus
type DisconnectApiResponse = { status: "disconnected" };

export const googleChatApi = {
  /**
   * GET /api/v1/integration/status
   * Theo spec 6.6.2: Kiểm tra trạng thái kết nối Google Chat
   * Auth: required (userId lấy từ JWT token trong Authorization header)
   */
  getStatus: async (): Promise<StatusApiResponse> => {
    // Backend sẽ lấy userId từ JWT token trong Authorization header
    const response = await apiClient.get<StatusApiResponse>(
      "/api/v1/integration/status"
    );
    return response.data;
  },

  /**
   * Connect user's Google Chat account.
   *
   * Saves the encrypted refresh token and initializes the integration.
   *
   * Security: Requires authentication via JWT token.
   *
   * Flow mới: refreshToken được truyền vào từ Google OAuth popup
   * Backend sẽ lấy userId từ JWT token trong Authorization header
   * 
   * @param refreshToken - Refresh token từ Google OAuth popup (required)
   */
  connect: async (refreshToken: string): Promise<ConnectApiResponse> => {
    // Gọi Next.js proxy route với refreshToken trong body
    try {
      const response = await apiClient.post<ConnectApiResponse>(
        "/api/v1/integration/connect",
        { refreshToken }
      );
      return response.data;
    } catch (error: any) {
      // Đồng nhất lỗi trả về
      throw new Error(error.message || "Failed to connect");
    }
  },

  /**
   * POST /api/v1/integration/disconnect
   * Theo spec 6.6.5: Ngắt kết nối Google Chat, xóa token
   * Auth: required (không cần body)
   */
  disconnect: async (): Promise<DisconnectApiResponse> => {
    const response = await apiClient.post<DisconnectApiResponse>(
      "/api/v1/integration/disconnect"
    );
    return response.data;
  },

  /**
   * GET /api/v1/integration/spaces
   * Theo spec 6.6.3: Lấy danh sách Google Chat spaces với whitelist status
   * Auth: required (userId lấy từ JWT token trong Authorization header)
   */
  getSpaces: async (): Promise<SpacesApiResponse> => {
    // Backend sẽ lấy userId từ JWT token trong Authorization header
    const response = await apiClient.get<SpacesApiResponse>(
      "/api/v1/integration/spaces"
    );
    return response.data;
  },

  /**
   * PUT /api/v1/integration/spaces/whitelist
   * Theo spec 6.6.4: Cập nhật danh sách spaces được phép quét
   * Auth: required
   * Body: { "space_ids": [...] }
   */
  updateWhitelist: async (
    payload: UpdateWhitelistDto
  ): Promise<WhitelistApiResponse> => {
    const response = await apiClient.put<WhitelistApiResponse>(
      "/api/v1/integration/spaces/whitelist",
      payload
    );
    return response.data;
  },

  /**
   * POST /api/v1/integration/spaces/{space_id}/generate-todos
   * Theo spec 6.6.7: Generate todos từ Google Chat messages sử dụng AI
   * Auth: required
   * Body: { "message_ids": [...], "auto_save": true }
   * Note: space_id được truyền qua path parameter, không cần trong body
   */
  generateTodos: async (
    spaceId: string,
    payload: GenerateTodosDto
  ): Promise<GenerateTodosResponse> => {
    const response = await apiClient.post<GenerateTodosResponse>(
      `/api/v1/integration/spaces/${spaceId}/generate-todos`,
      payload
    );
    return response.data;
  },
};

