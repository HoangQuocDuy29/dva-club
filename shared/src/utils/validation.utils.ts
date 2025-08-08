import { z } from 'zod';
import { VALIDATION, PLAYER_LIMITS, TEAM_LIMITS } from '../constants';
import { 
  UserRole, 
  PlayerStatus, 
  VolleyballPosition,
  Gender,
  SkillLevel 
} from '../enums';
import { calculatePercentage } from './statistics.utils';
import { calculateAge, isDateInPast, isDateInFuture } from './date.utils'; // ← Import từ date.utils

// Basic validation helpers
export const isValidEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  return VALIDATION.PHONE_REGEX.test(phone);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= VALIDATION.MIN_PASSWORD_LENGTH && 
         password.length <= VALIDATION.MAX_PASSWORD_LENGTH;
};

export const isValidPlayerAge = (dateOfBirth: Date): boolean => {
  const age = calculateAge(dateOfBirth);
  return age >= PLAYER_LIMITS.MIN_AGE && age <= PLAYER_LIMITS.MAX_AGE;
};

// Physical measurements validation
export const isValidHeight = (height: number): boolean => {
  return height >= PLAYER_LIMITS.MIN_HEIGHT && height <= PLAYER_LIMITS.MAX_HEIGHT;
};

export const isValidWeight = (weight: number): boolean => {
  return weight >= PLAYER_LIMITS.MIN_WEIGHT && weight <= PLAYER_LIMITS.MAX_WEIGHT;
};

// Jersey number validation
export const isValidJerseyNumber = (number: number): boolean => {
  return number >= 1 && number <= PLAYER_LIMITS.MAX_JERSEY_NUMBER;
};

export const isJerseyNumberAvailable = (
  jerseyNumber: number, 
  teamMembers: Array<{ jerseyNumber?: number; id: number }>,
  excludePlayerId?: number
): boolean => {
  return !teamMembers.some(member => 
    member.jerseyNumber === jerseyNumber && member.id !== excludePlayerId
  );
};

// Team validation
export const isValidTeamSize = (memberCount: number): boolean => {
  return memberCount >= TEAM_LIMITS.MIN_TEAM_SIZE && 
         memberCount <= TEAM_LIMITS.MAX_TEAM_SIZE;
};

export const canAddPlayerToTeam = (
  currentMemberCount: number,
  maxTeamSize: number = TEAM_LIMITS.MAX_TEAM_SIZE
): boolean => {
  return currentMemberCount < maxTeamSize;
};

// Role and permission validation
export const hasPermission = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(userRole);
};

export const isCoachRole = (role: UserRole): boolean => {
  return role === UserRole.COACH || role === UserRole.ASSISTANT_COACH;
};

export const isAdminRole = (role: UserRole): boolean => {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN;
};

// ← XÓA date validation helpers (sử dụng từ date.utils)
// export const isDateInPast = (date: Date): boolean => {
//   return date < new Date();
// };

// export const isDateInFuture = (date: Date): boolean => {
//   return date > new Date();
// };

export const isValidDateRange = (startDate: Date, endDate: Date): boolean => {
  return endDate > startDate;
};

export const isRegistrationOpen = (
  registrationStart: Date, 
  registrationEnd: Date,
  currentDate: Date = new Date()
): boolean => {
  return currentDate >= registrationStart && currentDate <= registrationEnd;
};

// File validation
export const isValidImageFile = (filename: string): boolean => {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? ['jpg', 'jpeg', 'png', 'webp'].includes(ext) : false;
};

export const isValidFileSize = (size: number, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size <= maxSizeBytes;
};

// Tournament validation
export const isValidTournamentDates = (
  registrationStart: Date,
  registrationEnd: Date,
  tournamentStart: Date,
  tournamentEnd: Date
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (registrationEnd <= registrationStart) {
    errors.push('Ngày đóng đăng ký phải sau ngày mở đăng ký');
  }

  if (tournamentEnd <= tournamentStart) {
    errors.push('Ngày kết thúc giải đấu phải sau ngày bắt đầu');
  }

  if (registrationEnd > tournamentStart) {
    errors.push('Đăng ký phải đóng trước khi giải đấu bắt đầu');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Match validation
export const isValidMatchScore = (homeScore: number, awayScore: number): boolean => {
  return homeScore >= 0 && awayScore >= 0 && (homeScore !== awayScore || (homeScore === 0 && awayScore === 0));
};

export const isValidSetScore = (score1: number, score2: number): boolean => {
  const maxScore = Math.max(score1, score2);
  const minScore = Math.min(score1, score2);
  
  // Standard set: first to 25, must win by 2
  if (maxScore >= 25 && (maxScore - minScore) >= 2) return true;
  
  // Deciding set: first to 15, must win by 2
  if (maxScore >= 15 && (maxScore - minScore) >= 2) return true;
  
  return false;
};

// Statistics validation
export const isValidPercentage = (value: number): boolean => {
  return value >= 0 && value <= 100;
};

// Sanitization helpers
export const sanitizeSearchQuery = (query: string): string => {
  return query.trim().toLowerCase().replace(/[^\w\s]/gi, '');
};

export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
};

// Complex validation schemas
export const validatePlayerData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (data.dateOfBirth && !isValidPlayerAge(data.dateOfBirth)) {
    errors.push(`Tuổi cầu thủ phải từ ${PLAYER_LIMITS.MIN_AGE} đến ${PLAYER_LIMITS.MAX_AGE}`);
  }

  if (data.height && !isValidHeight(data.height)) {
    errors.push(`Chiều cao phải từ ${PLAYER_LIMITS.MIN_HEIGHT}cm đến ${PLAYER_LIMITS.MAX_HEIGHT}cm`);
  }

  if (data.weight && !isValidWeight(data.weight)) {
    errors.push(`Cân nặng phải từ ${PLAYER_LIMITS.MIN_WEIGHT}kg đến ${PLAYER_LIMITS.MAX_WEIGHT}kg`);
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push('Email không hợp lệ');
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.push('Số điện thoại không hợp lệ');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
