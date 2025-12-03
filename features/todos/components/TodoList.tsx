"use client";

import { useState, useEffect, useMemo } from "react";
import { useTodos } from "../index";
import CalendarStrip from "./CalendarStrip";
import TodoTabs, { TodoTabType } from "./TodoTabs";
import TodoItem from "./TodoItem";

export default function TodoList() {
  // Fetch todos from API
  const {
    todos,
    loading: todosLoading,
    error: todosError,
    refresh: refreshTodos,
    updateTodo: updateTodoApi,
    toggleTodo: toggleTodoApi,
  } = useTodos();

  const [activeTab, setActiveTab] = useState<TodoTabType>("todo");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedTodoId, setExpandedTodoId] = useState<string | null>(null);

  // Filter todos based on active tab
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (activeTab === "queue") return todo.status === "todo";
      if (activeTab === "todo") return todo.status === "in_progress";
      if (activeTab === "completed") return todo.status === "completed";
      if (activeTab === "trash") return todo.status === "cancelled";
      return false;
    });
  }, [todos, activeTab]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      todo: todos.filter((t) => t.status === "in_progress").length,
      queue: todos.filter((t) => t.status === "todo").length,
      trash: todos.filter((t) => t.status === "cancelled").length,
      completed: todos.filter((t) => t.status === "completed").length,
    };
  }, [todos]);

  // Handlers
  const handleToggleTodo = async (id: string) => {
    await toggleTodoApi(id);
    refreshTodos();
  };

  const handleAcceptQueue = async (id: string) => {
    await updateTodoApi(id, { status: "in_progress" });
    refreshTodos();
  };

  const handleRejectQueue = async (id: string) => {
    await updateTodoApi(id, { status: "cancelled" });
    refreshTodos();
  };

  const handleItemClick = (id: string) => {
    // Toggle expansion: if already expanded, collapse it; otherwise expand it
    setExpandedTodoId(prev => prev === id ? null : id);
  };

  if (todosLoading && todos.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Fixed Header Section */}
      <div className="flex-none p-4 md:p-6 pb-0">
         <div className="mx-auto w-full max-w-4xl">
            {/* Calendar Strip */}
            <div className="mb-4">
              <CalendarStrip
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>

            {/* Tabs */}
            <div className="mb-3">
              <TodoTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                counts={counts}
              />
            </div>
         </div>
      </div>

      {/* Scrollable List Section */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-0">
        <div className="mx-auto w-full max-w-4xl">
            <div className="space-y-2 pb-4">
              {filteredTodos.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  No tasks found in {activeTab}.
                </div>
              ) : (
                filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    variant={activeTab === "queue" ? "queue" : activeTab === "completed" ? "completed" : "todo"}
                    isExpanded={expandedTodoId === todo.id}
                    onToggle={handleToggleTodo}
                    onAccept={handleAcceptQueue}
                    onReject={handleRejectQueue}
                    onClick={handleItemClick}
                  />
                ))
              )}
            </div>
        </div>
      </div>
    </div>
  );
}

