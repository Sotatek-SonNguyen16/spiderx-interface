"use client";

import { useMemo, useState } from "react";
import {
  Sparkles,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Flame,
  Zap,
  CalendarClock,
  X,
} from "lucide-react";
import type { Todo } from "../types";
import {
  isToday,
  isBefore,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";

interface SmartSuggestionsCardProps {
  todos: Todo[];
  onFilterOverdue?: () => void;
  onFilterHighPriority?: () => void;
  onFilterDueToday?: () => void;
}

export function SmartSuggestionsCard({
  todos,
  onFilterOverdue,
  onFilterHighPriority,
  onFilterDueToday,
}: SmartSuggestionsCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Compute smart stats
  const stats = useMemo(() => {
    const now = new Date();
    const activeTodos = todos.filter(
      (t) => t.status !== "completed" && t.status !== "cancelled"
    );

    const overdue = activeTodos.filter((t) => {
      if (!t.dueDate) return false;
      return isBefore(new Date(t.dueDate), now);
    });

    const highPriority = activeTodos.filter(
      (t) => t.priority === "high" || t.priority === "urgent"
    );

    const dueToday = activeTodos.filter((t) => {
      if (!t.dueDate) return false;
      return isToday(new Date(t.dueDate));
    });

    // Tasks due soon (within 2 hours)
    const dueSoon = activeTodos.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      const hoursUntilDue = differenceInHours(dueDate, now);
      return hoursUntilDue >= 0 && hoursUntilDue <= 2;
    });

    // Top 3 suggested tasks (AI-like logic: overdue first, then high priority, then due soon)
    const suggested = [
      ...overdue.slice(0, 2),
      ...highPriority.filter((t) => !overdue.includes(t)).slice(0, 2),
      ...dueSoon
        .filter((t) => !overdue.includes(t) && !highPriority.includes(t))
        .slice(0, 1),
    ].slice(0, 3);

    return {
      overdue,
      highPriority,
      dueToday,
      dueSoon,
      suggested,
      hasUrgentItems: overdue.length > 0 || dueSoon.length > 0,
    };
  }, [todos]);

  // Don't show if dismissed or no suggestions
  if (isDismissed || stats.suggested.length === 0) {
    return null;
  }

  const formatTimeUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const minutes = differenceInMinutes(due, now);
    const hours = differenceInHours(due, now);

    if (minutes < 0) return "Overdue";
    if (minutes < 60) return `Due in ${minutes}m`;
    if (hours < 24) return `Due in ${hours}h`;
    return `Due ${due.toLocaleDateString()}`;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
      case "high":
        return <Flame className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Zap className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-purple-100 shadow-sm mb-6">
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-purple-100/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-200">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Smart Suggestions</h3>
            <p className="text-xs text-gray-500">
              {stats.suggested.length} tasks need your attention
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronUp className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
            title="Dismiss for now"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Pills */}
      <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-purple-100/50">
        {stats.overdue.length > 0 && (
          <button
            onClick={onFilterOverdue}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition-colors"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {stats.overdue.length} Overdue
          </button>
        )}
        {stats.highPriority.length > 0 && (
          <button
            onClick={onFilterHighPriority}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold hover:bg-orange-200 transition-colors"
          >
            <Flame className="h-3.5 w-3.5" />
            {stats.highPriority.length} High Priority
          </button>
        )}
        {stats.dueToday.length > 0 && (
          <button
            onClick={onFilterDueToday}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition-colors"
          >
            <CalendarClock className="h-3.5 w-3.5" />
            {stats.dueToday.length} Due Today
          </button>
        )}
      </div>

      {/* Suggested Tasks */}
      {!isCollapsed && (
        <div className="p-4 space-y-2">
          {stats.suggested.map((task, index) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/60 hover:bg-white transition-colors cursor-pointer group"
            >
              {/* Priority Indicator */}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  task.priority === "urgent" || task.priority === "high"
                    ? "bg-red-100"
                    : task.priority === "medium"
                    ? "bg-orange-100"
                    : "bg-gray-100"
                }`}
              >
                {getPriorityIcon(task.priority) || (
                  <span className="text-sm font-bold text-gray-500">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Task Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm">
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {task.dueDate && (
                    <span
                      className={`flex items-center gap-1 text-xs ${
                        isBefore(new Date(task.dueDate), new Date())
                          ? "text-red-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      {formatTimeUntilDue(task.dueDate)}
                    </span>
                  )}
                  {task.isAiGenerated && task.aiConfidence && (
                    <span className="flex items-center gap-1 text-xs text-purple-600">
                      <Sparkles className="h-3 w-3" />
                      AI {Math.round(task.aiConfidence * 100)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Action hint */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400">
                Click to view →
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SmartSuggestionsCard;
