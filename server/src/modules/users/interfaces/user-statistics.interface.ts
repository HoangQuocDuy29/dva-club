export interface UserStatistics {
  overview: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    newThisWeek: number;
    newToday: number;
  };
  
  byRole: {
    admin: number;
    manager: number;
    coach: number;
    player: number;
    viewer: number;
  };
  
  activity: {
    recentLogins: {
      today: number;
      thisWeek: number;
      thisMonth: number;
    };
    
    registrationTrend: {
      date: string;
      count: number;
    }[];
    
    mostActiveUsers: {
      id: number;
      username: string;
      fullName: string;
      lastLogin: Date;
      loginCount: number;
    }[];
  };
  
  demographics: {
    ageGroups?: {
      under18: number;
      age18to25: number;
      age26to35: number;
      over35: number;
    };
    
    genderDistribution?: {
      male: number;
      female: number;
      other: number;
      notSpecified: number;
    };
  };
  
  engagement: {
    averageSessionDuration: number; // in minutes
    activeSessionsCount: number;
    topFeatures: {
      feature: string;
      usageCount: number;
    }[];
  };
}

export interface UserActivityLog {
  id: number;
  userId: number;
  action: string;
  resource: string;
  details?: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface UserPerformanceMetrics {
  userId: number;
  period: 'daily' | 'weekly' | 'monthly';
  metrics: {
    loginCount: number;
    actionsPerformed: number;
    averageSessionDuration: number;
    featuresUsed: string[];
    lastActiveDate: Date;
  };
}
