import { z } from "zod";

// ✅ Login bằng username (match với backend)
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
});

// ✅ Alternative: Login bằng email
export const loginByEmailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ✅ Register schema - match với User entity
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscore"
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .max(100, "Email must be less than 100 characters")
      .email("Invalid email format"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be less than 50 characters"),
    confirmPassword: z.string(),
    firstName: z
      .string()
      .max(100, "First name must be less than 100 characters")
      .optional()
      .or(z.literal("")),
    lastName: z
      .string()
      .max(100, "Last name must be less than 100 characters")
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .max(20, "Phone must be less than 20 characters")
      .regex(/^[\+]?[(]?[\+]?\d{10,15}$/, "Invalid phone number format")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Type inference
export type LoginFormData = z.infer<typeof loginSchema>;
export type LoginByEmailFormData = z.infer<typeof loginByEmailSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
