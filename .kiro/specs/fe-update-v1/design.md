# Design Document: FE Update v1

## Overview

This design document outlines the implementation of Update v1 features for the SpiderX Frontend application:
1. Home Page with Connected Chat Threads - Display and filter todos by thread
2. Manual Sync Todo with Async Task Support - Full async task lifecycle with polling
3. Paste Context to Extract Action Items - AI-powered text-to-todo extraction
4. Message Sender Information Display - Show who sent the original message

The implementation extends the existing feature-based architecture using Next.js App Router, Zustand for state management, and the established API client pattern.

---

## Architecture

### Component Hierarchy

```
app/(auth)/
├── todos/
│   └── page.tsx                    # UPDATE: Add thread sidebar, filter support
└── integration/
    └── page.tsx                    # Existing integration page

features/
├── todos/
│   ├── components/
│   │   ├── TodoList.tsx            # UPDATE: Add thread filter integration
│   │   ├── TodoItem.tsx            # UPDATE: Add sender display
│   │   ├── ThreadSidebar.tsx       # NEW: Connected threads sidebar
│   │   ├── ThreadFilter.tsx        # NEW: Thread filter dropdown (mobile)
│   │   ├── SyncTodoButton.tsx      # UPDATE: Async task support with polling
│   │   ├── PasteExtractModal.tsx   # NEW: Paste text to extract todos
│   │   ├── ExtractedTodoPreview.tsx # NEW: Preview extracted todos
│   │   └── SenderDisplay.tsx       # NEW: Message sender display
│   ├── hooks/
│   │   ├── useSyncTodo.ts          # UPDATE: Async task polling
│   │   ├── useThreadFilter.ts      # NEW: Thread filtering logic
│   │   └── usePasteExtract.ts      # NEW: Text extraction logic
│   ├── stores/
│   │   └── todo.store.ts           # UPDATE: Add thread filter state
│   └── types/
│       ├── index.ts                # UPDATE: Add sender fields
│       └── sync.ts                 # UPDATE: Add async task types
├── googleChat/
│   ├── api/
│   │   └── googleChat.api.ts       # UPDATE: Add async task endpoints
│   ├── services/
│   │   └── googleChat.service.ts   # UPDATE: Add task polling
│   └── types/
│       └── index.ts                # UPDATE: Add task types
```

### Data Flow - Async Sync Task

```
┌─────────────────┐
│   Sync Button   │
└────────┬────────┘
         │ click
         ▼
┌─────────────────┐
│  Start Task API │ POST /tasks/whitelist/generate-todos
└────────┬────────┘
         │ returns taskId
         ▼
┌─────────────────┐
│  Poll Status    │ GET /tasks/{taskId}
│  (every 2s)     │◄────────────────────┐
└────────┬────────┘                     │
         │                              │
    ┌────┴────┐                         │
    │ status? │                         │
    └────┬────┘                         │
         │                              │
    ┌────┼────┬────────┐               │
    ▼    ▼    ▼        ▼               │
PENDING PROGRESS SUCCESS FAILURE        │
    │    │       │        │            │
    │    │       │        └─► Show Error
    │    │       └─► Show Summary, Refresh Todos
    │    └─► Update Progress ──────────┘
    └─► Continue Polling ──────────────┘
```

### Data Flow - Thread Filter

```
┌─────────────────┐
│ Thread Sidebar  │
└────────┬────────┘
         │ select thread
         ▼
┌─────────────────┐
│ useThreadFilter │ ◄─── Hook manages filter state
└────────┬────────┘
         │ update store
         ▼
┌─────────────────┐
│  todo.store.ts  │ ◄─── selectedThreadId
└────────┬────────┘
         │ filter todos
         ▼
┌─────────────────┐
│   TodoList      │ ◄─── Filtered todos display
└─────────────────┘
```

---

## Components and Interfaces

### 1. ThreadSidebar Component

```typescript
interface ThreadSidebarProps {
  threads: ConnectedThread[];
  selectedThreadId: string | null;
  onThreadSelect: (threadId: string | null) => void;
  todoCounts: Record<string, number>;
  loading?: boolean;
}

interface ConnectedThread {
  id: string;
  name: string;
  displayName?: string;
}
```

### 2. SyncTodoButton Component (Updated)

```typescript
interface SyncTodoButtonProps {
  onSyncComplete?: (result: SyncTaskResult) => void;
  className?: string;
}

interface SyncTaskState {
  taskId: string | null;
  status: TaskStatus;
  progress: TaskProgress | null;
  result: SyncTaskResult | null;
  error: string | null;
}

type TaskStatus = 'IDLE' | 'PENDING' | 'STARTED' | 'PROGRESS' | 'SUCCESS' | 'FAILURE' | 'REVOKED';

interface TaskProgress {
  progress: string;
  percent: number;
  completed_spaces: number;
  total_spaces: number;
}

interface SyncTaskResult {
  total_messages_processed: number;
  total_todos_generated: number;
  total_todos_saved: number;
  processed_spaces: string[];
  todos: GeneratedTodo[];
  summary: string;
}
```

### 3. PasteExtractModal Component

```typescript
interface PasteExtractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtractComplete: (todos: ExtractedTodo[]) => void;
}

interface ExtractedTodo {
  title: string;
  description: string;
  priority: TodoPriority;
  tags: string[];
  isSelected: boolean;
}
```

### 4. ExtractedTodoPreview Component

```typescript
interface ExtractedTodoPreviewProps {
  todos: ExtractedTodo[];
  onTodoChange: (index: number, updates: Partial<ExtractedTodo>) => void;
  onToggleSelect: (index: number) => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
}
```

### 5. SenderDisplay Component

```typescript
interface SenderDisplayProps {
  senderName: string | null;
  senderEmail?: string | null;
  showFallback?: boolean;
  className?: string;
}
```

---

## Data Models

### Extended TodoApiModel (with sender info)

```typescript
interface TodoApiModel {
  // ... existing fields
  sender_name?: string | null;      // NEW: Message sender name
  sender_email?: string | null;     // NEW: Message sender email
}

interface Todo {
  // ... existing fields
  senderName: string | null;        // NEW: Mapped from sender_name
  senderEmail: string | null;       // NEW: Mapped from sender_email
}
```

### Async Task Types

```typescript
interface StartTaskResponse {
  taskId: string;
  status: 'PENDING';
  message: string;
  pollUrl: string;
}

interface TaskStatusResponse {
  taskId: string;
  status: TaskStatus;
  progress: TaskProgress | null;
  result: TaskResult | null;
  error: string | null;
}

interface TaskResult {
  status: 'SUCCESS';
  result: {
    total_messages_processed: number;
    total_todos_generated: number;
    total_todos_saved: number;
    processed_spaces: string[];
    todos: GeneratedTodo[];
    summary: string;
  };
}

interface GeneratedTodo {
  todoId: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string | null;
  estimatedTime?: number;
  tags: string[];
  eisenhower: string;
  sourceSpaceId: string;
  sourceSpaceName: string;
  sourceMessageId: string;
  sourceThreadName: string[];
}
```

### Thread Filter State

```typescript
interface ThreadFilterState {
  selectedThreadId: string | null;
  threads: ConnectedThread[];
  todoCounts: Record<string, number>;
}
```

### Extract Text Types

```typescript
interface ExtractTextRequest {
  text: string;
  auto_save?: boolean;
}

interface ExtractTextResponse {
  todos: ExtractedTodo[];
  summary: string;
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Thread Filter Correctness
*For any* selected thread ID and todo list, all displayed todos SHALL have a sourceSpaceId matching the selected thread ID.
**Validates: Requirements 1.2**

### Property 2: Thread Filter Clear
*For any* todo list, when no thread filter is applied (selectedThreadId is null), the displayed todos SHALL equal the complete unfiltered todo list.
**Validates: Requirements 1.3**

### Property 3: Thread Todo Count Accuracy
*For any* connected thread displayed in the sidebar, the shown todo count SHALL equal the actual count of todos with sourceSpaceId matching that thread's ID.
**Validates: Requirements 1.5**

### Property 4: Sync Status Display Consistency
*For any* async task status response, the UI SHALL display the corresponding status indicator, and for SUCCESS status, the displayed summary values SHALL match the API response values exactly.
**Validates: Requirements 2.2, 2.4**

### Property 5: Extraction Preview Completeness
*For any* AI extraction response with todos, all extracted todos SHALL be displayed in preview mode with editable fields (title, description, priority) before any are saved to the database.
**Validates: Requirements 3.3, 3.5**

### Property 6: Sender Information Display
*For any* todo with source_type='chat', if sender_name exists it SHALL be displayed; if sender_name is null or undefined, a fallback indicator SHALL be shown.
**Validates: Requirements 4.1, 4.2, 4.3**

---

## Error Handling

### Async Task Errors
- Task start failure: Display "Failed to start sync. Please try again."
- Polling failure: Retry up to 3 times, then display "Lost connection to sync task. Please refresh."
- Task FAILURE status: Display error message from API response with retry option
- Task REVOKED: Display "Sync was cancelled."

### Thread Filter Errors
- Failed to load threads: Display "Failed to load connected threads" with retry option
- No threads connected: Display prompt to connect Google Chat integration

### Paste Extract Errors
- Empty text: Display "Please paste some text to extract todos."
- AI extraction failure: Display "Failed to extract todos. Please try again or create manually."
- No todos found: Display "No action items found in the text."
- Save failure: Display "Failed to save todos. Please try again."

### Sender Info Errors
- Scope not granted: Display prompt to re-authorize with chat.memberships.readonly scope
- Sender unavailable: Display "Unknown sender" fallback

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

#### 1. Thread Filter Tests
- Unit: Test thread selection updates filter state
- Unit: Test "All Threads" clears filter
- Property: Verify filtered todos match selected thread (Property 1)
- Property: Verify clear filter shows all todos (Property 2)
- Property: Verify todo counts are accurate (Property 3)

#### 2. Async Sync Tests
- Unit: Test sync button triggers task start API
- Unit: Test polling starts after task creation
- Unit: Test cancel button calls cancel API
- Property: Verify status display matches API response (Property 4)

#### 3. Paste Extract Tests
- Unit: Test modal opens with text area
- Unit: Test extract button triggers API
- Unit: Test empty result shows message
- Property: Verify preview shows all extracted todos (Property 5)

#### 4. Sender Display Tests
- Unit: Test sender name renders when available
- Unit: Test fallback renders when sender unavailable
- Property: Verify sender display logic (Property 6)

### Test File Structure

```
features/
├── todos/
│   └── __tests__/
│       ├── threadFilter.property.test.ts
│       ├── syncTask.property.test.ts
│       ├── pasteExtract.property.test.ts
│       └── senderDisplay.property.test.ts
└── googleChat/
    └── __tests__/
        └── asyncTask.test.ts
```

