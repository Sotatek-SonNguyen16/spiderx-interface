# Implementation Plan: Swipe Queue Enhancement

## Overview

This implementation transforms the existing SwipeCard and SwipeView components into a premium "Decision Mode" experience with card stack visuals, refined gesture handling, and polished animations. The implementation uses TypeScript/React with the existing Next.js codebase.

## Tasks

- [x] 1. Create animation and gesture configuration
  - [x] 1.1 Create animation config constants file
    - Define AnimationConfig with snapBack, commitOut, nextLift, undo, iconPop timings
    - Define ReducedMotionConfig with simplified values
    - Define GestureConfig with thresholds and formulas
    - Export easing curve constants as CSS cubic-bezier strings
    - _Requirements: 3.3, 6.1, 6.2, 6.3, 6.5, 7.5_

  - [x] 1.2 Create gesture calculation utilities
    - Implement calculateCommitDistance(cardWidth: number): number
    - Implement calculateRotation(dragX: number): number
    - Implement calculateOverlayProgress(dragX: number, commitDistance: number): number
    - Implement shouldCommit(dragX: number, velocityX: number, cardWidth: number): boolean
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 4.3_

  - [ ]* 1.3 Write property tests for gesture calculations
    - **Property 4: Rotation formula correctness**
    - **Property 5: Overlay opacity formula**
    - **Property 6: Commit distance calculation**
    - **Property 7: Swipe commit logic**
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.5, 4.3**

- [x] 2. Refactor CardContent component
  - [x] 2.1 Create AIBadge component
    - Display sparkle icon with "AI detected task" text
    - Show source information (e.g., "From Google Chat")
    - Use 12-13px font, --color-ai-soft styling
    - _Requirements: 2.2_

  - [x] 2.2 Create MetaRow component
    - Display assignee with avatar/initial, due date with calendar icon, priority with indicator
    - Single line layout with icon + text pairs
    - Use text-secondary color
    - _Requirements: 2.4_

  - [x] 2.3 Create SourcePreview component
    - Display max 2 lines of source context
    - Use neutral-50 background with 12px border-radius
    - Truncate with ellipsis
    - _Requirements: 2.5_

  - [x] 2.4 Create ActionHint component
    - Display "← Skip" on left, "Accept →" on right
    - No button styling, neutral color
    - Position at bottom of card
    - _Requirements: 2.6_

  - [x] 2.5 Refactor SwipeCard content layout
    - Arrange components in order: AIBadge, TaskTitle, MetaRow, SourcePreview, ActionHint
    - Remove checkbox elements
    - Apply 18px semibold font to title with 2-line max
    - _Requirements: 2.1, 2.3, 2.7_

  - [ ]* 2.6 Write property test for no checkbox constraint
    - **Property 2: No checkbox in queue cards**
    - **Validates: Requirements 2.7**

- [x] 3. Checkpoint - Verify card content components
  - Ensure all card content components render correctly
  - Verify no checkbox elements in queue cards
  - Ask the user if questions arise

- [x] 4. Implement CardStack with depth effect
  - [x] 4.1 Create CardStack component
    - Render up to 3 visible cards from queue
    - Apply position styles based on card index (active, peek, blur)
    - Manage activeIndex state
    - _Requirements: 1.2, 1.3, 1.4_

  - [x] 4.2 Implement card depth styling
    - Active card: scale 1.0, translateY 0, opacity 1.0, z-index 30
    - Peek card: scale 0.96, translateY 12px, opacity 0.9, z-index 20
    - Blur card: scale 0.92, translateY 24px, optional blur, z-index 10
    - Apply shadow "0 12px 24px rgba(0,0,0,0.08)" to active card
    - _Requirements: 1.3, 1.4, 1.5_

  - [x] 4.3 Apply card visual styling
    - Set border-radius to 16-20px
    - Set card height to 65-70vh on desktop
    - Use --color-surface background
    - _Requirements: 1.1, 1.6_

  - [ ]* 4.4 Write property test for card stack visibility
    - **Property 1: Card stack visibility limit**
    - **Validates: Requirements 1.2**

- [x] 5. Implement enhanced gesture handling
  - [x] 5.1 Create useSwipeGesture hook
    - Track drag start position, current position, and velocity
    - Calculate velocity using time delta between frames
    - Support both mouse and touch events
    - _Requirements: 3.1_

  - [x] 5.2 Implement drag transform logic
    - Apply 1:1 x-axis mapping for translateX
    - Apply rotation formula: clamp(dragX / 20, -8, 8)
    - Reduce y-axis movement (optional elastic feel)
    - _Requirements: 3.1, 3.2_

  - [x] 5.3 Implement commit detection
    - Check distance threshold: |dragX| >= commitDistance
    - Check velocity threshold: |velocityX| > 900 AND |dragX| >= 0.12 * cardWidth
    - Trigger action or snap back based on thresholds
    - _Requirements: 3.4, 3.5, 3.6_

  - [ ]* 5.4 Write property test for drag position mapping
    - **Property 3: Drag position 1:1 mapping**
    - **Validates: Requirements 3.1**

- [x] 6. Implement ActionOverlay component
  - [x] 6.1 Create ActionOverlay component
    - Display accept overlay (green-soft) for right swipe
    - Display skip overlay (red-soft/gray) for left swipe
    - Show icon (checkmark/X) with text (Accept/Skip)
    - _Requirements: 4.1, 4.2, 5.1, 5.2_

  - [x] 6.2 Implement overlay opacity animation
    - Calculate progress: easeOut(clamp(|dragX| / commitDistance, 0, 1))
    - Apply opacity based on progress
    - Scale icon slightly: 0.96 + 0.04 * progress
    - _Requirements: 4.3_

  - [x] 6.3 Implement threshold feedback
    - Add icon "pop" effect (scale 1.0→1.06) when crossing threshold
    - Add subtle border glow (opacity 0→0.25)
    - Duration: 80ms with easeOut
    - _Requirements: 6.4_

- [x] 7. Checkpoint - Verify gesture and overlay
  - Test swipe gestures work correctly
  - Verify overlay appears with correct colors
  - Verify threshold feedback animations
  - Ask the user if questions arise

- [x] 8. Implement animations
  - [x] 8.1 Implement snap back animation
    - Duration: 200ms
    - Easing: cubic-bezier(0.22, 1, 0.36, 1)
    - Return card to x=0, rotation=0, overlay opacity=0
    - _Requirements: 6.1_

  - [x] 8.2 Implement commit out animation
    - Duration: 260ms
    - Easing: cubic-bezier(0.55, 0.06, 0.68, 0.19)
    - Move to: x = sign(dragX) * (cardWidth + 120px)
    - Fade opacity: 1 → 0.85
    - _Requirements: 6.2, 6.5, 6.6_

  - [x] 8.3 Implement next card lift animation
    - Delay: 80ms after commit starts
    - Duration: 240ms
    - Easing: cubic-bezier(0.22, 1, 0.36, 1)
    - Scale: 0.96 → 1.0, translateY: 12px → 0
    - _Requirements: 6.3_

  - [x] 8.4 Implement reduced motion support
    - Check prefers-reduced-motion media query
    - Disable rotation when enabled
    - Reduce durations to 120-160ms
    - Use simple ease-out instead of bounce curves
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 9. Implement state management and actions
  - [x] 9.1 Create swipe queue store
    - Manage queue array, history stack, currentIndex
    - Implement acceptTask(taskId) action
    - Implement skipTask(taskId) action
    - Implement undoLastAction() action
    - _Requirements: 4.4, 5.3, 7.4_

  - [x] 9.2 Implement accept action
    - Add task to todo list
    - Push action to history stack
    - Advance currentIndex
    - Show toast: "Task added to your list"
    - _Requirements: 4.4, 4.5_

  - [x] 9.3 Implement skip action
    - Archive/dismiss task from queue
    - Push action to history stack
    - Advance currentIndex
    - Show toast: "Task skipped. You can find it later in Trash."
    - _Requirements: 5.3, 5.4_

  - [ ]* 9.4 Write property test for action state changes
    - **Property 8: Action state changes**
    - **Validates: Requirements 4.4, 5.3**

- [ ] 10. Implement undo functionality
  - [x] 10.1 Create Toast component with undo
    - Display message with Undo button
    - Appear after 120ms delay
    - Auto-dismiss after 5 seconds
    - _Requirements: 7.1, 7.2_

  - [x] 10.2 Implement undo animation
    - Duration: 260-320ms
    - Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (easeOutBack)
    - Animate card back into stack position
    - _Requirements: 7.3, 7.5_

  - [x] 10.3 Implement undo state restoration
    - Pop last action from history
    - Restore task to previous queue position
    - Decrement currentIndex
    - _Requirements: 7.4_

  - [ ]* 10.4 Write property test for undo round-trip
    - **Property 9: Undo round-trip**
    - **Validates: Requirements 7.4**

- [x] 11. Implement empty and completion states
  - [x] 11.1 Create EmptyQueueState component
    - Display "🎉 You're all caught up" message
    - Display "No tasks waiting for review" subtext
    - Include "Back to Todo" CTA button
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 11.2 Create CompletionSummary component
    - Display count of accepted tasks
    - Display count of skipped tasks
    - Show after all tasks reviewed
    - _Requirements: 8.4_

  - [ ]* 11.3 Write property test for completion summary
    - **Property 10: Completion summary accuracy**
    - **Validates: Requirements 8.4**

- [x] 12. Implement QueueHeader component
  - [x] 12.1 Create QueueHeader component
    - Display "Review Queue" title (16-18px)
    - Display "Swipe to accept or skip tasks" subtext
    - Minimal styling, no heavy backgrounds
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 13. Implement accessibility features
  - [x] 13.1 Add keyboard navigation
    - Arrow left/right to simulate swipe
    - Enter to accept, Escape to skip
    - Tab navigation between cards
    - _Requirements: 9.4_

  - [x] 13.2 Add ARIA attributes
    - role="listbox" for card stack
    - aria-label for action hints
    - aria-live for toast announcements
    - _Requirements: 9.4_

- [x] 14. Integration and wiring
  - [x] 14.1 Update SwipeView to use new components
    - Replace existing SwipeCard with enhanced version
    - Integrate CardStack component
    - Wire up gesture handling and animations
    - Connect to swipe queue store
    - _Requirements: All_

  - [x] 14.2 Update page integration
    - Ensure SwipeView works in todos page context
    - Verify data flow from API to queue
    - Test end-to-end swipe flow
    - _Requirements: All_

- [x] 15. Final checkpoint - Complete integration testing
  - Verify all animations feel premium
  - Test on various screen sizes
  - Verify accessibility features work
  - Ensure all tests pass
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Use fast-check for property-based testing
