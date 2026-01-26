"use client";

import { cn } from "@/lib/cn";
import { recipes } from "./recipes";
import { X, ChevronRight } from "lucide-react";
import { Button } from "./button";

export interface ProgressChipProps {
  title: string;
  meta?: string;
  onView: () => void;
  onDismiss: () => void;
}

export function ProgressChip({
  title,
  meta,
  onView,
  onDismiss,
}: ProgressChipProps) {
  return (
    <div className={recipes.chip.container}>
      <div className="min-w-0">
        <div className={recipes.chip.title}>{title}</div>
        {meta && <div className={recipes.chip.meta}>{meta}</div>}
      </div>
      <Button variant="ghost" onClick={onView} className="px-3 py-2">
        View <ChevronRight className="h-4 w-4" />
      </Button>
      <button
        onClick={onDismiss}
        className={cn(recipes.chip.iconBtn, recipes.focusRing)}
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
