# Requirements Document

## Introduction

This specification defines the requirements for implementing the "Forest Primary / Quiet Luxury / Museum-core" design system across the SpiderX application. The design system transforms the current Electric Blue/Lightning Yellow theme to an Editorial Minimalism style with Ivory backgrounds, Forest Ink primary colors, and Lavender AI accents. The implementation covers the foundation layer (tokens, CSS variables), core UI components, and application of the design system across all pages (Landing, Pricing, Login/Signup, and App screens).

## Glossary

- **Design_Token**: A semantic variable representing a design decision (color, spacing, radius, shadow) that can be referenced throughout the application
- **Recipe**: A predefined set of Tailwind classes for a specific component variant, ensuring consistency
- **Surface**: A background layer for cards, panels, and elevated UI elements
- **Ink**: Text color tokens following the museum-core naming convention
- **Primary**: The main brand action color (Forest Ink `#1F3A2E`)
- **AI_Accent**: The Lavender color (`#6D5BD0`) used exclusively for AI-related UI moments
- **Hairline_Border**: A subtle 1px border using the `border` token for editorial aesthetic
- **Marketing_Pages**: Landing page, Pricing page - can use serif headings and editorial style
- **App_Pages**: Todo list, Integration, Whitelist - must prioritize scannability with sans-serif

## Requirements

### Requirement 1: Design Token Foundation

**User Story:** As a developer, I want a centralized design token system, so that I can maintain consistent styling across the entire application.

#### Acceptance Criteria

1. THE Token_System SHALL define CSS custom properties for all color tokens (bg, surface, surface2, border, ink, ink2, ink3, primary, primaryHover, primaryPressed, primarySoft, ai, aiSoft, success, successSoft, warning, warningSoft, danger, dangerSoft)
2. THE Token_System SHALL define CSS custom properties for shadow tokens (shadow1, shadow2)
3. THE Token_System SHALL define CSS custom properties for radius tokens (rSm: 10px, rMd: 14px, rLg: 18px, rXl: 24px)
4. WHEN the tokens.css file is imported, THE Application SHALL have access to all design tokens via CSS variables
5. THE Tailwind_Theme SHALL map all CSS variables to Tailwind utility classes (e.g., `bg-bg`, `text-ink`, `rounded-lg`)

### Requirement 2: Typography System

**User Story:** As a designer, I want a dual typography system with serif for marketing and sans for app UI, so that the brand feels premium while maintaining usability.

#### Acceptance Criteria

1. THE Typography_System SHALL configure Fraunces as the heading font family for marketing pages
2. THE Typography_System SHALL configure Inter as the body/UI font family for all functional text
3. WHEN rendering Marketing_Pages headings (H1, H2), THE System SHALL use the serif font-heading class
4. WHEN rendering App_Pages content, THE System SHALL use the sans font-body class exclusively
5. THE Typography_System SHALL define type scale tokens matching the design spec (Marketing H1: 56-72px, H2: 36-44px, App title: 20-24px, Body: 15-16px, Meta: 12-13px)

### Requirement 3: Core UI Component Library

**User Story:** As a developer, I want reusable UI components following the design system, so that I can build consistent interfaces quickly.

#### Acceptance Criteria

1. THE Button_Component SHALL support variants: primary (Forest bg), secondary (Surface bg with border), ghost (transparent with hover), and destructive (Danger bg)
2. WHEN a Button receives focus, THE Button_Component SHALL display a 4px ring using primarySoft color
3. THE Card_Component SHALL render with surface background, hairline border, lg radius, and s1 shadow
4. WHEN a Card is clickable, THE Card_Component SHALL apply hover shadow (s2) and subtle lift (-1px translateY)
5. THE Badge_Component SHALL support variants: default (surface2 bg), ai (aiSoft bg with ai text), success, warning, and danger
6. THE Input_Component SHALL render with surface background, hairline border, and focus state showing primary border with primarySoft ring
7. IF an Input has an error, THEN THE Input_Component SHALL display danger border and dangerSoft focus ring
8. THE Drawer_Component SHALL render as a right-side panel with 420px width, surface background, and slide animation

### Requirement 4: Recipe System

**User Story:** As a developer, I want a centralized recipe system for component class presets, so that styling remains consistent and maintainable.

#### Acceptance Criteria

1. THE Recipe_System SHALL export a recipes object containing class presets for all component variants
2. THE Recipe_System SHALL include focusRing preset for consistent focus states across components
3. WHEN a component uses a recipe, THE Component SHALL apply the exact classes defined in the recipe
4. THE Recipe_System SHALL be the single source of truth for component styling (no hardcoded classes in components)

### Requirement 5: Landing Page Redesign

**User Story:** As a visitor, I want to see a premium, calm landing page, so that I trust SpiderX as a curated productivity tool.

#### Acceptance Criteria

1. THE Landing_Page SHALL use ivory (bg token) as the page background
2. THE Landing_Hero SHALL display H1 in serif font (Fraunces) at 56-72px size
3. THE Landing_Page SHALL use Forest primary color for all CTA buttons
4. WHEN displaying AI-related callouts, THE Landing_Page SHALL use aiSoft background with ai text color
5. THE Landing_Page SHALL display screenshots in frames with surface background and hairline border
6. THE Landing_Page SHALL apply paper texture at 2-4% opacity as subtle background enhancement

### Requirement 6: Pricing Page Redesign

**User Story:** As a potential customer, I want to see clear, elegant pricing options, so that I can make an informed decision.

#### Acceptance Criteria

1. THE Pricing_Page SHALL display plan cards on ivory background with surface card backgrounds
2. THE Recommended_Plan SHALL be highlighted with 2px primary border and s2 shadow
3. WHEN displaying "Save X%" badges, THE Pricing_Page SHALL use gold-soft background with gold text
4. THE Pricing_Page SHALL NOT use gradient backgrounds or neon effects
5. THE Pricing_Cards SHALL use consistent lg radius and hairline borders

### Requirement 7: Authentication Pages Redesign

**User Story:** As a user, I want clean, trustworthy login and signup pages, so that I feel confident entering my credentials.

#### Acceptance Criteria

1. THE Auth_Pages SHALL use surface background for the form card
2. THE Auth_Pages SHALL display page title in serif font (Fraunces)
3. THE Auth_Pages SHALL NOT use sci-fi portal imagery
4. WHEN displaying helper text (e.g., "Google OAuth coming soon"), THE Auth_Pages SHALL use ink3 color
5. THE Auth_Form_Inputs SHALL follow the Input_Component styling with proper focus states

### Requirement 8: App Pages Redesign (Todo, Integration, Whitelist)

**User Story:** As a user, I want a functional, scannable app interface, so that I can manage my tasks efficiently.

#### Acceptance Criteria

1. THE App_Pages SHALL use sans-serif (Inter) exclusively for all text
2. THE Todo_List_Cards SHALL render with surface background, hairline border, and s1 shadow
3. WHEN displaying AI-generated content or badges, THE App_Pages SHALL use aiSoft background with ai text
4. THE Priority_Indicators SHALL use warningSoft background with warning text (not harsh orange)
5. WHEN displaying status tags, THE App_Pages SHALL use surface2 background with ink2 text
6. THE App_Pages SHALL maintain sufficient contrast for quick scanning (ink color for primary text)

### Requirement 9: Progress and Sync UI Components

**User Story:** As a user, I want non-intrusive progress indicators, so that I can continue working while sync operations run.

#### Acceptance Criteria

1. THE Progress_Chip SHALL render as a fixed-position pill in the bottom-right corner
2. THE Progress_Chip SHALL display title, meta text, View button, and Dismiss button
3. WHEN viewing sync details, THE Drawer_Component SHALL open with progress information
4. THE Progress_Bar SHALL use primary color for sync operations and ai color for AI operations
5. WHEN dismissing the Progress_Chip, THE System SHALL only hide the chip (not stop the operation)

### Requirement 10: Animation and Motion System

**User Story:** As a user, I want subtle, refined animations, so that the interface feels premium without being distracting.

#### Acceptance Criteria

1. THE Motion_System SHALL use 150-200ms duration for hover transitions
2. THE Motion_System SHALL use 200-220ms duration for drawer open/close animations
3. THE Motion_System SHALL use easeOut timing function for all transitions
4. THE Motion_System SHALL NOT use bounce, neon glow, or shimmer effects that conflict with museum-core aesthetic
5. WHEN cards are hovered, THE System SHALL apply maximum 2-4px lift effect

### Requirement 11: Dark Mode Removal/Simplification

**User Story:** As a developer, I want to simplify the theme system, so that we maintain a consistent museum-core aesthetic.

#### Acceptance Criteria

1. THE Design_System SHALL remove or disable dark mode toggle functionality
2. THE CSS_Variables SHALL be defined only for light mode (museum-core ivory theme)
3. IF dark mode classes exist in the codebase, THEN THE Migration SHALL remove or comment them out

### Requirement 12: Legacy Style Migration

**User Story:** As a developer, I want to migrate from the old color system, so that the entire app uses the new design tokens.

#### Acceptance Criteria

1. THE Migration SHALL replace Electric Blue (`#2563eb`) references with primary token
2. THE Migration SHALL replace Lightning Yellow (`#facc15`) references with appropriate tokens (gold for pricing, warning for status)
3. THE Migration SHALL update all gray scale references to use ink/ink2/ink3 tokens
4. THE Migration SHALL update all background references to use bg/surface/surface2 tokens
5. WHEN migration is complete, THE Application SHALL have no hardcoded color values outside the token system
