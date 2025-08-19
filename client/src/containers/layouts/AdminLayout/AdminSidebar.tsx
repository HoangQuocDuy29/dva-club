import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import {
  Dashboard,
  People,
  Groups,
  EmojiEvents,
  SportsVolleyball,
  Photo,
  Settings,
  Analytics,
  Person,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Quản lý Users", icon: <People />, path: "/admin/users" },
    { text: "Quản lý Đội", icon: <Groups />, path: "/admin/teams" },
    { text: "Quản lý Cầu thủ", icon: <Person />, path: "/admin/players" },
    { text: "Giải đấu", icon: <EmojiEvents />, path: "/admin/tournaments" },
    { text: "Trận đấu", icon: <SportsVolleyball />, path: "/admin/matches" },
    { text: "Media", icon: <Photo />, path: "/admin/media" },
    { text: "Thống kê", icon: <Analytics />, path: "/admin/analytics" },
    { text: "Cài đặt", icon: <Settings />, path: "/admin/settings" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: 240, 
          boxSizing: "border-box",
          position: "relative",
          height: "100%",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          🏐 Admin Panel
        </Typography>
      </Box>
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  color: "primary.contrastText",
                  "& .MuiListItemIcon-root": {
                    color: "primary.contrastText",
                  },
                },
                "&:hover": {
                  backgroundColor: "primary.light",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ mt: "auto" }} />
      
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          v1.0.0 - Admin Mode
        </Typography>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
