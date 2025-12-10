"use client";

import { useState, useCallback, useEffect } from "react";
import { X, Calendar } from "lucide-react";

interface TimeRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
  defaultStartDate?: Date;
  defaultEndDate?: Date;
}

/**
 * TimeRangePicker - Modal component for selecting date range
 * Used for custom time range selection when syncing todos
 */
export const TimeRangePicker = ({
  isOpen,
  onClose,
  onConfirm,
  defaultStartDate,
  defaultEndDate,
}: TimeRangePickerProps) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Initialize dates when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const defaultStart = defaultStartDate || new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const defaultEnd = defaultEndDate || now;
      
      setStartDate(formatDateForInput(defaultStart));
      setEndDate(formatDateForInput(defaultEnd));
      setError(null);
    }
  }, [isOpen, defaultStartDate, defaultEndDate]);

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  };

  const handleConfirm = useCallback(() => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      setError("End date must be after start date");
      return;
    }

    if (end > new Date()) {
      setError("End date cannot be in the future");
      return;
    }

    setError(null);
    onConfirm(start, end);
    onClose();
  }, [startDate, endDate, onConfirm, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Select Time Range
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Date Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-colors"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 
                     text-gray-700 dark:text-gray-300 rounded-lg
                     hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg
                     hover:bg-blue-600 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeRangePicker;
