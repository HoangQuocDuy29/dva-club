import { z } from 'zod';
import { UserRole, UserStatus, Gender } from '../enums';

// User creation schema
export const CreateUserSchema = z.object({
  username: z.string().min(3, 'Username phải có ít nhất 3 ký tự').max(50),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  firstName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').optional(),
  lastName: z.string().min(2, 'Họ phải có ít nhất 2 ký tự').optional(),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ').optional(),
  role: z.nativeEnum(UserRole).default(UserRole.PLAYER)
});

// User update schema
export const UpdateUserSchema = CreateUserSchema.partial().omit({ password: true });

// Change password schema
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(6, 'Xác nhận mật khẩu là bắt buộc')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword']
});

// Login schema
export const LoginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc')
});

// User profile schema
export const UpdateUserProfileSchema = z.object({
  dateOfBirth: z.date().optional(),
  gender: z.nativeEnum(Gender).optional(),
  address: z.string().max(500, 'Địa chỉ quá dài').optional(),
  bio: z.string().max(1000, 'Tiểu sử quá dài').optional(),
  emergencyContact: z.object({
    name: z.string().min(2, 'Tên người liên hệ phải có ít nhất 2 ký tự'),
    phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
    relationship: z.string().min(2, 'Mối quan hệ phải có ít nhất 2 ký tự')
  }).optional(),
  socialLinks: z.object({
    facebook: z.string().url('Facebook URL không hợp lệ').optional(),
    instagram: z.string().url('Instagram URL không hợp lệ').optional(),
    twitter: z.string().url('Twitter URL không hợp lệ').optional()
  }).optional()
});

// User filters schema
export const UserFiltersSchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  isActive: z.boolean().optional(),
  search: z.string().min(1).optional()
});

// Type exports
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type UpdateUserProfileDto = z.infer<typeof UpdateUserProfileSchema>;
export type UserFiltersDto = z.infer<typeof UserFiltersSchema>;
