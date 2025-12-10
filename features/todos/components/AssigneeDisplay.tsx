"use client";

import { User } from "lucide-react";

interface AssigneeDisplayProps {
  assigneeId: string | null;
  assigneeName: string | null;
  className?: string;
  showAvatar?: boolean;
  maxLength?: number;
}

/**
 * AssigneeDisplay - Displays the assignee of a todo
 * Shows name/avatar or "Unassigned" indicator
 * Truncates long names with tooltip
 */
export const AssigneeDisplay = ({
  assigneeId,
  assigneeName,
  className = "",
  showAvatar = true,
  maxLength = 20,
}: AssigneeDisplayProps) => {
  // Check if assignee exists
  const hasAssignee = assigneeId || assigneeName;
  
  // Get display name
  const displayName = assigneeName || "Unassigned";
  
  // Check if name needs truncation
  const needsTruncation = displayName.length > maxLength;
  const truncatedName = needsTruncation 
    ? `${displayName.slice(0, maxLength)}...` 
    : displayName;

  // Generate initials for avatar
  const getInitials = (name: string): string => {
    if (!name || name === "Unassigned") return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Get avatar background color based on name
  const getAvatarColor = (name: string | null): string => {
    if (!name) return "bg-gray-200 dark:bg-gray-700";
    
    // Simple hash to get consistent color
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  if (!hasAssignee) {
    // Unassigned state
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        {showAvatar && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
            <User className="h-3 w-3 text-gray-400" />
          </div>
        )}
        <span className="text-sm text-gray-400 italic">Unassigned</span>
      </div>
    );
  }

  return (
    <div 
      className={`inline-flex items-center gap-2 ${className}`}
      title={needsTruncation ? displayName : undefined}
    >
      {showAvatar && (
        <div 
          className={`flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-medium ${getAvatarColor(assigneeName)}`}
        >
          {getInitials(displayName)}
        </div>
      )}
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {truncatedName}
      </span>
    </div>
  );
};

export default AssigneeDisplay;
