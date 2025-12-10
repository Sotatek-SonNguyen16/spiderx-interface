"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGoogleChat } from "@/features/googleChat";

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "connected" | "disconnected" | "coming_soon";
}

// SVG icons for platforms without image files
const PlatformIcon = ({ platformId }: { platformId: string }) => {
  switch (platformId) {
    case "google-meet":
      // Official Google Meet logo
      return (
        <svg viewBox="0 0 87.5 72" className="h-10 w-10">
          <path fill="#00832d" d="M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z"/>
          <path fill="#0066da" d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z"/>
          <path fill="#e94235" d="M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z"/>
          <path fill="#2684fc" d="M20.5 20.5H0v31h20.5z"/>
          <path fill="#00ac47" d="M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.84.135 4.84-2.37V11c0-2.535-2.945-3.925-4.9-2.32zM49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V53.08z"/>
          <path fill="#ffba00" d="M63.5 0h-43v20.5h29V36l20-16.57V6c0-3.315-2.685-6-6-6z"/>
        </svg>
      );
    case "ms-teams":
      return (
        <svg viewBox="0 0 48 48" className="h-10 w-10">
          <path fill="#5059c9" d="M44 22v14c0 1.1-.9 2-2 2H26c-1.1 0-2-.9-2-2V22c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2z"/>
          <circle fill="#5059c9" cx="38" cy="12" r="6"/>
          <path fill="#7b83eb" d="M34 20H10c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2V22c0-1.1-.9-2-2-2z"/>
          <circle fill="#7b83eb" cx="22" cy="10" r="8"/>
          <path fill="#fff" d="M22 28h-8v-2h8v2zm4-4H14v-2h12v2z"/>
        </svg>
      );
    case "whatsapp":
      // Official WhatsApp logo
      return (
        <svg viewBox="0 0 48 48" className="h-10 w-10">
          <circle cx="24" cy="24" r="20" fill="#25D366"/>
          <path fill="#fff" d="M24 10c-7.73 0-14 6.27-14 14 0 2.47.65 4.87 1.88 6.99L10 38l7.26-1.9A13.94 13.94 0 0024 38c7.73 0 14-6.27 14-14s-6.27-14-14-14zm8.21 19.79c-.35.98-1.73 1.79-2.82 2.03-.75.16-1.72.29-5-.99-4.2-1.64-6.9-5.96-7.11-6.24-.21-.27-1.71-2.28-1.71-4.35s1.08-3.09 1.47-3.51c.39-.42.85-.53 1.13-.53h.82c.26 0 .62-.1.97.74.35.85 1.2 2.93 1.31 3.14.1.21.17.46.03.74-.14.28-.21.46-.42.71-.21.25-.44.56-.63.75-.21.21-.43.44-.18.86.25.42 1.1 1.82 2.37 2.95 1.63 1.45 3 1.9 3.43 2.11.42.21.67.18.92-.11.25-.28 1.06-1.24 1.34-1.66.28-.42.56-.35.95-.21.39.14 2.47 1.16 2.89 1.38.42.21.71.32.81.49.1.18.1 1.03-.25 2z"/>
        </svg>
      );
    default:
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-300 text-sm font-bold text-gray-600">
          {platformId.charAt(0).toUpperCase()}
        </div>
      );
  }
};

export default function IntegrationPage() {
  const router = useRouter();
  const {
    isConnected,
    loading: googleChatLoading,
    connect,
    disconnect,
    refresh,
  } = useGoogleChat();

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);

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
        setSuccessMessage(`Error: ${event.data.error}`);
        window.removeEventListener("message", messageHandler);
        return;
      }

      if (event.data.success && event.data.googleRefreshToken) {
        setSaving(true);
        try {
          const result = await connect(event.data.googleRefreshToken);
          if (result.success) {
            setSuccessMessage("Successfully connected to Google Chat!");
            setTimeout(() => setSuccessMessage(null), 3000);
            refresh();
          } else {
            setSuccessMessage(`Error: ${result.error || "Unable to connect to backend"}`);
          }
        } catch (error: any) {
          setSuccessMessage(`Error: ${error.message || "Unable to connect to backend"}`);
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
    if (!confirm("Are you sure you want to disconnect Google Chat?")) return;
    setSaving(true);
    const result = await disconnect();
    if (result.success) {
      setSuccessMessage("Successfully disconnected");
    } else {
      setSuccessMessage(`Error: ${result.error || "Unable to disconnect"}`);
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

  // Platform configurations with descriptions
  const platforms: Platform[] = [
    {
      id: "google-meet",
      name: "Google Meet",
      description: "Google's video conferencing tool, integrated with Google Workspace for online meetings.",
      icon: "",
      status: "coming_soon",
    },
    {
      id: "slack",
      name: "Slack",
      description: "Popular team communication platform with channels, direct messaging, and app integrations.",
      icon: "/images/Slack.png",
      status: "coming_soon",
    },
    {
      id: "ms-teams",
      name: "MS Teams",
      description: "Microsoft's collaboration platform with chat, video meetings, and Office 365 integration.",
      icon: "",
      status: "coming_soon",
    },
    {
      id: "discord",
      name: "Discord",
      description: "Communication platform with voice, video, and text chat for communities and teams.",
      icon: "/images/discord.jpg",
      status: "coming_soon",
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Popular messaging app with end-to-end encryption for messages and calls.",
      icon: "",
      status: "coming_soon",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with cloudy gradient background */}
      <div className="bg-[#e7a373] px-6 py-8 md:px-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Integration Platforms
            </h1>
            <p className="mt-2 text-[#fff]">
              Connect platforms to automatically create tasks from messages
            </p>
          </div>
          <button
            onClick={() => setShowConnectionModal(true)}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-sky-600 shadow-lg transition-all hover:bg-sky-50 hover:shadow-xl"
          >
            <svg
              className="h-5 w-5"
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
            Platform connection
          </button>
        </div>
      </div>

      <div className="p-6 md:p-10">
        {/* Success/Error Message */}
        {successMessage && (
          <div
            className={`mb-6 rounded-lg p-4 text-sm ${
              successMessage.startsWith("Error")
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-green-50 text-green-600 border border-green-200"
            }`}
          >
            {successMessage}
          </div>
        )}

        {/* Platform Grid - 3 columns, 2 rows */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Google Chat Card - Active */}
          <div className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-sky-100">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-2 shadow-sm">
                <Image
                  src="/images/Google-Chat.png"
                  alt="Google Chat"
                  width={40}
                  height={40}
                  className="object-contain"
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
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-200"></div>
              </label>
            </div>
            
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Google Chat
            </h3>
            <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-500">
              Google&apos;s tool for direct and group messaging in teams.
            </p>

            {isConnected ? (
              <div className="mt-auto border-t border-gray-100 pt-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-xs font-medium text-green-600">Connected</span>
                </div>
                <button
                  onClick={() => router.push("/whitelist")}
                  className="w-full rounded-xl border-2 border-sky-500 py-2.5 text-sm font-semibold text-sky-600 transition-all hover:bg-sky-500 hover:text-white"
                >
                  Manage
                </button>
              </div>
            ) : (
              <div className="mt-auto border-t border-gray-100 pt-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-gray-400"></span>
                  <span className="text-xs font-medium text-gray-500">Not connected</span>
                </div>
                <button
                  onClick={handleGoogleChatConnect}
                  disabled={googleChatLoading || saving}
                  className="w-full rounded-xl bg-sky-500 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sky-600 disabled:opacity-50"
                >
                  {saving ? "Connecting..." : "Connect now"}
                </button>
              </div>
            )}
          </div>

          {/* Other Platforms - Coming Soon */}
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-2 shadow-sm">
                  {platform.icon ? (
                    <Image
                      src={platform.icon}
                      alt={platform.name}
                      width={40}
                      height={40}
                      className="object-contain opacity-80"
                    />
                  ) : (
                    <PlatformIcon platformId={platform.id} />
                  )}
                </div>
                <label className="relative inline-flex cursor-not-allowed items-center">
                  <input type="checkbox" className="peer sr-only" disabled />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 opacity-50 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:content-['']"></div>
                </label>
              </div>
              
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {platform.name}
              </h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-500">
                {platform.description}
              </p>
              
              <div className="mt-auto border-t border-gray-100 pt-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Coming Soon
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connection Modal */}
      {showConnectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Connect Platform</h2>
              <button
                onClick={() => setShowConnectionModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="mb-6 text-sm text-gray-500">
              Select a platform to connect and automatically create tasks from messages.
            </p>

            <div className="space-y-3">
              {/* Google Chat - Available */}
              <button
                onClick={() => {
                  setShowConnectionModal(false);
                  if (!isConnected) handleGoogleChatConnect();
                }}
                disabled={isConnected}
                className="flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Image
                  src="/images/Google-Chat.png"
                  alt="Google Chat"
                  width={32}
                  height={32}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Google Chat</p>
                  <p className="text-xs text-gray-500">
                    {isConnected ? "Connected" : "Ready to connect"}
                  </p>
                </div>
                {isConnected && (
                  <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                )}
              </button>

              {/* Other platforms - Coming Soon */}
              {platforms.slice(0, 3).map((platform) => (
                <div
                  key={platform.id}
                  className="flex w-full items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 opacity-60"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-200">
                    {platform.icon ? (
                      <Image
                        src={platform.icon}
                        alt={platform.name}
                        width={24}
                        height={24}
                        className="opacity-50"
                      />
                    ) : (
                      <div className="scale-50">
                        <PlatformIcon platformId={platform.id} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-600">{platform.name}</p>
                    <p className="text-xs text-gray-400">Coming Soon</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowConnectionModal(false)}
              className="mt-6 w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
