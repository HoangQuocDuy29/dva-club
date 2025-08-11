import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const authorization = req.headers.authorization;
    
    // Extract user info from JWT token if present
    let userInfo = 'Anonymous';
    let tokenStatus = 'No token';
    
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.substring(7);
      tokenStatus = 'Bearer ***';
      
      try {
        const decoded = this.jwtService.decode(token) as any;
        if (decoded && decoded.username) {
          userInfo = `${decoded.username} (${decoded.role || 'unknown'})`;
        }
      } catch (error) {
        tokenStatus = 'Invalid token';
      }
    }

    // Log the auth request
    this.logger.log(
      `Auth Request: ${method} ${originalUrl} - IP: ${ip} - User: ${userInfo} - Token: ${tokenStatus} - UserAgent: ${userAgent}`
    );

    // Add custom headers for debugging
    res.setHeader('X-Auth-Middleware', 'processed');
    res.setHeader('X-Request-ID', this.generateRequestId());
    
    // Continue to next middleware/handler
    next();
  }

  private generateRequestId(): string {
    return `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
