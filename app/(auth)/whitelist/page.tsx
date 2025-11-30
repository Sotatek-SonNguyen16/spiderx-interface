"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGoogleChat } from "@/features/googleChat";
import type { GoogleChatSpace } from "@/features/googleChat/types";
import { Check, Circle } from "lucide-react";

export default function WhitelistPage() {
  const router = useRouter();
  const { spaces, loading, error, fetchSpaces, updateWhitelist, generateTodosFromWhitelist } = useGoogleChat();
  const [localSpaces, setLocalSpaces] = useState<GoogleChatSpace[]>([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load spaces
  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  // Sync local state
  useEffect(() => {
    if (spaces.length > 0) {
      setLocalSpaces(
        spaces.map((space) => ({
          ...space,
          is_whitelisted: space.is_whitelisted === true,
        }))
      );
    } else {
      setLocalSpaces([]);
    }
  }, [spaces]);

  // Toggle whitelist status locally
  const handleToggleSpace = (spaceId: string) => {
    setLocalSpaces((prev) =>
      prev.map((space) =>
        space.id === spaceId
          ? { ...space, is_whitelisted: !space.is_whitelisted }
          : space
      )
    );
  };

  // Save whitelist to backend
  const handleConnectToThreads = async () => {
    setSaving(true);
    setMessage(null);

    const whitelistedIds = localSpaces
      .filter((s) => s.is_whitelisted)
      .map((s) => s.id);

    const result = await updateWhitelist(whitelistedIds);

    if (result.success) {
      setMessage({ type: "success", text: "Connected to threads successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: "error", text: result.error || "Failed to connect to threads" });
    }
    setSaving(false);
  };

  const handleGenerateTodos = async () => {
    setGenerating(true);
    setMessage(null);

    try {
      // Ensure we have whitelisted spaces saved first? 
      // Or assume user has clicked "Connect to Threads" first?
      // Let's assume we generate from what's currently whitelisted in backend.
      // But maybe we should auto-save first?
      // The prompt says "handle thêm cả logic cập nhật whitelist nữa" separately.
      
      const result = await generateTodosFromWhitelist(true, 1000);

      if (!result.success || !result.data) {
        setMessage({ type: "error", text: result.error || "Failed to generate todos" });
        setGenerating(false);
        return;
      }

      setGenerateSuccess(true);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to generate todos" });
    } finally {
      setGenerating(false);
    }
  };

  // Success View
  if (generateSuccess) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-6">
           <Image 
             src="/images/success-illustration.svg" // Placeholder, user needs to provide or we use generic
             alt="Success"
             width={300}
             height={200}
             className="mx-auto" 
             // Fallback if image missing
             onError={(e) => {
               e.currentTarget.style.display = 'none';
             }}
           />
           {/* Fallback visual if no image */}
           <div className="mx-auto mb-4 h-40 w-60 rounded-xl bg-blue-50 flex items-center justify-center text-blue-200">
              <Check className="h-16 w-16" />
           </div>
        </div>
        
        <h2 className="mb-8 text-xl font-semibold text-blue-600">Generate successfully!</h2>
        
        <button
          onClick={() => router.push("/todos")}
          className="w-full max-w-sm rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Open Queue
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <Image src="/images/google-chat.svg" alt="Google Chat" width={24} height={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Google Chat Manage</h1>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-8 border-b border-gray-100 pb-1 text-sm font-medium">
          <button className="border-b-2 border-transparent pb-3 text-gray-400 hover:text-gray-600">Not connected</button>
          <button className="border-b-2 border-blue-600 pb-3 text-blue-600">Connected</button>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 rounded-lg p-4 text-sm ${
            message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}>
            {message.text}
          </div>
        )}

        {/* Thread List */}
        <div className="space-y-3 mb-8">
          {loading && localSpaces.length === 0 ? (
            <div className="py-12 text-center text-gray-500">Loading threads...</div>
          ) : localSpaces.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No chat threads found.</div>
          ) : (
            localSpaces.map((space) => (
              <div
                key={space.id}
                onClick={() => handleToggleSpace(space.id)}
                className="flex cursor-pointer items-center justify-between rounded-xl bg-gray-50 px-6 py-5 transition-colors hover:bg-gray-100"
              >
                <span className="font-medium text-gray-700">{space.display_name || space.name}</span>
                <div className="flex items-center justify-center">
                    {space.is_whitelisted ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#00CC99] text-[#00CC99]">
                             <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </div>
                    ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                    )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
             <button
                onClick={handleConnectToThreads}
                disabled={saving || loading}
                className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
                {saving ? "Saving..." : `Connect to Threads (${localSpaces.filter(s => s.is_whitelisted).length})`}
            </button>

            <button
                onClick={handleGenerateTodos}
                disabled={generating || loading}
                className="w-full rounded-lg border border-gray-200 bg-white py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
                {generating ? "Generating..." : "Generate Todo in Queue"}
            </button>
        </div>
      </div>
    </div>
  );
}
