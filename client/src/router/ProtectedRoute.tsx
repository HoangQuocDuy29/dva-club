import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../modules/auth/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isAuthenticated } = useAuthStore();
  
  // ✅ Enhanced auth check
  const hasValidAuth = user && (isAuthenticated || !!localStorage.getItem('auth-token'));

  if (!hasValidAuth) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
