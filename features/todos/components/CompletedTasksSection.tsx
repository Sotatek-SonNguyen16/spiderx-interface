"use client";

import { memo } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, Clock } from "lucide-react";
import type { Todo } from "../types";
import { useState } from "react";
import { format } from "date-fns";

interface CompletedTasksSectionProps {
  todos: Todo[];
  onUncomplete?: (id: string) => void;
}

function CompletedTasksSectionComponent({
  todos,
  onUncomplete,
}: CompletedTasksSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter completed todos from today
  const completedToday = todos.filter((t) => {
    if (t.status !== "completed" || !t.completedAt) return false;
    const completedDate = new Date(t.completedAt);
    const today = new Date();
    return (
      completedDate.getDate() === today.getDate() &&
      completedDate.getMonth() === today.getMonth() &&
      completedDate.getFullYear() === today.getFullYear()
    );
  });

  if (completedToday.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/50 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
          <span className="font-medium text-gray-700">Completed Today</span>
          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            {completedToday.length}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {/* Completed Tasks List */}
      {isExpanded && (
        <div className="border-t border-gray-200 divide-y divide-gray-100">
          {completedToday.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white flex-shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm text-gray-500 line-through truncate">
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 flex-shrink-0">
                <Clock className="h-3 w-3" />
                Done at{" "}
                {task.completedAt &&
                  format(new Date(task.completedAt), "HH:mm")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const CompletedTasksSection = memo(CompletedTasksSectionComponent);
