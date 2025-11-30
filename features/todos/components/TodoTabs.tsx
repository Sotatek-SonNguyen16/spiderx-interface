import React from "react";

export type TodoTabType = "todo" | "queue" | "trash" | "completed";

interface TodoTabsProps {
  activeTab: TodoTabType;
  onTabChange: (tab: TodoTabType) => void;
  counts: {
    todo: number;
    queue: number;
    trash: number;
    completed: number;
  };
}

export default function TodoTabs({ activeTab, onTabChange, counts }: TodoTabsProps) {
  const tabs: { id: TodoTabType; label: string; count?: number }[] = [
    { id: "todo", label: "Todo", count: counts.todo },
    { id: "queue", label: "Queue", count: counts.queue },
    { id: "trash", label: "Trash" }, // Assuming no count needed or 0
    { id: "completed", label: "Completed" },
  ];

  return (
    <div className="flex gap-6 border-b border-gray-100 pb-1 text-sm font-medium text-gray-500">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative flex items-center gap-2 pb-3 transition-colors ${
            activeTab === tab.id
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {tab.label}
          {tab.count !== undefined && tab.count > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FF4B4B] px-1.5 text-[10px] font-bold text-white">
              {tab.count > 99 ? "99+" : tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
