export interface UserContext {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Optional fields từ User entity
  phone?: string;        
  avatarUrl?: string;  
}
