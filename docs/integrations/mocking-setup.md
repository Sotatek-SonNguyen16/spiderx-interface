# Hướng dẫn Setup Mock API cho Google Chat Integration

## Tổng quan

Khi Backend chưa sẵn sàng, bạn có thể sử dụng mock API để phát triển Frontend. Mock sẽ tự động intercept các API calls và trả về dữ liệu giả lập.

## Cài đặt

### Bước 1: Cài đặt Dependencies

Dependencies đã được cài đặt:
- `axios-mock-adapter` - Để mock API calls (client-side)
- `zustand` - Để quản lý state

### Bước 2: Cấu hình Environment Variables

Thêm vào file `.env.local`:

```env
# URL Backend API (có thể chưa chạy, nhưng vẫn cần để axios hoạt động)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# ✨ FLAG ĐỂ BẬT MOCKUP ✨
# Đặt là "enabled" để bật mock, xóa dòng này hoặc đặt giá trị khác để tắt
NEXT_PUBLIC_API_MOCKING=enabled
```

### Bước 3: Restart Dev Server

Sau khi thêm environment variable, restart dev server:

```bash
pnpm dev
```

Bạn sẽ thấy log trong console:
```
🔥 Google Chat API Mocking ENABLED
✅ Mock adapter initialized for Google Chat API
```

## Mock Data

Mock data được định nghĩa trong `features/googleChat/api/googleChat.mock-data.ts`:

- **5 Spaces mẫu**: 
  - Team Standup (whitelisted)
  - Random
  - Project Phoenix
  - Engineering Chat (whitelisted)
  - Product Updates
- **Status mẫu**: connected, not_connected, error
- **Whitelist mẫu**: 2 spaces đã được whitelist

## Mock API Endpoints

### `GET /api/integration/status`
- Trả về trạng thái kết nối hiện tại
- Ban đầu: `not_connected`
- Sau khi connect: `connected`

**Mock Response:**
```json
{
  "status": "connected",
  "provider": "google_chat",
  "lastSyncAt": "2025-01-16T10:00:00Z",
  "lastError": null
}
```

### `POST /api/integration/connect`
- Giả lập kết nối Google Chat
- Cập nhật status thành `connected`
- Trả về danh sách spaces mẫu
- Được gọi tự động trong auth callback khi user đăng nhập

**Mock Response:**
```json
{
  "status": "connected"
}
```

### `POST /api/integration/disconnect`
- Giả lập ngắt kết nối
- Reset status về `not_connected`
- Xóa danh sách spaces

**Mock Response:**
```json
{
  "status": "disconnected"
}
```

### `GET /api/integration/spaces`
- Trả về danh sách spaces mẫu
- Chỉ hoạt động khi status = `connected`
- Bao gồm thông tin `isWhitelisted` cho mỗi space

**Mock Response:**
```json
{
  "spaces": [
    {
      "id": "spaces/AAA",
      "name": "Team Standup",
      "description": "Daily standup room",
      "isWhitelisted": true
    },
    {
      "id": "spaces/BBB",
      "name": "Random",
      "description": null,
      "isWhitelisted": false
    }
  ]
}
```

### `PUT /api/integration/spaces/whitelist`
- Cập nhật whitelist
- Nhận `{ spaceIds: string[] }`
- Cập nhật `isWhitelisted` cho các spaces tương ứng

**Mock Request:**
```json
{
  "spaceIds": ["spaces/AAA", "spaces/BBB"]
}
```

### `GET /api/v1/todos`
- Trả về danh sách todos dạng array (không có wrapper)
- Hỗ trợ query: `skip`, `limit`, `status_filter`, `context_id`, `keyword`

**Mock Response:**
```json
[
  {
    "todo_id": "todo-1",
    "title": "Set auto-kill time for pods running over 3 hours",
    "status": "in_progress",
    "priority": "medium",
    "due_date": null,
    "tags": ["bot", "meeting"],
    "created_at": "2025-01-12T08:00:00Z",
    "updated_at": "2025-01-12T08:00:00Z"
  }
]
```

**Mock Response:**
```json
{
  "status": "ok",
  "updatedSpaces": ["spaces/AAA", "spaces/BBB"]
}
```

## Sử dụng trong Code

### Cách 1: Sử dụng Hook (Khuyến nghị)

```typescript
"use client";

import { useGoogleChat } from "@/features/googleChat";

export default function IntegrationPage() {
  const {
    isConnected,
    status,
    spaces,
    loading,
    error,
    fetchStatus,
    fetchSpaces,
    updateWhitelist,
    disconnect,
    refresh,
  } = useGoogleChat();

  // Hook tự động fetch status khi mount
  // Tự động fetch spaces nếu đã connected

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {spaces.map((space) => (
        <div key={space.id}>
          <input
            type="checkbox"
            checked={space.isWhitelisted}
            onChange={() => {
              const newIds = space.isWhitelisted
                ? spaces.filter((s) => s.id !== space.id).map((s) => s.id)
                : [...spaces.map((s) => s.id), space.id];
              updateWhitelist(newIds);
            }}
          />
          <span>{space.name}</span>
        </div>
      ))}
    </div>
  );
}
```

### Cách 2: Sử dụng Service trực tiếp

```typescript
import { googleChatService } from "@/features/googleChat";

const result = await googleChatService.fetchSpaces(userId);
if (result.error) {
  console.error(result.error);
} else {
  console.log(result.data?.spaces);
}
```

## Tắt Mock khi Backend Ready

Khi Backend đã sẵn sàng (ví dụ: chạy ở `http://localhost:8002`):

### Bước 1: Tạo file `.env.local` (nếu chưa có)

Tạo file `.env.local` ở root của project với nội dung:

```env
# Tắt Mock
NEXT_PUBLIC_API_MOCKING=disabled

# Backend API URL (local dev - port 8002)
BACKEND_API_URL=http://localhost:8002
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8002

# Client-side API Base URL (không bao gồm /api/v1 vì đã có trong code)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8002

# Backend API Key (nếu BE yêu cầu)
BACKEND_API_KEY=your-api-key-here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Bước 2: Restart Dev Server

```bash
# Stop server hiện tại (Ctrl+C)
# Sau đó start lại
pnpm dev
```

### Bước 3: Kiểm tra

- Mở browser console, không còn log "🔥 API Mocking ENABLED"
- Các API calls sẽ gọi đến `http://localhost:8002/api/v1/...`
- Kiểm tra Network tab để xác nhận requests đang gọi đến Backend thật

### Lưu ý

- **`NEXT_PUBLIC_API_MOCKING`**: Đặt `disabled` hoặc xóa dòng này để tắt mock
- **`BACKEND_API_URL`**: URL Backend cho server-side calls (Next.js API routes)
- **`NEXT_PUBLIC_API_BASE_URL`**: URL Backend cho client-side calls (React components)
- **`BACKEND_API_KEY`**: Chỉ cần nếu Backend yêu cầu API Key authentication

Code sẽ tự động gọi đến Backend thật mà không cần thay đổi gì!

## Kiến trúc

Mock được implement theo kiến trúc `request-architecture.md`:

```
Component → Hook → Service → API → Mock Adapter/Mock Server → Mock Data
```

- **Component**: UI components
- **Hook**: `useGoogleChat` - React hook với state management
- **Service**: `googleChatService` - Business logic và error handling
- **API**: `googleChatApi` - API calls với `apiClient` (client-side)
- **API Routes**: Next.js API routes với `mockServerApi` (server-side)
- **Mock Adapter**: Intercept client-side requests (axios-mock-adapter)
- **Mock Server**: Mock functions cho server-side calls
- **Mock Data**: Dữ liệu giả lập

## Mock Implementation Details

### Client-side Mock (`lib/api/mock.ts`)
- Sử dụng `axios-mock-adapter` để intercept các requests từ `apiClient`
- Chỉ hoạt động khi `NEXT_PUBLIC_API_MOCKING === "enabled"` và ở client-side
- Có delay 500ms để giả lập network latency

### Server-side Mock (`lib/api/mock-server.ts`)
- Mock functions cho các API routes
- Được sử dụng trong `app/api/` routes
- State được lưu trong memory (reset khi restart server)

### Auth Callback Mock (`lib/auth/config.ts`)
- Tự động sử dụng mock khi connect trong OAuth callback
- Không cần thay đổi code khi Backend ready

## Lưu ý

1. **Mock chỉ hoạt động khi flag được bật**: `NEXT_PUBLIC_API_MOCKING=enabled`

2. **State persistence**: 
   - Client-side mock: State reset khi refresh page
   - Server-side mock: State reset khi restart dev server

3. **API Routes**: Các API routes trong `app/api/` tự động sử dụng mock khi flag được bật

4. **Auth Flow**: Token vẫn được "gửi" (mock) trong auth callback, không cần thay đổi code

5. **Delay simulation**: Mock có delay 500ms để giả lập network latency

## Troubleshooting

### Mock không hoạt động
- Kiểm tra `NEXT_PUBLIC_API_MOCKING=enabled` trong `.env.local`
- Restart dev server sau khi thay đổi env vars
- Kiểm tra console có log "🔥 Google Chat API Mocking ENABLED"

### Lỗi "Cannot find module"
- Đảm bảo đã cài đặt dependencies: `pnpm add axios-mock-adapter zustand`

### Mock hoạt động nhưng không có data
- Kiểm tra `userId` có được truyền đúng không
- Kiểm tra status có phải `connected` không (cần connect trước)
- Với mock, bạn cần "đăng nhập" trước để trigger connect callback

### State bị reset
- Đây là hành vi bình thường của mock (state trong memory)
- Client-side mock: Reset khi refresh page
- Server-side mock: Reset khi restart server
