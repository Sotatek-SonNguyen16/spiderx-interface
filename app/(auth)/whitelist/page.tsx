"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGoogleChat } from "@/features/googleChat";
import { googleChatService } from "@/features/googleChat/services/googleChat.service";
import type { GoogleChatSpace } from "@/features/googleChat/types";
import { 
  Check, 
  Search, 
  ArrowRight, 
  Trash2, 
  Save, 
  Zap, 
  Loader2,
  RefreshCw
} from "lucide-react";

export default function WhitelistPage() {
  const router = useRouter();
  const { spaces, loading: hookLoading, fetchSpaces, updateWhitelist, generateTodosFromWhitelist } = useGoogleChat();
  
  // Local state for "All Spaces" (left column)
  const [localSpaces, setLocalSpaces] = useState<GoogleChatSpace[]>([]);
  // Local state for "Whitelisted Spaces" (right column)
  const [whitelistedSpaces, setWhitelistedSpaces] = useState<GoogleChatSpace[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingWhitelist, setLoadingWhitelist] = useState(false);
  
  // Action states
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load all spaces via hook
  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  // Load whitelisted spaces via service explicitly
  useEffect(() => {
    const loadWhitelist = async () => {
      setLoadingWhitelist(true);
      const result = await googleChatService.fetchWhitelistedSpaces();
      if (result.data) {
        setWhitelistedSpaces(result.data.spaces);
      }
      setLoadingWhitelist(false);
    };
    loadWhitelist();
  }, []);

  // Sync localSpaces from hook spaces
  useEffect(() => {
    if (spaces.length > 0) {
      setLocalSpaces(spaces);
    }
  }, [spaces]);

  // Filter "All Spaces" to exclude those already in the whitelist (right column)
  // OR keep them but show status? 
  // User said "hiển thị chia đôi 2 danh sách ra". Usually means Available vs Selected.
  // Let's filter out spaces that are already in whitelistedSpaces to avoid duplication/confusion.
  const availableSpaces = useMemo(() => {
    const whitelistedIds = new Set(whitelistedSpaces.map(s => s.id));
    return localSpaces.filter(s => 
      !whitelistedIds.has(s.id) && 
      (s.display_name || s.name).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [localSpaces, whitelistedSpaces, searchQuery]);

  // Handlers
  const handleAddToWhitelist = (space: GoogleChatSpace) => {
    // Add to right list
    setWhitelistedSpaces(prev => [...prev, { ...space, is_whitelisted: true }]);
    // It will automatically disappear from left list due to `availableSpaces` filter
  };

  const handleRemoveFromWhitelist = (spaceId: string) => {
    // Remove from right list
    setWhitelistedSpaces(prev => prev.filter(s => s.id !== spaceId));
    // It will automatically reappear in left list if it exists in `localSpaces`
  };

  const handleSaveWhitelist = async () => {
    setSaving(true);
    setMessage(null);

    const whitelistedIds = whitelistedSpaces.map((s) => s.id);

    const result = await updateWhitelist(whitelistedIds);

    if (result.success) {
      setMessage({ type: "success", text: "Whitelist updated successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update whitelist" });
    }
    setSaving(false);
  };

  const handleGenerateTodos = async () => {
    setGenerating(true);
    setMessage(null);

    try {
      const result = await generateTodosFromWhitelist(true, 30);

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
      <div className="flex h-screen flex-col items-center justify-center p-6 text-center">
        <div className="mb-6">
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

  const isLoading = hookLoading || loadingWhitelist;

  return (
    <div className="flex h-screen flex-col p-6 md:p-8 overflow-hidden bg-white">
      {/* Header & Actions */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0">
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <Image src="/images/Google-Chat.png" alt="Google Chat" width={24} height={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Whitelist</h1>
              <p className="text-sm text-gray-500">Select spaces to sync with SpiderX</p>
            </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
           <button
              onClick={handleSaveWhitelist}
              disabled={saving || isLoading}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : "Update Whitelist"}
          </button>

          <button
              onClick={handleGenerateTodos}
              disabled={generating || isLoading}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 text-yellow-500" />}
              {generating ? "Generating..." : "Generate Todo"}
          </button>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`mb-6 rounded-lg p-4 text-sm flex items-center gap-2 shrink-0 ${
          message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
        }`}>
          {message.type === "success" ? <Check className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      {/* Main Content - Split View */}
      <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
        
        {/* Left Column: Available Spaces */}
        <div className="flex flex-1 flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden h-full">
          <div className="border-b border-gray-100 bg-gray-50 p-4 shrink-0">
            <h3 className="font-semibold text-gray-700">All Spaces</h3>
            <div className="mt-2 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Search spaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {isLoading && localSpaces.length === 0 ? (
               <div className="flex h-40 items-center justify-center text-gray-400">
                  <Loader2 className="h-6 w-6 animate-spin" />
               </div>
            ) : availableSpaces.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-gray-400 text-sm">
                {searchQuery ? "No matching spaces found" : "No available spaces"}
              </div>
            ) : (
              <div className="space-y-1">
                {availableSpaces.map((space) => (
                  <div key={space.id} className="group flex items-center justify-between rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium text-xs">
                        {space.display_name?.charAt(0) || space.name.charAt(0)}
                      </div>
                      <span className="truncate text-sm font-medium text-gray-700" title={space.display_name || space.name}>
                        {space.display_name || space.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddToWhitelist(space)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="Add to whitelist"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Whitelisted Spaces */}
        <div className="flex flex-1 flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden h-full">
          <div className="border-b border-gray-100 bg-gray-50 p-4 flex justify-between items-center shrink-0">
            <h3 className="font-semibold text-gray-700">Whitelisted Spaces</h3>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600">
              {whitelistedSpaces.length}
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
             {isLoading && whitelistedSpaces.length === 0 ? (
               <div className="flex h-40 items-center justify-center text-gray-400">
                  <Loader2 className="h-6 w-6 animate-spin" />
               </div>
            ) : whitelistedSpaces.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-gray-400 text-sm gap-2">
                <p>No spaces whitelisted yet</p>
                <p className="text-xs text-gray-300">Add spaces from the left list</p>
              </div>
            ) : (
              <div className="space-y-1">
                {whitelistedSpaces.map((space) => (
                  <div key={space.id} className="group flex items-center justify-between rounded-lg p-3 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-medium text-xs">
                        {space.display_name?.charAt(0) || space.name.charAt(0)}
                      </div>
                      <span className="truncate text-sm font-medium text-gray-700" title={space.display_name || space.name}>
                        {space.display_name || space.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveFromWhitelist(space.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                      title="Remove from whitelist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
