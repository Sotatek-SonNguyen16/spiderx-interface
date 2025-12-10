"use client";

import type { TaskGroup as TaskGroupType, TodayTaskData } from "../types/ui.types";
import SimpleTaskItem from "./SimpleTaskItem";
import MeetingTaskCard from "./MeetingTaskCard";

interface TaskGroupProps {
  group: TaskGroupType;
  highlightedTaskId?: string;
  onTaskToggleStatus?: (id: string) => void;
  onTaskClick?: (id: string) => void;
  onMeetingOpenDrawer?: (id: string) => void;
  onMeetingToggleExpand?: (id: string) => void;
  onSubTaskToggleStatus?: (taskId: string, subTaskId: string) => void;
}

export default function TaskGroup({
  group,
  highlightedTaskId,
  onTaskToggleStatus,
  onTaskClick,
  onMeetingOpenDrawer,
  onMeetingToggleExpand,
  onSubTaskToggleStatus,
}: TaskGroupProps) {
  if (group.tasks.length === 0) return null;

  const renderTask = (task: TodayTaskData) => {
    const isHighlighted = highlightedTaskId === task.id;

    if (task.type === "meeting") {
      // Nếu có inline details thì render card, không thì render như simple task với icon
      if (task.hasInlineDetails) {
        return (
          <div
            key={task.id}
            className={isHighlighted ? "animate-highlight-task" : ""}
          >
            <MeetingTaskCard
              task={task}
              onToggleStatus={onTaskToggleStatus}
              onToggleExpand={onMeetingToggleExpand}
              onSubTaskToggle={onSubTaskToggleStatus}
            />
          </div>
        );
      } else {
        // Progressive disclosure: render như simple task với icon info
        return (
          <div
            key={task.id}
            className={isHighlighted ? "animate-highlight-task" : ""}
          >
            <SimpleTaskItem
              task={{
                id: task.id,
                type: "simple",
                title: task.title,
                status: task.status,
                dueType: task.dueType,
                dueLabel: task.dueLabel,
              }}
              onToggleStatus={onTaskToggleStatus}
              onClick={() => onMeetingOpenDrawer?.(task.id)}
              showInfoIcon
            />
          </div>
        );
      }
    }

    return (
      <div key={task.id} className={isHighlighted ? "animate-highlight-task" : ""}>
        <SimpleTaskItem
          task={task}
          onToggleStatus={onTaskToggleStatus}
          onClick={onTaskClick}
        />
      </div>
    );
  };

  return (
    <div className="mb-6">
      {/* Group Header */}
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-700">{group.label}</h3>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          {group.count}
        </span>
      </div>

      {/* Tasks */}
      <div className="space-y-1">{group.tasks.map(renderTask)}</div>
    </div>
  );
}

