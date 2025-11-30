import React from "react";
import { Check, X } from "lucide-react";
import type { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  variant: "todo" | "queue" | "completed";
  onToggle?: (id: string) => void;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onClick?: (id: string) => void;
}

export default function TodoItem({
  todo,
  variant,
  onToggle,
  onAccept,
  onReject,
  onClick,
}: TodoItemProps) {
  // Format time range
  const formatTime = (dateString: string | null, estimatedMinutes: number | null) => {
    if (!dateString) return "All Day";
    const start = new Date(dateString);
    const end = new Date(start.getTime() + (estimatedMinutes || 30) * 60000);
    
    return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const timeRange = formatTime(todo.dueDate, todo.estimatedTime);
  
  // Mock tag for now if empty, or use first tag
  const tag = todo.tags && todo.tags.length > 0 ? todo.tags[0] : "Family"; 

  return (
    <div 
      className="group flex items-center justify-between rounded-xl bg-gray-50 p-4 transition-all hover:bg-white hover:shadow-sm cursor-pointer"
      onClick={() => onClick && onClick(todo.id)}
    >
      <div className="flex items-center gap-4">
        {/* Checkbox for Todo variant */}
        {variant === "todo" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle && onToggle(todo.id);
            }}
            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
              todo.status === "completed"
                ? "border-blue-600 bg-blue-600"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            {todo.status === "completed" && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
          </button>
        )}

        {/* Content */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
            <span>{timeRange}</span>
          </div>
          <h3 className={`text-base font-semibold text-gray-900 ${todo.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
            {todo.title}
          </h3>
        </div>
      </div>

      {/* Right Side Actions/Tags */}
      <div className="flex items-center gap-3">
        {/* Tag */}
        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-500 shadow-sm">
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
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FF6B6B] text-[#FF6B6B] transition-colors hover:bg-[#FF6B6B] hover:text-white"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAccept && onAccept(todo.id);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#00CC99] text-[#00CC99] transition-colors hover:bg-[#00CC99] hover:text-white"
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
      </div>
    </div>
  );
}
