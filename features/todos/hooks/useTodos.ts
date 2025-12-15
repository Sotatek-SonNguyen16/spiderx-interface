"use client";

import { useEffect, useCallback, useMemo, useRef } from "react";
import { useTodoStore } from "../stores/todo.store";
import { todoService } from "../services/todo.service";
import type { CreateTodoDto, UpdateTodoDto } from "../types";

export const useTodos = () => {
  const {
    todos,
    loading,
    error,
    filters,
    page,
    limit,
    total,
    hasMore,
    setTodos,
    addTodo,
    updateTodo,
    removeTodo,
    setLoading,
    setError,
    setFilters,
    setPagination,
  } = useTodoStore();

  // Track if initial fetch has been done
  const hasFetchedRef = useRef(false);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // 1. Hàm lấy danh sách todos - OPTIMIZED
  const fetchTodos = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    const result = await todoService.fetchTodos({
      ...filters,
      page,
      limit,
    });

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setTodos(result.data.todos);
      setPagination(result.data.page, result.data.limit, result.data.total, result.data.hasMore);
      hasFetchedRef.current = true;
    }

    if (showLoading) {
      setLoading(false);
    }
  }, [filters, page, limit, setTodos, setLoading, setError, setPagination]);

  // REMOVED: Tự động fetch todos. moved to TodoList.tsx to prevent duplicate calls
  // useEffect(() => {
  //   fetchTodos();
  // }, [filters, page, limit]);

  // 2. Hàm tạo todo mới - OPTIMIZED với optimistic update
  const createTodo = useCallback(
    async (payload: CreateTodoDto) => {
      setError(null);

      const result = await todoService.createTodo(payload);

      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      if (result.data) {
        // Optimistic update: thêm vào store ngay, không cần fetch lại
        addTodo(result.data);
        return { success: true, data: result.data };
      }

      return { success: false, error: "Unknown error" };
    },
    [addTodo, setError]
  );

  // 3. Hàm cập nhật todo - OPTIMIZED với optimistic update
  const updateTodoById = useCallback(
    async (id: string, payload: UpdateTodoDto) => {
      setError(null);

      // Optimistic update trước khi gọi API
      const originalTodo = todos.find(t => t.id === id);
      updateTodo(id, payload);

      const result = await todoService.updateTodo(id, payload);

      if (result.error) {
        // Rollback nếu có lỗi
        if (originalTodo) {
          updateTodo(id, originalTodo);
        }
        setError(result.error);
        return { success: false, error: result.error };
      }

      if (result.data) {
        // Sync lại với data từ server
        updateTodo(id, result.data);
        return { success: true, data: result.data };
      }

      return { success: false, error: "Unknown error" };
    },
    [todos, updateTodo, setError]
  );

  // 4. Hàm xóa todo - OPTIMIZED với optimistic update
  const deleteTodo = useCallback(
    async (id: string) => {
      setError(null);

      // Optimistic update trước khi gọi API
      const originalTodo = todos.find(t => t.id === id);
      removeTodo(id);

      const result = await todoService.deleteTodo(id);

      if (result.error) {
        // Rollback nếu có lỗi
        if (originalTodo) {
          addTodo(originalTodo);
        }
        setError(result.error);
        return { success: false, error: result.error };
      }

      return { success: true };
    },
    [todos, removeTodo, addTodo, setError]
  );

  // 5. Hàm toggle todo completion - OPTIMIZED với optimistic update
  const toggleTodo = useCallback(
    async (id: string) => {
      setError(null);

      // Optimistic update trước khi gọi API
      const originalTodo = todos.find(t => t.id === id);
      if (!originalTodo) {
        return { success: false, error: "Todo not found" };
      }

      const nextStatus = originalTodo.status === "completed" ? "in_progress" : "completed";
      updateTodo(id, { status: nextStatus });

      const result = await todoService.toggleTodo(id);

      if (result.error) {
        // Rollback nếu có lỗi
        updateTodo(id, { status: originalTodo.status });
        setError(result.error);
        return { success: false, error: result.error };
      }

      if (result.data) {
        // Sync lại với data từ server
        updateTodo(id, result.data);
        return { success: true, data: result.data };
      }

      return { success: false, error: "Unknown error" };
    },
    [todos, updateTodo, setError]
  );

  // 6. Hàm refresh data (force reload) - OPTIMIZED với debounce
  const refresh = useCallback(async () => {
    // Clear existing timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // Debounce refresh calls
    fetchTimeoutRef.current = setTimeout(() => {
      fetchTodos(false); // Không show loading spinner khi refresh
    }, 300);
  }, [fetchTodos]);

  // 6.1 Hàm thêm subtasks vào todo - OPTIMIZED
  const addSubtasks = useCallback(
    async (todoId: string, subtasks: Array<{ title: string }>) => {
      setError(null);

      const result = await todoService.addSubtasks(todoId, subtasks);

      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      // Chỉ refresh todo cụ thể thay vì toàn bộ list
      refresh();
      return { success: true };
    },
    [setError, refresh]
  );

  // 7. Hàm apply filters - OPTIMIZED
  const applyFilters = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);
      setPagination(1, limit, total, hasMore);
    },
    [setFilters, setPagination, limit, total, hasMore]
  );

  // 8. Hàm change page - OPTIMIZED
  const changePage = useCallback(
    (newPage: number) => {
      setPagination(newPage, limit, total, hasMore);
    },
    [limit, total, hasMore, setPagination]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  // Computed values - MEMOIZED
  const hasTodos = useMemo(() => todos.length > 0, [todos.length]);
  const activeTodosCount = useMemo(
    () => todos.filter((t) => t.status !== "completed").length,
    [todos]
  );
  const completedTodosCount = useMemo(
    () => todos.filter((t) => t.status === "completed").length,
    [todos]
  );

  return {
    // State
    todos,
    loading,
    error,
    filters,
    page,
    limit,
    total,
    hasMore,
    hasTodos,
    activeTodosCount,
    completedTodosCount,
    // Actions
    fetchTodos,
    createTodo,
    updateTodo: updateTodoById,
    deleteTodo,
    toggleTodo,
    addSubtasks,
    applyFilters,
    changePage,
    refresh,
  };
};

