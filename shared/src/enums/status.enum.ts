export enum PlayerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  INJURED = 'injured',
  SUSPENDED = 'suspended',
  RETIRED = 'retired'
}

export enum TeamMemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TRANSFERRED = 'transferred'
}

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  POSTPONED = 'postponed',
  CANCELLED = 'cancelled'
}

export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

// Display names cho UI (chỉ các status quan trọng)
export const PLAYER_STATUS_NAMES: Record<PlayerStatus, string> = {
  [PlayerStatus.ACTIVE]: 'Đang hoạt động',
  [PlayerStatus.INACTIVE]: 'Tạm ngưng',
  [PlayerStatus.INJURED]: 'Chấn thương',
  [PlayerStatus.SUSPENDED]: 'Đình chỉ',
  [PlayerStatus.RETIRED]: 'Nghỉ hưu'
};

export const MATCH_STATUS_NAMES: Record<MatchStatus, string> = {
  [MatchStatus.SCHEDULED]: 'Đã lên lịch',
  [MatchStatus.IN_PROGRESS]: 'Đang diễn ra',
  [MatchStatus.COMPLETED]: 'Hoàn thành',
  [MatchStatus.POSTPONED]: 'Hoãn lại',
  [MatchStatus.CANCELLED]: 'Đã hủy'
};
