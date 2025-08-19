import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

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
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: (user, token, refreshToken, navigate) => {
        localStorage.setItem("auth-token", token);
        localStorage.setItem("refresh-token", refreshToken);

        set({
          user,
          token,
          refreshToken,
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

      logout: (navigate) => {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("refresh-token");

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
      setToken: (token) => {
        localStorage.setItem("auth-token", token);
        set({ token });
      },

      clearAuth: () => {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("refresh-token");
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      // authStore.ts - initializeAuth
      initializeAuth: async (): Promise<void> => {
        return new Promise((resolve) => {
          const state = get();
          let tokenFromStorage = localStorage.getItem("auth-token");

          // ✅ CHECK for "undefined" string
          if (tokenFromStorage === "undefined" || tokenFromStorage === "null") {
            console.log("🚨 Found invalid token string, clearing...");
            localStorage.removeItem("auth-token");
            tokenFromStorage = null;
          }

          console.log("🔍 Debug initializeAuth:", {
            hasUser: !!state.user,
            hasTokenInState: !!state.token,
            hasTokenInStorage: !!tokenFromStorage,
            tokenFromStorage:
              tokenFromStorage?.substring(0, 30) + "..." || "NO TOKEN",
            userRole: state.user?.role,
          });

          // ✅ CHỈ SET AUTHENTICATED NẾU CÓ VALID TOKEN
          if (
            state.user &&
            state.token &&
            tokenFromStorage &&
            tokenFromStorage !== "undefined"
          ) {
            set({
              token: state.token,
              isAuthenticated: true,
            });
            console.log(
              "✅ Auth initialized: user authenticated with valid token"
            );
          } else if (
            state.user &&
            tokenFromStorage &&
            tokenFromStorage !== "undefined"
          ) {
            set({
              token: tokenFromStorage,
              isAuthenticated: true,
            });
            console.log("✅ Auth initialized: token synced from storage");
          } else {
            console.log("🚨 No valid token found - clearing auth state");
            set({
              user: null,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
            });
            // Clear invalid storage
            localStorage.removeItem("auth-token");
            localStorage.removeItem("refresh-token");
            localStorage.removeItem("auth-storage");
          }

          setTimeout(resolve, 50);
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

      // ✅ FORCE SET isAuthenticated khi rehydrate
      onRehydrateStorage: () => (state) => {
        if (state?.token && state?.user) {
          state.isAuthenticated = true;
          console.log("✅ Rehydrated: user authenticated");
        }
      },
    }
  )
);
