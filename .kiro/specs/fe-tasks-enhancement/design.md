# Design Document: FE Tasks Enhancement

## Overview

This design document outlines the implementation of six frontend enhancements for the SpiderX application:
1. Sync Todo from Google Chat with time range selection
2. Todo Detail Screen
3. Chat Thread Name and Link Display
4. Assignee Display in Todo Items
5. AI-Powered Subtask Generation
6. Whitelist UI Optimization

The implementation follows the existing feature-based architecture using Next.js App Router, Zustand for state management, and the established API client pattern.

---

## Architecture

### Component Hierarchy

```
app/(auth)/
├── todos/
│   ├── page.tsx                    # Todo list (existing)
│   └── [todo_id]/
│       └── page.tsx                # NEW: Todo detail page
├── whitelist/
│   └── page.tsx                    # Whitelist management (optimize)
└── sync/
    └── page.tsx                    # NEW: Sync management page

features/
├── todos/
│   ├── components/
│   │   ├── TodoList.tsx            # UPDATE: Add sync button
│   │   ├── TodoItem.tsx            # UPDATE: Add assignee, source link
│   │   ├── TodoDetail.tsx          # NEW: Detail view component
│   │   ├── SyncTodoButton.tsx      # NEW: Sync button with modal
│   │   ├── TimeRangePicker.tsx     # NEW: Date range picker modal
│   │   └── SubtaskGenerator.tsx    # NEW: AI subtask generation
│   ├── hooks/
│   │   ├── useTodos.ts             # UPDATE: Add sync functionality
│   │   ├── useTodoDetail.ts        # NEW: Single todo operations
│   │   └── useSyncTodo.ts          # NEW: Sync state management
│   └── stores/
│       └── todo.store.ts           # UPDATE: Add sync state
├── googleChat/
│   ├── components/
│   │   ├── SpaceList.tsx           # UPDATE: Optimize UI
│   │   └── SpaceSearch.tsx         # NEW: Search component
│   └── hooks/
│       └── useGoogleChat.ts        # UPDATE: Add search
```

### Data Flow

```
┌─────────────────┐
│   Sync Button   │
└────────┬────────┘
         │ click
         ▼
┌─────────────────┐
│ TimeRangePicker │ (optional)
└────────┬────────┘
         │ confirm
         ▼
┌─────────────────┐
│  useSyncTodo    │ ◄─── Hook manages sync state
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   todoService   │ ◄─── Calls API
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Backend API     │
│ /generate-todos │
└─────────────────┘
```

---

## Components and Interfaces

### 1. SyncTodoButton Component

```typescript
interface SyncTodoButtonProps {
  onSyncComplete?: (result: SyncResult) => void;
  className?: string;
}

interface SyncResult {
  totalMessagesProcessed: number;
  totalTodosGenerated: number;
  totalTodosSaved: number;
  summary: string;
}
```

### 2. TimeRangePicker Component

```typescript
interface TimeRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
  defaultStartDate?: Date;
  defaultEndDate?: Date;
}
```

### 3. TodoDetail Component

```typescript
interface TodoDetailProps {
  todoId: string;
}

interface TodoDetailState {
  todo: TodoItem | null;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
}
```

### 4. SubtaskGenerator Component

```typescript
interface SubtaskGeneratorProps {
  todoId: string;
  todoTitle: string;
  todoDescription?: string;
  onSubtasksGenerated: (subtasks: Subtask[]) => void;
}

interface GeneratedSubtask {
  title: string;
  order: number;
  isSelected: boolean;
}
```

### 5. SpaceSearch Component

```typescript
interface SpaceSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}
```

---

## Data Models

### Extended TodoItem (with source info)

```typescript
interface TodoItem {
  todo_id: string;
  user_id: string;
  context_id: string | null;
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority;
  due_date: string | null;
  estimated_time: number | null;
  actual_time: number | null;
  source_type: SourceType;
  source_id: string | null;
  source_space_id: string | null;
  source_message_id: string | null;
  source_space_name?: string;      // Populated from space lookup
  assignee_id?: string | null;     // NEW: Assignee user ID
  assignee_name?: string | null;   // NEW: Assignee display name
  tags: string[];
  eisenhower: EisenhowerMatrix | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  subtasks: Subtask[];
}
```

### SyncState

```typescript
interface SyncState {
  lastSyncAt: string | null;
  isSyncing: boolean;
  syncProgress: number;
  syncError: string | null;
  lastSyncResult: SyncResult | null;
}
```

### SpaceWithSearch

```typescript
interface SpaceListState {
  spaces: Space[];
  filteredSpaces: Space[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Sync API Call Parameters
*For any* sync operation with a time range, the API call SHALL include start_date and end_date parameters matching the user's selection or the default range (last sync to now).
**Validates: Requirements 1.1, 1.2**

### Property 2: Sync Result Display Accuracy
*For any* successful sync response, the displayed summary SHALL show the exact values returned by the API for messages processed and todos extracted.
**Validates: Requirements 1.4**

### Property 3: Sync Timestamp Persistence
*For any* successful sync operation, the sync timestamp stored in state SHALL equal the timestamp of when the sync completed.
**Validates: Requirements 1.6**

### Property 4: Todo Detail Field Completeness
*For any* todo item displayed in the detail view, all non-null fields (title, description, status, priority, due_date, tags, created_at, updated_at) SHALL be rendered in the UI.
**Validates: Requirements 2.2**

### Property 5: Subtask Display Completeness
*For any* todo with subtasks, the detail view SHALL render all subtasks with their respective status values.
**Validates: Requirements 2.3**

### Property 6: Todo Edit Persistence
*For any* field edit in the todo detail view, after save, the displayed value SHALL match the saved value returned by the API.
**Validates: Requirements 2.4**

### Property 7: Source Space Display
*For any* todo with source_space_id, the rendered component SHALL display the space name (or fallback text if name unavailable).
**Validates: Requirements 2.5, 3.1, 3.3**

### Property 8: Assignee Display Logic
*For any* todo, if assignee_name exists, it SHALL be displayed; if not, an "Unassigned" indicator or empty state SHALL be shown.
**Validates: Requirements 4.1, 4.2**

### Property 9: Assignee Name Truncation
*For any* assignee name longer than the display limit, the rendered text SHALL be truncated with ellipsis and the full name SHALL be available via tooltip.
**Validates: Requirements 4.4**

### Property 10: AI Subtask Preview
*For any* AI-generated subtask list, all items SHALL be displayed in a preview state before any are saved to the database.
**Validates: Requirements 5.2**

### Property 11: Space Search Filtering
*For any* search query in the whitelist page, the displayed spaces SHALL only include those whose name contains the search query (case-insensitive).
**Validates: Requirements 6.2**

---

## Error Handling

### Sync Errors
- Network timeout: Display "Connection timeout. Please check your network and try again."
- API error (4xx/5xx): Display error message from API response
- No whitelisted spaces: Display "Please whitelist at least one space before syncing."

### Todo Detail Errors
- Todo not found (404): Redirect to todo list with error toast
- Permission denied (403): Display "You don't have permission to view this todo."
- Edit conflict: Display "This todo was modified. Please refresh and try again."

### AI Generation Errors
- AI service unavailable: Display "AI service is temporarily unavailable. Please try again later."
- Generation timeout: Display "Generation is taking longer than expected. Please try again."

---

## Testing Strategy

### Dual Testing Approach

This implementation uses both unit tests and property-based tests:

**Unit Tests**: Verify specific examples, edge cases, and error conditions
**Property-Based Tests**: Verify universal properties that should hold across all inputs

### Property-Based Testing Library

**Library**: `fast-check` (JavaScript/TypeScript PBT library)

### Test Configuration
- Minimum iterations per property test: 100
- Shrinking enabled for counterexample minimization

### Test Categories

#### 1. Sync Feature Tests
- Unit: Test sync button click triggers API call
- Unit: Test time range picker date validation
- Property: Verify sync parameters match user selection (Property 1)
- Property: Verify result display matches API response (Property 2)

#### 2. Todo Detail Tests
- Unit: Test navigation to detail page
- Unit: Test edit mode toggle
- Property: Verify all fields are rendered (Property 4)
- Property: Verify subtasks are displayed (Property 5)
- Property: Verify edit persistence (Property 6)

#### 3. Source Display Tests
- Unit: Test Google Chat link generation
- Property: Verify source space display logic (Property 7)

#### 4. Assignee Display Tests
- Property: Verify assignee display logic (Property 8)
- Property: Verify truncation behavior (Property 9)

#### 5. AI Subtask Tests
- Unit: Test generate button triggers API
- Unit: Test preview mode editing
- Property: Verify preview before save (Property 10)

#### 6. Whitelist UI Tests
- Unit: Test search input behavior
- Property: Verify search filtering (Property 11)

### Test File Structure

```
features/
├── todos/
│   └── __tests__/
│       ├── SyncTodoButton.test.tsx
│       ├── TodoDetail.test.tsx
│       ├── TodoDetail.property.test.ts
│       ├── SubtaskGenerator.test.tsx
│       └── assignee.property.test.ts
└── googleChat/
    └── __tests__/
        ├── SpaceSearch.test.tsx
        └── spaceSearch.property.test.ts
```
