import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiBody 
} from '@nestjs/swagger';
import { AuthService } from './auth.service';

// Import DTOs
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

// Import Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';

// Import All Decorators
import { Public } from './decorators/public.decorator';
import { CurrentUser, CurrentUserId } from './decorators/current-user.decorator';
import { 
  Roles,
  AdminOnly,
  CoachOnly,
  ManagerOnly,
  PlayerOnly,
  AdminOrManager,
  StaffOnly 
} from './decorators/roles.decorator';
import {
  Permissions,
  CanReadUsers,
  CanManageUsers
} from './decorators/permissions.decorator';
import { 
  ApiPublicRoute, 
  ApiProtectedRoute,
  ApiLoginResponse,
  ApiRegisterResponse 
} from './decorators/api-response.decorator';
import { 
  LoginRateLimit, 
  RegisterRateLimit, 
  RefreshRateLimit,
  ApiRateLimit 
} from './decorators/rate-limit.decorator';

// Import Interfaces
import { UserContext } from './interfaces/user-context.interface';
import { 
  LoginResponse, 
  RefreshTokenResponse 
} from './interfaces/auth-response.interface';

// Import Enums
import { UserRole } from './enums/auth-status.enum';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Health check endpoint
   */
  @Public()
  @Get('health')
  @ApiPublicRoute('Check authentication service health')
  getHealth(): { 
    status: string; 
    timestamp: string; 
    service: string;
    version: string;
  } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Volleyball Club Auth Service',
      version: '1.0.0',
    };
  }

  /**
   * User registration endpoint
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @RegisterRateLimit()
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiRegisterResponse()
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 409, description: 'Email or username already exists' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto): Promise<LoginResponse> {
    return this.authService.register(registerDto);
  }

  /**
   * User login endpoint
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LoginRateLimit()
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiLoginResponse()
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  /**
   * Refresh access token endpoint
   */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @RefreshRateLimit()
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Token refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        tokenType: { type: 'string', example: 'Bearer' },
        expiresIn: { type: 'number', example: 3600 },
        expiresAt: { type: 'string', format: 'date-time' },
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponse> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  /**
   * Get current user profile (Full details)
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiProtectedRoute('Get authenticated user full profile')
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        username: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        phone: { type: 'string' },
        avatarUrl: { type: 'string' },
        role: { type: 'string' },
        status: { type: 'string' },
        isActive: { type: 'boolean' },
        lastLogin: { type: 'string', format: 'date-time' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      }
    }
  })
  async getProfile(@CurrentUser() user: UserContext): Promise<UserContext> {
    return this.authService.getProfile(user.id);
  }

  /**
   * Get current user basic info
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiRateLimit()
  @ApiProtectedRoute('Get current user basic information')
  @ApiResponse({
    status: 200,
    description: 'Current user basic information',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        username: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        role: { type: 'string' },
        fullName: { type: 'string' },
        initials: { type: 'string' },
        isStaff: { type: 'boolean' },
      }
    }
  })
  getCurrentUser(@CurrentUser() user: UserContext): {
    id: number;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    role: string;
    fullName: string;
    initials: string;
    isStaff: boolean;
  } {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username;
    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || user.username[0].toUpperCase();
    const staffRoles = [UserRole.ADMIN, UserRole.COACH, UserRole.MANAGER];
    
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      fullName,
      initials,
      isStaff: staffRoles.includes(user.role as UserRole),
    };
  }

  /**
   * Get current user ID only
   */
  @UseGuards(JwtAuthGuard)
  @Get('user-id')
  @ApiBearerAuth()
  @ApiProtectedRoute('Get current user ID')
  getCurrentUserId(@CurrentUserId() userId: number): { userId: number } {
    return { userId };
  }

  /**
   * Logout endpoint
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiProtectedRoute('Logout current user')
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
        user: { type: 'string' },
        sessionDuration: { type: 'string' },
      }
    }
  })
  async logout(@CurrentUser() user: UserContext): Promise<{
    message: string;
    timestamp: string;
    user: string;
    sessionDuration: string;
  }> {
    // Calculate session duration
    const loginTime = user.lastLogin ? new Date(user.lastLogin).getTime() : Date.now();
    const currentTime = Date.now();
    const sessionDuration = Math.floor((currentTime - loginTime) / 1000); // seconds
    const durationFormatted = `${Math.floor(sessionDuration / 3600)}h ${Math.floor((sessionDuration % 3600) / 60)}m ${sessionDuration % 60}s`;

    // In production, you would:
    // 1. Blacklist the current JWT token
    // 2. Remove refresh token from database
    // 3. Log the logout activity
    
    return {
      message: 'Logout successful',
      timestamp: new Date().toISOString(),
      user: user.username,
      sessionDuration: durationFormatted,
    };
  }

  /**
   * Verify token endpoint
   */
  @UseGuards(JwtAuthGuard)
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiProtectedRoute('Verify JWT token validity')
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: true },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            role: { type: 'string' },
          }
        },
        expiresIn: { type: 'string' },
        tokenInfo: {
          type: 'object',
          properties: {
            issuedAt: { type: 'string', format: 'date-time' },
            expiresAt: { type: 'string', format: 'date-time' },
          }
        }
      }
    }
  })
  verifyToken(@CurrentUser() user: UserContext, @Request() req: any): {
    valid: boolean;
    user: {
      id: number;
      username: string;
      role: string;
    };
    expiresIn: string;
    tokenInfo: {
      issuedAt: string;
      expiresAt: string;
    };
  } {
    // Extract token expiration from JWT payload
    const tokenExp = req.user?.exp;
    const tokenIat = req.user?.iat;
    const currentTime = Math.floor(Date.now() / 1000);
    const expiresIn = tokenExp ? `${tokenExp - currentTime} seconds` : 'Unknown';

    return {
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      expiresIn,
      tokenInfo: {
        issuedAt: tokenIat ? new Date(tokenIat * 1000).toISOString() : 'Unknown',
        expiresAt: tokenExp ? new Date(tokenExp * 1000).toISOString() : 'Unknown',
      }
    };
  }

  /**
   * Admin-only endpoint example
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AdminOnly()
  @Get('admin/status')
  @ApiBearerAuth()
  @ApiProtectedRoute('Get admin dashboard status')
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  getAdminStatus(@CurrentUser() user: UserContext): {
    message: string;
    adminUser: string;
    systemStatus: string;
    timestamp: string;
  } {
    return {
      message: 'Admin access granted',
      adminUser: user.username,
      systemStatus: 'All systems operational',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Staff-only endpoint (Admin, Manager, Coach)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @StaffOnly()
  @Get('staff/dashboard')
  @ApiBearerAuth()
  @ApiProtectedRoute('Get staff dashboard')
  @ApiResponse({ status: 403, description: 'Forbidden - Staff role required' })
  getStaffDashboard(@CurrentUser() user: UserContext): {
    message: string;
    user: string;
    role: string;
    permissions: string[];
  } {
    const rolePermissions = this.getRolePermissions(user.role);
    
    return {
      message: 'Staff dashboard access granted',
      user: user.username,
      role: user.role,
      permissions: rolePermissions,
    };
  }

  /**
   * Permission-based endpoint example
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CanManageUsers()
  @Get('users/manage')
  @ApiBearerAuth()
  @ApiProtectedRoute('User management endpoint')
  @ApiResponse({ status: 403, description: 'Forbidden - User management permissions required' })
  getUserManagementAccess(@CurrentUser() user: UserContext): {
    message: string;
    manager: string;
    availableActions: string[];
  } {
    return {
      message: 'User management access granted',
      manager: user.username,
      availableActions: [
        'Create users',
        'Update user profiles',
        'Deactivate users',
        'Reset passwords',
        'Assign roles'
      ],
    };
  }

  /**
   * Get authentication service status
   */
  @Public()
  @Get('status')
  @ApiPublicRoute('Get authentication service status')
  @ApiResponse({
    status: 200,
    description: 'Authentication service status',
    schema: {
      type: 'object',
      properties: {
        service: { type: 'string' },
        status: { type: 'string' },
        version: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
        uptime: { type: 'string' },
        features: {
          type: 'array',
          items: { type: 'string' }
        },
        statistics: {
          type: 'object',
          properties: {
            supportedRoles: { type: 'array', items: { type: 'string' } },
            totalEndpoints: { type: 'number' },
            secureEndpoints: { type: 'number' },
          }
        }
      }
    }
  })
  getStatus(): {
    service: string;
    status: string;
    version: string;
    timestamp: string;
    uptime: string;
    features: string[];
    statistics: {
      supportedRoles: string[];
      totalEndpoints: number;
      secureEndpoints: number;
    };
  } {
    const uptimeSeconds = process.uptime();
    const uptimeFormatted = `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${Math.floor(uptimeSeconds % 60)}s`;

    return {
      service: 'Volleyball Club Authentication Service',
      status: 'active',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: uptimeFormatted,
      features: [
        'JWT Authentication',
        'User Registration & Login',
        'Password Hashing (bcrypt)',
        'Token Refresh Mechanism',
        'Role-based Access Control',
        'Permission-based Access Control',
        'Request Rate Limiting',
        'Security Middleware',
        'Comprehensive API Documentation',
        'Multi-level User Roles'
      ],
      statistics: {
        supportedRoles: Object.values(UserRole),
        totalEndpoints: 12,
        secureEndpoints: 8,
      }
    };
  }

  /**
   * Helper method for role permissions
   */
  private getRolePermissions(role: string): string[] {
    const permissions = {
      [UserRole.ADMIN]: [
        'Full system access',
        'User management',
        'System configuration',
        'All volleyball club operations'
      ],
      [UserRole.MANAGER]: [
        'Team management',
        'Tournament organization',
        'Player registration',
        'Match scheduling'
      ],
      [UserRole.COACH]: [
        'Team training',
        'Player development',
        'Match strategy',
        'Performance tracking'
      ],
      [UserRole.PLAYER]: [
        'Profile management',
        'Team participation',
        'Match statistics',
        'Tournament registration'
      ],
      [UserRole.VIEWER]: [
        'View tournaments',
        'View match results',
        'View team information',
        'View public statistics'
      ]
    };

    return permissions[role] || ['Basic access'];
  }
}
