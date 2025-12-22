"use client";

import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

/**
 * CompletionSummary Component
 * Displays summary after all tasks are reviewed
 * 
 * Requirements: 8.4
 */

interface CompletionSummaryProps {
  acceptedCount: number;
  skippedCount: number;
  onReviewAgain: () => void;
  onBackToTodo: () => void;
}

export const CompletionSummary = ({
  acceptedCount,
  skippedCount,
  onReviewAgain,
  onBackToTodo,
}: CompletionSummaryProps) => {
  const totalReviewed = acceptedCount + skippedCount;

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8">
      <div className="text-center max-w-lg">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>

        {/* Main message */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          All done! 🎉
        </h3>

        {/* Review count */}
        <p className="text-gray-600 mb-8">
          You've reviewed {totalReviewed} task{totalReviewed !== 1 ? 's' : ''}
        </p>

        {/* Statistics */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2 mx-auto">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {acceptedCount}
            </div>
            <div className="text-sm text-gray-500">Accepted</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-2 mx-auto">
              <XCircle className="w-6 h-6 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-600 mb-1">
              {skippedCount}
            </div>
            <div className="text-sm text-gray-500">Skipped</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onReviewAgain}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Review Again</span>
          </button>

          <button
            onClick={onBackToTodo}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <span>Back to Todo</span>
          </button>
        </div>
      </div>
    </div>
  );
};