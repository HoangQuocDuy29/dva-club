import { z } from 'zod';
import { 
  ApplicationStatus, 
  VolleyballPosition, 
  SkillLevel, 
  Gender, 
  DominantHand 
} from '../enums';

// Registration application creation schema
export const CreateApplicationSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').max(100),
  gender: z.nativeEnum(Gender),
  dateOfBirth: z.date(),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  address: z.string().min(10, 'Địa chỉ quá ngắn').max(500),
  height: z.number().min(140, 'Chiều cao tối thiểu 140cm').max(220, 'Chiều cao tối đa 220cm'),
  weight: z.number().min(40, 'Cân nặng tối thiểu 40kg').max(150, 'Cân nặng tối đa 150kg'),
  dominantHand: z.nativeEnum(DominantHand),
  experienceYears: z.number().min(0, 'Số năm kinh nghiệm không được âm').max(50).default(0),
  previousTeams: z.string().max(1000).optional(),
  desiredDivision: z.string().min(1, 'Vui lòng chọn giải đấu'),
  desiredPositions: z.array(z.nativeEnum(VolleyballPosition)).min(1, 'Phải chọn ít nhất 1 vị trí'),
  preferredTeamLevel: z.number().min(1).max(10).optional(),
  specialSkills: z.string().max(1000).optional(),
  achievements: z.string().max(1000).optional(),
  availableDays: z.array(z.string()).min(1, 'Phải chọn ít nhất 1 ngày có thể tập'),
  availableTimeSlots: z.array(z.string()).min(1, 'Phải chọn ít nhất 1 khung giờ'),
  canTravel: z.boolean().default(true),
  motivation: z.string().min(20, 'Động lực tham gia quá ngắn').max(2000).optional(),
  goals: z.string().max(1000).optional(),
  medicalConditions: z.string().max(1000).optional(),
  emergencyContact: z.object({
    name: z.string().min(2, 'Tên người liên hệ phải có ít nhất 2 ký tự'),
    phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
    relationship: z.string().min(2, 'Mối quan hệ phải có ít nhất 2 ký tự')
  })
});

// Application update schema
export const UpdateApplicationSchema = CreateApplicationSchema.partial();

// Application review schema
export const ApplicationReviewSchema = z.object({
  applicationId: z.number().positive('Application ID không hợp lệ'),
  status: z.nativeEnum(ApplicationStatus),
  skillAssessment: z.object({
    servingSkill: z.number().min(1).max(10),
    attackingSkill: z.number().min(1).max(10),
    blockingSkill: z.number().min(1).max(10),
    diggingSkill: z.number().min(1).max(10),
    settingSkill: z.number().min(1).max(10),
    overallRating: z.number().min(1).max(10),
    comments: z.string().max(1000).optional()
  }).optional(),
  recommendedTeamId: z.number().positive().optional(),
  notes: z.string().max(1000).optional()
});

// Application filters schema
export const ApplicationFiltersSchema = z.object({
  status: z.nativeEnum(ApplicationStatus).optional(),
  gender: z.nativeEnum(Gender).optional(),
  desiredDivision: z.string().optional(),
  minExperienceYears: z.number().min(0).optional(),
  maxExperienceYears: z.number().min(0).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  hasExperience: z.boolean().optional(),
  canTravel: z.boolean().optional(),
  search: z.string().min(1).optional()
});

// Interview scheduling schema
export const ScheduleInterviewSchema = z.object({
  applicationId: z.number().positive('Application ID không hợp lệ'),
  scheduledDate: z.date().describe('Ngày phỏng vấn'),
  location: z.string().min(5, 'Địa điểm phỏng vấn quá ngắn').max(200).optional(),
  notes: z.string().max(500).optional()
});

// Interview result schema
export const InterviewResultSchema = z.object({
  interviewId: z.number().positive('Interview ID không hợp lệ'),
  actualDate: z.date().optional(),
  result: z.enum(['passed', 'failed', 'pending']),
  notes: z.string().max(1000).optional()
});

// Type exports
export type CreateApplicationDto = z.infer<typeof CreateApplicationSchema>;
export type UpdateApplicationDto = z.infer<typeof UpdateApplicationSchema>;
export type ApplicationReviewDto = z.infer<typeof ApplicationReviewSchema>;
export type ApplicationFiltersDto = z.infer<typeof ApplicationFiltersSchema>;
export type ScheduleInterviewDto = z.infer<typeof ScheduleInterviewSchema>;
export type InterviewResultDto = z.infer<typeof InterviewResultSchema>;
