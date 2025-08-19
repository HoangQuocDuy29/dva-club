import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../../modules/auth/hooks/useAuth";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth(); // ✅ Sử dụng useAuth thay vì useAuthStore

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Volleyball Club
        </Typography>
        <Button component={Link} to="/" color="inherit">
          Trang chủ
        </Button>
        {isAuthenticated && user ? (
          <>
            <Button component={Link} to="/profile" color="inherit">
              Cá nhân
            </Button>
            <Typography variant="body2" sx={{ mx: 2, color: 'inherit' }}>
              Xin chào, {user.firstName || user.username || user.email}
            </Typography>
            <Button onClick={logout} color="inherit">
              Đăng xuất
            </Button>
          </>
        ) : (
          <Button component={Link} to="/login" color="inherit">
            Đăng nhập
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
