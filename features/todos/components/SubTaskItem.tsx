"use client";

import { Check } from "lucide-react";
import type { SubTaskData } from "../types/ui.types";

interface SubTaskItemProps {
  subtask: SubTaskData;
  onToggle?: (id: string) => void;
}

export default function SubTaskItem({ subtask, onToggle }: SubTaskItemProps) {
  const isCompleted = subtask.status === "completed";

  return (
    <div className="flex items-center gap-2 py-1.5 pl-8">
      <button
        onClick={() => onToggle?.(subtask.id)}
        className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition ${
          isCompleted
            ? "border-yellow-400 bg-yellow-400"
            : "border-gray-300 bg-white hover:border-gray-400"
        }`}
        aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
      >
        {isCompleted && <Check className="h-2.5 w-2.5 text-gray-900" />}
      </button>
      <span
        className={`text-sm ${
          isCompleted ? "text-gray-500 line-through" : "text-gray-700"
        }`}
      >
        {subtask.title}
      </span>
    </div>
  );
}

