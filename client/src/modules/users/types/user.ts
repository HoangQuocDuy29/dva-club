// E:\2_NodeJs\DVA_Club\volleyball-club-management\client\src\modules\users\types\user.ts
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "coach" | "player" | "manager" | "viewer";
  isActive: boolean;
  lastLogin: string;
  avatar?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface UserDetail extends User {
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  joinedDate: string;
  profile?: UserProfile;
}

export interface UserProfile {
  // Basic profile info
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  bio?: string;

  // Emergency contact
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };

  // Social links
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };

  // Optional legacy fields (keep for backward compatibility)
  id?: number;
  userId?: number;
  position?: string;
  teamName?: string;
  achievements?: string[];
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    emergencyNotes?: string;
  };
}
// ✅ NEW: API Response type cho profile
export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
  timestamp: string;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "admin" | "coach" | "player" | "manager" | "viewer";
  avatarUrl?: string;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "coach" | "player" | "manager" | "viewer";
  isActive: boolean;
  avatar?: string;
}

export interface PaginatedResponse<T> {
  data: T[]; // ← Array of items
  total: number; // ← Total count
  page: number; // ← Current page
  limit: number; // ← Items per page
  totalPages: number; // ← Total pages
}

export interface SearchUsersParams {
  role?: string;
  status?: string;
  search?: string;
  limit?: number;
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  newUsersThisWeek?: number;
  lastMonthGrowth?: number;
  usersByRole: {
    admin: number;
    coach: number;
    player: number;
    manager: number;
    viewer: number;
  };
}
export interface FormattedUserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: {
    role: string;
    count: number;
    percentage: number;
  }[];
}

// Additional interfaces for API responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ChangePasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

export interface AvatarUploadResponse {
  avatarUrl: string;
}
