export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
  BANNED = 'banned',
}

export enum UserAccountStatus {
  EMAIL_VERIFIED = 'email_verified',
  EMAIL_PENDING = 'email_pending',
  PHONE_VERIFIED = 'phone_verified',
  PHONE_PENDING = 'phone_pending',
  PROFILE_COMPLETE = 'profile_complete',
  PROFILE_INCOMPLETE = 'profile_incomplete',
}

export enum UserOnlineStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy',
}
