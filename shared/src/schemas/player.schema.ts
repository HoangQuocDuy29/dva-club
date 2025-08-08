import { z } from 'zod';
import { 
  VolleyballPosition, 
  SkillLevel, 
  PlayerStatus, 
  Gender, 
  DominantHand 
} from '../enums';

// Player creation schema
export const CreatePlayerSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100),
  gender: z.nativeEnum(Gender).describe('Vui lòng chọn giới tính của người chơi') ,
  dateOfBirth: z.date().optional(),
  height: z.number().min(140, 'Chiều cao tối thiểu 140cm').max(220, 'Chiều cao tối đa 220cm').optional(),
  weight: z.number().min(40, 'Cân nặng tối thiểu 40kg').max(150, 'Cân nặng tối đa 150kg').optional(),
  dominantHand: z.nativeEnum(DominantHand).optional(),
  jerseyNumber: z.number().min(1, 'Số áo tối thiểu là 1').max(99, 'Số áo tối đa là 99').optional(),
  primaryPosition: z.nativeEnum(VolleyballPosition).optional(),
  secondaryPositions: z.array(z.nativeEnum(VolleyballPosition)).optional(),
  skillLevel: z.nativeEnum(SkillLevel).default(SkillLevel.BEGINNER),
  contactInfo: z.object({
    phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ').optional(),
    email: z.string().email('Email không hợp lệ').optional(),
    address: z.string().max(500, 'Địa chỉ quá dài').optional()
  }).optional(),
  medicalNotes: z.string().max(1000, 'Ghi chú y tế quá dài').optional(),
  notes: z.string().max(1000, 'Ghi chú quá dài').optional()
});

// Player update schema
export const UpdatePlayerSchema = CreatePlayerSchema.partial();

// Player transfer schema
export const TransferPlayerSchema = z.object({
  playerId: z.number().positive('Player ID không hợp lệ'),
  fromTeamId: z.number().positive('From Team ID không hợp lệ').optional(),
  toTeamId: z.number().positive('To Team ID không hợp lệ'),
  transferDate: z.date().default(() => new Date()),
  reason: z.string().max(500, 'Lý do chuyển đội quá dài').optional()
});

// Player status update schema
export const UpdatePlayerStatusSchema = z.object({
  playerId: z.number().positive('Player ID không hợp lệ'),
  status: z.nativeEnum(PlayerStatus),
  injuryDetails: z.string().max(1000, 'Chi tiết chấn thương quá dài').optional(),
  expectedRecoveryDate: z.date().optional(),
  notes: z.string().max(500, 'Ghi chú quá dài').optional()
});

// Player statistics update schema
export const UpdatePlayerStatsSchema = z.object({
  playerId: z.number().positive('Player ID không hợp lệ'),
  seasonYear: z.number().min(2020, 'Năm mùa giải không hợp lệ'),
  teamId: z.number().positive('Team ID không hợp lệ').optional(),
  matchesPlayed: z.number().min(0, 'Số trận đã chơi không được âm').default(0),
  servesAttempted: z.number().min(0).default(0),
  servesSuccessful: z.number().min(0).default(0),
  aces: z.number().min(0).default(0),
  attacksAttempted: z.number().min(0).default(0),
  attacksSuccessful: z.number().min(0).default(0),
  blocksSuccessful: z.number().min(0).default(0),
  digs: z.number().min(0).default(0),
  receptions: z.number().min(0).default(0),
  sets: z.number().min(0).default(0)
}).refine((data) => data.servesSuccessful <= data.servesAttempted, {
  message: 'Số lần giao bóng thành công không thể lớn hơn số lần thử',
  path: ['servesSuccessful']
}).refine((data) => data.attacksSuccessful <= data.attacksAttempted, {
  message: 'Số lần tấn công thành công không thể lớn hơn số lần thử',
  path: ['attacksSuccessful']
});

// Player filters schema
export const PlayerFiltersSchema = z.object({
  gender: z.nativeEnum(Gender).optional(),
  skillLevel: z.nativeEnum(SkillLevel).optional(),
  position: z.nativeEnum(VolleyballPosition).optional(),
  status: z.nativeEnum(PlayerStatus).optional(),
  teamId: z.number().positive().optional(),
  minHeight: z.number().min(140).optional(),
  maxHeight: z.number().max(220).optional(),
  minAge: z.number().min(16).optional(),
  maxAge: z.number().max(50).optional(),
  hasTeam: z.boolean().optional(),
  search: z.string().min(1).optional()
});

// Player performance evaluation schema
export const PlayerEvaluationSchema = z.object({
  playerId: z.number().positive('Player ID không hợp lệ'),
  seasonYear: z.number().min(2020, 'Năm mùa giải không hợp lệ'),
  rating: z.number().min(1, 'Điểm đánh giá tối thiểu là 1').max(10, 'Điểm đánh giá tối đa là 10'),
  strengths: z.array(z.string().min(1)).max(10, 'Tối đa 10 điểm mạnh'),
  weaknesses: z.array(z.string().min(1)).max(10, 'Tối đa 10 điểm yếu'),
  coachNotes: z.string().max(2000, 'Ghi chú huấn luyện viên quá dài').optional(),
  improvementPlan: z.string().max(1000, 'Kế hoạch cải thiện quá dài').optional()
});

// Type exports
export type CreatePlayerDto = z.infer<typeof CreatePlayerSchema>;
export type UpdatePlayerDto = z.infer<typeof UpdatePlayerSchema>;
export type TransferPlayerDto = z.infer<typeof TransferPlayerSchema>;
export type UpdatePlayerStatusDto = z.infer<typeof UpdatePlayerStatusSchema>;
export type UpdatePlayerStatsDto = z.infer<typeof UpdatePlayerStatsSchema>;
export type PlayerFiltersDto = z.infer<typeof PlayerFiltersSchema>;
export type PlayerEvaluationDto = z.infer<typeof PlayerEvaluationSchema>;
