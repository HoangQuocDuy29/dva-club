// src/modules/users/api/userClient.ts
import axios from "axios";
import { TokenStorage } from "../../../utils/tokenStorage";
export const userClient = axios.create({
  baseURL: `${
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api/v1"
  }/users`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ ENHANCED REQUEST INTERCEPTOR - Add logging + existing token logic
userClient.interceptors.request.use(
  (config) => {
    // ✅ LOG REQUEST DETAILS
    console.log("📤 === AXIOS REQUEST ===");
    console.log("Method:", config.method?.toUpperCase());
    console.log("URL:", config.url);
    console.log("Full URL:", `${config.baseURL}${config.url}`);
    console.log("Headers:", config.headers);
    console.log("Request Data:", config.data);
    console.log("========================");

    // ✅ EXISTING TOKEN LOGIC
    const token = localStorage.getItem("auth-token");
    console.log("🔑 Raw token from localStorage:", token);

    if (token && token !== "undefined" && token !== "null") {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log(
        "✅ Authorization header set:",
        `Bearer ${token.substring(0, 20)}...`
      );
    } else {
      console.log("❌ Invalid token found:", token);
      const refreshToken = localStorage.getItem("refresh-token");
      if (refreshToken && refreshToken !== "undefined") {
        console.log("🔄 Will try to refresh token...");
      }
    }

    return config;
  },
  (error) => {
    console.error("❌ REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

// ✅ ENHANCED RESPONSE INTERCEPTOR - Add logging + existing refresh logic
userClient.interceptors.response.use(
  (response) => {
    // ✅ LOG SUCCESSFUL RESPONSE
    console.log("✅ === AXIOS RESPONSE ===");
    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);
    console.log("Response Data:", response.data);
    console.log("Response Headers:", response.headers);
    console.log("=========================");

    return response;
  },
  async (error) => {
    // ✅ LOG ERROR RESPONSE DETAILS
    console.error("❌ === AXIOS ERROR ===");
    console.error("Error Message:", error.message);
    console.error("Error Code:", error.code);
    console.error("Status Code:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Error Response Data:", error.response?.data);
    console.error("Error Response Headers:", error.response?.headers);
    console.error("Request URL:", error.config?.url);
    console.error("Request Method:", error.config?.method);
    console.error("Request Data:", error.config?.data);
    console.error("======================");

    // ✅ EXISTING 401 REFRESH LOGIC
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("🚨 401 Unauthorized - attempting token refresh");
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh-token");
      if (refreshToken && refreshToken !== "undefined") {
        try {
          console.log("🔄 Refreshing token...");
          const response = await axios.post(
            `${
              import.meta.env.VITE_API_BASE_URL ||
              "http://localhost:3001/api/v1"
            }/auth/refresh`,
            { refreshToken }
          );

          const { token } = response.data;
          console.log("✅ New token received:", token ? "SUCCESS" : "FAILED");

          localStorage.setItem("auth-token", token);

          // Retry original request
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return userClient(originalRequest);
        } catch (refreshError) {
          console.log("❌ Token refresh failed:", refreshError);
          localStorage.removeItem("auth-token");
          localStorage.removeItem("refresh-token");
          localStorage.removeItem("auth-storage");

          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      } else {
        console.log("❌ No valid refresh token");
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
