export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  COACH = 'coach',
  ASSISTANT_COACH = 'assistant_coach',
  PLAYER = 'player',
  STAFF = 'staff',
  VIEWER = 'viewer'
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  PROFESSIONAL = 'professional'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum DominantHand {
  LEFT = 'left',
  RIGHT = 'right',
  AMBIDEXTROUS = 'ambidextrous'
}

// Display names cho UI (chỉ các role quan trọng)
export const USER_ROLE_NAMES: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Quản trị viên cấp cao',
  [UserRole.ADMIN]: 'Quản trị viên',
  [UserRole.COACH]: 'Huấn luyện viên',
  [UserRole.ASSISTANT_COACH]: 'Trợ lý HLV',
  [UserRole.PLAYER]: 'Cầu thủ',
  [UserRole.STAFF]: 'Nhân viên',
  [UserRole.VIEWER]: 'Người xem'
};

export const SKILL_LEVEL_NAMES: Record<SkillLevel, string> = {
  [SkillLevel.BEGINNER]: 'Mới bắt đầu',
  [SkillLevel.INTERMEDIATE]: 'Trung cấp',
  [SkillLevel.ADVANCED]: 'Nâng cao',
  [SkillLevel.PROFESSIONAL]: 'Chuyên nghiệp'
};
