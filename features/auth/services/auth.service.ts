import { authApi } from "../api/auth.api";
import type { RegisterDto, LoginDto, User, LoginResponse } from "../types";

export class AuthService {
  async register(payload: RegisterDto) {
    try {
      const data = await authApi.register(payload);
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to register",
      };
    }
  }

  async login(payload: LoginDto) {
    try {
      const data = await authApi.login(payload);
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to login",
      };
    }
  }

  async getMe() {
    try {
      const data = await authApi.getMe();
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Failed to get user info",
      };
    }
  }
}

export const authService = new AuthService();

