import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Import entities
import { User } from '../../entities/user.entity';
import { UserProfile } from '../../entities/user-profile.entity';

// Import core auth files
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// Import strategies
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';

// Import guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { AuthGuard } from './guards/auth.guard';

// Import middleware
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    // TypeORM entities registration
    TypeOrmModule.forFeature([User, UserProfile]),
    
    // Passport configuration
    PassportModule.register({ 
      defaultStrategy: 'jwt',
      session: false 
    }),
    
    // JWT Module configuration with async factory
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>(
          'JWT_SECRET', 
          'volleyball-club-super-secret-key-2025-very-long-and-secure'
        );
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN', '1h');
        const refreshExpiresIn = configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
        
        return {
          secret,
          signOptions: {
            expiresIn,
            issuer: 'volleyball-club-management',
            audience: 'volleyball-club-users',
            algorithm: 'HS256',
          },
          verifyOptions: {
            issuer: 'volleyball-club-management',
            audience: 'volleyball-club-users',
            algorithms: ['HS256'],
            clockTolerance: 30, // 30 seconds clock tolerance
          },
          // Additional options for refresh tokens
          refreshOptions: {
            expiresIn: refreshExpiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Core authentication service
    AuthService,
    
    // Passport strategies
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    
    // Authentication guards
    JwtAuthGuard,
    LocalAuthGuard,
    RefreshJwtGuard,
    RolesGuard,
    PermissionsGuard,
    AuthGuard,

    // Middleware
    AuthMiddleware,
  ],
  exports: [
    // Export service for use in other modules
    AuthService,
    
    // Export guards for global use
    JwtAuthGuard,
    LocalAuthGuard,
    RefreshJwtGuard,
    RolesGuard,
    PermissionsGuard,
    AuthGuard,
    
    // Export strategies for testing or advanced usage
    JwtStrategy,
    LocalStrategy,
    RefreshJwtStrategy,
    
    // Export JWT module for other modules that need JWT functionality
    JwtModule,

    // Export middleware
    AuthMiddleware,
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        // Apply middleware to all auth routes
        { path: 'auth/*', method: RequestMethod.ALL },
        
        // Apply to specific auth endpoints for detailed logging
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/refresh', method: RequestMethod.POST },
        { path: 'auth/profile', method: RequestMethod.GET },
        { path: 'auth/logout', method: RequestMethod.POST },
      );
  }
}
