"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import TodayView from "./TodayView";
import MemoryPopup from "./MemoryPopup";
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
  const [appState, setAppState] = useState<AppState>(initialAppState);
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  const handleSmartInboxItemAccept = (id: string) => {
    const item = appState.sidebar.smartInbox.items.find((i) => i.id === id);
    if (!item) return;

    // Create new task from inbox item
    const getDueLabel = (type: DueType) => {
      switch (type) {
        case "today":
          return "Due today";
        case "tomorrow":
          return "Due tomorrow";
        case "overdue":
          return "Overdue";
        default:
          return undefined;
      }
    };

    const newTask: TodayTaskData = {
      id: `task-${Date.now()}`,
      type: "simple",
      title: item.title,
      status: "active",
      dueType: item.dueType,
      dueLabel: getDueLabel(item.dueType),
      priority: "none",
    };

    // Determine which group to add task to
    const targetGroupLabel =
      item.dueType === "today"
        ? "Today"
        : item.dueType === "tomorrow"
          ? "Tomorrow"
          : item.dueType === "overdue"
            ? "Today"
            : "Next 7 days";

    setAppState((prev) => {
      const taskGroups = [...prev.todayView.taskGroups];
      const targetGroupIndex = taskGroups.findIndex((g) => g.label === targetGroupLabel);

      if (targetGroupIndex >= 0) {
        taskGroups[targetGroupIndex] = {
          ...taskGroups[targetGroupIndex],
          tasks: [...taskGroups[targetGroupIndex].tasks, newTask],
          count: taskGroups[targetGroupIndex].count + 1,
        };
      } else {
        taskGroups.push({
          label: targetGroupLabel,
          count: 1,
          tasks: [newTask],
        });
      }

      // Remove item from inbox and update counts
      const remainingItems = prev.sidebar.smartInbox.items.filter((i) => i.id !== id);
      const newInboxCount =
        prev.sidebar.smartInbox.activeTab === "inbox"
          ? prev.sidebar.smartInbox.inboxCount - 1
          : prev.sidebar.smartInbox.inboxCount;

      return {
        ...prev,
        sidebar: {
          ...prev.sidebar,
          smartInbox: {
            ...prev.sidebar.smartInbox,
            items: remainingItems,
            inboxCount: newInboxCount,
            acceptedCount: prev.sidebar.smartInbox.acceptedCount + 1,
          },
        },
        todayView: {
          ...prev.todayView,
          taskGroups,
          remainingLabel: `${taskGroups.reduce((sum, g) => sum + g.count, 0)} tasks remaining`,
          highlightedTaskId: newTask.id,
        },
      };
    });

    // Highlight animation
    setHighlightedTaskId(newTask.id);
    setTimeout(() => setHighlightedTaskId(null), 1000);
  };

  const handleSmartInboxItemReject = (id: string) => {
    setAppState((prev) => {
      const remainingItems = prev.sidebar.smartInbox.items.filter((i) => i.id !== id);
      const isInboxTab = prev.sidebar.smartInbox.activeTab === "inbox";
      const newInboxCount = isInboxTab
        ? prev.sidebar.smartInbox.inboxCount - 1
        : prev.sidebar.smartInbox.inboxCount;

      return {
        ...prev,
        sidebar: {
          ...prev.sidebar,
          smartInbox: {
            ...prev.sidebar.smartInbox,
            items: remainingItems,
            inboxCount: newInboxCount,
            rejectedCount: prev.sidebar.smartInbox.rejectedCount + 1,
          },
        },
      };
    });
  };

  // Handlers for TodayView
  const handleAddTaskSubmit = (
    title: string,
    dueType?: DueType,
    priority?: Priority,
    dueDate?: Date
  ) => {
    const getDueLabel = (type: DueType, date?: Date) => {
      if (date && type === "none") {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${date.getDate()} ${monthNames[date.getMonth()]}`;
      }
      switch (type) {
        case "today":
          return "Due today";
        case "tomorrow":
          return "Due tomorrow";
        case "overdue":
          return "Overdue";
        default:
          return undefined;
      }
    };

    const newTask: TodayTaskData = {
      id: `task-${Date.now()}`,
      type: "simple",
      title,
      status: "active",
      dueType: dueType || "none",
      dueLabel: getDueLabel(dueType || "none", dueDate),
      priority: priority || "none",
      dueDate: dueDate,
    };

    // Determine which group to add task to
    const targetGroupLabel =
      dueType === "today"
        ? "Today"
        : dueType === "tomorrow"
          ? "Tomorrow"
          : dueType === "overdue"
            ? "Today"
            : "Next 7 days";

    setAppState((prev) => {
      const taskGroups = [...prev.todayView.taskGroups];
      const targetGroupIndex = taskGroups.findIndex((g) => g.label === targetGroupLabel);

      if (targetGroupIndex >= 0) {
        taskGroups[targetGroupIndex] = {
          ...taskGroups[targetGroupIndex],
          tasks: [...taskGroups[targetGroupIndex].tasks, newTask],
          count: taskGroups[targetGroupIndex].count + 1,
        };
      } else {
        taskGroups.push({
          label: targetGroupLabel,
          count: 1,
          tasks: [newTask],
        });
      }

      return {
        ...prev,
        todayView: {
          ...prev.todayView,
          taskGroups,
          remainingLabel: `${taskGroups.reduce((sum, g) => sum + g.count, 0)} tasks remaining`,
          highlightedTaskId: newTask.id,
        },
      };
    });

    // Highlight animation
    setHighlightedTaskId(newTask.id);
    setTimeout(() => setHighlightedTaskId(null), 1000);
  };

  const handleTaskToggleStatus = (id: string) => {
    setAppState((prev) => {
      const taskGroups = prev.todayView.taskGroups.map((group) => {
        const updatedTasks = group.tasks.map((task) => {
          if (task.id === id) {
            const newStatus: TaskStatus = task.status === "active" ? "completed" : "active";
            return { ...task, status: newStatus };
          }
          return task;
        });

        const activeTasks = updatedTasks.filter((t) => t.status === "active");
        const completedTasks = updatedTasks.filter((t) => t.status === "completed");

        return {
          ...group,
          tasks: activeTasks,
          count: activeTasks.length,
        };
      });

      // Collect all completed tasks
      const allCompletedTasks = taskGroups
        .flatMap((g) => g.tasks.filter((t) => t.status === "completed"))
        .concat(
          prev.todayView.taskGroups
            .flatMap((g) => g.tasks)
            .filter((t) => t.id === id && t.status === "active")
            .map((t) => ({ ...t, status: "completed" as const }))
        );

      const activeCount = taskGroups.reduce((sum, g) => sum + g.count, 0);

      return {
        ...prev,
        todayView: {
          ...prev.todayView,
          taskGroups,
          remainingLabel: `${activeCount} tasks remaining`,
          completedSummary: {
            ...prev.todayView.completedSummary,
            items: allCompletedTasks,
            label: `${allCompletedTasks.length} Completed`,
          },
        },
      };
    });
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

  const handleTaskUpdate = (
    taskId: string,
    updates: { dueType?: DueType; priority?: Priority; dueDate?: Date }
  ) => {
    const getDueLabel = (type: DueType, date?: Date) => {
      if (date && type === "none") {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${date.getDate()} ${monthNames[date.getMonth()]}`;
      }
      switch (type) {
        case "today":
          return "Due today";
        case "tomorrow":
          return "Due tomorrow";
        case "overdue":
          return "Overdue";
        default:
          return undefined;
      }
    };

    setAppState((prev) => ({
      ...prev,
      todayView: {
        ...prev.todayView,
        taskGroups: prev.todayView.taskGroups.map((group) => ({
          ...group,
          tasks: group.tasks.map((task) => {
            if (task.id === taskId) {
              const updatedDueType = updates.dueType !== undefined ? updates.dueType : task.dueType;
              const updatedDueDate = updates.dueDate !== undefined ? updates.dueDate : task.dueDate;
              return {
                ...task,
                dueType: updatedDueType,
                priority: updates.priority !== undefined ? updates.priority : task.priority,
                dueDate: updatedDueDate,
                dueLabel: getDueLabel(updatedDueType, updatedDueDate),
              };
            }
            return task;
          }),
        })),
      },
    }));
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
