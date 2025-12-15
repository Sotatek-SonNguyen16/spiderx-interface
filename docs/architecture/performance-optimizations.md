# Performance Optimizations - Todos Feature

## Tổng quan

Document này mô tả các tối ưu hóa hiệu năng đã được áp dụng cho feature Todos theo kiến trúc request đã định nghĩa.

## Các vấn đề đã được giải quyết

### 1. Double Fetching
**Vấn đề**: Mỗi lần update/toggle đều gọi `fetchTodos()` lại → tốn bandwidth và làm chậm UI.

**Giải pháp**: 
- Loại bỏ `fetchTodos()` sau mỗi mutation
- Sử dụng optimistic updates với rollback mechanism
- Chỉ refresh khi thực sự cần thiết (debounced)

### 2. Optimistic Updates
**Vấn đề**: UI phải đợi API response trước khi cập nhật → trải nghiệm chậm.

**Giải pháp**:
- Update store ngay lập tức trước khi gọi API
- Rollback nếu API trả về lỗi
- Sync lại với server data sau khi thành công

### 3. Loading State Blocking
**Vấn đề**: `setLoading(true)` cho mọi action → UI bị block, spinner xuất hiện liên tục.

**Giải pháp**:
- Chỉ show loading cho initial fetch
- Mutations không trigger loading state
- Sử dụng local loading states cho từng item nếu cần

### 4. Unnecessary Re-renders
**Vấn đề**: Component re-render quá nhiều do dependencies không được optimize.

**Giải pháp**:
- Wrap callbacks với `useCallback`
- Optimize `useMemo` dependencies
- Tránh tạo object/array mới trong render

## Chi tiết tối ưu hóa

### Store Layer (`todo.store.ts`)

```typescript
// ✅ Tránh duplicate khi addTodo
addTodo: (todo) =>
  set(
    (state) => {
      const exists = state.todos.some(t => t.id === todo.id);
      if (exists) return state; // Không update nếu đã tồn tại
      return { todos: [todo, ...state.todos] };
    },
    false,
    "addTodo"
  ),

// ✅ Chỉ update nếu có thay đổi thực sự
updateTodo: (id, updates) =>
  set(
    (state) => {
      const todoIndex = state.todos.findIndex(t => t.id === id);
      if (todoIndex === -1) return state;

      const currentTodo = state.todos[todoIndex];
      const hasChanges = Object.keys(updates).some(
        key => currentTodo[key] !== updates[key]
      );

      if (!hasChanges) return state; // Không update nếu không có thay đổi
      
      // ... update logic
    },
    false,
    "updateTodo"
  ),
```

### Hook Layer (`useTodos.ts`)

#### 1. Optimistic Toggle

```typescript
const toggleTodo = useCallback(
  async (id: string) => {
    setError(null);

    // 1. Lưu state cũ để rollback
    const originalTodo = todos.find(t => t.id === id);
    if (!originalTodo) return { success: false, error: "Todo not found" };

    // 2. Update UI ngay lập tức
    const nextStatus = originalTodo.status === "completed" ? "in_progress" : "completed";
    updateTodo(id, { status: nextStatus });

    // 3. Gọi API
    const result = await todoService.toggleTodo(id);

    if (result.error) {
      // 4. Rollback nếu lỗi
      updateTodo(id, { status: originalTodo.status });
      setError(result.error);
      return { success: false, error: result.error };
    }

    // 5. Sync với server data
    if (result.data) {
      updateTodo(id, result.data);
      return { success: true, data: result.data };
    }

    return { success: false, error: "Unknown error" };
  },
  [todos, updateTodo, setError]
);
```

#### 2. Debounced Refresh

```typescript
const refresh = useCallback(async () => {
  // Clear existing timeout
  if (fetchTimeoutRef.current) {
    clearTimeout(fetchTimeoutRef.current);
  }

  // Debounce refresh calls - chỉ fetch 1 lần sau 300ms
  fetchTimeoutRef.current = setTimeout(() => {
    fetchTodos(false); // Không show loading spinner
  }, 300);
}, [fetchTodos]);
```

#### 3. Conditional Initial Fetch

```typescript
const hasFetchedRef = useRef(false);

const fetchTodos = useCallback(async (showLoading = true) => {
  if (showLoading) {
    setLoading(true);
  }
  // ... fetch logic
  hasFetchedRef.current = true;
}, [/* deps */]);

useEffect(() => {
  if (!hasFetchedRef.current) {
    fetchTodos(); // Chỉ fetch 1 lần khi mount
  }
}, [fetchTodos]);
```

### Component Layer (`TodoList.tsx`)

#### 1. Memoized Callbacks

```typescript
// ✅ Wrap với useCallback để tránh re-create
const handleItemClick = useCallback((id: string) => {
  setExpandedTodoId((prev) => (prev === id ? null : id));
}, []);

const handleNavigateToDetail = useCallback((id: string) => {
  router.push(`/todos/${id}?tab=${activeTab}`);
}, [router, activeTab]);

const handleAddSubtasks = useCallback(async (todoId: string, subtasks: Array<{ title: string }>) => {
  await addSubtasksApi(todoId, subtasks);
}, [addSubtasksApi]);
```

#### 2. Optimized Filtering

```typescript
// ✅ Sử dụng map thay vì if-else chain
const filteredTodos = useMemo(() => {
  const statusMap: Record<TodoTabType, string> = {
    queue: "todo",
    todo: "in_progress",
    completed: "completed",
    trash: "cancelled",
  };
  
  const targetStatus = statusMap[activeTab];
  return threadFilteredTodos.filter((todo) => todo.status === targetStatus);
}, [threadFilteredTodos, activeTab]);
```

#### 3. Optimized Counts

```typescript
// ✅ Single pass thay vì multiple filter calls
const counts = useMemo(() => {
  const result = {
    todo: 0,
    queue: 0,
    trash: 0,
    completed: 0,
  };
  
  todos.forEach((t) => {
    if (t.status === "in_progress") result.todo++;
    else if (t.status === "todo") result.queue++;
    else if (t.status === "cancelled") result.trash++;
    else if (t.status === "completed") result.completed++;
  });
  
  return result;
}, [todos]);
```

#### 4. One-time Fetch

```typescript
// ✅ Chỉ fetch spaces 1 lần khi mount
useEffect(() => {
  fetchWhitelistedSpaces();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Empty deps = chỉ chạy 1 lần
```

## Kết quả

### Trước tối ưu hóa:
- ❌ Mỗi toggle = 2 API calls (toggle + fetch)
- ❌ UI bị block bởi loading spinner
- ❌ Re-render không cần thiết
- ❌ Fetch lại toàn bộ list sau mỗi action

### Sau tối ưu hóa:
- ✅ Mỗi toggle = 1 API call
- ✅ UI update ngay lập tức (optimistic)
- ✅ Minimal re-renders
- ✅ Chỉ fetch khi thực sự cần thiết
- ✅ Debounced refresh để tránh spam

## Best Practices

1. **Optimistic Updates**: Update UI trước, gọi API sau
2. **Rollback Mechanism**: Luôn có khả năng rollback khi API fail
3. **Debouncing**: Debounce các actions có thể trigger nhiều lần
4. **Memoization**: Sử dụng `useMemo` và `useCallback` đúng cách
5. **Selective Updates**: Chỉ update những gì thay đổi
6. **Loading States**: Chỉ show loading cho initial fetch
7. **Single Pass**: Xử lý data trong 1 lần duyệt thay vì nhiều lần

## Monitoring

Để đo lường hiệu năng, có thể sử dụng:

```typescript
// React DevTools Profiler
// Chrome DevTools Performance tab
// Custom timing logs

console.time('fetchTodos');
await fetchTodos();
console.timeEnd('fetchTodos');
```

## Future Improvements

1. **Virtual Scrolling**: Cho list lớn (>1000 items)
2. **Request Deduplication**: Tránh duplicate requests
3. **Cache Layer**: Cache API responses
4. **Background Sync**: Sync data khi tab inactive
5. **Optimistic Pagination**: Pre-fetch next page
