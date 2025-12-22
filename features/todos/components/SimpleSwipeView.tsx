"use client";

import { useState } from "react";
import { Check, X, ArrowLeft } from "lucide-react";
import type { Todo } from "../types";

/**
 * SimpleSwipeView - Simplified version for debugging
 */

interface SimpleSwipeViewProps {
  todos: Todo[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onComplete?: () => void;
  onBackToTodo?: () => void;
}

export const SimpleSwipeView = ({
  todos,
  onAccept,
  onReject,
  onComplete,
  onBackToTodo,
}: SimpleSwipeViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentTodo = todos[currentIndex];
  const hasMoreTodos = currentIndex < todos.length;

  const handleAccept = () => {
    if (currentTodo) {
      onAccept(currentTodo.id);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleReject = () => {
    if (currentTodo) {
      onReject(currentTodo.id);
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Empty state
  if (todos.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            🎉 You're all caught up
          </h3>
          <p className="text-gray-600 mb-4">No tasks waiting for review</p>
          <button
            onClick={onBackToTodo}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Todo
          </button>
        </div>
      </div>
    );
  }

  // Completion state
  if (!hasMoreTodos) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            All done! 🎉
          </h3>
          <p className="text-gray-600 mb-4">
            You've reviewed {todos.length} tasks
          </p>
          <button
            onClick={onBackToTodo}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Todo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex-none p-4 bg-white border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Review Queue</h2>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              {currentIndex + 1} of {todos.length}
            </span>
          </div>
          <button
            onClick={onBackToTodo}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg border p-6">
            {/* AI Badge */}
            {currentTodo.isAiGenerated && (
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                  ✨ AI detected task
                </span>
                <span className="text-xs text-gray-500">
                  From {currentTodo.sourceType === 'chat' ? 'Google Chat' : currentTodo.sourceType}
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentTodo.title}
            </h3>

            {/* Meta info */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              {currentTodo.assigneeName && (
                <span>👤 {currentTodo.assigneeName}</span>
              )}
              {currentTodo.priority && (
                <span>⚡ {currentTodo.priority}</span>
              )}
            </div>

            {/* Description */}
            {currentTodo.description && (
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    "{currentTodo.description}"
                  </p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
                <span>Skip</span>
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Check className="w-5 h-5" />
                <span>Accept</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hint */}
      <div className="flex-none p-4 text-center">
        <p className="text-sm text-gray-500">
          Use buttons to accept or skip tasks
        </p>
      </div>
    </div>
  );
};