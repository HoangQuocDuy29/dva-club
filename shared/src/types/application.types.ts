import { 
  ApplicationStatus, 
  VolleyballPosition, 
  SkillLevel, 
  Gender, 
  DominantHand 
} from '../enums';
import { EmergencyContact } from './user.types'; // ← Import từ user.types để tránh duplicate

export interface RegistrationApplication {
  id: number;
  fullName: string;
  gender: Gender;
  dateOfBirth: Date;
  phone: string;
  email: string;
  address: string;
  height: number;
  weight: number;
  dominantHand: DominantHand;
  experienceYears: number;
  previousTeams?: string;
  highestLevelPlayed?: string;
  desiredDivision: string;
  desiredPositions: VolleyballPosition[];
  preferredTeamLevel?: number;
  specialSkills?: string;
  achievements?: string;
  availableDays: string[];
  availableTimeSlots: string[];
  canTravel: boolean;
  motivation?: string;
  goals?: string;
  medicalConditions?: string;
  emergencyContact: EmergencyContact;
  status: ApplicationStatus;
  reviewedBy?: number;
  reviewedAt?: Date;
  reviewNotes?: string;
  approvedTeamId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationReview {
  id: number;
  applicationId: number;
  reviewerId: number;
  status: ApplicationStatus;
  skillAssessment?: SkillAssessment;
  recommendedTeamId?: number;
  notes?: string;
  reviewDate: Date;
}

export interface SkillAssessment {
  servingSkill: number;
  attackingSkill: number;
  blockingSkill: number;
  diggingSkill: number;
  settingSkill: number;
  overallRating: number;
  comments?: string;
}

export interface ApplicationInterview {
  id: number;
  applicationId: number;
  interviewerId: number;
  scheduledDate: Date;
  actualDate?: Date;
  location?: string;
  notes?: string;
  result?: 'passed' | 'failed' | 'pending';
  createdAt: Date;
}

// ← XÓA: export interface CreateApplicationDto (sử dụng từ schemas)

export interface ApplicationFilters {
  status?: ApplicationStatus;
  gender?: Gender;
  desiredDivision?: string;
  experienceYears?: number;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface ApplicationWithReview extends RegistrationApplication {
  review?: ApplicationReview;
  interview?: ApplicationInterview;
  skillLevel?: SkillLevel;
}

export interface ApplicationStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  approvalRate: number;
}
