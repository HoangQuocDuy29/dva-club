// E:\2_NodeJs\DVA_Club\volleyball-club-management\client\src\modules\auth\components\Login\LoginForm.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../../schemas";
import { useAuth } from "../../hooks/useAuth";
import { FaUserAlt, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "./LoginForm.css";

// Icon components for toast
const LockIcon = () => <span role="img" aria-label="lock">🔐</span>;
const WarningIcon = () => <span role="img" aria-label="warning">⚠️</span>;
const FireIcon = () => <span role="img" aria-label="fire">🔥</span>;
const NetworkIcon = () => <span role="img" aria-label="network">🌐</span>;
const ErrorIcon = () => <span role="img" aria-label="error">❌</span>;

const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  // ✅ Simple toggle function
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error: any) {
      console.error('Login failed:', error);
      
      if (error?.response?.status === 401) {
        toast.error("Sai thông tin đăng nhập! Vui lòng kiểm tra email và mật khẩu.", {
          icon: LockIcon
        });
      } else if (error?.response?.status === 422) {
        toast.error("Thông tin không hợp lệ! Vui lòng kiểm tra lại.", {
          icon: WarningIcon
        });
      } else if (error?.response?.status >= 500) {
        toast.error("Lỗi server! Vui lòng thử lại sau.", {
          icon: FireIcon
        });
      } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network')) {
        toast.error("Không thể kết nối server! Kiểm tra kết nối mạng.", {
          icon: NetworkIcon
        });
      } else {
        toast.error("Đăng nhập thất bại! Vui lòng thử lại.", {
          icon: ErrorIcon
        });
      }
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <h1>Login</h1>
        
        {/* ✅ Email Input */}
        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            autoComplete="username"
            {...register("email")}
            disabled={isLoading}
            tabIndex={1}
          />
          <FaUserAlt className="icon" />
        </div>
        {errors.email && (
          <div className="error-message">
            {errors.email.message}
          </div>
        )}

        {/* ✅ Password Input - Simplified với chỉ 1 icon toggle */}
        <div className="input-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            {...register("password")}
            disabled={isLoading}
            tabIndex={2}
          />
          {/* ✅ Chỉ 1 icon - toggle between eye/eye-slash */}
          <span
            className="password-toggle-icon"
            onClick={togglePasswordVisibility}
            role="button"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
            tabIndex={0}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && (
          <div className="error-message">
            {errors.password.message}
          </div>
        )}

        <div className="remember-forgot">
          <label>
            <input type="checkbox" disabled={isLoading} /> 
            Remember me
          </label>
          <a href="#">Forgot password?</a>
        </div>
        
        <button type="submit" disabled={isLoading} tabIndex={3}>
          {isLoading ? "Đang đăng nhập..." : "Login"}
        </button>
        
        
      </form>
    </div>
  );
};

export default LoginForm;
