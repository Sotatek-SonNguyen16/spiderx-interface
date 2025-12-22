"use client";

import { RotateCcw } from "lucide-react";

/**
 * QueueHeader Component
 * Minimal header for the swipe queue
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

interface QueueHeaderProps {
  title?: string;
  subtitle?: string;
  currentIndex: number;
  totalTasks: number;
  canUndo: boolean;
  onUndo: () => void;
}

export const QueueHeader = ({
  title = "Review Queue",
  subtitle = "Swipe to accept or skip tasks",
  currentIndex,
  totalTasks,
  canUndo,
  onUndo,
}: QueueHeaderProps) => {
  return (
    <div className="flex-none px-6 py-4 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          
          {/* Progress indicator */}
          {totalTasks > 0 && (
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {currentIndex + 1} of {totalTasks}
            </div>
          )}
        </div>
        
        {/* Undo button */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-50"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm font-medium">Undo</span>
        </button>
      </div>

      {/* Subtitle */}
      <p className="text-sm text-gray-500 mb-4">
        {subtitle}
      </p>

      {/* Progress Bar */}
      {totalTasks > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex) / totalTasks) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};