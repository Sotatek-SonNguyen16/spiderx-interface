"use client";

import { useEffect, useCallback, useMemo, useState } from "react";
import { useGoogleChatStore } from "../stores/googleChat.store";
import { googleChatService } from "../services/googleChat.service";

export const useGoogleChat = () => {
  // Không cần userId từ session nữa vì backend sẽ lấy từ JWT token trong Authorization header

  const {
    status,
    spaces,
    loading,
    error,
    setStatus,
    setSpaces,
    setLoading,
    setError,
    updateSpaceWhitelist,
    reset,
  } = useGoogleChatStore();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Hàm lấy trạng thái
  // Backend sẽ lấy userId từ JWT token trong Authorization header
  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await googleChatService.fetchStatus();

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setStatus(result.data);
    }

    setLoading(false);
  }, [setLoading, setError, setStatus]);

  // 2. Hàm lấy danh sách space
  // Backend sẽ lấy userId từ JWT token trong Authorization header
  const fetchSpaces = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await googleChatService.fetchSpaces();

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setSpaces(result.data.spaces || []);
    }

    setLoading(false);
  }, [setLoading, setError, setSpaces]);

  // Tải status khi hook được mount
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Nếu đã kết nối, tải danh sách space
  // Chỉ fetch khi: đã connected, chưa có spaces, và không đang loading
  useEffect(() => {
    if (
      status?.status === "connected" &&
      spaces.length === 0 &&
      !loading
    ) {
      fetchSpaces();
    }
  }, [status?.status, spaces.length, loading, fetchSpaces]);

  // 3. Hàm lấy danh sách whitelisted spaces
  // Theo spec 6.6.4: GET /api/v1/integration/spaces/whitelist
  // Chỉ trả về các spaces đã được whitelist, tất cả đều có isWhitelisted: true
  const fetchWhitelistedSpaces = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await googleChatService.fetchWhitelistedSpaces();

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return { success: false, error: result.error };
    }

    if (result.data) {
      // Set spaces với chỉ whitelisted spaces
      setSpaces(result.data.spaces);
    }

    setLoading(false);
    return { success: true, data: result.data };
  }, [setLoading, setError, setSpaces]);

  // 4. Hàm cập nhật whitelist
  // Theo spec 6.6.4: PUT /api/v1/integration/spaces/whitelist
  // Body: { "space_ids": [...] } - userId lấy từ JWT token trong Authorization header
  const updateWhitelist = useCallback(
    async (selectedSpaceIds: string[]) => {
      setLoading(true);
      setError(null);

      // Optimistic update
      const previousSpaces = [...spaces];
      spaces.forEach((space) => {
        updateSpaceWhitelist(
          space.id,
          selectedSpaceIds.includes(space.id) // is_whitelisted
        );
      });

      // Theo spec: chỉ gửi space_ids (snake_case), không gửi userId
      const result = await googleChatService.updateWhitelist({
        space_ids: selectedSpaceIds,
      });

      if (result.error) {
        // Rollback on error
        setSpaces(previousSpaces);
        setError(result.error);
        setLoading(false);
        return { success: false, error: result.error };
      }

      setLoading(false);
      return { success: true, data: result.data };
    },
    [spaces, setLoading, setError, setSpaces, updateSpaceWhitelist]
  );

  // 5. Hàm ngắt kết nối
  // Theo spec 6.6.5: POST /api/v1/integration/disconnect
  // Không cần body, userId lấy từ JWT token trong Authorization header
  const disconnect = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Theo spec: không cần payload
    const result = await googleChatService.disconnect();

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return { success: false, error: result.error };
    }

    // Reset state sau khi disconnect thành công
    reset();
    setStatus({
      status: "not_connected",
      provider: null,
      last_sync_at: null,
      last_error: null,
    });

    setLoading(false);
    return { success: true, data: result.data };
  }, [setLoading, setError, reset, setStatus]);

  // 6. Hàm refresh data
  const refresh = useCallback(async () => {
    await Promise.all([fetchStatus(), fetchSpaces()]);
  }, [fetchStatus, fetchSpaces]);

  // 7. Hàm connect Google Chat
  // Flow mới: refreshToken được truyền vào từ Google OAuth popup
  // Backend sẽ lấy userId từ JWT token trong Authorization header
  const connect = useCallback(async (refreshToken: string) => {
    if (!refreshToken) {
      return { success: false, error: "Refresh token is required" };
    }

    setLoading(true);
    setError(null);

    // Gọi API với refreshToken trong body
    const result = await googleChatService.connect(refreshToken);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return { success: false, error: result.error };
    }

    // Sau khi connect thành công, fetch lại status
    // useEffect sẽ tự động fetch spaces khi status === "connected"
    await fetchStatus();

    setLoading(false);
    return { success: true, data: result.data };
  }, [setLoading, setError, fetchStatus]);

  // 8. Hàm generate todos từ messages
  // Theo spec 6.6.7: POST /api/v1/integration/spaces/{space_id}/generate-todos
  // Body: { "message_ids": [...], "auto_save": true }
  // Backend sẽ lấy userId từ JWT token trong Authorization header
  const generateTodos = useCallback(
    async (spaceId: string, messageIds: string[], autoSave: boolean = true) => {
      setLoading(true);
      setError(null);

      // Theo spec: space_id trong path, message_ids và auto_save trong body (snake_case)
      const result = await googleChatService.generateTodos(spaceId, {
        message_ids: messageIds,
        auto_save: autoSave,
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return { success: false, error: result.error };
      }

      setLoading(false);
      return { success: true, data: result.data };
    },
    [setLoading, setError]
  );

  // 9. Hàm generate todos từ tất cả whitelisted spaces
  // Theo spec 6.6.8: POST /api/v1/integration/spaces/whitelist/generate-todos
  // Body: { "auto_save": true, "limit_per_space": 30 }
  // BE tự động lấy messages từ tất cả whitelisted spaces (mặc định 30 tin nhắn mới nhất mỗi space)
  // BE dùng AI agent extract todos từ tất cả messages
  // BE trả về statistics tổng hợp: số messages processed, số todos generated, số todos saved
  const generateTodosFromWhitelist = useCallback(
    async (autoSave: boolean = true, limitPerSpace: number = 30) => {
      setLoading(true);
      setError(null);

      const result = await googleChatService.generateTodosFromWhitelist({
        auto_save: autoSave,
        limit_per_space: limitPerSpace,
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return { success: false, error: result.error };
      }

      setLoading(false);
      return { success: true, data: result.data };
    },
    [setLoading, setError]
  );

  const isConnected = useMemo(
    () => status?.status === "connected",
    [status]
  );

  const isError = useMemo(() => status?.status === "error", [status]);

  // Filter spaces based on search query
  const filteredSpaces = useMemo(() => {
    if (!searchQuery.trim()) return spaces;
    
    const query = searchQuery.toLowerCase();
    return spaces.filter((space) => {
      const name = (space.name || space.display_name || "").toLowerCase();
      const description = (space.description || "").toLowerCase();
      return name.includes(query) || description.includes(query);
    });
  }, [spaces, searchQuery]);

  // Search function
  const filterSpaces = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    // State
    isConnected,
    isError,
    status,
    spaces,
    filteredSpaces,
    searchQuery,
    loading,
    error,

    // Actions
    fetchStatus,
    fetchSpaces,
    fetchWhitelistedSpaces,
    updateWhitelist,
    disconnect,
    refresh,
    connect,
    generateTodos,
    generateTodosFromWhitelist,
    filterSpaces,
    clearSearch,
  };
};

