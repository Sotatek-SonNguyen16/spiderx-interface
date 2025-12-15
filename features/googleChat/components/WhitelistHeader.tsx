"use client";

import Link from "next/link";
import { Zap, Loader2, X, Sparkles } from "lucide-react";
import Logo from "@/components/ui/logo";
import type { TaskStatus, TaskProgress } from "@/features/googleChat/types";

interface WhitelistHeaderProps {
  isSyncing: boolean;
  isLoading: boolean;
  hasWhitelistedSpaces: boolean;
  whitelistedCount?: number;
  taskStatus: TaskStatus | "IDLE";
  taskProgress: TaskProgress | null;
  onGenerateTodos: () => void;
  onCancelSync: () => void;
}

export const WhitelistHeader = ({
  isSyncing,
  isLoading,
  hasWhitelistedSpaces,
  whitelistedCount = 0,
  taskStatus,
  taskProgress,
  onGenerateTodos,
  onCancelSync,
}: WhitelistHeaderProps) => {
  // CTA State: disabled | ready | processing
  const ctaState = isSyncing
    ? "processing"
    : hasWhitelistedSpaces
    ? "ready"
    : "disabled";

  return (
    <div className="mb-8 shrink-0">
      {/* Top Row: Logo + Title */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <Logo />
            <span className="text-xl font-bold text-gray-900">SpiderX</span>
          </Link>
          <div className="hidden md:block w-px h-12 bg-gray-200 mx-1"></div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-900">
              Google Chat Integration
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sync conversations → actionable todos
            </p>
          </div>
        </div>

        {/* CTA Button with 3 states */}
        <div className="flex items-center gap-3">
          {ctaState === "processing" ? (
            /* Processing State */
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 px-5 py-3 shadow-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-purple-700">
                      {taskStatus === "PROGRESS" &&
                      taskProgress?.percent != null
                        ? `Analyzing... ${taskProgress.percent}%`
                        : taskStatus === "PENDING" || taskStatus === "STARTED"
                        ? "Starting analysis..."
                        : "Analyzing conversations..."}
                    </span>
                    <span className="text-xs text-purple-500">
                      {taskProgress?.progress || "This may take 1-2 minutes"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onCancelSync}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-200 bg-white text-red-500 transition-all hover:bg-red-50 hover:border-red-300 hover:shadow-sm"
                title="Cancel sync"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : ctaState === "ready" ? (
            /* Ready State */
            <button
              onClick={onGenerateTodos}
              disabled={isLoading}
              className="group relative flex flex-col items-center gap-0.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 font-medium text-white transition-all hover:from-brand-700 hover:to-brand-800 hover:shadow-lg hover:shadow-brand-200/50 disabled:opacity-50 shadow-md"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-base font-semibold">Generate Todos</span>
              </div>
              <span className="text-xs text-brand-200 font-normal">
                From {whitelistedCount} enabled{" "}
                {whitelistedCount === 1 ? "space" : "spaces"}
              </span>
            </button>
          ) : (
            /* Disabled State */
            <div className="relative group">
              <button
                disabled
                className="flex flex-col items-center gap-0.5 rounded-xl bg-gray-100 px-6 py-3 font-medium text-gray-400 cursor-not-allowed border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  <span className="text-base font-semibold">
                    Generate Todos
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-normal">
                  No spaces enabled
                </span>
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                Enable at least 1 space to generate todos
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
