"use client";

import { MessageSquare } from "lucide-react";

/**
 * SourcePreview Component
 * Displays max 2 lines of source context with neutral background
 * 
 * Requirements: 2.5
 */

interface SourcePreviewProps {
  preview?: string | null;
  sourceType?: string;
}

export const SourcePreview = ({ preview, sourceType }: SourcePreviewProps) => {
  // Don't show for manual tasks or if no preview
  if (!preview || sourceType === 'manual') return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 mb-2">
        <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-xs font-medium text-gray-500">Original message</span>
      </div>
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-sm text-gray-600 leading-relaxed" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          "{preview}"
        </p>
      </div>
    </div>
  );
};
