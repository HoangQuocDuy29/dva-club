export interface UserResponse {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDetailResponse extends UserResponse {
  // Extended fields for detailed user view
  profile?: {
    bio?: string;
    dateOfBirth?: Date;
    gender?: string;
    address?: string;
    emergencyContact?: string;
    socialLinks?: Record<string, any>;
  };
  
  // Statistics
  statistics?: {
    totalMatches: number;
    totalWins: number;
    totalLosses: number;
    winRate: number;
  };
  
  // Team information (if player/coach)
  teams?: {
    id: number;
    name: string;
    role: string; // player, coach, captain
  }[];
}

export interface UserMinimalResponse {
  id: number;
  username: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
  isActive: boolean;
}
