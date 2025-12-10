# SpiderX Interface - Project Summary & Task Checklist

## Project Overview

**SpiderX Interface** là một ứng dụng Next.js (React) với các tính năng chính:

### Core Features
1. **Authentication**: Đăng ký/đăng nhập với JWT, Google OAuth
2. **Todo Management**: CRUD todos, subtasks, contexts (projects/categories)
3. **Google Chat Integration**: Kết nối Google Chat, whitelist spaces, sync messages
4. **AI-powered Todo Extraction**: Extract todos từ text/messages sử dụng AI (Gemini)

### Tech Stack
- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Auth**: next-auth
- **Backend**: FastAPI (port 8002)

### Architecture
- Feature-based structure (`features/{feature-name}/`)
- Layers: Components → Hooks → Services → API → Backend
- Mock support cho development khi Backend chưa sẵn sàng

---

## Task Checklist (from docs/tasks.md)

### FE Tasks

| # | Task | Description | Related Files/Features | Status |
|---|------|-------------|------------------------|--------|
| 1 | **Sync Todo in Queue Button** | Bổ sung button cho phép sync todos từ Google Chat messages. Default: lấy tin nhắn từ thời điểm sync gần nhất đến hiện tại | `features/googleChat/`, `features/todos/` | ⬜ TODO |
| 2 | **Time Range Selection** | Button Sync Todo in Queue cho phép user chọn time range để lấy tin nhắn extract Todo | `features/googleChat/` | ⬜ TODO |
| 3 | **Todo Detail Screen** | Bổ sung màn hình Todo Detail để xem chi tiết todo | `features/todos/components/`, `app/(auth)/todos/` | ⬜ TODO |
| 4 | **Chat Thread Name + Link** | Bổ sung tên chat thread + link đến Chat Thread trong Todo items (UI đã có sẵn) | `features/todos/components/TodoItem.tsx` | ⬜ TODO |
| 5 | **Assignee Name in Todo Items** | UI: bổ sung tên Assignee trong Todo items | `features/todos/components/TodoItem.tsx` | ⬜ TODO |
| 6 | **Gen Sub-tasks Use Case** | Bổ sung usecase Gen Sub-tasks (AI generate subtasks cho todo) | `features/todos/`, AI endpoints | ⬜ TODO |
| 7 | **Optimize Whitelist UI** | Tối ưu UI Manage Chat thread (Whitelist) | `app/(auth)/whitelist/`, `features/googleChat/` | ⬜ TODO |

---

## Detailed Task Analysis

### Task 1 & 2: Sync Todo in Queue

**Current State:**
- Có endpoint `POST /api/v1/integration/spaces/{space_id}/generate-todos` để generate todos từ messages
- Có endpoint `POST /api/v1/integration/spaces/whitelist/generate-todos` để generate từ tất cả whitelisted spaces
- Có endpoint `POST /api/v1/integration/spaces/{space_id}/messages` để lấy messages với filter (start_date, end_date)

**Need to Implement:**
- UI button "Sync Todo in Queue" 
- Modal/form cho phép chọn time range
- Logic lưu trữ thời điểm sync gần nhất
- Integration với existing API endpoints

**Related API:**
```typescript
// Lấy messages với time range
POST /api/v1/integration/spaces/{space_id}/messages
{
  "start_date": "2024-12-18T00:00:00Z",
  "end_date": "2024-12-19T23:59:59Z",
  "limit": 1000
}

// Generate todos từ messages
POST /api/v1/integration/spaces/{space_id}/generate-todos
{
  "messageIds": ["msg-123", "msg-456"],
  "autoSave": true
}
```

---

### Task 3: Todo Detail Screen

**Current State:**
- Có `TodoItem.tsx`, `TodoList.tsx` components
- Có `MeetingTaskDrawer.tsx` (có thể tham khảo pattern)
- Có types định nghĩa trong `features/todos/types/`

**Need to Implement:**
- New page: `app/(auth)/todos/[todo_id]/page.tsx`
- Todo detail component với full information
- Edit functionality
- Subtasks management
- Source link (nếu từ Google Chat)

**Related Data Model:**
```typescript
type TodoItem = {
  todo_id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  due_date: string | null;
  estimated_time: number | null;
  source_type: "manual" | "chat" | "email" | "meeting" | "template";
  source_space_id: string | null;
  source_message_id: string | null;
  tags: string[];
  subtasks: Subtask[];
  // ...
};
```

---

### Task 4: Chat Thread Name + Link

**Current State:**
- UI đã có sẵn (theo task description)
- Todo có fields: `source_space_id`, `source_message_id`

**Need to Implement:**
- Hiển thị tên space/thread từ `source_space_id`
- Link đến Google Chat thread
- Có thể cần cache/store space names

---

### Task 5: Assignee Name in Todo Items

**Current State:**
- Chưa có field assignee trong current Todo model
- Cần confirm với BE về field này

**Need to Implement:**
- Hiển thị assignee name trong TodoItem component
- Có thể cần update types nếu BE thêm field mới

---

### Task 6: Gen Sub-tasks Use Case

**Current State:**
- Có subtask CRUD endpoints
- Có AI extract endpoint (`POST /api/v1/ai/extract`)

**Need to Implement:**
- UI button "Generate Sub-tasks" trong Todo detail
- Call AI endpoint để generate subtasks từ todo title/description
- Preview và confirm trước khi save
- Có thể cần BE endpoint mới: `POST /api/v1/todos/{todo_id}/generate-subtasks`

---

### Task 7: Optimize Whitelist UI

**Current State:**
- Có page `app/(auth)/whitelist/page.tsx`
- Có `useGoogleChat` hook với `updateWhitelist` function

**Need to Implement:**
- Review và optimize current UI
- Có thể cần: search/filter, bulk actions, better loading states
- UX improvements

---

## Dependencies & Prerequisites

### Backend API Requirements
1. ✅ Auth endpoints (login, register)
2. ✅ Todo CRUD endpoints
3. ✅ Subtask CRUD endpoints
4. ✅ Google Chat integration endpoints
5. ✅ AI extract endpoint
6. ⬜ Có thể cần: `POST /api/v1/todos/{todo_id}/generate-subtasks` (Task 6)
7. ⬜ Có thể cần: Assignee field trong Todo model (Task 5)

### Frontend Components to Create/Update
1. Sync Todo Button + Time Range Modal (Task 1, 2)
2. Todo Detail Page (Task 3)
3. Update TodoItem component (Task 4, 5)
4. Gen Subtasks UI (Task 6)
5. Optimize Whitelist page (Task 7)

---

## Recommended Implementation Order

1. **Task 3: Todo Detail Screen** - Foundation cho các task khác
2. **Task 4: Chat Thread Name + Link** - Cần cho context khi xem todo
3. **Task 5: Assignee Name** - Simple UI update
4. **Task 1 & 2: Sync Todo in Queue** - Core feature
5. **Task 6: Gen Sub-tasks** - AI feature
6. **Task 7: Optimize Whitelist UI** - UX improvement

---

## Notes

- Tất cả datetime từ BE đều là UTC, FE cần convert sang timezone của user
- API response trả về array trực tiếp, không có wrapper
- Mock support available khi `NEXT_PUBLIC_API_MOCKING=enabled`
- Backend chạy ở port 8002 (local dev)
