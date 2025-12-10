"use client";

import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { Check, X, Calendar as CalendarIcon, Flag, ChevronDown, ChevronUp, Sparkles, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
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
  onAddSubtasks?: (todoId: string, subtasks: Array<{ title: string }>) => Promise<void>;
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
      await onAddSubtasks(todo.id, selected.map(s => ({ title: s.title })));
      clearPreview();
    } catch (err) {
      console.error("Failed to save subtasks:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCount = generatedSubtasks.filter((s) => s.isSelected).length;

  // Format time range
  const formatTime = (dateString: string | null, estimatedMinutes: number | null) => {
    if (!dateString) return "All Day";
    const start = new Date(dateString);
    const end = new Date(start.getTime() + (estimatedMinutes || 30) * 60000);
    
    return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const timeRange = formatTime(todo.dueDate, todo.estimatedTime);
  
  // Get first tag or default
  const tag = todo.tags && todo.tags.length > 0 ? todo.tags[0] : "Family"; 

  // Priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  return (
    <div className="overflow-hidden rounded-xl bg-[#F8F9FAFF] transition-all duration-300 hover:bg-white hover:shadow-sm">
      {/* Summary Row */}
      <div 
        className="group flex items-center justify-between p-4 cursor-pointer"
        onClick={() => onClick && onClick(todo.id)}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Checkbox for Todo variant */}
          {variant === "todo" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle && onToggle(todo.id);
              }}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                todo.status === "completed"
                  ? "border-blue-600 bg-blue-600 scale-100"
                  : "border-gray-300 hover:border-blue-400 hover:scale-110"
              }`}
            >
              {todo.status === "completed" && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
            </button>
          )}

          {/* Content */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <SourceLink
                sourceType={todo.sourceType}
                sourceSpaceId={todo.sourceSpaceId}
                sourceMessageId={todo.sourceMessageId}
                sourceSpaceName={todo.sourceSpaceName}
                sourceThreadNames={todo.sourceThreadName}
                showIcon={true}
                compact={true}
              />
              <span className="text-gray-300">•</span>
              <span>{timeRange}</span>
            </div>
            <h3 className={`text-base font-semibold text-gray-900 transition-all duration-200 ${
              todo.status === 'completed' ? 'line-through text-gray-400' : ''
            }`}>
              {todo.title}
            </h3>
          </div>
        </div>

        {/* Right Side Actions/Tags */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Assignee */}
          <AssigneeDisplay
             assigneeId={todo.assigneeId}
             assigneeName={todo.assigneeName}
             showAvatar={true}
             maxLength={15}
             className="inline-flex"
          />

          {/* Tag */}
          <span className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
            {tag}
          </span>

          {/* Queue Actions */}
          {variant === "queue" && (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReject && onReject(todo.id);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FF6B6B] text-[#FF6B6B] transition-all duration-200 hover:bg-[#FF6B6B] hover:text-white hover:scale-110"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept && onAccept(todo.id);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#00CC99] text-[#00CC99] transition-all duration-200 hover:bg-[#00CC99] hover:text-white hover:scale-110"
              >
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          )}
          
          {/* Completed Variant Check (Visual only) */}
          {variant === "completed" && (
               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00CC99] text-white">
                  <Check className="h-4 w-4" strokeWidth={2.5} />
               </div>
          )}

          {/* Expand indicator with label */}
          <div className="flex items-center gap-1 text-gray-400">
            <span className="text-xs hidden sm:inline">{isExpanded ? 'Hide Details' : 'Show Details'}</span>
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
              <span className={`font-medium ${getPriorityColor(todo.priority)}`}>
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
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
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
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
                    ({todo.subtasks.filter(s => s.status === 'completed').length}/{todo.subtasks.length})
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
                  Tạo subtask với AI
                </button>
              )}
            </div>

            {/* Loading State */}
            {isGenerating && (
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg mb-3">
                <Loader2 className="h-4 w-4 text-purple-500 animate-spin" />
                <span className="text-sm text-purple-700">Đang tạo subtasks...</span>
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
                        Thử lại
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearError();
                        }}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        Đóng
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
                      Subtasks được tạo bởi AI
                    </span>
                    <span className="text-xs text-purple-500">
                      {selectedCount}/{generatedSubtasks.length} đã chọn
                    </span>
                  </div>
                </div>
                <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
                  {generatedSubtasks.map((subtask, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                        subtask.isSelected ? "bg-purple-50" : "bg-gray-50 opacity-60"
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
                        {subtask.isSelected && <Check className="h-2.5 w-2.5" />}
                      </button>
                      <span className={`flex-1 text-sm ${
                        subtask.isSelected ? "text-gray-700" : "text-gray-400 line-through"
                      }`}>
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
                    Tạo lại
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
                      Hủy
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
                      Lưu {selectedCount} subtask
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
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors mt-0.5 ${
                      subtask.status === 'completed'
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {subtask.status === 'completed' && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className={`text-sm ${
                      subtask.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700'
                    }`}>
                      {subtask.title}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              !isPreviewMode && !isGenerating && (
                <p className="text-xs text-gray-400 italic">Chưa có subtask nào.</p>
              )
            )}
          </div>
        </div>
      </Transition>
    </div>
  );
}
