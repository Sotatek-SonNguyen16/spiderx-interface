"use client";

import { useEffect } from "react";
import { 
  CardStack, 
  SwipeToast, 
  EmptyQueueState, 
  CompletionSummary, 
  QueueHeader 
} from "./swipe";
import { useSwipeQueueStore } from "../stores/swipeQueue.store";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import type { Todo } from "../types";

/**
 * EnhancedSwipeView Component
 * Premium "Decision Mode" experience with card stack and gestures
 * 
 * Requirements: All
 */

interface EnhancedSwipeViewProps {
  todos: Todo[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onComplete?: () => void;
  onBackToTodo?: () => void;
}

export const EnhancedSwipeView = ({
  todos,
  onAccept,
  onReject,
  onComplete,
  onBackToTodo,
}: EnhancedSwipeViewProps) => {
  const {
    queue,
    currentIndex,
    isAnimating,
    history,
    toast,
    acceptedCount,
    skippedCount,
    setQueue,
    acceptTask,
    skipTask,
    undoLastAction,
    setAnimating,
    hideToast,
    reset,
  } = useSwipeQueueStore();

  const reducedMotion = useReducedMotion();

  // Initialize queue when todos change
  useEffect(() => {
    setQueue(todos);
  }, [todos, setQueue]);

  // Check if all tasks are completed
  const hasMoreTasks = currentIndex < queue.length;
  const isCompleted = !hasMoreTasks && queue.length > 0;

  // Handle swipe actions
  const handleAccept = (taskId: string) => {
    acceptTask(taskId);
    onAccept(taskId);
  };

  const handleSkip = (taskId: string) => {
    skipTask(taskId);
    onReject(taskId);
  };

  const handleUndo = () => {
    undoLastAction();
    hideToast();
  };

  const handleReviewAgain = () => {
    reset();
    setQueue(todos);
  };

  const handleBackToTodo = () => {
    onBackToTodo?.();
  };

  // Keyboard navigation
  useKeyboardNavigation({
    onAccept: () => {
      const currentTask = queue[currentIndex];
      if (currentTask && !isAnimating) {
        handleAccept(currentTask.id);
      }
    },
    onSkip: () => {
      const currentTask = queue[currentIndex];
      if (currentTask && !isAnimating) {
        handleSkip(currentTask.id);
      }
    },
    onUndo: handleUndo,
    disabled: !hasMoreTasks || isAnimating,
  });

  // Call onComplete when all tasks are done
  useEffect(() => {
    if (isCompleted) {
      onComplete?.();
    }
  }, [isCompleted, onComplete]);

  // Empty state
  if (queue.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <EmptyQueueState onBackToTodo={handleBackToTodo} />
      </div>
    );
  }

  // Completion state
  if (isCompleted) {
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <CompletionSummary
          acceptedCount={acceptedCount}
          skippedCount={skippedCount}
          onReviewAgain={handleReviewAgain}
          onBackToTodo={handleBackToTodo}
        />
      </div>
    );
  }

  return (
    <div 
      className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden"
      role="application"
      aria-label="Task review queue"
    >
      {/* Header */}
      <QueueHeader
        currentIndex={currentIndex}
        totalTasks={queue.length}
        canUndo={history.length > 0}
        onUndo={handleUndo}
      />

      {/* Card Stack Container */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 p-6 flex items-center justify-center">
          <div 
            className="relative w-full h-full max-w-lg"
            role="listbox"
            aria-label="Tasks to review"
          >
            <CardStack
              cards={queue}
              currentIndex={currentIndex}
              onAccept={handleAccept}
              onSkip={handleSkip}
              isAnimating={isAnimating}
              onAnimationStart={() => setAnimating(true)}
              onAnimationEnd={() => setAnimating(false)}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>
      </div>

      {/* Keyboard hints */}
      <div className="flex-none p-4 text-center bg-white/50 backdrop-blur-sm">
        <p className="text-sm text-gray-500">
          Use arrow keys or swipe • Enter to accept • Esc to skip • Z to undo
        </p>
      </div>

      {/* Toast */}
      <SwipeToast
        visible={toast.visible}
        message={toast.message}
        onUndo={handleUndo}
        onDismiss={hideToast}
      />
    </div>
  );
};