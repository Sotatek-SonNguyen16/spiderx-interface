"use client";

import { ThreadFilterDropdown } from "./ThreadFilterDropdown";
import { SyncTodoButton } from "./SyncTodoButton";
import type { ConnectedThread } from "../types/thread";

interface TodoFilterBarProps {
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
    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Filter */}
      <div className="flex-1 min-w-0">
        <ThreadFilterDropdown
          threads={threads}
          selectedThreadIds={selectedThreadIds}
          onThreadToggle={onThreadToggle}
          onClearSelection={onClearSelection}
          todoCounts={todoCounts}
          totalCount={totalTodoCount}
          loading={spacesLoading}
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Placeholder for future actions or help text if needed */}
        {/* <div className="hidden sm:block text-xs text-gray-400">
          Last sync: Just now
        </div> */}
        <SyncTodoButton onSyncComplete={onSyncComplete} />
      </div>
    </div>
  );
};
