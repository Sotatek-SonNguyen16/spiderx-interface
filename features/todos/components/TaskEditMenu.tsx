"use client";

import { useState, useRef, useEffect } from "react";
import type { TodayTaskData, DueType, Priority } from "../types/ui.types";
import CalendarPopup from "./CalendarPopup";

interface TaskEditMenuProps {
  task: TodayTaskData;
  onUpdate: (updates: { dueType?: DueType; priority?: Priority; dueDate?: Date }) => void;
}

export default function TaskEditMenu({ task, onUpdate }: TaskEditMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dueDateRef = useRef<HTMLDivElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (dueDateRef.current && !dueDateRef.current.contains(event.target as Node)) {
        setShowDueDatePicker(false);
      }
      if (priorityRef.current && !priorityRef.current.contains(event.target as Node)) {
        setShowPriorityMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDueTypeSelect = (type: DueType) => {
    let dueDate: Date | undefined;
    if (type === "today") {
      dueDate = new Date();
    } else if (type === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dueDate = tomorrow;
    }
    onUpdate({ dueType: type, dueDate });
    setShowDueDatePicker(false);
    setShowMenu(false);
  };

  const handleDateSelect = (date: Date) => {
    onUpdate({ dueType: "none", dueDate: date });
    setShowDueDatePicker(false);
    setShowMenu(false);
  };

  const handlePrioritySelect = (priority: Priority) => {
    onUpdate({ priority });
    setShowPriorityMenu(false);
    setShowMenu(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="opacity-0 group-hover:opacity-100 text-[#86868b] hover:text-[#1d1d1f] text-xs transition-opacity"
      >
        ⋯
      </button>
      {showMenu && (
        <div className="absolute right-0 top-full z-50 mt-1 rounded-lg border border-[#e5e5e5] bg-white shadow-lg min-w-[160px]">
          <div className="p-1">
            {/* Due Date */}
            <div className="relative" ref={dueDateRef}>
              <button
                type="button"
                onClick={() => {
                  setShowDueDatePicker(!showDueDatePicker);
                  setShowPriorityMenu(false);
                }}
                className="block w-full rounded px-3 py-2 text-left text-sm text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7]"
              >
                Due Date
              </button>
              {showDueDatePicker && (
                <div className="absolute left-full top-0 ml-1 rounded-lg border border-[#e5e5e5] bg-white shadow-lg">
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => handleDueTypeSelect("none")}
                      className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-[#f5f5f7] ${
                        task.dueType === "none" && !task.dueDate ? "bg-[#f5f5f7] text-[#007aff]" : ""
                      }`}
                    >
                      No Due Date
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDueTypeSelect("today")}
                      className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-[#f5f5f7] ${
                        task.dueType === "today" ? "bg-[#f5f5f7] text-[#007aff]" : ""
                      }`}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDueTypeSelect("tomorrow")}
                      className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-[#f5f5f7] ${
                        task.dueType === "tomorrow" ? "bg-[#f5f5f7] text-[#007aff]" : ""
                      }`}
                    >
                      Tomorrow
                    </button>
                    <div className="border-t border-[#e5e5e5] pt-2 mt-2">
                      <div className="px-2">
                        <CalendarPopup
                          selectedDate={task.dueDate || new Date()}
                          onDateSelect={handleDateSelect}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Priority */}
            <div className="relative" ref={priorityRef}>
              <button
                type="button"
                onClick={() => {
                  setShowPriorityMenu(!showPriorityMenu);
                  setShowDueDatePicker(false);
                }}
                className="block w-full rounded px-3 py-2 text-left text-sm text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7]"
              >
                Priority
              </button>
              {showPriorityMenu && (
                <div className="absolute left-full top-0 ml-1 rounded-lg border border-[#e5e5e5] bg-white shadow-lg">
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => handlePrioritySelect("none")}
                      className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-[#f5f5f7] ${
                        !task.priority || task.priority === "none" ? "bg-[#f5f5f7] text-[#007aff]" : ""
                      }`}
                    >
                      No Priority
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePrioritySelect("high")}
                      className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-[#f5f5f7] ${
                        task.priority === "high" ? "bg-[#f5f5f7] text-[#d32f2f]" : ""
                      }`}
                    >
                      High
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePrioritySelect("medium")}
                      className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-[#f5f5f7] ${
                        task.priority === "medium" ? "bg-[#f5f5f7] text-[#f57c00]" : ""
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePrioritySelect("low")}
                      className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-[#f5f5f7] ${
                        task.priority === "low" ? "bg-[#f5f5f7] text-[#1976d2]" : ""
                      }`}
                    >
                      Low
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

