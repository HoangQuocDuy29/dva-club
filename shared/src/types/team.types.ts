import { 
  VolleyballPosition, 
  TeamMemberStatus, 
  SkillLevel 
} from '../enums';

export interface Division {
  id: number;
  name: string;
  code: string;
  description?: string;
  maxTeams: number;
  logoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: number;
  divisionId?: number;
  name: string;
  shortName?: string;
  level: number;
  description?: string;
  maxMembers: number;
  coachId?: number;
  assistantCoachId?: number;
  teamLogoUrl?: string;
  teamColor?: string;
  foundedDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: number;
  playerId: number;
  teamId: number;
  joinDate: Date;
  leaveDate?: Date;
  isCaptain: boolean;
  isViceCaptain: boolean;
  jerseyNumber?: number;
  position?: VolleyballPosition;
  status: TeamMemberStatus;
  notes?: string;
  createdAt: Date;
}

export interface TeamStats {
  id: number;
  teamId: number;
  seasonYear: number;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  pointsFor: number;
  pointsAgainst: number;
  winRate?: number;
  lastUpdated: Date;
}


export interface TeamFilters {
  divisionId?: number;
  level?: number;
  isActive?: boolean;
  coachId?: number;
  search?: string;
}

export interface TeamWithMembers extends Team {
  members: TeamMember[];
  memberCount: number;
  captain?: TeamMember;
  viceCaptain?: TeamMember;
}
