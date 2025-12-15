"use client";

import { Plus, X, Loader2, Check } from "lucide-react";
import type { GoogleChatSpace } from "../types";

interface SpaceListItemProps {
  space: GoogleChatSpace;
  variant: "available" | "whitelisted";
  isUpdating?: boolean;
  onAction: (space: GoogleChatSpace) => void;
}

export function SpaceListItem({
  space,
  variant,
  isUpdating = false,
  onAction,
}: SpaceListItemProps) {
  const isWhitelisted = variant === "whitelisted";
  const displayName = space.display_name || space.name;

  return (
    <div
      className={`group flex items-center justify-between rounded-xl p-3.5 min-h-[56px] transition-all duration-200 ${
        isWhitelisted
          ? "bg-white border border-blue-100 hover:border-red-200 hover:bg-red-50/30"
          : "bg-white border border-transparent hover:bg-blue-50 hover:border-blue-100"
      }`}
    >
      {/* Left: Avatar + Name */}
      <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
        {/* Avatar */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold text-sm ${
            isWhitelisted
              ? "bg-gradient-to-br from-green-100 to-emerald-100 text-green-700"
              : "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700"
          }`}
        >
          {displayName.charAt(0).toUpperCase()}
        </div>

        {/* Name + Status */}
        <div className="flex flex-col overflow-hidden">
          <span
            className="truncate text-sm font-medium text-gray-800"
            title={displayName}
          >
            {displayName}
          </span>
          {isWhitelisted && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <Check className="h-3 w-3" />
              Enabled
            </span>
          )}
        </div>
      </div>

      {/* Right: Action Button */}
      <button
        onClick={() => onAction(space)}
        disabled={isUpdating}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all disabled:opacity-50 shrink-0 ${
          isWhitelisted
            ? "text-gray-400 hover:text-red-600 hover:bg-red-100 group-hover:text-red-500"
            : "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
        } ${
          /* Show on hover for available, always visible for whitelisted on mobile */
          isWhitelisted
            ? "opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            : ""
        }`}
        title={isWhitelisted ? "Remove from enabled" : "Enable for extraction"}
      >
        {isUpdating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isWhitelisted ? (
          <>
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Remove</span>
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            <span>Enable</span>
          </>
        )}
      </button>
    </div>
  );
}

export default SpaceListItem;
