# Hướng dẫn Kết nối với Backend Thật

Khi Backend đã sẵn sàng và chạy ở port 8002, làm theo các bước sau để tắt mock và kết nối với Backend thật.

## Bước 1: Tạo/Cập nhật file `.env.local`

Tạo file `.env.local` ở root của project (cùng cấp với `package.json`) với nội dung:

```env
# ============================================
# Tắt Mock - Kết nối với Backend thật
# ============================================
NEXT_PUBLIC_API_MOCKING=disabled

# ============================================
# Backend API Configuration
# ============================================
# Backend URL (local dev - port 8002)
BACKEND_API_URL=http://localhost:8002
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8002

# Client-side API Base URL
# Lưu ý: Không bao gồm /api/v1 vì đã có trong code
NEXT_PUBLIC_API_BASE_URL=http://localhost:8002

# Backend API Key (nếu BE yêu cầu authentication bằng API Key)
BACKEND_API_KEY=your-api-key-here

# ============================================
# NextAuth Configuration
# ============================================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# ============================================
# Google OAuth Configuration
# ============================================
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Bước 2: Restart Dev Server

```bash
# Stop server hiện tại (Ctrl+C trong terminal đang chạy pnpm dev)
# Sau đó start lại
pnpm dev
```

## Bước 3: Kiểm tra Kết nối

### 3.1. Kiểm tra Console Log

Mở browser console (F12), bạn sẽ **KHÔNG** thấy log:
```
🔥 API Mocking ENABLED (Google Chat + Todos)
```

Nếu không thấy log này nghĩa là mock đã được tắt thành công.

### 3.2. Kiểm tra Network Requests

1. Mở **Network tab** trong browser DevTools (F12 → Network)
2. Thực hiện một action (ví dụ: load todos, check integration status)
3. Kiểm tra requests:
   - URL phải là `http://localhost:8002/api/v1/...`
   - Status code phải là 200 (hoặc các status code hợp lệ từ BE)
   - Response phải là data thật từ Backend

### 3.3. Kiểm tra API Endpoints

Các endpoints sẽ được gọi như sau:

**Client-side (từ React components):**
- `http://localhost:8002/api/v1/integration/status`
- `http://localhost:8002/api/v1/integration/spaces`
- `http://localhost:8002/api/v1/todos`
- ...

**Server-side (từ Next.js API routes):**
- `http://localhost:8002/api/v1/integration/connect`
- `http://localhost:8002/api/v1/integration/disconnect`
- `http://localhost:8002/api/v1/integration/spaces/whitelist`
- ...

## Troubleshooting

### Lỗi: "BACKEND_API_URL is not configured"

**Nguyên nhân:** Chưa set `BACKEND_API_URL` trong `.env.local`

**Giải pháp:** Đảm bảo file `.env.local` có dòng:
```env
BACKEND_API_URL=http://localhost:8002
```

### Lỗi: "Network Error" hoặc "Connection Refused"

**Nguyên nhân:** Backend chưa chạy hoặc chạy ở port khác

**Giải pháp:**
1. Kiểm tra Backend có đang chạy ở port 8002 không
2. Thử mở `http://localhost:8002/api/v1/health` (nếu có) trong browser
3. Cập nhật `BACKEND_API_URL` và `NEXT_PUBLIC_API_BASE_URL` nếu Backend chạy ở port khác

### Lỗi: "401 Unauthorized"

**Nguyên nhân:** Chưa có JWT token hoặc token đã hết hạn

**Giải pháp:**
1. Đảm bảo đã login vào ứng dụng
2. Kiểm tra token có được lưu trong localStorage không (client-side)
3. Kiểm tra session có hợp lệ không (server-side)

### Mock vẫn hoạt động

**Nguyên nhân:** 
- Chưa restart dev server sau khi thay đổi `.env.local`
- File `.env.local` không được đọc đúng

**Giải pháp:**
1. Stop và restart dev server hoàn toàn
2. Kiểm tra file `.env.local` có ở đúng vị trí (root của project)
3. Kiểm tra syntax của file `.env.local` (không có spaces thừa, không có quotes không cần thiết)

## Cấu trúc Environment Variables

| Variable | Mục đích | Ví dụ |
|----------|----------|-------|
| `NEXT_PUBLIC_API_MOCKING` | Bật/tắt mock | `disabled` hoặc `enabled` |
| `BACKEND_API_URL` | URL Backend cho server-side | `http://localhost:8002` |
| `NEXT_PUBLIC_BACKEND_API_URL` | URL Backend cho client-side (fallback) | `http://localhost:8002` |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL cho `apiClient` (client-side) | `http://localhost:8002` |
| `BACKEND_API_KEY` | API Key nếu BE yêu cầu | `your-api-key` |

## Lưu ý Quan trọng

1. **File `.env.local` không được commit vào Git** (đã có trong `.gitignore`)
2. **Restart dev server** sau mỗi lần thay đổi `.env.local`
3. **Base URL không bao gồm `/api/v1`** vì đã được hardcode trong các API calls
4. **Backend phải chạy ở port 8002** (hoặc cập nhật URL trong `.env.local`)

## Xem thêm

- [Mocking Setup Guide](./integrations/mocking-setup.md) - Hướng dẫn chi tiết về mocking
- [Backend Interface Spec](./interface/interface_fe.md) - Tài liệu API contract với Backend

