// Application Information
export const APP_INFO = {
  NAME: 'Volleyball Club Management',
  SHORT_NAME: 'VCM',
  VERSION: '1.0.0',
  DESCRIPTION: 'Hệ thống quản lý câu lạc bộ bóng chuyền',
  AUTHOR: 'DVA Club'
} as const;

// Business Rules - Team Management
export const TEAM_LIMITS = {
  MIN_TEAM_SIZE: 6,
  MAX_TEAM_SIZE: 15,
  MIN_STARTERS: 6,
  MAX_SUBSTITUTES: 9,
  MAX_TEAMS_PER_DIVISION: 16
} as const;

// Business Rules - Player Management
export const PLAYER_LIMITS = {
  MIN_AGE: 16,
  MAX_AGE: 45,
  MIN_HEIGHT: 140,
  MAX_HEIGHT: 220,
  MIN_WEIGHT: 40,
  MAX_WEIGHT: 150,
  MAX_JERSEY_NUMBER: 99
} as const;

// Business Rules - Tournament
export const TOURNAMENT_LIMITS = {
  MIN_TEAMS: 4,
  MAX_TEAMS: 64,
  MIN_REGISTRATION_DAYS: 7,
  MAX_TOURNAMENT_DURATION: 30,
  MAX_MATCHES_PER_DAY: 8
} as const;

// Match Configuration
export const MATCH_CONFIG = {
  MAX_SETS: 5,
  POINTS_TO_WIN_SET: 25,
  POINTS_TO_WIN_FIFTH_SET: 15,
  MIN_POINT_DIFFERENCE: 2,
  MAX_TIMEOUTS_PER_SET: 2,
  TIMEOUT_DURATION: 30
} as const;

// File Upload Limits
export const FILE_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,  // 5MB
  MAX_FILES_PER_UPLOAD: 5,
  ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'webp'],
  ALLOWED_DOCUMENT_TYPES: ['pdf', 'doc', 'docx']
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 5
} as const;

// Date/Time Formats
export const DATE_FORMATS = {
  DATE_ONLY: 'DD/MM/YYYY',
  DATE_TIME: 'DD/MM/YYYY HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO_DATE: 'YYYY-MM-DD'
} as const;

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  PHONE_REGEX: /^[0-9]{10,11}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
} as const;

// Cache Duration (in seconds)
export const CACHE_DURATION = {
  SHORT: 300,    // 5 minutes
  MEDIUM: 1800,  // 30 minutes
  LONG: 3600,    // 1 hour
  VERY_LONG: 86400 // 24 hours
} as const;

// Default Values
export const DEFAULTS = {
  AVATAR_URL: '/images/default-avatar.png',
  TEAM_LOGO_URL: '/images/default-team-logo.png',
  TOURNAMENT_BANNER_URL: '/images/default-tournament-banner.png',
  ITEMS_PER_PAGE: 20,
  SKILL_LEVEL: 'beginner',
  PLAYER_STATUS: 'active'
} as const;
