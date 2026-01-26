/**
 * AI Inbox Store
 * Zustand store for managing AI Inbox state
 */

import { create } from "zustand";
import type {
  TodoSuggestion,
  SuggestionWithConfidenceLevel,
  SuggestionFilters,
  SortOptions,
  ReviewStatus,
  ConfidenceLevel,
} from "../types";
import * as aiInboxApi from "../api/aiInbox.api";
import {
  enrichSuggestions,
  filterSuggestions,
  sortSuggestions,
} from "../services/aiInbox.service";

interface AiInboxState {
  // Data
  suggestions: SuggestionWithConfidenceLevel[];
  selectedSuggestionIds: Set<string>;

  // Filters & Sort
  filters: SuggestionFilters;
  sort: SortOptions;

  // Pagination
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;

  // Loading states
  loading: boolean;
  accepting: Set<string>;
  rejecting: Set<string>;
  updating: Set<string>;

  // Error
  error: string | null;

  // Actions
  loadSuggestions: (params?: { reset?: boolean }) => Promise<void>;
  refreshSuggestions: () => Promise<void>;

  // Selection
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;

  // Filters & Sort
  setFilters: (filters: Partial<SuggestionFilters>) => void;
  setSort: (sort: SortOptions) => void;
  resetFilters: () => void;

  // Actions on suggestions
  acceptSuggestion: (id: string, edits?: any) => Promise<void>;
  rejectSuggestion: (id: string, reason?: any) => Promise<void>;
  updateSuggestion: (id: string, data: any) => Promise<void>;
  bulkAccept: () => Promise<void>;
  bulkReject: (reason?: any) => Promise<void>;

  // Computed
  getFilteredSuggestions: () => SuggestionWithConfidenceLevel[];
  getPendingCount: () => number;
}

const DEFAULT_FILTERS: SuggestionFilters = {
  status: "all",
  context_id: null,
  source_type: null,
  confidence_level: null,
  search: "",
};

const DEFAULT_SORT: SortOptions = {
  field: "created_at",
  order: "desc",
};

export const useAiInboxStore = create<AiInboxState>((set, get) => ({
  // Initial state
  suggestions: [],
  selectedSuggestionIds: new Set(),
  filters: DEFAULT_FILTERS,
  sort: DEFAULT_SORT,
  total: 0,
  offset: 0,
  limit: 20,
  hasMore: false,
  loading: false,
  accepting: new Set(),
  rejecting: new Set(),
  updating: new Set(),
  error: null,

  // Load suggestions
  loadSuggestions: async ({ reset = false } = {}) => {
    const state = get();

    if (reset) {
      set({ offset: 0, suggestions: [] });
    }

    set({ loading: true, error: null });

    try {
      const params = {
        status:
          state.filters.status !== "all" ? state.filters.status : undefined,
        context_id: state.filters.context_id || undefined,
        source_type: state.filters.source_type || undefined,
        limit: state.limit,
        offset: reset ? 0 : state.offset,
        sort_by: state.sort.field,
        sort_order: state.sort.order,
        search: state.filters.search || undefined,
      };

      const response = await aiInboxApi.getSuggestions(params);
      const enriched = enrichSuggestions(response.items);

      set((prevState) => ({
        suggestions: reset ? enriched : [...prevState.suggestions, ...enriched],
        total: response.total,
        offset: (reset ? 0 : prevState.offset) + enriched.length,
        hasMore: enriched.length === state.limit,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to load suggestions",
        loading: false,
      });
    }
  },

  // Refresh suggestions
  refreshSuggestions: async () => {
    await get().loadSuggestions({ reset: true });
  },

  // Toggle selection
  toggleSelection: (id: string) => {
    set((state) => {
      const newSet = new Set(state.selectedSuggestionIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { selectedSuggestionIds: newSet };
    });
  },

  // Select all visible suggestions
  selectAll: () => {
    set((state) => {
      const filtered = get().getFilteredSuggestions();
      const allIds = filtered.map((s) => s.suggestion_id);
      return { selectedSuggestionIds: new Set(allIds) };
    });
  },

  // Clear selection
  clearSelection: () => {
    set({ selectedSuggestionIds: new Set() });
  },

  // Set filters
  setFilters: (newFilters: Partial<SuggestionFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      offset: 0,
    }));
    // Auto-reload with new filters
    get().refreshSuggestions();
  },

  // Set sort
  setSort: (sort: SortOptions) => {
    set({ sort, offset: 0 });
    // Auto-reload with new sort
    get().refreshSuggestions();
  },

  // Reset filters
  resetFilters: () => {
    set({ filters: DEFAULT_FILTERS, offset: 0 });
    get().refreshSuggestions();
  },

  // Accept suggestion
  acceptSuggestion: async (id: string, edits?: any) => {
    set((state) => ({
      accepting: new Set(state.accepting).add(id),
    }));

    try {
      await aiInboxApi.acceptSuggestion(
        id,
        edits ? { apply_edits: edits } : undefined
      );

      // Remove from list and refresh
      set((state) => ({
        suggestions: state.suggestions.filter((s) => s.suggestion_id !== id),
        accepting: new Set(
          [...state.accepting].filter((accId) => accId !== id)
        ),
      }));

      // Clear from selection if selected
      get().toggleSelection(id);
    } catch (error: any) {
      set((state) => ({
        accepting: new Set(
          [...state.accepting].filter((accId) => accId !== id)
        ),
        error: error.message || "Failed to accept suggestion",
      }));
      throw error;
    }
  },

  // Reject suggestion
  rejectSuggestion: async (id: string, reason?: any) => {
    set((state) => ({
      rejecting: new Set(state.rejecting).add(id),
    }));

    try {
      await aiInboxApi.rejectSuggestion(id, reason);

      // Remove from list
      set((state) => ({
        suggestions: state.suggestions.filter((s) => s.suggestion_id !== id),
        rejecting: new Set(
          [...state.rejecting].filter((rejId) => rejId !== id)
        ),
      }));

      // Clear from selection if selected
      get().toggleSelection(id);
    } catch (error: any) {
      set((state) => ({
        rejecting: new Set(
          [...state.rejecting].filter((rejId) => rejId !== id)
        ),
        error: error.message || "Failed to reject suggestion",
      }));
      throw error;
    }
  },

  // Update suggestion
  updateSuggestion: async (id: string, data: any) => {
    set((state) => ({
      updating: new Set(state.updating).add(id),
    }));

    try {
      const updated = await aiInboxApi.updateSuggestion(id, data);

      set((state) => ({
        suggestions: state.suggestions.map((s) =>
          s.suggestion_id === id
            ? { ...s, ...updated, confidenceLevel: s.confidenceLevel }
            : s
        ),
        updating: new Set([...state.updating].filter((upId) => upId !== id)),
      }));
    } catch (error: any) {
      set((state) => ({
        updating: new Set([...state.updating].filter((upId) => upId !== id)),
        error: error.message || "Failed to update suggestion",
      }));
      throw error;
    }
  },

  // Bulk accept
  bulkAccept: async () => {
    const ids = Array.from(get().selectedSuggestionIds);
    if (ids.length === 0) return;

    set({ loading: true });

    try {
      const result = await aiInboxApi.bulkAcceptSuggestions(ids);

      // Remove accepted suggestions from list
      set((state) => ({
        suggestions: state.suggestions.filter(
          (s) => !ids.includes(s.suggestion_id)
        ),
        selectedSuggestionIds: new Set(),
        loading: false,
      }));

      if (result.failed_count > 0) {
        set({
          error: `Accepted ${result.success_count}, failed ${result.failed_count}`,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "Failed to bulk accept suggestions",
        loading: false,
      });
      throw error;
    }
  },

  // Bulk reject
  bulkReject: async (reason?: any) => {
    const ids = Array.from(get().selectedSuggestionIds);
    if (ids.length === 0) return;

    set({ loading: true });

    try {
      const result = await aiInboxApi.bulkRejectSuggestions(ids, reason);

      // Remove rejected suggestions from list
      set((state) => ({
        suggestions: state.suggestions.filter(
          (s) => !ids.includes(s.suggestion_id)
        ),
        selectedSuggestionIds: new Set(),
        loading: false,
      }));

      if (result.failed_count > 0) {
        set({
          error: `Rejected ${result.success_count}, failed ${result.failed_count}`,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "Failed to bulk reject suggestions",
        loading: false,
      });
      throw error;
    }
  },

  // Get filtered suggestions (client-side filtering if needed)
  getFilteredSuggestions: () => {
    const state = get();
    // Note: Most filtering is done server-side via API params
    // This is for additional client-side filtering if needed
    return state.suggestions;
  },

  // Get pending count
  getPendingCount: () => {
    return get().suggestions.filter((s) => s.review_status === "pending")
      .length;
  },
}));
