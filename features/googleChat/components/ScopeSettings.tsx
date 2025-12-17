"use client";

import { useState, useCallback } from "react";
import {
  Check,
  Plus,
  X,
  Filter,
  Users,
  MessageSquare,
  AtSign,
  Bot,
  Clock,
} from "lucide-react";

export type ScopePreset = "recommended" | "everything" | "strict";

export interface ScopeFilter {
  id: string;
  label: string;
  enabled: boolean;
  icon: React.ReactNode;
}

interface ScopeSettingsProps {
  preset: ScopePreset;
  onPresetChange: (preset: ScopePreset) => void;
  sources: {
    directMessages: boolean;
    groupChats: boolean;
    spaces: boolean;
  };
  onSourceChange: (
    source: keyof ScopeSettingsProps["sources"],
    enabled: boolean
  ) => void;
  filters: ScopeFilter[];
  onFilterToggle: (filterId: string) => void;
  onManageSpaces?: () => void;
}

const presets: { value: ScopePreset; label: string; description: string }[] = [
  {
    value: "recommended",
    label: "Recommended",
    description: "Mentions & direct messages",
  },
  {
    value: "everything",
    label: "Everything",
    description: "All selected spaces",
  },
  {
    value: "strict",
    label: "Strict",
    description: "Only explicit tasks",
  },
];

export const ScopeSettings = ({
  preset,
  onPresetChange,
  sources,
  onSourceChange,
  filters,
  onFilterToggle,
  onManageSpaces,
}: ScopeSettingsProps) => {
  const [showAddFilter, setShowAddFilter] = useState(false);

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
          <Filter className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            What gets synced
          </h2>
          <p className="text-sm text-gray-500">
            Control which messages are scanned for tasks
          </p>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Quick presets
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {presets.map((p) => (
            <button
              key={p.value}
              onClick={() => onPresetChange(p.value)}
              className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all ${
                preset === p.value
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-gray-100 hover:border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    preset === p.value
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {preset === p.value && (
                    <Check className="h-2.5 w-2.5 text-white" />
                  )}
                </div>
                <span className="font-medium text-gray-900">{p.label}</span>
              </div>
              <span className="text-xs text-gray-500 ml-6">
                {p.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Source Selection */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Sources
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={sources.directMessages}
              onChange={(e) =>
                onSourceChange("directMessages", e.target.checked)
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <MessageSquare className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">Direct messages</span>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={sources.groupChats}
              onChange={(e) => onSourceChange("groupChats", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">Group chats</span>
          </label>
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={sources.spaces}
              onChange={(e) => onSourceChange("spaces", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">Spaces</span>
            {sources.spaces && onManageSpaces && (
              <button
                onClick={onManageSpaces}
                className="ml-auto text-xs text-blue-600 font-medium hover:underline"
              >
                Select spaces →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters (Rule Chips) */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Filters
        </label>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterToggle(filter.id)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filter.enabled
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {filter.enabled ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

// Default filters for initial state
export const defaultFilters: ScopeFilter[] = [
  {
    id: "mentions",
    label: "Only when I'm mentioned",
    enabled: true,
    icon: <AtSign className="h-3.5 w-3.5" />,
  },
  {
    id: "exclude_bots",
    label: "Exclude bots",
    enabled: false,
    icon: <Bot className="h-3.5 w-3.5" />,
  },
  {
    id: "exclude_old",
    label: "Exclude messages older than 7 days",
    enabled: false,
    icon: <Clock className="h-3.5 w-3.5" />,
  },
];
