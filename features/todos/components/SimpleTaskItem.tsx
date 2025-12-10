"use client";

import { Check, Info } from "lucide-react";
import type { SimpleTaskData } from "../types/ui.types";

interface SimpleTaskItemProps {
  task: SimpleTaskData;
  onToggleStatus?: (id: string) => void;
  onClick?: (id: string) => void;
  showInfoIcon?: boolean; // Hiển thị icon info cho meeting tasks
}

export default function SimpleTaskItem({
  task,
  onToggleStatus,
  onClick,
  showInfoIcon = false,
}: SimpleTaskItemProps) {
  const isCompleted = task.status === "completed";

  const getDuePillColor = (dueType: string) => {
    switch (dueType) {
      case "overdue":
        return "bg-red-100 text-red-700";
      case "today":
        return "bg-gray-800 text-white";
      case "tomorrow":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="group flex items-start gap-3 rounded-lg py-2 transition hover:bg-gray-50">
      {/* Checkbox - Min 40x40px click target */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleStatus?.(task.id);
        }}
        className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 ${
          isCompleted
            ? "border-yellow-400 bg-yellow-400"
            : "border-gray-300 bg-white hover:border-gray-400"
        }`}
        aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
      >
        {isCompleted && <Check className="h-4 w-4 text-gray-900" />}
      </button>

      {/* Content - Full row clickable */}
      <button
        onClick={() => onClick?.(task.id)}
        className="flex flex-1 items-center justify-between gap-2 text-left focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 rounded"
      >
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-medium ${
              isCompleted ? "text-gray-500 line-through" : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>
        </div>

        {/* Right side: Due pill + Info icon */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {task.dueType && task.dueType !== "none" && task.dueLabel && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${getDuePillColor(
                task.dueType
              )}`}
            >
              {task.dueLabel}
            </span>
          )}
          {showInfoIcon && (
            <Info className="h-4 w-4 text-gray-400" aria-label="Has details" />
          )}
        </div>
      </button>
    </div>
  );
}

