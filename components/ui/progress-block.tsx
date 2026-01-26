"use client";

import { recipes } from "./recipes";

export interface ProgressBlockProps {
  percent: number; // 0-100
  stepText: string;
  meta?: string;
  mode?: "sync" | "ai";
}

export function ProgressBlock({
  percent,
  stepText,
  meta,
  mode = "sync",
}: ProgressBlockProps) {
  const fillClass =
    mode === "ai" ? recipes.progress.fillAI : recipes.progress.fillPrimary;
  const clampedPercent = Math.max(0, Math.min(100, percent));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className={recipes.progress.step}>{stepText}</div>
        <div className={recipes.progress.meta}>{clampedPercent}%</div>
      </div>
      <div className={recipes.progress.track}>
        <div
          className={fillClass}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
      {meta && <div className={recipes.progress.meta}>{meta}</div>}
    </div>
  );
}
