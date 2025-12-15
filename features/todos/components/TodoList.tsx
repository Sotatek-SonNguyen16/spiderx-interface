"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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
import { SwipeView } from "./SwipeView";
import { Pagination } from "./Pagination";
import { LayoutGrid, Layers } from "lucide-react";

const ITEMS_PER_PAGE = 20;

export default function TodoList() {
  const router = useRouter();

  // Fetch todos from API - OPTIMIZED: chỉ lấy những gì cần
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
  const [viewMode, setViewMode] = useState<'list' | 'swipe'>('list');
  
  // Animation hook
  const {
    animatingTodoId,
    animationType,
    handleToggleTodo,
    handleAcceptQueue,
    handleRejectQueue
  } = useTodoAnimations(refreshTodos, updateTodoApi, toggleTodoApi);

  // Convert spaces to ConnectedThread format - MEMOIZED
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

  // Fetch whitelisted spaces on mount - OPTIMIZED: chỉ fetch 1 lần
  useEffect(() => {
    fetchWhitelistedSpaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần khi mount

  // Filter todos based on active tab AND thread filter - OPTIMIZED
  const filteredTodos = useMemo(() => {
    const statusMap: Record<TodoTabType, string> = {
      queue: "todo",
      todo: "in_progress", 
      completed: "completed",
      trash: "cancelled",
    };
    
    const targetStatus = statusMap[activeTab];
    return threadFilteredTodos.filter((todo) => todo.status === targetStatus);
  }, [threadFilteredTodos, activeTab]);

  // Pagination - OPTIMIZED
  const totalPages = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE);
  const paginatedTodos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTodos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTodos, currentPage]);

  // Reset to page 1 when tab or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedThreadIds]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Counts for tabs - OPTIMIZED: cache kết quả
  const counts = useMemo(() => {
    const result = {
      todo: 0,
      queue: 0,
      trash: 0,
      completed: 0,
    };
    
    todos.forEach((t) => {
      if (t.status === "in_progress") result.todo++;
      else if (t.status === "todo") result.queue++;
      else if (t.status === "cancelled") result.trash++;
      else if (t.status === "completed") result.completed++;
    });
    
    return result;
  }, [todos]);

  // Get current month name
  const currentMonthName = format(selectedDate, "MMMM yyyy");

  const handleItemClick = useCallback((id: string) => {
    setExpandedTodoId((prev) => (prev === id ? null : id));
  }, []);

  const handleNavigateToDetail = useCallback((id: string) => {
    router.push(`/todos/${id}?tab=${activeTab}`);
  }, [router, activeTab]);

  const handleAddSubtasks = useCallback(async (todoId: string, subtasks: Array<{ title: string }>) => {
    await addSubtasksApi(todoId, subtasks);
  }, [addSubtasksApi]);

  return (
    <div 
      className="flex h-full flex-col overflow-hidden bg-white"
    >
      {/* Fixed Header Section - Only show in list mode */}
      {viewMode === 'list' && (
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
      )}

      {/* View Mode Toggle - Always visible */}
      <div className="flex-none p-4 md:p-6 pb-0">
        <div className="mx-auto w-full max-w-4xl">
          <div className="flex justify-end">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                List View
              </button>
              <button
                onClick={() => setViewMode('swipe')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'swipe'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                Swipe Mode
              </button>
            </div>
          </div>
        </div>
      </div>



      {/* Content based on view mode */}
      {viewMode === 'list' ? (
        <>
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
            onAddSubtasks={handleAddSubtasks}
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
        </>
      ) : (
        /* Swipe View */
        <SwipeView
          todos={filteredTodos}
          onAccept={handleAcceptQueue}
          onReject={handleRejectQueue}
          onComplete={() => {
            // Switch back to list view when done
            setViewMode('list');
          }}
        />
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

