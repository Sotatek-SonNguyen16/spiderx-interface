# API Client Architecture

Kiến trúc API client được thiết kế để quản lý tất cả các HTTP requests một cách nhất quán và dễ bảo trì.

## ApiClient Class

`ApiClient` là class chính để thực hiện các HTTP requests với các tính năng:

- ✅ Automatic token management
- ✅ Request/Response interceptors
- ✅ Error handling
- ✅ TypeScript support
- ✅ Timeout configuration

## Cấu hình

### Environment Variables

Tạo file `.env.local` với:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

### Sử dụng

```typescript
import { apiClient } from "@/lib/api";

// GET request
const response = await apiClient.get<User[]>("/users");

// POST request
const newUser = await apiClient.post<User>("/users", {
  name: "John Doe",
  email: "john@example.com",
});

// PUT request
const updatedUser = await apiClient.put<User>("/users/1", {
  name: "Jane Doe",
});

// DELETE request
await apiClient.delete("/users/1");
```

## Authentication

API client tự động thêm token từ localStorage:

```typescript
// Set token (tự động lưu vào localStorage)
apiClient.setAuthToken("your-token-here");

// Remove token
apiClient.removeAuthToken();
```

## Error Handling

API client tự động xử lý các lỗi phổ biến:

- **401 Unauthorized**: Tự động xóa token
- **403 Forbidden**: Log error
- **500+ Server Error**: Log error với message
- **Network Error**: Trả về message thân thiện

Response format:

```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}
```

## Custom Instance

Tạo instance riêng cho API khác:

```typescript
import { ApiClient } from "@/lib/api";

const externalApi = new ApiClient("https://external-api.com");
```

## Interceptors

### Request Interceptor

Tự động thêm Authorization header nếu có token trong localStorage.

### Response Interceptor

- Xử lý lỗi HTTP status codes
- Format error messages
- Xử lý network errors

## Type Safety

Tất cả methods hỗ trợ TypeScript generics:

```typescript
interface User {
  id: string;
  name: string;
}

const users = await apiClient.get<User[]>("/users");
// users có type: ApiResponse<User[]>
```

