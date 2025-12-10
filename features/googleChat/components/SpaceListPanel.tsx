"use client";

import { useState, useMemo } from "react";
import { Search, Loader2 } from "lucide-react";
import { SpaceListItem } from "./SpaceListItem";
import type { GoogleChatSpace } from "../types";

interface SpaceListPanelProps {
  title: string;
  spaces: GoogleChatSpace[];
  variant: "available" | "whitelisted";
  isLoading?: boolean;
  updatingSpaceId?: string | null;
  showSearch?: boolean;
  showCount?: boolean;
  emptyMessage?: string;
  emptySubMessage?: string;
  onSpaceAction: (space: GoogleChatSpace) => void;
}

export function SpaceListPanel({
  title,
  spaces,
  variant,
  isLoading = false,
  updatingSpaceId = null,
  showSearch = false,
  showCount = false,
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

  return (
    <div className="flex flex-1 flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden h-full">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gray-50 p-4 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">{title}</h3>
          {showCount && (
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600">
              {spaces.length}
            </span>
          )}
        </div>
        
        {showSearch && (
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
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && spaces.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-gray-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : filteredSpaces.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-gray-400 text-sm gap-2">
            <p>{searchQuery ? "No matching spaces found" : emptyMessage}</p>
            {emptySubMessage && !searchQuery && (
              <p className="text-xs text-gray-300">{emptySubMessage}</p>
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
