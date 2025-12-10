"use client";

import { ArrowRight, Trash2, Loader2 } from "lucide-react";
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
  onAction 
}: SpaceListItemProps) {
  const isWhitelisted = variant === "whitelisted";
  const displayName = space.display_name || space.name;

  return (
    <div 
      className={`group flex items-center justify-between rounded-lg p-3 transition-colors ${
        isWhitelisted 
          ? "hover:bg-red-50 border border-transparent hover:border-red-100" 
          : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div 
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-medium text-xs ${
            isWhitelisted 
              ? "bg-green-100 text-green-600" 
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span 
          className="truncate text-sm font-medium text-gray-700" 
          title={displayName}
        >
          {displayName}
        </span>
      </div>
      
      <button
        onClick={() => onAction(space)}
        disabled={isUpdating}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:opacity-50 ${
          isWhitelisted
            ? "text-gray-400 hover:bg-red-100 hover:text-red-600"
            : "text-gray-400 hover:bg-blue-50 hover:text-blue-600"
        }`}
        title={isWhitelisted ? "Remove from whitelist" : "Add to whitelist"}
      >
        {isUpdating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isWhitelisted ? (
          <Trash2 className="h-4 w-4" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export default SpaceListItem;
