import { apiClient } from "@/lib/api";
import type {
  TodoApiModel,
  TodoApiQueryParams,
  CreateTodoApiPayload,
  UpdateTodoApiPayload,
} from "../types";

const BASE_PATH = "/api/v1";

export const todoApi = {
  // GET /api/v1/todos
  getTodos: async (params?: TodoApiQueryParams): Promise<TodoApiModel[]> => {
    const response = await apiClient.get<TodoApiModel[]>(`${BASE_PATH}/todos`, {
      params,
    });
    return response.data;
  },

  // GET /api/v1/todos/{todo_id}
  getTodoById: async (id: string): Promise<TodoApiModel> => {
    const response = await apiClient.get<TodoApiModel>(`${BASE_PATH}/todos/${id}`);
    return response.data;
  },

  // POST /api/v1/todos
  createTodo: async (payload: CreateTodoApiPayload): Promise<TodoApiModel> => {
    const response = await apiClient.post<TodoApiModel>(`${BASE_PATH}/todos`, payload);
    return response.data;
  },

  // PUT /api/v1/todos/{todo_id}
  updateTodo: async (
    id: string,
    payload: UpdateTodoApiPayload
  ): Promise<TodoApiModel> => {
    const response = await apiClient.put<TodoApiModel>(`${BASE_PATH}/todos/${id}`, payload);
    return response.data;
  },

  // DELETE /api/v1/todos/{todo_id}
  deleteTodo: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/todos/${id}`);
  },
};

