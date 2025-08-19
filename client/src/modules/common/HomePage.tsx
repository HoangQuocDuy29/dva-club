import React from "react";
import { Typography, Paper, Box } from "@mui/material";

const HomePage: React.FC = () => (
  <Box>
    <Paper elevation={3} sx={{ p: 5, m: 2, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        Chào mừng đến với Volleyball Club Management!
      </Typography>
      <Typography variant="h6" color="text.secondary">
        {`Hệ thống quản lý CLB Bóng chuyền:`}
      </Typography>
      <Typography sx={{ mt: 2 }}>
        - Quản lý hồ sơ thành viên, cập nhật thông tin cá nhân<br/>
        - Theo dõi các đội bóng, giải đấu, kết quả trận đấu<br/>
        - Tra cứu lịch thi đấu, danh sách thành viên, thống kê thành tích<br/>
      </Typography>
      <Typography sx={{ mt: 3 }} color="primary">
        Bạn hãy bắt đầu bằng cách đăng nhập, hoặc vào trang cá nhân để cập nhật thông tin!
      </Typography>
    </Paper>
  </Box>
);

export default HomePage;
