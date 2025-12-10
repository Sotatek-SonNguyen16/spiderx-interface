FE:

# Update v0:
Bổ sung button Sync Todo in Queue. By default: Lấy tin nhắn từ thời điểm Sync gần nhất đến thời điểm hiện tại để extract Todo
Button Sync Todo in Queue: cho phép user chọn time range lấy tin nhắn để extract Todo
Bổ sung màn Todo Detail
Bổ sung Tên chat thread + link đến Chat Thread (UI đã có)
UI: bổ sung tên Assignee trong Todo items
Bổ sung usecase Gen Sub-tasks
Tối ưu UI Manage Chat thread (Whitelist)

# Update v1:

Tóm tắt nhanh
Home: thể hiện được DS Chat Thread đã connect. Ideas: todo list filter by Chat Thread
Bổ sung button Sync Todo mannually
Paste context >> extract action item. Ideas: Paste text => gen Todo
Thêm scope chat.memberships.readonly => lấy lên người gửi tin nhắn
---

## Mục đích

API này dùng để **chạy job async** tạo TODO từ tin nhắn Google Chat (có whitelisted spaces), tránh bị timeout khi:

* Scan **nhiều spaces** cùng lúc
* Xử lý **nhiều message** trong 1 space

Flow chuẩn là: **Start task → Poll status → Lấy result / error → (Optional) Cancel task**

---

## 1. Start Task

### 1.1. Generate TODO cho **tất cả whitelisted spaces**

**Endpoint**

* `POST /api/v1/google-chat/integration/tasks/whitelist/generate-todos`

**Body**

```json
{
  "autoSave": true,        // optional, default true
  "limitPerSpace": 100     // optional, default 100, 1-1000
}
```

**Response**

* Trả về **task info** chứ không trả data ngay:

```json
{
  "taskId": "uuid",
  "status": "PENDING",
  "message": "Task started to process 3 whitelisted spaces",
  "pollUrl": "/api/v1/google-chat/integration/tasks/<taskId>"
}
```

---

### 1.2. Generate TODO cho **1 space cụ thể**

**Endpoint**

* `POST /api/v1/google-chat/integration/tasks/spaces/{spaceId}/generate-todos`

**Body**

```json
{
  "messageIds": ["msg1", "msg2"], // optional, null => fetch all messages
  "autoSave": true,               // optional, default true
  "limit": 30                     // optional, default 30, 1-1000
}
```

**Response**

* Format giống endpoint whitelist: trả `taskId`, `status`, `pollUrl`.

---

## 2. Poll Task Status (quan trọng nhất)

**Endpoint**

* `GET /api/v1/google-chat/integration/tasks/{taskId}`

**Các trạng thái chính**

* `PENDING` / `STARTED` → job mới tạo / đang xếp hàng → **tiếp tục poll**
* `PROGRESS` → đang xử lý, có thông tin tiến độ → **tiếp tục poll**
* `SUCCESS` → xong → **dừng poll, dùng dữ liệu `result`**
* `FAILURE` → fail → **dừng poll, hiển thị `error`**
* `REVOKED` → đã bị cancel → dừng

### Response mẫu

#### PENDING / STARTED

```json
{
  "taskId": "...",
  "status": "PENDING",
  "progress": null,
  "result": null,
  "error": null
}
```

#### PROGRESS (đang chạy)

```json
{
  "taskId": "...",
  "status": "PROGRESS",
  "progress": {
    "progress": "Processed 2/5 spaces...",
    "percent": 50,
    "completed_spaces": 2,
    "total_spaces": 5
  },
  "result": null,
  "error": null
}
```

#### SUCCESS – task **whitelisted spaces**

```json
{
  "taskId": "...",
  "status": "SUCCESS",
  "result": {
    "status": "SUCCESS",
    "result": {
      "total_messages_processed": 45,
      "total_todos_generated": 8,
      "total_todos_saved": 8,
      "processed_spaces": [
        "Project Alpha (20 msgs)",
        "Team Chat (15 msgs)",
        "Support (10 msgs)"
      ],
      "todos": [ /* list todo objects */ ],
      "summary": "Processed 45 messages from 3 spaces. Generated 8 todos, saved 8."
    }
  },
  "error": null
}
```

#### SUCCESS – task **specific space**

```json
{
  "taskId": "...",
  "status": "SUCCESS",
  "result": {
    "status": "SUCCESS",
    "result": {
      "total_messages_processed": 20,
      "total_todos_generated": 5,
      "total_todos_saved": 5,
      "space_name": "Project Alpha",
      "todos": [ /* list todo objects */ ],
      "summary": "Processed 20 messages from 'Project Alpha'. Generated 5 todos, saved 5."
    }
  },
  "error": null
}
```

#### FAILURE

```json
{
  "taskId": "...",
  "status": "FAILURE",
  "error": "Failed to connect to Google Chat API: invalid_grant"
}
```

---

## 3. Cancel Task

**Endpoint**

* `DELETE /api/v1/google-chat/integration/tasks/{taskId}`

**Response**

* `204 No Content` nếu cancel OK
* `400 Bad Request` nếu task đã `SUCCESS` / `FAILURE` (tức là completed rồi, không cancel được nữa)

---

## 4. Todo Object (output)

Mỗi TODO có dạng:

| Field              | Type        | Note                                                                                              |
| ------------------ | ----------- | ------------------------------------------------------------------------------------------------- |
| `todoId`           | string|null | UUID nếu `autoSave=true`, ngược lại có thể null                                                   |
| `title`            | string      | Tiêu đề                                                                                           |
| `description`      | string      | Mô tả                                                                                             |
| `priority`         | string      | `low` | `medium` | `high` | `urgent`                                                              |
| `dueDate`          | string|null | ISO datetime                                                                                      |
| `estimatedTime`    | number|null | phút                                                                                              |
| `tags`             | string[]    | list tags                                                                                         |
| `eisenhower`       | string|null | `urgent_important` | `not_urgent_important` | `urgent_not_important` | `not_urgent_not_important` |
| `sourceSpaceId`    | string|null | Google Chat space ID                                                                              |
| `sourceSpaceName`  | string|null | Tên space                                                                                         |
| `sourceMessageId`  | string|null | Message ID nguồn                                                                                  |
| `sourceThreadName` | string[]    | **Thread names** (field mới thêm theo request chị Thủy)                                           |

---

## 5. HTTP Error Codes

| Code | Ý nghĩa                                                         |
| ---- | --------------------------------------------------------------- |
| 400  | Bad Request (ví dụ: không có whitelisted spaces, invalid input) |
| 403  | Không được phép (chưa connect / space không whitelisted)        |
| 500  | Server error                                                    |

---

TODO response:

export type Root = {
  taskId: string
  status: string
  progress: any
  result: {
    status: string
    result: {
      total_messages_processed: number
      total_todos_generated: number
      total_todos_saved: number
      processed_spaces: Array<string>
      todos: Array<{
        todoId: string
        title: string
        description: string
        priority: string
        dueDate: string
        estimatedTime?: number
        tags: Array<string>
        eisenhower: string
        sourceSpaceId: string
        sourceSpaceName: string
        sourceMessageId: string
        sourceThreadName: Array<string>
      }>
      summary: string
    }
  }
  error: any
}

Update flow:
1. thêm cta button trong landing page tại header
2. login first
3. home page: /todos
4. kiểm tra tk đã integrate google chat hay chưa: chưa thì navigate đến màn integrate, rồi thì ở màn todos