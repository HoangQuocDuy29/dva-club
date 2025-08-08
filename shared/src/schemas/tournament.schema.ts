import { z } from 'zod';
import { 
  TournamentType, 
  TournamentStatus, 
  TournamentLevel, 
  RegistrationStatus, 
  PaymentStatus 
} from '../enums';

// Tournament creation schema
export const CreateTournamentSchema = z.object({
  name: z.string().min(3, 'Tên giải đấu phải có ít nhất 3 ký tự').max(100),
  description: z.string().max(1000, 'Mô tả quá dài').optional(),
  type: z.nativeEnum(TournamentType),
  level: z.nativeEnum(TournamentLevel),
  maxTeams: z.number().min(4, 'Tối thiểu 4 đội').max(64, 'Tối đa 64 đội'),
  registrationFee: z.number().min(0, 'Phí đăng ký không được âm').optional(),
  prizeMoney: z.number().min(0, 'Tiền thưởng không được âm').optional(),
  venue: z.string().max(200, 'Địa điểm quá dài').optional(),
  startDate: z.date(),
  endDate: z.date(),
  registrationStartDate: z.date(),
  registrationEndDate: z.date(),
  contactEmail: z.string().email('Email không hợp lệ').optional(),
  contactPhone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ').optional(),
  rules: z.string().max(5000, 'Luật thi đấu quá dài').optional(),
  requirements: z.string().max(2000, 'Yêu cầu quá dài').optional()
}).refine((data) => data.endDate > data.startDate, {
  message: 'Ngày kết thúc phải sau ngày bắt đầu',
  path: ['endDate']
}).refine((data) => data.registrationEndDate > data.registrationStartDate, {
  message: 'Ngày đóng đăng ký phải sau ngày mở đăng ký',
  path: ['registrationEndDate']
}).refine((data) => data.registrationEndDate <= data.startDate, {
  message: 'Đăng ký phải đóng trước khi giải đấu bắt đầu',
  path: ['registrationEndDate']
});

// Tournament update schema
export const UpdateTournamentSchema = z.object({
  name: z.string().min(3, 'Tên giải đấu phải có ít nhất 3 ký tự').max(100).optional(),
  description: z.string().max(1000, 'Mô tả quá dài').optional(),
  type: z.nativeEnum(TournamentType).optional(),
  level: z.nativeEnum(TournamentLevel).optional(),
  maxTeams: z.number().min(4, 'Tối thiểu 4 đội').max(64, 'Tối đa 64 đội').optional(),
  registrationFee: z.number().min(0, 'Phí đăng ký không được âm').optional(),
  prizeMoney: z.number().min(0, 'Tiền thưởng không được âm').optional(),
  venue: z.string().max(200, 'Địa điểm quá dài').optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  registrationStartDate: z.date().optional(),
  registrationEndDate: z.date().optional(),
  contactEmail: z.string().email('Email không hợp lệ').optional(),
  contactPhone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ').optional(),
  rules: z.string().max(5000, 'Luật thi đấu quá dài').optional(),
  requirements: z.string().max(2000, 'Yêu cầu quá dài').optional()
});


// Tournament registration schema
export const TournamentRegistrationSchema = z.object({
  tournamentId: z.number().positive('Tournament ID không hợp lệ'),
  teamId: z.number().positive('Team ID không hợp lệ'),
  notes: z.string().max(500, 'Ghi chú quá dài').optional()
});

// Registration review schema
export const RegistrationReviewSchema = z.object({
  registrationId: z.number().positive('Registration ID không hợp lệ'),
  status: z.nativeEnum(RegistrationStatus),
  notes: z.string().max(1000, 'Ghi chú quá dài').optional()
});

// Tournament filters schema
export const TournamentFiltersSchema = z.object({
  type: z.nativeEnum(TournamentType).optional(),
  level: z.nativeEnum(TournamentLevel).optional(),
  status: z.nativeEnum(TournamentStatus).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  minTeams: z.number().min(1).optional(),
  maxTeams: z.number().min(1).optional(),
  hasRegistrationFee: z.boolean().optional(),
  search: z.string().min(1).optional()
});

// Match creation schema (for tournament matches)
export const CreateTournamentMatchSchema = z.object({
  tournamentId: z.number().positive('Tournament ID không hợp lệ'),
  homeTeamId: z.number().positive('Home team ID không hợp lệ'),
  awayTeamId: z.number().positive('Away team ID không hợp lệ'),
  scheduledDate: z.date(),
  venue: z.string().max(200, 'Địa điểm quá dài').optional(),
  round: z.string().min(1, 'Vòng thi đấu là bắt buộc'),
  matchNumber: z.number().positive().optional()
}).refine((data) => data.homeTeamId !== data.awayTeamId, {
  message: 'Đội nhà và đội khách phải khác nhau',
  path: ['awayTeamId']
});

// Tournament standings update schema
export const UpdateStandingsSchema = z.object({
  tournamentId: z.number().positive('Tournament ID không hợp lệ'),
  teamId: z.number().positive('Team ID không hợp lệ'),
  matchesPlayed: z.number().min(0, 'Số trận đã chơi không được âm'),
  wins: z.number().min(0, 'Số trận thắng không được âm'),
  losses: z.number().min(0, 'Số trận thua không được âm'),
  pointsFor: z.number().min(0, 'Điểm ghi được không được âm'),
  pointsAgainst: z.number().min(0, 'Điểm bị ghi không được âm')
});

// Type exports
export type CreateTournamentDto = z.infer<typeof CreateTournamentSchema>;
export type UpdateTournamentDto = z.infer<typeof UpdateTournamentSchema>;
export type TournamentRegistrationDto = z.infer<typeof TournamentRegistrationSchema>;
export type RegistrationReviewDto = z.infer<typeof RegistrationReviewSchema>;
export type TournamentFiltersDto = z.infer<typeof TournamentFiltersSchema>;
export type CreateTournamentMatchDto = z.infer<typeof CreateTournamentMatchSchema>;
export type UpdateStandingsDto = z.infer<typeof UpdateStandingsSchema>;
