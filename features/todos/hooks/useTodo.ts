"use client";

import { useState, useEffect, useCallback } from "react";
import { useTodoStore } from "../stores/todo.store";
import { todoService } from "../services/todo.service";
import type { UpdateTodoDto } from "../types";

export const useTodo = (id: string) => {
  const { selectedTodo, setSelectedTodo, setLoading, setError } = useTodoStore();
  const [loading, setLocalLoading] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);

  // Fetch single todo
  const fetchTodo = useCallback(async () => {
    setLocalLoading(true);
    setLocalError(null);

    const result = await todoService.fetchTodoById(id);

    if (result.error) {
      setLocalError(result.error);
      setLocalLoading(false);
      return { success: false, error: result.error };
    }

    if (result.data) {
      setSelectedTodo(result.data);
      setLocalLoading(false);
      return { success: true, data: result.data };
    }

    setLocalLoading(false);
    return { success: false, error: "Unknown error" };
  }, [id, setSelectedTodo]);

  // Update todo
  const updateTodo = useCallback(
    async (payload: UpdateTodoDto) => {
      setLocalLoading(true);
      setLocalError(null);

      const result = await todoService.updateTodo(id, payload);

      if (result.error) {
        setLocalError(result.error);
        setLocalLoading(false);
        return { success: false, error: result.error };
      }

      if (result.data) {
        setSelectedTodo(result.data);
        setLocalLoading(false);
        return { success: true, data: result.data };
      }

      setLocalLoading(false);
      return { success: false, error: "Unknown error" };
    },
    [id, setSelectedTodo]
  );

  // Delete todo
  const deleteTodo = useCallback(async () => {
    setLocalLoading(true);
    setLocalError(null);

    const result = await todoService.deleteTodo(id);

    if (result.error) {
      setLocalError(result.error);
      setLocalLoading(false);
      return { success: false, error: result.error };
    }

    setSelectedTodo(null);
    setLocalLoading(false);
    return { success: true };
  }, [id, setSelectedTodo]);

  // Fetch on mount
  useEffect(() => {
    if (id) {
      fetchTodo();
    }
  }, [id, fetchTodo]);

  return {
    todo: selectedTodo,
    loading,
    error,
    fetchTodo,
    updateTodo,
    deleteTodo,
  };
};

