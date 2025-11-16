# Features Architecture

Kiến trúc này được thiết kế để quản lý các tính năng một cách có tổ chức, dễ bảo trì và mở rộng.

## Cấu trúc thư mục

Mỗi feature được tổ chức trong thư mục riêng với cấu trúc sau:

```
features/
  {feature-name}/
    ├── types/           # TypeScript types và interfaces
    │   └── index.ts
    ├── api/             # API calls sử dụng apiClient
    │   └── {feature}.api.ts
    ├── services/        # Business logic layer
    │   └── {feature}.service.ts
    ├── stores/          # Zustand stores cho state management
    │   └── {feature}.store.ts
    ├── hooks/           # React hooks để sử dụng trong components
    │   ├── use{Feature}s.ts  # Hook cho danh sách
    │   └── use{Feature}.ts    # Hook cho single item
    ├── components/      # Feature-specific components (optional)
    │   └── {Feature}List.tsx
    └── index.ts         # Export tất cả public APIs
```

## Luồng dữ liệu

```
Component → Hook → Service → API → Backend
                ↓
            Zustand Store
```

1. **Component**: Sử dụng hooks để tương tác với dữ liệu
2. **Hook**: Quản lý logic React, gọi services và cập nhật store
3. **Service**: Xử lý business logic và error handling
4. **API**: Gọi HTTP requests thông qua apiClient
5. **Store**: Lưu trữ state global với Zustand

## Ví dụ: Todo Feature

### 1. Types (`types/index.ts`)

Định nghĩa các types và interfaces:

```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

### 2. API (`api/todo.api.ts`)

Gọi API endpoints:

```typescript
export const todoApi = {
  getTodos: async () => await apiClient.get("/todos"),
  createTodo: async (data) => await apiClient.post("/todos", data),
};
```

### 3. Service (`services/todo.service.ts`)

Xử lý business logic và error handling:

```typescript
export class TodoService {
  async fetchTodos() {
    try {
      const data = await todoApi.getTodos();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
}
```

### 4. Store (`stores/todo.store.ts`)

Quản lý state với Zustand:

```typescript
export const useTodoStore = create((set) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
}));
```

### 5. Hook (`hooks/useTodos.ts`)

React hook để sử dụng trong components:

```typescript
export const useTodos = () => {
  const { todos, setTodos } = useTodoStore();
  const { fetchTodos } = todoService;
  
  // Logic và effects
  return { todos, fetchTodos };
};
```

### 6. Component

Sử dụng hook trong component:

```typescript
export default function TodoList() {
  const { todos, loading, createTodo } = useTodos();
  
  return (
    // JSX
  );
}
```

## Best Practices

1. **Separation of Concerns**: Mỗi layer có trách nhiệm riêng
2. **Type Safety**: Sử dụng TypeScript types ở mọi layer
3. **Error Handling**: Xử lý errors ở service layer
4. **State Management**: Sử dụng Zustand cho global state
5. **Reusability**: Export hooks và services để tái sử dụng
6. **Testing**: Dễ dàng test từng layer riêng biệt

## Tạo feature mới

1. Tạo thư mục `features/{feature-name}/`
2. Tạo các file types, api, services, stores, hooks
3. Export từ `index.ts`
4. Sử dụng trong components

## Environment Variables

Đảm bảo có biến môi trường:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

