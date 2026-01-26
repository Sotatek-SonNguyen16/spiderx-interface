/**
 * AI Inbox Feature
 * Public exports for the AI Inbox feature
 */

// Types
export * from "./types";

// API
export * from "./api/aiInbox.api";

// Services
export * from "./services/aiInbox.service";

// Stores
export { useAiInboxStore } from "./stores/aiInbox.store";

// Hooks
export { useAiInbox } from "./hooks/useAiInbox";
export { useSuggestion } from "./hooks/useSuggestion";

// Components
export { AiInboxList } from "./components/AiInboxList";
export { SuggestionCard } from "./components/SuggestionCard";
export { SuggestionActions } from "./components/SuggestionActions";
export { SuggestionFilters } from "./components/SuggestionFilters";
export { BulkActions } from "./components/BulkActions";
export { SortControls } from "./components/SortControls";
export { ConfidenceBadge } from "./components/ConfidenceBadge";
export { EvidenceViewer } from "./components/EvidenceViewer";
export { QualityFlags } from "./components/QualityFlags";
