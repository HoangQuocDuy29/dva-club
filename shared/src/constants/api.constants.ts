// API Base URLs
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const API_PREFIX = '/api';

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile'
} as const;

// User management endpoints
export const USER_ENDPOINTS = {
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,
  USER_PROFILE: (id: number) => `/users/${id}/profile`
} as const;

// Player management endpoints
export const PLAYER_ENDPOINTS = {
  PLAYERS: '/players',
  PLAYER_BY_ID: (id: number) => `/players/${id}`,
  PLAYER_STATS: (id: number) => `/players/${id}/stats`,
  PLAYER_PHOTOS: (id: number) => `/players/${id}/photos`
} as const;

// Team management endpoints
export const TEAM_ENDPOINTS = {
  TEAMS: '/teams',
  TEAM_BY_ID: (id: number) => `/teams/${id}`,
  TEAM_MEMBERS: (id: number) => `/teams/${id}/members`,
  TEAM_STATS: (id: number) => `/teams/${id}/stats`
} as const;

// Tournament endpoints
export const TOURNAMENT_ENDPOINTS = {
  TOURNAMENTS: '/tournaments',
  TOURNAMENT_BY_ID: (id: number) => `/tournaments/${id}`,
  TOURNAMENT_REGISTER: (id: number) => `/tournaments/${id}/register`,
  TOURNAMENT_STANDINGS: (id: number) => `/tournaments/${id}/standings`
} as const;

// Match endpoints
export const MATCH_ENDPOINTS = {
  MATCHES: '/matches',
  MATCH_BY_ID: (id: number) => `/matches/${id}`,
  MATCH_RESULT: (id: number) => `/matches/${id}/result`,
  MATCH_LINEUP: (id: number) => `/matches/${id}/lineup`
} as const;

// Application endpoints
export const APPLICATION_ENDPOINTS = {
  APPLICATIONS: '/applications',
  APPLICATION_BY_ID: (id: number) => `/applications/${id}`,
  APPLICATION_REVIEW: (id: number) => `/applications/${id}/review`
} as const;

// Media/File endpoints
export const MEDIA_ENDPOINTS = {
  UPLOAD: '/media/upload',
  FILES: '/media/files',
  FILE_BY_ID: (id: number) => `/media/files/${id}`
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
} as const;

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  VALIDATION_ERROR: 'Validation failed'
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded'
} as const;
