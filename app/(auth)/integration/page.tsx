"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGoogleChat } from "@/features/googleChat";

export default function IntegrationPage() {
  const router = useRouter();
  const {
    isConnected,
    isError,
    status,
    spaces,
    loading,
    error,
    updateWhitelist,
    disconnect,
    refresh,
    connect,
    generateTodos,
  } = useGoogleChat();

  // Local state cho UI
  const [selectedSpaces, setSelectedSpaces] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Tự động chọn các spaces đã được whitelist khi spaces load
  useEffect(() => {
    if (spaces.length > 0) {
      const whitelistedIds = spaces
        .filter((s) => s.is_whitelisted)
        .map((s) => s.id);
      setSelectedSpaces(new Set(whitelistedIds));
    }
  }, [spaces]);

  // Không cần tự động connect nữa vì flow mới sử dụng popup OAuth
  // User sẽ nhấn nút "Đăng nhập với Google" để mở popup và lấy refreshToken

  // Toggle selection của một space
  const toggleSpaceSelection = (spaceId: string) => {
    setSelectedSpaces((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(spaceId)) {
        newSet.delete(spaceId);
      } else {
        newSet.add(spaceId);
      }
      return newSet;
    });
  };

  // Lưu whitelist và generate todos
  const handleSaveSpaces = async () => {
    if (selectedSpaces.size === 0) {
      return;
    }

    setSaving(true);
    setSuccessMessage(null);

    // 1. Cập nhật whitelist
    const whitelistResult = await updateWhitelist(Array.from(selectedSpaces));

    if (!whitelistResult.success) {
      setSaving(false);
      return;
    }

    setSuccessMessage("Đang tạo todos từ messages...");

    // 2. Generate todos cho mỗi space đã chọn
    // Lưu ý: Backend sẽ tự động lấy messages từ các spaces đã whitelist
    // Nếu backend yêu cầu messageIds cụ thể, cần gọi API lấy messages trước
    try {
      const generatePromises = Array.from(selectedSpaces).map((spaceId) =>
        generateTodos(spaceId, [], true) // messageIds rỗng, backend sẽ tự động lấy messages
      );

      const generateResults = await Promise.all(generatePromises);
      const successCount = generateResults.filter((r) => r.success).length;

      if (successCount > 0) {
        setSuccessMessage(
          `Đã tạo todos từ ${successCount} space(s). Đang chuyển đến trang todos...`
        );
        // Redirect đến trang todos sau 2 giây
        setTimeout(() => {
          router.push("/todos");
        }, 2000);
      } else {
        setSuccessMessage("Đã cập nhật whitelist thành công");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error generating todos:", error);
      setSuccessMessage("Đã cập nhật whitelist thành công");
      setTimeout(() => setSuccessMessage(null), 3000);
    }

    setSaving(false);
  };

  // Ngắt kết nối
  // Gọi API disconnect để xóa refresh_token trong DB
  // Sau đó reset state và có thể redirect về trang chủ
  const handleDisconnect = async () => {
    if (
      !confirm(
        "Bạn có chắc muốn ngắt kết nối Google Chat? Hệ thống sẽ dừng đọc tin nhắn và xoá thông tin truy cập liên quan."
      )
    ) {
      return;
    }

    setSaving(true);
    setSuccessMessage(null);

    // Gọi API disconnect để xóa refresh_token trong DB
    // Lưu ý: Disconnect có thể gọi được ngay cả khi status là "error"
    const result = await disconnect();

    setSelectedSpaces(new Set());
    
    if (result.success) {
      setSuccessMessage("Đã ngắt kết nối thành công");
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setSuccessMessage(result.error || "Không thể ngắt kết nối");
      setTimeout(() => setSuccessMessage(null), 5000);
    }
    
    setSaving(false);
  };

  // Kết nối Google Chat - Đăng nhập Google
  // Sử dụng flow OAuth mới: Mở popup để lấy refreshToken từ Google
  const handleConnect = () => {
    // Mở popup window để đăng nhập Google
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      "/api/auth/chat/login",
      "google-auth",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Lắng nghe message từ popup
    const messageHandler = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.error) {
        console.error("Google OAuth error:", event.data.error);
        setSuccessMessage(`Lỗi: ${event.data.error}`);
        window.removeEventListener("message", messageHandler);
        return;
      }

      if (event.data.success && event.data.googleRefreshToken) {
        console.log("✅ Đã nhận refresh_token từ Google OAuth");
        
        // Gửi refresh_token đến Backend FastAPI
        setSaving(true);
        setSuccessMessage("Đang kết nối với Backend...");
        
        try {
          // Gọi API connect với refresh_token từ popup
          const result = await connect(event.data.googleRefreshToken);
          
          if (result.success) {
            setSuccessMessage("Đã kết nối với Google Chat thành công!");
            setTimeout(() => setSuccessMessage(null), 3000);
            // Refresh để lấy spaces
            setTimeout(() => {
              refresh();
            }, 1000);
          } else {
            setSuccessMessage(result.error || "Không thể kết nối với Backend");
            setTimeout(() => setSuccessMessage(null), 5000);
          }
        } catch (error: any) {
          console.error("Error connecting to backend:", error);
          setSuccessMessage(`Lỗi: ${error.message || "Không thể kết nối với Backend"}`);
          setTimeout(() => setSuccessMessage(null), 5000);
        } finally {
          setSaving(false);
        }
      }

      window.removeEventListener("message", messageHandler);
      popup?.close();
    };

    window.addEventListener("message", messageHandler);

    // Cleanup nếu popup bị đóng thủ công
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        window.removeEventListener("message", messageHandler);
      }
    }, 1000);
  };


  // Kết nối lại khi có lỗi
  const handleReconnect = () => {
    handleConnect();
  };

  // Computed values
  const connectionStatus = useMemo(() => {
    if (isError) return "error";
    if (isConnected) return "connected";
    return "not_connected";
  }, [isConnected, isError]);

  const whitelistedCount = useMemo(
    () => spaces.filter((s) => s.is_whitelisted).length,
    [spaces]
  );

  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
        {/* Header - Hidden when connected */}
        {connectionStatus !== "connected" && (
          <>
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-semibold text-gray-900 md:text-4xl">
                Google Chat Integration
              </h1>
              <div className="flex items-center gap-3">
                {connectionStatus === "not_connected" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                    Chưa kết nối
                  </span>
                )}
                {connectionStatus === "error" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    Có lỗi
                  </span>
                )}
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
                <div className="flex items-center justify-between">
                  <span>{error}</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Trạng thái: Chưa kết nối */}
        {connectionStatus === "not_connected" && (
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm text-center">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Kết nối Google Chat
            </h2>
            <p className="mb-6 text-gray-600">
              Kết nối tài khoản Google của bạn để hệ thống có thể đọc tin nhắn từ các Google Chat Space mà bạn chọn. Hệ thống chỉ đọc các Space được bạn cho phép.
            </p>
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleConnect}
                disabled={saving || loading}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-white shadow-lg transition hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Đang kết nối...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Đăng nhập với Google
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500">
                Nhấn để cấp quyền truy cập Google Chat và lấy tin nhắn
              </p>
            </div>
          </div>
        )}

        {/* Trạng thái: Có lỗi */}
        {connectionStatus === "error" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 shadow-sm text-center">
            <h2 className="mb-4 text-xl font-semibold text-red-900">
              Có lỗi với kết nối Google Chat
            </h2>
            <p className="mb-2 text-red-800">
              {status?.last_error || "Có lỗi xảy ra với kết nối của bạn."}
            </p>
            {status?.last_sync_at && (
              <p className="mb-6 text-sm text-red-600">
                Lần đồng bộ cuối: {new Date(status.last_sync_at).toLocaleString("vi-VN")}
              </p>
            )}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={handleDisconnect}
                disabled={saving || loading}
                className="inline-flex items-center gap-2 rounded-lg border border-red-600 bg-white px-6 py-3 text-red-600 shadow-sm transition hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Đang xử lý..." : "Ngắt kết nối"}
              </button>
              <button
                onClick={handleReconnect}
                disabled={saving || loading}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-white shadow-lg transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kết nối lại
              </button>
            </div>
            <p className="mt-4 text-xs text-red-600">
              💡 Nếu lỗi vẫn tiếp tục, hãy nhấn "Ngắt kết nối" và đăng nhập lại từ đầu.
            </p>
          </div>
        )}

        {/* Trạng thái: Đã kết nối - Quản lý Space */}
        {connectionStatus === "connected" && (
          <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-6 -mx-4 -my-12 sm:-mx-6 md:-mx-8 md:-my-20">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Success/Error Messages */}
              {successMessage && (
                <div className="mx-8 mt-6 mb-0 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
                  {successMessage}
                </div>
              )}
              {error && !loading && (
                <div className="mx-8 mt-6 mb-0 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-medium text-gray-900">Google Chat</h1>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={refresh}
                      disabled={loading}
                      className="text-sm text-gray-500 hover:text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Đang tải..." : "🔄 Làm mới"}
                    </button>
                    <button
                      onClick={handleDisconnect}
                      disabled={loading || saving}
                      className="text-sm text-red-600 hover:text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Ngắt kết nối
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    Đã kết nối
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-6">
                {/* Loading State */}
                {loading && spaces.length === 0 && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                      <p className="text-sm text-gray-600">Đang tải danh sách spaces...</p>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!loading && spaces.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-gray-500">Không có Space nào từ Google Chat.</p>
                  </div>
                )}

                {/* Error State */}
                {error && !loading && (
                  <div className="py-4 text-center">
                    <p className="mb-4 text-red-600">{error}</p>
                    <button
                      onClick={refresh}
                      className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                    >
                      Thử lại
                    </button>
                  </div>
                )}

                {/* Spaces List */}
                {spaces.length > 0 && (
                  <>
                    {/* Counter */}
                    <div className="mb-6">
                      <p className="text-sm text-gray-500">
                        {selectedSpaces.size} / {spaces.length} spaces
                      </p>
                    </div>

                    {/* Spaces List */}
                    <div className="space-y-1">
                      {spaces.map((space) => {
                        const isSelected = selectedSpaces.has(space.id);

                        return (
                          <div
                            key={space.id}
                            onClick={() => toggleSpaceSelection(space.id)}
                            className={`
                              group cursor-pointer px-4 py-3 rounded-lg transition-all
                              ${isSelected ? "bg-gray-50" : "hover:bg-gray-50"}
                            `}
                          >
                            <div className="flex items-start gap-3">
                              {/* Custom Checkbox */}
                              <div className="flex-shrink-0 mt-0.5">
                                <div
                                  className={`
                                    w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                    ${
                                      isSelected
                                        ? "bg-blue-500 border-blue-500"
                                        : "border-gray-300 group-hover:border-gray-400"
                                    }
                                  `}
                                >
                                  {isSelected && (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              {/* Space Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <h3 className="text-[15px] font-medium text-gray-900">
                                    {space.name}
                                  </h3>
                                </div>
                                {space.description && (
                                  <p className="text-[13px] text-gray-500">
                                    {space.description}
                                  </p>
                                )}
                                <p className="text-[11px] text-gray-400 mt-1">
                                  {space.id}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              {spaces.length > 0 && (() => {
                const hasChanges = spaces.some(
                  (s) => selectedSpaces.has(s.id) !== s.is_whitelisted
                );

                if (hasChanges) {
                  return (
                    <div className="px-8 py-4 border-t border-gray-100 bg-gray-50">
                      <button
                        onClick={handleSaveSpaces}
                        disabled={saving || selectedSpaces.size === 0}
                        className={`
                          w-full py-3 px-4 rounded-lg font-medium text-[15px] transition-all
                          ${
                            saving || selectedSpaces.size === 0
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
                          }
                        `}
                      >
                        {saving ? "Đang lưu..." : "Lưu cấu hình"}
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="px-8 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Đã lưu</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
