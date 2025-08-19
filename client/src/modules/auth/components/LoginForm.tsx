import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Box, Paper, Typography } from "@mui/material";
import { loginSchema, type LoginFormData } from "../schemas";
import { useAuth } from "../hooks/useAuth";

const LoginForm: React.FC = () => {
  const { login, loginError, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('Sending login data:', data); // ✅ Debug data gửi đi
    console.log('📤 Data type:', typeof data);
    console.log('📤 Data keys:', Object.keys(data));
   try {
    await login(data);
  } catch (error: unknown) { // ✅ Explicit type unknown
    console.error('❌ Login failed:', error);
    
    // ✅ Type guard để check error type
    if (error instanceof Error) {
      console.error('❌ Error message:', error.message);
    } else if (error && typeof error === 'object' && 'response' in error) {
      // ✅ Axios Error check
      const axiosError = error as any;
      console.error('❌ Axios error:', axiosError.response?.data);
      console.error('❌ Status:', axiosError.response?.status);
    } else {
      console.error('❌ Unknown error type:', String(error));
    }
  }
};

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Đăng nhập
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
        <TextField
          label="Tên đăng nhập"
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label="Mật khẩu"
          fullWidth
          margin="normal"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password")}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{ mt: 3 }}
        >
          Đăng nhập
        </Button>
        {loginError && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {loginError.message || "Đăng nhập không thành công."}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default LoginForm;
