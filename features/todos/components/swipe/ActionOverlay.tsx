"use client";

import { Check, X } from "lucide-react";
import { OVERLAY_COLORS, ANIMATION_CONFIG } from "../../utils/swipe.config";
import { calculateIconScale } from "../../utils/swipe.utils";

/**
 * ActionOverlay Component
 * Displays accept/skip overlay with soft colors during swipe
 * 
 * Requirements: 4.1, 4.2, 5.1, 5.2, 4.3, 6.4
 */

interface ActionOverlayProps {
  direction: 'left' | 'right' | null;
  progress: number; // 0 to 1
  isOverThreshold: boolean;
}

export const ActionOverlay = ({ direction, progress, isOverThreshold }: ActionOverlayProps) => {
  if (!direction || progress <= 0) return null;

  const isAccept = direction === 'right';
  const colors = isAccept ? OVERLAY_COLORS.accept : OVERLAY_COLORS.skip;
  const Icon = isAccept ? Check : X;
  const label = isAccept ? 'Accept' : 'Skip';

  // Calculate icon scale with pop effect when over threshold
  const baseScale = calculateIconScale(progress);
  const popScale = isOverThreshold ? ANIMATION_CONFIG.iconPop.scale : baseScale;
  
  // Glow effect when over threshold
  const glowOpacity = isOverThreshold ? ANIMATION_CONFIG.iconPop.glowOpacity : 0;

  return (
    <div
      className="absolute inset-0 rounded-[20px] flex items-center justify-center pointer-events-none z-40 transition-all"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderWidth: 2,
        borderStyle: 'solid',
        opacity: progress,
        boxShadow: isOverThreshold 
          ? `0 0 20px ${colors.border}, inset 0 0 20px ${colors.background}`
          : 'none',
      }}
    >
      <div
        className="flex flex-col items-center gap-2 transition-transform"
        style={{
          transform: `scale(${popScale})`,
          transitionDuration: `${ANIMATION_CONFIG.iconPop.duration}ms`,
          transitionTimingFunction: 'ease-out',
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: isAccept ? 'rgba(34, 197, 94, 0.2)' : 'rgba(156, 163, 175, 0.2)',
            boxShadow: glowOpacity > 0 
              ? `0 0 ${20 * glowOpacity}px ${colors.icon}`
              : 'none',
          }}
        >
          <Icon
            className="w-8 h-8"
            style={{ color: colors.icon }}
            strokeWidth={2.5}
          />
        </div>
        <span
          className="text-lg font-semibold"
          style={{ color: colors.text }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};
