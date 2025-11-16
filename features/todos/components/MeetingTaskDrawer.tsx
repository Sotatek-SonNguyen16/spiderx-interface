"use client";

import { X, ExternalLink } from "lucide-react";
import type { MeetingTaskData } from "../types/ui.types";
import SubTaskItem from "./SubTaskItem";

interface MeetingTaskDrawerProps {
  task: MeetingTaskData;
  isOpen: boolean;
  onClose: () => void;
  onSubTaskToggle?: (taskId: string, subTaskId: string) => void;
}

export default function MeetingTaskDrawer({
  task,
  isOpen,
  onClose,
  onSubTaskToggle,
}: MeetingTaskDrawerProps) {
  if (!isOpen) return null;

  const renderMetaField = (field: typeof task.meta[0]) => {
    const baseClasses = "text-xs";
    const labelClasses = "font-medium uppercase text-gray-500";
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
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl transition-transform">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">{task.title}</h2>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Date */}
            {task.dateLabel && (
              <p className="mb-4 text-sm text-gray-500">{task.dateLabel}</p>
            )}

            {/* Meta Fields */}
            {task.meta.length > 0 && (
              <div className="mb-6 space-y-3 border-b border-gray-200 pb-6">
                {task.meta.map((field, index) => (
                  <div key={index}>{renderMetaField(field)}</div>
                ))}
              </div>
            )}

            {/* Subtasks */}
            {task.subtasks.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Subtasks</h3>
                <div className="space-y-2">
                  {task.subtasks.map((subtask) => (
                    <SubTaskItem
                      key={subtask.id}
                      subtask={subtask}
                      onToggle={(id) => onSubTaskToggle?.(task.id, id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

