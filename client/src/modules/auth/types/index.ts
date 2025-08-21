// User types - Match với User entity
export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash?: string; // Không expose trong frontend responses
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "manager" | "admin" | "coach" | "player" | "viewer";

// Auth-specific types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  accessToken?: string;
  access_token?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]>;
}
