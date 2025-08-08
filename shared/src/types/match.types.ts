import { 
  MatchStatus, 
  MatchRound, 
  VolleyballPosition 
} from '../enums';

export interface Match {
  id: number;
  tournamentId?: number;
  homeTeamId: number;
  awayTeamId: number;
  scheduledDate: Date;
  venue?: string;
  round?: MatchRound;
  matchNumber?: number;
  homeScore?: number;
  awayScore?: number;
  winnerTeamId?: number;
  status: MatchStatus;
  refereeId?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchResult {
  id: number;
  matchId: number;
  set1Home: number;
  set1Away: number;
  set2Home: number;
  set2Away: number;
  set3Home: number;
  set3Away: number;
  set4Home?: number;
  set4Away?: number;
  set5Home?: number;
  set5Away?: number;
  totalSetsHome: number;
  totalSetsAway: number;
  duration?: number;
  recordedBy: number;
  recordedAt: Date;
}

export interface PlayerMatchStats {
  id: number;
  matchId: number;
  playerId: number;
  teamId: number;
  position?: VolleyballPosition;
  minutesPlayed?: number;
  serves: number;
  aces: number;
  serveErrors: number;
  attacks: number;
  attackHits: number;
  attackErrors: number;
  blocks: number;
  digs: number;
  assists: number;
  points: number;
  isStarter: boolean;
  createdAt: Date;
}

export interface MatchLineup {
  id: number;
  matchId: number;
  teamId: number;
  playerId: number;
  position: VolleyballPosition;
  jerseyNumber: number;
  isStarter: boolean;
  isSubstitute: boolean;
  createdAt: Date;
}

// DTOs and filters
export interface CreateMatchDto {
  homeTeamId: number;
  awayTeamId: number;
  scheduledDate: Date;
  venue?: string;
  tournamentId?: number;
  refereeId?: number;
}

export interface MatchFilters {
  status?: MatchStatus;
  teamId?: number;
  tournamentId?: number;
  dateFrom?: Date;
  dateTo?: Date;
  venue?: string;
  search?: string;
}

export interface MatchWithDetails extends Match {
  homeTeamName: string;
  awayTeamName: string;
  result?: MatchResult;
  playerStats?: PlayerMatchStats[];
  lineup?: MatchLineup[];
}

export interface MatchSummary {
  totalMatches: number;
  completedMatches: number;
  scheduledMatches: number;
  upcomingMatches: number;
  averageDuration?: number;
}
