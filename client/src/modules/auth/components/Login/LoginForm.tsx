// E:\2_NodeJs\DVA_Club\volleyball-club-management\client\src\modules\auth\components\Login\LoginForm.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../../schemas";
import { useAuth } from "../../hooks/useAuth";
import { FaUserAlt, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./LoginForm.css";
import { useNotification } from "../../../../containers/common/Notification/NotificationContext";

const LoginForm: React.FC = () => {
  const { showSuccess, showError } = useNotification();
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
      const response = await login(data);
      
      // ✅ Show custom success notification with user's name
      const userName = response?.user?.firstName || 'User';
      showSuccess(`Welcome back, ${userName}! Login successful! 🎉`);
      
      // ✅ Optional: Add slight delay before redirect to show notification
      // The redirect will be handled by the useAuth hook or auth context
      
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // ✅ Replace toast.error with custom showError notifications
      if (error?.response?.status === 401) {
        showError("🔐 Incorrect login credentials! Please check your email and password.");
      } else if (error?.response?.status === 422) {
        showError("⚠️ Invalid information! Please check your input.");
      } else if (error?.response?.status >= 500) {
        showError("🔥 Server error! Please try again later.");
      } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network')) {
        showError("🌐 Unable to connect to server! Check your network connection.");
      } else {
        showError("❌ Login failed! Please try again.");
      }
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <h1>Login DVA</h1>
        
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
