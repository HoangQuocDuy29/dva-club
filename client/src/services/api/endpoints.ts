export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    LOGIN_EMAIL: "/auth/login-email", // If supporting both username and email login
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    REFRESH: "/auth/refresh",
    VERIFY_EMAIL: "/auth/verify-email",
  },

  // Divisions endpoints
  DIVISIONS: {
    LIST: "/divisions",
    CREATE: "/divisions",
    GET: (id: number) => `/divisions/${id}`,
    UPDATE: (id: number) => `/divisions/${id}`,
    DELETE: (id: number) => `/divisions/${id}`,
  },

  // Teams endpoints
  TEAMS: {
    LIST: "/teams",
    CREATE: "/teams",
    GET: (id: number) => `/teams/${id}`,
    UPDATE: (id: number) => `/teams/${id}`,
    DELETE: (id: number) => `/teams/${id}`,
    BY_DIVISION: (divisionId: number) => `/divisions/${divisionId}/teams`,
  },

  // Players endpoints
  PLAYERS: {
    LIST: "/players",
    CREATE: "/players",
    GET: (id: number) => `/players/${id}`,
    UPDATE: (id: number) => `/players/${id}`,
    DELETE: (id: number) => `/players/${id}`,
    BY_TEAM: (teamId: number) => `/teams/${teamId}/players`,
  },

  // Tournaments endpoints
  TOURNAMENTS: {
    LIST: "/tournaments",
    CREATE: "/tournaments",
    GET: (id: number) => `/tournaments/${id}`,
    UPDATE: (id: number) => `/tournaments/${id}`,
    DELETE: (id: number) => `/tournaments/${id}`,
    MATCHES: (id: number) => `/tournaments/${id}/matches`,
  },

  // Matches endpoints
  MATCHES: {
    LIST: "/matches",
    CREATE: "/matches",
    GET: (id: number) => `/matches/${id}`,
    UPDATE: (id: number) => `/matches/${id}`,
    DELETE: (id: number) => `/matches/${id}`,
  },

  // Media endpoints
  MEDIA: {
    UPLOAD: "/media/upload",
    LIST: "/media",
    GET: (id: number) => `/media/${id}`,
    DELETE: (id: number) => `/media/${id}`,
    BY_ENTITY: (entityType: string, entityId: number) =>
      `/media/${entityType}/${entityId}`,
  },
};
