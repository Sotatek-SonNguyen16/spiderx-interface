import { create } from "zustand";
import type { ScopePreset, ScopeFilter } from "../components/ScopeSettings";
import type { AIMode } from "../components/AIExtractionSettings";
import type {
  TitleFormat,
  AssigneeOption,
  PriorityOption,
} from "../components/TaskOutputPreview";
import type { LowConfidenceBehavior } from "../components/ReviewSafetySettings";

interface IntegrationSettingsState {
  // Connection status
  connectionStatus: "connected" | "needs_reauth" | "error" | "disconnected";
  lastSyncTime: string;
  messagesScannedToday: number;
  tasksCreatedToday: number;

  // Scope settings
  scopePreset: ScopePreset;
  sources: {
    directMessages: boolean;
    groupChats: boolean;
    spaces: boolean;
  };
  filters: ScopeFilter[];

  // AI Extraction settings
  aiMode: AIMode;
  detectionRules: {
    actionVerbs: boolean;
    assignee: boolean;
    deadline: boolean;
  };
  sensitivity: number;

  // Task Output settings
  titleFormat: TitleFormat;
  assigneeOption: AssigneeOption;
  priorityOption: PriorityOption;
  autoTag: boolean;

  // Review & Safety settings
  confidenceThreshold: number;
  lowConfidenceBehavior: LowConfidenceBehavior;
  undoWindow: boolean;
  undoMinutes: number;

  // Activity logs
  dateRange: "today" | "week" | "month";
  resultFilter: "all" | "created" | "skipped" | "review";

  // Actions
  setScopePreset: (preset: ScopePreset) => void;
  setSource: (
    source: keyof IntegrationSettingsState["sources"],
    enabled: boolean
  ) => void;
  toggleFilter: (filterId: string) => void;
  setAIMode: (mode: AIMode) => void;
  toggleDetectionRule: (
    rule: keyof IntegrationSettingsState["detectionRules"]
  ) => void;
  setSensitivity: (value: number) => void;
  setTitleFormat: (format: TitleFormat) => void;
  setAssigneeOption: (option: AssigneeOption) => void;
  setPriorityOption: (option: PriorityOption) => void;
  setAutoTag: (enabled: boolean) => void;
  setConfidenceThreshold: (value: number) => void;
  setLowConfidenceBehavior: (behavior: LowConfidenceBehavior) => void;
  setUndoWindow: (enabled: boolean) => void;
  setUndoMinutes: (minutes: number) => void;
  setDateRange: (range: "today" | "week" | "month") => void;
  setResultFilter: (filter: "all" | "created" | "skipped" | "review") => void;
}

export const useIntegrationSettingsStore = create<IntegrationSettingsState>(
  (set) => ({
    // Initial state - Connection
    connectionStatus: "connected",
    lastSyncTime: "5 min ago",
    messagesScannedToday: 124,
    tasksCreatedToday: 12,

    // Initial state - Scope
    scopePreset: "recommended",
    sources: {
      directMessages: true,
      groupChats: true,
      spaces: false,
    },
    filters: [
      {
        id: "mentions",
        label: "Only when I'm mentioned",
        enabled: true,
        icon: null,
      },
      { id: "exclude_bots", label: "Exclude bots", enabled: false, icon: null },
      {
        id: "exclude_old",
        label: "Exclude messages older than 7 days",
        enabled: false,
        icon: null,
      },
    ],

    // Initial state - AI Extraction
    aiMode: "smart",
    detectionRules: {
      actionVerbs: true,
      assignee: true,
      deadline: true,
    },
    sensitivity: 65,

    // Initial state - Task Output
    titleFormat: "ai_summary",
    assigneeOption: "detected",
    priorityOption: "detected",
    autoTag: true,

    // Initial state - Review & Safety
    confidenceThreshold: 80,
    lowConfidenceBehavior: "review_queue",
    undoWindow: true,
    undoMinutes: 10,

    // Initial state - Activity
    dateRange: "today",
    resultFilter: "all",

    // Actions
    setScopePreset: (preset) => set({ scopePreset: preset }),
    setSource: (source, enabled) =>
      set((state) => ({
        sources: { ...state.sources, [source]: enabled },
      })),
    toggleFilter: (filterId) =>
      set((state) => ({
        filters: state.filters.map((f) =>
          f.id === filterId ? { ...f, enabled: !f.enabled } : f
        ),
      })),
    setAIMode: (mode) => set({ aiMode: mode }),
    toggleDetectionRule: (rule) =>
      set((state) => ({
        detectionRules: {
          ...state.detectionRules,
          [rule]: !state.detectionRules[rule],
        },
      })),
    setSensitivity: (value) => set({ sensitivity: value }),
    setTitleFormat: (format) => set({ titleFormat: format }),
    setAssigneeOption: (option) => set({ assigneeOption: option }),
    setPriorityOption: (option) => set({ priorityOption: option }),
    setAutoTag: (enabled) => set({ autoTag: enabled }),
    setConfidenceThreshold: (value) => set({ confidenceThreshold: value }),
    setLowConfidenceBehavior: (behavior) =>
      set({ lowConfidenceBehavior: behavior }),
    setUndoWindow: (enabled) => set({ undoWindow: enabled }),
    setUndoMinutes: (minutes) => set({ undoMinutes: minutes }),
    setDateRange: (range) => set({ dateRange: range }),
    setResultFilter: (filter) => set({ resultFilter: filter }),
  })
);
