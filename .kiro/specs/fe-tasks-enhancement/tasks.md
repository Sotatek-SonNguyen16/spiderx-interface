# Implementation Plan

- [x] 1. Setup and Core Infrastructure

  - [x] 1.1 Add fast-check dependency for property-based testing


    - Run `pnpm add -D fast-check`


    - _Requirements: Testing Strategy_


  - [x] 1.2 Create sync state types and interfaces

    - Create `features/todos/types/sync.ts` with SyncState, SyncResult interfaces


    - _Requirements: 1.1, 1.4_
  - [ ] 1.3 Extend TodoItem type with assignee and source fields
    - Update `features/todos/types/index.ts` to include assignee_id, assignee_name, source_space_name
    - _Requirements: 3.1, 4.1_





- [ ] 2. Sync Todo Feature
  - [ ] 2.1 Create useSyncTodo hook
    - Implement hook in `features/todos/hooks/useSyncTodo.ts`


    - Manage sync state: lastSyncAt, isSyncing, syncProgress, syncError
    - Implement syncTodos function that calls generate-todos API
    - Store lastSyncAt in localStorage for persistence
    - _Requirements: 1.1, 1.6_


  - [x] 2.2 Write property test for sync timestamp persistence


    - **Property 3: Sync Timestamp Persistence**


    - **Validates: Requirements 1.6**

  - [x] 2.3 Create TimeRangePicker component


    - Create `features/todos/components/TimeRangePicker.tsx`
    - Implement modal with start/end date inputs
    - Add validation (end date must be after start date)


    - _Requirements: 1.2_
  - [ ] 2.4 Create SyncTodoButton component
    - Create `features/todos/components/SyncTodoButton.tsx`
    - Implement button with dropdown for "Sync Now" and "Custom Range"


    - Show loading state during sync

    - Display result summary on completion
    - _Requirements: 1.1, 1.3, 1.4, 1.5_


  - [ ] 2.5 Write property test for sync result display
    - **Property 2: Sync Result Display Accuracy**
    - **Validates: Requirements 1.4**

  - [ ] 2.6 Integrate SyncTodoButton into TodoList
    - Update `features/todos/components/TodoList.tsx` to include SyncTodoButton

    - _Requirements: 1.1_


- [x] 3. Checkpoint - Sync Feature Complete


  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Todo Detail Screen
  - [x] 4.1 Create useTodoDetail hook


    - Create `features/todos/hooks/useTodoDetail.ts`


    - Implement fetchTodo, updateTodo functions
    - Manage editing state

    - _Requirements: 2.1, 2.4_


  - [ ] 4.2 Create TodoDetail component
    - Create `features/todos/components/TodoDetail.tsx`
    - Display all todo fields: title, description, status, priority, due_date, tags, timestamps


    - Implement inline editing for editable fields
    - Display subtasks list with status

    - _Requirements: 2.2, 2.3_

  - [-] 4.3 Write property test for todo detail field completeness

    - **Property 4: Todo Detail Field Completeness**

    - **Validates: Requirements 2.2**

  - [x] 4.4 Write property test for subtask display


    - **Property 5: Subtask Display Completeness**
    - **Validates: Requirements 2.3**
  - [x] 4.5 Create Todo Detail page


    - Create `app/(auth)/todos/[todo_id]/page.tsx`
    - Implement navigation from TodoList
    - Add back button with filter state preservation
    - _Requirements: 2.1, 2.6_
  - [ ] 4.6 Write property test for edit persistence
    - **Property 6: Todo Edit Persistence**


    - **Validates: Requirements 2.4**



- [x] 5. Checkpoint - Todo Detail Complete

  - Ensure all tests pass, ask the user if questions arise.



- [ ] 6. Chat Thread Name and Link Display
  - [x] 6.1 Create SourceLink component

    - Create `features/todos/components/SourceLink.tsx`

    - Display space name with Google Chat icon

    - Generate link to Google Chat thread



    - Handle fallback when space name unavailable
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ] 6.2 Write property test for source space display
    - **Property 7: Source Space Display**
    - **Validates: Requirements 2.5, 3.1, 3.3**
  - [ ] 6.3 Integrate SourceLink into TodoItem and TodoDetail
    - Update `features/todos/components/TodoItem.tsx`
    - Update `features/todos/components/TodoDetail.tsx`
    - _Requirements: 3.1_

- [ ] 7. Assignee Display
  - [ ] 7.1 Create AssigneeDisplay component
    - Create `features/todos/components/AssigneeDisplay.tsx`
    - Display assignee name/avatar or "Unassigned" indicator
    - Implement truncation with tooltip for long names
    - _Requirements: 4.1, 4.2, 4.4_
  - [ ] 7.2 Write property test for assignee display logic
    - **Property 8: Assignee Display Logic**
    - **Validates: Requirements 4.1, 4.2**
  - [ ] 7.3 Write property test for assignee name truncation
    - **Property 9: Assignee Name Truncation**
    - **Validates: Requirements 4.4**
  - [ ] 7.4 Integrate AssigneeDisplay into TodoItem
    - Update `features/todos/components/TodoItem.tsx`
    - _Requirements: 4.1, 4.3_

- [ ] 8. Checkpoint - Display Features Complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. AI-Powered Subtask Generation
  - [ ] 9.1 Create useSubtaskGenerator hook
    - Create `features/todos/hooks/useSubtaskGenerator.ts`
    - Implement generateSubtasks function calling AI endpoint
    - Manage preview state and selection
    - _Requirements: 5.1, 5.2_
  - [ ] 9.2 Create SubtaskGenerator component
    - Create `features/todos/components/SubtaskGenerator.tsx`
    - Implement "Generate Subtasks" button
    - Display preview list with checkboxes for selection
    - Allow editing subtask titles before save
    - Show loading state during generation
    - Handle errors with fallback to manual creation
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  - [ ] 9.3 Write property test for AI subtask preview
    - **Property 10: AI Subtask Preview**
    - **Validates: Requirements 5.2**
  - [ ] 9.4 Integrate SubtaskGenerator into TodoDetail
    - Update `features/todos/components/TodoDetail.tsx`
    - _Requirements: 5.1_

- [ ] 10. Checkpoint - AI Feature Complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Whitelist UI Optimization
  - [ ] 11.1 Create SpaceSearch component
    - Create `features/googleChat/components/SpaceSearch.tsx`
    - Implement search input with debounce
    - _Requirements: 6.1, 6.2_
  - [ ] 11.2 Update useGoogleChat hook with search
    - Add searchQuery state and filterSpaces function
    - Implement real-time filtering
    - _Requirements: 6.2_
  - [ ] 11.3 Write property test for space search filtering
    - **Property 11: Space Search Filtering**
    - **Validates: Requirements 6.2**
  - [ ] 11.4 Optimize SpaceList component
    - Update `features/googleChat/components/SpaceList.tsx`
    - Add skeleton loaders for loading state
    - Implement optimistic UI updates for toggle
    - Add success confirmation toast
    - _Requirements: 6.1, 6.3, 6.4, 6.5_
  - [ ] 11.5 Add pagination/virtual scrolling for large lists
    - Implement virtual scrolling using react-window or similar
    - _Requirements: 6.6_
  - [ ] 11.6 Update Whitelist page
    - Update `app/(auth)/whitelist/page.tsx`
    - Integrate SpaceSearch component
    - _Requirements: 6.1_

- [ ] 12. Final Checkpoint - All Features Complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Export and Integration
  - [ ] 13.1 Update feature exports
    - Update `features/todos/index.ts` with new components and hooks
    - Update `features/googleChat/index.ts` with new components
    - _Requirements: All_
  - [ ] 13.2 Write integration tests
    - Test full sync flow
    - Test todo detail navigation and editing
    - Test whitelist management flow
    - _Requirements: All_
