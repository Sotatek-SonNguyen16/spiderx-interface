"use client";

import { CardContent } from "./CardContent";
import { ActionOverlay } from "./ActionOverlay";
import { useSwipeGesture } from "../../hooks/useSwipeGesture";
import { CARD_VISUAL_CONFIG, ANIMATION_CONFIG, EASING } from "../../utils/swipe.config";
import type { Todo } from "../../types";
import type { CardPosition } from "../../utils/swipe.config";

/**
 * EnhancedSwipeCard Component
 * Premium swipe card with gesture handling, overlay, and animations
 * 
 * Requirements: 1.1, 3.1, 3.2, 4.1, 4.2, 6.1, 6.2
 */

interface EnhancedSwipeCardProps {
  task: Todo;
  position: CardPosition;
  onSwipeComplete: (direction: 'left' | 'right') => void;
  isAnimating?: boolean;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  reducedMotion?: boolean;
}

export const EnhancedSwipeCard = ({
  task,
  position,
  onSwipeComplete,
  isAnimating = false,
  onAnimationStart,
  onAnimationEnd,
  reducedMotion = false,
}: EnhancedSwipeCardProps) => {
  const isActive = position === 'active';

  const { state, handlers, cardRef } = useSwipeGesture({
    onSwipeComplete,
    onAnimationStart,
    onAnimationEnd,
    disabled: !isActive || isAnimating,
    reducedMotion,
  });

  // Calculate transform style
  const getTransformStyle = () => {
    if (!isActive) return {};

    const { dragX, dragY, rotation, isDragging } = state;
    
    return {
      transform: `translateX(${dragX}px) translateY(${dragY}px) rotate(${rotation}deg)`,
      transition: isDragging 
        ? 'none' 
        : `transform ${ANIMATION_CONFIG.snapBack.duration}ms ${EASING.easeOutCubic}`,
    };
  };

  return (
    <div
      ref={cardRef}
      className={`
        w-full h-full cursor-grab active:cursor-grabbing select-none
        ${isActive ? '' : 'pointer-events-none'}
      `}
      style={{
        ...getTransformStyle(),
        height: `min(${CARD_VISUAL_CONFIG.heightVh}vh, 600px)`,
        maxWidth: CARD_VISUAL_CONFIG.maxWidth,
        margin: '0 auto',
      }}
      onMouseDown={isActive ? handlers.onMouseDown : undefined}
      onTouchStart={isActive ? handlers.onTouchStart : undefined}
      onTouchMove={isActive ? handlers.onTouchMove : undefined}
      onTouchEnd={isActive ? handlers.onTouchEnd : undefined}
    >
      {/* Action Overlay */}
      {isActive && (
        <ActionOverlay
          direction={state.direction}
          progress={state.overlayProgress}
          isOverThreshold={state.isOverThreshold}
        />
      )}

      {/* Card Container */}
      <div
        className="w-full h-full bg-white overflow-hidden border border-gray-200"
        style={{
          borderRadius: CARD_VISUAL_CONFIG.borderRadius,
          boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
        }}
      >
        <CardContent task={task} />
      </div>
    </div>
  );
};
