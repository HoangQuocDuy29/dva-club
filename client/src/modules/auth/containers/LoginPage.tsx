import React from "react";
import { Container } from "@mui/material";
import LoginForm from "../components/LoginForm";

export const LoginPage: React.FC = () => (
  <Container maxWidth="sm">
    <LoginForm />
  </Container>
);

export default LoginPage;
