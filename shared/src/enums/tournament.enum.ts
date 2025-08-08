export enum TournamentType {
  LEAGUE = 'league',
  KNOCKOUT = 'knockout',
  ROUND_ROBIN = 'round_robin',
  SINGLE_ELIMINATION = 'single_elimination',
  DOUBLE_ELIMINATION = 'double_elimination'
}

export enum TournamentStatus {
  DRAFT = 'draft',
  REGISTRATION_OPEN = 'registration_open',
  REGISTRATION_CLOSED = 'registration_closed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum TournamentLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  PROFESSIONAL = 'professional'
}

export enum RegistrationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded'
}

export enum MatchRound {
  GROUP_STAGE = 'group_stage',
  QUARTER_FINAL = 'quarter_final',
  SEMI_FINAL = 'semi_final',
  FINAL = 'final'
}

// Display names (optional - chỉ các enum quan trọng)
export const TOURNAMENT_STATUS_NAMES: Record<TournamentStatus, string> = {
  [TournamentStatus.DRAFT]: 'Bản nháp',
  [TournamentStatus.REGISTRATION_OPEN]: 'Đang mở đăng ký',
  [TournamentStatus.REGISTRATION_CLOSED]: 'Đã đóng đăng ký',
  [TournamentStatus.IN_PROGRESS]: 'Đang diễn ra',
  [TournamentStatus.COMPLETED]: 'Hoàn thành',
  [TournamentStatus.CANCELLED]: 'Đã hủy'
};
