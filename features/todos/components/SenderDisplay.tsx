"use client";

import { User } from "lucide-react";

interface SenderDisplayProps {
  senderName: string | null;
  senderEmail?: string | null;
  showFallback?: boolean;
  className?: string;
}

/**
 * SenderDisplay - Display message sender information
 * **Feature: fe-update-v1, Property 6: Sender Information Display**
 * **Validates: Requirements 4.1, 4.2, 4.3**
 * 
 * For any todo with source_type='chat':
 * - If sender_name exists, it SHALL be displayed
 * - If sender_name is null/undefined, a fallback indicator SHALL be shown
 */
export const SenderDisplay = ({
  senderName,
  senderEmail,
  showFallback = true,
  className = "",
}: SenderDisplayProps) => {
  // If no sender info and fallback is disabled, don't render
  if (!senderName && !showFallback) {
    return null;
  }

  // Determine display text
  const displayText = senderName || (showFallback ? "Unknown sender" : null);
  
  if (!displayText) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <User className="w-3.5 h-3.5 text-gray-400" />
      <span 
        className={`text-xs ${
          senderName 
            ? "text-gray-600 dark:text-gray-400" 
            : "text-gray-400 dark:text-gray-500 italic"
        }`}
        title={senderEmail || undefined}
      >
        {displayText}
      </span>
    </div>
  );
};

export default SenderDisplay;
