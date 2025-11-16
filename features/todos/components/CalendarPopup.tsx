"use client";

import { useState } from "react";

interface CalendarPopupProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function CalendarPopup({ selectedDate, onDateSelect }: CalendarPopupProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = new Date();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onDateSelect(newDate);
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const prevMonthDays = getDaysInMonth(
    currentMonth === 0 ? currentYear - 1 : currentYear,
    currentMonth === 0 ? 11 : currentMonth - 1
  );

  const days = [];

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push(
      <div key={`prev-${i}`} className="aspect-square flex items-center justify-center rounded-lg text-sm text-[#c7c7cc]">
        {prevMonthDays - i}
      </div>
    );
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday =
      i === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();
    const isSelected =
      i === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear();

    const classes = [
      "aspect-square flex items-center justify-center rounded-lg text-sm cursor-pointer transition-all",
    ];

    if (isToday) {
      classes.push("bg-[#007aff] text-white font-semibold");
    } else if (isSelected) {
      classes.push("bg-[#007aff] text-white");
    } else {
      classes.push("hover:bg-[#f5f5f7]");
    }

    days.push(
      <div
        key={i}
        className={classes.join(" ")}
        onClick={() => handleDateClick(i)}
      >
        {i}
      </div>
    );
  }

  // Next month days
  const totalCells = firstDay + daysInMonth;
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remainingCells; i++) {
    days.push(
      <div key={`next-${i}`} className="aspect-square flex items-center justify-center rounded-lg text-sm text-[#c7c7cc]">
        {i}
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-[0_10px_40px_rgba(0,0,0,0.15)] animate-[fadeInScale_0.2s_ease]">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-base font-semibold">
          {monthNames[currentMonth]} {currentYear}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="flex h-7 w-7 items-center justify-center rounded-md border-none bg-[#f5f5f7] text-base transition-colors hover:bg-[#e5e5e7]"
          >
            ‹
          </button>
          <button
            onClick={handleNextMonth}
            className="flex h-7 w-7 items-center justify-center rounded-md border-none bg-[#f5f5f7] text-base transition-colors hover:bg-[#e5e5e7]"
          >
            ›
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-medium text-[#86868b]">
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
}

