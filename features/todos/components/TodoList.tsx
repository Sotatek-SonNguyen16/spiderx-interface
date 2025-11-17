"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import TodayView from "./TodayView";
import MemoryPopup from "./MemoryPopup";
import { useTodos, mapTodoToInboxItem, groupTodosByDueDate, mapTodoToTodayTaskData } from "../index";
import type { AppState, TodayTaskData, InboxTab, DueType, Priority, TaskStatus } from "../types/ui.types";

// Initial empty state
const initialAppState: AppState = {
  sidebar: {
    appName: "SpiderX",
    showAddProjectButton: true,
    searchPlaceholder: "Search",
    smartInbox: {
      activeTab: "inbox",
      inboxCount: 0,
      acceptedCount: 0,
      rejectedCount: 0,
      items: [],
    },
  },
  todayView: {
    title: "Today",
    description: "Tasks you've accepted from Inbox.",
    remainingLabel: "0 tasks remaining",
    addTaskPlaceholder: "Add a task...",
    taskGroups: [],
    completedSummary: {
      label: "0 Completed",
      isExpanded: false,
      items: [],
    },
  },
};

export default function TodoList() {
  // Fetch todos from API
  const {
    todos,
    loading: todosLoading,
    error: todosError,
    refresh: refreshTodos,
    createTodo: createTodoApi,
    toggleTodo: toggleTodoApi,
    updateTodo: updateTodoApi,
  } = useTodos();

  const [appState, setAppState] = useState<AppState>(initialAppState);
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Map todos to inbox items (only todos with status "todo")
  const inboxItems = useMemo(() => {
    return todos
      .filter((todo) => todo.status === "todo")
      .map(mapTodoToInboxItem);
  }, [todos]);

  // Group todos by due date for Today View
  const taskGroups = useMemo(() => {
    // Only show active todos (not completed) in today view
    const activeTodos = todos.filter((todo) => todo.status !== "completed");
    return groupTodosByDueDate(activeTodos);
  }, [todos]);

  // Get completed todos for completed summary
  const completedTasks = useMemo(() => {
    const completedTodos = todos.filter((todo) => todo.status === "completed");
    return completedTodos.map(mapTodoToTodayTaskData);
  }, [todos]);

  // Update app state when todos change
  useEffect(() => {
    if (!todosLoading && todos.length >= 0) {
      // Calculate active task count
      const activeCount = todos.filter((todo) => todo.status !== "completed").length;

      setAppState((prev) => ({
        ...prev,
        sidebar: {
          ...prev.sidebar,
          smartInbox: {
            ...prev.sidebar.smartInbox,
            inboxCount: inboxItems.length,
            items: inboxItems,
          },
        },
        todayView: {
          ...prev.todayView,
          taskGroups,
          remainingLabel: `${activeCount} tasks remaining`,
          completedSummary: {
            label: `${completedTasks.length} Completed`,
            isExpanded: prev.todayView.completedSummary.isExpanded,
            items: completedTasks,
          },
        },
      }));
    }
  }, [todos, todosLoading, inboxItems, taskGroups, completedTasks]);

  // Sidebar resize functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 500) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing]);

  const handleResizeStart = () => {
    setIsResizing(true);
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
  };

  // Handlers for Sidebar
  const handleSearchChange = (value: string) => {
    console.log("Search:", value);
    // TODO: Implement search functionality
  };

  const handleInboxTabChange = (tab: InboxTab) => {
    setAppState((prev) => ({
      ...prev,
      sidebar: {
        ...prev.sidebar,
        smartInbox: {
          ...prev.sidebar.smartInbox,
          activeTab: tab,
        },
      },
    }));
  };

  const handleSmartInboxItemClick = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      sidebar: {
        ...prev.sidebar,
        smartInbox: {
          ...prev.sidebar.smartInbox,
          items: prev.sidebar.smartInbox.items.map((item) => ({
            ...item,
            isSelected: item.id === id,
          })),
        },
      },
    }));
  };

  const handleSmartInboxItemAccept = async (id: string) => {
    const item = appState.sidebar.smartInbox.items.find((i) => i.id === id);
    if (!item) return;

    // Find the original todo
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    // Update todo status from "todo" to "in_progress" (accepting from inbox)
    const result = await updateTodoApi(id, { status: "in_progress" });
    if (result.success) {
      // Refresh todos to sync with server
      await refreshTodos();
      // Highlight animation
      setHighlightedTaskId(id);
      setTimeout(() => setHighlightedTaskId(null), 1000);
    }
  };

  const handleSmartInboxItemReject = async (id: string) => {
    // Update todo status to "cancelled" (rejecting from inbox)
    const result = await updateTodoApi(id, { status: "cancelled" });
    if (result.success) {
      // Refresh todos to sync with server
      await refreshTodos();
    }
  };

  // Handlers for TodayView
  const handleAddTaskSubmit = async (
    title: string,
    dueType?: DueType,
    priority?: Priority,
    dueDate?: Date
  ) => {
    // Map UI priority to API priority
    const mapPriorityToApi = (p?: Priority): "low" | "medium" | "high" | "urgent" => {
      switch (p) {
        case "high":
          return "high";
        case "medium":
          return "medium";
        case "low":
          return "low";
        default:
          return "medium";
      }
    };

    // Convert dueDate to ISO string if provided
    const dueDateISO = dueDate ? dueDate.toISOString() : undefined;

    // Create todo via API
    const result = await createTodoApi({
      title,
      priority: mapPriorityToApi(priority),
      dueDate: dueDateISO,
      status: "in_progress", // New tasks are in progress
    });

    if (result.success && result.data) {
      // Refresh todos to sync with server
      await refreshTodos();
      // Highlight animation
      setHighlightedTaskId(result.data.id);
      setTimeout(() => setHighlightedTaskId(null), 1000);
    }
  };

  const handleTaskToggleStatus = async (id: string) => {
    // Toggle todo status via API
    const result = await toggleTodoApi(id);
    if (result.success) {
      // Refresh todos to sync with server
      await refreshTodos();
    }
  };

  const handleTaskClick = (id: string) => {
    // Toggle task expansion
    setAppState((prev) => ({
      ...prev,
      todayView: {
        ...prev.todayView,
        taskGroups: prev.todayView.taskGroups.map((group) => ({
          ...group,
          tasks: group.tasks.map((task) => {
            if (task.id === id && task.type === "meeting") {
              return { ...task, isExpanded: !task.isExpanded };
            }
            return task;
          }),
        })),
      },
    }));
  };

  const handleSubTaskToggleStatus = (taskId: string, subTaskId: string) => {
    setAppState((prev) => ({
      ...prev,
      todayView: {
        ...prev.todayView,
        taskGroups: prev.todayView.taskGroups.map((group) => ({
          ...group,
          tasks: group.tasks.map((task) => {
            if (task.id === taskId && task.type === "meeting") {
              return {
                ...task,
                subtasks: task.subtasks.map((subtask) => {
                  if (subtask.id === subTaskId) {
                    return {
                      ...subtask,
                      status: subtask.status === "active" ? "completed" : "active",
                    };
                  }
                  return subtask;
                }),
              };
            }
            return task;
          }),
        })),
      },
    }));
  };

  const handleTaskUpdate = async (
    taskId: string,
    updates: { dueType?: DueType; priority?: Priority; dueDate?: Date }
  ) => {
    // Map UI priority to API priority
    const mapPriorityToApi = (p?: Priority): "low" | "medium" | "high" | "urgent" | undefined => {
      switch (p) {
        case "high":
          return "high";
        case "medium":
          return "medium";
        case "low":
          return "low";
        case "none":
          return undefined;
        default:
          return undefined;
      }
    };

    // Prepare update payload
    const updatePayload: { priority?: "low" | "medium" | "high" | "urgent"; dueDate?: string } = {};

    if (updates.priority !== undefined) {
      const apiPriority = mapPriorityToApi(updates.priority);
      if (apiPriority) {
        updatePayload.priority = apiPriority;
      }
    }

    if (updates.dueDate !== undefined) {
      updatePayload.dueDate = updates.dueDate.toISOString();
    }

    // Update todo via API
    const result = await updateTodoApi(taskId, updatePayload);
    if (result.success) {
      // Refresh todos to sync with server
      await refreshTodos();
    }
  };

  const handleToggleCompletedSummary = () => {
    setAppState((prev) => ({
      ...prev,
      todayView: {
        ...prev.todayView,
        completedSummary: {
          ...prev.todayView.completedSummary,
          isExpanded: !prev.todayView.completedSummary.isExpanded,
        },
      },
    }));
  };

  const handleGenerateSubtasks = (taskId: string) => {
    // Generate subtasks based on task title
    // TODO: Implement AI API call to generate subtasks
    setAppState((prev) => ({
      ...prev,
      todayView: {
        ...prev.todayView,
        taskGroups: prev.todayView.taskGroups.map((group) => ({
          ...group,
          tasks: group.tasks.map((task) => {
            if (task.id === taskId && task.type === "meeting") {
              // Generate subtasks (simplified - in real app, call AI API)
              const generatedSubtasks = [
                { id: `sub-${Date.now()}-1`, title: "Define requirements", status: "active" as const },
                { id: `sub-${Date.now()}-2`, title: "Research and plan approach", status: "active" as const },
                { id: `sub-${Date.now()}-3`, title: "Execute main tasks", status: "active" as const },
              ];
              return {
                ...task,
                subtasks: generatedSubtasks,
              };
            }
            return task;
          }),
        })),
      },
    }));
  };

  // Show loading state while fetching todos
  if (todosLoading && todos.length === 0) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#f5f5f7] items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (todosError && todos.length === 0) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#f5f5f7] items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading todos: {todosError}</p>
          <button
            onClick={() => refreshTodos()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f7]">
      {/* Sidebar - Resizable */}
      <div
        ref={sidebarRef}
        className="relative flex-shrink-0 bg-white border-r border-[#e5e5e5] flex flex-col"
        style={{ width: `${sidebarWidth}px`, minWidth: "200px", maxWidth: "500px" }}
      >
        <div
          className="absolute top-0 right-0 w-[5px] h-full cursor-ew-resize bg-transparent z-10 hover:bg-[#007aff]"
          onMouseDown={handleResizeStart}
        />
        <Sidebar
          data={appState.sidebar}
          onSearchChange={handleSearchChange}
          onInboxTabChange={handleInboxTabChange}
          onSmartInboxItemClick={handleSmartInboxItemClick}
          onSmartInboxItemAccept={handleSmartInboxItemAccept}
          onSmartInboxItemReject={handleSmartInboxItemReject}
          onLogout={() => {
            // Xóa token và redirect về trang đăng nhập
            localStorage.removeItem("auth_token");
            window.location.href = "/signin";
          }}
        />
      </div>

      {/* Today View - Flexible width */}
      <div className="flex-1 overflow-hidden">
        <TodayView
          data={{
            ...appState.todayView,
            highlightedTaskId: highlightedTaskId || appState.todayView.highlightedTaskId,
          }}
          onAddTaskSubmit={handleAddTaskSubmit}
          onTaskToggleStatus={handleTaskToggleStatus}
          onTaskClick={handleTaskClick}
          onSubTaskToggleStatus={handleSubTaskToggleStatus}
          onToggleCompletedSummary={handleToggleCompletedSummary}
          onGenerateSubtasks={handleGenerateSubtasks}
          onOpenMemory={() => setShowMemory(true)}
          onTaskUpdate={handleTaskUpdate}
        />
      </div>

      {/* Memory Popup */}
      {showMemory && <MemoryPopup onClose={() => setShowMemory(false)} />}
    </div>
  );
}
