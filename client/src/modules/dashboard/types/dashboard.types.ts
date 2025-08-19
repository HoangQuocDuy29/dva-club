// Dashboard module types
export type DashboardModule =
  | "users"
  | "stats"
  | "teams"
  | "matches"
  | "settings";

// Menu item configuration interface
export interface MenuItemConfig {
  id: DashboardModule;
  label: string;
  icon: React.ReactNode;
  path?: string;
}

// Notification interface
export interface Notification {
  id: number;
  message: string;
  time: string;
  type?: "info" | "warning" | "error" | "success";
  read?: boolean;
}

// Theme interface
export interface ThemeMode {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Search result interface (for future use)
export interface SearchResult {
  id: string;
  title: string;
  type: "user" | "team" | "match" | "setting";
  description?: string;
  url?: string;
}

// Dashboard statistics interface
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTeams: number;
  activeMatches: number;
  newUsersThisMonth: number;
}

// User role distribution interface
export interface RoleDistribution {
  role: string;
  count: number;
  percentage: number;
}
