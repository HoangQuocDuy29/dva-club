import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const StatCard = ({ label, value }: { label: string; value: number | string }) => (
  <Box sx={{ minWidth: 250, flexBasis: "calc(25% - 24px)" }}>
    <Paper sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
      <Typography variant="subtitle1">{label}</Typography>
    </Paper>
  </Box>
);

const DashboardPage: React.FC = () => (
  <Box sx={{ m: 3 }}>
    <Typography variant="h4" gutterBottom>
      Bảng điều khiển quản trị viên
    </Typography>
    <Box 
      sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3,
        justifyContent: 'flex-start'
      }}
    >
      <StatCard label="Tổng số thành viên" value={72} />
      <StatCard label="Đội bóng" value={6} />
      <StatCard label="Giải đấu" value={3} />
      <StatCard label="Trận đấu đã diễn ra" value={18} />
    </Box>
  </Box>
);

export default DashboardPage;
