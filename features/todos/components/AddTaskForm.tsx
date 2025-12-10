"use client";

import { useState, useRef, useEffect } from "react";
import type { DueType, Priority } from "../types/ui.types";
import CalendarPopup from "./CalendarPopup";

interface AddTaskFormProps {
  onSubmit: (title: string, dueType: DueType, priority: Priority, dueDate?: Date) => void;
  onCancel?: () => void;
  placeholder?: string;
}

export default function AddTaskForm({
  onSubmit,
  onCancel,
  placeholder = "Add a task...",
}: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [dueType, setDueType] = useState<DueType>("none");
  const [priority, setPriority] = useState<Priority>("none");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const dueDateRef = useRef<HTMLDivElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  const handleSubmit = () => {
    if (!title.trim()) return;

    let finalDueDate: Date | undefined;
    if (selectedDate) {
      finalDueDate = selectedDate;
    } else if (dueType === "today") {
      finalDueDate = new Date();
    } else if (dueType === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      finalDueDate = tomorrow;
    }

    onSubmit(title.trim(), dueType, priority, finalDueDate);
    setTitle("");
    setDueType("none");
    setPriority("none");
    setSelectedDate(null);
  };

  const handleDueTypeSelect = (type: DueType) => {
    setDueType(type);
    if (type === "none") {
      setSelectedDate(null);
    } else if (type === "today") {
      setSelectedDate(new Date());
    } else if (type === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow);
    }
    setShowDueDatePicker(false);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setDueType("none"); // Custom date
    setShowDueDatePicker(false);
  };

  const getDueTypeLabel = () => {
    if (selectedDate && dueType === "none") {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]}`;
    }
    switch (dueType) {
      case "today":
        return "Today";
      case "tomorrow":
        return "Tomorrow";
      case "overdue":
        return "Overdue";
      default:
        return "Due Date";
    }
  };

  const getPriorityLabel = () => {
    switch (priority) {
      case "high":
        return "High";
      case "medium":
        return "Medium";
      case "low":
        return "Low";
      default:
        return "Priority";
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return "text-[#d32f2f]";
      case "medium":
        return "text-[#f57c00]";
      case "low":
        return "text-[#1976d2]";
      default:
        return "text-[#86868b]";
    }
  };

  return (
    <div className="mb-5 border-b border-[#e5e5e5] pb-4">
      <div className="flex items-center gap-3">
        <div className="custom-checkbox h-[18px] w-[18px] flex-shrink-0 rounded-full border-2 border-[#d1d1d6] transition-colors hover:border-[#007aff]" />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          placeholder={placeholder}
          className="flex-1 border-none text-base text-[#1d1d1f] outline-none placeholder:text-[#c7c7cc]"
        />
        {/* Due Date Selector */}
        <div className="relative" ref={dueDateRef}>
          <button
            type="button"
            onClick={() => setShowDueDatePicker(!showDueDatePicker)}
            className={`rounded-lg border border-[#e5e5e5] px-3 py-1.5 text-sm transition-colors hover:bg-[#f5f5f7] ${
              dueType !== "none" || selectedDate ? "text-[#007aff]" : "text-[#86868b]"
            }`}
          >
            {getDueTypeLabel()}
          </button>
          {showDueDatePicker && (
            <div className="absolute right-0 top-full z-50 mt-2 rounded-lg border border-[#e5e5e5] bg-white shadow-lg">
              <div className="p-2">
                <button
                  type="button"
                  onClick={() => handleDueTypeSelect("none")}
                  className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-[#f5f5f7] ${
                    dueType === "none" && !selectedDate ? "bg-[#f5f5f7] text-[#007aff]" : ""
                  }`}
                >
                  No Due Date
                </button>
                <button
                  type="button"
                  onClick={() => handleDueTypeSelect("today")}
                  className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-[#f5f5f7] ${
                    dueType === "today" ? "bg-[#f5f5f7] text-[#007aff]" : ""
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => handleDueTypeSelect("tomorrow")}
                  className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-[#f5f5f7] ${
                    dueType === "tomorrow" ? "bg-[#f5f5f7] text-[#007aff]" : ""
                  }`}
                >
                  Tomorrow
                </button>
                <div className="border-t border-[#e5e5e5] pt-2">
                  <div className="px-2 pb-2">
                    <CalendarPopup
                      selectedDate={selectedDate || new Date()}
                      onDateSelect={handleDateSelect}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Priority Selector */}
        <div className="relative" ref={priorityRef}>
          <button
            type="button"
            onClick={() => setShowPriorityMenu(!showPriorityMenu)}
            className={`rounded-lg border border-[#e5e5e5] px-3 py-1.5 text-sm transition-colors hover:bg-[#f5f5f7] ${getPriorityColor()}`}
          >
            {getPriorityLabel()}
          </button>
          {showPriorityMenu && (
            <div className="absolute right-0 top-full z-50 mt-2 rounded-lg border border-[#e5e5e5] bg-white shadow-lg">
              <div className="p-2">
                <button
                  type="button"
                  onClick={() => {
                    setPriority("none");
                    setShowPriorityMenu(false);
                  }}
                  className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-[#f5f5f7] ${
                    priority === "none" ? "bg-[#f5f5f7] text-[#007aff]" : ""
                  }`}
                >
                  No Priority
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPriority("high");
                    setShowPriorityMenu(false);
                  }}
                  className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-[#f5f5f7] ${
                    priority === "high" ? "bg-[#f5f5f7] text-[#d32f2f]" : ""
                  }`}
                >
                  High
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPriority("medium");
                    setShowPriorityMenu(false);
                  }}
                  className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-[#f5f5f7] ${
                    priority === "medium" ? "bg-[#f5f5f7] text-[#f57c00]" : ""
                  }`}
                >
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPriority("low");
                    setShowPriorityMenu(false);
                  }}
                  className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-[#f5f5f7] ${
                    priority === "low" ? "bg-[#f5f5f7] text-[#1976d2]" : ""
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
  );
}

