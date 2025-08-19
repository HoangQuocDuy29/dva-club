import { Route } from "react-router-dom";
import DashboardPage from "../../modules/dashboard/DashboardPage";
import AdminLayout from "../../containers/layouts/AdminLayout/AdminLayout";
import { ProtectedRoute } from "../ProtectedRoute";

export const protectedRoutes = [
  <Route 
    key="dashboard" 
    path="/dashboard" 
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminLayout>
          <DashboardPage />
        </AdminLayout>
      </ProtectedRoute>
    } 
  />,
  // ✅ Thêm các protected routes khác sau
  // <Route key="profile" path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />,
];
