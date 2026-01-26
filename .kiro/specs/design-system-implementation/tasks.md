# Implementation Plan: Design System Implementation

## Overview

This implementation plan transforms the SpiderX application from the current Electric Blue/Lightning Yellow theme to the "Forest Primary / Quiet Luxury / Museum-core" design system. The implementation follows a bottom-up approach: foundation tokens → recipe system → UI components → page integration → migration cleanup.

## Tasks

- [x] 1. Set up foundation layer (tokens and theme)
  - [x] 1.1 Create tokens.css with all design token CSS variables
    - Define color tokens (bg, surface, ink, primary, ai, status colors)
    - Define shadow tokens (shadow1, shadow2)
    - Define radius tokens (rSm, rMd, rLg, rXl)
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.2 Write property test for token completeness
    - **Property 1: Token Completeness**
    - **Validates: Requirements 1.1, 1.2, 1.3**

  - [x] 1.3 Update style.css to import tokens and configure Tailwind @theme
    - Import tokens.css
    - Add @theme block mapping CSS variables to Tailwind utilities
    - Configure font families (Fraunces, Inter)
    - _Requirements: 1.4, 1.5, 2.1, 2.2, 2.5_

  - [x] 1.4 Write property test for Tailwind theme mapping
    - **Property 2: Tailwind Theme Mapping Completeness**
    - **Validates: Requirements 1.5**

- [x] 2. Create utility and recipe system
  - [x] 2.1 Create cn() class name utility in lib/cn.ts
    - Implement class concatenation with falsy value filtering
    - _Requirements: 4.1_

  - [x] 2.2 Create recipes.ts with all component class presets
    - Define focusRing, button, card, input, badge, progress, chip, toast recipes
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 2.3 Write property test for recipe structure validity
    - **Property 7: Recipe Structure Validity**
    - **Validates: Requirements 4.1, 4.2**

- [x] 3. Checkpoint - Foundation layer complete
  - Ensure tokens load correctly
  - Verify Tailwind utilities work (bg-bg, text-ink, etc.)
  - Ask the user if questions arise

- [x] 4. Implement core UI components
  - [x] 4.1 Create Button component with all variants
    - Implement primary, secondary, ghost, destructive variants
    - Apply recipes and focusRing
    - _Requirements: 3.1, 3.2_

  - [x] 4.2 Write property test for Button variant correctness
    - **Property 3: Button Variant Correctness**
    - **Validates: Requirements 3.1, 3.2**

  - [x] 4.3 Create Card component with clickable and recommended variants
    - Implement base, clickable, padding, and recommended variants
    - _Requirements: 3.3, 3.4_

  - [x] 4.4 Write property test for Card variant correctness
    - **Property 4: Card Variant Correctness**
    - **Validates: Requirements 3.3, 3.4**

  - [x] 4.5 Create Badge component with all variants
    - Implement default, ai, success, warning, danger, gold variants
    - _Requirements: 3.5_

  - [x] 4.6 Write property test for Badge variant correctness
    - **Property 5: Badge Variant Correctness**
    - **Validates: Requirements 3.5**

  - [x] 4.7 Create Input and Field components
    - Implement base input with error state
    - Implement Field wrapper with label, helper, error text
    - _Requirements: 3.6, 3.7_

  - [x] 4.8 Write property test for Input state correctness
    - **Property 6: Input State Correctness**
    - **Validates: Requirements 3.6, 3.7**

  - [x] 4.9 Create Drawer component using HeadlessUI Dialog
    - Implement right-side panel with slide animation
    - Include header with title, subtitle, close button
    - _Requirements: 3.8_

- [x] 5. Implement progress UI components
  - [x] 5.1 Create ProgressBlock component
    - Implement progress bar with sync/ai mode
    - _Requirements: 9.4_

  - [x] 5.2 Write property test for Progress bar mode correctness
    - **Property 8: Progress Bar Mode Correctness**
    - **Validates: Requirements 9.4**

  - [x] 5.3 Create ProgressChip component
    - Implement fixed-position chip with title, meta, actions
    - _Requirements: 9.1, 9.2_

- [x] 6. Checkpoint - Component library complete
  - Ensure all components render correctly
  - Verify recipes are applied consistently
  - Ask the user if questions arise

- [x] 7. Update app layout and fonts
  - [x] 7.1 Update app/layout.tsx with Fraunces font
    - Add Fraunces font import from Google Fonts
    - Configure font variables
    - Update body classes to use new tokens
    - _Requirements: 2.1, 2.2_

  - [x] 7.2 Remove dark mode configuration
    - Remove .dark CSS rules from style.css
    - Remove dark mode toggle if exists
    - _Requirements: 11.1, 11.2, 11.3_

  - [x] 7.3 Write property test for light mode only tokens
    - **Property 12: Light Mode Only Tokens**
    - **Validates: Requirements 11.2**

- [x] 8. Update Landing page
  - [x] 8.1 Update Landing hero section
    - Apply serif font to H1
    - Update CTA buttons to use primary variant
    - Apply ivory background
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 8.2 Update Landing features and testimonials
    - Apply Card component styling
    - Update AI callouts to use aiSoft background
    - _Requirements: 5.4, 5.5_

- [x] 9. Update Pricing page
  - [x] 9.1 Update Pricing plan cards
    - Apply Card component with recommended variant
    - Update "Save X%" badges to use gold variant
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [x] 10. Update Auth pages (Login/Signup)
  - [x] 10.1 Update signin page
    - Apply serif font to page title
    - Update form card to use surface background
    - Apply Input component styling
    - _Requirements: 7.1, 7.2, 7.4, 7.5_

  - [x] 10.2 Update signup page
    - Apply same styling as signin
    - _Requirements: 7.1, 7.2, 7.4, 7.5_

- [x] 11. Update App pages (Todo, Integration, Whitelist)
  - [x] 11.1 Update Todo list page
    - Apply Card component to task items
    - Update AI badges to use ai variant
    - Update priority indicators to use warning variant
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 11.2 Write property test for App pages sans-serif only
    - **Property 11: App Pages Sans-Serif Only**
    - **Validates: Requirements 2.4, 8.1**

  - [x] 11.3 Update Integration page
    - Apply consistent Card and Badge styling
    - _Requirements: 8.1, 8.2_

  - [x] 11.4 Update Whitelist page
    - Apply consistent Card and Badge styling
    - _Requirements: 8.1, 8.2_

- [x] 12. Checkpoint - Page updates complete
  - Verify all pages use new design system
  - Check typography (serif for marketing, sans for app)
  - Ask the user if questions arise

- [x] 13. Legacy style migration and cleanup
  - [x] 13.1 Remove legacy color variables from style.css
    - Remove Electric Blue, Lightning Yellow, and old gray scale
    - Remove old brand/accent color definitions
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [x] 13.2 Update remaining components to use new tokens
    - Search and replace hardcoded colors
    - Update any remaining gray-* class usage
    - _Requirements: 12.5_

  - [x] 13.3 Write property test for no legacy color values
    - **Property 10: No Legacy Color Values**
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

  - [x] 13.4 Update Header and Footer components
    - Apply new token colors and typography
    - _Requirements: 12.5_

- [x] 14. Motion and animation updates
  - [x] 14.1 Update animation timing in recipes and components
    - Ensure 150-200ms for hover, 200-220ms for drawers
    - Use ease-out timing function
    - _Requirements: 10.1, 10.2, 10.3, 10.5_

  - [x] 14.2 Write property test for motion timing consistency
    - **Property 9: Motion Timing Consistency**
    - **Validates: Requirements 10.1, 10.3, 10.5**

  - [x] 14.3 Remove conflicting animations
    - Remove bounce, neon glow, shimmer effects that conflict with museum-core
    - _Requirements: 10.4_

- [x] 15. Final checkpoint - Design system complete
  - Run all property tests
  - Visual review of all pages
  - Ensure no legacy colors remain
  - Ask the user if questions arise

## Notes

- All tasks including property tests are required for comprehensive coverage
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript with fast-check for property-based testing
