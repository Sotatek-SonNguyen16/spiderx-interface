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
    // Center the selected date (3 days before, 3 days after)
    start.setDate(start.getDate() - 3);

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

  // Get current month from the first day in the strip
  const currentMonth = days[0].date.toLocaleDateString("en-US", { month: "long" });

  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-gray-500 pl-1">
        {currentMonth}
      </div>
      <div className="flex justify-between gap-3 overflow-x-auto pb-2 no-scrollbar">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => onDateSelect(day.date)}
            className={`flex h-24 w-full min-w-[72px] flex-col items-center justify-center gap-1 rounded-2xl border transition-all duration-200 ${
              day.isActive
                ? "border-orange-300 bg-orange-50 shadow-sm"
                : "border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            <span className={`text-2xl font-bold ${day.isActive ? "text-orange-600" : "text-gray-900"}`}>
              {day.dayNumber}
            </span>
            <span className={`text-sm font-medium ${day.isActive ? "text-gray-600" : "text-gray-500"}`}>
              {day.dayName}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
