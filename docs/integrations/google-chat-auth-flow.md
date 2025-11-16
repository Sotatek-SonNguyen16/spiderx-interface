# Google Chat Authentication Flow - Chi tiết Implementation

## Tổng quan

Document này giải thích cách **refresh_token** của Google được lấy và gửi đến Backend FastAPI một cách **an toàn**, mà **không bao giờ lộ ra client/browser**.

## Kiến trúc Bảo mật

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Browser   │─────▶│   Next.js    │─────▶│  Google OAuth│      │   Backend    │
│   (Client)  │◀─────│   (Server)   │◀─────│              │      │   (FastAPI)  │
└─────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
                            │                                            ▲
                            │                                            │
                            └────────────────────────────────────────────┘
                                  Server-to-Server (Secure)
```

**Nguyên tắc quan trọng:**
- `refresh_token` **không bao giờ** được gửi từ client (browser)
- `refresh_token` chỉ tồn tại ở server-side (Next.js và Backend)
- Tất cả giao tiếp với Backend đều qua server-side hoặc API proxy

## Flow Chi tiết

### Bước 1: User Đăng nhập với Google

**File:** `app/(auth)/integration/page.tsx`

```typescript
// User click button "Đăng nhập với Google"
<button onClick={() => signIn("google")}>
  Đăng nhập với Google
</button>
```

### Bước 2: Next.js xử lý OAuth (Server-side)

**File:** `lib/auth/config.ts`

`next-auth` được cấu hình với:

```typescript
Google({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  authorization: {
    params: {
      prompt: "consent",        // BẮT BUỘC: Hiển thị consent screen
      access_type: "offline",   // BẮT BUỘC: Lấy refresh_token
      response_type: "code",
      scope: GOOGLE_SCOPES.join(" "),
    },
  },
})
```

**Scopes yêu cầu:**
- `https://www.googleapis.com/auth/userinfo.profile`
- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/chat.messages.readonly`
- `https://www.googleapis.com/auth/chat.spaces.readonly`

### Bước 3: Callback JWT - Gửi Token đến Backend (Server-side)

**File:** `lib/auth/config.ts` - Callback `jwt`

```typescript
async jwt({ token, user, account }) {
  // Lần đăng nhập đầu tiên (khi `account` tồn tại)
  if (account && user) {
    // Lưu tokens vào JWT
    token.accessToken = account.access_token;
    token.refreshToken = account.refresh_token;
    token.userId = user.id;

    // ✨ GỬI REFRESH_TOKEN ĐẾN BACKEND (Server-to-Server)
    if (
      account.provider === "google" &&
      account.refresh_token &&
      user.id
    ) {
      try {
        await connectGoogleChat({
          userId: user.id,
          refreshToken: account.refresh_token,
          initialAccessToken: account.access_token,
        });
        
        token.googleConnected = true;
      } catch (error) {
        token.googleConnectError = error.message;
      }
    }
  }
  
  return token;
}
```

**File:** `lib/api/backend-client.ts`

```typescript
export async function connectGoogleChat(data: {
  userId: string;
  refreshToken: string;
  initialAccessToken?: string;
}) {
  return callBackendAPI(
    "/api/v1/integration/connect",
    {
      method: "POST",
      body: {
        userId: data.userId,
        refreshToken: data.refreshToken,
        initialAccessToken: data.initialAccessToken,
      },
    }
  );
}
```

**Request gửi đến Backend:**
```http
POST http://your-backend-url/api/v1/integration/connect
Content-Type: application/json
X-API-Key: your-backend-api-key

{
  "userId": "user_123",
  "refreshToken": "ya29.a0AfB_byC1234567890...",
  "initialAccessToken": "ya29.a0AfB_byD0987654321..."
}
```

### Bước 4: Backend Lưu Token

Backend FastAPI sẽ:
1. Nhận `userId`, `refreshToken`, `initialAccessToken`
2. Mã hóa `refreshToken` và lưu vào database
3. (Optional) Sử dụng `initialAccessToken` để fetch danh sách spaces từ Google
4. Trả về status `"connected"`

**Backend Response:**
```json
{
  "status": "connected",
  "provider": "google_chat",
  "lastSyncAt": null,
  "lastError": null
}
```

### Bước 5: Callback Session - Gửi Trạng thái về Client

**File:** `lib/auth/config.ts` - Callback `session`

```typescript
async session({ session, token }) {
  if (session.user) {
    session.user.id = token.userId as string;
    session.user.email = token.userEmail as string;
  }
  
  // Gửi trạng thái kết nối (KHÔNG gửi refresh_token)
  session.googleConnected = token.googleConnected;
  session.googleConnectError = token.googleConnectError;
  
  return session;
}
```

### Bước 6: Client Nhận Trạng thái

**File:** `app/(auth)/integration/page.tsx`

Client chỉ nhận được:
```typescript
const { data: session } = useSession();

// session chỉ chứa:
{
  user: { id, email, name, image },
  googleConnected: true,    // Trạng thái kết nối
  googleConnectError: null, // Lỗi (nếu có)
  // KHÔNG CÓ refresh_token
}
```

## Reconnect Flow (User Manual)

Nếu user cần reconnect thủ công (ví dụ: sau khi có lỗi), họ có thể click nút "Kết nối với Backend":

### Flow Reconnect

**File:** `app/(auth)/integration/page.tsx`

```typescript
const handleConnectToBackend = async () => {
  // Gọi API proxy Next.js (không truyền tham số)
  const result = await connect();
};
```

**File:** `features/googleChat/hooks/useGoogleChat.ts`

```typescript
const connect = useCallback(async () => {
  // Gọi API proxy - server sẽ lấy refreshToken từ session
  const result = await googleChatService.connect();
  // ...
}, [userId, setLoading, setError, fetchStatus, fetchSpaces]);
```

**File:** `features/googleChat/api/googleChat.api.ts`

```typescript
connect: async (): Promise<ConnectApiResponse> => {
  // Gọi Next.js proxy route
  const response = await fetch("/api/integration/connect", {
    method: "POST",
    credentials: "include", // Gửi cookies (next-auth session)
  });
  
  return await response.json();
}
```

**File:** `app/api/integration/connect/route.ts` (Next.js Proxy)

```typescript
export async function POST() {
  const session = await auth();
  
  // Lấy refreshToken từ next-auth JWT token (server-side)
  const token = await getToken({ ... });
  
  if (!token?.refreshToken) {
    return NextResponse.json(
      { error: "Không tìm thấy refresh token" },
      { status: 400 }
    );
  }
  
  // Gửi đến Backend
  const result = await connectGoogleChat({
    userId: session.user.id,
    refreshToken: token.refreshToken,
  });
  
  return NextResponse.json(result);
}
```

## Luồng Data

```
1. Browser: signIn("google")
   ↓
2. Next.js Server: OAuth với Google
   ↓
3. Google: Trả về authorization code
   ↓
4. Next.js Server: Exchange code → access_token + refresh_token
   ↓
5. Next.js Server (jwt callback):
   - Lưu tokens vào JWT token (server-side)
   - Gọi Backend API: POST /api/v1/integration/connect
   ↓
6. Backend FastAPI:
   - Nhận userId, refreshToken, initialAccessToken
   - Mã hóa và lưu vào database
   - Trả về status "connected"
   ↓
7. Next.js Server (session callback):
   - Tạo session cho client
   - CHỈ gửi: user info, googleConnected status
   - KHÔNG gửi: refresh_token
   ↓
8. Browser: Nhận session
   - Hiển thị trạng thái "Đã kết nối"
   - Có thể fetch danh sách spaces
```

## Security Checklist

✅ `refresh_token` không bao giờ được gửi từ client (browser)  
✅ `refresh_token` chỉ tồn tại ở server-side (Next.js JWT token - HttpOnly cookie)  
✅ Communication với Backend luôn qua server-side hoặc API proxy  
✅ Client chỉ nhận trạng thái kết nối, không nhận tokens  
✅ Backend mã hóa `refresh_token` trước khi lưu vào database  

## Environment Variables

**Next.js (`.env.local`):**
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Next-auth
AUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Backend API
BACKEND_API_URL=http://localhost:8000
BACKEND_API_KEY=your_backend_api_key
```

**Backend FastAPI (`.env`):**
```env
# Google OAuth (để refresh token)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Encryption
ENCRYPTION_KEY=your_encryption_key_for_tokens

# Database
DATABASE_URL=postgresql://...
```

## Troubleshooting

### Không nhận được refresh_token

**Nguyên nhân:** Google chỉ trả `refresh_token` lần đầu user đồng ý, hoặc khi `prompt=consent`

**Giải pháp:**
1. Đảm bảo `prompt: "consent"` trong config Google provider
2. Hoặc revoke access trên Google: https://myaccount.google.com/permissions
3. Đăng nhập lại

### Lỗi "Không tìm thấy refresh token"

**Nguyên nhân:** Next-auth session không có `refreshToken`

**Giải pháp:**
1. Kiểm tra JWT token có `refreshToken` không (server-side log)
2. Đảm bảo `access_type: "offline"` trong Google config
3. User cần đăng nhập lại với Google

### Backend báo lỗi 401 Unauthorized

**Nguyên nhân:** Backend không nhận được `BACKEND_API_KEY` hoặc JWT token không hợp lệ

**Giải pháp:**
1. Kiểm tra `BACKEND_API_KEY` trong `.env.local`
2. Kiểm tra Backend có config CORS đúng không
3. Kiểm tra request headers có `X-API-Key` không

## Files liên quan

- `lib/auth/config.ts` - Next-auth configuration & callbacks
- `lib/api/backend-client.ts` - Backend API client
- `app/api/integration/connect/route.ts` - Next.js proxy route
- `features/googleChat/hooks/useGoogleChat.ts` - React hook
- `features/googleChat/api/googleChat.api.ts` - API calls
- `app/(auth)/integration/page.tsx` - Integration page UI
- `types/next-auth.d.ts` - TypeScript type definitions

