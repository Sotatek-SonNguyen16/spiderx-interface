"use client";

import { User, Calendar, Zap } from "lucide-react";
import { format, isToday, isTomorrow, isThisWeek } from "date-fns";
import type { TodoPriority } from "../../types";

/**
 * MetaRow Component
 * Displays assignee, due date, and priority in a single line with icons
 * 
 * Requirements: 2.4
 */

interface MetaRowProps {
  assigneeName?: string | null;
  dueDate?: string | null;
  priority?: TodoPriority;
}

export const MetaRow = ({ assigneeName, dueDate, priority }: MetaRowProps) => {
  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE'); // Day name
    return format(date, 'MMM d');
  };

  const getPriorityConfig = (p: TodoPriority) => {
    switch (p) {
      case 'urgent':
        return { label: 'Urgent', color: 'text-red-600' };
      case 'high':
        return { label: 'High', color: 'text-orange-600' };
      case 'medium':
        return { label: 'Medium', color: 'text-yellow-600' };
      case 'low':
        return { label: 'Low', color: 'text-green-600' };
      default:
        return { label: p, color: 'text-gray-500' };
    }
  };

  const hasContent = assigneeName || dueDate || priority;
  if (!hasContent) return null;

  return (
    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
      {assigneeName && (
        <div className="flex items-center gap-1.5">
          <User className="w-4 h-4" />
          <span className="truncate max-w-[100px]">{assigneeName}</span>
        </div>
      )}
      
      {dueDate && (
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>{formatDueDate(dueDate)}</span>
        </div>
      )}
      
      {priority && (
        <div className={`flex items-center gap-1.5 ${getPriorityConfig(priority).color}`}>
          <Zap className="w-4 h-4" />
          <span className="font-medium">{getPriorityConfig(priority).label}</span>
        </div>
      )}
    </div>
  );
};
