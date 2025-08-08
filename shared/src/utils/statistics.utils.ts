import { MATCH_CONFIG } from '../constants';

// Player Statistics Calculations
export const calculatePlayerStats = (stats: {
  servesAttempted: number;
  servesSuccessful: number;
  aces: number;
  attacksAttempted: number;
  attacksSuccessful: number;
  blocksSuccessful: number;
  digs: number;
  matchesPlayed: number;
}) => {
  const servePercentage = calculatePercentage(stats.servesSuccessful, stats.servesAttempted);
  const attackPercentage = calculatePercentage(stats.attacksSuccessful, stats.attacksAttempted);
  const acesPerMatch = calculateAverage(stats.aces, stats.matchesPlayed);
  const digsPerMatch = calculateAverage(stats.digs, stats.matchesPlayed);

  return {
    servePercentage,
    attackPercentage,
    acesPerMatch,
    digsPerMatch,
    totalPoints: stats.attacksSuccessful + stats.aces + stats.blocksSuccessful
  };
};

// Team Statistics Calculations
export const calculateTeamStats = (stats: {
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  pointsFor: number;
  pointsAgainst: number;
}) => {
  const winRate = calculatePercentage(stats.matchesWon, stats.matchesPlayed);
  const pointsDifference = stats.pointsFor - stats.pointsAgainst;
  const avgPointsFor = calculateAverage(stats.pointsFor, stats.matchesPlayed);
  const avgPointsAgainst = calculateAverage(stats.pointsAgainst, stats.matchesPlayed);

  return {
    winRate,
    lossRate: 100 - winRate,
    pointsDifference,
    avgPointsFor,
    avgPointsAgainst,
    efficiency: calculatePercentage(stats.pointsFor, stats.pointsFor + stats.pointsAgainst)
  };
};

// Match Statistics
export const calculateMatchStats = (sets: Array<{
  homeScore: number;
  awayScore: number;
}>) => {
  const homeSetsWon = sets.filter(set => set.homeScore > set.awayScore).length;
  const awaySetsWon = sets.filter(set => set.awayScore > set.homeScore).length;
  const totalPoints = sets.reduce((sum, set) => sum + set.homeScore + set.awayScore, 0);

  return {
    homeSetsWon,
    awaySetsWon,
    totalSets: sets.length,
    totalPoints,
    averagePointsPerSet: calculateAverage(totalPoints, sets.length),
    isCompleted: homeSetsWon >= 3 || awaySetsWon >= 3
  };
};

// Tournament Statistics
export const calculateTournamentStats = (teams: Array<{
  matchesPlayed: number;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
}>) => {
  const totalMatches = teams.reduce((sum, team) => sum + team.matchesPlayed, 0) / 2; // Divide by 2 to avoid double counting
  const totalPoints = teams.reduce((sum, team) => sum + team.pointsFor, 0);
  const averageMatchLength = calculateAverage(totalPoints, totalMatches);

  return {
    totalTeams: teams.length,
    totalMatches,
    totalPoints,
    averageMatchLength,
    topTeam: teams.sort((a, b) => b.wins - a.wins)[0],
    mostProductive: teams.sort((a, b) => b.pointsFor - a.pointsFor)[0]
  };
};

// Ranking and Comparison
export const calculateTeamRanking = (teams: Array<{
  id: number;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  matchesPlayed: number;
}>) => {
  return teams
    .map(team => ({
      ...team,
      winRate: calculatePercentage(team.wins, team.matchesPlayed),
      pointsDifference: team.pointsFor - team.pointsAgainst,
      points: team.wins * 3 + team.losses * 1 // Win = 3 points, Loss = 1 point
    }))
    .sort((a, b) => {
      // Sort by points first, then by point difference
      if (b.points !== a.points) return b.points - a.points;
      return b.pointsDifference - a.pointsDifference;
    })
    .map((team, index) => ({
      ...team,
      rank: index + 1
    }));
};

// Performance Trends
export const calculatePerformanceTrend = (
  recentStats: number[],
  previousStats: number[]
): {
  trend: 'improving' | 'declining' | 'stable';
  change: number;
  changePercentage: number;
} => {
  const recentAvg = calculateAverage(recentStats.reduce((a, b) => a + b, 0), recentStats.length);
  const previousAvg = calculateAverage(previousStats.reduce((a, b) => a + b, 0), previousStats.length);
  
  const change = recentAvg - previousAvg;
  const changePercentage = calculatePercentage(Math.abs(change), previousAvg || 1);

  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (change > 0.05) trend = 'improving';
  else if (change < -0.05) trend = 'declining';

  return {
    trend,
    change,
    changePercentage
  };
};

// Helper Functions
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100; // Round to 2 decimal places
};

export const calculateAverage = (total: number, count: number): number => {
  if (count === 0) return 0;
  return Math.round((total / count) * 100) / 100; // Round to 2 decimal places
};

export const calculateStandardDeviation = (values: number[]): number => {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  
  return Math.sqrt(avgSquaredDiff);
};

// Season Statistics
export const calculateSeasonSummary = (
  playerStats: Array<{
    playerId: number;
    matchesPlayed: number;
    points: number;
    serves: number;
    attacks: number;
  }>
) => {
  const totalMatches = Math.max(...playerStats.map(p => p.matchesPlayed));
  const totalPlayers = playerStats.length;
  const avgPointsPerPlayer = calculateAverage(
    playerStats.reduce((sum, p) => sum + p.points, 0),
    totalPlayers
  );

  const mvpCandidate = playerStats.reduce((prev, current) => 
    current.points > prev.points ? current : prev
  );

  return {
    totalMatches,
    totalPlayers,
    avgPointsPerPlayer,
    mvpPlayerId: mvpCandidate.playerId,
    mvpPoints: mvpCandidate.points,
    totalPointsScored: playerStats.reduce((sum, p) => sum + p.points, 0)
  };
};

// Data Aggregation Helpers
export const groupStatsByPeriod = <T extends { createdAt: Date }>(
  data: T[],
  period: 'day' | 'week' | 'month' | 'year'
): Record<string, T[]> => {
  return data.reduce((groups, item) => {
    const date = new Date(item.createdAt);
    let key: string;

    switch (period) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'year':
        key = String(date.getFullYear());
        break;
      default:
        key = date.toISOString().split('T')[0];
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};
