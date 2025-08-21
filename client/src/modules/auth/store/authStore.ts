// E:\2_NodeJs\DVA_Club\volleyball-club-management\client\src\modules\auth\store\authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";
import { TokenStorage } from "../../../utils/tokenStorage";

interface AuthStore {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (
    user: User,
    token: string,
    refreshToken: string,
    navigate?: (path: string) => void
  ) => void;
  logout: (navigate?: (path: string) => void) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
  refreshAuthToken: () => Promise<boolean>; // ✅ New: Auto refresh function
  syncTokens: () => void; // ✅ New: Sync with TokenStorage
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state với TokenStorage sync
      user: null,
      token: TokenStorage.getAuthToken(),
      refreshToken: TokenStorage.getRefreshToken(),
      isAuthenticated: TokenStorage.isAuthenticated(),
      isLoading: false,

      // ✅ UPDATED: Enhanced login với TokenStorage
      login: (user, token, refreshToken, navigate) => {
        console.log("🔐 Auth store login:", {
          hasToken: !!token,
          hasRefreshToken: !!refreshToken,
          tokenValid: token && token !== "undefined",
        });

        // ✅ Use TokenStorage for safe token storage
        TokenStorage.setAuthToken(token);
        TokenStorage.setRefreshToken(refreshToken);

        set({
          user,
          token: TokenStorage.getAuthToken(), // ✅ Get validated token
          refreshToken: TokenStorage.getRefreshToken(),
          isAuthenticated: true,
          isLoading: false,
        });

        // Navigate theo role
        setTimeout(() => {
          if (navigate) {
            navigate(user.role === "admin" ? "/dashboard" : "/");
          }
        }, 100);
      },

      // ✅ UPDATED: Enhanced logout với TokenStorage
      logout: (navigate) => {
        console.log("🚪 Logging out and clearing tokens");
        TokenStorage.clearTokens();

        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });

        if (navigate) {
          navigate("/login");
        }
      },

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),

      // ✅ UPDATED: Enhanced setToken với TokenStorage
      setToken: (token) => {
        console.log("🔄 Setting new token");
        TokenStorage.setAuthToken(token);
        set({
          token: TokenStorage.getAuthToken(),
          isAuthenticated: TokenStorage.isAuthenticated(),
        });
      },

      // ✅ UPDATED: Enhanced clearAuth với TokenStorage
      clearAuth: () => {
        console.log("🧹 Clearing all auth data");
        TokenStorage.clearTokens();
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      // ✅ NEW: Auto refresh token function
      refreshAuthToken: async (): Promise<boolean> => {
        console.log("🔄 Attempting to refresh auth token...");

        const currentRefreshToken =
          get().refreshToken || TokenStorage.getRefreshToken();

        if (!currentRefreshToken) {
          console.log("❌ No refresh token available");
          get().clearAuth();
          return false;
        }

        try {
          // Import authService để gọi refresh API
          const { authService } = await import("../services/authService");
          const response = await authService.refreshToken(currentRefreshToken);

          const { token, user } = response;

          if (token && token !== "undefined") {
            console.log("✅ Token refreshed successfully");

            // Update tokens
            TokenStorage.setAuthToken(token);

            // Update store
            set({
              token: TokenStorage.getAuthToken(),
              user: user || get().user, // Keep existing user if not provided
              isAuthenticated: true,
            });

            return true;
          } else {
            throw new Error("Invalid token received from refresh");
          }
        } catch (error) {
          console.error("❌ Token refresh failed:", error);
          get().clearAuth();
          return false;
        }
      },

      // ✅ NEW: Sync tokens between store and TokenStorage
      syncTokens: () => {
        const state = get();
        const storageAuthToken = TokenStorage.getAuthToken();
        const storageRefreshToken = TokenStorage.getRefreshToken();

        // Sync auth token
        if (state.token !== storageAuthToken) {
          if (storageAuthToken && !state.token) {
            // Storage has token but store doesn't - sync to store
            set({ token: storageAuthToken, isAuthenticated: true });
            console.log("🔄 Synced auth token from storage to store");
          } else if (state.token && !storageAuthToken) {
            // Store has token but storage doesn't - sync to storage
            TokenStorage.setAuthToken(state.token);
            console.log("🔄 Synced auth token from store to storage");
          }
        }

        // Sync refresh token
        if (state.refreshToken !== storageRefreshToken) {
          if (storageRefreshToken && !state.refreshToken) {
            set({ refreshToken: storageRefreshToken });
            console.log("🔄 Synced refresh token from storage to store");
          } else if (state.refreshToken && !storageRefreshToken) {
            TokenStorage.setRefreshToken(state.refreshToken);
            console.log("🔄 Synced refresh token from store to storage");
          }
        }
      },

      // ✅ UPDATED: Enhanced initializeAuth với auto-refresh logic
      initializeAuth: async (): Promise<void> => {
        return new Promise(async (resolve) => {
          console.log("🚀 Initializing auth...");

          const state = get();

          // First, sync tokens between store and storage
          get().syncTokens();

          const authToken = TokenStorage.getAuthToken();
          const refreshToken = TokenStorage.getRefreshToken();

          console.log("🔍 Auth initialization check:", {
            hasUser: !!state.user,
            hasAuthToken: !!authToken,
            hasRefreshToken: !!refreshToken,
            authTokenPreview: authToken?.substring(0, 20) + "..." || "NO TOKEN",
          });

          if (state.user && authToken) {
            // Perfect case: có cả user và auth token
            set({
              token: authToken,
              refreshToken: refreshToken,
              isAuthenticated: true,
            });
            console.log(
              "✅ Auth initialized: user authenticated with valid token"
            );
            resolve();
          } else if (state.user && !authToken && refreshToken) {
            // Case cần fix: có user và refresh token nhưng không có auth token
            console.log(
              "🔄 User exists but no auth token - attempting auto refresh..."
            );

            const refreshSuccess = await get().refreshAuthToken();

            if (refreshSuccess) {
              console.log("✅ Auth initialized: token refreshed successfully");
            } else {
              console.log(
                "❌ Auth initialization failed: could not refresh token"
              );
              get().clearAuth();
            }
            resolve();
          } else if (!state.user && refreshToken) {
            // Case: có refresh token nhưng không có user - try refresh
            console.log(
              "🔄 No user but refresh token exists - attempting to restore session..."
            );

            const refreshSuccess = await get().refreshAuthToken();

            if (!refreshSuccess) {
              console.log("❌ Session restoration failed");
              get().clearAuth();
            }
            resolve();
          } else {
            // Case: không có gì hợp lệ - clear all
            console.log("🚨 No valid tokens found - clearing auth state");
            get().clearAuth();
            resolve();
          }
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),

      // ✅ UPDATED: Enhanced rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log("🔄 Rehydrating auth store...");

          // Validate rehydrated data
          const hasValidToken =
            state.token &&
            state.token !== "undefined" &&
            state.token !== "null";
          const hasValidUser = state.user && typeof state.user === "object";

          if (hasValidUser && hasValidToken) {
            state.isAuthenticated = true;
            console.log("✅ Rehydrated: user authenticated");
          } else {
            // Clear invalid rehydrated data
            console.log(
              "🚨 Rehydration: invalid data detected, will clear on init"
            );
            state.isAuthenticated = false;
          }
        }
      },
    }
  )
);
