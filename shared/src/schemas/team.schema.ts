import { z } from 'zod';
import { 
  VolleyballPosition, 
  TeamMemberStatus, 
  SkillLevel 
} from '../enums';

// Division schema
export const CreateDivisionSchema = z.object({
  name: z.string().min(2, 'Tên giải đấu phải có ít nhất 2 ký tự').max(100),
  code: z.string().min(2, 'Mã giải đấu phải có ít nhất 2 ký tự').max(20),
  description: z.string().max(1000, 'Mô tả quá dài').optional(),
  maxTeams: z.number().min(4, 'Tối thiểu 4 đội').max(64, 'Tối đa 64 đội'),
  isActive: z.boolean().default(true)
});

export const UpdateDivisionSchema = CreateDivisionSchema.partial();

// Team creation schema
export const CreateTeamSchema = z.object({
  name: z.string().min(2, 'Tên đội phải có ít nhất 2 ký tự').max(100),
  shortName: z.string().min(1, 'Tên ngắn không được trống').max(20).optional(),
  level: z.number().min(1, 'Cấp độ tối thiểu là 1').max(10, 'Cấp độ tối đa là 10'),
  description: z.string().max(1000, 'Mô tả quá dài').optional(),
  maxMembers: z.number().min(6, 'Tối thiểu 6 thành viên').max(20, 'Tối đa 20 thành viên').default(15),
  divisionId: z.number().positive('Division ID không hợp lệ').optional(),
  coachId: z.number().positive('Coach ID không hợp lệ').optional(),
  assistantCoachId: z.number().positive('Assistant Coach ID không hợp lệ').optional(),
  teamColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Màu sắc không hợp lệ (hex format)').optional(),
  foundedDate: z.date().optional()
});

export const UpdateTeamSchema = CreateTeamSchema.partial();

// Team member schema
export const AddTeamMemberSchema = z.object({
  playerId: z.number().positive('Player ID không hợp lệ'),
  teamId: z.number().positive('Team ID không hợp lệ'),
  joinDate: z.date().default(() => new Date()),
  isCaptain: z.boolean().default(false),
  isViceCaptain: z.boolean().default(false),
  jerseyNumber: z.number().min(1, 'Số áo tối thiểu là 1').max(99, 'Số áo tối đa là 99').optional(),
  position: z.nativeEnum(VolleyballPosition).optional(),
  notes: z.string().max(500, 'Ghi chú quá dài').optional()
}).refine((data) => !(data.isCaptain && data.isViceCaptain), {
  message: 'Không thể vừa là đội trưởng vừa là đội phó',
  path: ['isViceCaptain']
});

export const UpdateTeamMemberSchema = z.object({
  memberId: z.number().positive('Member ID không hợp lệ'),
  isCaptain: z.boolean().optional(),
  isViceCaptain: z.boolean().optional(),
  jerseyNumber: z.number().min(1).max(99).optional(),
  position: z.nativeEnum(VolleyballPosition).optional(),
  status: z.nativeEnum(TeamMemberStatus).optional(),
  leaveDate: z.date().optional(),
  notes: z.string().max(500).optional()
});


// Team filters schema
export const TeamFiltersSchema = z.object({
  divisionId: z.number().positive().optional(),
  level: z.number().min(1).max(10).optional(),
  isActive: z.boolean().optional(),
  coachId: z.number().positive().optional(),
  minMembers: z.number().min(0).optional(),
  maxMembers: z.number().min(0).optional(),
  hasCoach: z.boolean().optional(),
  search: z.string().min(1).optional()
});

// Team statistics update schema
export const UpdateTeamStatsSchema = z.object({
  teamId: z.number().positive('Team ID không hợp lệ'),
  seasonYear: z.number().min(2020, 'Năm mùa giải không hợp lệ'),
  matchesPlayed: z.number().min(0, 'Số trận đã chơi không được âm'),
  matchesWon: z.number().min(0, 'Số trận thắng không được âm'),
  matchesLost: z.number().min(0, 'Số trận thua không được âm'),
  pointsFor: z.number().min(0, 'Điểm ghi được không được âm'),
  pointsAgainst: z.number().min(0, 'Điểm bị ghi không được âm')
}).refine((data) => data.matchesWon + data.matchesLost <= data.matchesPlayed, {
  message: 'Tổng thắng thua không thể lớn hơn tổng số trận',
  path: ['matchesPlayed']
});

// Type exports
export type CreateDivisionDto = z.infer<typeof CreateDivisionSchema>;
export type UpdateDivisionDto = z.infer<typeof UpdateDivisionSchema>;
export type CreateTeamDto = z.infer<typeof CreateTeamSchema>;
export type UpdateTeamDto = z.infer<typeof UpdateTeamSchema>;
export type AddTeamMemberDto = z.infer<typeof AddTeamMemberSchema>;
export type UpdateTeamMemberDto = z.infer<typeof UpdateTeamMemberSchema>;
export type TeamFiltersDto = z.infer<typeof TeamFiltersSchema>;
export type UpdateTeamStatsDto = z.infer<typeof UpdateTeamStatsSchema>;
