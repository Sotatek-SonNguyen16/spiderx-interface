"use client";

import { Sparkles } from "lucide-react";

/**
 * AIBadge Component
 * Displays "✨ AI detected task" with source information
 * 
 * Requirements: 2.2
 */

interface AIBadgeProps {
  isAIDetected: boolean;
  sourceType: string;
  sourceName?: string | null;
}

export const AIBadge = ({ isAIDetected, sourceType, sourceName }: AIBadgeProps) => {
  if (!isAIDetected) return null;

  const getSourceLabel = () => {
    switch (sourceType) {
      case 'chat':
        return 'Google Chat';
      case 'email':
        return 'Email';
      case 'meeting':
        return 'Meeting';
      default:
        return sourceType;
    }
  };

  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 rounded-full">
        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
        <span className="text-xs font-medium text-purple-700">
          AI detected task
        </span>
      </div>
      <span className="text-xs text-gray-500">
        From {sourceName || getSourceLabel()}
      </span>
    </div>
  );
};
