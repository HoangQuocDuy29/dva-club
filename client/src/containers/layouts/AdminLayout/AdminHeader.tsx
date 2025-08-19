import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../../modules/auth/hooks/useAuth";

const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth(); // ✅ Sử dụng useAuth thay vì useAuthStore

  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Admin Dashboard
        </Typography>
        <Button component={Link} to="/dashboard" color="inherit">
          Dashboard
        </Button>
        <Button component={Link} to="/admin/teams" color="inherit">
          Quản lý Đội
        </Button>
        <Button component={Link} to="/admin/users" color="inherit">
          Quản lý Users
        </Button>
        <Button component={Link} to="/admin/players" color="inherit">
          Quản lý Cầu thủ
        </Button>
        <Typography variant="body2" sx={{ mx: 2, color: 'inherit' }}>
          👤 {user?.firstName || user?.username || 'Admin'}
        </Typography>
        <Button onClick={logout} color="inherit">
          Đăng xuất
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
