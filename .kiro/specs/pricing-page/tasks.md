# Implementation Plan: SpiderX Pricing Page

## Overview

This implementation plan breaks down the pricing page development into incremental, testable steps. The approach follows a bottom-up strategy: building atomic components first, then composing them into larger sections, and finally integrating everything into the complete page. Each task includes specific requirements references and testing sub-tasks to ensure correctness.

## Tasks

- [x] 1. Set up pricing page structure and configuration
  - Create `/app/(default)/pricing/page.tsx` route file
  - Create `/lib/config/pricing.ts` for PRICING_CONFIG constant
  - Define TypeScript types for pricing data structures
  - Set up basic page layout with sections
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]* 1.1 Write unit tests for pricing configuration
  - Test that PRICING_CONFIG has all required plans
  - Test that all plans have required fields
  - Validate pricing data structure matches TypeScript types
  - _Requirements: 1.1, 3.1_

- [ ] 2. Implement BillingToggle component
  - [x] 2.1 Create BillingToggle component with monthly/yearly options
    - Create `/components/pricing/BillingToggle.tsx`
    - Implement toggle UI with "Monthly" and "Yearly (Save 20%)" options
    - Add "Cancel anytime" microcopy
    - Implement state management for selected billing period
    - Add smooth animation transition (200ms easeOut)
    - _Requirements: 2.1, 2.2, 2.5, 2.6_

  - [ ]* 2.2 Write property test for billing toggle
    - **Property 1: Billing Toggle Updates All Prices**
    - **Validates: Requirements 2.3, 2.4**
    - Test that changing billing period updates all displayed prices
    - Generate random billing period selections
    - Verify all plan cards reflect the selected period

  - [ ]* 2.3 Write unit tests for BillingToggle
    - Test default state is "monthly"
    - Test clicking yearly calls onChange with "yearly"
    - Test clicking monthly calls onChange with "monthly"
    - Test "Cancel anytime" text is displayed
    - _Requirements: 2.1, 2.2, 2.5_

- [ ] 3. Implement PlanCard component
  - [x] 3.1 Create PlanCard component structure
    - Create `/components/pricing/PlanCard.tsx`
    - Implement card layout with all required sections
    - Add recommended badge support
    - Implement responsive styling (16px radius, soft shadow)
    - Add hover elevation effect
    - _Requirements: 3.2, 3.4, 3.7, 3.8, 19.6, 19.7_

  - [x] 3.2 Implement price display logic
    - Add dynamic price rendering based on billing period
    - Format prices correctly ($X/user/mo)
    - Handle $0 for free plan
    - Handle "Custom" for enterprise
    - _Requirements: 4.1, 5.1, 5.2, 6.1, 6.2, 7.1_

  - [x] 3.3 Implement features list rendering
    - Render 5-7 features with checkmark icons
    - Style feature list items consistently
    - Add proper spacing and typography
    - _Requirements: 4.9, 5.10, 6.10_

  - [ ]* 3.4 Write property test for plan card element order
    - **Property 3: Plan Card Element Order**
    - **Validates: Requirements 3.7**
    - Test that elements appear in correct order for any plan
    - Generate random plan configurations
    - Verify order: name → price → best for → limits → CTA → features

  - [ ]* 3.5 Write property test for plan card hover
    - **Property 8: Plan Card Hover Elevation**
    - **Validates: Requirements 20.1**
    - Test that any plan card elevates on hover
    - Generate random plan cards
    - Verify shadow increases on hover

  - [ ]* 3.6 Write unit tests for PlanCard
    - Test Free plan renders with correct content
    - Test Pro plan renders with recommended badge
    - Test Team plan renders with correct content
    - Test price updates when billing period changes
    - Test CTA button click calls correct handler
    - _Requirements: 4.1-4.9, 5.1-5.10, 6.1-6.10_

- [ ] 4. Implement plan cards section
  - [x] 4.1 Create PlanCardsSection component
    - Create `/components/pricing/PlanCardsSection.tsx`
    - Render three PlanCards (Free, Pro, Team) in grid layout
    - Add EnterpriseStrip component below cards
    - Implement responsive layout (3-column desktop, stacked mobile)
    - Ensure Pro card has primary border and glow
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6_

  - [x] 4.2 Create EnterpriseStrip component
    - Create `/components/pricing/EnterpriseStrip.tsx`
    - Display Enterprise plan information
    - Add "Contact sales" CTA
    - Style as horizontal strip below plan cards
    - _Requirements: 3.6, 7.1-7.4_

  - [ ]* 4.3 Write property test for equal height cards
    - **Property 4: Plan Cards Equal Height**
    - **Validates: Requirements 3.9**
    - Test that all plan cards in a row have equal height
    - Generate random plan content with varying lengths
    - Verify heights are equal

  - [ ]* 4.4 Write unit tests for PlanCardsSection
    - Test exactly 4 pricing tiers are displayed
    - Test Pro card has recommended badge
    - Test cards are in 3-column layout on desktop
    - Test cards stack vertically on mobile with Pro first
    - Test Enterprise appears below plan cards
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6_

- [ ] 5. Checkpoint - Ensure plan cards render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement ValueStrip component
  - [x] 6.1 Create ValueStrip component
    - Create `/components/pricing/ValueStrip.tsx`
    - Display 4 value items in horizontal row
    - Add icons for each item
    - Implement responsive wrapping for mobile
    - Style with consistent spacing and typography
    - _Requirements: 8.1, 8.2, 22.4_

  - [ ]* 6.2 Write unit tests for ValueStrip
    - Test exactly 4 items are displayed
    - Test "Works with Gmail & Google Chat" appears
    - Test "AI extracts deadlines & owners" appears
    - Test "Queue review to prevent noise" appears
    - Test "Cancel anytime" appears
    - Test items wrap on mobile
    - _Requirements: 8.1-8.6, 22.4_

- [ ] 7. Implement CompareTable component
  - [x] 7.1 Create CompareTable component structure
    - Create `/components/pricing/CompareTable.tsx`
    - Implement table layout with sticky header
    - Create 5 feature groups (Capture & Sync, AI Extraction, Organization, Team & Admin, Security)
    - Add responsive accordion layout for mobile
    - _Requirements: 9.1-9.8_

  - [x] 7.2 Implement feature row rendering
    - Render check icons for boolean features
    - Render limit labels for limit-based features
    - Style rows with proper spacing and borders
    - Add hover effects for rows
    - _Requirements: 9.9, 9.10_

  - [x] 7.3 Populate compare table with all features
    - Add all Capture & Sync features
    - Add all AI Extraction features
    - Add all Organization features
    - Add all Team & Admin features
    - Add all Security features
    - _Requirements: 10.1-10.5, 11.1-11.5, 12.1-12.5, 13.1-13.4, 14.1-14.3_

  - [ ]* 7.4 Write property test for boolean feature rendering
    - **Property 5: Compare Table Boolean Features**
    - **Validates: Requirements 9.9**
    - Test that any boolean feature shows check icon when available
    - Generate random boolean features
    - Verify check icons appear correctly

  - [ ]* 7.5 Write property test for limit feature rendering
    - **Property 6: Compare Table Limit Features**
    - **Validates: Requirements 9.10**
    - Test that any limit-based feature shows limit text
    - Generate random limit features
    - Verify limit labels appear instead of check icons

  - [ ]* 7.6 Write unit tests for CompareTable
    - Test 5 feature groups are displayed
    - Test sticky header shows plan names
    - Test specific features appear in correct groups
    - Test table converts to accordion on mobile
    - Test check icons appear for boolean features
    - Test limit labels appear for limit features
    - _Requirements: 9.1-9.10, 10.1-14.3_

- [ ] 8. Implement AddOnsSection component
  - [x] 8.1 Create AddOnCard component
    - Create `/components/pricing/AddOnCard.tsx`
    - Display add-on name, description, and icon
    - Style as mini card with consistent design
    - _Requirements: 15.1_

  - [x] 8.2 Create AddOnsSection component
    - Create `/components/pricing/AddOnsSection.tsx`
    - Render 3 AddOnCards in grid layout
    - Implement responsive layout
    - _Requirements: 15.1-15.4_

  - [ ]* 8.3 Write unit tests for AddOnsSection
    - Test 3 add-on cards are displayed
    - Test "Extra AI extraction credits" appears
    - Test "Additional integrations" appears
    - Test "Extended history retention" appears
    - _Requirements: 15.1-15.4_

- [ ] 9. Implement FAQSection component
  - [x] 9.1 Create FAQItem component
    - Create `/components/pricing/FAQItem.tsx`
    - Implement accordion behavior (expand/collapse)
    - Add smooth height animation (300ms)
    - Add chevron icon rotation
    - _Requirements: 16.8, 16.9_

  - [x] 9.2 Create FAQSection component
    - Create `/components/pricing/FAQSection.tsx`
    - Render 6-8 FAQ items
    - Implement single-item-expanded logic
    - Style with proper spacing
    - _Requirements: 16.1_

  - [x] 9.3 Populate FAQ with all questions and answers
    - Add "What counts as an AI extraction?" FAQ
    - Add "Will it create duplicate tasks?" FAQ
    - Add "Can I stop sync anytime?" FAQ
    - Add "Does SpiderX post to my accounts?" FAQ
    - Add "How does billing work per seat?" FAQ
    - Add "Can I switch plans later?" FAQ
    - _Requirements: 16.2-16.7_

  - [ ]* 9.4 Write property test for FAQ accordion
    - **Property 7: FAQ Accordion Behavior**
    - **Validates: Requirements 16.8, 16.9**
    - Test that any FAQ item expands/collapses on click
    - Generate random FAQ items
    - Verify expand shows answer, collapse hides answer

  - [ ]* 9.5 Write unit tests for FAQSection
    - Test 6-8 questions are displayed
    - Test all required questions appear
    - Test clicking question expands answer
    - Test clicking expanded question collapses answer
    - Test only one item expanded at a time
    - _Requirements: 16.1-16.9_

- [ ] 10. Checkpoint - Ensure all sections render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement TrustSection component
  - [x] 11.1 Create TrustSection component
    - Create `/components/pricing/TrustSection.tsx`
    - Display 3 trust statements with icons
    - Style with lock, shield, and key icons
    - Implement consistent spacing and typography
    - _Requirements: 17.1-17.4_

  - [ ]* 11.2 Write unit tests for TrustSection
    - Test "Permissions-based access" appears with lock icon
    - Test "We never send messages without your action" appears
    - Test "Data encrypted in transit/at rest" appears
    - _Requirements: 17.1-17.4_

- [ ] 12. Implement FinalCTASection component
  - [x] 12.1 Create FinalCTASection component
    - Create `/components/pricing/FinalCTASection.tsx`
    - Display headline "Start capturing tasks in minutes"
    - Add primary "Start free" button
    - Add secondary "See integrations" button
    - Add microcopy: "No credit card for Free", "Cancel anytime", "Upgrade later"
    - _Requirements: 18.1-18.6_

  - [ ]* 12.2 Write property test for CTA loading state
    - **Property 9: CTA Button Loading State**
    - **Validates: Requirements 20.2**
    - Test that any CTA button shows loading state on click
    - Generate random CTA buttons
    - Verify loading state appears

  - [ ]* 12.3 Write unit tests for FinalCTASection
    - Test headline appears
    - Test "Start free" button appears
    - Test "See integrations" button appears
    - Test all microcopy appears
    - Test button clicks call correct handlers
    - _Requirements: 18.1-18.6_

- [ ] 13. Implement AnchorTabs component
  - [x] 13.1 Create AnchorTabs component
    - Create `/components/pricing/AnchorTabs.tsx`
    - Display tabs for Plans, Compare, FAQ, Security
    - Implement sticky positioning
    - Add scroll spy to highlight active section
    - Implement smooth scroll on tab click
    - _Requirements: 1.4, 1.5, 1.6_

  - [ ]* 13.2 Write property test for anchor navigation
    - **Property 2: Anchor Tab Navigation**
    - **Validates: Requirements 1.5**
    - Test that any anchor tab scrolls to correct section
    - Generate random anchor tabs
    - Verify scroll is triggered to target section

  - [ ]* 13.3 Write property test for smooth scroll
    - **Property 10: Anchor Tab Smooth Scroll**
    - **Validates: Requirements 20.5**
    - Test that any anchor navigation uses smooth scroll
    - Generate random anchor tabs
    - Verify smooth scroll behavior is applied

  - [ ]* 13.4 Write property test for sticky positioning
    - **Property 12: Sticky Anchor Tabs**
    - **Validates: Requirements 1.6**
    - Test that anchor tabs remain visible at any scroll position
    - Generate random scroll positions
    - Verify tabs remain at top of viewport

  - [ ]* 13.5 Write unit tests for AnchorTabs
    - Test 4 tabs are displayed (Plans, Compare, FAQ, Security)
    - Test tabs are sticky on scroll
    - Test clicking tab scrolls to section
    - Test active tab is highlighted based on scroll position
    - _Requirements: 1.4, 1.5, 1.6_

- [ ] 14. Implement AI Credits Tooltip
  - [x] 14.1 Add tooltip to AI credits text
    - Create `/components/pricing/Tooltip.tsx` component
    - Add tooltip to "AI credits: X/mo" text in plan cards
    - Display "1 credit = 1 task extracted/updated" on hover
    - Implement show/hide behavior with 300ms delay
    - _Requirements: 21.1, 21.2, 21.3, 21.4_

  - [ ]* 14.2 Write property test for tooltip behavior
    - **Property 11: AI Credits Tooltip Behavior**
    - **Validates: Requirements 21.1, 21.4**
    - Test that any AI credits text shows/hides tooltip on hover
    - Generate random AI credits elements
    - Verify tooltip appears on hover and disappears on hover end

  - [ ]* 14.3 Write unit tests for Tooltip
    - Test tooltip appears on hover
    - Test tooltip shows correct text
    - Test tooltip disappears when hover ends
    - _Requirements: 21.1, 21.2, 21.4_

- [ ] 15. Implement HeroSection for pricing page
  - [x] 15.1 Create PricingHeroSection component
    - Create `/components/pricing/PricingHeroSection.tsx`
    - Display title and subtitle
    - Add BillingToggle
    - Add optional product mockup image with callouts
    - Style with neutral background and subtle gradient
    - _Requirements: 1.2, 1.3, 23.1-23.5_

  - [ ]* 15.2 Write unit tests for PricingHeroSection
    - Test title appears
    - Test subtitle appears
    - Test BillingToggle is rendered
    - Test product mockup appears (if included)
    - Test callouts appear on mockup
    - _Requirements: 1.2, 1.3, 23.1-23.5_

- [ ] 16. Integrate all components into pricing page
  - [x] 16.1 Assemble complete pricing page
    - Import all section components into `/app/(default)/pricing/page.tsx`
    - Arrange sections in correct order: Hero → PlanCards → ValueStrip → CompareTable → AddOns → FAQ → Trust → FinalCTA
    - Add Header and Footer (reused from landing)
    - Implement page-level state management for billing period
    - Pass billing period to all relevant components
    - _Requirements: 1.1, 2.3, 2.4_

  - [x] 16.2 Implement responsive layout
    - Test and adjust mobile layouts for all sections
    - Ensure plan cards stack correctly on mobile
    - Verify compare table converts to accordion on mobile
    - Test value strip wrapping on mobile
    - Ensure anchor tabs are accessible on mobile
    - _Requirements: 3.5, 9.8, 22.1-22.5_

  - [x] 16.3 Apply visual design system
    - Apply color scheme: neutral base, electric blue primary, purple AI accents
    - Ensure consistent typography (line-height 1.4-1.6)
    - Apply 16px border radius to cards
    - Add soft shadows throughout
    - Style recommended card with primary border and glow
    - Use orange only for "Save 20%" highlight
    - _Requirements: 19.1-19.9_

  - [ ]* 16.4 Write integration tests for pricing page
    - Test full page renders without errors
    - Test all sections appear in correct order
    - Test billing toggle affects all plan cards
    - Test navigation between sections via anchor tabs
    - Test mobile responsive transformations
    - _Requirements: 1.1, 2.3, 2.4, 3.5, 9.8, 22.1-22.5_

- [ ] 17. Implement error handling
  - [x] 17.1 Add error handling for CTA clicks
    - Implement loading state on CTA buttons
    - Add error toast for navigation failures
    - Implement retry logic
    - Log errors to monitoring service
    - _Requirements: 20.2_

  - [x] 17.2 Add error handling for missing data
    - Validate PRICING_CONFIG at build time
    - Add fallback UI for missing data
    - Provide contact sales link as fallback
    - _Requirements: 3.1, 4.1-4.9, 5.1-5.10, 6.1-6.10_

  - [x] 17.3 Add reduced motion support
    - Respect prefers-reduced-motion media query
    - Disable animations for users with motion sensitivity
    - Provide instant state changes as fallback
    - _Requirements: 2.6, 16.8_

  - [ ]* 17.4 Write unit tests for error handling
    - Test CTA loading state appears
    - Test error toast appears on failure
    - Test fallback UI for missing data
    - Test reduced motion disables animations

- [ ] 18. Final checkpoint - Complete testing and polish
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Accessibility improvements
  - [x] 19.1 Add ARIA labels and roles
    - Add proper ARIA labels to interactive elements
    - Add role="tablist" to anchor tabs
    - Add aria-expanded to FAQ items
    - Add aria-label to icon-only buttons
    - _Requirements: 1.4, 16.8_

  - [x] 19.2 Ensure keyboard navigation
    - Test tab navigation through all interactive elements
    - Add focus indicators to all focusable elements
    - Ensure anchor tabs are keyboard accessible
    - Ensure FAQ items can be toggled with keyboard
    - _Requirements: 1.5, 16.8_

  - [x] 19.3 Verify color contrast
    - Check all text meets WCAG AA contrast ratios
    - Verify button text is readable
    - Ensure disabled states are distinguishable
    - _Requirements: 19.1-19.9_

  - [ ]* 19.4 Run automated accessibility tests
    - Run axe-core on rendered page
    - Fix any accessibility violations
    - Verify heading hierarchy
    - Test with screen reader

- [ ] 20. Performance optimization
  - [x] 20.1 Optimize images and assets
    - Compress product mockup image
    - Use next/image for optimized loading
    - Lazy load images below the fold
    - _Requirements: 23.1_

  - [x] 20.2 Optimize animations
    - Use CSS transforms for animations (GPU-accelerated)
    - Minimize JavaScript animation overhead
    - Test animation performance on low-end devices
    - _Requirements: 2.6, 16.8, 20.1_

  - [x] 20.3 Implement code splitting
    - Split non-critical components
    - Lazy load FAQ and compare table sections
    - Minimize initial JavaScript bundle size

  - [ ]* 20.4 Measure and validate performance
    - Measure FCP, LCP, TTI, CLS metrics
    - Ensure FCP < 1.5s, LCP < 2.5s, TTI < 3.5s, CLS < 0.1
    - Test on various devices and network conditions

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Integration tests ensure components work together correctly
- The implementation follows a bottom-up approach: atoms → molecules → organisms → page
