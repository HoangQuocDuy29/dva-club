import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { authRoutes } from "./routes/authRoutes";
import { protectedRoutes } from "./routes/protectedRoutes";
import { publicRoutes } from "./routes/publicRoutes";
import { useAuthStore } from "../modules/auth/store/authStore";
import { NotFound } from "../containers/common/ErrorPage";
export const AppRouter: React.FC = () => {
  const { initializeAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      setIsLoading(false);
    };
    init();
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Initializing...
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth routes (login, register) */}
      {authRoutes}
      
      {/* Protected routes (dashboard, admin) */}
      {protectedRoutes}
      
      {/* Public routes (home, about) */}
      {publicRoutes}
      {/* 404 Page - Must be last */}
        <Route path="*" element={<NotFound />} />
      
      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
