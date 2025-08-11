export enum AuthStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  INVALID_CREDENTIALS = 'invalid_credentials',
  USER_NOT_FOUND = 'user_not_found',
  USER_INACTIVE = 'user_inactive',
  USER_BANNED = 'user_banned',
  TOKEN_EXPIRED = 'token_expired',
  TOKEN_INVALID = 'token_invalid',
  TOKEN_BLACKLISTED = 'token_blacklisted',
  EMAIL_ALREADY_EXISTS = 'email_already_exists',
  USERNAME_ALREADY_EXISTS = 'username_already_exists',
  REGISTRATION_SUCCESS = 'registration_success',
  LOGIN_SUCCESS = 'login_success',
  LOGOUT_SUCCESS = 'logout_success',
  PASSWORD_RESET_SUCCESS = 'password_reset_success',
  EMAIL_VERIFICATION_REQUIRED = 'email_verification_required'
}

export enum UserRole {
  ADMIN = 'admin',
  COACH = 'coach', 
  MANAGER = 'manager',
  PLAYER = 'player',
  VIEWER = 'viewer'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  BANNED = 'banned'
}
