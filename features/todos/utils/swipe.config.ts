/**
 * Swipe Queue Animation and Gesture Configuration
 * Premium "Decision Mode" experience with polished animations
 * 
 * Requirements: 3.3, 6.1, 6.2, 6.3, 6.5, 7.5
 */

// =============================================================================
// EASING CURVES - CSS cubic-bezier strings
// =============================================================================

export const EASING = {
  /** easeOutCubic - smooth deceleration for snap back and lift animations */
  easeOutCubic: 'cubic-bezier(0.22, 1, 0.36, 1)',
  
  /** easeInCubic - acceleration for commit out animation */
  easeInCubic: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)',
  
  /** easeOutBack - subtle bounce for undo animation */
  easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  
  /** Simple ease-out for reduced motion */
  easeOut: 'ease-out',
} as const;

// =============================================================================
// ANIMATION CONFIG - Standard animations
// =============================================================================

export const ANIMATION_CONFIG = {
  /** Snap back animation when swipe doesn't meet threshold */
  snapBack: {
    duration: 200,
    easing: EASING.easeOutCubic,
  },
  
  /** Commit out animation when action is triggered */
  commitOut: {
    duration: 260,
    easing: EASING.easeInCubic,
    /** Final opacity (not fully transparent for premium feel) */
    finalOpacity: 0.85,
    /** Extra distance beyond card width */
    exitOffset: 120,
  },
  
  /** Next card lift animation after commit */
  nextLift: {
    delay: 80,
    duration: 240,
    easing: EASING.easeOutCubic,
  },
  
  /** Undo animation - card returns to stack */
  undo: {
    duration: 290,
    easing: EASING.easeOutBack,
  },
  
  /** Icon pop effect when crossing threshold */
  iconPop: {
    duration: 80,
    scale: 1.06,
    glowOpacity: 0.25,
  },
  
  /** Toast notification timing */
  toast: {
    appearDelay: 120,
    autoHideMs: 5000,
  },
} as const;

// =============================================================================
// REDUCED MOTION CONFIG - Accessibility
// =============================================================================

export const REDUCED_MOTION_CONFIG = {
  snapBack: {
    duration: 140,
    easing: EASING.easeOut,
  },
  commitOut: {
    duration: 140,
    easing: EASING.easeOut,
    finalOpacity: 0.85,
    exitOffset: 120,
  },
  nextLift: {
    delay: 40,
    duration: 140,
    easing: EASING.easeOut,
  },
  undo: {
    duration: 160,
    easing: EASING.easeOut,
  },
  iconPop: {
    duration: 0,
    scale: 1,
    glowOpacity: 0,
  },
  toast: {
    appearDelay: 0,
    autoHideMs: 5000,
  },
  /** Disable rotation in reduced motion mode */
  disableRotation: true,
} as const;

// =============================================================================
// GESTURE CONFIG - Thresholds and formulas
// =============================================================================

export const GESTURE_CONFIG = {
  /** Ratio of card width for commit distance (28%) */
  commitDistanceRatio: 0.28,
  
  /** Maximum commit distance in pixels */
  commitDistanceMax: 160,
  
  /** Velocity threshold for flick gesture (px/s) */
  flickVelocityThreshold: 900,
  
  /** Minimum drag ratio for flick to trigger (12%) */
  flickDistanceRatio: 0.12,
  
  /** Maximum rotation angle in degrees */
  maxRotation: 8,
  
  /** Rotation divisor (dragX / this = rotation) */
  rotationDivisor: 20,
  
  /** Y-axis movement reduction factor */
  yAxisReduction: 0.1,
} as const;

// =============================================================================
// CARD STACK CONFIG - Visual depth effect
// =============================================================================

export const CARD_STACK_CONFIG = {
  /** Maximum visible cards in stack */
  maxVisibleCards: 3,
  
  /** Active card (top) */
  active: {
    scale: 1.0,
    translateY: 0,
    opacity: 1.0,
    zIndex: 30,
    shadow: '0 12px 24px rgba(0,0,0,0.08)',
  },
  
  /** Peek card (second) */
  peek: {
    scale: 0.96,
    translateY: 12,
    opacity: 0.9,
    zIndex: 20,
    shadow: '0 8px 16px rgba(0,0,0,0.06)',
  },
  
  /** Blur card (third) */
  blur: {
    scale: 0.92,
    translateY: 24,
    opacity: 0.7,
    zIndex: 10,
    blur: 2,
    shadow: '0 4px 8px rgba(0,0,0,0.04)',
  },
} as const;

// =============================================================================
// CARD VISUAL CONFIG
// =============================================================================

export const CARD_VISUAL_CONFIG = {
  /** Border radius for card-like appearance */
  borderRadius: 20,
  
  /** Card height as viewport height percentage (desktop) */
  heightVh: 68,
  
  /** Maximum card width */
  maxWidth: 480,
} as const;

// =============================================================================
// OVERLAY COLORS - Soft colors for accept/skip
// =============================================================================

export const OVERLAY_COLORS = {
  accept: {
    background: 'rgba(34, 197, 94, 0.15)', // green-500 with low opacity
    border: 'rgba(34, 197, 94, 0.3)',
    text: '#15803d', // green-700
    icon: '#22c55e', // green-500
  },
  skip: {
    background: 'rgba(156, 163, 175, 0.15)', // gray-400 with low opacity (not harsh red)
    border: 'rgba(156, 163, 175, 0.3)',
    text: '#4b5563', // gray-600
    icon: '#6b7280', // gray-500
  },
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type AnimationConfig = typeof ANIMATION_CONFIG;
export type ReducedMotionConfig = typeof REDUCED_MOTION_CONFIG;
export type GestureConfig = typeof GESTURE_CONFIG;
export type CardStackConfig = typeof CARD_STACK_CONFIG;
export type CardPosition = 'active' | 'peek' | 'blur';
