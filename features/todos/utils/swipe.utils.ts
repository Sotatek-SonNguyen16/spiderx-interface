/**
 * Swipe Queue Gesture Calculation Utilities
 * Pure functions for gesture calculations
 * 
 * Requirements: 3.2, 3.3, 3.4, 3.5, 4.3
 */

import { GESTURE_CONFIG } from './swipe.config';

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Calculate commit distance based on card width
 * Formula: min(0.28 * cardWidth, 160px)
 * 
 * Requirements: 3.3
 */
export const calculateCommitDistance = (cardWidth: number): number => {
  return Math.min(
    GESTURE_CONFIG.commitDistanceRatio * cardWidth,
    GESTURE_CONFIG.commitDistanceMax
  );
};

/**
 * Calculate rotation based on drag position
 * Formula: clamp(dragX / 20, -8deg, +8deg)
 * 
 * Requirements: 3.2
 */
export const calculateRotation = (dragX: number): number => {
  return clamp(
    dragX / GESTURE_CONFIG.rotationDivisor,
    -GESTURE_CONFIG.maxRotation,
    GESTURE_CONFIG.maxRotation
  );
};

/**
 * Simple easeOut function for overlay progress
 * Uses quadratic easing: 1 - (1 - t)^2
 */
export const easeOut = (t: number): number => {
  return 1 - Math.pow(1 - t, 2);
};

/**
 * Calculate overlay progress/opacity based on drag position
 * Formula: easeOut(clamp(|dragX| / commitDistance, 0, 1))
 * 
 * Requirements: 4.3
 */
export const calculateOverlayProgress = (
  dragX: number,
  commitDistance: number
): number => {
  const linearProgress = clamp(Math.abs(dragX) / commitDistance, 0, 1);
  return easeOut(linearProgress);
};

/**
 * Determine if swipe should commit based on distance and velocity
 * 
 * Commit conditions:
 * 1. |dragX| >= commitDistance (distance threshold)
 * 2. |velocityX| > 900px/s AND |dragX| >= 0.12 * cardWidth (flick gesture)
 * 
 * Requirements: 3.4, 3.5
 */
export const shouldCommit = (
  dragX: number,
  velocityX: number,
  cardWidth: number
): boolean => {
  const commitDistance = calculateCommitDistance(cardWidth);
  const absDragX = Math.abs(dragX);
  const absVelocityX = Math.abs(velocityX);
  
  // Condition 1: Distance threshold met
  if (absDragX >= commitDistance) {
    return true;
  }
  
  // Condition 2: Flick gesture (high velocity + minimum distance)
  const minFlickDistance = GESTURE_CONFIG.flickDistanceRatio * cardWidth;
  if (absVelocityX > GESTURE_CONFIG.flickVelocityThreshold && absDragX >= minFlickDistance) {
    return true;
  }
  
  return false;
};

/**
 * Get swipe direction from drag position
 */
export const getSwipeDirection = (dragX: number): 'left' | 'right' | null => {
  if (dragX > 0) return 'right';
  if (dragX < 0) return 'left';
  return null;
};

/**
 * Calculate final exit position for commit animation
 * Formula: sign(dragX) * (cardWidth + exitOffset)
 * 
 * Requirements: 6.5
 */
export const calculateExitPosition = (
  dragX: number,
  cardWidth: number,
  exitOffset: number = 120
): number => {
  const direction = dragX >= 0 ? 1 : -1;
  return direction * (cardWidth + exitOffset);
};

/**
 * Calculate icon scale based on progress
 * Scale increases slightly as progress increases
 */
export const calculateIconScale = (progress: number, maxScale: number = 1.06): number => {
  return 0.96 + (maxScale - 0.96) * progress;
};

/**
 * Calculate velocity from position changes over time
 */
export const calculateVelocity = (
  currentX: number,
  previousX: number,
  deltaTimeMs: number
): number => {
  if (deltaTimeMs <= 0) return 0;
  // Convert to pixels per second
  return ((currentX - previousX) / deltaTimeMs) * 1000;
};

/**
 * Determine action type from swipe direction
 */
export const getActionFromDirection = (
  direction: 'left' | 'right' | null
): 'accept' | 'skip' | null => {
  if (direction === 'right') return 'accept';
  if (direction === 'left') return 'skip';
  return null;
};
