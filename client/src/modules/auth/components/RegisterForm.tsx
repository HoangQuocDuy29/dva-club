import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Box, Paper, Typography } from "@mui/material";
import { registerSchema, type RegisterFormData } from "../schemas";
import { useAuth } from "../hooks/useAuth";

const RegisterForm: React.FC = () => {
  const { register: registerUser, registerError, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      // Có thể điều hướng tự động sang dashboard/login nếu muốn
    } catch (error) {
      // Error sẽ hiện qua registerError
      console.error("Register failed:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Đăng ký thành viên
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
        <TextField
          label="Tên đăng nhập"
          fullWidth
          margin="normal"
          error={!!errors.username}
          helperText={errors.username?.message}
          {...register("username")}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label="Mật khẩu"
          type="password"
          fullWidth
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password")}
        />
        <TextField
          label="Nhập lại mật khẩu"
          type="password"
          fullWidth
          margin="normal"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <TextField
          label="Họ"
          fullWidth
          margin="normal"
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          {...register("firstName")}
        />
        <TextField
          label="Tên"
          fullWidth
          margin="normal"
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          {...register("lastName")}
        />
        <TextField
          label="Số điện thoại"
          fullWidth
          margin="normal"
          error={!!errors.phone}
          helperText={errors.phone?.message}
          {...register("phone")}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{ mt: 3 }}
        >
          Đăng ký
        </Button>
        {registerError && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {registerError.message || "Đăng ký không thành công."}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default RegisterForm;
