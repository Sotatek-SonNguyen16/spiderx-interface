# SpiderX Backend – FE Interface

Tài liệu này mô tả contract giữa Backend (FastAPI) và Frontend (Next.js) cho các feature:

- Đăng ký / đăng nhập người dùng
- Quản lý user profile
- CRUD todos và subtasks
- Quản lý contexts (projects/categories)
- AI-powered todo extraction từ text
- Kết nối Google Chat và tự động extract todos từ messages

**Phiên bản:** v1.0  
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
- Response: Trả về array trực tiếp, không có wrapper pagination object
- FE có thể implement infinite scroll hoặc page-based pagination

### 3.5. UUIDs
- Tất cả IDs đều là **UUID v4** (string 36 chars)
- Format: `"550e8400-e29b-41d4-a716-446655440000"`

---

## 4. Response & Error Format

### 4.1. Success Response (2xx)

**Format:** Response trực tiếp là data object hoặc array, không có wrapper.

**Ví dụ:**
```json
// GET /api/v1/todos
[
  {
    "todo_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project",
    "status": "todo",
    ...
  }
]

// POST /api/v1/todos
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
10. FE hiển thị trạng thái đã bật / chưa bật cho từng space

### 5.3. Flow "Tạo Todo từ Google Chat Message"

1. User đã connect Google Chat và whitelist spaces
2. FE gọi `POST /api/v1/integration/spaces/{space_id}/messages` để lấy messages
3. User chọn messages muốn extract todos
4. FE gọi `POST /api/v1/integration/spaces/{space_id}/generate-todos` với `messageIds`
5. BE dùng AI agent extract todos từ messages
6. BE trả về statistics: số messages processed, số todos generated, số todos saved
7. FE refresh todo list để hiển thị todos mới

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
| skip          | number | no       | 0       | Offset (pagination)            |
| limit         | number | no       | 100     | Limit (max 100)                |

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
| skip       | number  | no       | 0       | Offset                   |
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
Kết nối Google Chat account, lưu refresh token đã mã hóa vào database và khởi tạo integration.

**Auth:** `required` (JWT Bearer token)

**Request Body:**
```json
{
  "refresh_token": "ya29.a0AfB_byC1234567890..."
}
```

**Fields:**
| Field         | Type   | Required | Mô tả                                    |
|---------------|--------|----------|------------------------------------------|
| refresh_token | string | yes      | Google OAuth refresh token từ next-auth |

**Response 200:**
```json
{
  "status": "connected",
  "provider": "google_chat",
  "last_sync_at": null,
  "last_error": null
}
```

**Response Fields:**
| Field        | Type    | Mô tả                                    |
|--------------|---------|------------------------------------------|
| status       | string  | `connected`, `not_connected`, hoặc `error` |
| provider     | string  | `google_chat` hoặc `null`                |
| last_sync_at | string  | ISO8601 datetime hoặc `null`             |
| last_error   | string  | Error message hoặc `null`                |

**Status Enum:** `connected`, `not_connected`, `error`

**Errors:**
- `500` – Failed to connect (encryption error, DB error)

---

#### 6.6.2. `GET /api/v1/integration/status`

**Mục đích:**  
Kiểm tra trạng thái kết nối Google Chat hiện tại. Trả về connection status, thời gian sync cuối cùng, và các lỗi (nếu có).

**Auth:** `required` (JWT Bearer token)

**Response 200:**

Nếu đã kết nối thành công:
```json
{
  "status": "connected",
  "provider": "google_chat",
  "last_sync_at": "2024-12-19T15:30:00Z",
  "last_error": null
}
```

Nếu chưa kết nối:
```json
{
  "status": "not_connected",
  "provider": null,
  "last_sync_at": null,
  "last_error": null
}
```

Nếu có lỗi (có `last_error`):
```json
{
  "status": "error",
  "provider": "google_chat",
  "last_sync_at": "2024-12-19T15:30:00Z",
  "last_error": "Failed to refresh access token"
}
```

**Response Fields:**
| Field        | Type    | Mô tả                                    |
|--------------|---------|------------------------------------------|
| status       | string  | `connected`, `not_connected`, hoặc `error` |
| provider     | string  | `google_chat` hoặc `null`                |
| last_sync_at | string  | ISO8601 datetime hoặc `null`             |
| last_error   | string  | Error message hoặc `null`                |

**Errors:**
- `500` – Failed to get status (server error)

---

#### 6.6.3. `GET /api/v1/integration/spaces`

**Mục đích:**  
Lấy danh sách Google Chat spaces với whitelist status. Endpoint này fetch tất cả spaces từ Google Chat API và merge với whitelist status từ database.

**Auth:** `required` (JWT Bearer token)

**Response 200:**
```json
{
  "spaces": [
    {
      "id": "AAAAAAAAAAA",
      "name": "Team Engineering",
      "description": "Engineering team space",
      "is_whitelisted": false,
      "display_name": "Team Engineering",
      "space_type": "SPACE"
    },
    {
      "id": "BBBBBBBBBBB",
      "name": "General Chat",
      "description": null,
      "is_whitelisted": true,
      "display_name": "General Chat",
      "space_type": "SPACE"
    }
  ]
}
```

**Response Fields:**
| Field          | Type    | Mô tả                                                      |
|----------------|---------|------------------------------------------------------------|
| spaces         | array   | Danh sách Google Chat spaces                              |
| spaces[].id    | string  | Google Chat space ID                                       |
| spaces[].name  | string  | Display name của space                                     |
| spaces[].description | string | Mô tả của space hoặc `null`                          |
| spaces[].is_whitelisted | boolean | `true` nếu space được whitelist để quét messages |
| spaces[].display_name | string | Display name hoặc `null`                    |
| spaces[].space_type | string | `SPACE`, `DIRECT_MESSAGE`, `GROUP_CONVERSATION` hoặc `null` |

**Errors:**
- `403` – User chưa connect Google Chat (ValueError)
- `500` – Google Chat API error hoặc server error

---

#### 6.6.4. `PUT /api/v1/integration/spaces/whitelist`

**Mục đích:**  
Cập nhật danh sách spaces được phép quét messages. Chỉ các spaces trong whitelist mới được background worker quét.

**Auth:** `required` (JWT Bearer token)

**Request Body:**
```json
{
  "space_ids": ["AAAAAAAAAAA", "BBBBBBBBBBB"]
}
```

**Fields:**
| Field      | Type     | Required | Mô tả                                    |
|------------|----------|----------|------------------------------------------|
| space_ids  | string[] | yes      | Danh sách space IDs để whitelist         |

**Response 200:**
```json
{
  "status": "ok",
  "updated_spaces": ["AAAAAAAAAAA", "BBBBBBBBBBB"]
}
```

**Response Fields:**
| Field          | Type     | Mô tả                                    |
|----------------|----------|------------------------------------------|
| status         | string   | `ok`                                     |
| updated_spaces | string[] | Danh sách space IDs đã được cập nhật     |

**Errors:**
- `403` – User chưa connect Google Chat (ValueError)
- `500` – Failed to update whitelist (server error)

---

#### 6.6.5. `POST /api/v1/integration/disconnect`

**Mục đích:**  
Ngắt kết nối Google Chat integration. Revoke refresh token và xóa connection khỏi database.

**Auth:** `required` (JWT Bearer token)

**Request Body:** Không cần (empty body)

**Response 200:**
```json
{
  "status": "disconnected"
}
```

**Response Fields:**
| Field  | Type   | Mô tả                                    |
|--------|--------|------------------------------------------|
| status | string | `disconnected`                          |

**Errors:**
- `404` – Không tìm thấy Google Chat connection
- `500` – Failed to disconnect (server error)

---

#### 6.6.6. `POST /api/v1/integration/spaces/{space_id}/messages`

**Mục đích:**  
Lấy messages từ Google Chat space với optional filtering. Endpoint này fetch fresh data từ Google Chat API và có thể lưu messages vào database để tham khảo sau này.

**Auth:** `required` (JWT Bearer token)

**Path Params:**
| Name     | Type   | Required | Mô tả                    |
|----------|--------|----------|---------------------------|
| space_id | string | yes      | Google Chat space ID      |

**Request Body:**
```json
{
  "start_date": "2024-12-18T00:00:00Z",
  "end_date": "2024-12-19T23:59:59Z",
  "sender_filter": "John",
  "keyword": "meeting",
  "limit": 100
}
```

**Fields:**
| Field         | Type    | Required | Default | Mô tả                                    |
|---------------|---------|----------|---------|------------------------------------------|
| start_date    | string  | no       | null    | ISO8601 datetime - Filter messages sau ngày này |
| end_date      | string  | no       | null    | ISO8601 datetime - Filter messages trước ngày này |
| sender_filter | string  | no       | null    | Filter by sender name/ID (case-insensitive) |
| keyword       | string  | no       | null    | Search keyword trong content (case-insensitive) |
| limit         | number  | no       | 100     | Maximum số messages (max: 1000)          |

**Response 200:**
```json
{
  "messages": [
    {
      "message_id": "msg-123",
      "space_id": "AAAAAAAAAAA",
      "sender_id": "user-123",
      "sender_name": "John Doe",
      "content": "Hôm nay vào họp lúc 2h30 nhé",
      "timestamp": "2024-12-19T14:30:00Z",
      "thread_id": null
    }
  ],
  "total_count": 1,
  "space_name": "Team Engineering"
}
```

**Response Fields:**
| Field         | Type    | Mô tả                                    |
|---------------|---------|------------------------------------------|
| messages      | array   | Danh sách messages                      |
| messages[].message_id | string | Google Chat message ID           |
| messages[].space_id | string | Google Chat space ID              |
| messages[].sender_id | string | Sender user ID                    |
| messages[].sender_name | string | Sender display name              |
| messages[].content | string | Message content                  |
| messages[].timestamp | string | ISO8601 datetime                |
| messages[].thread_id | string | Thread ID hoặc `null`            |
| total_count   | number  | Tổng số messages sau khi filter          |
| space_name    | string  | Display name của space                   |

**Note:** 
- Endpoint này fetch fresh data từ Google Chat API
- Messages được lưu vào database để tham khảo sau này
- Để extract todos từ messages, sử dụng endpoint `/generate-todos`

**Errors:**
- `403` – Space không trong whitelist hoặc user chưa connect Google Chat (ValueError)
- `500` – Google Chat API error hoặc server error

---

#### 6.6.7. `POST /api/v1/integration/spaces/{space_id}/generate-todos`

**Mục đích:**  
Generate todos từ Google Chat messages sử dụng AI (SpiderX AI agent với multi-provider fallback). Endpoint này sử dụng TodoExtractorAgent để extract todos từ messages, bao gồm title, priority, due date, tags, và eisenhower matrix.

**Auth:** `required` (JWT Bearer token)

**Path Params:**
| Name     | Type   | Required | Mô tả                    |
|----------|--------|----------|---------------------------|
| space_id | string | yes      | Google Chat space ID      |

**Request Body:**
```json
{
  "message_ids": ["msg-123", "msg-456"],
  "auto_save": true
}
```

**Fields:**
| Field        | Type     | Required | Default | Mô tả                                    |
|--------------|----------|----------|---------|------------------------------------------|
| message_ids  | string[] | yes      |         | Danh sách message IDs để process         |
| auto_save    | boolean  | no       | true    | Tự động lưu todos vào database           |

**Response 200:**
```json
{
  "total_messages_processed": 2,
  "total_todos_generated": 3,
  "total_todos_saved": 3,
  "summary": "Processed 2 messages from space 'Team Engineering'. Generated 3 todos, saved 3 to database."
}
```

**Response Fields:**
| Field                    | Type   | Mô tả                                    |
|--------------------------|--------|------------------------------------------|
| total_messages_processed | number | Số messages đã được process              |
| total_todos_generated    | number | Tổng số todos được AI extract            |
| total_todos_saved        | number | Số todos đã được lưu vào database (nếu `auto_save=true`) |
| summary                  | string | Tóm tắt kết quả operation                |

**AI Processing:**
- Sử dụng TodoExtractorAgent với multi-provider fallback
- Extract: title, priority, due date, tags, eisenhower matrix
- Link todos về source messages qua `source_space_id` và `source_message_id`
- Todos được tạo với `source_type: "chat"`

**Note:** 
- Todos được tạo sẽ có `source_space_id` và `source_message_id` để link về message gốc
- Nếu `auto_save=false`, todos chỉ được generate nhưng không lưu vào database
- Nếu có lỗi khi process một message, hệ thống sẽ tiếp tục process các messages khác

**Errors:**
- `404` – Không tìm thấy messages với IDs đã cho
- `403` – Space không trong whitelist hoặc user chưa connect Google Chat (ValueError)
- `500` – AI extraction error hoặc Google Chat API error

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

---

## 8. Changelog

### 2024-12-19 (v1.0)
- Tạo tài liệu lần đầu
- Thêm endpoints: Authentication, Users, Todos, Contexts, AI extraction
- Thêm Google Chat integration endpoints:
  - `/integration/connect`
  - `/integration/status`
  - `/integration/spaces`
  - `/integration/spaces/whitelist`
  - `/integration/disconnect`
  - `/integration/spaces/{space_id}/messages`
  - `/integration/spaces/{space_id}/generate-todos`
- Thêm fields `source_space_id` và `source_message_id` vào TodoItem model

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
- Default limit = 100, có thể tăng nhưng không nên quá 1000
- Implement infinite scroll hoặc "Load more" button

### 9.4. AI Extraction
- `auto_save=false` để preview trước khi save
- Hiển thị `confidence` score để user biết độ tin cậy
- Cho phép user edit todos trước khi save

### 9.5. Google Chat Integration
- Check `status` trước khi gọi các endpoints khác
- Handle `error` status và hiển thị `lastError` cho user
- Chỉ spaces được whitelist mới có thể lấy messages
- Background worker tự động scan messages mỗi 5 phút (không cần FE gọi)

---

**Cập nhật:** 2025-11-16
**Phiên bản:** 1.0.0

