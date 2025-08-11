import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Import entities
import { User } from '../../entities/user.entity';
import { UserProfile } from '../../entities/user-profile.entity';

// Import DTOs
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

// Import interfaces
import { AuthResponse, LoginResponse, RefreshTokenResponse } from './interfaces/auth-response.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserContext } from './interfaces/user-context.interface';

// Import enums
import { AuthStatus, UserRole, UserStatus } from './enums/auth-status.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validate user credentials for local authentication
   */
  async validateUser(email: string, password: string): Promise<UserContext | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { email, isActive: true },
        select: [
          'id', 
          'email', 
          'username', 
          'passwordHash', // ✅ CORRECT FIELD NAME
          'firstName', 
          'lastName', 
          'role', 
          'isActive', 
          'lastLogin',    // ✅ CORRECT FIELD NAME (not lastLoginAt)
          'createdAt', 
          'updatedAt'
        ]
      });

      if (!user) {
        return null;
      }

      // Check if user is active
      if (!user.isActive) { // ✅ Direct boolean check
        throw new UnauthorizedException('User account is not active');
      }

      // Verify password with correct field name
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash); // ✅ CORRECT
      if (!isPasswordValid) {
        return null;
      }

      // Remove password from response
      const { passwordHash, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        status: user.isActive ? 'active' : 'inactive' // ✅ Map boolean to status string
      };

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Error validating user credentials');
    }
  }

  /**
   * User login
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Generate tokens
      const tokens = await this.generateTokens(user);
      
      // Update last login timestamp - use correct field name
      await this.userRepository.update(user.id, {
        lastLogin: new Date() // ✅ CORRECT FIELD NAME
      });

      // Check if this is first login
      const isFirstLogin = !user.lastLogin; // ✅ CORRECT FIELD NAME

      return {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
        },
        message: 'Login successful',
        isFirstLogin,
      };

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Login failed');
    }
  }

 /**
 * User registration
 */
async register(registerDto: RegisterDto): Promise<LoginResponse> {
  try {
    // Check if email already exists
    const existingEmail = await this.userRepository.findOne({
      where: { email: registerDto.email }
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if username already exists
    const existingUsername = await this.userRepository.findOne({
      where: { username: registerDto.username }
    });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Create user with correct field names
    const user = this.userRepository.create({
      email: registerDto.email,
      username: registerDto.username,
      passwordHash: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      phone: registerDto.phoneNumber,
      role: registerDto.role || UserRole.VIEWER,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    // ✅ Create user profile with CORRECT field names from entity
    const userProfile = this.userProfileRepository.create({
      userId: savedUser.id,              // ✅ CORRECT: matches 'user_id' column
      dateOfBirth: null,                 // ✅ CORRECT: matches entity field
      gender: null,                      // ✅ CORRECT: matches entity field
      address: null,                     // ✅ CORRECT: matches entity field
      emergencyContact: null,            // ✅ CORRECT: JSONB field for emergency contact
      bio: null,                         // ✅ CORRECT: matches entity field
      socialLinks: null,                 // ✅ CORRECT: JSONB field for social links
    });
    await this.userProfileRepository.save(userProfile);

    // Generate tokens for auto-login after registration
    const userContext: UserContext = {
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      role: savedUser.role,
      status: 'active',
      isActive: savedUser.isActive,
      lastLogin: null,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };

    const tokens = await this.generateTokens(userContext);

    // Update last login for the new user
    await this.userRepository.update(savedUser.id, {
      lastLogin: new Date()
    });

    return {
      ...tokens,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        username: savedUser.username,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role,
        status: 'active',
      },
      message: 'Registration successful',
      isFirstLogin: true,
    };

  } catch (error) {
    if (error instanceof ConflictException) {
      throw error;
    }
    throw new BadRequestException('Registration failed');
  }
}


  /**
   * Refresh access token
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponse> {
    try {
      // Verify refresh token
      const payload = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken);
      
      // Get user data to ensure user still exists and is active
      const user = await this.userRepository.findOne({
        where: { id: payload.sub, isActive: true }
      });

      if (!user || !user.isActive) { // ✅ Direct boolean check
        throw new UnauthorizedException('User not found or inactive');
      }

      // Generate new access token
      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(newPayload);
      const expiresIn = 3600; // 1 hour
      const expiresAt = new Date(Date.now() + expiresIn * 1000);

      return {
        accessToken,
        tokenType: 'Bearer',
        expiresIn,
        expiresAt,
      };

    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Get user profile by JWT payload
   */
  async getProfile(userId: number): Promise<UserContext> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, isActive: true }
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { passwordHash, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        status: user.isActive ? 'active' : 'inactive',
        lastLogin: user.lastLogin, // ✅ Map lastLogin to lastLoginAt for interface compatibility
      };

    } catch (error) {
      throw new UnauthorizedException('Unable to get user profile');
    }
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(user: UserContext): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, { expiresIn: '7d' })
    ]);

    const expiresIn = 3600; // 1 hour
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn,
      expiresAt,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
    };
  }

  /**
   * Validate JWT token and return user
   */
  async validateJwtUser(payload: JwtPayload): Promise<UserContext> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub, isActive: true }
    });

    if (!user) {
      throw new UnauthorizedException('Token is invalid');
    }

    if (!user.isActive) { // ✅ Direct boolean check
      throw new UnauthorizedException('User account is not active');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      status: user.isActive ? 'active' : 'inactive',
      lastLogin: user.lastLogin, // ✅ Map field names
    };
  }
}
