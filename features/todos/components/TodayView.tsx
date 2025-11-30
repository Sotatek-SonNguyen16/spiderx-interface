"use client";

import { useState, useRef, useEffect } from "react";
import type { TodayViewProps, TodayTaskData, Priority } from "../types/ui.types";
import CalendarPopup from "./CalendarPopup";
import AddTaskForm from "./AddTaskForm";
import TaskEditMenu from "./TaskEditMenu";

export default function TodayView({
  data,
  onAddTaskSubmit,
  onTaskToggleStatus,
  onTaskClick,
  onSubTaskToggleStatus,
  onToggleCompletedSummary,
  onGenerateSubtasks,
  onOpenMemory,
  onTaskUpdate,
}: TodayViewProps & { onOpenMemory?: () => void }) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [generatingTaskId, setGeneratingTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [showDeadlineEditor, setShowDeadlineEditor] = useState<string | null>(null);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState<string | null>(null);
  const [tempDeadlineSelection, setTempDeadlineSelection] = useState<Record<string, Date>>({});
  const calendarRef = useRef<HTMLDivElement>(null);
  const dateSelectorRef = useRef<HTMLDivElement>(null);
  const deadlineEditorRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const priorityDropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        dateSelectorRef.current &&
        !dateSelectorRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }

      // Close deadline editors
      Object.entries(deadlineEditorRefs.current).forEach(([taskId, ref]) => {
        if (ref && !ref.contains(event.target as Node)) {
          setShowDeadlineEditor((prev) => (prev === taskId ? null : prev));
        }
      });

      // Close priority dropdowns
      Object.entries(priorityDropdownRefs.current).forEach(([taskId, ref]) => {
        if (ref && !ref.contains(event.target as Node)) {
          setShowPriorityDropdown((prev) => (prev === taskId ? null : prev));
        }
      });
    };

    if (showCalendar || showDeadlineEditor || showPriorityDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showCalendar, showDeadlineEditor, showPriorityDropdown]);

  const handleAddTask = (title: string, dueType: any, priority: Priority, dueDate?: Date) => {
    onAddTaskSubmit?.(title, dueType, priority, dueDate);
  };

  const handleTaskExpand = (taskId: string, e: React.MouseEvent) => {
    // Don't expand if clicking on checkbox or its children
    const target = e.target as HTMLElement;
    if (
      target.classList.contains("custom-checkbox") ||
      target.closest(".custom-checkbox") ||
      target.closest(".deadline-editor") ||
      target.closest(".priority-editor") ||
      target.closest(".deadline-popup") ||
      target.closest(".priority-dropdown")
    ) {
      return;
    }
    // Toggle expansion
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(taskId);
    }
    onTaskClick?.(taskId);
  };

  const handleGenerateSubtasks = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGeneratingTaskId(taskId);
    onGenerateSubtasks?.(taskId);
    setTimeout(() => setGeneratingTaskId(null), 800);
  };

  const formatDateForDeadline = (date?: Date) => {
    if (!date) return "No deadline";
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleOpenDeadlineEditor = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const task = filteredTaskGroups.flatMap(g => g.tasks).find(t => t.id === taskId);
    if (task) {
      setTempDeadlineSelection({ ...tempDeadlineSelection, [taskId]: task.dueDate || new Date() });
      setShowDeadlineEditor(taskId);
      setShowPriorityDropdown(null);
    }
  };

  const handleCloseDeadlineEditor = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeadlineEditor(null);
    const newTemp = { ...tempDeadlineSelection };
    delete newTemp[taskId];
    setTempDeadlineSelection(newTemp);
  };

  const handleSaveDeadline = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const selectedDeadline = tempDeadlineSelection[taskId];
    if (selectedDeadline) {
      onTaskUpdate?.(taskId, { dueDate: selectedDeadline, dueType: "none" });
    }
    handleCloseDeadlineEditor(taskId, e);
  };

  const handleOpenPriorityDropdown = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPriorityDropdown(taskId);
    setShowDeadlineEditor(null);
  };

  const handleChangePriority = (taskId: string, priority: Priority, e: React.MouseEvent) => {
    e.stopPropagation();
    onTaskUpdate?.(taskId, { priority });
    setShowPriorityDropdown(null);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatDate = (date: Date) => {
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getViewTitle = () => {
    const today = new Date();
    const isToday =
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear();

    if (isToday) {
      return "Today";
    } else {
      const monthShort = monthNames[selectedDate.getMonth()].substring(0, 3);
      return `Tasks - ${monthShort} ${selectedDate.getDate()}`;
    }
  };

  // Filter tasks by selected date (simplified - in real app, filter by dueDate)
  const filteredTaskGroups = data.taskGroups;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e5e5e5] px-10 pb-5 pt-[30px]">
        <div>
          <h1 className="mb-1 text-[28px] font-semibold">{getViewTitle()}</h1>
          <div
            ref={dateSelectorRef}
            className="relative flex cursor-pointer items-center gap-1.5 text-sm text-[#86868b] transition-colors hover:text-[#007aff]"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <span>{formatDate(selectedDate)}</span>
            <span>▼</span>
            {showCalendar && (
              <div ref={calendarRef} className="absolute left-0 top-full z-[1000] mt-2">
                <CalendarPopup
                  selectedDate={selectedDate}
                  onDateSelect={(date) => {
                    setSelectedDate(date);
                    setShowCalendar(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => onOpenMemory?.()}
          className="rounded-lg border-none bg-[#f5f5f7] px-4 py-2 text-sm transition-colors hover:bg-[#ebebed]"
        >
          Memory
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-10 py-[30px]">
        {/* Add Task */}
        <AddTaskForm
          onSubmit={handleAddTask}
          placeholder={data.addTaskPlaceholder}
        />

        {/* Task Groups */}
        {filteredTaskGroups.map((group) => (
          <div key={group.label} className="mb-6">
            {group.tasks.length > 0 && (
              <>
                {group.tasks.map((task) => {
                  const isExpanded = expandedTaskId === task.id;
                  const isHighlighted = data.highlightedTaskId === task.id;
                  const isGenerating = generatingTaskId === task.id;

                  if (task.type === "meeting") {
                    return (
                      <div
                        key={task.id}
                        className={`group mb-0 flex flex-col rounded-lg transition-all cursor-pointer ${
                          isExpanded ? "bg-[#fffbea] expanded" : "hover:bg-[#fafafa]"
                        } ${isHighlighted ? "new-task animate-[fadeIn_0.4s_ease]" : ""}`}
                        style={{ margin: "0 -16px", padding: "16px" }}
                      >
                        <div
                          className="flex w-full items-start gap-3"
                          onClick={(e) => handleTaskExpand(task.id, e)}
                        >
                          <div
                            className={`custom-checkbox mt-0.5 flex-shrink-0 h-[18px] w-[18px] rounded-full border-2 transition-colors cursor-pointer relative ${
                              task.status === "completed"
                                ? "border-[#007aff] bg-[#007aff] checked"
                                : "border-[#d1d1d6] hover:border-[#007aff]"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskToggleStatus?.(task.id);
                            }}
                          >
                            {task.status === "completed" && (
                              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12px] text-white font-bold">
                                ✓
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`mb-1 text-base font-medium ${
                                task.status === "completed"
                                  ? "text-[#86868b] line-through"
                                  : "text-[#1d1d1f]"
                              }`}
                            >
                              {task.title}
                            </h3>
                            <span className="text-sm text-[#86868b]">{task.dueLabel}</span>
                          </div>
                        </div>

                        {/* Task Detail - Expandable */}
                        <div
                          className={`mt-4 rounded-lg bg-[#fffbea] p-4 transition-all overflow-hidden ${
                            isExpanded
                              ? "show max-h-[1000px] opacity-100 animate-[expandDetail_0.3s_ease]"
                              : "max-h-0 opacity-0 hidden"
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Meta Fields */}
                          <div className="mb-4 flex flex-wrap gap-8">
                            {task.meta.map((meta, idx) => (
                              <div key={idx} className="flex-1 min-w-[200px]">
                                <div className="mb-1 text-xs font-medium text-[#86868b]">
                                  {meta.label}
                                </div>
                                <div className="text-sm text-[#1d1d1f]">
                                  {meta.valueType === "priority" ? (
                                    <span
                                      className={`inline-block rounded-md px-3 py-1 text-[13px] font-medium cursor-pointer transition-all hover:opacity-80 hover:scale-105 ${
                                        meta.tone === "danger"
                                          ? "bg-[#ffebee] text-[#d32f2f]"
                                          : meta.value === "Medium"
                                            ? "bg-[#fff3e0] text-[#f57c00]"
                                            : "bg-[#e3f2fd] text-[#1976d2]"
                                      }`}
                                    >
                                      {meta.value}
                                    </span>
                                  ) : meta.valueType === "tag" ? (
                                    <div className="flex flex-wrap gap-2">
                                      {meta.value.split(";").map((tag, tagIdx) => (
                                        <span
                                          key={tagIdx}
                                          className="rounded-md bg-[#e3f2fd] px-2.5 py-1 text-xs text-[#1976d2]"
                                        >
                                          {tag.trim()}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    meta.value
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Subtasks */}
                          <div className="flex-none w-full">
                            <div className="mb-2 text-xs font-medium text-[#86868b]">
                              Sub-tasks
                            </div>
                            <div className="mb-2">
                              {task.subtasks.length > 0 ? (
                                task.subtasks.map((subtask, idx) => (
                                  <div
                                    key={subtask.id}
                                    className={`flex items-center gap-2.5 border-b border-[#e5e5e5] py-2 last:border-b-0 ${
                                      isGenerating && idx === task.subtasks.length - 1
                                        ? "new-subtask animate-[slideInSubtask_0.4s_ease]"
                                        : ""
                                    }`}
                                  >
                                    <div
                                      className={`custom-checkbox h-4 w-4 flex-shrink-0 rounded-full border-2 transition-all cursor-pointer relative ${
                                        subtask.status === "completed"
                                          ? "border-[#007aff] bg-[#007aff] checked animate-[checkboxPop_0.3s_ease]"
                                          : "border-[#d1d1d6] hover:border-[#007aff]"
                                      }`}
                                      onClick={() => onSubTaskToggleStatus?.(task.id, subtask.id)}
                                    >
                                      {subtask.status === "completed" && (
                                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-white font-bold">
                                          ✓
                                        </span>
                                      )}
                                    </div>
                                    <div
                                      className={`text-sm transition-all ${
                                        subtask.status === "completed"
                                          ? "text-[#86868b] line-through completed animate-[fadeToGray_0.3s_ease]"
                                          : "text-[#1d1d1f]"
                                      }`}
                                    >
                                      {subtask.title}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="py-2 text-sm text-[#86868b]">
                                  No subtasks yet
                                </div>
                              )}
                            </div>
                            <button
                              className={`mt-2 inline-flex items-center gap-1.5 rounded-md border-none bg-transparent px-3 py-1.5 text-[13px] font-normal text-[#007aff] transition-all hover:bg-[#f0f0f0] active:bg-[#e5e5e5] ${
                                isGenerating ? "opacity-50 cursor-not-allowed pointer-events-none generating" : ""
                              }`}
                              onClick={(e) => handleGenerateSubtasks(task.id, e)}
                            >
                              <span className="text-sm">
                                {task.subtasks.length > 0 ? "🔄" : "✨"}
                              </span>
                              <span>
                                {task.subtasks.length > 0 ? "Re-generate" : "Generate"} Subtasks
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    // Simple task
                    const getPriorityBadge = (priority?: Priority) => {
                      if (!priority || priority === "none") return null;
                      const priorityClasses = {
                        high: "bg-[#ffebee] text-[#d32f2f]",
                        medium: "bg-[#fff3e0] text-[#f57c00]",
                        low: "bg-[#e3f2fd] text-[#1976d2]",
                      };
                      const priorityLabels = {
                        high: "High",
                        medium: "Medium",
                        low: "Low",
                      };
                      return (
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${priorityClasses[priority]}`}
                        >
                          {priorityLabels[priority]}
                        </span>
                      );
                    };

                    return (
                      <div
                        key={task.id}
                        className={`group mb-0 flex flex-col rounded-lg transition-all cursor-pointer ${
                          isExpanded ? "bg-[#fffbea] expanded" : "hover:bg-[#fafafa]"
                        } ${isHighlighted ? "new-task animate-[fadeIn_0.4s_ease]" : ""}`}
                        style={{ margin: "0 -16px", padding: "16px" }}
                      >
                        <div
                          className="flex w-full items-start gap-3"
                          onClick={(e) => handleTaskExpand(task.id, e)}
                        >
                          <div
                            className={`custom-checkbox mt-0.5 flex-shrink-0 h-[18px] w-[18px] rounded-full border-2 transition-colors cursor-pointer relative ${
                              task.status === "completed"
                                ? "border-[#ffd60a] bg-[#ffd60a] checked"
                                : "border-[#d1d1d6] hover:border-[#007aff]"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskToggleStatus?.(task.id);
                            }}
                          >
                            {task.status === "completed" && (
                              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12px] text-white font-bold">
                                ✓
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`text-base font-medium mb-1 ${
                                task.status === "completed"
                                  ? "text-[#86868b] line-through"
                                  : "text-[#1d1d1f]"
                              }`}
                            >
                              {task.title}
                            </h3>
                            <span className="text-sm text-[#86868b]">{task.dueLabel}</span>
                          </div>
                        </div>

                        {/* Task Detail - Expandable for simple tasks too */}
                        <div
                          className={`mt-4 rounded-lg bg-[#fffbea] p-4 transition-all overflow-hidden ${
                            isExpanded
                              ? "show max-h-[1000px] opacity-100 animate-[expandDetail_0.3s_ease]"
                              : "max-h-0 opacity-0 hidden"
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Meta Fields - Deadline, Priority */}
                          <div className="mb-4 flex flex-wrap gap-8">
                            <div className="flex-1 min-w-[200px]">
                              <div className="mb-1 text-xs font-medium text-[#86868b]">Deadline</div>
                              <div className="text-sm text-[#1d1d1f]">
                                <div className="relative inline-block deadline-editor">
                                  <span
                                    className="deadline-value cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-[#f0f0f0] inline-block"
                                    onClick={(e) => handleOpenDeadlineEditor(task.id, e)}
                                  >
                                    {formatDateForDeadline(task.dueDate)}
                                  </span>
                                  {showDeadlineEditor === task.id && (
                                    <div
                                      ref={(el) => {
                                        deadlineEditorRefs.current[task.id] = el;
                                      }}
                                      className="deadline-popup absolute left-0 top-full z-[1000] mt-2 min-w-[300px] rounded-xl bg-white p-4 shadow-[0_10px_40px_rgba(0,0,0,0.15)] animate-[fadeInScale_0.2s_ease]"
                                    >
                                      <CalendarPopup
                                        selectedDate={tempDeadlineSelection[task.id] || task.dueDate || new Date()}
                                        onDateSelect={(date) => {
                                          setTempDeadlineSelection({ ...tempDeadlineSelection, [task.id]: date });
                                        }}
                                      />
                                      <div className="deadline-popup-footer mt-4 flex justify-end gap-2 border-t border-[#e5e5e5] pt-3">
                                        <button
                                          className="deadline-popup-btn cancel rounded-md border-none bg-transparent px-4 py-1.5 text-[13px] text-[#86868b] transition-colors hover:bg-[#f0f0f0]"
                                          onClick={(e) => handleCloseDeadlineEditor(task.id, e)}
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          className="deadline-popup-btn done rounded-md border-none bg-[#007aff] px-4 py-1.5 text-[13px] text-white transition-colors hover:bg-[#0051d5]"
                                          onClick={(e) => handleSaveDeadline(task.id, e)}
                                        >
                                          Done
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-[200px]">
                              <div className="mb-1 text-xs font-medium text-[#86868b]">Priority</div>
                              <div className="text-sm text-[#1d1d1f]">
                                <div className="relative inline-block priority-editor">
                                  <span
                                    className={`priority-badge inline-block cursor-pointer rounded-md px-3 py-1 text-[13px] font-medium transition-all hover:opacity-80 hover:scale-105 ${
                                      task.priority === "high"
                                        ? "bg-[#ffebee] text-[#d32f2f] priority-high"
                                        : task.priority === "medium"
                                          ? "bg-[#fff3e0] text-[#f57c00] priority-medium"
                                          : task.priority === "low"
                                            ? "bg-[#e3f2fd] text-[#1976d2] priority-low"
                                            : "bg-[#e3f2fd] text-[#1976d2] priority-low"
                                    }`}
                                    onClick={(e) => handleOpenPriorityDropdown(task.id, e)}
                                  >
                                    {task.priority === "high"
                                      ? "High"
                                      : task.priority === "medium"
                                        ? "Medium"
                                        : task.priority === "low"
                                          ? "Low"
                                          : "None"}
                                  </span>
                                  {showPriorityDropdown === task.id && (
                                    <div
                                      ref={(el) => {
                                        priorityDropdownRefs.current[task.id] = el;
                                      }}
                                      className="priority-dropdown show absolute left-0 top-full z-[1000] mt-2 min-w-[120px] rounded-lg bg-white p-1 shadow-[0_4px_16px_rgba(0,0,0,0.15)] animate-[fadeInScale_0.2s_ease]"
                                    >
                                      {(["low", "medium", "high"] as Priority[]).map((priority) => (
                                        <div
                                          key={priority}
                                          className={`priority-option flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-[13px] font-medium transition-colors hover:bg-[#f5f5f7] ${
                                            task.priority === priority ? "selected" : ""
                                          } ${priority}`}
                                          onClick={(e) => handleChangePriority(task.id, priority, e)}
                                        >
                                          <span
                                            className={`priority-indicator h-2 w-2 rounded-full ${
                                              priority === "high"
                                                ? "bg-[#d32f2f]"
                                                : priority === "medium"
                                                  ? "bg-[#f57c00]"
                                                  : "bg-[#1976d2]"
                                            }`}
                                          />
                                          <span
                                            className={
                                              priority === "high"
                                                ? "text-[#d32f2f]"
                                                : priority === "medium"
                                                  ? "text-[#f57c00]"
                                                  : "text-[#1976d2]"
                                            }
                                          >
                                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </>
            )}
          </div>
        ))}

        {/* Completed Section */}
        {data.completedSummary.items.length > 0 && (
          <div className="mt-[30px] pt-5">
            <button
              onClick={onToggleCompletedSummary}
              className="flex w-full items-center gap-2 py-2 text-sm text-[#86868b] transition-colors hover:text-[#1d1d1f] cursor-pointer"
            >
              <span
                className="transition-transform"
                style={{
                  transform: data.completedSummary.isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                ›
              </span>
              <span>{data.completedSummary.items.length} Completed</span>
            </button>
            {data.completedSummary.isExpanded && (
              <div className="mt-2 space-y-2">
                {data.completedSummary.items.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 rounded-lg transition-all hover:bg-[#fafafa]"
                    style={{ margin: "0 -16px", padding: "16px" }}
                  >
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#ffd60a] text-xs text-white">
                      ✓
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-[#86868b] line-through">
                        {task.title}
                      </h3>
                      <span className="text-sm text-[#86868b]">Completed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
