"use client";

import { ChevronDown, ChevronUp, Check, ExternalLink } from "lucide-react";
import type { MeetingTaskData } from "../types/ui.types";
import SubTaskItem from "./SubTaskItem";

interface MeetingTaskCardProps {
  task: MeetingTaskData;
  onToggleStatus?: (id: string) => void;
  onToggleExpand?: (id: string) => void;
  onSubTaskToggle?: (taskId: string, subTaskId: string) => void;
}

export default function MeetingTaskCard({
  task,
  onToggleStatus,
  onToggleExpand,
  onSubTaskToggle,
}: MeetingTaskCardProps) {
  const isCompleted = task.status === "completed";

  const renderMetaField = (field: typeof task.meta[0]) => {
    const baseClasses = "text-xs";
    const labelClasses = "font-medium text-gray-500";
    const valueClasses = "text-gray-700";

    if (field.valueType === "link" && field.href) {
      return (
        <div className="flex items-center gap-1">
          <span className={`${baseClasses} ${labelClasses}`}>{field.label}:</span>
          <a
            href={field.href}
            className={`${baseClasses} ${valueClasses} flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline`}
          >
            {field.value}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      );
    }

    if (field.valueType === "priority" && field.tone === "danger") {
      return (
        <div className="flex items-center gap-1">
          <span className={`${baseClasses} ${labelClasses}`}>{field.label}:</span>
          <span className={`${baseClasses} ${valueClasses} text-red-600 font-medium`}>
            {field.value}
          </span>
        </div>
      );
    }

    if (field.valueType === "tag") {
      return (
        <div className="flex items-center gap-1">
          <span className={`${baseClasses} ${labelClasses}`}>{field.label}:</span>
          <span className={`${baseClasses} ${valueClasses}`}>{field.value}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <span className={`${baseClasses} ${labelClasses}`}>{field.label}:</span>
        <span className={`${baseClasses} ${valueClasses}`}>{field.value}</span>
      </div>
    );
  };

  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggleStatus?.(task.id)}
          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
            isCompleted
              ? "border-yellow-400 bg-yellow-400"
              : "border-gray-300 bg-white hover:border-gray-400"
          }`}
          aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
        >
          {isCompleted && <Check className="h-3 w-3 text-gray-900" />}
        </button>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3
                className={`text-sm font-medium ${
                  isCompleted ? "text-gray-500 line-through" : "text-gray-900"
                }`}
              >
                {task.title}
              </h3>
              {task.dateLabel && (
                <p className="mt-1 text-xs text-gray-500">{task.dateLabel}</p>
              )}
            </div>
            <button
              onClick={() => onToggleExpand?.(task.id)}
              className="flex-shrink-0 text-gray-400 transition hover:text-gray-600"
              aria-label={task.isExpanded ? "Collapse" : "Expand"}
            >
              {task.isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Meta Fields */}
          {task.isExpanded && task.meta.length > 0 && (
            <div className="mt-3 space-y-1.5 border-t border-yellow-200 pt-3">
              {task.meta.map((field, index) => (
                <div key={index}>{renderMetaField(field)}</div>
              ))}
            </div>
          )}

          {/* Subtasks */}
          {task.isExpanded && task.subtasks.length > 0 && (
            <div className="mt-3 space-y-1 border-t border-yellow-200 pt-3">
              {task.subtasks.map((subtask) => (
                <SubTaskItem
                  key={subtask.id}
                  subtask={subtask}
                  onToggle={(id) => onSubTaskToggle?.(task.id, id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

