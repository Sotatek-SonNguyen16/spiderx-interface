# SpiderX Backend – FE Interface

Tài liệu này mô tả contract giữa Backend (FastAPI) và Frontend (Next.js) cho các feature:

- Đăng ký / đăng nhập người dùng
- Quản lý user profile
- CRUD todos và subtasks
- Quản lý contexts (projects/categories)
- AI-powered todo extraction từ text
- Kết nối Google Chat và tự động extract todos từ messages

**Phiên bản:** v1.3  
**Owner:** BE team (cập nhật nếu có breaking changes)

---

## 1. Environments & Base URL

| Env   | Base URL                   | Ghi chú          |
|-------|----------------------------|------------------|
| local | http://localhost:8002      | Dev local BE     |
| dev   | https://api-dev.spiderx.io | Dev shared env   |
| prod  | https://api.spiderx.io     | Production       |

Tất cả endpoint dưới đây đều prepend bằng `/api/v1`, ví dụ:

`GET /api/v1/todos`

---

## 2. Authentication

- FE nhận JWT từ endpoint `POST /api/v1/auth/login`.
- JWT được gửi trong header:

```http
Authorization: Bearer <access_token>
```

- Các endpoint trừ `/auth/*` yêu cầu header này, nếu không BE trả:
  - `401 Unauthorized` – chưa login / token sai / token expired
  - `403 Forbidden` – có login nhưng không đủ quyền

- Token expiration: **30 phút** (có thể config)
- FE nên implement refresh token logic hoặc redirect về login khi nhận 401

---

## 3. Conventions

### 3.1. Request/Response Format
- Request/Response body: **JSON**
- Content-Type: `application/json`

### 3.2. Naming Convention
- **JSON fields**: `snake_case` (ví dụ: `created_at`, `space_id`, `user_id`)
- **Path parameters**: `snake_case` (ví dụ: `/todos/{todo_id}`)
- **Query parameters**: `snake_case` (ví dụ: `status_filter`, `context_id`)

### 3.3. Datetime Format
- **ISO8601 UTC format**: `"2024-12-19T10:23:45Z"` hoặc `"2024-12-19T10:23:45.123Z"`
- Tất cả datetime từ BE đều là UTC
- FE cần convert sang timezone của user nếu cần

### 3.4. Pagination
- Query params: `skip` (offset), `limit` (page size)
- Default: `skip=0`, `limit=100`
- Response: Trả về array trực tiếp (không có wrapper)
- FE có thể implement infinite scroll hoặc page-based pagination

### 3.5. UUIDs
- Tất cả IDs đều là **UUID v4** (string 36 chars)
- Format: `"550e8400-e29b-41d4-a716-446655440000"`

---

## 4. Response & Error Format

### 4.1. Success Response (2xx)

**Format:** Response trực tiếp là data object hoặc array (không có wrapper).

**Ví dụ:**
```json
// GET /api/v1/todos - Trả về array trực tiếp
[
  {
    "todo_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project",
    "status": "todo",
    ...
  }
]

// POST /api/v1/todos - Trả về object
{
  "todo_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project",
  ...
}
```

### 4.2. Error Response (4xx/5xx)

**Format:**
```json
{
  "detail": "Error message string"
}
```

**Status Codes:**
- `400 Bad Request` – Invalid request body/params
- `401 Unauthorized` – Missing/invalid token
- `403 Forbidden` – Not authorized to access resource
- `404 Not Found` – Resource not found
- `422 Unprocessable Entity` – Validation error (Pydantic)
- `500 Internal Server Error` – Server error

**Ví dụ:**
```json
// 401 Unauthorized
{
  "detail": "Could not validate credentials"
}

// 404 Not Found
{
  "detail": "Todo not found"
}

// 400 Bad Request
{
  "detail": "Username already registered"
}
```

**Note:** FastAPI không có error code structure cố định, chỉ có `detail` string. FE nên parse message để hiển thị user-friendly.

---

## 5. Core Flows

### 5.1. Flow "User Registration & Login"

1. User điền form đăng ký
2. FE gọi `POST /api/v1/auth/register` với username, email, password
3. BE tạo user, trả về user object
4. FE tự động login: gọi `POST /api/v1/auth/login` với username + password
5. BE trả về `{ access_token, token_type: "bearer" }`
6. FE lưu token vào localStorage/sessionStorage
7. FE gửi token trong header `Authorization: Bearer <token>` cho các request sau

### 5.2. Flow "Kết nối Google Chat + Chọn spaces"

1. User đã login vào SpiderX (có JWT token)
2. FE redirect user sang Google OAuth (next-auth hoặc Google OAuth flow)
3. User authorize, Google redirect về FE với `code`
4. FE exchange `code` lấy `refreshToken` (qua next-auth hoặc Google API)
5. FE gọi `POST /api/v1/integration/connect` với `refreshToken` + JWT header
6. BE lưu encrypted refreshToken, trả về status "connected"
7. FE gọi `GET /api/v1/integration/spaces` để lấy danh sách Google Chat spaces
8. User tick chọn spaces muốn bật SpiderX scanning
9. FE gọi `PUT /api/v1/integration/spaces/whitelist` với danh sách `spaceIds`
10. FE có thể gọi `GET /api/v1/integration/spaces/whitelist` để lấy danh sách spaces đã whitelist
11. FE hiển thị trạng thái đã bật / chưa bật cho từng space

### 5.3. Flow "Tạo Todo từ Google Chat Message"

**Option 1: Generate từ một space cụ thể**
1. User đã connect Google Chat và whitelist spaces
2. FE gọi `POST /api/v1/integration/spaces/{space_id}/messages` để lấy messages (mặc định 1000 tin nhắn mới nhất)
3. User chọn messages muốn extract todos
4. FE gọi `POST /api/v1/integration/spaces/{space_id}/generate-todos` với `messageIds`
5. BE dùng AI agent extract todos từ messages
6. BE trả về statistics: số messages processed, số todos generated, số todos saved
7. FE refresh todo list để hiển thị todos mới

**Option 2: Generate từ tất cả whitelisted spaces**
1. User đã connect Google Chat và whitelist spaces
2. FE gọi `POST /api/v1/integration/spaces/whitelist/generate-todos` với `autoSave` và `limitPerSpace`
3. BE tự động lấy messages từ tất cả whitelisted spaces (mặc định 1000 tin nhắn mới nhất mỗi space)
4. BE dùng AI agent extract todos từ tất cả messages
5. BE trả về statistics tổng hợp: số messages processed, số todos generated, số todos saved
6. FE refresh todo list để hiển thị todos mới

### 5.4. Flow "AI Extract Todos từ Text"

1. User nhập text vào input (ví dụ: "Hôm nay vào họp lúc 2h30, deadline báo cáo là thứ 6")
2. FE gọi `POST /api/v1/ai/extract` với `text` (Form data)
3. BE dùng AI agent (Gemini) extract todos
4. BE trả về list todos với confidence score
5. Nếu `auto_save=true`, todos được lưu vào DB
6. FE hiển thị preview todos, user có thể edit trước khi save

---

## 6. Endpoint Reference

### 6.1. Authentication Endpoints

#### 6.1.1. `POST /api/v1/auth/register`

**Mục đích:**  
Đăng ký user mới

**Auth:** `not required`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123",
  "full_name": "John Doe",
  "avatar": "https://...",
  "timezone": "Asia/Ho_Chi_Minh",
  "working_hours": {
    "start": "09:00",
    "end": "18:00"
  }
}
```

**Fields:**
| Field         | Type   | Required | Default | Mô tả                    |
|---------------|--------|----------|---------|--------------------------|
| username      | string | yes      |         | 3-50 chars, unique       |
| email         | string | yes      |         | Valid email, unique      |
| password      | string | yes      |         | Min 8 chars              |
| full_name     | string | no       | null    | Max 100 chars            |
| avatar        | string | no       | null    | URL to avatar image      |
| timezone      | string | no       | "UTC"   | Timezone string          |
| working_hours | object | no       | null    | Working hours object     |

**Response 201:**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "john_doe",
  "email": "john@example.com",
  "full_name": "John Doe",
  "avatar": "https://...",
  "role": "user",
  "timezone": "Asia/Ho_Chi_Minh",
  "working_hours": {...},
  "created_at": "2024-12-19T10:00:00Z",
  "last_login_at": null
}
```

**Errors:**
- `400` – Username hoặc email đã tồn tại
- `422` – Validation error (password quá ngắn, email không hợp lệ)

---

#### 6.1.2. `POST /api/v1/auth/login`

**Mục đích:**  
Đăng nhập và nhận JWT token

**Auth:** `not required`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepass123"
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Errors:**
- `401` – Username hoặc password sai

---

### 6.2. User Endpoints

#### 6.2.1. `GET /api/v1/users/me`

**Mục đích:**  
Lấy thông tin user hiện tại

**Auth:** `required`

**Response 200:**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "john_doe",
  "email": "john@example.com",
  "full_name": "John Doe",
  "avatar": "https://...",
  "role": "user",
  "timezone": "Asia/Ho_Chi_Minh",
  "working_hours": {...},
  "created_at": "2024-12-19T10:00:00Z",
  "last_login_at": "2024-12-19T15:30:00Z"
}
```

**Errors:**
- `401` – Chưa login

---

#### 6.2.2. `PUT /api/v1/users/me`

**Mục đích:**  
Cập nhật profile user hiện tại

**Auth:** `required`

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "full_name": "John Updated",
  "avatar": "https://...",
  "timezone": "UTC",
  "working_hours": {...}
}
```

**Fields:** Tất cả optional, chỉ gửi fields muốn update

**Response 200:**
```json
{
  "user_id": "...",
  "username": "john_doe",
  "email": "newemail@example.com",
  ...
}
```

**Errors:**
- `400` – Email đã được user khác sử dụng
- `401` – Chưa login

---

### 6.3. Todo Endpoints

#### 6.3.1. `GET /api/v1/todos`

**Mục đích:**  
Lấy danh sách todos của user hiện tại

**Auth:** `required`

**Query Params:**
| Name          | Type   | Required | Default | Mô tả                          |
|---------------|--------|----------|---------|--------------------------------|
| status_filter | string | no       | null    | Filter: `todo`, `in_progress`, `completed`, `cancelled` |
| context_id    | string | no       | null    | Filter by context ID           |
| skip          | number | no       | 0       | Skip (pagination offset)       |
| limit         | number | no       | 100     | Limit (max items per page)     |

**Response 200:**
```json
[
  {
    "todo_id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "...",
    "context_id": "...",
    "title": "Complete project",
    "description": "Finish the project documentation",
    "status": "todo",
    "priority": "high",
    "due_date": "2024-12-31T23:59:59Z",
    "estimated_time": 120,
    "actual_time": null,
    "source_type": "manual",
    "source_id": null,
    "source_space_id": null,
    "source_message_id": null,
    "template_id": null,
    "tags": ["work", "urgent"],
    "eisenhower": "urgent_important",
    "completed_at": null,
    "created_at": "2024-12-19T10:00:00Z",
    "updated_at": "2024-12-19T10:00:00Z",
    "subtasks": []
  }
]
```

**Status Enum:** `todo`, `in_progress`, `completed`, `cancelled`  
**Priority Enum:** `low`, `medium`, `high`, `urgent`  
**Source Type Enum:** `manual`, `chat`, `email`, `meeting`, `template`  
**Eisenhower Enum:** `urgent_important`, `not_urgent_important`, `urgent_not_important`, `not_urgent_not_important`

---

#### 6.3.2. `POST /api/v1/todos`

**Mục đích:**  
Tạo todo mới

**Auth:** `required`

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the project documentation",
  "status": "todo",
  "priority": "high",
  "due_date": "2024-12-31T23:59:59Z",
  "estimated_time": 120,
  "context_id": "550e8400-e29b-41d4-a716-446655440000",
  "source_type": "manual",
  "tags": ["work", "urgent"],
  "eisenhower": "urgent_important"
}
```

**Fields:**
| Field          | Type    | Required | Default      | Mô tả                    |
|----------------|---------|----------|--------------|--------------------------|
| title          | string  | yes      |              | 1-255 chars              |
| description    | string  | no       | null         |                          |
| status         | string  | no       | "todo"       | Enum: todo, in_progress, completed, cancelled |
| priority       | string  | no       | "medium"     | Enum: low, medium, high, urgent |
| due_date       | string  | no       | null         | ISO8601 datetime         |
| estimated_time | number  | no       | null         | Minutes (integer)        |
| context_id     | string  | no       | null         | UUID                     |
| source_type    | string  | no       | "manual"     | Enum                     |
| source_id      | string  | no       | null         |                          |
| template_id    | string  | no       | null         |                          |
| tags           | array   | no       | null         | Array of strings         |
| eisenhower     | string  | no       | null         | Enum                     |

**Response 201:**
```json
{
  "todo_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "...",
  "title": "Complete project",
  ...
}
```

---

#### 6.3.3. `GET /api/v1/todos/{todo_id}`

**Mục đích:**  
Lấy chi tiết một todo

**Auth:** `required`

**Path Params:**
| Name    | Type   | Required | Mô tả |
|---------|--------|----------|-------|
| todo_id | string | yes      | UUID  |

**Response 200:**
```json
{
  "todo_id": "...",
  "title": "Complete project",
  ...
}
```

**Errors:**
- `404` – Todo not found
- `403` – Todo không thuộc về user hiện tại

---

#### 6.3.4. `PUT /api/v1/todos/{todo_id}`

**Mục đích:**  
Cập nhật todo

**Auth:** `required`

**Request Body:** Tất cả fields optional (chỉ gửi fields muốn update)
```json
{
  "title": "Updated title",
  "status": "in_progress",
  "priority": "urgent"
}
```

**Response 200:**
```json
{
  "todo_id": "...",
  "title": "Updated title",
  "status": "in_progress",
  ...
}
```

**Note:** Khi `status` = `completed`, BE tự động set `completed_at` = current time

---

#### 6.3.5. `DELETE /api/v1/todos/{todo_id}`

**Mục đích:**  
Xóa todo

**Auth:** `required`

**Response 204:** No content

**Errors:**
- `404` – Todo not found
- `403` – Not authorized

---

#### 6.3.6. `POST /api/v1/todos/{todo_id}/subtasks`

**Mục đích:**  
Tạo subtask cho todo

**Auth:** `required`

**Request Body:**
```json
{
  "title": "Subtask 1",
  "status": "todo",
  "order": 0
}
```

**Response 201:**
```json
{
  "subtask_id": "550e8400-e29b-41d4-a716-446655440000",
  "todo_id": "...",
  "title": "Subtask 1",
  "status": "todo",
  "order": 0,
  "created_at": "2024-12-19T10:00:00Z",
  "completed_at": null
}
```

---

#### 6.3.7. `GET /api/v1/todos/{todo_id}/subtasks`

**Mục đích:**  
Lấy danh sách subtasks của todo

**Auth:** `required`

**Response 200:**
```json
[
  {
    "subtask_id": "...",
    "todo_id": "...",
    "title": "Subtask 1",
    "status": "todo",
    "order": 0,
    ...
  }
]
```

---

#### 6.3.8. `PUT /api/v1/todos/{todo_id}/subtasks/{subtask_id}`

**Mục đích:**  
Cập nhật subtask

**Auth:** `required`

**Request Body:** Tất cả optional
```json
{
  "title": "Updated subtask",
  "status": "completed",
  "order": 1
}
```

---

#### 6.3.9. `DELETE /api/v1/todos/{todo_id}/subtasks/{subtask_id}`

**Mục đích:**  
Xóa subtask

**Auth:** `required`

**Response 204:** No content

---

### 6.4. Context Endpoints

#### 6.4.1. `GET /api/v1/contexts`

**Mục đích:**  
Lấy danh sách contexts (projects/categories) của user

**Auth:** `required`

**Query Params:**
| Name       | Type    | Required | Default | Mô tả                    |
|------------|---------|----------|---------|--------------------------|
| active_only | boolean | no       | true    | Chỉ lấy contexts active  |
| skip       | number  | no       | 0       | Skip (pagination offset) |
| limit      | number  | no       | 100     | Limit                    |

**Response 200:**
```json
[
  {
    "context_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Work Projects",
    "description": "All work-related tasks",
    "color": "#FF5733",
    "icon": "briefcase",
    "is_active": true,
    "created_at": "2024-12-19T10:00:00Z"
  }
]
```

---

#### 6.4.2. `POST /api/v1/contexts`

**Mục đích:**  
Tạo context mới

**Auth:** `required`

**Request Body:**
```json
{
  "name": "Work Projects",
  "description": "All work-related tasks",
  "color": "#FF5733",
  "icon": "briefcase"
}
```

**Fields:**
| Field       | Type   | Required | Default | Mô tả                    |
|-------------|--------|----------|---------|--------------------------|
| name        | string | yes      |         | 1-100 chars              |
| description | string | no       | null    |                          |
| color       | string | no       | null    | Hex color (#RRGGBB)      |
| icon        | string | no       | null    | Icon name/identifier     |

**Response 201:**
```json
{
  "context_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Work Projects",
  ...
}
```

**Note:** User tạo context sẽ tự động là OWNER

---

#### 6.4.3. `GET /api/v1/contexts/{context_id}`

**Mục đích:**  
Lấy chi tiết context

**Auth:** `required`

**Response 200:**
```json
{
  "context_id": "...",
  "name": "Work Projects",
  ...
}
```

**Errors:**
- `404` – Context not found
- `403` – User không có quyền truy cập context này

---

#### 6.4.4. `PUT /api/v1/contexts/{context_id}`

**Mục đích:**  
Cập nhật context (chỉ OWNER hoặc ADMIN)

**Auth:** `required`

**Request Body:** Tất cả optional
```json
{
  "name": "Updated name",
  "description": "Updated description",
  "color": "#00FF00",
  "is_active": false
}
```

---

#### 6.4.5. `DELETE /api/v1/contexts/{context_id}`

**Mục đích:**  
Xóa context (soft delete, chỉ OWNER)

**Auth:** `required`

**Response 204:** No content

**Note:** Soft delete = set `is_active = false`

---

### 6.5. AI Endpoints

#### 6.5.1. `POST /api/v1/ai/extract`

**Mục đích:**  
Extract todos từ text sử dụng AI (Gemini)

**Auth:** `required`

**Request Body:** Form data (`application/x-www-form-urlencoded` hoặc `multipart/form-data`)
```
text: "Hôm nay vào họp lúc 2h30 nhé, deadline báo cáo là thứ 6"
auto_save: false
source_type: "chat"
source_id: "optional-source-id"
```

**Fields:**
| Field       | Type    | Required | Default | Mô tả                    |
|-------------|---------|----------|---------|--------------------------|
| text        | string  | yes      |         | Text to analyze          |
| auto_save   | boolean | no       | false   | Tự động lưu todos vào DB |
| source_type | string  | no       | "chat"  | Enum: chat, email, meeting |
| source_id   | string  | no       | null    | Optional source ID       |

**Response 200:**
```json
{
  "todos": [
    {
      "title": "Vào họp lúc 2h30",
      "description": null,
      "priority": "high",
      "due_date": "2024-12-19T14:30:00Z",
      "estimated_time": null,
      "tags": [],
      "eisenhower": "urgent_important"
    },
    {
      "title": "Deadline báo cáo",
      "description": null,
      "priority": "high",
      "due_date": "2024-12-20T23:59:59Z",
      "estimated_time": null,
      "tags": [],
      "eisenhower": "urgent_important"
    }
  ],
  "confidence": 0.92,
  "summary": "Found 2 tasks with deadlines",
  "saved_count": 0
}
```

**Note:** Nếu `auto_save=true`, `saved_count` sẽ > 0 và todos đã được lưu vào DB

---

#### 6.5.2. `POST /api/v1/ai/extract-batch`

**Mục đích:**  
Extract todos từ nhiều messages cùng lúc

**Auth:** `required`

**Request Body:**
```json
{
  "messages": [
    {
      "content": "Let's deploy the app tomorrow",
      "sender_name": "Alice",
      "sender_id": "alice-123",
      "timestamp": "2024-12-19T10:00:00Z"
    },
    {
      "content": "I need to fix that bug ASAP",
      "sender_name": "Bob",
      "sender_id": "bob-456",
      "timestamp": "2024-12-19T10:05:00Z"
    }
  ],
  "conversation_id": "conv-123",
  "auto_save": true
}
```

**Response 200:**
```json
{
  "total_messages": 2,
  "total_todos_found": 3,
  "total_saved": 3,
  "results": [
    {
      "todos": [...],
      "confidence": 0.9,
      "summary": "Found 2 tasks",
      "saved_count": 2
    },
    {
      "todos": [...],
      "confidence": 0.85,
      "summary": "Found 1 task",
      "saved_count": 1
    }
  ],
  "summary": "Processed 2 messages and found 3 todos. Saved 3 todos to database."
}
```

---

#### 6.5.3. `GET /api/v1/ai/health`

**Mục đích:**  
Check AI service status

**Auth:** `not required`

**Response 200:**
```json
{
  "status": "ready",
  "model": "gemini-2.0-flash-exp",
  "api_key_set": true,
  "message": "AI service is ready"
}
```

---

### 6.6. Google Chat Integration Endpoints

#### 6.6.1. `POST /api/v1/integration/connect`

**Mục đích:**  
Kết nối Google Chat account, lưu refresh token

**Auth:** `required`

**Request Body:**
```json
{
  "refreshToken": "ya29.a0AfB_byC1234567890..."
}
```

**Response 200:**
```json
{
  "status": "connected",
  "provider": "google_chat",
  "lastSyncAt": null,
  "lastError": null
}
```

**Status Enum:** `connected`, `not_connected`, `error`

**Errors:**
- `500` – Failed to connect (encryption error, DB error)

---

#### 6.6.2. `GET /api/v1/integration/status`

**Mục đích:**  
Kiểm tra trạng thái kết nối Google Chat

**Auth:** `required`

**Response 200:**
```json
{
  "status": "connected",
  "provider": "google_chat",
  "lastSyncAt": "2024-12-19T15:30:00Z",
  "lastError": null
}
```

Hoặc nếu chưa connect:
```json
{
  "status": "not_connected",
  "provider": null,
  "lastSyncAt": null,
  "lastError": null
}
```

---

#### 6.6.3. `GET /api/v1/integration/spaces`

**Mục đích:**  
Lấy danh sách Google Chat spaces với whitelist status

**Auth:** `required`

**Response 200:**
```json
{
  "spaces": [
    {
      "id": "AAAAAAAAAAA",
      "name": "Team Engineering",
      "description": "Engineering team space",
      "isWhitelisted": false,
      "displayName": "Team Engineering",
      "spaceType": "SPACE"
    },
    {
      "id": "BBBBBBBBBBB",
      "name": "General Chat",
      "description": null,
      "isWhitelisted": true,
      "displayName": "General Chat",
      "spaceType": "SPACE"
    }
  ]
}
```

**Errors:**
- `403` – User chưa connect Google Chat
- `500` – Google Chat API error

---

#### 6.6.4. `GET /api/v1/integration/spaces/whitelist`

**Mục đích:**  
Lấy danh sách spaces đã được whitelist của user

**Auth:** `required`

**Response 200:**
```json
{
  "spaces": [
    {
      "id": "AAAAAAAAAAA",
      "name": "Team Engineering",
      "description": "Engineering team space",
      "isWhitelisted": true,
      "displayName": "Team Engineering",
      "spaceType": "SPACE"
    },
    {
      "id": "BBBBBBBBBBB",
      "name": "General Chat",
      "description": null,
      "isWhitelisted": true,
      "displayName": "General Chat",
      "spaceType": "SPACE"
    }
  ]
}
```

**Note:** 
- Chỉ trả về các spaces đã được whitelist
- Nếu không có space nào trong whitelist, trả về `spaces: []`
- Tất cả spaces trong response đều có `isWhitelisted: true`

**Errors:**
- `403` – User chưa connect Google Chat
- `500` – Google Chat API error

---

#### 6.6.5. `PUT /api/v1/integration/spaces/whitelist`

**Mục đích:**  
Cập nhật danh sách spaces được phép quét

**Auth:** `required`

**Request Body:**
```json
{
  "spaceIds": ["AAAAAAAAAAA", "BBBBBBBBBBB"]
}
```

**Response 200:**
```json
{
  "status": "ok",
  "updatedSpaces": ["AAAAAAAAAAA", "BBBBBBBBBBB"]
}
```

**Errors:**
- `403` – User chưa connect Google Chat

---

#### 6.6.6. `POST /api/v1/integration/disconnect`

**Mục đích:**  
Ngắt kết nối Google Chat, xóa token

**Auth:** `required`

**Response 200:**
```json
{
  "status": "disconnected"
}
```

**Errors:**
- `404` – Không tìm thấy connection

---

#### 6.6.7. `POST /api/v1/integration/spaces/{space_id}/messages`

**Mục đích:**  
Lấy messages từ Google Chat space với filter

**Auth:** `required`

**Path Params:**
| Name     | Type   | Required | Mô tả         |
|----------|--------|----------|---------------|
| space_id | string | yes      | Google Chat space ID |

**Request Body:**
```json
{
  "space_id": "AAAAAAAAAAA",
  "start_date": "2024-12-18T00:00:00Z",
  "end_date": "2024-12-19T23:59:59Z",
  "sender_filter": "John",
  "keyword": "meeting",
  "limit": 1000
}
```

**Note:** Messages được trả về theo thứ tự mới nhất trước (newest first). Mặc định lấy 1000 tin nhắn mới nhất.

**Fields:**
| Field        | Type    | Required | Default | Mô tả                    |
|--------------|---------|----------|---------|--------------------------|
| space_id     | string  | yes      |         | Space ID (duplicate từ path) |
| start_date   | string  | no       | null    | ISO8601 datetime         |
| end_date     | string  | no       | null    | ISO8601 datetime         |
| sender_filter| string  | no       | null    | Filter by sender name/ID |
| keyword      | string  | no       | null    | Search keyword           |
| limit        | number  | no       | 1000    | Max 1000, newest first   |

**Response 200:**
```json
{
  "messages": [
    {
      "messageId": "msg-123",
      "spaceId": "AAAAAAAAAAA",
      "senderId": "user-123",
      "senderName": "John Doe",
      "content": "Hôm nay vào họp lúc 2h30 nhé",
      "timestamp": "2024-12-19T14:30:00Z",
      "threadId": null
    }
  ],
  "totalCount": 1,
  "spaceName": "Team Engineering"
}
```

**Errors:**
- `403` – Space không trong whitelist hoặc user chưa connect
- `500` – Google Chat API error

---

#### 6.6.8. `POST /api/v1/integration/spaces/{space_id}/generate-todos`

**Mục đích:**  
Generate todos từ Google Chat messages sử dụng AI (sync)

**Auth:** `required`

**Path Params:**
| Name     | Type   | Required | Mô tả         |
|----------|--------|----------|---------------|
| space_id | string | yes      | Google Chat space ID |

**Request Body:** (camelCase)
```json
{
  "spaceId": "AAAAAAAAAAA",
  "messageIds": ["msg-123", "msg-456"],
  "autoSave": true
}
```

**Fields:**
| Field       | Type    | Required | Default | Mô tả                    |
|-------------|---------|----------|---------|--------------------------|
| spaceId     | string  | yes      |         | Space ID (duplicate từ path) |
| messageIds  | array   | yes      |         | List of message IDs      |
| autoSave    | boolean | no       | true    | Tự động lưu todos        |

**Response 200:** (camelCase)
```json
{
  "totalMessagesProcessed": 2,
  "totalTodosGenerated": 3,
  "totalTodosSaved": 3,
  "summary": "Processed 2 messages from space 'Team Engineering'. Generated 3 todos, saved 3 to database."
}
```

**Errors:**
- `404` – Không tìm thấy messages với IDs đã cho
- `403` – Space không trong whitelist
- `500` – AI extraction error hoặc Google Chat API error

**Note:** Todos được tạo sẽ có `source_space_id` và `source_message_id` để link về message gốc

---

#### 6.6.9. `POST /api/v1/integration/spaces/whitelist/generate-todos`

**Mục đích:**  
Generate todos từ tất cả whitelisted Google Chat spaces sử dụng AI (sync)

**Auth:** `required`

**Request Body:** (snake_case)
```json
{
  "auto_save": true,
  "limit_per_space": 100
}
```

**Fields:**
| Field          | Type    | Required | Default | Mô tả                    |
|----------------|---------|----------|---------|--------------------------|
| auto_save      | boolean | no       | true    | Tự động lưu todos        |
| limit_per_space| number  | no       | 100     | Max messages per space (max 1000, newest first) |

**Response 200:** (camelCase)
```json
{
  "totalMessagesProcessed": 2500,
  "totalTodosGenerated": 45,
  "totalTodosSaved": 45,
  "summary": "Processed 2500 messages from 3 whitelisted spaces. Generated 45 todos, saved 45 to database."
}
```

**Errors:**
- `400` – Không có whitelisted spaces nào
- `403` – User chưa connect Google Chat
- `500` – AI extraction error hoặc Google Chat API error

**Note:** 
- Endpoint này sẽ xử lý tất cả spaces trong whitelist của user
- Mỗi space sẽ lấy `limit_per_space` tin nhắn mới nhất (default: 100)
- Todos được tạo sẽ có `source_space_id` và `source_message_id` để link về message gốc
- Nếu một space có lỗi, endpoint sẽ tiếp tục xử lý các space khác

---

### 6.7. Async Task Endpoints

Các endpoint async cho việc generate todos từ nhiều spaces (tránh HTTP timeout).

#### 6.7.1. `POST /api/v1/integration/tasks/whitelist/generate-todos`

**Mục đích:**  
Start async task để generate todos từ tất cả whitelisted spaces

**Auth:** `required`

**Request Body:** (camelCase)
```json
{
  "autoSave": true,
  "limitPerSpace": 100
}
```

**Fields:**
| Field          | Type    | Required | Default | Mô tả                    |
|----------------|---------|----------|---------|--------------------------|
| autoSave       | boolean | no       | true    | Tự động lưu todos        |
| limitPerSpace  | number  | no       | 100     | Max messages per space (max 1000) |

**Response 200:**
```json
{
  "taskId": "abc123-task-id",
  "status": "PENDING",
  "message": "Task started",
  "pollUrl": "/api/v1/integration/tasks/abc123-task-id"
}
```

---

#### 6.7.2. `POST /api/v1/integration/tasks/spaces/{space_id}/generate-todos`

**Mục đích:**  
Start async task để generate todos từ một space cụ thể

**Auth:** `required`

**Path Params:**
| Name     | Type   | Required | Mô tả         |
|----------|--------|----------|---------------|
| space_id | string | yes      | Google Chat space ID |

**Request Body:**
```json
{
  "messageIds": ["msg-123", "msg-456"],
  "autoSave": true,
  "limit": 30
}
```

**Fields:**
| Field       | Type    | Required | Default | Mô tả                    |
|-------------|---------|----------|---------|--------------------------|
| messageIds  | array   | no       | null    | Specific message IDs (optional) |
| autoSave    | boolean | no       | true    | Tự động lưu todos        |
| limit       | number  | no       | 30      | Max messages if messageIds not specified |

**Response 200:**
```json
{
  "taskId": "abc123-task-id",
  "status": "PENDING",
  "message": "Task started",
  "pollUrl": "/api/v1/integration/tasks/abc123-task-id"
}
```

---

#### 6.7.3. `GET /api/v1/integration/tasks/{task_id}`

**Mục đích:**  
Poll task status và progress

**Auth:** `required`

**Path Params:**
| Name    | Type   | Required | Mô tả    |
|---------|--------|----------|----------|
| task_id | string | yes      | Task ID  |

**Response 200:**
```json
{
  "taskId": "abc123-task-id",
  "status": "PROGRESS",
  "progress": {
    "progress": "Processing space 2/3",
    "percent": 66,
    "completed_spaces": 2,
    "total_spaces": 3
  },
  "result": null,
  "error": null
}
```

**Status Enum:** `PENDING`, `STARTED`, `PROGRESS`, `SUCCESS`, `FAILURE`, `REVOKED`

**Response khi SUCCESS:**
```json
{
  "taskId": "abc123-task-id",
  "status": "SUCCESS",
  "progress": null,
  "result": {
    "status": "SUCCESS",
    "result": {
      "total_messages_processed": 150,
      "total_todos_generated": 12,
      "total_todos_saved": 12,
      "processed_spaces": ["space1", "space2"],
      "todos": [...],
      "summary": "Processed 150 messages..."
    }
  },
  "error": null
}
```

**Polling Strategy:**
- Poll mỗi 2-5 giây
- Dừng khi status là `SUCCESS` hoặc `FAILURE`

---

#### 6.7.4. `DELETE /api/v1/integration/tasks/{task_id}`

**Mục đích:**  
Cancel một task đang chạy

**Auth:** `required`

**Path Params:**
| Name    | Type   | Required | Mô tả    |
|---------|--------|----------|----------|
| task_id | string | yes      | Task ID  |

**Response 204:** No content

**Note:** Không thể cancel task đã completed hoặc failed

---

## 7. Data Models

### 7.1. User

```typescript
type User = {
  user_id: string;           // UUID
  username: string;          // 3-50 chars, unique
  email: string;             // Valid email, unique
  full_name: string | null;
  avatar: string | null;     // URL
  role: "admin" | "user" | "guest";
  timezone: string;          // Default: "UTC"
  working_hours: object | null;
  created_at: string;        // ISO8601
  last_login_at: string | null;
};
```

### 7.2. TodoItem

```typescript
type TodoItem = {
  todo_id: string;           // UUID
  user_id: string;           // UUID
  context_id: string | null; // UUID
  title: string;             // 1-255 chars
  description: string | null;
  status: "todo" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  due_date: string | null;   // ISO8601
  estimated_time: number | null; // Minutes
  actual_time: number | null;    // Minutes
  source_type: "manual" | "chat" | "email" | "meeting" | "template";
  source_id: string | null;
  source_space_id: string | null;    // Google Chat space ID
  source_message_id: string | null;  // Google Chat message ID
  template_id: string | null;
  tags: string[] | null;
  eisenhower: "urgent_important" | "not_urgent_important" | "urgent_not_important" | "not_urgent_not_important" | null;
  completed_at: string | null;       // ISO8601
  created_at: string;                // ISO8601
  updated_at: string;                // ISO8601
  subtasks: SubTask[];
};
```

### 7.3. SubTask

```typescript
type SubTask = {
  subtask_id: string;        // UUID
  todo_id: string;           // UUID
  title: string;             // 1-255 chars
  status: "todo" | "completed";
  order: number;             // Default: 0
  created_at: string;        // ISO8601
  completed_at: string | null;
};
```

### 7.4. Context

```typescript
type Context = {
  context_id: string;        // UUID
  name: string;              // 1-100 chars
  description: string | null;
  color: string | null;      // Hex color (#RRGGBB)
  icon: string | null;
  is_active: boolean;
  created_at: string;        // ISO8601
};
```

### 7.5. GoogleChatSpace

```typescript
type GoogleChatSpace = {
  id: string;                // Space ID
  name: string;              // Display name
  description: string | null;
  isWhitelisted: boolean;
  displayName: string | null;
  spaceType: string | null;  // "SPACE", "DIRECT_MESSAGE", "GROUP_CONVERSATION"
};
```

### 7.6. GoogleChatMessage

```typescript
type GoogleChatMessage = {
  messageId: string;
  spaceId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;         // ISO8601
  threadId: string | null;
};
```

### 7.7. ExtractedTodo

```typescript
type ExtractedTodo = {
  title: string;
  description: string | null;
  priority: string;          // "low" | "medium" | "high" | "urgent"
  due_date: string | null;   // ISO8601
  estimated_time: number | null; // Minutes
  tags: string[];
  eisenhower: string | null;
};
```

### 7.8. Async Task Types

```typescript
type TaskStatus = "PENDING" | "STARTED" | "PROGRESS" | "SUCCESS" | "FAILURE" | "REVOKED";

type StartTaskResponse = {
  taskId: string;
  status: "PENDING";
  message: string;
  pollUrl: string;
};

type TaskProgress = {
  progress: string;
  percent: number;
  completed_spaces: number;
  total_spaces: number;
};

type TaskResultData = {
  total_messages_processed: number;
  total_todos_generated: number;
  total_todos_saved: number;
  processed_spaces: string[];
  todos: GeneratedTodo[];
  summary: string;
};

type TaskStatusResponse = {
  taskId: string;
  status: TaskStatus;
  progress: TaskProgress | null;
  result: { status: "SUCCESS"; result: TaskResultData } | null;
  error: string | null;
};
```

### 7.9. Pagination

**Note:** API trả về array trực tiếp, không có pagination wrapper. FE cần tự track:
- `skip`: Số items đã load (dùng cho request tiếp theo)
- `limit`: Số items mỗi request (default: 100)

```typescript
// FE pagination state example
type PaginationState = {
  skip: number;      // Current offset
  limit: number;     // Items per page (default: 100)
  hasMore: boolean;  // FE tự track dựa trên response.length === limit
};
```

---

## 8. Changelog

### 2025-12-11 (v1.3)
- **Cập nhật theo OpenAPI spec thực tế**:
  - Pagination: Sử dụng `skip` (không phải `offset`), default `limit=100`
  - Response format: Array trực tiếp (không có wrapper `{ data, meta }`)
  - Cập nhật field naming conventions cho Google Chat endpoints
- **Thêm mới**: Async Task Endpoints (Section 6.7)
  - `POST /api/v1/integration/tasks/whitelist/generate-todos` - Start async task
  - `POST /api/v1/integration/tasks/spaces/{space_id}/generate-todos` - Start space task
  - `GET /api/v1/integration/tasks/{task_id}` - Poll task status
  - `DELETE /api/v1/integration/tasks/{task_id}` - Cancel task
- **Cập nhật**: Google Chat generate-todos endpoints
  - Request body dùng `snake_case` cho whitelist endpoint (`auto_save`, `limit_per_space`)
  - Request body dùng `camelCase` cho space endpoint (`spaceId`, `messageIds`, `autoSave`)
  - Response dùng `camelCase` (`totalMessagesProcessed`, `totalTodosGenerated`, etc.)

### 2024-12-19 (v1.0)
- Tạo tài liệu lần đầu
- Thêm endpoints: Authentication, Users, Todos, Contexts, AI extraction
- Thêm Google Chat integration endpoints
- Thêm fields `source_space_id` và `source_message_id` vào TodoItem model

### 2025-11-16 (v1.1)
- **Thay đổi**: `POST /api/v1/integration/spaces/{space_id}/messages`
  - Limit mặc định thay đổi từ 100 thành 1000
  - Messages được trả về theo thứ tự mới nhất trước (newest first)
- **Thêm mới**: `GET /api/v1/integration/spaces/whitelist`
- **Thêm mới**: `POST /api/v1/integration/spaces/whitelist/generate-todos`

---

## 9. Notes & Best Practices

### 9.1. Error Handling
- FE nên handle tất cả error codes (400, 401, 403, 404, 422, 500)
- Khi nhận 401, FE nên clear token và redirect về login
- Hiển thị user-friendly error messages từ `detail` field

### 9.2. Token Management
- Lưu token trong localStorage hoặc httpOnly cookie (khuyến nghị httpOnly)
- Implement auto-refresh hoặc redirect login khi token expired
- Không gửi token trong URL params

### 9.3. Pagination
- Sử dụng `skip` và `limit` cho pagination
- Default: `skip=0`, `limit=100`
- Response là array trực tiếp (không có wrapper)
- Implement infinite scroll hoặc "Load more" button
- FE cần track số items đã load để tính `skip` cho request tiếp theo

### 9.4. AI Extraction
- `auto_save=false` để preview trước khi save
- Hiển thị `confidence` score để user biết độ tin cậy
- Cho phép user edit todos trước khi save

### 9.5. Google Chat Integration
- Check `status` trước khi gọi các endpoints khác
- Handle `error` status và hiển thị `lastError` cho user
- Chỉ spaces được whitelist mới có thể lấy messages
- Messages được lấy theo thứ tự mới nhất trước (newest first), mặc định 1000 tin nhắn
- Có thể lấy danh sách whitelisted spaces bằng `GET /api/v1/integration/spaces/whitelist`
- Có 2 cách generate todos:
  - **Sync**: Dùng `/integration/spaces/{space_id}/generate-todos` hoặc `/integration/spaces/whitelist/generate-todos`
  - **Async**: Dùng `/integration/tasks/...` endpoints để tránh HTTP timeout
- **Khuyến nghị**: Dùng async endpoints khi xử lý nhiều spaces hoặc nhiều messages

### 9.6. Async Task Best Practices
- Sử dụng async endpoints khi xử lý > 1 space hoặc > 100 messages
- Poll task status mỗi 2-5 giây
- Hiển thị progress bar dựa trên `progress.percent`
- Handle các status: `SUCCESS`, `FAILURE`, `REVOKED`
- Cho phép user cancel task đang chạy bằng DELETE endpoint

---

**Cập nhật:** 2025-12-11
**Phiên bản:** 1.3.0

