# Requirements Document

## Introduction

This specification defines the enhancement of the Swipe Queue feature to transform it from a basic swipe interface into a premium "Decision Mode" experience. The Queue is designed as a decision inbox where users quickly review AI-detected tasks before adding them to their todo list. The design philosophy emphasizes low cognitive load, clear visual feedback, and premium-feeling animations.

## Glossary

- **Queue**: A decision inbox for reviewing AI-detected tasks before adding to the todo list
- **Swipe_Card**: The primary interactive element displaying task information in a card format
- **Card_Stack**: Visual representation of multiple cards stacked with depth effect
- **Commit_Distance**: The threshold distance a card must be dragged to trigger an action
- **Flick_Velocity**: The speed threshold for quick swipe gestures
- **Snap_Back**: Animation returning a card to its original position when threshold is not met
- **Accept_Action**: Swiping right to add a task to the todo list
- **Skip_Action**: Swiping left to dismiss/archive a task
- **Overlay**: Visual feedback layer showing action intent during swipe
- **Toast**: Temporary notification message with optional undo action

## Requirements

### Requirement 1: Card Stack Visual Design

**User Story:** As a user, I want to see tasks displayed as a stack of cards, so that I understand there are more tasks to review and feel engaged with the decision process.

#### Acceptance Criteria

1. THE Swipe_Card SHALL have a border-radius of 16-20px to create a card-like appearance
2. THE Card_Stack SHALL display up to 3 visible cards with depth effect
3. WHEN displaying the second card, THE Card_Stack SHALL apply scale of 0.96 and translateY of 12px with opacity 0.9
4. WHEN displaying the third card, THE Card_Stack SHALL apply scale of 0.92 and translateY of 24px with optional blur
5. THE active Swipe_Card SHALL have a shadow of "0 12px 24px rgba(0,0,0,0.08)"
6. THE Swipe_Card height SHALL be 65-70vh on desktop devices

### Requirement 2: Card Content Layout

**User Story:** As a user, I want to see only essential task information, so that I can make quick decisions without cognitive overload.

#### Acceptance Criteria

1. THE Swipe_Card SHALL display content in this order: AI badge, task title, meta row, source preview, action hint
2. THE AI_Badge SHALL display "✨ AI detected task" with source information using 12-13px font
3. THE Task_Title SHALL use 18px semibold font with maximum 2 lines
4. THE Meta_Row SHALL display assignee, due date, and priority in a single line with icons
5. THE Source_Preview SHALL show maximum 2 lines of context with neutral-50 background and 12px border-radius
6. THE Action_Hint SHALL display "← Skip" and "Accept →" at the bottom of the card without button styling
7. THE Swipe_Card SHALL NOT display checkbox elements (Queue is not Todo)

### Requirement 3: Swipe Gesture Recognition

**User Story:** As a user, I want my swipe gestures to feel natural and responsive, so that the interaction feels premium and intuitive.

#### Acceptance Criteria

1. WHEN dragging a card, THE Swipe_Card SHALL follow the pointer position with 1:1 mapping on the x-axis
2. WHEN dragging a card, THE Swipe_Card SHALL rotate with formula: rotate = clamp(dragX / 20, -8deg, +8deg)
3. THE Commit_Distance SHALL be calculated as min(0.28 * cardWidth, 160px)
4. WHEN the drag distance exceeds Commit_Distance, THE System SHALL trigger the corresponding action
5. WHEN Flick_Velocity exceeds 900px/s AND drag distance exceeds 0.12 * cardWidth, THE System SHALL trigger commit immediately
6. WHEN drag distance is below Commit_Distance AND velocity is below threshold, THE Swipe_Card SHALL snap back to original position

### Requirement 4: Accept Action (Swipe Right)

**User Story:** As a user, I want to swipe right to accept a task, so that it gets added to my todo list with clear visual confirmation.

#### Acceptance Criteria

1. WHEN swiping right, THE Overlay SHALL display with success-soft color (green soft)
2. WHEN swiping right, THE Overlay SHALL show a checkmark icon with "Accept" text
3. THE Overlay opacity SHALL increase based on progress: easeOut(clamp(|dragX| / commitDistance, 0, 1))
4. WHEN accept is committed, THE System SHALL add the task to the todo list
5. WHEN accept is committed, THE Toast SHALL display "Task added to your list"

### Requirement 5: Skip Action (Swipe Left)

**User Story:** As a user, I want to swipe left to skip a task, so that I can dismiss it without stress or feeling like I made an error.

#### Acceptance Criteria

1. WHEN swiping left, THE Overlay SHALL display with danger-soft color (red soft or gray)
2. WHEN swiping left, THE Overlay SHALL show an X icon with "Skip" text
3. WHEN skip is committed, THE System SHALL archive/dismiss the task
4. WHEN skip is committed, THE Toast SHALL display "Task skipped. You can find it later in Trash."
5. THE Skip_Action SHALL NOT use harsh red colors to avoid stress

### Requirement 6: Animation Timing and Easing

**User Story:** As a user, I want animations to feel smooth and premium, so that the experience feels polished and professional.

#### Acceptance Criteria

1. WHEN snapping back, THE Swipe_Card SHALL animate over 200ms with easing cubic-bezier(0.22, 1, 0.36, 1)
2. WHEN committing an action, THE Swipe_Card SHALL animate out over 260ms with easing cubic-bezier(0.55, 0.06, 0.68, 0.19)
3. WHEN revealing the next card, THE Card_Stack SHALL animate with 80ms delay and 240ms duration using cubic-bezier(0.22, 1, 0.36, 1)
4. WHEN the card crosses the commit threshold, THE Overlay icon SHALL "pop" with scale 1.0→1.06 over 80ms
5. THE commit animation SHALL move the card to position: x = sign(dragX) * (cardWidth + 120px)
6. THE commit animation SHALL fade opacity from 1 to 0.85 (not fully transparent)

### Requirement 7: Undo Functionality

**User Story:** As a user, I want to undo my last swipe action, so that I can recover from mistakes without losing tasks.

#### Acceptance Criteria

1. WHEN an action is committed, THE Toast SHALL appear after 120ms with an Undo option
2. THE Toast SHALL auto-dismiss after 5 seconds
3. WHEN Undo is triggered, THE Swipe_Card SHALL animate back to the stack over 260-320ms with easeOutBack easing
4. WHEN Undo is triggered, THE System SHALL restore the task to its previous state
5. THE easeOutBack curve SHALL be cubic-bezier(0.34, 1.56, 0.64, 1) with subtle bounce

### Requirement 8: Empty and Completion States

**User Story:** As a user, I want clear feedback when I've reviewed all tasks, so that I feel accomplished and know what to do next.

#### Acceptance Criteria

1. WHEN the Queue is empty, THE System SHALL display "🎉 You're all caught up" message
2. WHEN the Queue is empty, THE System SHALL display "No tasks waiting for review" subtext
3. WHEN the Queue is empty, THE System SHALL provide a "Back to Todo" CTA button
4. WHEN all tasks are reviewed, THE System SHALL display a completion summary with accept/skip counts

### Requirement 9: Accessibility and Motion Preferences

**User Story:** As a user with motion sensitivity, I want reduced animations, so that I can use the feature comfortably.

#### Acceptance Criteria

1. WHEN prefers-reduced-motion is enabled, THE System SHALL disable card rotation
2. WHEN prefers-reduced-motion is enabled, THE System SHALL reduce animation durations to 120-160ms
3. WHEN prefers-reduced-motion is enabled, THE System SHALL not use bounce/back easing curves
4. THE Swipe_Card SHALL support keyboard navigation for accessibility

### Requirement 10: Queue Header

**User Story:** As a user, I want a clear but minimal header, so that I understand the context without visual clutter.

#### Acceptance Criteria

1. THE Queue_Header SHALL display "Review Queue" as the title
2. THE Queue_Header SHALL display "Swipe to accept or skip tasks" as subtext
3. THE Queue_Header title SHALL use 16-18px font size
4. THE Queue_Header SHALL NOT include heavy backgrounds or additional CTAs
