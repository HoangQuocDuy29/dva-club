import React from "react";
import { Container } from "@mui/material";
import RegisterForm from "../components/RegisterForm";

export const RegisterPage: React.FC = () => (
  <Container maxWidth="sm">
    <RegisterForm />
  </Container>
);

export default RegisterPage;
