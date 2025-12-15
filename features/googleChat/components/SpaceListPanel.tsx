"use client";

import { useState, useMemo } from "react";
import { Search, Loader2, Inbox } from "lucide-react";
import { SpaceListItem } from "./SpaceListItem";
import type { GoogleChatSpace } from "../types";

interface SpaceListPanelProps {
  title: string;
  subtitle?: string;
  spaces: GoogleChatSpace[];
  variant: "available" | "whitelisted";
  isLoading?: boolean;
  updatingSpaceId?: string | null;
  showSearch?: boolean;
  showCount?: boolean;
  isOutputPanel?: boolean;
  emptyMessage?: string;
  emptySubMessage?: string;
  onSpaceAction: (space: GoogleChatSpace) => void;
}

export function SpaceListPanel({
  title,
  subtitle,
  spaces,
  variant,
  isLoading = false,
  updatingSpaceId = null,
  showSearch = false,
  showCount = false,
  isOutputPanel = false,
  emptyMessage = "No spaces",
  emptySubMessage,
  onSpaceAction,
}: SpaceListPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSpaces = useMemo(() => {
    if (!searchQuery.trim()) return spaces;

    const query = searchQuery.toLowerCase();
    return spaces.filter((space) => {
      const name = (space.display_name || space.name).toLowerCase();
      return name.includes(query);
    });
  }, [spaces, searchQuery]);

  // Panel styling based on whether it's the output panel
  const panelClasses = isOutputPanel
    ? "flex flex-1 flex-col rounded-xl border-2 border-blue-200 bg-gradient-to-b from-blue-50/50 to-white shadow-sm overflow-hidden h-full"
    : "flex flex-1 flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden h-full";

  const headerClasses = isOutputPanel
    ? "border-b border-blue-100 bg-blue-50/80 p-4 shrink-0"
    : "border-b border-gray-100 bg-gray-50 p-4 shrink-0";

  return (
    <div className={panelClasses}>
      {/* Header */}
      <div className={headerClasses}>
        <div className="flex items-center justify-between">
          <div>
            <h3
              className={`font-bold ${
                isOutputPanel ? "text-blue-900" : "text-gray-800"
              }`}
            >
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {showCount && (
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                isOutputPanel
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {spaces.length}
            </span>
          )}
        </div>

        {showSearch && (
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="🔍 Search spaces by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading && spaces.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredSpaces.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center px-4">
            {searchQuery ? (
              /* Search No Results */
              <>
                <Search className="h-10 w-10 text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-500">
                  No spaces found
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try another keyword
                </p>
              </>
            ) : (
              /* Empty State */
              <>
                <Inbox
                  className={`h-12 w-12 mb-3 ${
                    isOutputPanel ? "text-blue-200" : "text-gray-200"
                  }`}
                />
                <p
                  className={`text-sm font-medium ${
                    isOutputPanel ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {emptyMessage}
                </p>
                {emptySubMessage && (
                  <p className="text-xs text-gray-400 mt-1.5 max-w-[200px]">
                    {emptySubMessage}
                  </p>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredSpaces.map((space) => (
              <SpaceListItem
                key={space.id}
                space={space}
                variant={variant}
                isUpdating={updatingSpaceId === space.id}
                onAction={onSpaceAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SpaceListPanel;
