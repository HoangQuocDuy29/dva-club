import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { authService } from "../services/authService";
import type { LoginFormData, RegisterFormData } from "../schemas";
import type { AuthResponse, User, ApiError } from "../types";

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    user,
    setUser,
    clearAuth, // ✅ Sử dụng clearAuth thay vì clearUser
    isAuthenticated,
    isLoading,
    login: loginStore,
    logout: logoutStore,
    setLoading,
  } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation<AuthResponse, ApiError, LoginFormData>({
    mutationFn: authService.login,
    onMutate: () => setLoading(true),
    onSuccess: (response) => {
      const { user, token, refreshToken } = response;
      // ✅ Pass navigate function to store
      loginStore(user, token, refreshToken, navigate);

      setLoading(false);
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      setLoading(false);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onMutate: () => setLoading(true),
    onSuccess: (response) => {
      const { user, token, refreshToken } = response;
      // ✅ Pass navigate function to store, redirect theo role
      loginStore(user, token, refreshToken, navigate);
      setLoading(false);
    },
    onError: (error: any) => {
      console.error("Register error:", error);
      setLoading(false);
    },
  });

  // Logout mutation - không cần gọi API nếu backend không có logout endpoint
  const logout = () => {
    try {
      // ✅ Có thể thêm API call nếu backend có logout endpoint
      // await authService.logout();

      // ✅ Pass navigate function to store
      logoutStore(navigate);
    } catch (error) {
      console.error("Logout error:", error);
      // Logout locally even if server request fails
      logoutStore(navigate);
    }
  };

  // Get profile query
  const profileQuery = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: authService.getProfile,
    enabled: isAuthenticated && !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000, // ✅ Cache 5 minutes
  });

  // Login function
  const login = async (data: LoginFormData) => {
    return loginMutation.mutateAsync(data);
  };

  // Register function
  const register = async (data: RegisterFormData) => {
    return registerMutation.mutateAsync(data);
  };

  // ✅ Check if user has specific role
  const hasRole = (role: string) => {
    return user?.role === role;
  };

  // ✅ Check if user is admin
  const isAdmin = () => {
    return user?.role === "admin";
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading:
      isLoading || loginMutation.isPending || registerMutation.isPending,

    // Actions
    login,
    register,
    logout,

    // Role checks - ✅ Helper functions
    hasRole,
    isAdmin,

    // Mutation states
    loginError: loginMutation.error,
    registerError: registerMutation.error,

    // Profile
    profile: profileQuery.data,
    profileLoading: profileQuery.isLoading,
    profileError: profileQuery.error,

    // ✅ Profile refetch function
    refetchProfile: profileQuery.refetch,
  };
};
