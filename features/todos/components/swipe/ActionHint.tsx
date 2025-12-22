"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * ActionHint Component
 * Displays "← Skip" on left, "Accept →" on right
 * No button styling, neutral color, positioned at bottom
 * 
 * Requirements: 2.6
 */

export const ActionHint = () => {
  return (
    <div className="flex items-center justify-between text-sm text-gray-400 mt-auto pt-4">
      <div className="flex items-center gap-1">
        <ChevronLeft className="w-4 h-4" />
        <span>Skip</span>
      </div>
      <div className="flex items-center gap-1">
        <span>Accept</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
};
