"use client";

import TodoTabs, { TodoTabType } from "./TodoTabs";
import { ThreadFilterDropdown } from "./ThreadFilterDropdown";
import { SyncTodoButton } from "./SyncTodoButton";
import type { ConnectedThread } from "../types/thread";

interface TodoFilterBarProps {
  activeTab: TodoTabType;
  onTabChange: (tab: TodoTabType) => void;
  counts: Record<TodoTabType, number>;
  threads: ConnectedThread[];
  selectedThreadIds: string[];
  onThreadToggle: (threadId: string) => void;
  onClearSelection: () => void;
  todoCounts: Record<string, number>;
  totalTodoCount: number;
  spacesLoading: boolean;
  onSyncComplete: () => void;
}

export const TodoFilterBar = ({
  activeTab,
  onTabChange,
  counts,
  threads,
  selectedThreadIds,
  onThreadToggle,
  onClearSelection,
  todoCounts,
  totalTodoCount,
  spacesLoading,
  onSyncComplete,
}: TodoFilterBarProps) => {
  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <TodoTabs activeTab={activeTab} onTabChange={onTabChange} counts={counts} />
      <div className="flex items-center gap-2 flex-shrink-0">
        <ThreadFilterDropdown
          threads={threads}
          selectedThreadIds={selectedThreadIds}
          onThreadToggle={onThreadToggle}
          onClearSelection={onClearSelection}
          todoCounts={todoCounts}
          totalCount={totalTodoCount}
          loading={spacesLoading}
        />
        <SyncTodoButton onSyncComplete={onSyncComplete} />
      </div>
    </div>
  );
};
