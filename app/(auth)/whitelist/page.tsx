"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGoogleChat } from "@/features/googleChat";
import type { GoogleChatSpace } from "@/features/googleChat/types";

export default function WhitelistPage() {
  const router = useRouter();
  const { spaces, loading, error, fetchSpaces, fetchWhitelistedSpaces, updateWhitelist, generateTodosFromWhitelist } = useGoogleChat();
  const [localSpaces, setLocalSpaces] = useState<GoogleChatSpace[]>([]);
  const [whitelistedSpacesFromApi, setWhitelistedSpacesFromApi] = useState<GoogleChatSpace[]>([]);
  const [loadingWhitelist, setLoadingWhitelist] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState<string | null>(null);

  // Load spaces và whitelisted spaces khi component mount
  useEffect(() => {
    // Fetch tất cả spaces
    fetchSpaces();
    
    // Fetch whitelisted spaces từ API
    const loadWhitelistedSpaces = async () => {
      setLoadingWhitelist(true);
      try {
        const result = await fetchWhitelistedSpaces();
        if (result.success && result.data) {
          // Đảm bảo is_whitelisted luôn là boolean
          setWhitelistedSpacesFromApi(
            result.data.spaces.map((space) => ({
              ...space,
              is_whitelisted: space.is_whitelisted === true,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch whitelisted spaces:", err);
      } finally {
        setLoadingWhitelist(false);
      }
    };
    
    loadWhitelistedSpaces();
  }, [fetchSpaces, fetchWhitelistedSpaces]);

  // Sync local state với spaces từ store
  useEffect(() => {
    if (spaces.length > 0) {
      // Đảm bảo is_whitelisted luôn là boolean để tránh uncontrolled → controlled warning
      setLocalSpaces(
        spaces.map((space) => ({
          ...space,
          is_whitelisted: space.is_whitelisted === true, // Đảm bảo luôn là boolean, không bao giờ undefined
        }))
      );
    } else {
      // Reset về mảng rỗng nếu không có spaces
      setLocalSpaces([]);
    }
  }, [spaces]);

  // Toggle whitelist status cho một space
  const handleToggleSpace = (spaceId: string) => {
    setLocalSpaces((prev) =>
      prev.map((space) =>
        space.id === spaceId
          ? { ...space, is_whitelisted: !(space.is_whitelisted === true) }
          : space
      )
    );
  };

  // Save whitelist changes
  const handleSaveWhitelist = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      const whitelistedSpaceIds = localSpaces
        .filter((space) => space.is_whitelisted)
        .map((space) => space.id);

      const result = await updateWhitelist(whitelistedSpaceIds);

      if (result.error) {
        setSaveError(result.error);
      } else {
        // Refresh spaces và whitelisted spaces để sync với server
        await Promise.all([
          fetchSpaces(),
          fetchWhitelistedSpaces().then((result) => {
            if (result.success && result.data) {
              setWhitelistedSpacesFromApi(
                result.data.spaces.map((space) => ({
                  ...space,
                  is_whitelisted: space.is_whitelisted === true,
                }))
              );
            }
          }),
        ]);
      }
    } catch (err: any) {
      setSaveError(err.message || "Failed to save whitelist");
    } finally {
      setSaving(false);
    }
  };

  // Generate todos từ tất cả whitelisted spaces sử dụng endpoint mới
  // Option 2: Generate từ tất cả whitelisted spaces
  // Theo spec 6.6.9: POST /api/v1/integration/spaces/whitelist/generate-todos
  // 1. User đã connect Google Chat và whitelist spaces
  // 2. FE gọi POST /api/v1/integration/spaces/whitelist/generate-todos với autoSave và limitPerSpace
  // 3. BE tự động lấy messages từ tất cả whitelisted spaces (mặc định 1000 tin nhắn mới nhất mỗi space)
  // 4. BE dùng AI agent extract todos từ tất cả messages
  // 5. BE trả về statistics tổng hợp: số messages processed, số todos generated, số todos saved
  // 6. FE refresh todo list để hiển thị todos mới
  const handleGenerateTodos = async () => {
    setGenerating(true);
    setGenerateError(null);
    setGenerateSuccess(null);

    try {
      // Kiểm tra xem có whitelisted spaces không (từ API hoặc local)
      const hasWhitelistedSpaces = 
        whitelistedSpacesFromApi.length > 0 || 
        localSpaces.some((space) => space.is_whitelisted);

      if (!hasWhitelistedSpaces) {
        setGenerateError("Vui lòng chọn ít nhất một space để generate todos");
        setGenerating(false);
        return;
      }

      // Sử dụng function từ hook để generate todos từ tất cả whitelisted spaces
      // autoSave = true, limitPerSpace = 1000 (mặc định)
      // BE sẽ tự động lấy tất cả whitelisted spaces từ database
      const result = await generateTodosFromWhitelist(true, 1000);

      if (!result.success || !result.data) {
        setGenerateError(result.error || "Failed to generate todos");
        setGenerating(false);
        return;
      }

      const response = result.data;
      setGenerating(false);

      // Hiển thị thông báo thành công với statistics từ BE
      // Response từ BE đã có summary chi tiết
      setGenerateSuccess(
        response.summary || 
        `Đã xử lý ${response.total_messages_processed} tin nhắn. Tạo ${response.total_todos_generated} todos, lưu ${response.total_todos_saved} todos vào database.`
      );

      // Refresh whitelisted spaces để cập nhật danh sách
      await fetchWhitelistedSpaces().then((result) => {
        if (result.success && result.data) {
          setWhitelistedSpacesFromApi(
            result.data.spaces.map((space) => ({
              ...space,
              is_whitelisted: space.is_whitelisted === true,
            }))
          );
        }
      });

      // Redirect đến todos page sau 2 giây để user xem todos mới
      setTimeout(() => {
        router.push("/todos");
      }, 2000);
    } catch (err: any) {
      setGenerateError(err.message || "Failed to generate todos");
      setGenerating(false);
    }
  };

  const whitelistedCount = localSpaces.filter(
    (space) => space.is_whitelisted
  ).length;

  // Tách spaces thành whitelisted và non-whitelisted
  const whitelistedSpaces = useMemo(
    () => localSpaces.filter((space) => space.is_whitelisted),
    [localSpaces]
  );

  const nonWhitelistedSpaces = useMemo(
    () => localSpaces.filter((space) => !space.is_whitelisted),
    [localSpaces]
  );

  return (
    <div className="min-h-screen bg-[#f5f5f7] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Whitelist Spaces
          </h1>
          <p className="text-gray-600">
            Chọn các Google Chat spaces mà bạn muốn SpiderX quét để tự động
            extract todos.
          </p>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {saveError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{saveError}</p>
          </div>
        )}

        {generateError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{generateError}</p>
          </div>
        )}

        {generateSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">{generateSuccess}</p>
            <p className="text-green-700 text-xs mt-1">
              Đang chuyển đến trang Todos...
            </p>
          </div>
        )}

        {/* Whitelisted Spaces Section - Từ API */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Spaces được phép đọc tin nhắn (từ hệ thống)
              {loadingWhitelist ? (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (Đang tải...)
                </span>
              ) : (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({whitelistedSpacesFromApi.length})
                </span>
              )}
            </h2>
            {whitelistedSpacesFromApi.length > 0 && !loadingWhitelist && (
              <button
                onClick={handleGenerateTodos}
                disabled={generating || loading}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang tạo todos...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>Tạo Todos</span>
                  </>
                )}
              </button>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-green-200 overflow-hidden">
            {loadingWhitelist ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <p className="mt-2 text-sm text-gray-600">Đang tải danh sách whitelisted spaces...</p>
              </div>
            ) : whitelistedSpacesFromApi.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm">Chưa có space nào được whitelist.</p>
                <p className="text-xs mt-1 text-gray-400">
                  Chọn spaces từ danh sách bên dưới và nhấn "Lưu Whitelist" để thêm vào danh sách này.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {whitelistedSpacesFromApi.map((space) => (
                  <div
                    key={space.id}
                    className="flex items-center p-4 hover:bg-green-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-gray-900">
                          {space.display_name || space.name}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Whitelisted
                        </span>
                      </div>
                      {space.description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {space.description}
                        </p>
                      )}
                      {space.space_type && (
                        <p className="mt-1 text-xs text-gray-400">
                          Type: {space.space_type}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* All Spaces List */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Tất cả Spaces ({localSpaces.length})
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {loading && localSpaces.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Đang tải danh sách spaces...</p>
              </div>
            ) : localSpaces.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Không có spaces nào được tìm thấy.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {localSpaces.map((space) => (
                  <label
                    key={space.id}
                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={space.is_whitelisted === true}
                      onChange={() => handleToggleSpace(space.id)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-gray-900">
                          {space.display_name || space.name}
                        </h3>
                        {space.is_whitelisted && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Whitelisted
                          </span>
                        )}
                      </div>
                      {space.description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {space.description}
                        </p>
                      )}
                      {space.space_type && (
                        <p className="mt-1 text-xs text-gray-400">
                          Type: {space.space_type}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {localSpaces.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Đã chọn <strong>{whitelistedCount}</strong> / {localSpaces.length}{" "}
              spaces
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleSaveWhitelist}
            disabled={saving || loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <span className="flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang lưu...
              </span>
            ) : (
              "Lưu Whitelist"
            )}
          </button>

          <button
            onClick={handleGenerateTodos}
            disabled={generating || loading || whitelistedCount === 0}
            className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {generating ? (
              <span className="flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang extract todos từ messages...
              </span>
            ) : (
              "Extract Todos từ Messages"
            )}
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Lưu ý:
          </h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>
              Chỉ các spaces được whitelist mới được hệ thống quét để extract todos tự động.
            </li>
            <li>
              Nút "Extract Todos từ Messages" sẽ tự động lấy tin nhắn mới nhất (tối đa 1000 tin nhắn/space) 
              từ tất cả whitelisted spaces và extract todos ngay lập tức.
            </li>
            <li>
              Sau khi extract thành công, bạn sẽ được chuyển đến trang Todos.
            </li>
            <li>
              Background worker sẽ tự động quét messages mỗi 5 phút từ các spaces đã whitelist.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
