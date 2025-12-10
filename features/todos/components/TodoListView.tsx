"use client";

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
  onAddSubtasks?: (todoId: string, subtasks: Array<{ title: string }>) => Promise<void>;
}

export const TodoListView = ({
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
}: TodoListViewProps) => {
  if (loading && todos.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-0">
      <div className="mx-auto w-full max-w-4xl">
        <div className="space-y-2 pb-4">
          {todos.length === 0 ? (
            <div className="rounded-xl bg-white/60 py-12 text-center text-gray-500 backdrop-blur-sm">
              No tasks found in {activeTab}.
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
                    activeTab === "queue" ? "queue" : activeTab === "completed" ? "completed" : "todo"
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
