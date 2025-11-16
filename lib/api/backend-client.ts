/**
 * Backend API Client - Server-side only
 * Utility để gọi Backend API từ Next.js server-side
 */

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "";
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || "";

interface BackendRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  /**
   * SpiderX JWT token để gửi trong Authorization header
   * Nếu không có, sẽ không gửi Authorization header (backend có thể dùng API key)
   */
  spiderxAuthToken?: string;
}

/**
 * Helper function để lấy SpiderX JWT token từ Request headers
 */
export function getSpiderXTokenFromRequest(request: Request): string | undefined {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return undefined;
}

/**
 * Gọi Backend API từ server-side Next.js
 * Tự động forward Authorization header nếu có spiderxAuthToken
 */
export async function callBackendAPI<T = any>(
  endpoint: string,
  options: BackendRequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, spiderxAuthToken } = options;

  if (!BACKEND_API_URL) {
    throw new Error("BACKEND_API_URL is not configured");
  }

  const url = `${BACKEND_API_URL}${endpoint}`;
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Forward SpiderX JWT token trong Authorization header nếu có
  if (spiderxAuthToken) {
    requestHeaders["Authorization"] = `Bearer ${spiderxAuthToken}`;
  }

  // Thêm API Key để xác thực (nếu có và chưa có Authorization header)
  if (BACKEND_API_KEY && !spiderxAuthToken) {
    requestHeaders["X-API-Key"] = BACKEND_API_KEY;
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Backend API error: ${response.status} ${response.statusText}`,
      }));
      throw new Error(errorData.message || `Backend API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to call Backend API");
  }
}

/**
 * Integration API - Connect Google Chat
 * Theo spec: POST /api/v1/integration/connect
 * Body: { "refreshToken": "..." }
 * 
 * Backend sẽ lấy userId từ JWT token trong Authorization header.
 * Nếu có spiderxAuthToken, gửi trong Authorization header.
 * Nếu không có, chỉ gửi với API key (nếu có).
 */
export async function connectGoogleChat(data: {
  refreshToken: string;
  spiderxAuthToken?: string;
}) {
  const headers: Record<string, string> = {};
  
  // Nếu có token SpiderX, gửi trong Authorization header
  if (data.spiderxAuthToken) {
    headers["Authorization"] = `Bearer ${data.spiderxAuthToken}`;
  }

  return callBackendAPI<{
    status: "connected" | "not_connected" | "error";
    provider?: string | null;
    lastSyncAt?: string | null;
    lastError?: string | null;
  }>(
    "/api/v1/integration/connect",
    {
      method: "POST",
      body: {
        refreshToken: data.refreshToken,
      },
      headers,
    }
  );
}

/**
 * Integration API - Disconnect Google Chat
 * Theo spec 6.6.5: POST /api/v1/integration/disconnect
 * Không cần body, userId lấy từ JWT token trong Authorization header
 */
export async function disconnectGoogleChat(spiderxAuthToken?: string) {
  return callBackendAPI<{ status: "disconnected" }>("/api/v1/integration/disconnect", {
    method: "POST",
    spiderxAuthToken,
  });
}

/**
 * Integration API - Get connection status
 * Theo spec: GET /api/v1/integration/status
 * Backend sẽ lấy userId từ JWT token trong Authorization header
 */
export async function getIntegrationStatus(spiderxAuthToken?: string) {
  return callBackendAPI<{
    status: "connected" | "not_connected" | "error";
    provider?: string;
    lastSyncAt?: string;
    lastError?: string | null;
  }>("/api/v1/integration/status", {
    method: "GET",
    spiderxAuthToken,
  });
}

/**
 * Spaces API - Get all spaces with whitelist status
 * Theo spec: GET /api/v1/integration/spaces
 * Backend sẽ lấy userId từ JWT token trong Authorization header
 */
export async function getIntegrationSpaces(spiderxAuthToken?: string) {
  return callBackendAPI<{
    spaces: Array<{
      id: string;
      name: string;
      description?: string | null;
      isWhitelisted: boolean;
    }>;
  }>("/api/v1/integration/spaces", {
    method: "GET",
    spiderxAuthToken,
  });
}

/**
 * Spaces API - Update whitelist
 * Theo spec: PUT /api/v1/integration/spaces/whitelist
 * Backend sẽ lấy userId từ JWT token trong Authorization header
 */
export async function updateIntegrationSpacesWhitelist(data: {
  spaceIds: string[];
}, spiderxAuthToken?: string) {
  return callBackendAPI<{
    status: "ok";
    updatedSpaces: string[];
  }>("/api/v1/integration/spaces/whitelist", {
    method: "PUT",
    body: {
      space_ids: data.spaceIds, // Backend expects snake_case
    },
    spiderxAuthToken,
  });
}

