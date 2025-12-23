"use client";

import { useCallback } from "react";
import { EnhancedSwipeCard } from "./EnhancedSwipeCard";
import { CARD_STACK_CONFIG } from "../../utils/swipe.config";
import type { Todo } from "../../types";
import type { CardPosition } from "../../utils/swipe.config";

/**
 * CardStack Component
 * Renders up to 3 visible cards with depth effect
 * 
 * Requirements: 1.2, 1.3, 1.4
 */

interface CardStackProps {
  cards: Todo[];
  currentIndex: number;
  onAccept: (taskId: string) => void;
  onSkip: (taskId: string) => void;
  isAnimating: boolean;
  onAnimationStart: () => void;
  onAnimationEnd: () => void;
  reducedMotion?: boolean;
}

export const CardStack = ({
  cards,
  currentIndex,
  onAccept,
  onSkip,
  isAnimating,
  onAnimationStart,
  onAnimationEnd,
  reducedMotion = false,
}: CardStackProps) => {
  // Get visible cards (max 3)
  const visibleCards = cards.slice(
    currentIndex,
    currentIndex + CARD_STACK_CONFIG.maxVisibleCards
  );

  const getCardPosition = (index: number): CardPosition => {
    if (index === 0) return 'active';
    if (index === 1) return 'peek';
    return 'blur';
  };

  const getCardStyle = (position: CardPosition) => {
    const config = CARD_STACK_CONFIG[position];
    
    // Type-safe blur access
    const blurValue = position === 'blur' && 'blur' in config ? config.blur : undefined;
    
    return {
      transform: `scale(${config.scale}) translateY(${config.translateY}px)`,
      opacity: config.opacity,
      zIndex: config.zIndex,
      boxShadow: config.shadow,
      filter: blurValue ? `blur(${blurValue}px)` : undefined,
    };
  };

  const handleSwipeComplete = useCallback(
    (direction: 'left' | 'right', taskId: string) => {
      if (direction === 'right') {
        onAccept(taskId);
      } else {
        onSkip(taskId);
      }
    },
    [onAccept, onSkip]
  );

  if (visibleCards.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-full">
      {/* Render cards in reverse order so active card is on top */}
      {visibleCards.map((card, index) => {
        const position = getCardPosition(index);
        const isActive = position === 'active';

        return (
          <div
            key={`${card.id}-${index}`}
            className="absolute inset-0"
            style={{
              ...getCardStyle(position),
              transitionProperty: 'transform, opacity',
              transitionDuration: '240ms',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pointerEvents: isActive ? 'auto' : 'none',
            }}
          >
            <EnhancedSwipeCard
              task={card}
              position={position}
              onSwipeComplete={(direction) => handleSwipeComplete(direction, card.id)}
              isAnimating={isAnimating && isActive}
              onAnimationStart={onAnimationStart}
              onAnimationEnd={onAnimationEnd}
              reducedMotion={reducedMotion}
            />
          </div>
        );
      })}
    </div>
  );
};
