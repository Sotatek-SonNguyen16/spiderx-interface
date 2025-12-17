"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useGoogleChat } from "@/features/googleChat";
import { IntegrationHeader } from "@/features/googleChat/components/IntegrationHeader";
import {
  ScopeSettings,
  defaultFilters,
} from "@/features/googleChat/components/ScopeSettings";
import { AIExtractionSettings } from "@/features/googleChat/components/AIExtractionSettings";
import { TaskOutputPreview } from "@/features/googleChat/components/TaskOutputPreview";
import { ReviewSafetySettings } from "@/features/googleChat/components/ReviewSafetySettings";
import {
  ActivityLogs,
  mockMetrics,
  mockLogs,
} from "@/features/googleChat/components/ActivityLogs";
import { useIntegrationSettingsStore } from "@/features/googleChat/stores/integrationSettingsStore";

export default function GoogleChatSettingsPage() {
  const router = useRouter();
  const { isConnected, disconnect, connect } = useGoogleChat();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Get state and actions from store
  const {
    connectionStatus,
    lastSyncTime,
    messagesScannedToday,
    tasksCreatedToday,
    scopePreset,
    sources,
    filters,
    aiMode,
    detectionRules,
    sensitivity,
    titleFormat,
    assigneeOption,
    priorityOption,
    autoTag,
    confidenceThreshold,
    lowConfidenceBehavior,
    undoWindow,
    undoMinutes,
    dateRange,
    resultFilter,
    setScopePreset,
    setSource,
    toggleFilter,
    setAIMode,
    toggleDetectionRule,
    setSensitivity,
    setTitleFormat,
    setAssigneeOption,
    setPriorityOption,
    setAutoTag,
    setConfidenceThreshold,
    setLowConfidenceBehavior,
    setUndoWindow,
    setUndoMinutes,
    setDateRange,
    setResultFilter,
  } = useIntegrationSettingsStore();

  // Use defaultFilters with icons for UI
  const filtersWithIcons = defaultFilters.map((df) => ({
    ...df,
    enabled: filters.find((f) => f.id === df.id)?.enabled ?? df.enabled,
  }));

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDisconnect = async () => {
    if (
      !confirm(
        "Are you sure you want to disconnect Google Chat? This will stop syncing todos from your messages."
      )
    )
      return;
    await disconnect();
    router.push("/integration");
  };

  const handleReconnect = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      "/api/auth/chat/login",
      "google-auth",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Navigation */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-3">
          <button
            onClick={() => router.push("/integration")}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Integrations
          </button>
        </div>
      </div>

      {/* Integration Header */}
      <IntegrationHeader
        platformName="Google Chat"
        platformIcon="/images/Google-Chat.png"
        isConnected={isConnected}
        connectionStatus={isConnected ? "connected" : "disconnected"}
        lastSyncTime={lastSyncTime}
        messagesScannedToday={messagesScannedToday}
        tasksCreatedToday={tasksCreatedToday}
        isSaving={isSaving}
        onSave={handleSave}
        onReconnect={handleReconnect}
        onDisconnect={handleDisconnect}
      />

      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl bg-green-600 text-white text-sm font-medium shadow-lg">
          Settings saved successfully!
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">
        {/* Section 1: Scope Settings */}
        <ScopeSettings
          preset={scopePreset}
          onPresetChange={setScopePreset}
          sources={sources}
          onSourceChange={setSource}
          filters={filtersWithIcons}
          onFilterToggle={toggleFilter}
          onManageSpaces={() => router.push("/whitelist")}
        />

        {/* Section 2: AI Extraction Settings */}
        <AIExtractionSettings
          mode={aiMode}
          onModeChange={setAIMode}
          detectionRules={detectionRules}
          onRuleToggle={toggleDetectionRule}
          sensitivity={sensitivity}
          onSensitivityChange={setSensitivity}
        />

        {/* Section 3: Task Output with Preview */}
        <TaskOutputPreview
          titleFormat={titleFormat}
          onTitleFormatChange={setTitleFormat}
          assignee={assigneeOption}
          onAssigneeChange={setAssigneeOption}
          priority={priorityOption}
          onPriorityChange={setPriorityOption}
          autoTag={autoTag}
          onAutoTagChange={setAutoTag}
        />

        {/* Section 4: Review & Safety */}
        <ReviewSafetySettings
          confidenceThreshold={confidenceThreshold}
          onConfidenceThresholdChange={setConfidenceThreshold}
          lowConfidenceBehavior={lowConfidenceBehavior}
          onLowConfidenceBehaviorChange={setLowConfidenceBehavior}
          undoWindow={undoWindow}
          onUndoWindowChange={setUndoWindow}
          undoMinutes={undoMinutes}
          onUndoMinutesChange={setUndoMinutes}
        />

        {/* Section 5: Activity Logs */}
        <ActivityLogs
          metrics={mockMetrics}
          logs={mockLogs}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          resultFilter={resultFilter}
          onResultFilterChange={setResultFilter}
        />
      </div>
    </div>
  );
}
