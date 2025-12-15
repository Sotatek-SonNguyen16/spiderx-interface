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

  // Format time range
  const formatTime = (
    dateString: string | null,
    estimatedMinutes: number | null
  ) => {
    if (!dateString) return "All Day";
    const start = new Date(dateString);
    const end = new Date(start.getTime() + (estimatedMinutes || 30) * 60000);

    return `${start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const timeRange = formatTime(todo.dueDate, todo.estimatedTime);

  // Get first tag or default
  const tag = todo.tags && todo.tags.length > 0 ? todo.tags[0] : "Family";

  // Check if task is overdue
  const isOverdue = useMemo(() => {
    if (!todo.dueDate || todo.status === "completed") return false;
    return isBefore(new Date(todo.dueDate), new Date());
  }, [todo.dueDate, todo.status]);

  // Format time until due
  const timeUntilDue = useMemo(() => {
    if (!todo.dueDate) return null;
    const due = new Date(todo.dueDate);
    const now = new Date();
    const minutes = differenceInMinutes(due, now);
    const hours = differenceInHours(due, now);

    if (minutes < 0) return { text: "Overdue", urgent: true };
    if (minutes < 60) return { text: `Due in ${minutes}m`, urgent: true };
    if (hours < 24) return { text: `Due in ${hours}h`, urgent: hours < 3 };
    return { text: format(due, "MMM d"), urgent: false };
  }, [todo.dueDate]);

  // Priority styling
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "urgent":
        return {
          border: "border-l-4 border-l-red-500",
          badge: "bg-red-100 text-red-700 border-red-200",
          icon: Flame,
          text: "Urgent",
        };
      case "high":
        return {
          border: "border-l-4 border-l-orange-500",
          badge: "bg-orange-100 text-orange-700 border-orange-200",
          icon: Zap,
          text: "High",
        };
      case "medium":
        return {
          border: "border-l-4 border-l-yellow-400",
          badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
          icon: Flag,
          text: "Medium",
        };
      default:
        return {
          border: "",
          badge: "bg-gray-100 text-gray-600 border-gray-200",
          icon: null,
          text: "Low",
        };
    }
  };

  const priorityStyle = getPriorityStyle(todo.priority);
  const PriorityIcon = priorityStyle.icon;

  // Eisenhower matrix display
  const getEisenhowerLabel = (eisenhower: string | null) => {
    switch (eisenhower) {
      case "urgent_important":
        return {
          label: "Urgent & Important",
          color: "bg-red-100 text-red-700",
        };
      case "not_urgent_important":
        return { label: "Important", color: "bg-blue-100 text-blue-700" };
      case "urgent_not_important":
        return { label: "Urgent", color: "bg-orange-100 text-orange-700" };
      case "not_urgent_not_important":
        return { label: "Low Priority", color: "bg-gray-100 text-gray-600" };
      default:
        return null;
    }
  };

  const eisenhowerInfo = getEisenhowerLabel(todo.eisenhower);

  return (
    <div
      className={`group overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-200/50 ${
        priorityStyle.border
      } ${isOverdue ? "ring-2 ring-red-100" : ""}`}
    >
      {/* Main Content Area */}
      <div
        className="flex items-start gap-4 p-5 cursor-pointer relative"
        onClick={() => onClick && onClick(todo.id)}
      >
        {/* Left: Status/Type Indicator */}
        <div className="pt-1 flex-shrink-0">
          {variant === "todo" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle && onToggle(todo.id);
              }}
              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                todo.status === "completed"
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              {todo.status === "completed" && (
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              )}
            </button>
          )}
          {variant === "completed" && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Check className="h-4 w-4" strokeWidth={3} />
            </div>
          )}
          {variant === "queue" && (
            <div
              className={`mt-0.5 h-2 w-2 rounded-full ${
                todo.status === "todo" ? "bg-orange-400" : "bg-gray-300"
              }`}
            />
          )}
        </div>

        {/* Middle: Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header: Title */}
          <div className="flex justify-between items-start gap-3">
            <h3
              className={`text-lg font-semibold leading-tight text-gray-900 transition-colors ${
                todo.status === "completed" ? "text-gray-500 line-through" : ""
              }`}
            >
              {todo.title}
            </h3>

            {/* Mobile: Expand Icon */}
            <div className="sm:hidden text-gray-400">
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </div>

          {/* Row 2: Tags & Attributes */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Badge */}
            {(todo.priority === "urgent" || todo.priority === "high") && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  todo.priority === "urgent"
                    ? "bg-red-50 text-red-700 border border-red-100"
                    : "bg-orange-50 text-orange-700 border border-orange-100"
                }`}
              >
                <Flag className="h-3 w-3" fill="currentColor" />
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
              </span>
            )}

            {/* AI Generated Badge */}
            {todo.isAiGenerated && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 border border-purple-100">
                <Sparkles className="h-3 w-3" />
                AI
              </span>
            )}

            {/* Tags */}
            {todo.tags && todo.tags.length > 0 && (
              <>
                {todo.tags.slice(0, 3).map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                  >
                    #{t}
                  </span>
                ))}
                {todo.tags.length > 3 && (
                  <span className="text-xs text-gray-400 font-medium">
                    +{todo.tags.length - 3}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Row 3: Meta (Assignee, Date, Source) */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
            {/* Assignee */}
            <div className="flex items-center gap-2">
              <AssigneeDisplay
                assigneeId={todo.assigneeId}
                assigneeName={todo.assigneeName}
                showAvatar={true}
                maxLength={20}
                className="scale-90 origin-left"
              />
            </div>

            {/* Separator */}
            <div className="hidden sm:block h-3 w-px bg-gray-300" />

            {/* Date */}
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
              <span
                className={
                  todo.dueDate && new Date(todo.dueDate) < new Date()
                    ? "text-red-500 font-medium"
                    : ""
                }
              >
                {timeRange}
              </span>
            </div>

            {/* Separator */}
            <div className="hidden sm:block h-3 w-px bg-gray-300" />

            {/* Source */}
            <div className="flex items-center gap-1.5">
              <SourceLink
                sourceType={todo.sourceType}
                sourceSpaceId={todo.sourceSpaceId}
                sourceMessageId={todo.sourceMessageId}
                sourceSpaceName={todo.sourceSpaceName}
                sourceThreadNames={todo.sourceThreadName}
                showIcon={true}
                compact={true}
              />
            </div>
          </div>
        </div>

        {/* Right: Actions (Desktop) */}
        <div className="hidden sm:flex flex-col items-end gap-3 flex-shrink-0">
          {/* Queue Actions */}
          {variant === "queue" && (
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReject && onReject(todo.id);
                }}
                className="group/reject flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 transition-all hover:bg-red-500 hover:text-white hover:scale-105 hover:shadow-md"
                title="Reject"
              >
                <X className="h-5 w-5" strokeWidth={2.5} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept && onAccept(todo.id);
                }}
                className="group/accept flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600 transition-all hover:bg-green-500 hover:text-white hover:scale-105 hover:shadow-md"
                title="Accept"
              >
                <Check className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>
          )}

          {/* Expand Toggle */}
          <div className="text-gray-300 group-hover:text-gray-400 transition-colors mt-auto">
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
        <div className="border-t border-gray-200 bg-white p-6 space-y-4">
          {/* Source Header */}
          <div className="pb-3 border-b border-gray-100">
            <SourceLink
              sourceType={todo.sourceType}
              sourceSpaceId={todo.sourceSpaceId}
              sourceMessageId={todo.sourceMessageId}
              sourceSpaceName={todo.sourceSpaceName}
              sourceThreadNames={todo.sourceThreadName}
              showIcon={true}
              compact={false}
            />
          </div>

          {/* Title */}
          <div>
            <h2 className="text-lg font-bold text-gray-900">{todo.title}</h2>
          </div>

          {/* Meta Info Grid */}
          <div className="space-y-3">
            {/* Assignee */}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-500">Assignee:</span>
              <AssigneeDisplay
                assigneeId={todo.assigneeId}
                assigneeName={todo.assigneeName}
                showAvatar={true}
                maxLength={25}
              />
            </div>

            {/* Priority */}
            <div className="flex items-center gap-3 text-sm">
              <Flag className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">Priority:</span>
              <span
                className={`font-medium px-2 py-0.5 rounded-md text-xs ${priorityStyle.badge}`}
              >
                {priorityStyle.text}
              </span>
            </div>

            {/* Due Date */}
            {todo.dueDate && (
              <div className="flex items-center gap-3 text-sm">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Due Date:</span>
                <span className="font-medium text-gray-900">
                  {format(new Date(todo.dueDate), "EEE dd MMM hh:mma")}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {todo.description && (
            <div className="pt-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
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
