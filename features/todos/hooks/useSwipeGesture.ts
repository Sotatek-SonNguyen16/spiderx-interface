"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  calculateCommitDistance,
  calculateRotation,
  calculateOverlayProgress,
  shouldCommit,
  getSwipeDirection,
  calculateVelocity,
} from "../utils/swipe.utils";
import { GESTURE_CONFIG } from "../utils/swipe.config";

/**
 * useSwipeGesture Hook
 * Tracks drag position, velocity, and determines commit actions
 * 
 * Requirements: 3.1, 3.2, 3.4, 3.5, 3.6
 */

interface SwipeGestureState {
  dragX: number;
  dragY: number;
  isDragging: boolean;
  rotation: number;
  overlayProgress: number;
  direction: 'left' | 'right' | null;
  isOverThreshold: boolean;
}

interface UseSwipeGestureOptions {
  onSwipeComplete: (direction: 'left' | 'right') => void;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  disabled?: boolean;
  reducedMotion?: boolean;
}

interface UseSwipeGestureReturn {
  state: SwipeGestureState;
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
  cardRef: React.RefObject<HTMLDivElement>;
}

export const useSwipeGesture = ({
  onSwipeComplete,
  onAnimationStart,
  onAnimationEnd,
  disabled = false,
  reducedMotion = false,
}: UseSwipeGestureOptions): UseSwipeGestureReturn => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [state, setState] = useState<SwipeGestureState>({
    dragX: 0,
    dragY: 0,
    isDragging: false,
    rotation: 0,
    overlayProgress: 0,
    direction: null,
    isOverThreshold: false,
  });

  // Track velocity
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0, time: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });

  const getCardWidth = useCallback(() => {
    return cardRef.current?.offsetWidth || 400;
  }, []);

  const updateState = useCallback((clientX: number, clientY: number) => {
    const deltaX = clientX - startPosRef.current.x;
    const deltaY = (clientY - startPosRef.current.y) * GESTURE_CONFIG.yAxisReduction;
    
    // Calculate velocity
    const now = performance.now();
    const deltaTime = now - lastPosRef.current.time;
    if (deltaTime > 0) {
      velocityRef.current.x = calculateVelocity(clientX, lastPosRef.current.x, deltaTime);
      velocityRef.current.y = calculateVelocity(clientY, lastPosRef.current.y, deltaTime);
    }
    lastPosRef.current = { x: clientX, y: clientY, time: now };

    const cardWidth = getCardWidth();
    const commitDistance = calculateCommitDistance(cardWidth);
    const rotation = reducedMotion ? 0 : calculateRotation(deltaX);
    const overlayProgress = calculateOverlayProgress(deltaX, commitDistance);
    const direction = getSwipeDirection(deltaX);
    const isOverThreshold = shouldCommit(deltaX, velocityRef.current.x, cardWidth);

    setState({
      dragX: deltaX,
      dragY: deltaY,
      isDragging: true,
      rotation,
      overlayProgress,
      direction,
      isOverThreshold,
    });
  }, [getCardWidth, reducedMotion]);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (disabled) return;
    
    startPosRef.current = { x: clientX, y: clientY };
    lastPosRef.current = { x: clientX, y: clientY, time: performance.now() };
    velocityRef.current = { x: 0, y: 0 };
    
    setState(prev => ({ ...prev, isDragging: true }));
  }, [disabled]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!state.isDragging || disabled) return;
    updateState(clientX, clientY);
  }, [state.isDragging, disabled, updateState]);

  const handleEnd = useCallback(() => {
    if (!state.isDragging || disabled) return;

    const cardWidth = getCardWidth();
    const shouldTrigger = shouldCommit(state.dragX, velocityRef.current.x, cardWidth);
    const direction = getSwipeDirection(state.dragX);

    if (shouldTrigger && direction) {
      onAnimationStart?.();
      onSwipeComplete(direction);
    }

    // Reset state (snap back if not committed)
    setState({
      dragX: 0,
      dragY: 0,
      isDragging: false,
      rotation: 0,
      overlayProgress: 0,
      direction: null,
      isOverThreshold: false,
    });

    if (!shouldTrigger) {
      onAnimationEnd?.();
    }
  }, [state.isDragging, state.dragX, disabled, getCardWidth, onSwipeComplete, onAnimationStart, onAnimationEnd]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Global mouse event listeners
  useEffect(() => {
    if (state.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [state.isDragging, handleMouseMove, handleMouseUp]);

  return {
    state,
    handlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    cardRef,
  };
};
