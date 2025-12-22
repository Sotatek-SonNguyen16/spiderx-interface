"use client";

import { CheckCircle, ArrowLeft } from "lucide-react";

/**
 * EmptyQueueState Component
 * Displays when queue is empty
 * 
 * Requirements: 8.1, 8.2, 8.3
 */

interface EmptyQueueStateProps {
  onBackToTodo: () => void;
}

export const EmptyQueueState = ({ onBackToTodo }: EmptyQueueStateProps) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        {/* Main message */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          🎉 You're all caught up
        </h3>

        {/* Subtext */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          No tasks waiting for review
        </p>

        {/* CTA Button */}
        <button
          onClick={onBackToTodo}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Todo</span>
        </button>
      </div>
    </div>
  );
};