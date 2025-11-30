import React from "react";

interface CalendarDay {
  date: Date;
  dayName: string; // Mon, Tue, etc.
  dayNumber: string; // 01, 02, etc.
  isActive: boolean;
}

interface CalendarStripProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function CalendarStrip({
  selectedDate,
  onDateSelect,
}: CalendarStripProps) {
  // Generate 7 days centered around selectedDate or just next 7 days?
  // Design shows a week view. Let's generate a static week for now or dynamic based on current date.
  // For this implementation, let's generate 3 days before and 3 days after the selected date, or just the current week.
  // Let's stick to a simple 7-day window starting from "today" or centered.
  
  const generateDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - 3); // Start 3 days ago to center selected

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      
      days.push({
        date: d,
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: d.getDate().toString(),
        isActive: d.toDateString() === selectedDate.toDateString(),
      });
    }
    return days;
  };

  const days = generateDays();

  return (
    <div className="flex justify-between gap-2 overflow-x-auto pb-4 no-scrollbar">
      {days.map((day, index) => (
        <button
          key={index}
          onClick={() => onDateSelect(day.date)}
          className={`flex h-20 w-full min-w-[64px] flex-col items-center justify-center rounded-xl border transition-all ${
            day.isActive
              ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
              : "border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100"
          }`}
        >
          <span className="text-lg font-semibold">{day.dayNumber}</span>
          <span className="text-xs">{day.dayName}</span>
        </button>
      ))}
    </div>
  );
}
