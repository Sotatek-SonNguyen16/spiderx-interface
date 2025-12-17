"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGoogleChat } from "@/features/googleChat";
import {
  Check,
  Clock,
  Settings,
  Sparkles,
  Bell,
  ExternalLink,
  RefreshCw,
  Zap,
  MessageSquare,
  Users,
  ChevronRight,
  X,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "connected" | "disconnected" | "coming_soon";
  category: "messaging" | "video" | "collaboration";
  requestCount?: number; // Simulated vote count
}

// SVG icons for platforms without image files
const PlatformIcon = ({ platformId }: { platformId: string }) => {
  switch (platformId) {
    case "google-meet":
      return (
        <svg viewBox="0 0 87.5 72" className="h-8 w-8">
          <path
            fill="#00832d"
            d="M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z"
          />
          <path
            fill="#0066da"
            d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z"
          />
          <path fill="#e94235" d="M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z" />
          <path fill="#2684fc" d="M20.5 20.5H0v31h20.5z" />
          <path
            fill="#00ac47"
            d="M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.84.135 4.84-2.37V11c0-2.535-2.945-3.925-4.9-2.32zM49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V53.08z"
          />
          <path
            fill="#ffba00"
            d="M63.5 0h-43v20.5h29V36l20-16.57V6c0-3.315-2.685-6-6-6z"
          />
        </svg>
      );
    case "ms-teams":
      return (
        <svg viewBox="0 0 48 48" className="h-8 w-8">
          <path
            fill="#5059c9"
            d="M44 22v14c0 1.1-.9 2-2 2H26c-1.1 0-2-.9-2-2V22c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2z"
          />
          <circle fill="#5059c9" cx="38" cy="12" r="6" />
          <path
            fill="#7b83eb"
            d="M34 20H10c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2V22c0-1.1-.9-2-2-2z"
          />
          <circle fill="#7b83eb" cx="22" cy="10" r="8" />
          <path fill="#fff" d="M22 28h-8v-2h8v2zm4-4H14v-2h12v2z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 48 48" className="h-8 w-8">
          <circle cx="24" cy="24" r="20" fill="#25D366" />
          <path
            fill="#fff"
            d="M24 10c-7.73 0-14 6.27-14 14 0 2.47.65 4.87 1.88 6.99L10 38l7.26-1.9A13.94 13.94 0 0024 38c7.73 0 14-6.27 14-14s-6.27-14-14-14zm8.21 19.79c-.35.98-1.73 1.79-2.82 2.03-.75.16-1.72.29-5-.99-4.2-1.64-6.9-5.96-7.11-6.24-.21-.27-1.71-2.28-1.71-4.35s1.08-3.09 1.47-3.51c.39-.42.85-.53 1.13-.53h.82c.26 0 .62-.1.97.74.35.85 1.2 2.93 1.31 3.14.1.21.17.46.03.74-.14.28-.21.46-.42.71-.21.25-.44.56-.63.75-.21.21-.43.44-.18.86.25.42 1.1 1.82 2.37 2.95 1.63 1.45 3 1.9 3.43 2.11.42.21.67.18.92-.11.25-.28 1.06-1.24 1.34-1.66.28-.42.56-.35.95-.21.39.14 2.47 1.16 2.89 1.38.42.21.71.32.81.49.1.18.1 1.03-.25 2z"
          />
        </svg>
      );
    default:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 text-sm font-bold text-gray-500">
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
  const [notifyRequests, setNotifyRequests] = useState<Set<string>>(new Set());

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
            setSuccessMessage(
              `Error: ${result.error || "Unable to connect to backend"}`
            );
          }
        } catch (error: any) {
          setSuccessMessage(
            `Error: ${error.message || "Unable to connect to backend"}`
          );
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
    if (
      !confirm(
        "Are you sure you want to disconnect Google Chat? This will stop syncing todos from your messages."
      )
    )
      return;
    setSaving(true);
    const result = await disconnect();
    if (result.success) {
      setSuccessMessage("Successfully disconnected from Google Chat");
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setSuccessMessage(`Error: ${result.error || "Unable to disconnect"}`);
    }
    setSaving(false);
  };

  const handleNotifyRequest = (platformId: string) => {
    setNotifyRequests((prev) => new Set([...prev, platformId]));
    // In a real app, this would call an API to save the request
    setSuccessMessage(`We'll notify you when ${platformId} is available!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Platform configurations - Coming Soon platforms
  const comingSoonPlatforms: Platform[] = [
    {
      id: "slack",
      name: "Slack",
      description: "Extract todos from Slack messages and channels",
      icon: "/images/Slack.png",
      status: "coming_soon",
      category: "messaging",
      requestCount: 128,
    },
    {
      id: "ms-teams",
      name: "Microsoft Teams",
      description: "Sync todos from Teams chats and meetings",
      icon: "",
      status: "coming_soon",
      category: "messaging",
      requestCount: 89,
    },
    {
      id: "google-meet",
      name: "Google Meet",
      description: "Create todos from meeting transcripts",
      icon: "",
      status: "coming_soon",
      category: "video",
      requestCount: 64,
    },
    {
      id: "discord",
      name: "Discord",
      description: "Turn Discord messages into actionable todos",
      icon: "/images/discord.jpg",
      status: "coming_soon",
      category: "messaging",
      requestCount: 45,
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Extract todos from WhatsApp conversations",
      icon: "",
      status: "coming_soon",
      category: "messaging",
      requestCount: 156,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ========== HEADER ========== */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Integrations
              </h1>
              <p className="mt-1.5 text-gray-500 text-sm max-w-lg">
                Connect your messaging platforms to{" "}
                <span className="text-purple-600 font-medium">
                  automatically extract todos
                </span>{" "}
                using AI. Never miss an action item from your conversations.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {isConnected ? 1 : 0}
                  </p>
                  <p className="text-xs text-gray-500">Connected</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {comingSoonPlatforms.length}
                  </p>
                  <p className="text-xs text-gray-500">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Success/Error Message */}
        {successMessage && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl p-4 text-sm ${
              successMessage.startsWith("Error")
                ? "bg-red-50 text-red-700 border border-red-100"
                : "bg-green-50 text-green-700 border border-green-100"
            }`}
          >
            {successMessage.startsWith("Error") ? (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            )}
            {successMessage}
          </div>
        )}

        {/* ========== SECTION 1: CONNECTED PLATFORMS ========== */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <Check className="h-3.5 w-3.5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Connected Platforms
            </h2>
          </div>

          {/* Google Chat - Connected Card (Prominent) */}
          <div
            className={`
            relative overflow-hidden rounded-2xl border-2 transition-all duration-300
            ${
              isConnected
                ? "border-green-200 bg-gradient-to-br from-green-50/50 to-white shadow-lg shadow-green-100/50"
                : "border-gray-200 bg-white hover:border-blue-200 hover:shadow-md"
            }
          `}
          >
            {/* Connection Status Ribbon */}
            {isConnected && (
              <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                Active
              </div>
            )}

            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Platform Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm">
                    <Image
                      src="/images/Google-Chat.png"
                      alt="Google Chat"
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Google Chat
                      </h3>
                      {isConnected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                          Connected
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Turn Google Chat messages into actionable todos
                      automatically
                    </p>
                  </div>
                </div>

                {/* Connection State */}
                {isConnected ? (
                  <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
                    <button
                      onClick={() => router.push("/integration/google-chat")}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm 
                        hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                    <button
                      onClick={() => router.push("/whitelist")}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm
                        hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Manage Spaces
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleGoogleChatConnect}
                    disabled={googleChatLoading || saving}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm
                      hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 w-full sm:w-auto"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Connect Google Chat
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Sync Details - Only shown when connected */}
              {isConnected && (
                <div className="mt-6 pt-5 border-t border-green-100">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* What's syncing */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                          Syncing
                        </p>
                        <p className="text-sm text-gray-900 font-medium">
                          Direct & Group Messages
                        </p>
                      </div>
                    </div>

                    {/* AI Status */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                          AI Extraction
                        </p>
                        <p className="text-sm text-gray-900 font-medium flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          Enabled
                        </p>
                      </div>
                    </div>

                    {/* Spaces */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 flex-shrink-0">
                        <Users className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                          Connected Spaces
                        </p>
                        <button
                          onClick={() => router.push("/whitelist")}
                          className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
                        >
                          View & Manage
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Value Proposition - Only shown when not connected */}
              {!isConnected && (
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Auto-extract todos from messages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>AI-powered task detection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Sync across all spaces</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========== SECTION 2: COMING SOON PLATFORMS ========== */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Coming Soon
              </h2>
            </div>
            <p className="text-xs text-gray-500">Vote to help us prioritize</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {comingSoonPlatforms.map((platform) => {
              const isNotified = notifyRequests.has(platform.id);

              return (
                <div
                  key={platform.id}
                  className="group flex flex-col rounded-xl border border-gray-100 bg-white p-5 
                    transition-all duration-200 hover:border-gray-200 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 border border-gray-100">
                      {platform.icon ? (
                        <Image
                          src={platform.icon}
                          alt={platform.name}
                          width={28}
                          height={28}
                          className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                          <PlatformIcon platformId={platform.id} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {platform.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {platform.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                    {/* Request Count */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Users className="h-3.5 w-3.5" />
                      <span>{platform.requestCount} teams requested</span>
                    </div>

                    {/* Notify Button */}
                    <button
                      onClick={() => handleNotifyRequest(platform.id)}
                      disabled={isNotified}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isNotified
                          ? "bg-green-50 text-green-600 cursor-default"
                          : "bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {isNotified ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Subscribed
                        </>
                      ) : (
                        <>
                          <Bell className="h-3.5 w-3.5" />
                          Notify me
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Request New Integration */}
          <div className="mt-6 p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 text-center">
            <p className="text-sm text-gray-500">
              Don't see your platform?{" "}
              <button className="text-blue-600 font-medium hover:underline">
                Request an integration
              </button>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
