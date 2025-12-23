"use client";

import { memo } from "react";
import TodoItem from "./TodoItem";
import type { Todo } from "../types";
import type { TodoTabType } from "./TodoTabs";
import type { AnimationType } from "../hooks/useTodoAnimations";

interface TodoListViewProps {
  todos: Todo[];
  activeTab: TodoTabType;
  loading: boolean;
  animatingTodoId: string | null;
  animationType: AnimationType;
  expandedTodoId: string | null;
  onToggleTodo: (id: string) => void;
  onAcceptQueue: (id: string) => void;
  onRejectQueue: (id: string) => void;
  onItemClick: (id: string) => void;
  onNavigateToDetail: (id: string) => void;
  onAddSubtasks?: (
    todoId: string,
    subtasks: Array<{ title: string }>
  ) => Promise<void>;
  hasActiveFilters?: boolean;
}

const TodoListViewComponent = ({
  todos,
  activeTab,
  loading,
  animatingTodoId,
  animationType,
  expandedTodoId,
  onToggleTodo,
  onAcceptQueue,
  onRejectQueue,
  onItemClick,
  onNavigateToDetail,
  onAddSubtasks,
  hasActiveFilters = false,
}: TodoListViewProps) => {
  if (loading && todos.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-4 pt-0 custom-scrollbar">
      <div className="mx-auto w-full max-w-4xl">
        <div className="space-y-3 pb-4">
          {todos.length === 0 ? (
            <div className="rounded-xl bg-white/60 py-12 text-center backdrop-blur-sm">
              <div className="text-gray-400 mb-2">
                {hasActiveFilters ? (
                  <svg
                    className="mx-auto h-12 w-12 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                )}
              </div>
              <p className="text-gray-500 font-medium">
                {hasActiveFilters
                  ? "No tasks match your filters"
                  : `No tasks found in ${activeTab}`}
              </p>
              {hasActiveFilters && (
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search or filters
                </p>
              )}
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`transition-all duration-300 ${
                  animatingTodoId === todo.id
                    ? animationType === "accept"
                      ? "translate-x-full opacity-0 scale-95"
                      : animationType === "reject"
                      ? "-translate-x-full opacity-0 scale-95"
                      : animationType === "complete"
                      ? "scale-95 opacity-0"
                      : ""
                    : ""
                }`}
              >
                <TodoItem
                  todo={todo}
                  variant={
                    activeTab === "queue"
                      ? "queue"
                      : activeTab === "completed"
                      ? "completed"
                      : "todo"
                  }
                  isExpanded={expandedTodoId === todo.id}
                  onToggle={onToggleTodo}
                  onAccept={onAcceptQueue}
                  onReject={onRejectQueue}
                  onClick={onItemClick}
                  onAddSubtasks={onAddSubtasks}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Memoize component để tránh re-render không cần thiết
export const TodoListView = memo(TodoListViewComponent);
