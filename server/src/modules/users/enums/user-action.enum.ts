export enum UserAction {
  // Account management
  CREATED = 'user_created',
  UPDATED = 'user_updated',
  DELETED = 'user_deleted',
  ACTIVATED = 'user_activated',
  DEACTIVATED = 'user_deactivated',
  SUSPENDED = 'user_suspended',
  BANNED = 'user_banned',
  UNBANNED = 'user_unbanned',

  // Authentication
  LOGIN = 'user_login',
  LOGOUT = 'user_logout',
  PASSWORD_CHANGED = 'password_changed',
  PASSWORD_RESET = 'password_reset',

  // Profile management
  PROFILE_UPDATED = 'profile_updated',
  AVATAR_UPLOADED = 'avatar_uploaded',
  AVATAR_DELETED = 'avatar_deleted',

  // Role management
  ROLE_ASSIGNED = 'role_assigned',
  ROLE_CHANGED = 'role_changed',
  ROLE_REMOVED = 'role_removed',

  // Team management
  JOINED_TEAM = 'joined_team',
  LEFT_TEAM = 'left_team',
  TEAM_ROLE_CHANGED = 'team_role_changed',
}

export enum UserPermission {
  // User management
  READ_USERS = 'read:users',
  WRITE_USERS = 'write:users',
  DELETE_USERS = 'delete:users',
  MANAGE_USERS = 'manage:users',

  // Profile management
  READ_PROFILE = 'read:profile',
  WRITE_PROFILE = 'write:profile',
  MANAGE_PROFILE = 'manage:profile',

  // System permissions
  VIEW_DASHBOARD = 'view:dashboard',
  MANAGE_SYSTEM = 'manage:system',
}
