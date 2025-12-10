"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import type { ConnectedThread } from "../types/thread";

interface ThreadFilterDropdownProps {
  threads: ConnectedThread[];
  selectedThreadIds: string[];
  onThreadToggle: (threadId: string) => void;
  onClearSelection: () => void;
  todoCounts: Record<string, number>;
  totalCount: number;
  loading?: boolean;
}

export function ThreadFilterDropdown({
  threads,
  selectedThreadIds,
  onThreadToggle,
  onClearSelection,
  todoCounts,
  totalCount,
  loading = false,
}: ThreadFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCount = selectedThreadIds.length;
  const hasSelection = selectedCount > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
          isOpen
            ? "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300"
            : "bg-white/80 text-gray-700 shadow-sm backdrop-blur-sm hover:bg-white hover:shadow-md"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <span>
              {hasSelection
                ? `${selectedCount} Space${selectedCount > 1 ? "s" : ""} đã chọn`
                : "Lọc theo Space"}
            </span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl bg-white shadow-lg ring-1 ring-black/5">
          <div className="max-h-64 overflow-y-auto p-2">
            {loading ? (
              <div className="px-3 py-4 text-center">
                <Loader2 className="h-5 w-5 animate-spin mx-auto text-indigo-500" />
                <p className="text-sm text-gray-500 mt-2">Đang tải...</p>
              </div>
            ) : threads.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-gray-500">
                <p>Chưa có space nào được kết nối.</p>
                <p className="text-xs mt-1 text-gray-400">Vui lòng kết nối Google Chat và chọn spaces để whitelist.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {threads.map((thread) => {
                  const isSelected = selectedThreadIds.includes(thread.id);
                  const count = todoCounts[thread.id] || 0;
                  const displayName = thread.displayName || thread.name;

                  return (
                    <label
                      key={thread.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onThreadToggle(thread.id)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="flex-1 truncate text-sm font-medium text-gray-700">
                        {displayName}
                      </span>
                      {count > 0 && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                          {count}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with Clear button */}
          {hasSelection && (
            <div className="border-t border-gray-100 p-2">
              <button
                onClick={() => {
                  onClearSelection();
                  setIsOpen(false);
                }}
                className="w-full rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
              >
                Bỏ chọn tất cả
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ThreadFilterDropdown;
