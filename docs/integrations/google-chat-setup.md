# Hướng dẫn tích hợp Google Chat OAuth

## Bước 1: Cài đặt Dependencies

```bash
npm install next-auth@beta
```

Hoặc nếu bạn muốn dùng phiên bản stable:

```bash
npm install next-auth
```

## Bước 2: Cấu hình Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo một project mới hoặc chọn project hiện có
3. Điều hướng đến **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Chọn **Web application**
6. Điền thông tin:
   - **Name**: Tên ứng dụng của bạn
   - **Authorized JavaScript origins**: `http://localhost:3000` (cho development)
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
7. Lưu **Client ID** và **Client Secret**

## Bước 3: Cấu hình Environment Variables

Tạo file `.env.local` ở root của project:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000

# Backend API (bắt buộc cho kiến trúc mới)
BACKEND_API_URL=http://localhost:8000
BACKEND_API_KEY=your_backend_api_key_here
```

Để tạo `NEXTAUTH_SECRET`, chạy lệnh:

```bash
openssl rand -base64 32
```

## Bước 4: Bật Google Chat API

1. Trong Google Cloud Console, điều hướng đến **APIs & Services** > **Library**
2. Tìm "Google Chat API"
3. Click **Enable**

## Bước 5: Cấu hình OAuth Consent Screen

1. Điều hướng đến **APIs & Services** > **OAuth consent screen**
2. Chọn **External** (hoặc **Internal** nếu bạn có Google Workspace)
3. Điền thông tin ứng dụng
4. Thêm scopes:
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/chat.messages.readonly`
   - `https://www.googleapis.com/auth/chat.spaces.readonly`
5. Thêm test users (nếu ở chế độ Testing)
6. Submit for verification (nếu cần)

## Bước 6: Cấu hình Backend

⚠️ **Quan trọng**: Kiến trúc này yêu cầu một Backend service riêng biệt để:
- Lưu trữ và mã hóa refresh tokens
- Sync messages định kỳ từ Google Chat
- Quản lý whitelist spaces

Xem [Kiến trúc tích hợp](./architecture.md) để biết chi tiết về Backend API endpoints và database schema.

### Backend API Endpoints cần implement:

1. `POST /api/v1/integration/connect` - Nhận và lưu refresh token
2. `POST /api/v1/integration/disconnect` - Ngắt kết nối
3. `GET /api/v1/integration/status` - Kiểm tra trạng thái
4. `GET /api/v1/spaces/whitelist` - Lấy danh sách spaces và whitelist
5. `PUT /api/v1/spaces/whitelist` - Cập nhật whitelist

## Bước 7: Sử dụng

1. Truy cập `/integration`
2. Click "Đăng nhập với Google"
3. Backend tự động lưu refresh token và lấy danh sách spaces
4. Chọn spaces bạn muốn theo dõi (whitelist)
5. Lưu các spaces đã chọn
6. Backend sẽ tự động sync messages định kỳ từ các spaces đã whitelist

## API Routes (Next.js)

### `GET /api/integration/status`
Kiểm tra trạng thái kết nối Google Chat.

**Response:**
```json
{
  "isConnected": true
}
```

### `POST /api/integration/disconnect`
Ngắt kết nối Google Chat.

**Response:**
```json
{
  "message": "Ngắt kết nối thành công"
}
```

### `GET /api/integration/spaces/whitelist`
Lấy danh sách tất cả spaces và whitelisted spaces từ Backend.

**Response:**
```json
{
  "allSpaces": [
    { "name": "spaces/AAAA...", "displayName": "Space A" }
  ],
  "whitelistedSpaces": ["spaces/AAAA..."]
}
```

### `PUT /api/integration/spaces/whitelist`
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

> **Lưu ý**: Các API routes này proxy requests đến Backend API. Xem [Kiến trúc tích hợp](./architecture.md) để biết chi tiết về Backend endpoints.

## Lưu ý quan trọng

1. **Refresh Token**: Refresh token được **tự động gửi đến Backend** khi user đăng nhập lần đầu. Backend sẽ mã hóa và lưu vào database. Logic này được implement trong `lib/auth/config.ts` tại callback `jwt`.

2. **Token Expiration**: Access token hết hạn sau 1 giờ. Backend tự động refresh token định kỳ (mỗi 30 phút) để đảm bảo luôn có token hợp lệ.

3. **Message Sync**: Backend tự động sync messages định kỳ (mỗi 5 phút) từ các spaces đã được whitelist. Messages được lưu vào database để phục vụ các tính năng khác.

4. **Permissions**: User chỉ có thể truy cập các spaces mà họ là thành viên.

5. **Rate Limits**: Google Chat API có rate limits. Xem [Google Chat API documentation](https://developers.google.com/chat/api/guides) để biết thêm chi tiết.

6. **⚠️ Quan trọng - Thêm scope mới**: Nếu bạn thêm scope mới vào cấu hình (ví dụ: `chat.spaces.readonly`), bạn **BẮT BUỘC** phải:
   - Đăng xuất khỏi ứng dụng
   - Đăng nhập lại với Google
   - Đồng ý cấp quyền mới trong màn hình OAuth consent
   
   Token cũ không có quyền mới, nên bạn phải lấy token mới với đầy đủ scopes.

7. **Backend Dependency**: Kiến trúc này yêu cầu Backend service riêng biệt. Đảm bảo Backend đã được cấu hình và chạy trước khi sử dụng tính năng tích hợp.

## Troubleshooting

### Lỗi "redirect_uri_mismatch"
- Kiểm tra lại **Authorized redirect URIs** trong Google Cloud Console
- Đảm bảo URL khớp chính xác với `NEXTAUTH_URL/api/auth/callback/google`

### Lỗi "access_denied"
- Kiểm tra OAuth consent screen đã được cấu hình đúng
- Đảm bảo scopes đã được thêm vào consent screen

### Không lấy được Refresh Token
- Đảm bảo `access_type: "offline"` trong config
- User phải đồng ý cấp quyền lần đầu tiên (prompt: "consent")

### Lỗi "Insufficient Permission" hoặc "Request had insufficient authentication scopes"
- Đảm bảo bạn đã thêm đầy đủ scopes vào `lib/auth/config.ts`:
  - `chat.messages.readonly` - để đọc tin nhắn
  - `chat.spaces.readonly` - để liệt kê danh sách spaces
- **Quan trọng**: Sau khi thêm scope mới, bạn PHẢI đăng xuất và đăng nhập lại để Google cấp token mới với đầy đủ quyền
- Kiểm tra scopes đã được thêm vào OAuth consent screen trong Google Cloud Console

### Lỗi kết nối Backend
- Kiểm tra `BACKEND_API_URL` và `BACKEND_API_KEY` đã được cấu hình đúng trong `.env.local`
- Đảm bảo Backend service đang chạy và có thể truy cập được
- Kiểm tra Backend logs để xem có lỗi gì không
- Kiểm tra API Key có đúng không (Backend sẽ validate `X-API-Key` header)

### Token không được lưu vào Backend
- Kiểm tra logs của Next.js server để xem có lỗi khi gọi Backend API không
- Đảm bảo Backend endpoint `POST /api/v1/integration/connect` đã được implement
- Kiểm tra Backend có nhận được request và lưu token thành công không

