import React from "react";
import { Box, Typography } from "@mui/material";

const AdminFooter: React.FC = () => (
  <Box component="footer" sx={{ py: 2, textAlign: "center", bgcolor: "#ececec" }}>
    <Typography variant="body2" color="text.secondary">
      © {new Date().getFullYear()} Volleyball Club Dashboard | Admin Only
    </Typography>
  </Box>
);

export default AdminFooter;
