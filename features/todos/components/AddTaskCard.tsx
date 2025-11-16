"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { DueType } from "../types/ui.types";

interface AddTaskCardProps {
  placeholder: string;
  onSubmit: (title: string, dueType?: DueType) => void;
  onCancel?: () => void;
}

export default function AddTaskCard({
  placeholder,
  onSubmit,
  onCancel,
}: AddTaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [dueType, setDueType] = useState<DueType | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim(), dueType);
      setTitle("");
      setDueType(undefined);
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDueType(undefined);
    setIsExpanded(false);
    onCancel?.();
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={handleFocus}
        className="w-full rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 text-left text-sm text-gray-500 transition hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>{placeholder}</span>
        </div>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm"
    >
      <textarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onFocus={handleFocus}
        placeholder="Task title..."
        rows={2}
        className="w-full resize-none rounded-lg border-0 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0"
        autoFocus
      />

      <div className="mt-3 flex items-center justify-between gap-2">
        {/* Due Date Quick Select */}
        <div className="flex gap-1">
          {(["today", "tomorrow"] as DueType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setDueType(dueType === type ? undefined : type)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                dueType === type
                  ? "bg-brand-100 text-brand-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type === "today" ? "Today" : "Tomorrow"}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            Add
          </button>
        </div>
      </div>
    </form>
  );
}

