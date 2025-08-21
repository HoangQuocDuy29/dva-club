import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
// Import Guards từ Auth Module
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { Request } from "express";
// Import Decorators từ Auth Module
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";

// Import DTOs - ✅ UPDATED để include UpdateProfileDto
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateProfileDto, // ✅ ADD NEW DTO
  UserQueryDto,
  ChangePasswordDto,
} from "./dto";

// Import Interfaces
import {
  UserResponse,
  UserListResponse,
  UserDetailResponse,
  UserStatistics,
  ApiSuccessResponse,
} from "./interfaces";

import { UserContext } from "../auth/interfaces/user-context.interface";

// Import Service
import { UsersService } from "./users.service";

// Import Enums
import { UserRole } from "../auth/enums/auth-status.enum";

@ApiTags("Users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  /**
   * Get all users with pagination and filtering
   */
  @Get()
  @ApiOperation({ summary: "Get all users with pagination and filtering" })
  @ApiResponse({
    status: 200,
    description: "Users retrieved successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "Users retrieved successfully" },
        data: {
          type: "object",
          properties: {
            data: { type: "array" },
            pagination: {
              type: "object",
              properties: {
                page: { type: "number" },
                limit: { type: "number" },
                total: { type: "number" },
                totalPages: { type: "number" },
                hasNextPage: { type: "boolean" },
                hasPrevPage: { type: "boolean" },
              },
            },
            summary: { type: "object" },
          },
        },
      },
    },
  })
  async getAllUsers(
    @Query() query: UserQueryDto,
    @CurrentUser() currentUser: UserContext
  ): Promise<ApiSuccessResponse<UserListResponse>> {
    const result = await this.usersService.getAllUsers(query);

    return {
      success: true,
      message: "Users retrieved successfully",
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get user by ID - ✅ CHECKED Response Type
   */
  @Get(":id")
  @ApiOperation({ summary: "Get user by ID with detailed profile information" })
  @ApiParam({ name: "id", description: "User ID", example: 1 })
  @ApiResponse({
    status: 200,
    description: "User retrieved successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            email: { type: "string" },
            username: { type: "string" },
            fullName: { type: "string" },
            profile: {
              type: "object",
              properties: {
                dateOfBirth: { type: "string", format: "date" },
                gender: { type: "string", example: "male" },
                address: { type: "string" },
                emergencyContact: { type: "object" },
                bio: { type: "string" },
                socialLinks: { type: "object" },
              },
            },
            statistics: { type: "object" },
            teams: { type: "array" },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  async getUserById(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserContext
  ): Promise<ApiSuccessResponse<UserDetailResponse>> {
    // ✅ CORRECT TYPE
    const user = await this.usersService.getUserById(id);

    return {
      success: true,
      message: "User retrieved successfully",
      data: user, // ✅ Now matches UserDetailResponse with updated profile structure
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create new user (Admin only)
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles("admin")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create new user (Admin only)" })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Validation failed",
  })
  @ApiResponse({
    status: 409,
    description: "Email or username already exists",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin role required",
  })
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() currentUser: UserContext
  ): Promise<ApiSuccessResponse<UserResponse>> {
    const newUser = await this.usersService.createUser(createUserDto);

    return {
      success: true,
      message: "User created successfully",
      data: newUser,
      timestamp: new Date().toISOString(),
      statusCode: 201,
    };
  }

  /**
   * Update user - ✅ CHECKED Response Type
   */
  @Put(":id")
  @UseGuards(RolesGuard)
  @Roles("admin", "manager")
  @ApiOperation({
    summary: "Update user basic information (Admin/Manager only)",
  })
  @ApiParam({ name: "id", description: "User ID", example: 1 })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  @ApiResponse({
    status: 409,
    description: "Email or username already exists",
  })
  async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: UserContext
  ): Promise<ApiSuccessResponse<UserResponse>> {
    // ✅ CORRECT TYPE
    const updatedUser = await this.usersService.updateUser(id, updateUserDto);

    return {
      success: true,
      message: "User updated successfully",
      data: updatedUser,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * ✅ NEW: Update user profile separately
   */
  @Put(":id/profile")
  @UseGuards(RolesGuard)
  @Roles("admin", "manager")
  @ApiOperation({
    summary: "Update user profile information (Admin/Manager only)",
    description:
      "Update profile-specific fields like bio, address, social links, etc.",
  })
  @ApiParam({ name: "id", description: "User ID", example: 1 })
  @ApiResponse({
    status: 200,
    description: "User profile updated successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            profile: {
              type: "object",
              properties: {
                dateOfBirth: { type: "string", format: "date" },
                gender: { type: "string" },
                address: { type: "string" },
                emergencyContact: { type: "object" },
                bio: { type: "string" },
                socialLinks: { type: "object" },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  async updateUserProfile(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() currentUser: UserContext
  ): Promise<ApiSuccessResponse<UserDetailResponse>> {
    const updatedUser = await this.usersService.updateUserProfile(
      id,
      updateProfileDto
    );

    return {
      success: true,
      message: "User profile updated successfully",
      data: updatedUser,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * ✅ NEW: Get user profile separately
   */
  @Get(":id/profile")
  @ApiOperation({
    summary: "Get user profile information",
    description: "Get detailed profile information for a specific user",
  })
  @ApiParam({ name: "id", description: "User ID", example: 1 })
  @ApiResponse({
    status: 200,
    description: "User profile retrieved successfully",
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  async getUserProfile(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserContext
  ): Promise<ApiSuccessResponse<UserDetailResponse["profile"]>> {
    const user = await this.usersService.getUserById(id);

    return {
      success: true,
      message: "User profile retrieved successfully",
      data: user.profile,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Delete user (Soft delete - Admin only)
   */
  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete user (Admin only)" })
  @ApiParam({ name: "id", description: "User ID", example: 1 })
  @ApiResponse({
    status: 204,
    description: "User deleted successfully",
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  async deleteUser(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserContext
  ): Promise<void> {
    await this.usersService.deleteUser(id);
  }

  /**
   * Restore deleted user (Admin only)
   */
  @Put(":id/restore")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Restore deleted user (Admin only)" })
  @ApiParam({ name: "id", description: "User ID", example: 1 })
  async restoreUser(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserContext
  ): Promise<ApiSuccessResponse<UserResponse>> {
    const restoredUser = await this.usersService.restoreUser(id);

    return {
      success: true,
      message: "User restored successfully",
      data: restoredUser,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Change user password (Admin only)
   */
  @Put(":id/password")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Change user password (Admin only)" })
  @ApiParam({ name: "id", description: "User ID", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Password changed successfully",
  })
  async changeUserPassword(
    @Param("id", ParseIntPipe) id: number,
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() currentUser: UserContext
  ): Promise<ApiSuccessResponse<null>> {
    await this.usersService.changeUserPassword(id, changePasswordDto);

    return {
      success: true,
      message: "Password changed successfully",
      data: null,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Upload user avatar to Cloudinary - ✅ UPDATED
   */
  @Post(":id/avatar")
  @UseInterceptors(FileInterceptor("avatar"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Upload user avatar to Cloudinary" })
  @ApiParam({ name: "id", description: "User ID", example: 1 })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        avatar: {
          type: "string",
          format: "binary",
          description: "Avatar image file (max 5MB)",
        },
      },
    },
  })
  async uploadAvatar(
    @Param("id", ParseIntPipe) userId: number,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: UserContext
  ): Promise<ApiSuccessResponse<{ avatarUrl: string }>> {
    // ✅ DEBUG: Log everything
    // ✅ Simple debug without req
    console.log("🔍 Debug file upload:", {
      hasFile: !!file,
      fileDetails: file
        ? {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            hasBuffer: !!file.buffer,
          }
        : "NO FILE",
    });
    // ✅ Validate file exists
    if (!file || !file.buffer) {
      throw new BadRequestException("No file uploaded or file is corrupted");
    }

    console.log("📤 Received file:", {
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      size: file.size,
      hasBuffer: !!file.buffer,
    });

    try {
      // ✅ Upload to Cloudinary using file buffer
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

      console.log("✅ Cloudinary upload result:", {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
        bytes: uploadResult.bytes,
      });

      // ✅ Save Cloudinary URL to database
      const avatarUrl = uploadResult.secure_url;
      await this.usersService.updateUserAvatar(userId, avatarUrl);

      return {
        success: true,
        message: "Avatar uploaded successfully to Cloudinary",
        data: { avatarUrl },
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      console.error("❌ Avatar upload failed:", error);

      // ✅ Safe error message handling
      let errorMessage = "Failed to upload avatar. Please try again.";
      if (error instanceof Error) {
        if (error.message?.includes("Invalid image")) {
          errorMessage =
            "Invalid image format. Please upload JPG, PNG, or GIF files.";
        }
      }

      throw new BadRequestException(errorMessage);
    }
  }

  /**
   * Search users
   */
  @Get("search/query")
  @ApiOperation({ summary: "Search users by keyword" })
  @ApiResponse({
    status: 200,
    description: "Search completed successfully",
  })
  async searchUsers(
    // ❌ Remove this line: @Query('q') keyword: string,
    @Query() query: UserQueryDto,
    @CurrentUser() currentUser: UserContext
  ): Promise<ApiSuccessResponse<UserListResponse>> {
    // ✅ Use search from DTO instead of separate keyword
    const result = await this.usersService.searchUsers(
      query.search || "",
      query
    );

    return {
      success: true,
      message: "Search completed successfully",
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get user statistics (Admin only)
   */
  @Get("admin/statistics")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Get user statistics (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "User statistics retrieved successfully",
  })
  async getUserStatistics(
    @CurrentUser() currentUser: UserContext
  ): Promise<ApiSuccessResponse<UserStatistics>> {
    const statistics = await this.usersService.getUserStatistics();

    return {
      success: true,
      message: "User statistics retrieved successfully",
      data: statistics,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get users by role
   */
  @Get("role/:role")
  @UseGuards(RolesGuard)
  @Roles("admin", "manager")
  @ApiOperation({ summary: "Get users by role" })
  @ApiParam({
    name: "role",
    description: "User role",
    enum: UserRole,
    example: UserRole.PLAYER,
  })
  async getUsersByRole(
    @Param("role") role: UserRole,
    @CurrentUser() currentUser: UserContext
  ): Promise<ApiSuccessResponse<UserResponse[]>> {
    const users = await this.usersService.getUsersByRole(role);

    return {
      success: true,
      message: `Users with role '${role}' retrieved successfully`,
      data: users,
      timestamp: new Date().toISOString(),
    };
  }
}
