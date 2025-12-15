# Pagination Optimization

## Cải tiến

### 1. Server-side Pagination Metadata
API response bây giờ bao gồm metadata:
```json
{
  "data": [...],
  "meta": {
    "total": 615,
    "limit": 1000,
    "offset": 0,
    "has_more": false
  }
}
```

### 2. Type Safety
```typescript
interface PaginationMeta {
  total: number | null;
  limit: number;
  offset: number;
  has_more: boolean;
}

interface TodoListResponse {
  data: TodoApiModel[];
  meta: PaginationMeta;
}
```

### 3. Store Updates
- Thêm `hasMore` flag để biết có còn data hay không
- `setPagination` nhận thêm parameter `hasMore`

### 4. Service Layer
```typescript
async fetchTodos(params: TodoQueryParams = {}) {
  const response = await todoApi.getTodos(apiParams);
  const todos = response.data.map(mapTodoFromApi);
  
  return {
    data: {
      todos,
      total: meta.total ?? todos.length,
      page,
      limit,
      hasMore: meta.has_more, // ✅ Từ API
    },
    error: null,
  };
}
```

### 5. Component Optimization
- `TodoListView` wrapped với `React.memo` để tránh re-renders
- Pagination component đã tối ưu sẵn

## Performance Benefits

1. **Accurate Total Count**: Biết chính xác tổng số todos từ server
2. **Has More Flag**: Biết có còn data để load hay không
3. **Memoized Components**: Giảm re-renders không cần thiết
4. **Type Safety**: Đảm bảo data structure đúng

## Usage

```typescript
const { todos, total, hasMore, loading } = useTodos();

// total: tổng số todos từ server
// hasMore: còn data để load hay không
// todos: danh sách todos hiện tại
```

## Future Enhancements

1. **Infinite Scroll**: Sử dụng `hasMore` để implement infinite scroll
2. **Prefetching**: Pre-load next page khi user scroll gần cuối
3. **Virtual Scrolling**: Thêm react-window nếu cần render >1000 items
