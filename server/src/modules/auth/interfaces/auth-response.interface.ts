export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
  };
  tokenType: string;
  expiresIn: number; // Seconds until access token expires
  expiresAt: Date;   // Exact expiration datetime
}

export interface RefreshTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: Date;
}

export interface LoginResponse extends AuthResponse {
  message: string;
  isFirstLogin: boolean;
}
