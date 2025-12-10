import { apiClient } from "@/lib/api";
import type {
  TodoApiModel,
  TodoApiQueryParams,
  CreateTodoApiPayload,
  UpdateTodoApiPayload,
  SubtaskApiModel,
  SubtaskCreatePayload,
  SubtaskUpdatePayload,
} from "../types";

const BASE_PATH = "/api/v1";

export const todoApi = {
  // =============================================================================
  // TODO ENDPOINTS - Theo OpenAPI spec
  // =============================================================================

  /**
   * GET /api/v1/todos/
   * Get all todos for current user
   */
  getTodos: async (params?: TodoApiQueryParams): Promise<TodoApiModel[]> => {
    const response = await apiClient.get<TodoApiModel[]>(`${BASE_PATH}/todos/`, {
      params,
    });
    return response.data;
  },

  /**
   * GET /api/v1/todos/{todo_id}
   * Get a specific todo by ID
   */
  getTodoById: async (id: string): Promise<TodoApiModel> => {
    const response = await apiClient.get<TodoApiModel>(`${BASE_PATH}/todos/${id}`);
    return response.data;
  },

  /**
   * POST /api/v1/todos/
   * Create a new todo item
   */
  createTodo: async (payload: CreateTodoApiPayload): Promise<TodoApiModel> => {
    const response = await apiClient.post<TodoApiModel>(`${BASE_PATH}/todos/`, payload);
    return response.data;
  },

  /**
   * PUT /api/v1/todos/{todo_id}
   * Update a todo item
   */
  updateTodo: async (
    id: string,
    payload: UpdateTodoApiPayload
  ): Promise<TodoApiModel> => {
    const response = await apiClient.put<TodoApiModel>(`${BASE_PATH}/todos/${id}`, payload);
    return response.data;
  },

  /**
   * DELETE /api/v1/todos/{todo_id}
   * Delete a todo item
   */
  deleteTodo: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/todos/${id}`);
  },

  // =============================================================================
  // SUBTASK ENDPOINTS - Theo OpenAPI spec
  // =============================================================================

  /**
   * POST /api/v1/todos/{todo_id}/subtasks
   * Create a subtask for a todo
   * 
   * Request Body (SubTaskCreate):
   * - title: string (required, 1-255 chars)
   * - status: "todo" | "completed" (default: "todo")
   * - order: number (default: 0)
   */
  createSubtask: async (
    todoId: string,
    payload: SubtaskCreatePayload
  ): Promise<SubtaskApiModel> => {
    const response = await apiClient.post<SubtaskApiModel>(
      `${BASE_PATH}/todos/${todoId}/subtasks`,
      payload
    );
    return response.data;
  },

  /**
   * GET /api/v1/todos/{todo_id}/subtasks
   * Get all subtasks for a todo
   */
  getSubtasks: async (todoId: string): Promise<SubtaskApiModel[]> => {
    const response = await apiClient.get<SubtaskApiModel[]>(
      `${BASE_PATH}/todos/${todoId}/subtasks`
    );
    return response.data;
  },

  /**
   * PUT /api/v1/todos/{todo_id}/subtasks/{subtask_id}
   * Update a subtask
   * 
   * Request Body (SubTaskUpdate):
   * - title: string (optional, 1-255 chars)
   * - status: "todo" | "completed" (optional)
   * - order: number (optional)
   */
  updateSubtask: async (
    todoId: string,
    subtaskId: string,
    payload: SubtaskUpdatePayload
  ): Promise<SubtaskApiModel> => {
    const response = await apiClient.put<SubtaskApiModel>(
      `${BASE_PATH}/todos/${todoId}/subtasks/${subtaskId}`,
      payload
    );
    return response.data;
  },

  /**
   * DELETE /api/v1/todos/{todo_id}/subtasks/{subtask_id}
   * Delete a subtask
   */
  deleteSubtask: async (todoId: string, subtaskId: string): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/todos/${todoId}/subtasks/${subtaskId}`);
  },
};

