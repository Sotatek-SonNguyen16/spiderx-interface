"use client";

import { useEffect, useCallback } from "react";

/**
 * useKeyboardNavigation Hook
 * Adds keyboard support for swipe actions
 * 
 * Requirements: 9.4
 */

interface UseKeyboardNavigationOptions {
  onAccept: () => void;
  onSkip: () => void;
  onUndo: () => void;
  disabled?: boolean;
}

export const useKeyboardNavigation = ({
  onAccept,
  onSkip,
  onUndo,
  disabled = false,
}: UseKeyboardNavigationOptions) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return;

      // Prevent default for handled keys
      const handledKeys = ['ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'KeyZ'];
      if (handledKeys.includes(event.code)) {
        event.preventDefault();
      }

      switch (event.code) {
        case 'ArrowRight':
        case 'Enter':
          // Right arrow or Enter = Accept
          onAccept();
          break;
        
        case 'ArrowLeft':
        case 'Escape':
          // Left arrow or Escape = Skip
          onSkip();
          break;
        
        case 'KeyZ':
          // Z key (with or without Ctrl/Cmd) = Undo
          if (event.ctrlKey || event.metaKey || !event.shiftKey) {
            onUndo();
          }
          break;
      }
    },
    [onAccept, onSkip, onUndo, disabled]
  );

  useEffect(() => {
    if (disabled) return;

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, disabled]);
};