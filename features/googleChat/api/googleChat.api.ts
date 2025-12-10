import { apiClient } from "@/lib/api";
import type {
  GoogleChatSpace,
  IntegrationStatus,
  UpdateWhitelistDto,
  GenerateTodosDto,
  GenerateTodosResponse,
  FetchMessagesDto,
  FetchMessagesResponse,
  GenerateTodosFromWhitelistDto,
  GenerateTodosFromWhitelistResponse,
  // Update v1: Async task types
  StartTaskDto,
  StartTaskResponse,
  TaskStatusResponse,
  // Update v1: Extract text types
  ExtractTextRequest,
  ExtractTextResponse,
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
   * GET /api/v1/integration/spaces/whitelist
   * Theo spec 6.6.4: Lấy danh sách spaces đã được whitelist của user
   * Auth: required
   * Note: Chỉ trả về các spaces đã được whitelist, tất cả đều có isWhitelisted: true
   */
  getWhitelistedSpaces: async (): Promise<SpacesApiResponse> => {
    const response = await apiClient.get<SpacesApiResponse>(
      "/api/v1/integration/spaces/whitelist"
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
   * POST /api/v1/integration/spaces/{space_id}/messages
   * Theo spec 6.6.6: Lấy messages từ Google Chat space với optional filtering
   * Auth: required
   * Body: { "start_date": "...", "end_date": "...", "sender_filter": "...", "keyword": "...", "limit": 30 }
   */
  getMessages: async (
    spaceId: string,
    payload?: FetchMessagesDto
  ): Promise<FetchMessagesResponse> => {
    const response = await apiClient.post<FetchMessagesResponse>(
      `/api/v1/integration/spaces/${spaceId}/messages`,
      payload || {}
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

  /**
   * POST /api/v1/integration/spaces/whitelist/generate-todos
   * Theo spec 6.6.9: Generate todos từ tất cả whitelisted Google Chat spaces sử dụng AI
   * Auth: required
   * Body: { "auto_save": true, "limit_per_space": 30 }
   * Note: Backend Python expect snake_case (auto_save, limit_per_space)
   * KHÔNG cần spaceId và messageIds (backend sẽ tự động lấy từ whitelist)
   * 
   * IMPORTANT: Backend có thể đang dùng schema sai. Nếu backend expect spaceId và messageIds,
   * đó là bug ở backend. Frontend chỉ gửi auto_save và limit_per_space theo spec.
   */
  generateTodosFromWhitelist: async (
    payload?: GenerateTodosFromWhitelistDto
  ): Promise<GenerateTodosFromWhitelistResponse> => {
    // Đảm bảo payload luôn có giá trị và đúng format snake_case
    // Chỉ gửi auto_save và limit_per_space, KHÔNG gửi spaceId và messageIds
    const requestBody: Record<string, any> = {};
    
    // Chỉ thêm các field có giá trị để tránh gửi undefined
    if (payload?.auto_save !== undefined) {
      requestBody.auto_save = payload.auto_save;
    } else {
      requestBody.auto_save = true; // Default value
    }
    
    if (payload?.limit_per_space !== undefined) {
      requestBody.limit_per_space = payload.limit_per_space;
    } else {
      requestBody.limit_per_space = 30; // Default value
    }
    
    // Log để debug
    console.log("GenerateTodosFromWhitelist - Request URL:", "/api/v1/integration/spaces/whitelist/generate-todos");
    console.log("GenerateTodosFromWhitelist - Request body:", JSON.stringify(requestBody, null, 2));
    
    try {
      const response = await apiClient.post<GenerateTodosFromWhitelistResponse>(
        "/api/v1/integration/spaces/whitelist/generate-todos",
        requestBody
      );
      return response.data;
    } catch (error: any) {
      // Log chi tiết lỗi để debug
      console.error("GenerateTodosFromWhitelist error:", {
        status: error.response?.status,
        data: error.response?.data,
        requestBody: requestBody,
      });
      
      // Nếu backend báo thiếu spaceId và messageIds, đó là bug ở backend
      // Frontend đã gửi đúng theo spec (chỉ auto_save và limit_per_space)
      if (error.response?.status === 422) {
        const errorDetail = error.response?.data?.detail;
        if (Array.isArray(errorDetail)) {
          const missingFields = errorDetail
            .filter((err: any) => err.type === "missing")
            .map((err: any) => err.loc?.join("."))
            .filter(Boolean);
          
          if (missingFields.includes("body.spaceId") || missingFields.includes("body.messageIds")) {
            throw new Error(
              "Backend đang expect spaceId và messageIds, nhưng endpoint này không cần những fields đó. " +
              "Vui lòng kiểm tra backend schema. Frontend đã gửi đúng: { auto_save: true, limit_per_space: 30 }"
            );
          }
        }
      }
      
      throw error;
    }
  },

  // =============================================================================
  // Async Task API - Update v1
  // Theo docs/tasks.md: Async job flow for generating todos
  // =============================================================================

  /**
   * POST /api/v1/integration/tasks/whitelist/generate-todos
   * Start async task to generate todos from all whitelisted spaces
   * Returns taskId for polling
   */
  startGenerateTodosTask: async (
    payload?: StartTaskDto
  ): Promise<StartTaskResponse> => {
    const requestBody = {
      autoSave: payload?.autoSave ?? true,
      limitPerSpace: payload?.limitPerSpace ?? 100,
    };

    const response = await apiClient.post<StartTaskResponse>(
      "/api/v1/integration/tasks/whitelist/generate-todos",
      requestBody
    );
    return response.data;
  },

  /**
   * GET /api/v1/integration/tasks/{taskId}
   * Poll task status
   * Status: PENDING | STARTED | PROGRESS | SUCCESS | FAILURE | REVOKED
   */
  getTaskStatus: async (taskId: string): Promise<TaskStatusResponse> => {
    const response = await apiClient.get<TaskStatusResponse>(
      `/api/v1/integration/tasks/${taskId}`
    );
    return response.data;
  },

  /**
   * DELETE /api/v1/integration/tasks/{taskId}
   * Cancel a running task
   * Returns 204 No Content on success
   */
  cancelTask: async (taskId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/integration/tasks/${taskId}`);
  },

  // =============================================================================
  // Extract Text API - Update v1
  // Paste context to extract action items
  // =============================================================================

  /**
   * POST /api/v1/todos/extract-from-text
   * Extract todos from pasted text using AI
   */
  extractTodosFromText: async (
    payload: ExtractTextRequest
  ): Promise<ExtractTextResponse> => {
    const response = await apiClient.post<ExtractTextResponse>(
      "/api/v1/todos/extract-from-text",
      payload
    );
    return response.data;
  },
};
