import React from "react";
import Header from "../../../pages/components/layout/Header/Header";
import Footer from "./Footers";
import { Box, Container } from "@mui/material";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box minHeight="100vh" display="flex" flexDirection="column">
    <Header />
    <Container maxWidth="lg" sx={{ flex: 1, mt: 4 }}>{children}</Container>
    <Footer />
  </Box>
);

export default MainLayout;
