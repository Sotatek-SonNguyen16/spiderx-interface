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

  // =============================================================================
  // SUBTASK METHODS - Theo OpenAPI spec
  // =============================================================================

  /**
   * Add multiple subtasks to a todo
   * Gọi API POST /api/v1/todos/{todo_id}/subtasks cho từng subtask
   */
  async addSubtasks(todoId: string, subtasks: Array<{ title: string }>) {
    try {
      // Tạo subtasks tuần tự với order tăng dần
      for (let i = 0; i < subtasks.length; i++) {
        await todoApi.createSubtask(todoId, {
          title: subtasks[i].title,
          status: "todo",
          order: i,
        });
      }
      return { error: null };
    } catch (error: any) {
      return {
        error: error.message || "Failed to add subtasks",
      };
    }
  }

  /**
   * Create a single subtask
   * POST /api/v1/todos/{todo_id}/subtasks
   */
  async createSubtask(todoId: string, payload: { title: string; status?: "todo" | "completed"; order?: number }) {
    try {
      const data = await todoApi.createSubtask(todoId, payload);
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to create subtask",
      };
    }
  }

  /**
   * Get all subtasks for a todo
   * GET /api/v1/todos/{todo_id}/subtasks
   */
  async getSubtasks(todoId: string) {
    try {
      const data = await todoApi.getSubtasks(todoId);
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to fetch subtasks",
      };
    }
  }

  /**
   * Update a subtask
   * PUT /api/v1/todos/{todo_id}/subtasks/{subtask_id}
   */
  async updateSubtask(
    todoId: string,
    subtaskId: string,
    payload: { title?: string; status?: "todo" | "completed"; order?: number }
  ) {
    try {
      const data = await todoApi.updateSubtask(todoId, subtaskId, payload);
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to update subtask",
      };
    }
  }

  /**
   * Delete a subtask
   * DELETE /api/v1/todos/{todo_id}/subtasks/{subtask_id}
   */
  async deleteSubtask(todoId: string, subtaskId: string) {
    try {
      await todoApi.deleteSubtask(todoId, subtaskId);
      return { error: null };
    } catch (error: any) {
      return {
        error: error.message || "Failed to delete subtask",
      };
    }
  }

  /**
   * Toggle subtask completion status
   * PUT /api/v1/todos/{todo_id}/subtasks/{subtask_id}
   */
  async toggleSubtask(todoId: string, subtaskId: string, currentStatus: "todo" | "completed") {
    try {
      const nextStatus = currentStatus === "completed" ? "todo" : "completed";
      const data = await todoApi.updateSubtask(todoId, subtaskId, { status: nextStatus });
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to toggle subtask",
      };
    }
  }
}

// Export singleton instance
export const todoService = new TodoService();

