import { UserRole, UserStatus, Gender } from '../enums';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: number;
  userId: number;
  dateOfBirth?: Date;
  gender?: Gender;
  address?: string;
  emergencyContact?: EmergencyContact;
  bio?: string;
  socialLinks?: SocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  isActive?: boolean;
  search?: string;
}
