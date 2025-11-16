// Auth types theo API spec v1

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  full_name?: string | null;
  avatar?: string | null;
  timezone?: string;
  working_hours?: {
    start: string;
    end: string;
  } | null;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: "bearer";
}

export interface User {
  user_id: string;
  username: string;
  email: string;
  full_name: string | null;
  avatar: string | null;
  role: "admin" | "user" | "guest";
  timezone: string;
  working_hours: {
    start: string;
    end: string;
  } | null;
  created_at: string;
  last_login_at: string | null;
}

