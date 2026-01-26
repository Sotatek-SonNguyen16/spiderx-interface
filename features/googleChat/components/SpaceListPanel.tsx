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
    ? "flex flex-1 flex-col rounded-xl border-2 border-primary/20 bg-surface shadow-s1 overflow-hidden h-full"
    : "flex flex-1 flex-col rounded-xl border border-border bg-surface shadow-s1 overflow-hidden h-full";

  const headerClasses = isOutputPanel
    ? "border-b border-primary/10 bg-primarySoft/30 p-4 shrink-0"
    : "border-b border-border bg-bg/50 p-4 shrink-0";

  return (
    <div className={panelClasses}>
      {/* Header */}
      <div className={headerClasses}>
        <div className="flex items-center justify-between">
          <div>
            <h3
              className={`font-bold ${
                isOutputPanel ? "text-primary" : "text-ink"
              }`}
            >
              {title}
            </h3>
            {subtitle && <p className="text-xs text-ink3 mt-0.5">{subtitle}</p>}
          </div>
          {showCount && (
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                isOutputPanel
                  ? "bg-primarySoft text-primary"
                  : "bg-surface2 text-ink2"
              }`}
            >
              {spaces.length}
            </span>
          )}
        </div>

        {showSearch && (
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink3" />
            <input
              type="text"
              placeholder="🔍 Search spaces by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primarySoft transition-all"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading && spaces.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-ink3">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredSpaces.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center px-4">
            {searchQuery ? (
              /* Search No Results */
              <>
                <Search className="h-10 w-10 text-ink3/40 mb-3" />
                <p className="text-sm font-medium text-ink2">No spaces found</p>
                <p className="text-xs text-ink3 mt-1">Try another keyword</p>
              </>
            ) : (
              /* Empty State */
              <>
                <Inbox
                  className={`h-12 w-12 mb-3 ${
                    isOutputPanel ? "text-primary/20" : "text-ink3/20"
                  }`}
                />
                <p
                  className={`text-sm font-medium ${
                    isOutputPanel ? "text-primary" : "text-ink2"
                  }`}
                >
                  {emptyMessage}
                </p>
                {emptySubMessage && (
                  <p className="text-xs text-ink3 mt-1.5 max-w-[200px]">
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
