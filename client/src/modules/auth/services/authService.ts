import { api } from "../../../services/api/client";
import { API_ENDPOINTS } from "../../../services/api/endpoints";

import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
} from "../types";

export const authService = {
  //Login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    console.log("API calling with data:", data); // ✅ Debug data trước khi gửi
    console.log("🔗 Request payload:", JSON.stringify(data));
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  /// Register
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },
  // Logout
  logout: async (): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put(API_ENDPOINTS.AUTH.PROFILE, data);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<{ message: string }> => {
    const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    return response.data;
  },

  // Reset password
  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<{ message: string }> => {
    const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
    return response.data;
  },
};
