"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Tag, 
  MessageSquare,
  ArrowRight,
  AlertCircle,
  Zap
} from "lucide-react";
import type { SyncResult } from "../types/sync";
import type { GeneratedTodo } from "@/features/googleChat/types";

interface SyncSuccessViewProps {
  result: SyncResult;
  onOpenQueue?: () => void;
  onSyncMore?: () => void;
}

// Priority badge colors
const priorityColors: Record<string, string> = {
  urgent: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

// Eisenhower matrix labels
const eisenhowerLabels: Record<string, string> = {
  urgent_important: "Do First",
  not_urgent_important: "Schedule",
  urgent_not_important: "Delegate",
  not_urgent_not_important: "Eliminate",
};

export function SyncSuccessView({ result, onOpenQueue, onSyncMore }: SyncSuccessViewProps) {
  const router = useRouter();
  const [expandedTodos, setExpandedTodos] = useState<Set<string>>(new Set());
  const [showAllTodos, setShowAllTodos] = useState(false);

  const handleOpenQueue = () => {
    if (onOpenQueue) {
      onOpenQueue();
    } else {
      router.push("/todos");
    }
  };

  const toggleTodoExpand = (todoId: string) => {
    setExpandedTodos(prev => {
      const next = new Set(prev);
      if (next.has(todoId)) {
        next.delete(todoId);
      } else {
        next.add(todoId);
      }
      return next;
    });
  };

  const todos = result.todos || [];
  const displayedTodos = showAllTodos ? todos : todos.slice(0, 5);
  const hasMoreTodos = todos.length > 5;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-6">
      {/* Success Header */}
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Sync Completed!</h1>
          <p className="text-gray-500">{result.summary}</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-1 text-2xl font-bold text-blue-600">
              {result.totalMessagesProcessed}
            </div>
            <div className="text-sm text-gray-500">Messages Processed</div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-1 text-2xl font-bold text-purple-600">
              {result.totalTodosGenerated}
            </div>
            <div className="text-sm text-gray-500">Todos Generated</div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-1 text-2xl font-bold text-green-600">
              {result.totalTodosSaved}
            </div>
            <div className="text-sm text-gray-500">Todos Saved</div>
          </div>
        </div>

        {/* Processed Spaces */}
        {result.processedSpaces && result.processedSpaces.length > 0 && (
          <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-semibold text-gray-700">Processed Spaces</h3>
            <div className="flex flex-wrap gap-2">
              {result.processedSpaces.map((space, index) => (
                <span
                  key={index}
                  className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
                >
                  {space}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Generated Todos List */}
        {todos.length > 0 && (
          <div className="mb-8 rounded-xl bg-white shadow-sm">
            <div className="border-b border-gray-100 p-4">
              <h3 className="font-semibold text-gray-700">
                Generated Todos ({todos.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {displayedTodos.map((todo) => (
                <TodoItem
                  key={todo.todoId}
                  todo={todo}
                  isExpanded={expandedTodos.has(todo.todoId)}
                  onToggle={() => toggleTodoExpand(todo.todoId)}
                />
              ))}
            </div>
            {hasMoreTodos && (
              <button
                onClick={() => setShowAllTodos(!showAllTodos)}
                className="flex w-full items-center justify-center gap-2 border-t border-gray-100 p-3 text-sm text-blue-600 hover:bg-gray-50"
              >
                {showAllTodos ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show All ({todos.length - 5} more)
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Empty State */}
        {todos.length === 0 && result.totalTodosGenerated === 0 && (
          <div className="mb-8 rounded-xl bg-white p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">No action items found in the messages.</p>
            <p className="mt-1 text-sm text-gray-400">
              Try syncing more messages or check different spaces.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleOpenQueue}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Open Queue
            <ArrowRight className="h-4 w-4" />
          </button>
          {onSyncMore && (
            <button
              onClick={onSyncMore}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Zap className="h-4 w-4 text-yellow-500" />
              Sync More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Todo Item Component
interface TodoItemProps {
  todo: GeneratedTodo;
  isExpanded: boolean;
  onToggle: () => void;
}

function TodoItem({ todo, isExpanded, onToggle }: TodoItemProps) {
  return (
    <div className="p-4">
      <div
        className="flex cursor-pointer items-start justify-between gap-3"
        onClick={onToggle}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${
                priorityColors[todo.priority] || "bg-gray-100 text-gray-700"
              }`}
            >
              {todo.priority}
            </span>
            {todo.eisenhower && (
              <span className="text-xs text-gray-400">
                {eisenhowerLabels[todo.eisenhower] || todo.eisenhower}
              </span>
            )}
          </div>
          <h4 className="font-medium text-gray-900 truncate">{todo.title}</h4>
          {!isExpanded && todo.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-1">
              {todo.description}
            </p>
          )}
        </div>
        <button className="shrink-0 text-gray-400">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-3 pl-0">
          {/* Description */}
          {todo.description && (
            <p className="text-sm text-gray-600">{todo.description}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {todo.dueDate && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{new Date(todo.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            {todo.estimatedTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{todo.estimatedTime} min</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {todo.tags && todo.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {todo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Source Info */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <MessageSquare className="h-3 w-3" />
            <span>From: {todo.sourceSpaceName}</span>
            {todo.sourceThreadName && todo.sourceThreadName.length > 0 && (
              <span>• Thread: {todo.sourceThreadName.join(", ")}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SyncSuccessView;
