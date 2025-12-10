"use client";

import { useEffect, useCallback, useMemo } from "react";
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
    setTodos,
    addTodo,
    updateTodo,
    removeTodo,
    setLoading,
    setError,
    setFilters,
    setPagination,
  } = useTodoStore();

  // 1. Hàm lấy danh sách todos
  const fetchTodos = useCallback(async () => {
    setLoading(true);
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
      setPagination(result.data.page, result.data.limit, result.data.total);
    }

    setLoading(false);
  }, [filters, page, limit, setTodos, setLoading, setError, setPagination]);

  // Tự động fetch todos khi mount và khi filters/page thay đổi
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // 2. Hàm tạo todo mới
  const createTodo = useCallback(
    async (payload: CreateTodoDto) => {
      setLoading(true);
      setError(null);

      const result = await todoService.createTodo(payload);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return { success: false, error: result.error };
      }

      if (result.data) {
        // Optimistic update: thêm vào store ngay
        addTodo(result.data);
        // Refresh để sync với server (quan trọng với mock/real API)
        await fetchTodos();
        setLoading(false);
        return { success: true, data: result.data };
      }

      setLoading(false);
      return { success: false, error: "Unknown error" };
    },
    [addTodo, setLoading, setError, fetchTodos]
  );

  // 3. Hàm cập nhật todo
  const updateTodoById = useCallback(
    async (id: string, payload: UpdateTodoDto) => {
      setLoading(true);
      setError(null);

      const result = await todoService.updateTodo(id, payload);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return { success: false, error: result.error };
      }

      if (result.data) {
        // Optimistic update: cập nhật trong store ngay
        updateTodo(id, result.data);
        // Refresh để sync với server
        await fetchTodos();
        setLoading(false);
        return { success: true, data: result.data };
      }

      setLoading(false);
      return { success: false, error: "Unknown error" };
    },
    [updateTodo, setLoading, setError, fetchTodos]
  );

  // 4. Hàm xóa todo
  const deleteTodo = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      const result = await todoService.deleteTodo(id);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return { success: false, error: result.error };
      }

      // Optimistic update: xóa khỏi store ngay
      removeTodo(id);
      // Refresh để sync với server
      await fetchTodos();
      setLoading(false);
      return { success: true };
    },
    [removeTodo, setLoading, setError, fetchTodos]
  );

  // 5. Hàm toggle todo completion
  const toggleTodo = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      const result = await todoService.toggleTodo(id);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return { success: false, error: result.error };
      }

      if (result.data) {
        // Optimistic update: cập nhật trong store ngay
        updateTodo(id, result.data);
        // Refresh để sync với server
        await fetchTodos();
        setLoading(false);
        return { success: true, data: result.data };
      }

      setLoading(false);
      return { success: false, error: "Unknown error" };
    },
    [updateTodo, setLoading, setError, fetchTodos]
  );

  // 6. Hàm refresh data (force reload)
  const refresh = useCallback(async () => {
    await fetchTodos();
  }, [fetchTodos]);

  // 7. Hàm apply filters
  const applyFilters = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);
      setPagination(1, limit, total);
      // Filters sẽ trigger useEffect để fetch lại todos
    },
    [setFilters, setPagination, limit, total]
  );

  // 8. Hàm change page
  const changePage = useCallback(
    (newPage: number) => {
      setPagination(newPage, limit, total);
      // Page change sẽ trigger useEffect để fetch lại todos
    },
    [limit, total, setPagination]
  );

  // Computed values
  const hasTodos = useMemo(() => todos.length > 0, [todos]);
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
    hasTodos,
    activeTodosCount,
    completedTodosCount,
    // Actions
    fetchTodos,
    createTodo,
    updateTodo: updateTodoById,
    deleteTodo,
    toggleTodo,
    applyFilters,
    changePage,
    refresh,
  };
};

