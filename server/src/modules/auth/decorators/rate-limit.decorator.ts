import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'rateLimit';

/**
 * Rate limiting configuration interface
 */
interface RateLimitConfig {
  points: number;    // Number of requests
  duration: number;  // Time window in seconds
  blockDuration?: number; // Block duration in seconds (default: same as duration)
}

/**
 * Rate limit decorator
 * @param config Rate limiting configuration
 */
export const RateLimit = (config: RateLimitConfig) => 
  SetMetadata(RATE_LIMIT_KEY, config);

/**
 * Predefined rate limits for auth endpoints
 */

// Login rate limit: 5 attempts per 15 minutes
export const LoginRateLimit = () => 
  RateLimit({ points: 5, duration: 900, blockDuration: 900 });

// Registration rate limit: 3 attempts per hour
export const RegisterRateLimit = () => 
  RateLimit({ points: 3, duration: 3600, blockDuration: 3600 });

// Refresh token rate limit: 10 attempts per minute
export const RefreshRateLimit = () => 
  RateLimit({ points: 10, duration: 60 });

// Password reset rate limit: 3 attempts per hour
export const PasswordResetRateLimit = () => 
  RateLimit({ points: 3, duration: 3600, blockDuration: 3600 });

// General API rate limit: 100 requests per minute
export const ApiRateLimit = () => 
  RateLimit({ points: 100, duration: 60 });
