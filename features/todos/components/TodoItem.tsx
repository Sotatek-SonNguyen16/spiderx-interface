"use client";

import React, { useState, useMemo } from "react";
import { Transition } from "@headlessui/react";
import {
  Check,
  X,
  Calendar as CalendarIcon,
  Flag,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  AlertCircle,
  Trash2,
  Flame,
  Zap,
  Clock,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import {
  format,
  isBefore,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import type { Todo } from "../types";
import { SourceLink } from "./SourceLink";
import { AssigneeDisplay } from "./AssigneeDisplay";
import { SenderDisplay } from "./SenderDisplay";
import { useSubtaskGenerator } from "../hooks/useSubtaskGenerator";

interface TodoItemProps {
  todo: Todo;
  variant: "todo" | "queue" | "completed";
  isExpanded?: boolean;
  onToggle?: (id: string) => void;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onClick?: (id: string) => void;
  onViewDetail?: (id: string) => void;
  onAddSubtasks?: (
    todoId: string,
    subtasks: Array<{ title: string }>
  ) => Promise<void>;
}

export default function TodoItem({
  todo,
  variant,
  isExpanded = false,
  onToggle,
  onAccept,
  onReject,
  onClick,
  onViewDetail,
  onAddSubtasks,
}: TodoItemProps) {
  // Subtask generator hook
  const {
    isGenerating,
    generatedSubtasks,
    error,
    isPreviewMode,
    generateSubtasks,
    toggleSubtaskSelection,
    updateSubtaskTitle,
    removeSubtask,
    getSelectedSubtasks,
    clearPreview,
    clearError,
  } = useSubtaskGenerator();

  const [isSaving, setIsSaving] = useState(false);

  // Handle generate subtasks
  const handleGenerateSubtasks = async () => {
    await generateSubtasks(todo.title, todo.description || undefined);
  };

  // Handle save generated subtasks
  const handleSaveSubtasks = async () => {
    if (!onAddSubtasks) return;

    const selected = getSelectedSubtasks();
    if (selected.length === 0) return;

    setIsSaving(true);
    try {
      await onAddSubtasks(
        todo.id,
        selected.map((s) => ({ title: s.title }))
      );
      clearPreview();
    } catch (err) {
      console.error("Failed to save subtasks:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCount = generatedSubtasks.filter((s) => s.isSelected).length;

  // Check if task is overdue
  const isOverdue = useMemo(() => {
    if (!todo.dueDate || todo.status === "completed") return false;
    return isBefore(new Date(todo.dueDate), new Date());
  }, [todo.dueDate, todo.status]);

  // Format time until due - Enhanced for urgency display
  const timeUntilDue = useMemo(() => {
    if (!todo.dueDate)
      return { text: "All day", urgent: false, isAllDay: true };
    const due = new Date(todo.dueDate);
    const now = new Date();
    const minutes = differenceInMinutes(due, now);
    const hours = differenceInHours(due, now);

    if (minutes < 0) return { text: "Overdue", urgent: true, isAllDay: false };
    if (minutes < 60)
      return { text: `${minutes}m`, urgent: true, isAllDay: false };
    if (hours < 3) return { text: `${hours}h`, urgent: true, isAllDay: false };
    if (hours < 24)
      return { text: `${hours}h`, urgent: false, isAllDay: false };
    return { text: format(due, "MMM d"), urgent: false, isAllDay: false };
  }, [todo.dueDate]);

  // Priority styling - Enhanced with semantic hierarchy
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "urgent":
        return {
          accentColor: "border-l-red-500",
          badgeClass: "bg-red-500 text-white",
          badgeClassSoft: "bg-red-50 text-red-700 border border-red-200",
          icon: Flame,
          label: "Urgent",
          showBadge: true,
        };
      case "high":
        return {
          accentColor: "border-l-orange-500",
          badgeClass: "bg-orange-500 text-white",
          badgeClassSoft:
            "bg-orange-50 text-orange-700 border border-orange-200",
          icon: Zap,
          label: "High",
          showBadge: true,
        };
      case "medium":
        return {
          accentColor: "border-l-amber-400",
          badgeClass: "bg-amber-100 text-amber-700",
          badgeClassSoft: "bg-amber-50 text-amber-600 border border-amber-200",
          icon: Flag,
          label: "Medium",
          showBadge: false, // Medium priority doesn't need prominent badge
        };
      default:
        return {
          accentColor: "",
          badgeClass: "bg-gray-100 text-gray-600",
          badgeClassSoft: "bg-gray-50 text-gray-500 border border-gray-200",
          icon: null,
          label: "Low",
          showBadge: false,
        };
    }
  };

  const priorityConfig = getPriorityConfig(todo.priority);
  const PriorityIcon = priorityConfig.icon;

  // Determine if this is a "focus" task (high priority + overdue or due soon)
  const isFocusTask = useMemo(() => {
    return (
      (todo.priority === "urgent" || todo.priority === "high") &&
      (isOverdue || timeUntilDue.urgent)
    );
  }, [todo.priority, isOverdue, timeUntilDue.urgent]);

  return (
    <div
      className={`
        group relative overflow-hidden rounded-xl bg-white 
        border transition-all duration-200 ease-out
        ${
          priorityConfig.accentColor
            ? `border-l-4 ${priorityConfig.accentColor}`
            : "border-l-0"
        }
        ${
          isOverdue
            ? "border-red-200 ring-1 ring-red-100 bg-red-50/30"
            : isFocusTask
            ? "border-orange-200 ring-1 ring-orange-50"
            : "border-gray-200 hover:border-gray-300"
        }
        ${
          isExpanded
            ? "shadow-lg ring-1 ring-blue-100"
            : "shadow-sm hover:shadow-md"
        }
      `}
    >
      {/* Focus Task Indicator - Subtle glow for high priority items */}
      {isFocusTask && !isOverdue && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-100/50 to-transparent pointer-events-none" />
      )}

      {/* ========== COMPACT VIEW (Default) ========== */}
      <div
        className={`
          flex items-center gap-3 cursor-pointer
          ${isExpanded ? "px-4 py-3" : "px-4 py-3"}
        `}
        onClick={() => onClick && onClick(todo.id)}
      >
        {/* TIER 1: Checkbox (Primary Action) - 44px hit area for accessibility */}
        <div className="flex-shrink-0">
          {variant === "todo" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle && onToggle(todo.id);
              }}
              className={`
                flex h-7 w-7 items-center justify-center rounded-full border-2 
                transition-all duration-200 hover:scale-110
                ${
                  todo.status === "completed"
                    ? "border-green-500 bg-green-500 text-white shadow-sm"
                    : "border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm"
                }
              `}
              style={{ minWidth: "28px", minHeight: "28px" }} // Ensure 44px with padding
            >
              {todo.status === "completed" && (
                <Check className="h-4 w-4" strokeWidth={3} />
              )}
            </button>
          )}
          {variant === "completed" && (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Check className="h-4 w-4" strokeWidth={3} />
            </div>
          )}
          {variant === "queue" && (
            <div
              className={`h-3 w-3 rounded-full ${
                todo.status === "todo" ? "bg-orange-400" : "bg-gray-300"
              }`}
            />
          )}
        </div>

        {/* TIER 1: Title (Primary Focus - 70%) */}
        <div className="flex-1 min-w-0">
          <h3
            className={`
              text-[15px] font-semibold leading-snug tracking-tight
              ${
                todo.status === "completed"
                  ? "text-gray-400 line-through"
                  : isOverdue
                  ? "text-gray-900"
                  : "text-gray-900"
              }
            `}
          >
            {todo.title}
          </h3>

          {/* TIER 2: Secondary Info (20%) - Priority + Due in single line */}
          <div className="flex items-center gap-2 mt-1">
            {/* Priority Badge - Only for High/Urgent, solid style */}
            {priorityConfig.showBadge && (
              <span
                className={`
                inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide
                ${
                  todo.priority === "urgent"
                    ? "bg-red-500 text-white"
                    : "bg-orange-500 text-white"
                }
              `}
              >
                {PriorityIcon && <PriorityIcon className="h-3 w-3" />}
                {priorityConfig.label}
              </span>
            )}

            {/* Due Time - With urgency styling */}
            <span
              className={`
              inline-flex items-center gap-1 text-xs
              ${
                isOverdue
                  ? "text-red-600 font-semibold"
                  : timeUntilDue.urgent
                  ? "text-orange-600 font-medium"
                  : "text-gray-500"
              }
            `}
            >
              {isOverdue ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <CalendarIcon className="h-3 w-3" />
              )}
              {timeUntilDue.text}
            </span>

            {/* Separator dot */}
            {(todo.isAiGenerated || (todo.tags && todo.tags.length > 0)) && (
              <span className="text-gray-300">·</span>
            )}

            {/* TIER 3: Tertiary Info (10%) - AI, Tags - Reduced visual weight */}
            {todo.isAiGenerated && (
              <span className="inline-flex items-center gap-0.5 text-[11px] text-purple-500 font-medium opacity-75">
                <Sparkles className="h-3 w-3" />
                AI
              </span>
            )}

            {/* Tags - Outline style, reduced prominence */}
            {!isExpanded && todo.tags && todo.tags.length > 0 && (
              <div className="hidden sm:flex items-center gap-1">
                <span className="text-[11px] text-gray-400 font-medium border border-gray-200 rounded px-1.5 py-0.5">
                  #{todo.tags[0]}
                </span>
                {todo.tags.length > 1 && (
                  <span className="text-[11px] text-gray-400">
                    +{todo.tags.length - 1}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Queue Actions - Accept/Reject */}
          {variant === "queue" && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReject && onReject(todo.id);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 
                  transition-all hover:bg-red-500 hover:text-white hover:scale-105 hover:shadow-md"
                title="Reject"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept && onAccept(todo.id);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-500 
                  transition-all hover:bg-green-500 hover:text-white hover:scale-105 hover:shadow-md"
                title="Accept"
              >
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          )}

          {/* Subtask Count Indicator (compact) */}
          {!isExpanded && todo.subtasks && todo.subtasks.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
              <Check className="h-3 w-3" />
              <span>
                {todo.subtasks.filter((s) => s.status === "completed").length}/
                {todo.subtasks.length}
              </span>
            </div>
          )}

          {/* Expand Toggle */}
          <div
            className={`
            text-gray-300 transition-colors
            ${isExpanded ? "text-blue-500" : "group-hover:text-gray-400"}
          `}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </div>
      </div>

      {/* Expandable Detail Section */}
      <Transition
        show={isExpanded}
        enter="transition-all duration-300 ease-out"
        enterFrom="opacity-0 max-h-0"
        enterTo="opacity-100 max-h-[1000px]"
        leave="transition-all duration-300 ease-in"
        leaveFrom="opacity-100 max-h-[1000px]"
        leaveTo="opacity-0 max-h-0"
      >
        <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-4 space-y-4">
          {/* AI Generated Indicator with Explanation */}
          {todo.isAiGenerated && (
            <div className="flex items-start gap-3 p-3 bg-purple-50/50 rounded-lg border border-purple-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                <Sparkles className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-purple-900">
                  AI Generated Task
                </p>
                <p className="text-xs text-purple-600 mt-0.5">
                  {todo.sourceType === "chat"
                    ? "Extracted from Google Chat message"
                    : "Generated based on your conversation"}
                </p>
              </div>
            </div>
          )}

          {/* Source & Context */}
          {todo.sourceType && (
            <div className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4 text-gray-400" />
              <SourceLink
                sourceType={todo.sourceType}
                sourceSpaceId={todo.sourceSpaceId}
                sourceMessageId={todo.sourceMessageId}
                sourceSpaceName={todo.sourceSpaceName}
                sourceThreadNames={todo.sourceThreadName}
                showIcon={false}
                compact={false}
              />
            </div>
          )}

          {/* Meta Info - Compact Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Assignee */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">
                Assignee
              </span>
              <AssigneeDisplay
                assigneeId={todo.assigneeId}
                assigneeName={todo.assigneeName}
                showAvatar={true}
                maxLength={20}
              />
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">
                Priority
              </span>
              <span
                className={`inline-flex items-center gap-1 text-sm font-medium ${
                  todo.priority === "urgent"
                    ? "text-red-600"
                    : todo.priority === "high"
                    ? "text-orange-600"
                    : todo.priority === "medium"
                    ? "text-amber-600"
                    : "text-gray-600"
                }`}
              >
                {PriorityIcon && <PriorityIcon className="h-4 w-4" />}
                {priorityConfig.label}
              </span>
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">
                Due Date
              </span>
              <span
                className={`text-sm font-medium ${
                  isOverdue ? "text-red-600" : "text-gray-900"
                }`}
              >
                {todo.dueDate
                  ? format(new Date(todo.dueDate), "EEE, MMM d 'at' h:mma")
                  : "No due date"}
              </span>
            </div>
          </div>

          {/* Tags - Full Display in Expanded */}
          {todo.tags && todo.tags.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">
                Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {todo.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium 
                      text-gray-600 bg-white border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {todo.description && (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">
                Description
              </span>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-white rounded-lg p-3 border border-gray-100">
                {todo.description}
              </p>
            </div>
          )}

          {/* Subtasks */}
          <div className="pt-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Subtasks
                {todo.subtasks && todo.subtasks.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    (
                    {
                      todo.subtasks.filter((s) => s.status === "completed")
                        .length
                    }
                    /{todo.subtasks.length})
                  </span>
                )}
              </h3>
              {!isPreviewMode && !isGenerating && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleGenerateSubtasks();
                  }}
                  disabled={!onAddSubtasks}
                  className="flex items-center gap-1.5 rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-3 w-3" />
                  Generate subtasks with AI
                </button>
              )}
            </div>

            {/* Loading State */}
            {isGenerating && (
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg mb-3">
                <Loader2 className="h-4 w-4 text-purple-500 animate-spin" />
                <span className="text-sm text-purple-700">
                  Generating subtasks...
                </span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-3 bg-red-50 rounded-lg mb-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-700">{error}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateSubtasks();
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Try again
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearError();
                        }}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preview Generated Subtasks */}
            {isPreviewMode && generatedSubtasks.length > 0 && (
              <div className="border border-purple-200 rounded-lg overflow-hidden mb-3">
                <div className="bg-purple-50 px-3 py-2 border-b border-purple-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-purple-700 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI Generated Subtasks
                    </span>
                    <span className="text-xs text-purple-500">
                      {selectedCount}/{generatedSubtasks.length} selected
                    </span>
                  </div>
                </div>
                <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
                  {generatedSubtasks.map((subtask, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                        subtask.isSelected
                          ? "bg-purple-50"
                          : "bg-gray-50 opacity-60"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSubtaskSelection(index);
                        }}
                        className={`flex h-4 w-4 items-center justify-center rounded border-2 transition-colors ${
                          subtask.isSelected
                            ? "border-purple-500 bg-purple-500 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {subtask.isSelected && (
                          <Check className="h-2.5 w-2.5" />
                        )}
                      </button>
                      <span
                        className={`flex-1 text-sm ${
                          subtask.isSelected
                            ? "text-gray-700"
                            : "text-gray-400 line-through"
                        }`}
                      >
                        {subtask.title}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSubtask(index);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 flex justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateSubtasks();
                    }}
                    className="text-xs text-purple-600 hover:text-purple-700"
                  >
                    Regenerate
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearPreview();
                      }}
                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveSubtasks();
                      }}
                      disabled={selectedCount === 0 || isSaving}
                      className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      {isSaving && <Loader2 className="h-3 w-3 animate-spin" />}
                      Save {selectedCount} subtask
                      {selectedCount !== 1 ? "s" : ""}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Subtasks */}
            {todo.subtasks && todo.subtasks.length > 0 ? (
              <ul className="space-y-2">
                {todo.subtasks.map((subtask) => (
                  <li key={subtask.id} className="flex items-start gap-3">
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors mt-0.5 ${
                        subtask.status === "completed"
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {subtask.status === "completed" && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        subtask.status === "completed"
                          ? "text-gray-400 line-through"
                          : "text-gray-700"
                      }`}
                    >
                      {subtask.title}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              !isPreviewMode &&
              !isGenerating && (
                <p className="text-xs text-gray-400 italic">No subtasks yet.</p>
              )
            )}
          </div>
        </div>
      </Transition>
    </div>
  );
}
