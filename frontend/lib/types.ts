// TypeScript types matching backend Pydantic models.

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

// Task types
export interface Task {
  id: number;
  user_id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// API Request types
export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
}

// API Response types
export interface AuthResponse {
  token: string;
  user: User;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
}

// API Error types
export interface ApiError {
  detail: string;
  status?: number;
}
