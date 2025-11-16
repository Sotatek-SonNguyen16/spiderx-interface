import { apiClient } from "@/lib/api";
import type { RegisterDto, LoginDto, LoginResponse, User } from "../types";

export const authApi = {
  // POST /api/v1/auth/register
  register: async (payload: RegisterDto): Promise<User> => {
    const response = await apiClient.post<User>("/api/v1/auth/register", payload);
    // apiClient.post đã wrap response vào { data: T }, nên chỉ cần return response.data
    return response.data;
  },

  // POST /api/v1/auth/login
  login: async (payload: LoginDto): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/api/v1/auth/login", payload);
    // apiClient.post đã wrap response vào { data: T }, nên chỉ cần return response.data
    return response.data;
  },

  // GET /api/v1/users/me
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>("/api/v1/users/me");
    // apiClient.get đã wrap response vào { data: T }, nên chỉ cần return response.data
    return response.data;
  },
};

