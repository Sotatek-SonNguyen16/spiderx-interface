/**
 * Design System Recipes
 * Centralized class presets for all UI components
 * Forest Primary / Quiet Luxury / Museum-core
 */

export const recipes = {
  // Focus ring (reusable across components)
  focusRing:
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primarySoft",

  // Button variants
  button: {
    base: "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-colors duration-200",
    primary:
      "bg-primary text-surface shadow-s1 hover:bg-primaryHover active:bg-primaryPressed disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-surface text-primary border border-border hover:bg-surface2 active:bg-surface2 disabled:opacity-50 disabled:cursor-not-allowed",
    ghost: "px-3 py-2 text-primary hover:bg-primarySoft",
    destructive:
      "bg-danger text-surface shadow-s1 hover:opacity-95 active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed",
  },

  // Card variants
  card: {
    base: "bg-surface border border-border rounded-lg shadow-s1",
    clickable:
      "bg-surface border border-border rounded-lg shadow-s1 hover:shadow-s2 hover:-translate-y-[1px] transition-all duration-200",
    padSm: "p-4",
    padMd: "p-5",
    padLg: "p-6",
    recommended: "border-2 border-primary shadow-s2",
  },

  // Input variants
  input: {
    base: "w-full rounded-md bg-surface border border-border px-4 py-3 text-sm text-ink placeholder:text-ink3 focus:border-primary focus:ring-4 focus:ring-primarySoft focus:outline-none transition duration-150",
    error:
      "border-danger focus:border-danger focus:ring-4 focus:ring-dangerSoft",
    label: "text-sm font-semibold text-ink",
    helper: "mt-1 text-xs text-ink3",
    errorText: "mt-1 text-xs font-semibold text-danger",
  },

  // Badge variants
  badge: {
    base: "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border border-border",
    default: "bg-surface2 text-ink2",
    ai: "bg-aiSoft text-ai",
    success: "bg-successSoft text-success",
    warning: "bg-warningSoft text-warning",
    danger: "bg-dangerSoft text-danger",
    gold: "bg-goldSoft text-gold",
  },

  // Progress components
  progress: {
    track:
      "w-full h-2 rounded-full bg-surface2 overflow-hidden border border-border",
    fillPrimary: "h-full bg-primary transition-[width] duration-200",
    fillAI: "h-full bg-ai transition-[width] duration-200",
    step: "text-sm text-ink2",
    meta: "text-xs text-ink3",
  },

  // Chip (progress indicator)
  chip: {
    container:
      "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-border bg-surface shadow-s2 px-4 py-3",
    title: "text-sm font-semibold text-ink",
    meta: "text-xs text-ink3",
    iconBtn:
      "inline-flex h-8 w-8 items-center justify-center rounded-full text-ink2 hover:bg-surface2",
  },

  // Toast/Banner
  toast: {
    base: "flex items-start gap-3 rounded-lg border border-border bg-surface shadow-s2 p-4",
    title: "text-sm font-semibold text-ink",
    body: "mt-0.5 text-sm text-ink2",
  },
} as const;

// Type exports for recipe keys
export type ButtonVariant = keyof typeof recipes.button;
export type CardVariant = keyof typeof recipes.card;
export type BadgeVariant = keyof typeof recipes.badge;
export type InputVariant = keyof typeof recipes.input;
