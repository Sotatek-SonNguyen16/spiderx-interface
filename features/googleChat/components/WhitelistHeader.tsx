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
            <span className="text-xl font-bold text-ink">SpiderX</span>
          </Link>
          <div className="hidden md:block w-px h-12 bg-border mx-1"></div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-ink">
              Google Chat Integration
            </h1>
            <p className="text-sm text-ink2 mt-1">
              Sync conversations → actionable todos
            </p>
          </div>
        </div>

        {/* CTA Button with 3 states */}
        <div className="flex items-center gap-3">
          {ctaState === "processing" ? (
            /* Processing State - Simplified */
            <button
              disabled
              className="flex h-12 items-center gap-2 rounded-xl border border-aiSoft bg-surface px-6 py-3 font-semibold text-ink shadow-sm opacity-80"
            >
              <Loader2 className="h-5 w-5 animate-spin text-ai" />
              <span>Syncing...</span>
              <span className="ml-2 h-12 w-px bg-border/50" />
              <button
                onClick={onCancelSync}
                className="ml-1 p-1 rounded-md hover:bg-surface2 text-red-500 transition-colors pointer-events-auto"
                title="Cancel sync"
              >
                <X className="h-4 w-4" />
              </button>
            </button>
          ) : ctaState === "ready" ? (
            /* Ready State */
            <button
              onClick={onGenerateTodos}
              disabled={isLoading}
              className="group relative flex flex-col items-center gap-0.5 rounded-xl bg-gradient-to-r from-primary to-primaryPressed px-6 py-3 font-medium text-white transition-all hover:from-primaryHover hover:to-primaryPressed hover:shadow-lg hover:shadow-brand-200/50 disabled:opacity-50 shadow-md cursor-pointer"
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
                className="flex flex-col items-center gap-0.5 rounded-xl bg-surface2 px-6 py-3 font-medium text-ink3 cursor-not-allowed border border-border"
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
