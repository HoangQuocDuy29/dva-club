import { 
  VolleyballPosition, 
  SkillLevel, 
  PlayerStatus, 
  Gender, 
  DominantHand 
} from '../enums';

export interface Player {
  id: number;
  userId?: number;
  playerCode?: string;
  fullName: string;
  gender: Gender;
  dateOfBirth?: Date;
  height?: number;
  weight?: number;
  dominantHand?: DominantHand;
  jerseyNumber?: number;
  primaryPosition?: VolleyballPosition;
  secondaryPositions?: VolleyballPosition[];
  skillLevel: SkillLevel;
  contactInfo?: ContactInfo;
  avatarUrl?: string;
  actionPhotos?: string[];
  status: PlayerStatus;
  injuryDetails?: string;
  medicalNotes?: string;
  joinDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerStatistics {
  id: number;
  playerId: number;
  seasonYear: number;
  teamId?: number;
  matchesPlayed: number;
  matchesStarted: number;
  servesAttempted: number;
  servesSuccessful: number;
  aces: number;
  serveErrors: number;
  attacksAttempted: number;
  attacksSuccessful: number;
  attackErrors: number;
  blocksSuccessful: number;
  digs: number;
  receptions: number;
  sets: number;
  servePercentage?: number;
  attackPercentage?: number;
  lastUpdated: Date;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
}

export interface PlayerPerformance {
  playerId: number;
  seasonYear: number;
  rating: number;
  rank: number;
  improvement: number;
  strengths: string[];
  weaknesses: string[];
  coachNotes?: string;
  lastEvaluated: Date;
}


export interface PlayerFilters {
  gender?: Gender;
  skillLevel?: SkillLevel;
  position?: VolleyballPosition;
  status?: PlayerStatus;
  teamId?: number;
  minHeight?: number;
  maxHeight?: number;
  search?: string;
}

export interface PlayerWithStats extends Player {
  currentStats?: PlayerStatistics;
  performance?: PlayerPerformance;
  teamName?: string;
}
