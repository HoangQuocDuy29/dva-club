import React from "react";
import { Box, Typography } from "@mui/material";

const Footer: React.FC = () => (
  <Box component="footer" sx={{ py: 2, textAlign: "center", bgcolor: "#f5f5f5" }}>
    <Typography variant="body2" color="text.secondary">
      © {new Date().getFullYear()} Volleyball Club Management
    </Typography>
  </Box>
);

export default Footer;
