"use client";

import { useEffect, useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { ANIMATION_CONFIG, EASING } from "../../utils/swipe.config";

/**
 * SwipeToast Component
 * Toast notification with undo button
 * 
 * Requirements: 7.1, 7.2
 */

interface SwipeToastProps {
  visible: boolean;
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  autoHideMs?: number;
}

export const SwipeToast = ({
  visible,
  message,
  onUndo,
  onDismiss,
  autoHideMs = ANIMATION_CONFIG.toast.autoHideMs,
}: SwipeToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  // Handle visibility with delay
  useEffect(() => {
    if (visible) {
      // Appear after delay
      const showTimer = setTimeout(() => {
        setIsVisible(true);
        setProgress(100);
      }, ANIMATION_CONFIG.toast.appearDelay);

      return () => clearTimeout(showTimer);
    } else {
      setIsVisible(false);
    }
  }, [visible]);

  // Auto-dismiss timer with progress
  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / autoHideMs) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        onDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible, autoHideMs, onDismiss]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      style={{
        animation: `slideUp 200ms ${EASING.easeOutCubic}`,
      }}
      role="alert"
      aria-live="polite"
    >
      <div className="bg-gray-900 text-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 min-w-[300px]">
        {/* Message */}
        <span className="flex-1 text-sm">{message}</span>

        {/* Undo button */}
        <button
          onClick={onUndo}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Undo</span>
        </button>

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden">
          <div
            className="h-full bg-white/30 transition-all duration-50"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
};
