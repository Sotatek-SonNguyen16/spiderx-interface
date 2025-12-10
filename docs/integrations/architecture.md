# Kiến trúc tích hợp Google Chat

## Tổng quan

Hệ thống sử dụng kiến trúc **Backend for Frontend (BFF)** kết hợp với **Worker Service**, tách biệt rõ ràng giữa:

- **Next.js (Frontend)**: Xử lý UI, authentication flow, và proxy requests
- **Backend (BE)**: Xử lý business logic, lưu trữ tokens, và sync messages định kỳ

## Luồng tích hợp chi tiết

### Giai đoạn 1: Kết nối (Trên Next.js)

1. User nhấp vào nút "Kết nối Google Chat" trên Next.js
2. Next.js (sử dụng `next-auth`) điều hướng User sang Google OAuth
3. User đồng ý cấp phép với scopes:
   - `chat.spaces.readonly`
   - `chat.messages.readonly`
4. Google redirect về Next.js với authorization code

### Giai đoạn 2: Chuyển giao Token (Next.js → BE)

1. Trong `lib/auth/config.ts`, callback `jwt` được kích hoạt
2. Next.js nhận được `access_token` và `refresh_token` từ Google
3. **Ngay lập tức**, Next.js gọi Backend API:
   ```typescript
   POST /api/v1/integration/connect
   {
     userId: "user_id",
     refreshToken: "google_refresh_token",
     initialAccessToken: "google_access_token"
   }
   ```
4. Backend:
   - Mã hóa và lưu `refreshToken` vào Database
   - Sử dụng `initialAccessToken` để gọi Google API `GET /v1/spaces`
   - Trả về danh sách spaces cho Next.js

### Giai đoạn 3: Whitelist Spaces (Trên Next.js)

1. Next.js hiển thị danh sách spaces từ Backend
2. User chọn các spaces muốn theo dõi (A, B, C)
3. User nhấn "Lưu"
4. Next.js gọi Backend API:
   ```typescript
   PUT /api/v1/spaces/whitelist
   {
     userId: "user_id",
     spaceIds: ["spaces/A", "spaces/B", "spaces/C"]
   }
   ```
5. Backend lưu whitelist vào Database

### Giai đoạn 4: Vận hành (Chỉ trên BE)

Backend chạy các worker services định kỳ:

1. **Worker 1 - Token Refresh** (mỗi 30 phút):
   - Kiểm tra các `refreshToken` sắp hết hạn
   - Dùng `refreshToken` để lấy `accessToken` mới từ Google
   - Cập nhật Database

2. **Worker 2 - Message Sync** (mỗi 5 phút):
   - Lấy danh sách `userId` và `space_whitelist` từ Database
   - Dùng `accessToken` hợp lệ để gọi Google API:
     ```
     GET /v1/spaces/{spaceId}/messages
     ```
   - Chỉ sync messages từ các spaces đã được whitelist
   - Lưu messages vào Database

## API Endpoints

### Next.js API Routes (Proxy đến Backend)

#### `GET /api/integration/status`
Kiểm tra trạng thái kết nối Google Chat.

**Response:**
```json
{
  "isConnected": true
}
```

#### `POST /api/integration/disconnect`
Ngắt kết nối Google Chat và xóa dữ liệu.

**Response:**
```json
{
  "message": "Ngắt kết nối thành công"
}
```

#### `GET /api/integration/spaces/whitelist`
Lấy danh sách tất cả spaces và whitelisted spaces.

**Response:**
```json
{
  "allSpaces": [
    { "name": "spaces/AAAA...", "displayName": "Space A" },
    { "name": "spaces/BBBB...", "displayName": "Space B" }
  ],
  "whitelistedSpaces": ["spaces/AAAA...", "spaces/BBBB..."]
}
```

#### `PUT /api/integration/spaces/whitelist`
Cập nhật danh sách whitelisted spaces.

**Request Body:**
```json
{
  "spaceIds": ["spaces/AAAA...", "spaces/BBBB..."]
}
```

**Response:**
```json
{
  "message": "Cập nhật whitelist thành công"
}
```

### Backend API Endpoints

#### `POST /api/v1/integration/connect`
Nhận và lưu refresh token, đồng thời lấy danh sách spaces ban đầu.

**Request Body:**
```json
{
  "userId": "user_id",
  "refreshToken": "google_refresh_token",
  "initialAccessToken": "google_access_token"
}
```

**Response:**
```json
{
  "spaces": [
    { "name": "spaces/AAAA...", "displayName": "Space A" },
    { "name": "spaces/BBBB...", "displayName": "Space B" }
  ]
}
```

**Bảo mật:** API này phải được bảo vệ bằng API Key (`X-API-Key` header).

#### `POST /api/v1/integration/disconnect`
Ngắt kết nối và xóa dữ liệu.

**Request Body:**
```json
{
  "userId": "user_id"
}
```

**Hành động:**
1. Lấy `refreshToken` từ Database
2. Gọi Google API để revoke token
3. Xóa `refreshToken`, `space_whitelist`, và messages từ Database

#### `GET /api/v1/integration/status`
Kiểm tra user đã kết nối hay chưa.

**Query Params:** `?userId=user_id`

**Response:**
```json
{
  "isConnected": true
}
```

#### `GET /api/v1/spaces/whitelist`
Lấy danh sách spaces hiện tại và whitelisted spaces.

**Query Params:** `?userId=user_id`

**Hành động:**
1. Lấy `accessToken` mới cho User (từ refresh token)
2. Gọi Google API `GET /v1/spaces`
3. Lấy `space_whitelist` từ Database

**Response:**
```json
{
  "allSpaces": [
    { "name": "spaces/AAAA...", "displayName": "Space A" },
    { "name": "spaces/BBBB...", "displayName": "Space B" }
  ],
  "whitelistedSpaces": ["spaces/AAAA...", "spaces/BBBB..."]
}
```

#### `PUT /api/v1/spaces/whitelist`
Cập nhật danh sách whitelisted spaces.

**Request Body:**
```json
{
  "userId": "user_id",
  "spaceIds": ["spaces/AAAA...", "spaces/BBBB..."]
}
```

**Response:**
```json
{
  "message": "Cập nhật whitelist thành công"
}
```

## Cấu trúc Database (Backend)

### Bảng `google_chat_integrations`

```sql
CREATE TABLE google_chat_integrations (
  id UUID PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  refresh_token_encrypted TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Bảng `google_chat_space_whitelist`

```sql
CREATE TABLE google_chat_space_whitelist (
  id UUID PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  space_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, space_id)
);
```

### Bảng `google_chat_messages`

```sql
CREATE TABLE google_chat_messages (
  id UUID PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  space_id VARCHAR(255) NOT NULL,
  message_id VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255),
  sender_display_name VARCHAR(255),
  text TEXT,
  created_at TIMESTAMP,
  synced_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(space_id, message_id)
);
```

## Environment Variables

### Next.js (.env.local)

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Backend API
BACKEND_API_URL=http://localhost:8000
BACKEND_API_KEY=your_backend_api_key
```

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://...

# Google OAuth (để refresh tokens)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Encryption
ENCRYPTION_KEY=your_encryption_key

# API Key để xác thực requests từ Next.js
API_KEY=your_backend_api_key
```

## Bảo mật

1. **Refresh Token Encryption**: Refresh tokens được mã hóa trước khi lưu vào Database
2. **API Key Authentication**: Backend API được bảo vệ bằng API Key
3. **Token Revocation**: Khi disconnect, Backend gọi Google API để revoke token
4. **Scope Limitation**: Chỉ request các scopes cần thiết (`readonly`)

## Worker Services (Backend)

### Token Refresh Worker

Chạy định kỳ mỗi 30 phút:

```typescript
async function refreshTokens() {
  const integrations = await getIntegrationsNeedingRefresh();
  
  for (const integration of integrations) {
    try {
      const newAccessToken = await refreshGoogleToken(integration.refreshToken);
      await updateAccessToken(integration.userId, newAccessToken);
    } catch (error) {
      // Log error, có thể mark integration as invalid
    }
  }
}
```

### Message Sync Worker

Chạy định kỳ mỗi 5 phút:

```typescript
async function syncMessages() {
  const users = await getUsersWithWhitelistedSpaces();
  
  for (const user of users) {
    const accessToken = await getValidAccessToken(user.id);
    const whitelistedSpaces = await getWhitelistedSpaces(user.id);
    
    for (const spaceId of whitelistedSpaces) {
      try {
        const messages = await fetchGoogleChatMessages(accessToken, spaceId);
        await saveMessages(user.id, spaceId, messages);
      } catch (error) {
        // Log error
      }
    }
  }
}
```

## Lợi ích của kiến trúc này

1. **Bảo mật cao**: Refresh tokens được lưu an toàn trên Backend, không expose ra client
2. **Scalable**: Backend có thể scale độc lập với Next.js
3. **Reliable**: Worker services đảm bảo messages được sync định kỳ
4. **Separation of Concerns**: Frontend chỉ lo UI, Backend lo business logic
5. **Maintainable**: Dễ maintain và debug từng phần riêng biệt

