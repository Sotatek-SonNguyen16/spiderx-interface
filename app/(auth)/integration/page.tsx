"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGoogleChat } from "@/features/googleChat";

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "connected" | "disconnected" | "coming_soon";
  loading?: boolean;
}

export default function IntegrationPage() {
  const router = useRouter();
  const {
    isConnected,
    isError,
    status,
    loading: googleChatLoading,
    connect,
    disconnect,
    refresh,
  } = useGoogleChat();

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // The 'error' state is no longer directly rendered, its messages are now handled by successMessage with a "Lỗi: " prefix.
  // const [error, setError] = useState<string | null>(null);

  // Handle Google Chat Connection
  const handleGoogleChatConnect = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      "/api/auth/chat/login",
      "google-auth",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const messageHandler = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.error) {
        console.error("Google OAuth error:", event.data.error);
        setSuccessMessage(`Lỗi: ${event.data.error}`); // Use successMessage for errors
        window.removeEventListener("message", messageHandler);
        return;
      }

      if (event.data.success && event.data.googleRefreshToken) {
        setSaving(true);
        try {
          const result = await connect(event.data.googleRefreshToken);
          if (result.success) {
            setSuccessMessage("Đã kết nối với Google Chat thành công!");
            setTimeout(() => setSuccessMessage(null), 3000);
            refresh();
          } else {
            setSuccessMessage(`Lỗi: ${result.error || "Không thể kết nối với Backend"}`); // Use successMessage for errors
          }
        } catch (error: any) {
          setSuccessMessage(`Lỗi: ${error.message || "Không thể kết nối với Backend"}`); // Use successMessage for errors
        } finally {
          setSaving(false);
        }
      }
      window.removeEventListener("message", messageHandler);
      popup?.close();
    };

    window.addEventListener("message", messageHandler);
  };

  const handleGoogleChatDisconnect = async () => {
    if (!confirm("Bạn có chắc muốn ngắt kết nối Google Chat?")) return;
    setSaving(true);
    const result = await disconnect();
    if (result.success) {
      setSuccessMessage("Đã ngắt kết nối thành công");
    } else {
      setSuccessMessage(`Lỗi: ${result.error || "Không thể ngắt kết nối"}`); // Use successMessage for errors
    }
    setSaving(false);
  };

  const handleGoogleChatToggle = () => {
    if (isConnected) {
      handleGoogleChatDisconnect();
    } else {
      handleGoogleChatConnect();
    }
  };

  // Other platforms are now mocked and not interactive in this new structure
  const platforms: Platform[] = [
    {
      id: "google-meet",
      name: "Google Meet",
      description: "A natural language processing tool driven by AI technology for human-like conversations.",
      icon: "/images/client-logo-01.svg", // Placeholder
      status: "coming_soon",
    },
    {
      id: "slack",
      name: "Slack",
      description: "A natural language processing tool driven by AI technology for human-like conversations.",
      icon: "/images/Slack.png",
      status: "coming_soon",
    },
    {
      id: "ms-teams",
      name: "MS Teams",
      description: "A natural language processing tool driven by AI technology for human-like conversations.",
      icon: "/images/client-logo-02.svg", // Placeholder
      status: "coming_soon",
    },
    {
      id: "discord",
      name: "Discord",
      description: "A natural language processing tool driven by AI technology for human-like conversations.",
      icon: "/images/discord.jpg",
      status: "coming_soon",
    },
    {
      id: "whatsapp",
      name: "Whatsapp",
      description: "A natural language processing tool driven by AI technology for human-like conversations.",
      icon: "/images/whatsapp.png",
      status: "coming_soon",
    },
  ];

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Integrations Platforms</h1>
      </div>

      {/* Error/Success Message */}
      {successMessage && (
        <div
          className={`mb-6 rounded-lg p-4 text-sm ${
            successMessage.startsWith("Lỗi")
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
            }`}
        >
          {successMessage}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Google Chat Card */}
        <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50">
              <Image
                src="/images/Google-Chat.png"
                alt="Google Chat"
                width={32}
                height={32}
              />
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={isConnected}
                onChange={handleGoogleChatToggle}
                disabled={googleChatLoading || saving}
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            </label>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Google Chat
          </h3>
          <p className="mb-6 flex-1 text-sm text-gray-500">
            A natural language processing tool driven by AI technology for
            human-like conversations.
          </p>
          
             {isConnected && (
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-center">
                  <button 
                    onClick={() => router.push("/whitelist")}
                    className="w-full rounded-full border border-blue-600 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                  >
                    Manage
                  </button>
                </div>
             )}
        </div>

        {/* Other Platforms (Mocked) */}
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm opacity-70"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50">
                {/* Placeholder icons */}
                <div className="h-8 w-8 rounded bg-gray-200" />
              </div>
              <label className="relative inline-flex cursor-not-allowed items-center opacity-50">
                <input type="checkbox" className="peer sr-only" disabled />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-['']"></div>
              </label>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {platform.name}
            </h3>
            <p className="mb-4 flex-1 text-sm text-gray-500">
              {platform.description}
            </p>
            <span className="inline-flex w-fit items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
              Coming Soon
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
