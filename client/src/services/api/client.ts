import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

// Create axios instance with base URL and default config
export const api = axios.create({
  baseURL: "http://localhost:3001/api/v1", // ⚠️ HTTP không phải HTTPS cho localhost
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// client.ts - Response interceptor (ĐƠN GIẢN HƠN)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh-token");
      if (refreshToken) {
        try {
          const response = await axios.post(
            "http://localhost:3001/api/v1/auth/refresh",
            {
              refreshToken,
            }
          );

          const { token } = response.data;
          // ✅ Chỉ cập nhật localStorage, store sẽ sync sau
          localStorage.setItem("auth-token", token);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.log("🚨 Token refresh failed - clearing auth");
          localStorage.removeItem("auth-token");
          localStorage.removeItem("refresh-token");
          localStorage.removeItem("auth-storage");

          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      } else {
        console.log("🚨 No refresh token - clearing auth");
        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-storage");

        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

// Create React Query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
