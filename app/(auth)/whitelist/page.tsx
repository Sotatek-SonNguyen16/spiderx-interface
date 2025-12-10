"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, RefreshCw } from "lucide-react";

import { useSyncTodo } from "@/features/todos/hooks/useSyncTodo";
import { SyncSuccessView } from "@/features/todos/components/SyncSuccessView";
import { useWhitelistManagement } from "@/features/googleChat/hooks/useWhitelistManagement";
import { WhitelistHeader } from "@/features/googleChat/components/WhitelistHeader";
import { WhitelistContent } from "@/features/googleChat/components/WhitelistContent";

export default function WhitelistPage() {
  const router = useRouter();
  
  // Custom hook for whitelist data and actions
  const {
    whitelistedSpaces,
    availableSpaces,
    isLoading,
    updatingSpaceId,
    message: whitelistMessage,
    handleAddToWhitelist,
    handleRemoveFromWhitelist,
    setMessage: setWhitelistMessage
  } = useWhitelistManagement();

  // Sync hook
  const {
    isSyncing,
    syncError,
    taskStatus,
    taskProgress,
    lastSyncResult,
    syncTodos,
    cancelSync,
    clearError,
  } = useSyncTodo();

  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(null);

  // Generate todos handler
  const handleGenerateTodos = async () => {
    setWhitelistMessage(null);
    setSyncErrorMessage(null);
    clearError();

    const result = await syncTodos({
      autoSave: true,
      limitPerSpace: 100,
    });

    if (result.success) {
      setGenerateSuccess(true);
    } else {
      setSyncErrorMessage(result.error || "Failed to generate todos");
    }
  };

  // Cancel sync handler
  const handleCancelSync = async () => {
    const result = await cancelSync();
    if (!result.success) {
      setSyncErrorMessage(result.error || "Failed to cancel sync");
    }
  };

  // Sync more handler
  const handleSyncMore = () => {
    setGenerateSuccess(false);
    clearError();
  };

  // Render Sync Success View
  if (generateSuccess && lastSyncResult) {
    return (
      <SyncSuccessView
        result={lastSyncResult}
        onOpenQueue={() => router.push("/todos")}
        onSyncMore={handleSyncMore}
      />
    );
  }

  // Combine messages (whitelist error or sync error)
  const activeMessage = whitelistMessage ?? (syncErrorMessage || syncError ? { type: "error", text: syncErrorMessage || syncError || "Error" } : null);

  return (
    <div className="flex h-screen flex-col p-6 md:p-8 overflow-hidden bg-white">
      <WhitelistHeader
        isSyncing={isSyncing}
        isLoading={isLoading}
        hasWhitelistedSpaces={whitelistedSpaces.length > 0}
        taskStatus={taskStatus}
        taskProgress={taskProgress}
        onGenerateTodos={handleGenerateTodos}
        onCancelSync={handleCancelSync}
      />

      {/* Messages */}
      {activeMessage && (
        <div
          className={`mb-6 rounded-lg p-4 text-sm flex items-center gap-2 shrink-0 ${
            activeMessage.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}
        >
          {activeMessage.type === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {activeMessage.text}
        </div>
      )}

      <WhitelistContent
        availableSpaces={availableSpaces}
        whitelistedSpaces={whitelistedSpaces}
        isLoading={isLoading}
        updatingSpaceId={updatingSpaceId}
        onAddToWhitelist={handleAddToWhitelist}
        onRemoveFromWhitelist={handleRemoveFromWhitelist}
      />
    </div>
  );
}

