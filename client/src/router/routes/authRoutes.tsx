import { Route, Navigate } from "react-router-dom";
import { LoginPage } from "../../modules/auth/containers/LoginPage";
import { RegisterPage } from "../../modules/auth/containers/RegisterPage";
import { useAuthStore } from "../../modules/auth/store/authStore";

// ✅ Tạo component riêng cho auth redirect
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  const hasValidAuth = user && (isAuthenticated || !!localStorage.getItem('auth-token'));
  
  if (hasValidAuth && user) {
    return user.role === 'admin' ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export const authRoutes = [
  <Route 
    key="login" 
    path="/login" 
    element={
      <AuthRoute>
        <LoginPage />
      </AuthRoute>
    } 
  />,
  <Route 
    key="register" 
    path="/register" 
    element={
      <AuthRoute>
        <RegisterPage />
      </AuthRoute>
    } 
  />,
];
