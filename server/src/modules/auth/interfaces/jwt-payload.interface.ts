export interface JwtPayload {
  sub: number;      // User ID (subject)
  email: string;    // User email
  username: string; // Username
  role: string;     // User role (player, coach, manager, viewer, admin)
  iat?: number;     // Issued at timestamp
  exp?: number;     // Expires at timestamp
}
