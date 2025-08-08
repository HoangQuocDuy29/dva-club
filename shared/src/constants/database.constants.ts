// Database Table Names
export const TABLE_NAMES = {
  USERS: 'users',
  USER_PROFILES: 'user_profiles',
  PLAYERS: 'players',
  PLAYER_STATISTICS: 'player_statistics',
  TEAMS: 'teams',
  TEAM_MEMBERS: 'team_members',
  TEAM_STATS: 'team_stats',
  DIVISIONS: 'divisions',
  TOURNAMENTS: 'tournaments',
  TOURNAMENT_REGISTRATIONS: 'tournament_registrations',
  MATCHES: 'matches',
  MATCH_RESULTS: 'match_results',
  PLAYER_MATCH_STATS: 'player_match_stats',
  MATCH_LINEUPS: 'match_lineups',
  APPLICATIONS: 'registration_applications',
  APPLICATION_REVIEWS: 'application_reviews',
  MEDIA_FILES: 'media_files',
  PLAYER_PHOTOS: 'player_photos',
  SYSTEM_CONFIGS: 'system_configs',
  AUDIT_LOGS: 'audit_logs'
} as const;

// Database Connection Config
export const DB_CONFIG = {
  DEFAULT_PORT: 5432,
  CONNECTION_TIMEOUT: 30000,
  QUERY_TIMEOUT: 10000,
  MAX_CONNECTIONS: 20,
  MIN_CONNECTIONS: 5
} as const;

// Default Column Values
export const DEFAULT_VALUES = {
  BOOLEAN_FALSE: false,
  BOOLEAN_TRUE: true,
  SKILL_LEVEL: 'beginner',
  USER_ROLE: 'player',
  PLAYER_STATUS: 'active',
  TEAM_STATUS: 'active',
  MATCH_STATUS: 'scheduled',
  APPLICATION_STATUS: 'pending',
  IS_ACTIVE: true,
  MAX_TEAMS: 16,
  MAX_MEMBERS: 15
} as const;

// Database Constraints
export const DB_CONSTRAINTS = {
  MAX_STRING_LENGTH: 255,
  MAX_TEXT_LENGTH: 65535,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 255,
  MAX_PHONE_LENGTH: 20,
  MAX_URL_LENGTH: 500,
  MIN_PASSWORD_HASH_LENGTH: 60,
  UUID_LENGTH: 36
} as const;

// Indexes and Performance
export const DB_INDEXES = {
  EMAIL_INDEX: 'idx_users_email',
  PLAYER_CODE_INDEX: 'idx_players_code',
  TEAM_NAME_INDEX: 'idx_teams_name',
  MATCH_DATE_INDEX: 'idx_matches_scheduled_date',
  APPLICATION_STATUS_INDEX: 'idx_applications_status'
} as const;

// Migration Constants
export const MIGRATION_CONFIG = {
  MIGRATION_TABLE: 'typeorm_migrations',
  MIGRATION_LOCK_TABLE: 'typeorm_migrations_lock',
  AUTO_MIGRATION: false,
  SYNC_SCHEMA: false
} as const;

// Common Query Filters
export const QUERY_DEFAULTS = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0,
  DEFAULT_ORDER: 'ASC',
  DATE_FORMAT: 'YYYY-MM-DD HH24:MI:SS'
} as const;
