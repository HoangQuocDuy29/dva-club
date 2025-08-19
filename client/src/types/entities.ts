// Base entity interface
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// ✅ EXPORT User interface - Match với backend User entity
export interface User extends BaseEntity {
  username: string;
  email: string;
  passwordHash?: string; // Không expose trong frontend responses
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  deletedAt?: string;
}

// ✅ EXPORT UserRole type
export type UserRole = "super_admin" | "admin" | "coach" | "player";

// ✅ EXPORT Division interface
export interface Division extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  level: "amateur" | "semi_professional" | "professional";
  ageGroup?: "youth" | "junior" | "senior" | "veteran";
  genderCategory?: "male" | "female" | "mixed";
  maxTeams?: number;
  seasonStart?: string;
  seasonEnd?: string;
  registrationFee?: number;
  isActive: boolean;
  displayOrder: number;
}

// ✅ EXPORT Team interface - Match với backend Team entity
export interface Team extends BaseEntity {
  divisionId: number;
  name: string;
  shortName?: string;
  code: string;
  level: number;
  description?: string;
  maxMembers: number;
  coachId?: number;
  assistantCoachId?: number;
  teamLogoUrl?: string;
  teamColor?: string;
  secondaryColor?: string;
  foundedDate?: string;
  homeVenue?: string;
  isActive: boolean;

  // Relations (optional for frontend)
  division?: Division;
  coach?: User;
  assistantCoach?: User;
}

// ✅ EXPORT Player interface - Match với backend Player entity
export interface Player extends BaseEntity {
  userId?: number;
  playerCode?: string;
  fullName: string;
  gender: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  dominantHand?: string;
  jerseyNumber?: number;
  primaryPosition?: PlayerPosition;
  secondaryPositions?: PlayerPosition[];
  skillLevel: SkillLevel;
  contactInfo?: Record<string, any>;
  avatarUrl?: string;
  actionPhotos?: string[];
  status: PlayerStatus;
  injuryDetails?: string;
  medicalNotes?: string;
  joinDate: string;
  notes?: string;

  // Relations
  user?: User;
}

// ✅ EXPORT Player related types
export type PlayerPosition =
  | "setter"
  | "outside_hitter"
  | "middle_blocker"
  | "opposite"
  | "libero";
export type SkillLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "professional";
export type PlayerStatus = "active" | "injured" | "suspended" | "inactive";

// ✅ EXPORT Tournament interface
export interface Tournament extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  type: TournamentType;
  level: TournamentLevel;
  status: TournamentStatus;
  maxTeams: number;
  registrationFee?: number;
  prizeMoney?: number;
  venue?: string;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  contactEmail?: string;
  contactPhone?: string;
  rules?: string;
  requirements?: string;
  bannerImageUrl?: string;
  isActive: boolean;
}

// ✅ EXPORT Tournament related types
export type TournamentType = "league" | "knockout" | "round_robin";
export type TournamentLevel =
  | "local"
  | "regional"
  | "national"
  | "international";
export type TournamentStatus =
  | "draft"
  | "registration_open"
  | "ongoing"
  | "completed"
  | "cancelled";

// ✅ EXPORT Match interface
export interface Match extends BaseEntity {
  tournamentId: number;
  homeTeamId: number;
  awayTeamId: number;
  matchCode: string;
  matchDate: string;
  venue?: string;
  status: MatchStatus;
  homeTeamScore: number;
  awayTeamScore: number;
  totalSets: number;
  winnerTeamId?: number;
  matchDuration?: number;
  refereeId?: number;
  assistantRefereeId?: number;
  matchNotes?: string;
  weatherCondition?: string;
  attendance?: number;
  isActive: boolean;

  // Relations
  tournament?: Tournament;
  homeTeam?: Team;
  awayTeam?: Team;
  winnerTeam?: Team;
  referee?: User;
  assistantReferee?: User;
}

// ✅ EXPORT Match related types
export type MatchStatus =
  | "scheduled"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "postponed";

// ✅ EXPORT MediaFile interface
export interface MediaFile extends BaseEntity {
  filename: string;
  originalName: string;
  filePath: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  entityType: MediaEntityType;
  entityId: number;
  mediaType: MediaType;
  mediaCategory?: MediaCategory;
  isPrimary: boolean;
  isPublic: boolean;
  uploadedBy: number;
  description?: string;
  metadata?: Record<string, any>;
  altText?: string;
  displayOrder: number;
  isActive: boolean;

  // Relations
  uploader?: User;
}

// ✅ EXPORT Media related types
export type MediaEntityType =
  | "player"
  | "team"
  | "tournament"
  | "match"
  | "user"
  | "news";
export type MediaType = "image" | "video" | "document";
export type MediaCategory =
  | "profile"
  | "action"
  | "team_photo"
  | "logo"
  | "banner"
  | "document";
