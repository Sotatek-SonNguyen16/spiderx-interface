"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format, isToday, isBefore, startOfDay, endOfDay } from "date-fns";
import { useTodos } from "../index";
import { useWhitelistManagement } from "@/features/googleChat/hooks/useWhitelistManagement";
import CalendarStrip from "./CalendarStrip";
import TodoTabs, { type TodoTabType } from "./TodoTabs";
import { PasteExtractModal } from "./PasteExtractModal";
import { useThreadFilter } from "../hooks/useThreadFilter";
import { useSyncTodo } from "../hooks/useSyncTodo";
import type { ConnectedThread } from "../types/thread";
import type { Todo } from "../types";

import { useTodoAnimations } from "../hooks/useTodoAnimations";
import { TodoFilterBar } from "./TodoFilterBar";
import { TodoListView } from "./TodoListView";
import { SimpleSwipeView } from "./SimpleSwipeView";
import { Pagination } from "./Pagination";
import { SmartSuggestionsCard } from "./SmartSuggestionsCard";
import { CompletedTasksSection } from "./CompletedTasksSection";
import { LayoutGrid, Layers, Calendar, Search, X, Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 20;

type SmartFilter = "overdue" | "highPriority" | "dueToday" | null;

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

  // Replace useGoogleChat with useWhitelistManagement as requested
  const { whitelistedSpaces, isLoading } = useWhitelistManagement();
  const { isSyncing } = useSyncTodo();

  const [activeTab, setActiveTab] = useState<TodoTabType>("todo");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedTodoId, setExpandedTodoId] = useState<string | null>(null);
  const [showPasteExtract, setShowPasteExtract] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "swipe">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [smartFilter, setSmartFilter] = useState<SmartFilter>(null);

  // Animation hook
  const {
    animatingTodoId,
    animationType,
    handleToggleTodo,
    handleAcceptQueue,
    handleRejectQueue,
  } = useTodoAnimations(refreshTodos, updateTodoApi, toggleTodoApi);

  // Convert spaces to ConnectedThread format - MEMOIZED
  const connectedThreads: ConnectedThread[] = useMemo(() => {
    return whitelistedSpaces.map((space) => ({
      id: space.id,
      name: space.name,
      displayName: space.display_name ?? undefined,
    }));
  }, [whitelistedSpaces]);

  // Thread filter hook
  const {
    selectedThreadIds,
    filteredTodos: threadFilteredTodos,
    todoCounts,
    totalTodoCount,
    toggleThread,
    clearSelection,
  } = useThreadFilter(todos, connectedThreads);

  const { filters, page, limit, fetchTodos } = useTodos(); // Destructure needed values

  // Fetch todos when filters/page/limit changes - MOVED from useTodos
  useEffect(() => {
    fetchTodos();
  }, [filters, page, limit, fetchTodos]);

  // Filter todos based on active tab, thread filter, date, search, and smart filters - OPTIMIZED
  const filteredTodos = useMemo(() => {
    const statusMap: Record<TodoTabType, string> = {
      queue: "todo",
      todo: "in_progress",
      completed: "completed",
      trash: "cancelled",
    };

    const targetStatus = statusMap[activeTab];
    let filtered = threadFilteredTodos.filter(
      (todo) => todo.status === targetStatus
    );

    // Apply date filter
    const selectedDayStart = startOfDay(selectedDate);
    const selectedDayEnd = endOfDay(selectedDate);

    filtered = filtered.filter((todo) => {
      if (!todo.dueDate) {
        // Include todos without due date only if today is selected
        return isToday(selectedDate);
      }
      const dueDate = new Date(todo.dueDate);
      return dueDate >= selectedDayStart && dueDate <= selectedDayEnd;
    });

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((todo) => {
        return (
          todo.title.toLowerCase().includes(query) ||
          todo.description?.toLowerCase().includes(query) ||
          todo.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          todo.sourceSpaceName?.toLowerCase().includes(query)
        );
      });
    }

    // Apply smart filters
    if (smartFilter) {
      const now = new Date();

      if (smartFilter === "overdue") {
        filtered = filtered.filter((todo) => {
          if (!todo.dueDate) return false;
          return isBefore(new Date(todo.dueDate), now);
        });
      } else if (smartFilter === "highPriority") {
        filtered = filtered.filter(
          (todo) => todo.priority === "high" || todo.priority === "urgent"
        );
      } else if (smartFilter === "dueToday") {
        filtered = filtered.filter((todo) => {
          if (!todo.dueDate) return false;
          return isToday(new Date(todo.dueDate));
        });
      }
    }

    return filtered;
  }, [threadFilteredTodos, activeTab, selectedDate, searchQuery, smartFilter]);

  // Pagination - OPTIMIZED
  const totalPages = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE);
  const paginatedTodos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTodos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTodos, currentPage]);

  // Reset to page 1 when tab, filter, date, or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedThreadIds, selectedDate, searchQuery, smartFilter]);

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

  const handleNavigateToDetail = useCallback(
    (id: string) => {
      router.push(`/todos/${id}?tab=${activeTab}`);
    },
    [router, activeTab]
  );

  const handleAddSubtasks = useCallback(
    async (todoId: string, subtasks: Array<{ title: string }>) => {
      await addSubtasksApi(todoId, subtasks);
    },
    [addSubtasksApi]
  );

  // Smart filter handlers
  const handleFilterOverdue = useCallback(() => {
    setSmartFilter((prev) => (prev === "overdue" ? null : "overdue"));
  }, []);

  const handleFilterHighPriority = useCallback(() => {
    setSmartFilter((prev) => (prev === "highPriority" ? null : "highPriority"));
  }, []);

  const handleFilterDueToday = useCallback(() => {
    setSmartFilter((prev) => (prev === "dueToday" ? null : "dueToday"));
  }, []);

  // Search handlers
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setShowSearchInput(false);
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    // Clear smart filters when changing date
    setSmartFilter(null);
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-b from-gray-50/50 to-white">
      {/* Fixed Header Section - Only show in list mode */}
      {viewMode === "list" && (
        <div className="flex-none px-4 md:px-6 pt-4">
          <div className="mx-auto w-full max-w-4xl">
            {/* Top Header: Title + Search */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  {isToday(selectedDate)
                    ? "Today"
                    : format(selectedDate, "EEEE")}
                </h1>
                <span className="text-lg text-gray-400 font-medium">
                  {format(selectedDate, "MMM d, yyyy")}
                </span>
              </div>

              {/* Search */}
              <div className="flex items-center gap-2">
                {showSearchInput ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search tasks..."
                      className="text-sm outline-none bg-transparent w-48"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={handleClearSearch}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearchInput(true)}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-400 text-sm hover:bg-gray-200 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search tasks...</span>
                  </button>
                )}
              </div>
            </div>

            {/* Smart AI Suggestions */}
            <SmartSuggestionsCard
              todos={todos}
              onFilterOverdue={handleFilterOverdue}
              onFilterHighPriority={handleFilterHighPriority}
              onFilterDueToday={handleFilterDueToday}
              activeFilter={smartFilter}
            />

            {/* Active Filters Display */}
            {(searchQuery || smartFilter) && (
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500">Active filters:</span>
                {searchQuery && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                    <Search className="h-3 w-3" />
                    <span>"{searchQuery}"</span>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {smartFilter === "overdue" && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                    <span>Overdue</span>
                    <button
                      onClick={() => setSmartFilter(null)}
                      className="ml-1 hover:text-red-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {smartFilter === "highPriority" && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                    <span>High Priority</span>
                    <button
                      onClick={() => setSmartFilter(null)}
                      className="ml-1 hover:text-orange-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {smartFilter === "dueToday" && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                    <span>Due Today</span>
                    <button
                      onClick={() => setSmartFilter(null)}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Calendar Strip */}
            <div className="mb-4 hidden">
              <CalendarStrip
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </div>

            {/* View Toggle + Tabs in one row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              {/* Tabs */}
              <TodoTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                counts={counts}
              />

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all bg-white text-gray-900 shadow-sm"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
                <button
                  onClick={() => setViewMode("swipe")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-gray-500 hover:text-gray-700"
                >
                  <Layers className="w-4 h-4" />
                  <span className="hidden sm:inline">Swipe</span>
                </button>
                <button
                  disabled
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 cursor-not-allowed"
                  title="Coming soon"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </button>
              </div>
            </div>

            {/* Filter & Actions Bar */}
            <TodoFilterBar
              threads={connectedThreads}
              selectedThreadIds={selectedThreadIds}
              onThreadToggle={toggleThread}
              onClearSelection={clearSelection}
              todoCounts={todoCounts}
              totalTodoCount={totalTodoCount}
              spacesLoading={isLoading}
              onSyncComplete={() => refreshTodos()}
            />
          </div>
        </div>
      )}

      {/* Swipe Mode Header */}
      {viewMode === "swipe" && (
        <div className="flex-none p-4">
          <div className="mx-auto w-full max-w-4xl">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setViewMode("list")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <LayoutGrid className="w-5 h-5" />
                <span className="font-medium">Back to List</span>
              </button>
              <span className="text-sm text-gray-500">
                {filteredTodos.length} tasks to review
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content based on view mode */}
      {viewMode === "list" ? (
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
            hasActiveFilters={
              !!searchQuery || !!smartFilter || selectedThreadIds.length > 0
            }
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
        /* Simple Swipe View for debugging */
        <SimpleSwipeView
          todos={filteredTodos}
          onAccept={handleAcceptQueue}
          onReject={handleRejectQueue}
          onComplete={() => {
            // Switch back to list view when done
            setViewMode("list");
          }}
          onBackToTodo={() => {
            // Switch back to list view
            setViewMode("list");
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
