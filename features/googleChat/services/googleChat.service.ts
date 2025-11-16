import { googleChatApi } from "../api/googleChat.api";
import type {
  UpdateWhitelistDto,
  GenerateTodosDto,
} from "../types";

export class GoogleChatService {
  /**
   * GET /api/v1/integration/status
   * Lấy trạng thái kết nối Google Chat
   * Backend sẽ lấy userId từ JWT token trong Authorization header
   */
  async fetchStatus() {
    try {
      const data = await googleChatApi.getStatus();
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to fetch status",
      };
    }
  }

  /**
   * GET /api/v1/integration/spaces
   * Lấy danh sách Google Chat spaces với whitelist status
   * Backend sẽ lấy userId từ JWT token trong Authorization header
   */
  async fetchSpaces() {
    try {
      const data = await googleChatApi.getSpaces();
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to fetch spaces",
      };
    }
  }

  /**
   * PUT /api/v1/integration/spaces/whitelist
   * Cập nhật danh sách spaces được phép quét
   * Theo spec: chỉ cần spaceIds, userId lấy từ JWT token
   */
  async updateWhitelist(payload: UpdateWhitelistDto) {
    try {
      const data = await googleChatApi.updateWhitelist(payload);
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to update whitelist",
      };
    }
  }

  /**
   * POST /api/integration/connect
   * Kết nối Google Chat account, lưu refresh token
   * 
   * Flow mới: refreshToken được truyền vào từ Google OAuth popup
   * Backend sẽ lấy userId từ JWT token trong Authorization header
   * 
   * @param refreshToken - Refresh token từ Google OAuth popup (required)
   */
  async connect(refreshToken: string) {
    try {
      const data = await googleChatApi.connect(refreshToken);
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to connect",
      };
    }
  }

  /**
   * POST /api/v1/integration/disconnect
   * Ngắt kết nối Google Chat, xóa token
   * Theo spec: không cần body, userId lấy từ JWT token
   */
  async disconnect() {
    try {
      const data = await googleChatApi.disconnect();
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to disconnect",
      };
    }
  }

  /**
   * POST /api/v1/integration/spaces/{space_id}/generate-todos
   * Generate todos từ Google Chat messages sử dụng AI
   */
  async generateTodos(spaceId: string, payload: GenerateTodosDto) {
    try {
      const data = await googleChatApi.generateTodos(spaceId, payload);
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to generate todos",
      };
    }
  }
}

export const googleChatService = new GoogleChatService();

