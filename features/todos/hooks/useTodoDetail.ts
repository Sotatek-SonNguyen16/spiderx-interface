"use client";

import { useState, useEffect, useCallback } from "react";
import { useTodoStore } from "../stores/todo.store";
import { todoService } from "../services/todo.service";
import type { Todo, UpdateTodoDto, Subtask, SubtaskStatus } from "../types";

interface TodoDetailState {
  todo: Todo | null;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  editingField: string | null;
}

/**
 * Hook for managing todo detail view with editing capabilities
 */
export const useTodoDetail = (todoId: string) => {
  const { selectedTodo, setSelectedTodo } = useTodoStore();
  
  const [state, setState] = useState<TodoDetailState>({
    todo: null,
    loading: false,
    error: null,
    isEditing: false,
    editingField: null,
  });

  // Fetch todo by ID
  const fetchTodo = useCallback(async () => {
    if (!todoId) return { success: false, error: "No todo ID provided" };

    setState((prev) => ({ ...prev, loading: true, error: null }));

    const result = await todoService.fetchTodoById(todoId);

    if (result.error) {
      setState((prev) => ({ ...prev, loading: false, error: result.error || "Failed to fetch todo" }));
      return { success: false, error: result.error };
    }

    if (result.data) {
      setState((prev) => ({ ...prev, loading: false, todo: result.data || null }));
      setSelectedTodo(result.data);
      return { success: true, data: result.data };
    }

    setState((prev) => ({ ...prev, loading: false }));
    return { success: false, error: "Unknown error" };
  }, [todoId, setSelectedTodo]);

  // Update todo
  const updateTodo = useCallback(async (payload: UpdateTodoDto): Promise<{
    success: boolean;
    data?: Todo;
    error?: string;
  }> => {
    if (!todoId) return { success: false, error: "No todo ID provided" };

    setState((prev) => ({ ...prev, loading: true, error: null }));

    const result = await todoService.updateTodo(todoId, payload);

    if (result.error) {
      setState((prev) => ({ ...prev, loading: false, error: result.error || "Failed to update todo" }));
      return { success: false, error: result.error };
    }

    if (result.data) {
      setState((prev) => ({ 
        ...prev, 
        loading: false, 
        todo: result.data || null,
        isEditing: false,
        editingField: null,
      }));
      setSelectedTodo(result.data);
      return { success: true, data: result.data };
    }

    setState((prev) => ({ ...prev, loading: false }));
    return { success: false, error: "Unknown error" };
  }, [todoId, setSelectedTodo]);

  // Delete todo
  const deleteTodo = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!todoId) return { success: false, error: "No todo ID provided" };

    setState((prev) => ({ ...prev, loading: true, error: null }));

    const result = await todoService.deleteTodo(todoId);

    if (result.error) {
      setState((prev) => ({ ...prev, loading: false, error: result.error || "Failed to delete todo" }));
      return { success: false, error: result.error };
    }

    setState((prev) => ({ ...prev, loading: false, todo: null }));
    setSelectedTodo(null);
    return { success: true };
  }, [todoId, setSelectedTodo]);

  // Toggle subtask status
  // PUT /api/v1/todos/{todo_id}/subtasks/{subtask_id}
  const toggleSubtask = useCallback(async (subtaskId: string): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!state.todo) return { success: false, error: "No todo loaded" };

    const subtask = state.todo.subtasks.find((s) => s.id === subtaskId);
    if (!subtask) return { success: false, error: "Subtask not found" };

    const newStatus: SubtaskStatus = subtask.status === "completed" ? "todo" : "completed";

    // Optimistic update
    setState((prev) => ({
      ...prev,
      todo: prev.todo ? {
        ...prev.todo,
        subtasks: prev.todo.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, status: newStatus } : s
        ),
      } : null,
    }));

    try {
      const result = await todoService.toggleSubtask(todoId, subtaskId, subtask.status);
      if (result.error) {
        // Revert optimistic update on error
        setState((prev) => ({
          ...prev,
          todo: prev.todo ? {
            ...prev.todo,
            subtasks: prev.todo.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, status: subtask.status } : s
            ),
          } : null,
        }));
        return { success: false, error: result.error };
      }
      return { success: true };
    } catch (error: any) {
      // Revert optimistic update on error
      setState((prev) => ({
        ...prev,
        todo: prev.todo ? {
          ...prev.todo,
          subtasks: prev.todo.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, status: subtask.status } : s
          ),
        } : null,
      }));
      return { success: false, error: error.message || "Failed to toggle subtask" };
    }
  }, [state.todo, todoId]);

  // Add subtask
  // POST /api/v1/todos/{todo_id}/subtasks
  const addSubtask = useCallback(async (title: string): Promise<{
    success: boolean;
    data?: Subtask;
    error?: string;
  }> => {
    if (!state.todo) return { success: false, error: "No todo loaded" };

    // Create optimistic subtask for immediate UI update
    const tempSubtask: Subtask = {
      id: `temp-${Date.now()}`,
      title,
      status: "todo",
      order: state.todo.subtasks.length,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    // Optimistic update
    setState((prev) => ({
      ...prev,
      todo: prev.todo ? {
        ...prev.todo,
        subtasks: [...prev.todo.subtasks, tempSubtask],
      } : null,
    }));

    try {
      const result = await todoService.createSubtask(todoId, {
        title,
        status: "todo",
        order: state.todo.subtasks.length,
      });

      if (result.error || !result.data) {
        // Revert optimistic update on error
        setState((prev) => ({
          ...prev,
          todo: prev.todo ? {
            ...prev.todo,
            subtasks: prev.todo.subtasks.filter((s) => s.id !== tempSubtask.id),
          } : null,
        }));
        return { success: false, error: result.error || "Failed to create subtask" };
      }

      const savedSubtask: Subtask = {
        id: result.data.subtask_id,
        title: result.data.title,
        status: result.data.status,
        order: result.data.order,
        createdAt: result.data.created_at,
        completedAt: result.data.completed_at,
      };

      // Update with real data from server
      setState((prev) => ({
        ...prev,
        todo: prev.todo ? {
          ...prev.todo,
          subtasks: prev.todo.subtasks.map((s) =>
            s.id === tempSubtask.id ? savedSubtask : s
          ),
        } : null,
      }));

      return { success: true, data: savedSubtask };
    } catch (error: any) {
      // Revert optimistic update on error
      setState((prev) => ({
        ...prev,
        todo: prev.todo ? {
          ...prev.todo,
          subtasks: prev.todo.subtasks.filter((s) => s.id !== tempSubtask.id),
        } : null,
      }));

      const errorMessage = error?.message || "Failed to create subtask";
      console.error("🔴 [useTodoDetail] Failed to create subtask:", errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [state.todo, todoId]);

  // Delete subtask
  // DELETE /api/v1/todos/{todo_id}/subtasks/{subtask_id}
  const deleteSubtask = useCallback(async (subtaskId: string): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!state.todo) return { success: false, error: "No todo loaded" };

    // Store subtask for potential rollback
    const deletedSubtask = state.todo.subtasks.find((s) => s.id === subtaskId);

    // Optimistic update
    setState((prev) => ({
      ...prev,
      todo: prev.todo ? {
        ...prev.todo,
        subtasks: prev.todo.subtasks.filter((s) => s.id !== subtaskId),
      } : null,
    }));

    try {
      const result = await todoService.deleteSubtask(todoId, subtaskId);
      if (result.error) {
        // Revert optimistic update on error
        if (deletedSubtask) {
          setState((prev) => ({
            ...prev,
            todo: prev.todo ? {
              ...prev.todo,
              subtasks: [...prev.todo.subtasks, deletedSubtask].sort((a, b) => a.order - b.order),
            } : null,
          }));
        }
        return { success: false, error: result.error };
      }
      return { success: true };
    } catch (error: any) {
      // Revert optimistic update on error
      if (deletedSubtask) {
        setState((prev) => ({
          ...prev,
          todo: prev.todo ? {
            ...prev.todo,
            subtasks: [...prev.todo.subtasks, deletedSubtask].sort((a, b) => a.order - b.order),
          } : null,
        }));
      }
      return { success: false, error: error.message || "Failed to delete subtask" };
    }
  }, [state.todo, todoId]);

  // Start editing a field
  const startEditing = useCallback((field: string) => {
    setState((prev) => ({ ...prev, isEditing: true, editingField: field }));
  }, []);

  // Cancel editing
  const cancelEditing = useCallback(() => {
    setState((prev) => ({ ...prev, isEditing: false, editingField: null }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Fetch on mount
  useEffect(() => {
    if (todoId) {
      fetchTodo();
    }
  }, [todoId, fetchTodo]);

  return {
    // State
    todo: state.todo,
    loading: state.loading,
    error: state.error,
    isEditing: state.isEditing,
    editingField: state.editingField,

    // Todo actions
    fetchTodo,
    updateTodo,
    deleteTodo,

    // Subtask actions
    toggleSubtask,
    addSubtask,
    deleteSubtask,

    // Editing actions
    startEditing,
    cancelEditing,
    clearError,
  };
};
