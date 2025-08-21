// src/modules/users/components/UserList/utils/userHelpers.ts
import type { CreateUserRequest } from "../../../../../../users/types/user";

export const getRoleColor = (role: string) => {
  const colors = {
    admin: "error",
    coach: "warning",
    player: "primary",
    manager: "secondary",
    viewer: "info",
  };
  return colors[role as keyof typeof colors] || "default";
};

export const getStatusLabel = (isActive: boolean | undefined) =>
  isActive ? "Active" : "Inactive";

export const getStatusColor = (isActive: boolean | undefined) =>
  isActive ? "success" : "error";

export const validateCreateUser = (user: CreateUserRequest): string[] => {
  const errors: string[] = [];
  if (!user.email) errors.push("Email is required");
  if (!user.username) errors.push("Username is required");
  if (!user.password) errors.push("Password is required");
  if (!user.firstName) errors.push("First name is required");
  if (!user.lastName) errors.push("Last name is required");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (user.email && !emailRegex.test(user.email)) {
    errors.push("Invalid email format");
  }
  if (user.password && user.password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (user.username && user.username.length < 3) {
    errors.push("Username must be at least 3 characters");
  }

  return errors;
};
