import { Route, Navigate } from "react-router-dom";
import HomePage from "../../modules/common/HomePage";
import MainLayout from "../../containers/layouts/MainLayout/MainLayout";
import { useAuthStore } from "../../modules/auth/store/authStore";

// ✅ Tạo component riêng cho Home route
const HomeRoute = () => {
  const { user, isAuthenticated } = useAuthStore();
  const hasValidAuth = user && (isAuthenticated || !!localStorage.getItem('auth-token'));
  
  // Admin auto-redirect to dashboard
  if (hasValidAuth && user?.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <MainLayout>
      <HomePage />
    </MainLayout>
  );
};

export const publicRoutes = [
  <Route 
    key="home" 
    path="/" 
    element={<HomeRoute />} // ✅ Sử dụng component
  />,
];
