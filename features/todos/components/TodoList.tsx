"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useTodos } from "../index";
import { useGoogleChat } from "@/features/googleChat";
import CalendarStrip from "./CalendarStrip";
import type { TodoTabType } from "./TodoTabs";
import { PasteExtractModal } from "./PasteExtractModal";
import { useThreadFilter } from "../hooks/useThreadFilter";
import type { ConnectedThread } from "../types/thread";

import { useTodoAnimations } from "../hooks/useTodoAnimations";
import { TodoFilterBar } from "./TodoFilterBar";
import { TodoListView } from "./TodoListView";
import { Pagination } from "./Pagination";

const ITEMS_PER_PAGE = 20;

export default function TodoList() {
  const router = useRouter();

  // Fetch todos from API
  const {
    todos,
    loading: todosLoading,
    error: todosError,
    refresh: refreshTodos,
    updateTodo: updateTodoApi,
    toggleTodo: toggleTodoApi,
    addSubtasks: addSubtasksApi,
  } = useTodos();

  // Fetch whitelisted spaces for thread filter
  const { spaces, loading: spacesLoading, fetchWhitelistedSpaces } = useGoogleChat();

  const [activeTab, setActiveTab] = useState<TodoTabType>("todo");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedTodoId, setExpandedTodoId] = useState<string | null>(null);
  const [showPasteExtract, setShowPasteExtract] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Animation hook
  const {
    animatingTodoId,
    animationType,
    handleToggleTodo,
    handleAcceptQueue,
    handleRejectQueue
  } = useTodoAnimations(refreshTodos, updateTodoApi, toggleTodoApi);

  // Convert spaces to ConnectedThread format
  // fetchWhitelistedSpaces already returns only whitelisted spaces
  const connectedThreads: ConnectedThread[] = useMemo(() => {
    return spaces.map((space) => ({
      id: space.id,
      name: space.name,
      displayName: space.display_name ?? undefined,
    }));
  }, [spaces]);

  // Thread filter hook
  const {
    selectedThreadIds,
    filteredTodos: threadFilteredTodos,
    todoCounts,
    totalTodoCount,
    toggleThread,
    clearSelection,
  } = useThreadFilter(todos, connectedThreads);

  // Fetch whitelisted spaces on mount
  useEffect(() => {
    fetchWhitelistedSpaces();
  }, [fetchWhitelistedSpaces]);

  // Filter todos based on active tab AND thread filter
  const filteredTodos = useMemo(() => {
    return threadFilteredTodos.filter((todo) => {
      if (activeTab === "queue") return todo.status === "todo";
      if (activeTab === "todo") return todo.status === "in_progress";
      if (activeTab === "completed") return todo.status === "completed";
      if (activeTab === "trash") return todo.status === "cancelled";
      return false;
    });
  }, [threadFilteredTodos, activeTab]);

  // Pagination
  const totalPages = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE);
  const paginatedTodos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTodos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTodos, currentPage]);

  // Reset to page 1 when tab or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedThreadIds]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of list
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      todo: todos.filter((t) => t.status === "in_progress").length,
      queue: todos.filter((t) => t.status === "todo").length,
      trash: todos.filter((t) => t.status === "cancelled").length,
      completed: todos.filter((t) => t.status === "completed").length,
    };
  }, [todos]);

  // Get current month name
  const currentMonthName = format(selectedDate, "MMMM yyyy");

  const handleItemClick = (id: string) => {
    setExpandedTodoId((prev) => (prev === id ? null : id));
  };

  const handleNavigateToDetail = (id: string) => {
    router.push(`/todos/${id}?tab=${activeTab}`);
  };

  return (
    <div 
      className="flex h-full flex-col overflow-hidden bg-white"
    >
      {/* Fixed Header Section */}
      <div className="flex-none p-4 md:p-6 pb-0">
        <div className="mx-auto w-full max-w-4xl">
          {/* Month Name Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{currentMonthName}</h1>
          </div>

          {/* Calendar Strip */}
          <div className="mb-4">
            <CalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
          </div>

          {/* Filter Bar */}
          <TodoFilterBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={counts}
            threads={connectedThreads}
            selectedThreadIds={selectedThreadIds}
            onThreadToggle={toggleThread}
            onClearSelection={clearSelection}
            todoCounts={todoCounts}
            totalTodoCount={totalTodoCount}
            spacesLoading={spacesLoading}
            onSyncComplete={() => refreshTodos()}
          />
        </div>
      </div>

      {/* List View */}
      <TodoListView
        todos={paginatedTodos}
        activeTab={activeTab}
        loading={todosLoading}
        animatingTodoId={animatingTodoId}
        animationType={animationType}
        expandedTodoId={expandedTodoId}
        onToggleTodo={handleToggleTodo}
        onAcceptQueue={handleAcceptQueue}
        onRejectQueue={handleRejectQueue}
        onItemClick={handleItemClick}
        onNavigateToDetail={handleNavigateToDetail}
        onAddSubtasks={async (todoId, subtasks) => {
          await addSubtasksApi(todoId, subtasks);
        }}
      />

      {/* Pagination */}
      {filteredTodos.length > 0 && (
        <div className="flex-none px-4 md:px-6 pb-4">
          <div className="mx-auto w-full max-w-4xl">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filteredTodos.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </div>
      )}

      {/* Paste Extract Modal */}
      <PasteExtractModal
        isOpen={showPasteExtract}
        onClose={() => setShowPasteExtract(false)}
        onExtractComplete={() => refreshTodos()}
      />
    </div>
  );
}

