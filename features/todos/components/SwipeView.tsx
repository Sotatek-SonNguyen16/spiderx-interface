"use client";

import { useState, useEffect } from "react";
import { SwipeCard } from "./SwipeCard";
import { RotateCcw, CheckCircle, XCircle } from "lucide-react";
import type { Todo } from "../types";

interface SwipeViewProps {
  todos: Todo[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onComplete?: () => void;
}

export const SwipeView = ({ todos, onAccept, onReject, onComplete }: SwipeViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedTodos, setSwipedTodos] = useState<Array<{ todo: Todo; action: 'accept' | 'reject' }>>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentTodo = todos[currentIndex];
  const nextTodo = todos[currentIndex + 1];
  const hasMoreTodos = currentIndex < todos.length;

  // Handle accept action
  const handleAccept = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    setIsAnimating(true);
    setSwipedTodos(prev => [...prev, { todo, action: 'accept' }]);
    
    setTimeout(() => {
      onAccept(id);
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  // Handle reject action
  const handleReject = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    setIsAnimating(true);
    setSwipedTodos(prev => [...prev, { todo, action: 'reject' }]);
    
    setTimeout(() => {
      onReject(id);
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  // Handle manual button actions
  const handleManualAccept = () => {
    if (currentTodo) {
      handleAccept(currentTodo.id);
    }
  };

  const handleManualReject = () => {
    if (currentTodo) {
      handleReject(currentTodo.id);
    }
  };

  // Reset to previous todo
  const handleUndo = () => {
    if (swipedTodos.length > 0 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSwipedTodos(prev => prev.slice(0, -1));
    }
  };

  // Check if all todos are completed
  useEffect(() => {
    if (!hasMoreTodos && todos.length > 0) {
      onComplete?.();
    }
  }, [hasMoreTodos, todos.length, onComplete]);

  if (todos.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No todos to review</h3>
          <p className="text-gray-500">All caught up! Great job! 🎉</p>
        </div>
      </div>
    );
  }

  if (!hasMoreTodos) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All done! 🎉</h3>
          <p className="text-gray-500 mb-6">
            You've reviewed {swipedTodos.length} todos
          </p>
          
          {/* Summary */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {swipedTodos.filter(s => s.action === 'accept').length}
              </div>
              <div className="text-sm text-gray-500">Accepted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {swipedTodos.filter(s => s.action === 'reject').length}
              </div>
              <div className="text-sm text-gray-500">Rejected</div>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentIndex(0);
              setSwipedTodos([]);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Review Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="flex-none p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Swipe Mode</h2>
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {currentIndex + 1} of {todos.length}
            </div>
          </div>
          
          <button
            onClick={handleUndo}
            disabled={swipedTodos.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Undo</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentIndex / todos.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card Stack */}
      <div className="flex-1 relative px-6 pb-6">
        <div className="relative w-full h-full max-w-2xl mx-auto">
          {/* Next Card (Background) */}
          {nextTodo && (
            <SwipeCard
              key={`next-${nextTodo.id}`}
              todo={nextTodo}
              onAccept={handleAccept}
              onReject={handleReject}
              isTop={false}
            />
          )}
          
          {/* Current Card (Top) */}
          {currentTodo && (
            <SwipeCard
              key={`current-${currentTodo.id}`}
              todo={currentTodo}
              onAccept={handleAccept}
              onReject={handleReject}
              isTop={true}
            />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-none p-6">
        <div className="flex justify-center gap-6">
          <button
            onClick={handleManualReject}
            disabled={!currentTodo || isAnimating}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <XCircle className="w-8 h-8" />
          </button>
          
          <button
            onClick={handleManualAccept}
            disabled={!currentTodo || isAnimating}
            className="w-16 h-16 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <CheckCircle className="w-8 h-8" />
          </button>
        </div>
        
        <div className="text-center mt-4 text-sm text-gray-500">
          Tap buttons or swipe cards to make decisions
        </div>
      </div>
    </div>
  );
};