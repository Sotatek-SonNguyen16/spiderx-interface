# Design Document: Design System Implementation

## Overview

This design document outlines the technical architecture and implementation approach for the SpiderX "Forest Primary / Quiet Luxury / Museum-core" design system. The implementation follows a layered approach: foundation tokens → recipe system → UI components → page integration.

The design system transforms the current Electric Blue/Lightning Yellow theme to an Editorial Minimalism aesthetic characterized by:
- Ivory paper backgrounds (`#F7F3EA`)
- Forest Ink primary actions (`#1F3A2E`)
- Lavender AI accents (`#6D5BD0`)
- Hairline borders and soft shadows
- Serif headings for marketing, sans-serif for app UI

Reference documents:
- #[[file:docs/1_Design_token.md]]
- #[[file:docs/1_Design_token_setup.md]]

## Architecture

The design system follows a three-layer architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
│  (Landing, Pricing, Auth, App Pages)                    │
├─────────────────────────────────────────────────────────┤
│                    Component Layer                       │
│  (Button, Card, Badge, Input, Drawer, Progress)         │
├─────────────────────────────────────────────────────────┤
│                    Foundation Layer                      │
│  (Tokens CSS + Tailwind Theme + Recipes)                │
└─────────────────────────────────────────────────────────┘
```

### File Structure

```
app/
├── css/
│   ├── style.css              # Main entry, imports tokens
│   └── tokens.css             # NEW: Design token definitions
├── layout.tsx                 # Updated with new fonts
│
lib/
├── cn.ts                      # Class name utility
│
components/
├── ui/
│   ├── button.tsx             # NEW: Button component
│   ├── card.tsx               # NEW: Card component
│   ├── badge.tsx              # NEW: Badge component
│   ├── input.tsx              # NEW: Input/Field components
│   ├── drawer.tsx             # NEW: Drawer component
│   ├── progress-chip.tsx      # NEW: Progress chip component
│   ├── progress-block.tsx     # NEW: Progress bar component
│   └── recipes.ts             # NEW: Recipe definitions
```

## Components and Interfaces

### 1. Token System (`app/css/tokens.css`)

```css
:root {
  /* Core Neutrals */
  --bg: #F7F3EA;
  --surface: #FFFDFA;
  --surface2: #F2EEE6;
  --border: #E7E1D7;
  
  /* Text Colors */
  --ink: #14171F;
  --ink2: #4B5563;
  --ink3: #7B8794;
  
  /* Primary (Forest) */
  --primary: #1F3A2E;
  --primaryHover: #173025;
  --primaryPressed: #102219;
  --primarySoft: #E3EFE8;
  
  /* AI Accent (Lavender) */
  --ai: #6D5BD0;
  --aiSoft: #EEEAFE;
  
  /* Status Colors */
  --success: #1E7A4C;
  --successSoft: #E7F4ED;
  --warning: #B45309;
  --warningSoft: #FEF3C7;
  --danger: #B42318;
  --dangerSoft: #FEE4E2;
  
  /* Gold (Pricing) */
  --gold: #B58B2A;
  --goldSoft: #F4E7C7;
  
  /* Shadows */
  --shadow1: 0 8px 20px rgba(20, 23, 31, 0.06);
  --shadow2: 0 12px 28px rgba(20, 23, 31, 0.08);
  
  /* Radius */
  --rSm: 10px;
  --rMd: 14px;
  --rLg: 18px;
  --rXl: 24px;
}
```

### 2. Tailwind Theme Extension

The Tailwind theme maps CSS variables to utility classes:

```typescript
// Integrated into app/css/style.css @theme block
@theme {
  /* Colors mapped from CSS variables */
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface2: var(--surface2);
  --color-border: var(--border);
  --color-ink: var(--ink);
  --color-ink2: var(--ink2);
  --color-ink3: var(--ink3);
  --color-primary: var(--primary);
  --color-primaryHover: var(--primaryHover);
  --color-primaryPressed: var(--primaryPressed);
  --color-primarySoft: var(--primarySoft);
  --color-ai: var(--ai);
  --color-aiSoft: var(--aiSoft);
  --color-success: var(--success);
  --color-successSoft: var(--successSoft);
  --color-warning: var(--warning);
  --color-warningSoft: var(--warningSoft);
  --color-danger: var(--danger);
  --color-dangerSoft: var(--dangerSoft);
  --color-gold: var(--gold);
  --color-goldSoft: var(--goldSoft);
  
  /* Shadows */
  --shadow-s1: var(--shadow1);
  --shadow-s2: var(--shadow2);
  
  /* Border Radius */
  --radius-sm: var(--rSm);
  --radius-md: var(--rMd);
  --radius-lg: var(--rLg);
  --radius-xl: var(--rXl);
  
  /* Fonts */
  --font-heading: "Fraunces", ui-serif, Georgia, serif;
  --font-body: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
}
```

### 3. Recipe System (`components/ui/recipes.ts`)

```typescript
export const recipes = {
  // Focus ring (reusable)
  focusRing: "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primarySoft",
  
  // Button variants
  button: {
    base: "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-colors duration-200",
    primary: "bg-primary text-surface shadow-s1 hover:bg-primaryHover active:bg-primaryPressed disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-surface text-primary border border-border hover:bg-surface2 active:bg-surface2 disabled:opacity-50 disabled:cursor-not-allowed",
    ghost: "px-3 py-2 text-primary hover:bg-primarySoft",
    destructive: "bg-danger text-surface shadow-s1 hover:opacity-95 active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed",
  },
  
  // Card variants
  card: {
    base: "bg-surface border border-border rounded-lg shadow-s1",
    clickable: "bg-surface border border-border rounded-lg shadow-s1 hover:shadow-s2 hover:-translate-y-[1px] transition-all duration-200",
    padSm: "p-4",
    padMd: "p-5",
    padLg: "p-6",
    recommended: "border-2 border-primary shadow-s2",
  },
  
  // Input variants
  input: {
    base: "w-full rounded-md bg-surface border border-border px-4 py-3 text-sm text-ink placeholder:text-ink3 focus:border-primary focus:ring-4 focus:ring-primarySoft focus:outline-none transition duration-150",
    error: "border-danger focus:border-danger focus:ring-4 focus:ring-dangerSoft",
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
    track: "w-full h-2 rounded-full bg-surface2 overflow-hidden border border-border",
    fillPrimary: "h-full bg-primary transition-[width] duration-200",
    fillAI: "h-full bg-ai transition-[width] duration-200",
    step: "text-sm text-ink2",
    meta: "text-xs text-ink3",
  },
  
  // Chip (progress indicator)
  chip: {
    container: "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-border bg-surface shadow-s2 px-4 py-3",
    title: "text-sm font-semibold text-ink",
    meta: "text-xs text-ink3",
    iconBtn: "inline-flex h-8 w-8 items-center justify-center rounded-full text-ink2 hover:bg-surface2",
  },
  
  // Toast/Banner
  toast: {
    base: "flex items-start gap-3 rounded-lg border border-border bg-surface shadow-s2 p-4",
    title: "text-sm font-semibold text-ink",
    body: "mt-0.5 text-sm text-ink2",
  },
} as const;
```

### 4. Component Interfaces

#### Button Component

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  className?: string;
}
```

#### Card Component

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  clickable?: boolean;
  pad?: "sm" | "md" | "lg";
  recommended?: boolean;
  className?: string;
}
```

#### Badge Component

```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "ai" | "success" | "warning" | "danger" | "gold";
  className?: string;
}
```

#### Input Component

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  className?: string;
}

interface FieldProps {
  label: string;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}
```

#### Drawer Component

```typescript
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  widthClass?: string;
}
```

#### Progress Components

```typescript
interface ProgressChipProps {
  title: string;
  meta?: string;
  onView: () => void;
  onDismiss: () => void;
}

interface ProgressBlockProps {
  percent: number; // 0-100
  stepText: string;
  meta?: string;
  mode?: "sync" | "ai";
}
```

### 5. Class Name Utility (`lib/cn.ts`)

```typescript
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
```

## Data Models

### Design Token Schema

```typescript
interface DesignTokens {
  colors: {
    bg: string;
    surface: string;
    surface2: string;
    border: string;
    ink: string;
    ink2: string;
    ink3: string;
    primary: string;
    primaryHover: string;
    primaryPressed: string;
    primarySoft: string;
    ai: string;
    aiSoft: string;
    success: string;
    successSoft: string;
    warning: string;
    warningSoft: string;
    danger: string;
    dangerSoft: string;
    gold: string;
    goldSoft: string;
  };
  shadows: {
    s1: string;
    s2: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}
```

### Recipe Schema

```typescript
interface RecipeDefinition {
  focusRing: string;
  button: {
    base: string;
    primary: string;
    secondary: string;
    ghost: string;
    destructive: string;
  };
  card: {
    base: string;
    clickable: string;
    padSm: string;
    padMd: string;
    padLg: string;
    recommended: string;
  };
  input: {
    base: string;
    error: string;
    label: string;
    helper: string;
    errorText: string;
  };
  badge: {
    base: string;
    default: string;
    ai: string;
    success: string;
    warning: string;
    danger: string;
    gold: string;
  };
  progress: {
    track: string;
    fillPrimary: string;
    fillAI: string;
    step: string;
    meta: string;
  };
  chip: {
    container: string;
    title: string;
    meta: string;
    iconBtn: string;
  };
  toast: {
    base: string;
    title: string;
    body: string;
  };
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, the following correctness properties have been identified:

### Property 1: Token Completeness

*For any* required design token (colors, shadows, radius), the tokens.css file SHALL contain a CSS custom property definition for that token.

**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: Tailwind Theme Mapping Completeness

*For any* CSS variable defined in tokens.css, the Tailwind @theme block SHALL contain a corresponding mapping to enable utility class usage.

**Validates: Requirements 1.5**

### Property 3: Button Variant Correctness

*For any* valid Button variant (primary, secondary, ghost, destructive), rendering the Button with that variant SHALL apply exactly the classes defined in `recipes.button.base`, `recipes.focusRing`, and `recipes.button[variant]`.

**Validates: Requirements 3.1, 3.2**

### Property 4: Card Variant Correctness

*For any* Card component, rendering with `clickable=false` SHALL apply `recipes.card.base` classes, and rendering with `clickable=true` SHALL apply `recipes.card.clickable` classes.

**Validates: Requirements 3.3, 3.4**

### Property 5: Badge Variant Correctness

*For any* valid Badge variant (default, ai, success, warning, danger, gold), rendering the Badge with that variant SHALL apply exactly the classes defined in `recipes.badge.base` and `recipes.badge[variant]`.

**Validates: Requirements 3.5**

### Property 6: Input State Correctness

*For any* Input component, rendering with `hasError=false` SHALL apply `recipes.input.base` classes, and rendering with `hasError=true` SHALL additionally apply `recipes.input.error` classes.

**Validates: Requirements 3.6, 3.7**

### Property 7: Recipe Structure Validity

*For any* recipe category (button, card, input, badge, progress, chip, toast), the recipes object SHALL contain all required variant keys as defined in the RecipeDefinition schema.

**Validates: Requirements 4.1, 4.2**

### Property 8: Progress Bar Mode Correctness

*For any* ProgressBlock component with mode "sync", the fill element SHALL use `recipes.progress.fillPrimary` class, and with mode "ai", it SHALL use `recipes.progress.fillAI` class.

**Validates: Requirements 9.4**

### Property 9: Motion Timing Consistency

*For any* recipe containing transition classes, the duration SHALL be between 150-220ms and SHALL use ease-out timing function.

**Validates: Requirements 10.1, 10.3, 10.5**

### Property 10: No Legacy Color Values

*For any* source file in the application (excluding tokens.css and node_modules), there SHALL be no hardcoded hex color values matching the legacy palette (#2563eb, #facc15, or gray-* scale references).

**Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

### Property 11: App Pages Sans-Serif Only

*For any* component rendered within App_Pages (todo, integration, whitelist), there SHALL be no usage of `font-heading` or serif font classes.

**Validates: Requirements 2.4, 8.1**

### Property 12: Light Mode Only Tokens

*For any* CSS rule in tokens.css, there SHALL be no `.dark` selector or dark mode media query definitions.

**Validates: Requirements 11.2**

## Error Handling

### Token Loading Errors

- **Missing tokens.css**: If tokens.css fails to load, the application should fall back to browser defaults. Components should still render but with incorrect colors.
- **Invalid CSS variable**: If a CSS variable is undefined, Tailwind will output the raw `var(--name)` string. The build process should warn about undefined variables.

### Component Prop Errors

- **Invalid variant**: If an invalid variant is passed to Button/Badge/Card, the component should fall back to the default variant and log a development warning.
- **Missing required props**: TypeScript will catch missing required props at compile time.

### Recipe Errors

- **Missing recipe key**: If a recipe key is accessed that doesn't exist, TypeScript will catch this at compile time due to `as const` assertion.

## Testing Strategy

### Unit Tests

Unit tests will verify specific examples and edge cases:

1. **Token file parsing**: Verify tokens.css contains all expected CSS custom properties
2. **Component rendering**: Verify each component renders with correct classes for each variant
3. **Recipe structure**: Verify recipes object matches expected schema
4. **cn() utility**: Verify class name concatenation handles falsy values correctly

### Property-Based Tests

Property-based tests will verify universal properties across all inputs using `fast-check`:

1. **Token completeness**: Generate list of required tokens, verify all exist in CSS
2. **Component variant correctness**: Generate random valid variants, verify correct classes applied
3. **Recipe structure validity**: Generate recipe category names, verify all required keys exist
4. **No legacy colors**: Scan source files, verify no legacy hex values found

### Testing Configuration

- **Framework**: Jest with fast-check for property-based testing
- **Minimum iterations**: 100 per property test
- **Tag format**: `Feature: design-system-implementation, Property N: [property text]`

### Test File Structure

```
__tests__/
├── design-system/
│   ├── tokens.test.ts           # Token completeness tests
│   ├── recipes.test.ts          # Recipe structure tests
│   ├── components/
│   │   ├── button.test.tsx      # Button variant tests
│   │   ├── card.test.tsx        # Card variant tests
│   │   ├── badge.test.tsx       # Badge variant tests
│   │   ├── input.test.tsx       # Input state tests
│   │   └── progress.test.tsx    # Progress mode tests
│   └── migration.test.ts        # Legacy color removal tests
```

### Integration Tests

Integration tests will verify page-level requirements:

1. **Landing page**: Verify serif headings, primary CTAs, ivory background
2. **Pricing page**: Verify recommended plan styling, gold badges
3. **Auth pages**: Verify serif title, surface form card
4. **App pages**: Verify sans-serif only, correct component usage
