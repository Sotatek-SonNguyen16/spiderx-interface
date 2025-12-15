import React from "react";
import { ListTodo, Layers, Trash2, CheckCircle2 } from "lucide-react";

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

export default function TodoTabs({
  activeTab,
  onTabChange,
  counts,
}: TodoTabsProps) {
  const tabs: {
    id: TodoTabType;
    label: string;
    icon: React.ElementType;
    colorClass: string;
    activeBg: string;
    activeText: string;
    count?: number;
  }[] = [
    {
      id: "todo",
      label: "Todo",
      icon: ListTodo,
      colorClass: "text-blue-600",
      activeBg: "bg-blue-100",
      activeText: "text-blue-700",
      count: counts.todo,
    },
    {
      id: "queue",
      label: "Queue",
      icon: Layers,
      colorClass: "text-orange-600",
      activeBg: "bg-orange-100",
      activeText: "text-orange-800",
      count: counts.queue,
    },
    {
      id: "trash",
      label: "Trash",
      icon: Trash2,
      colorClass: "text-red-600",
      activeBg: "bg-red-100",
      activeText: "text-red-700",
      count: counts.trash,
    },
    {
      id: "completed",
      label: "Done",
      icon: CheckCircle2,
      colorClass: "text-green-600",
      activeBg: "bg-green-100",
      activeText: "text-green-700",
      count: counts.completed,
    },
  ];

  return (
    <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex bg-gray-50/50 p-1 rounded-xl border border-gray-100 w-full sm:w-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-out ${
                isActive
                  ? `${tab.activeBg} ${tab.activeText} shadow-sm ring-1 ring-inset ring-black/5`
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  isActive ? "currentColor" : "text-gray-400"
                }`}
              />
              <span className="hidden sm:inline-block">{tab.label}</span>

              {/* Mobile label fallback/short */}
              <span className="sm:hidden">
                {tab.id === "completed" ? "Done" : tab.label}
              </span>

              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`ml-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                    isActive
                      ? "bg-white/60 text-current backdrop-blur-sm"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.count > 99 ? "99+" : tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
