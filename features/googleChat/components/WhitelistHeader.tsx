"use client";

import Link from "next/link";
import { Zap, Loader2, X } from "lucide-react";
import Logo from "@/components/ui/logo";
import type { TaskStatus, TaskProgress } from "@/features/googleChat/types";

interface WhitelistHeaderProps {
  isSyncing: boolean;
  isLoading: boolean;
  hasWhitelistedSpaces: boolean;
  taskStatus: TaskStatus | "IDLE";
  taskProgress: TaskProgress | null;
  onGenerateTodos: () => void;
  onCancelSync: () => void;
}

export const WhitelistHeader = ({
  isSyncing,
  isLoading,
  hasWhitelistedSpaces,
  taskStatus,
  taskProgress,
  onGenerateTodos,
  onCancelSync,
}: WhitelistHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Logo />
          <span className="text-xl font-bold text-gray-900">SpiderX</span>
        </Link>
        <div className="hidden md:block w-px h-8 bg-gray-200 mx-2"></div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Google Chat Integration</h1>
          <p className="text-sm text-gray-500 max-w-xl">
            Sync conversations and convert them into actionable todos.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isSyncing ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
              <span className="text-sm font-medium text-purple-700">
                {taskStatus === "PROGRESS" && taskProgress?.percent != null
                  ? `${taskProgress.percent}%`
                  : taskStatus === "PENDING" || taskStatus === "STARTED"
                    ? "Starting..."
                    : "Syncing..."}
              </span>
              {taskProgress?.progress && (
                <span className="text-xs text-purple-500">{taskProgress.progress}</span>
              )}
            </div>
            <button
              onClick={onCancelSync}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 transition-colors hover:bg-red-50"
              title="Cancel sync"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onGenerateTodos}
            disabled={isLoading || !hasWhitelistedSpaces}
            className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50 shadow-sm shadow-brand-200 hover:shadow-md hover:shadow-brand-300"
          >
            <Zap className="h-4 w-4" />
            Generate Todos
          </button>
        )}
      </div>
    </div>
  );
};
