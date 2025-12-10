import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}
export class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
    
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token if available (JWT Bearer token)
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        return response;
      },
      (error: AxiosError<ApiError>) => {
        // Handle common errors
        if (error.response) {
          const { status, data } = error.response;
          
          // Handle 401 Unauthorized
          if (status === 401) {
            if (typeof window !== "undefined") {
              localStorage.removeItem("auth_token");
              sessionStorage.removeItem("auth_token");
              // Redirect to login if not already on auth pages
              const currentPath = window.location.pathname;
              if (!currentPath.startsWith("/signin") && !currentPath.startsWith("/signup")) {
                window.location.href = "/signin";
              }
            }
          }

          // Handle 403 Forbidden
          if (status === 403) {
            console.error("Access forbidden");
          }

          // Handle 500 Server Error
          if (status >= 500) {
            console.error("Server error:", data?.message || "Internal server error");
          }

          return Promise.reject({
            message: data?.message || error.message || "An error occurred",
            status,
            errors: data?.errors,
          } as ApiError);
        }

        // Network error
        if (error.request) {
          return Promise.reject({
            message: "Network error. Please check your connection.",
            status: 0,
          } as ApiError);
        }

        return Promise.reject({
          message: error.message || "An unexpected error occurred",
        } as ApiError);
      }
    );
  }

  // GET request
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T> | T>(url, config);
    const responseData = response.data;
    
    // Backend có thể trả về trực tiếp object/array hoặc wrap trong { data: T }
    // Nếu responseData có property 'data' và không phải là array, thì đó là wrapper
    if (responseData && typeof responseData === 'object' && 'data' in responseData && !Array.isArray(responseData)) {
      return responseData as ApiResponse<T>;
    }
    
    // Backend trả về trực tiếp, wrap vào ApiResponse format
    return { data: responseData as T } as ApiResponse<T>;
  }

  // POST request
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T> | T>(url, data, config);
    const responseData = response.data;
    
    // Backend có thể trả về trực tiếp object hoặc wrap trong { data: T }
    // Nếu responseData có property 'data' và không phải là array, thì đó là wrapper
    if (responseData && typeof responseData === 'object' && 'data' in responseData && !Array.isArray(responseData)) {
      return responseData as ApiResponse<T>;
    }
    
    // Backend trả về trực tiếp, wrap vào ApiResponse format
    return { data: responseData as T } as ApiResponse<T>;
  }

  // PUT request
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T> | T>(url, data, config);
    const responseData = response.data;
    
    // Backend có thể trả về trực tiếp object hoặc wrap trong { data: T }
    if (responseData && typeof responseData === 'object' && 'data' in responseData && !Array.isArray(responseData)) {
      return responseData as ApiResponse<T>;
    }
    
    // Backend trả về trực tiếp, wrap vào ApiResponse format
    return { data: responseData as T } as ApiResponse<T>;
  }

  // PATCH request
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // DELETE request
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // Get axios instance for custom requests
  getInstance(): AxiosInstance {
    return this.instance;
  }

  // Set auth token
  setAuthToken(token: string, remember: boolean = true): void {
    this.instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    if (typeof window !== "undefined") {
      if (remember) {
        localStorage.setItem("auth_token", token);
        sessionStorage.removeItem("auth_token");
      } else {
        sessionStorage.setItem("auth_token", token);
        localStorage.removeItem("auth_token");
      }
    }
  }

  // Remove auth token
  removeAuthToken(): void {
    delete this.instance.defaults.headers.common.Authorization;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_token");
    }
  }
  // Get auth token
  getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
    }
    return null;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

