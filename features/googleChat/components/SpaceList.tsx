"use client";

import { useState, useCallback } from "react";
import { Check, MessageSquare, Users, Loader2 } from "lucide-react";
import type { GoogleChatSpace } from "../types";

interface SpaceListProps {
  spaces: GoogleChatSpace[];
  loading?: boolean;
  onToggleWhitelist: (spaceId: string, isWhitelisted: boolean) => void;
  onSave?: () => void;
  showSaveButton?: boolean;
}

/**
 * SpaceList - Optimized list component for displaying Google Chat spaces
 * Features: skeleton loaders, optimistic updates, success feedback
 */
export const SpaceList = ({
  spaces,
  loading = false,
  onToggleWhitelist,
  onSave,
  showSaveButton = true,
}: SpaceListProps) => {
  const [pendingToggles, setPendingToggles] = useState<Set<string>>(new Set());
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleToggle = useCallback((spaceId: string, currentStatus: boolean) => {
    // Add to pending for optimistic UI
    setPendingToggles((prev) => new Set(prev).add(spaceId));
    
    // Call parent handler
    onToggleWhitelist(spaceId, !currentStatus);
    
    // Remove from pending after a short delay
    setTimeout(() => {
      setPendingToggles((prev) => {
        const next = new Set(prev);
        next.delete(spaceId);
        return next;
      });
    }, 300);
  }, [onToggleWhitelist]);

  const handleSave = useCallback(() => {
    onSave?.();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  }, [onSave]);

  // Skeleton loader
  if (loading && spaces.length === 0) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse"
          >
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
            <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (spaces.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No spaces found</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Try adjusting your search or connect to Google Chat
        </p>
      </div>
    );
  }

  const whitelistedCount = spaces.filter((s) => s.is_whitelisted).length;

  return (
    <div className="space-y-4">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {whitelistedCount} of {spaces.length} spaces selected
        </p>
        {loading && (
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
        )}
      </div>

      {/* Space list */}
      <div className="space-y-2">
        {spaces.map((space) => {
          const isPending = pendingToggles.has(space.id);
          
          return (
            <div
              key={space.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ${
                space.is_whitelisted
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              } ${isPending ? "opacity-70" : ""}`}
            >
              {/* Icon */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                space.is_whitelisted
                  ? "bg-blue-100 dark:bg-blue-800"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}>
                {space.space_type === "DIRECT_MESSAGE" ? (
                  <Users className={`w-5 h-5 ${
                    space.is_whitelisted ? "text-blue-600" : "text-gray-500"
                  }`} />
                ) : (
                  <MessageSquare className={`w-5 h-5 ${
                    space.is_whitelisted ? "text-blue-600" : "text-gray-500"
                  }`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium truncate ${
                  space.is_whitelisted
                    ? "text-blue-900 dark:text-blue-100"
                    : "text-gray-900 dark:text-white"
                }`}>
                  {space.display_name || space.name}
                </h3>
                {space.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {space.description}
                  </p>
                )}
              </div>

              {/* Toggle */}
              <button
                onClick={() => handleToggle(space.id, space.is_whitelisted)}
                disabled={isPending}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  space.is_whitelisted
                    ? "bg-blue-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                    space.is_whitelisted ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Save button */}
      {showSaveButton && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          {savedFeedback ? (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-4 h-4" />
              <span className="text-sm">Changes saved successfully!</span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">
              {whitelistedCount} space{whitelistedCount !== 1 ? "s" : ""} will be monitored
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default SpaceList;
