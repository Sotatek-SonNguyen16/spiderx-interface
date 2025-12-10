import React from "react";
import { Transition } from "@headlessui/react";
import { Check, X, Calendar as CalendarIcon, Flag, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { format } from "date-fns";
import type { Todo } from "../types";
import { SourceLink } from "./SourceLink";
import { AssigneeDisplay } from "./AssigneeDisplay";
import { SenderDisplay } from "./SenderDisplay";

interface TodoItemProps {
  todo: Todo;
  variant: "todo" | "queue" | "completed";
  isExpanded?: boolean;
  onToggle?: (id: string) => void;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onClick?: (id: string) => void;
  onViewDetail?: (id: string) => void;
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
}: TodoItemProps) {
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
              <h3 className="text-sm font-semibold text-gray-900">Subtasks</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement generate subtasks
                  console.log("Generate subtasks clicked");
                }}
                className="flex items-center gap-1.5 rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100 transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                Generate with AI
              </button>
            </div>
            
            {todo.subtasks && todo.subtasks.length > 0 ? (
              <ul className="space-y-2">
                {todo.subtasks.map((subtask) => (
                  <li key={subtask.id} className="flex items-start gap-3">
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors mt-0.5 ${
                      subtask.status === 'completed'
                        ? 'border-gray-300 bg-gray-100'
                        : 'border-gray-300'
                    }`}>
                      {subtask.status === 'completed' && (
                        <div className="h-2 w-2 rounded-full bg-gray-400" />
                      )}
                    </div>
                    <span className={`text-sm ${
                      subtask.status === 'completed' ? 'text-gray-400' : 'text-gray-700'
                    }`}>
                      {subtask.title}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400 italic">No subtasks yet.</p>
            )}
          </div>
        </div>
      </Transition>
    </div>
  );
}
