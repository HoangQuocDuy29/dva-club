// E:\2_NodeJs\DVA_Club\volleyball-club-management\client\src\modules\auth\hooks\useAuth.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { authService } from "../services/authService";
import { TokenStorage } from "../../../utils/tokenStorage";
import type { LoginFormData, RegisterFormData } from "../schemas";
import type { AuthResponse, User, ApiError } from "../types";

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    user,
    setUser,
    clearAuth,
    isAuthenticated,
    isLoading,
    login: loginStore,
    logout: logoutStore,
    setLoading,
    refreshAuthToken,
    syncTokens,
  } = useAuthStore();

  // ✅ FIXED: Adapted login mutation cho backend structure
  const loginMutation = useMutation<AuthResponse, ApiError, LoginFormData>({
    mutationFn: authService.login,
    onMutate: () => setLoading(true),
    onSuccess: (response) => {
      console.log("✅ Login mutation success:", {
        hasUser: !!response.user,
        hasToken: !!response.token,
        hasAccessToken: !!response.accessToken, // ✅ Check alternative field names
        hasRefreshToken: !!response.refreshToken,
        responseKeys: Object.keys(response), // ✅ Debug all keys
        fullResponse: response, // ✅ Log full response structure
      });

      const { user, refreshToken } = response;

      // ✅ ADAPTED: Try different token field names từ backend
      const token =
        response.token ||
        response.accessToken ||
        response.access_token ||
        refreshToken; // ✅ Fallback to refreshToken if no access token

      console.log("🔍 Token extraction:", {
        extractedToken: token ? `${token.substring(0, 20)}...` : "NO TOKEN",
        tokenSource: response.token
          ? "token"
          : response.accessToken
          ? "accessToken"
          : response.access_token
          ? "access_token"
          : refreshToken
          ? "refreshToken (fallback)"
          : "NONE",
      });

      // ✅ RELAXED: Accept refreshToken as access token nếu không có token riêng
      if (!token) {
        console.error(
          "❌ No token found in any expected fields:",
          Object.keys(response)
        );
        throw new Error(
          "No token received from login API - check backend response structure"
        );
      }

      loginStore(user, token, refreshToken, navigate);
      setLoading(false);
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      setLoading(false);
      clearAuth();
    },
  });

  // ✅ FIXED: Same adaptation cho register
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onMutate: () => setLoading(true),
    onSuccess: (response) => {
      const { user, refreshToken } = response;

      // Same token extraction logic
      const token =
        response.token ||
        response.accessToken ||
        response.access_token ||
        refreshToken;

      if (!token) {
        throw new Error("No token received from register API");
      }

      loginStore(user, token, refreshToken, navigate);
      setLoading(false);
    },
    onError: (error: any) => {
      console.error("Register error:", error);
      setLoading(false);
      clearAuth();
    },
  });

  // ✅ Rest of the hook remains the same
  const logout = async () => {
    try {
      console.log("🚪 Logging out user");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      logoutStore(navigate);
    }
  };

  const refreshToken = async () => {
    console.log("🔄 Manual token refresh requested");
    return await refreshAuthToken();
  };

  const syncAuthTokens = () => {
    console.log("🔄 Manual token sync requested");
    syncTokens();
  };

  // ✅ SIMPLIFIED: Profile query without auto-refresh (để tránh complexity)
  const profileQuery = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: authService.getProfile,
    enabled: isAuthenticated && !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const login = async (data: LoginFormData) => {
    console.log("🔐 Login attempt with data:", { email: data.email });
    return loginMutation.mutateAsync(data);
  };

  const register = async (data: RegisterFormData) => {
    return registerMutation.mutateAsync(data);
  };

  const hasRole = (role: string) => {
    return user?.role === role;
  };

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
    refreshToken,
    syncAuthTokens,

    // Role checks
    hasRole,
    isAdmin,

    // Mutation states
    loginError: loginMutation.error,
    registerError: registerMutation.error,

    // Profile
    profile: profileQuery.data,
    profileLoading: profileQuery.isLoading,
    profileError: profileQuery.error,
    refetchProfile: profileQuery.refetch,
  };
};
