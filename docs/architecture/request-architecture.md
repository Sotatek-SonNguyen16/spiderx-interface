# Request Architecture Guide

Hướng dẫn sử dụng kiến trúc request được thiết kế cho dự án Next.js này.

## Tổng quan

Kiến trúc này được xây dựng với các nguyên tắc:
- **Separation of Concerns**: Mỗi layer có trách nhiệm riêng
- **Type Safety**: TypeScript ở mọi layer
- **Maintainability**: Dễ bảo trì và mở rộng
- **Reusability**: Code có thể tái sử dụng

## Cấu trúc

```
lib/
  api/
    client.ts          # Base API client với axios
    index.ts          # Exports

features/
  {feature-name}/
    types/            # TypeScript types
    api/              # API calls
    services/         # Business logic
    stores/           # Zustand stores
    hooks/            # React hooks
    components/       # Feature components
    index.ts          # Public exports
```

## Luồng dữ liệu

```
┌─────────────┐
│  Component  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Hook     │ ◄─── React hooks (useTodos, useTodo)
└──────┬──────┘
       │
       ├──────────────┐
       ▼              ▼
┌─────────────┐  ┌─────────────┐
│   Service   │  │    Store    │ ◄─── Zustand state
└──────┬──────┘  └─────────────┘
       │
       ▼
┌─────────────┐
│     API     │ ◄─── API calls (todoApi)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ ApiClient   │ ◄─── Axios instance
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Backend   │
└─────────────┘
```

## Sử dụng trong Component

### Ví dụ cơ bản

```typescript
"use client";

import { useTodos } from "@/features/todos";

export default function TodoPage() {
  const {
    todos,
    loading,
    error,
    createTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos();

  const handleCreate = async () => {
    const result = await createTodo({
      title: "New Todo",
      description: "Description",
    });
    
    if (result.success) {
      console.log("Created:", result.data);
    } else {
      console.error("Error:", result.error);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {todos.map((todo) => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span>{todo.title}</span>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## Tạo Feature mới

### Bước 1: Tạo Types

```typescript
// features/posts/types/index.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
}
```

### Bước 2: Tạo API

```typescript
// features/posts/api/post.api.ts
import { apiClient } from "@/lib/api";
import type { Post, CreatePostDto } from "../types";

export const postApi = {
  getPosts: async () => {
    const response = await apiClient.get<Post[]>("/posts");
    return response.data;
  },
  
  createPost: async (data: CreatePostDto) => {
    const response = await apiClient.post<Post>("/posts", data);
    return response.data;
  },
};
```

### Bước 3: Tạo Service

```typescript
// features/posts/services/post.service.ts
import { postApi } from "../api/post.api";
import type { Post, CreatePostDto } from "../types";

export class PostService {
  async fetchPosts() {
    try {
      const data = await postApi.getPosts();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
  
  async createPost(payload: CreatePostDto) {
    try {
      const data = await postApi.createPost(payload);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
}

export const postService = new PostService();
```

### Bước 4: Tạo Store

```typescript
// features/posts/stores/post.store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Post } from "../types";

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

interface PostActions {
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePostStore = create<PostState & PostActions>()(
  devtools(
    (set) => ({
      posts: [],
      loading: false,
      error: null,
      
      setPosts: (posts) => set({ posts }),
      addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    { name: "PostStore" }
  )
);
```

### Bước 5: Tạo Hook

```typescript
// features/posts/hooks/usePosts.ts
"use client";

import { useEffect, useCallback } from "react";
import { usePostStore } from "../stores/post.store";
import { postService } from "../services/post.service";
import type { CreatePostDto } from "../types";

export const usePosts = () => {
  const {
    posts,
    loading,
    error,
    setPosts,
    addPost,
    setLoading,
    setError,
  } = usePostStore();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await postService.fetchPosts();
    
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setPosts(result.data);
    }
    
    setLoading(false);
  }, [setPosts, setLoading, setError]);

  const createPost = useCallback(
    async (payload: CreatePostDto) => {
      setLoading(true);
      setError(null);
      
      const result = await postService.createPost(payload);
      
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return { success: false, error: result.error };
      }
      
      if (result.data) {
        addPost(result.data);
        setLoading(false);
        return { success: true, data: result.data };
      }
      
      setLoading(false);
      return { success: false, error: "Unknown error" };
    },
    [addPost, setLoading, setError]
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
  };
};
```

### Bước 6: Export

```typescript
// features/posts/index.ts
export * from "./types";
export { postApi } from "./api/post.api";
export { postService, PostService } from "./services/post.service";
export { usePostStore } from "./stores/post.store";
export { usePosts } from "./hooks/usePosts";
```

## Best Practices

1. **Luôn sử dụng TypeScript types**
2. **Xử lý errors ở service layer**
3. **Sử dụng Zustand cho global state**
4. **Tách biệt concerns giữa các layers**
5. **Export từ index.ts để dễ import**
6. **Sử dụng "use client" cho hooks và components**

## Environment Variables

Đảm bảo có file `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

## Testing

Mỗi layer có thể test độc lập:

- **API Layer**: Mock axios responses
- **Service Layer**: Mock API calls
- **Store Layer**: Test state updates
- **Hook Layer**: Test với React Testing Library

## Troubleshooting

### Lỗi CORS
Kiểm tra `NEXT_PUBLIC_API_BASE_URL` và CORS settings trên backend.

### Token không được gửi
Kiểm tra localStorage có `auth_token` và interceptor hoạt động đúng.

### Type errors
Đảm bảo types được định nghĩa đúng và exported từ index.ts.

