import { 
  TournamentType, 
  TournamentStatus, 
  TournamentLevel, 
  RegistrationStatus, 
  PaymentStatus, 
  MatchRound 
} from '../enums';

export interface Tournament {
  id: number;
  name: string;
  description?: string;
  type: TournamentType;
  level: TournamentLevel;
  status: TournamentStatus;
  maxTeams: number;
  registrationFee?: number;
  prizeMoney?: number;
  logoUrl?: string;
  bannerUrl?: string;
  venue?: string;
  startDate: Date;
  endDate: Date;
  registrationStartDate: Date;
  registrationEndDate: Date;
  organizedBy?: string;
  contactEmail?: string;
  contactPhone?: string;
  rules?: string;
  requirements?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TournamentRegistration {
  id: number;
  tournamentId: number;
  teamId: number;
  registrationDate: Date;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  amountPaid?: number;
  notes?: string;
  confirmedBy?: number;
  confirmedAt?: Date;
  createdAt: Date;
}

export interface TournamentMatch {
  id: number;
  tournamentId: number;
  homeTeamId: number;
  awayTeamId: number;
  round: MatchRound;
  matchNumber?: number;
  scheduledDate: Date;
  venue?: string;
  homeScore?: number;
  awayScore?: number;
  winnerTeamId?: number;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TournamentStanding {
  id: number;
  tournamentId: number;
  teamId: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  pointsDifference: number;
  position: number;
  lastUpdated: Date;
}

export interface TournamentPrize {
  id: number;
  tournamentId: number;
  position: number;
  prizeType: string;
  prizeValue?: number;
  description?: string;
  createdAt: Date;
}


export interface TournamentFilters {
  type?: TournamentType;
  level?: TournamentLevel;
  status?: TournamentStatus;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface TournamentStats {
  totalTournaments: number;
  activeTournaments: number;
  completedTournaments: number;
  totalTeamsRegistered: number;
  totalPrizeMoney: number;
}
