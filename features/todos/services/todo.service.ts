import { todoApi } from "../api/todo.api";
import type { CreateTodoDto, UpdateTodoDto, TodoQueryParams, Todo } from "../types";
import {
  mapCreateTodoToApi,
  mapUpdateTodoToApi,
  mapFiltersToApiQuery,
  mapTodoFromApi,
} from "../utils/todo.mapper";

interface FetchTodosResult {
  todos: Todo[];
  total: number;
  page: number;
  limit: number;
}

export class TodoService {
  /**
   * Fetch all todos with optional filters
   */
  async fetchTodos(params: TodoQueryParams = {}) {
    try {
      const apiParams = mapFiltersToApiQuery(params);
      const response = await todoApi.getTodos(apiParams);
      const todos = response.map(mapTodoFromApi);
      const page = params.page ?? 1;
      const limit = params.limit ?? 10;
      const total = (page - 1) * limit + todos.length;

      return {
        data: {
          todos,
          total,
          page,
          limit,
        } satisfies FetchTodosResult,
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to fetch todos",
      };
    }
  }

  /**
   * Fetch a single todo by ID
   */
  async fetchTodoById(id: string) {
    try {
      const data = await todoApi.getTodoById(id);
      return { data: mapTodoFromApi(data), error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to fetch todo",
      };
    }
  }

  /**
   * Create a new todo
   */
  async createTodo(payload: CreateTodoDto) {
    try {
      const apiPayload = mapCreateTodoToApi(payload);
      const data = await todoApi.createTodo(apiPayload);
      return { data: mapTodoFromApi(data), error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to create todo",
      };
    }
  }

  /**
   * Update an existing todo
   */
  async updateTodo(id: string, payload: UpdateTodoDto) {
    try {
      const apiPayload = mapUpdateTodoToApi(payload);
      const data = await todoApi.updateTodo(id, apiPayload);
      return { data: mapTodoFromApi(data), error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to update todo",
      };
    }
  }

  /**
   * Delete a todo
   */
  async deleteTodo(id: string) {
    try {
      await todoApi.deleteTodo(id);
      return { error: null };
    } catch (error: any) {
      return {
        error: error.message || "Failed to delete todo",
      };
    }
  }

  /**
   * Toggle todo completion status
   */
  async toggleTodo(id: string) {
    try {
      const current = await todoApi.getTodoById(id);
      const nextStatus = current.status === "completed" ? "todo" : "completed";
      const data = await todoApi.updateTodo(id, { status: nextStatus });
      return { data: mapTodoFromApi(data), error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to toggle todo",
      };
    }
  }
}

// Export singleton instance
export const todoService = new TodoService();

