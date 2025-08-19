import React from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import { Box } from "@mui/material";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box minHeight="100vh" display="flex" flexDirection="column">
    <AdminHeader />
    <Box display="flex" flex={1}>
      <AdminSidebar />
      <Box 
        flex={1} 
        p={3}
        sx={{ 
          backgroundColor: "#f8f9fa",
          minHeight: "calc(100vh - 64px)", // Trừ đi height của header
        }}
      >
        {children}
      </Box>
    </Box>
    <AdminFooter />
  </Box>
);

export default AdminLayout;
