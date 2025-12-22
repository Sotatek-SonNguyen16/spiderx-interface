"use client";

import { useState, useCallback, useEffect } from "react";
import { X, Calendar, Clock, AlertTriangle } from "lucide-react";

interface TimeRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
  defaultStartDate?: Date;
  defaultEndDate?: Date;
}

/**
 * TimeRangePicker - Enhanced modal component for selecting date range
 * Features: Presets, clear date formatting, warning messages, better UX
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

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Preset functions
  const setPreset = (hours: number) => {
    const now = new Date();
    const start = new Date(now.getTime() - hours * 60 * 60 * 1000);
    
    setStartDate(formatDateForInput(start));
    setEndDate(formatDateForInput(now));
    setError(null);
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

    // Calculate potential message volume warning
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (diffHours > 168) { // More than 7 days
      setError("Time range too large. Please select a period of 7 days or less for better performance.");
      return;
    }

    setError(null);
    onConfirm(start, end);
    onClose();
  }, [startDate, endDate, onConfirm, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - Light Theme */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand" />
            <h2 className="text-lg font-semibold text-gray-900">
              Sync messages by time range
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Warning message - Light Theme */}
        <div className="mb-6 p-3 bg-accent-50 border border-accent-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-accent-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-accent-700">
              This may create new tasks from past messages.
            </p>
          </div>
        </div>

        {/* Quick Presets - Light Theme */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Quick select:
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setPreset(24)}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700
                       hover:bg-gray-200 rounded-lg transition-colors"
            >
              Last 24 hours
            </button>
            <button
              onClick={() => setPreset(168)}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700
                       hover:bg-gray-200 rounded-lg transition-colors"
            >
              Last 7 days
            </button>
            <button
              onClick={() => setPreset(720)}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700
                       hover:bg-gray-200 rounded-lg transition-colors"
            >
              Last 30 days
            </button>
          </div>
        </div>

        {/* Date Inputs - Light Theme */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                       bg-white text-gray-900
                       focus:ring-2 focus:ring-brand/40 focus:border-transparent
                       transition-colors"
            />
            {startDate && (
              <p className="text-xs text-gray-500 mt-1">
                {formatDateForDisplay(startDate)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                       bg-white text-gray-900
                       focus:ring-2 focus:ring-brand/40 focus:border-transparent
                       transition-colors"
            />
            {endDate && (
              <p className="text-xs text-gray-500 mt-1">
                {formatDateForDisplay(endDate)}
              </p>
            )}
          </div>

          {/* Error Message - Light Theme */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Actions - Light Theme */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 
                     text-gray-700 rounded-lg
                     hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-brand text-white rounded-lg
                     hover:bg-brand-700 transition-colors font-medium"
          >
            Start Sync
          </button>
        </div>
        
        {/* Help text */}
        <p className="text-xs text-gray-500 text-center mt-3">
          You can stop syncing at any time
        </p>
      </div>
    </div>
  );
};

export default TimeRangePicker;
