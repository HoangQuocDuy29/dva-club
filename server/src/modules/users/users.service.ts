import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CloudinaryService } from "../../../src/cloudinary/cloudinary.service";

// Import Repository
import { UsersRepository } from "./repositories/users.repository";

// Import DTOs
import {
  CreateUserDto,
  UpdateUserDto,
  UserQueryDto,
  ChangePasswordDto,
  UpdateProfileDto,
} from "./dto";

// Import Interfaces
import {
  UserResponse,
  UserListResponse,
  UserDetailResponse,
  UserStatistics,
  ApiSuccessResponse,
} from "./interfaces";

// Import Enums
import { UserRole } from "../auth/enums/auth-status.enum";
import { UserAction } from "./enums";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  /**
   * Get all users with pagination and filtering - ✅ ENHANCED ERROR HANDLING
   */
  async getAllUsers(query: UserQueryDto): Promise<UserListResponse> {
    try {
      const { data, total } = await this.usersRepository.findAll(query);
      const { page = 1, limit = 20 } = query;

      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      // Get summary statistics
      const summary = await this.getUsersSummary();

      return {
        data: data.map((user) => this.toUserResponse(user)),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
        filters: {
          search: query.search,
          role: query.role,
          isActive: query.isActive,
          sortBy: query.sortBy || "createdAt",
          sortOrder: query.sortOrder || "DESC",
          appliedFilters: {
            total: this.countAppliedFilters(query),
            filters: this.getAppliedFiltersList(query),
          },
        },
        summary,
      };
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      throw new BadRequestException("Failed to get users: " + errorMessage);
    }
  }
  /**
   * ✅ THÊM METHOD NÀY: Update user profile separately
   */
  async updateUserProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto
  ): Promise<UserDetailResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    try {
      // Update profile in UserProfile table
      await this.usersRepository.updateProfile(userId, updateProfileDto);

      // Return updated user with profile
      const updatedUser = await this.usersRepository.findById(userId);
      return this.toUserDetailResponse(updatedUser);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      throw new BadRequestException(
        "Failed to update user profile: " + errorMessage
      );
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<UserDetailResponse> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toUserDetailResponse(user);
  }

  /**
   * Create new user (Admin only) - ✅ FIXED ERROR HANDLING
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
    // Check if email already exists
    const existingEmail = await this.usersRepository.findByEmail(
      createUserDto.email
    );
    if (existingEmail) {
      throw new ConflictException("Email already exists");
    }

    // Check if username already exists
    const existingUsername = await this.usersRepository.findByUsername(
      createUserDto.username
    );
    if (existingUsername) {
      throw new ConflictException("Username already exists");
    }

    // ✅ CLEAN APPROACH - Let Global Exception Filter handle unexpected errors
    const user = await this.usersRepository.create(createUserDto);
    return this.toUserResponse(user);
  }

  /**
   * Update user - ✅ FIXED ERROR HANDLING
   */
  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<UserResponse> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // ✅ CLEAN APPROACH - Repository will throw structured errors
    const updatedUser = await this.usersRepository.update(id, updateUserDto);
    return this.toUserResponse(updatedUser);
  }

  /**
   * Delete user (Soft delete) - ✅ ENHANCED ERROR HANDLING
   */
  async deleteUser(id: number): Promise<void> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      await this.usersRepository.softDelete(id);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      throw new BadRequestException("Failed to delete user: " + errorMessage);
    }
  }

  /**
   * Restore deleted user - ✅ ENHANCED ERROR HANDLING
   */
  async restoreUser(id: number): Promise<UserResponse> {
    try {
      const user = await this.usersRepository.restore(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return this.toUserResponse(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as is
      }
      const errorMessage = this.getErrorMessage(error);
      throw new BadRequestException("Failed to restore user: " + errorMessage);
    }
  }

  /**
   * Change user password (Admin only)
   */
  async changeUserPassword(
    id: number,
    changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Validate password confirmation
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException("Password confirmation does not match");
    }

    await this.usersRepository.changePassword(
      id,
      changePasswordDto.newPassword
    );
  }

  /**
   * ✅ UPDATED: Upload user avatar to Cloudinary
   */
  async uploadAvatar(
    userId: number,
    file: Express.Multer.File
  ): Promise<string> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // ✅ Enhanced file validation
    this.validateUploadFile(file);

    try {
      // ✅ Upload to Cloudinary instead of local storage
      const uploadResult = await this.cloudinaryService.uploadFile(file, {
        folder: "users/avatars",
        public_id: `user-${userId}-avatar`,
        overwrite: true,
        transformation: [
          { width: 400, height: 400, crop: "fill" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      const avatarUrl = uploadResult.secure_url;

      // ✅ Update user record with Cloudinary URL
      await this.usersRepository.updateAvatar(userId, avatarUrl);

      return avatarUrl;
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      throw new BadRequestException(
        "Failed to upload avatar to Cloudinary: " + errorMessage
      );
    }
  }
  /**
   * ✅ NEW: Separate method to update avatar URL only
   */
  async updateUserAvatar(userId: number, avatarUrl: string): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.usersRepository.updateAvatar(userId, avatarUrl);
  }

  /**
   * Search users - ✅ ENHANCED ERROR HANDLING
   */
  async searchUsers(
    keyword: string,
    query: UserQueryDto
  ): Promise<UserListResponse> {
    if (!keyword || keyword.trim().length < 2) {
      throw new BadRequestException(
        "Search keyword must be at least 2 characters long"
      );
    }

    try {
      const { data, total } = await this.usersRepository.search(
        keyword.trim(),
        query
      );
      const { page = 1, limit = 20 } = query;

      const totalPages = Math.ceil(total / limit);

      return {
        data: data.map((user) => this.toUserResponse(user)),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        filters: {
          search: keyword,
          role: query.role,
          isActive: query.isActive,
          sortBy: query.sortBy || "createdAt",
          sortOrder: query.sortOrder || "DESC",
          appliedFilters: {
            total: this.countAppliedFilters({ ...query, search: keyword }),
            filters: this.getAppliedFiltersList({ ...query, search: keyword }),
          },
        },
        summary: await this.getUsersSummary(),
      };
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      throw new BadRequestException("Search failed: " + errorMessage);
    }
  }

  /**
   * Get user statistics (Admin only) - ✅ ENHANCED ERROR HANDLING
   */
  async getUserStatistics(): Promise<UserStatistics> {
    try {
      const stats = await this.usersRepository.getStatistics();
      const recentActiveUsers =
        await this.usersRepository.getRecentlyActiveUsers(10);

      return {
        overview: {
          total: stats.total,
          active: stats.active,
          inactive: stats.inactive,
          newThisMonth: stats.recentRegistrations.thisMonth,
          newThisWeek: stats.recentRegistrations.thisWeek,
          newToday: stats.recentRegistrations.today,
        },
        byRole: {
          admin: stats.byRole[UserRole.ADMIN] || 0,
          manager: stats.byRole[UserRole.MANAGER] || 0,
          coach: stats.byRole[UserRole.COACH] || 0,
          player: stats.byRole[UserRole.PLAYER] || 0,
          viewer: stats.byRole[UserRole.VIEWER] || 0,
        },
        activity: {
          recentLogins: {
            today: stats.recentRegistrations.today,
            thisWeek: stats.recentRegistrations.thisWeek,
            thisMonth: stats.recentRegistrations.thisMonth,
          },
          registrationTrend: [],
          mostActiveUsers: recentActiveUsers.map((user) => ({
            id: user.id,
            username: user.username,
            fullName:
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              user.username,
            lastLogin: user.lastLogin,
            loginCount: 0,
          })),
        },
        demographics: {
          ageGroups: {
            under18: 0,
            age18to25: 0,
            age26to35: 0,
            over35: 0,
          },
          genderDistribution: {
            male: 0,
            female: 0,
            other: 0,
            notSpecified: 0,
          },
        },
        engagement: {
          averageSessionDuration: 0,
          activeSessionsCount: 0,
          topFeatures: [],
        },
      };
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      throw new BadRequestException(
        "Failed to get user statistics: " + errorMessage
      );
    }
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole): Promise<UserResponse[]> {
    const users = await this.usersRepository.findByRole(role);
    return users.map((user) => this.toUserResponse(user));
  }

  // ================== PRIVATE HELPER METHODS ==================

  /**
   * ✅ SAFE ERROR MESSAGE EXTRACTION
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === "string") {
      return error;
    }

    if (error && typeof error === "object" && "message" in error) {
      return String((error as any).message);
    }

    return "Unknown error occurred";
  }

  /**
   * ✅ ENHANCED FILE VALIDATION
   */
  private validateUploadFile(file: any): void {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    if (!file.originalname || typeof file.originalname !== "string") {
      throw new BadRequestException("Invalid file name");
    }

    if (!file.mimetype || !file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      throw new BadRequestException(
        "Only image files are allowed (jpg, jpeg, png, gif, webp)"
      );
    }

    if (!file.size || typeof file.size !== "number") {
      throw new BadRequestException("Invalid file size");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException("File size cannot exceed 5MB");
    }

    if (file.size < 1024) {
      throw new BadRequestException("File too small (minimum 1KB)");
    }
  }

  /**
   * Transform User entity to UserResponse
   */
  private toUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.username,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Transform User entity to UserDetailResponse
   */
  private toUserDetailResponse(user: any): UserDetailResponse {
    return {
      ...this.toUserResponse(user),
      profile: user.profile
        ? {
            dateOfBirth: user.profile.dateOfBirth,
            gender: user.profile.gender,
            address: user.profile.address,
            emergencyContact: user.profile.emergencyContact,
            bio: user.profile.bio,
            socialLinks: user.profile.socialLinks,
          }
        : undefined,
      statistics: {
        totalMatches: 0,
        totalWins: 0,
        totalLosses: 0,
        winRate: 0,
      },
      teams: [],
    };
  }

  /**
   * Get users summary for list response
   */
  private async getUsersSummary() {
    const stats = await this.usersRepository.getStatistics();
    return {
      totalUsers: stats.total,
      activeUsers: stats.active,
      inactiveUsers: stats.inactive,
      roleDistribution: stats.byRole,
    };
  }

  /**
   * Count applied filters
   */
  private countAppliedFilters(query: UserQueryDto): number {
    let count = 0;
    if (query.search) count++;
    if (query.role) count++;
    if (typeof query.isActive === "boolean") count++;
    return count;
  }

  /**
   * Get applied filters list
   */
  private getAppliedFiltersList(query: UserQueryDto): string[] {
    const filters: string[] = [];
    if (query.search) filters.push(`search:"${query.search}"`);
    if (query.role) filters.push(`role:${query.role}`);
    if (typeof query.isActive === "boolean")
      filters.push(`status:${query.isActive ? "active" : "inactive"}`);
    return filters;
  }

  /**
   * Generate avatar file name - ✅ SAFE EXTENSION EXTRACTION
   */
  private generateAvatarFileName(userId: number, file: any): string {
    const timestamp = Date.now();
    const extension = this.extractFileExtension(file.originalname);
    const datePath = new Date().toISOString().slice(0, 7).replace("-", "/");
    return `${datePath}/user-${userId}-avatar-${timestamp}.${extension}`;
  }

  /**
   * ✅ SAFE FILE EXTENSION EXTRACTION
   */
  private extractFileExtension(filename: any): string {
    if (!filename || typeof filename !== "string") {
      return "jpg"; // fallback
    }

    const parts = filename.split(".");
    const extension = parts.length > 1 ? parts.pop()?.toLowerCase() : "jpg";

    // Validate extension
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    return extension && allowedExtensions.includes(extension)
      ? extension
      : "jpg";
  }
}
