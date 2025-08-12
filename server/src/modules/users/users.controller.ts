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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

// Import Guards từ Auth Module
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

// Import Decorators từ Auth Module
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

// Import DTOs - ✅ UPDATED để include UpdateProfileDto
import { 
  CreateUserDto, 
  UpdateUserDto, 
  UpdateProfileDto,  // ✅ ADD NEW DTO
  UserQueryDto, 
  ChangePasswordDto 
} from './dto';

// Import Interfaces
import { 
  UserResponse, 
  UserListResponse, 
  UserDetailResponse,
  UserStatistics,
  ApiSuccessResponse 
} from './interfaces';

import { UserContext } from '../auth/interfaces/user-context.interface';

// Import Service
import { UsersService } from './users.service';

// Import Enums
import { UserRole } from '../auth/enums/auth-status.enum';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users with pagination and filtering
   */
  @Get()
  @ApiOperation({ summary: 'Get all users with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Users retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            data: { type: 'array' },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' },
                hasNextPage: { type: 'boolean' },
                hasPrevPage: { type: 'boolean' },
              }
            },
            summary: { type: 'object' },
          }
        }
      }
    }
  })
  async getAllUsers(
    @Query() query: UserQueryDto,
    @CurrentUser() currentUser: UserContext,
  ): Promise<ApiSuccessResponse<UserListResponse>> {
    const result = await this.usersService.getAllUsers(query);
    
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get user by ID - ✅ CHECKED Response Type
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID with detailed profile information' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            username: { type: 'string' },
            fullName: { type: 'string' },
            profile: {
              type: 'object',
              properties: {
                dateOfBirth: { type: 'string', format: 'date' },
                gender: { type: 'string', example: 'male' },
                address: { type: 'string' },
                emergencyContact: { type: 'object' },
                bio: { type: 'string' },
                socialLinks: { type: 'object' },
              }
            },
            statistics: { type: 'object' },
            teams: { type: 'array' },
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserContext,
  ): Promise<ApiSuccessResponse<UserDetailResponse>> {  // ✅ CORRECT TYPE
    const user = await this.usersService.getUserById(id);
    
    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,  // ✅ Now matches UserDetailResponse with updated profile structure
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create new user (Admin only)
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new user (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed'
  })
  @ApiResponse({
    status: 409,
    description: 'Email or username already exists'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required'
  })
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() currentUser: UserContext,
  ): Promise<ApiSuccessResponse<UserResponse>> {
    const newUser = await this.usersService.createUser(createUserDto);
    
    return {
      success: true,
      message: 'User created successfully',
      data: newUser,
      timestamp: new Date().toISOString(),
      statusCode: 201,
    };
  }

  /**
   * Update user - ✅ CHECKED Response Type
   */
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Update user basic information (Admin/Manager only)' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  @ApiResponse({
    status: 409,
    description: 'Email or username already exists'
  })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: UserContext,
  ): Promise<ApiSuccessResponse<UserResponse>> {  // ✅ CORRECT TYPE
    const updatedUser = await this.usersService.updateUser(id, updateUserDto);
    
    return {
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * ✅ NEW: Update user profile separately
   */
  @Put(':id/profile')
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ 
    summary: 'Update user profile information (Admin/Manager only)',
    description: 'Update profile-specific fields like bio, address, social links, etc.'
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            profile: {
              type: 'object',
              properties: {
                dateOfBirth: { type: 'string', format: 'date' },
                gender: { type: 'string' },
                address: { type: 'string' },
                emergencyContact: { type: 'object' },
                bio: { type: 'string' },
                socialLinks: { type: 'object' },
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async updateUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() currentUser: UserContext,
  ): Promise<ApiSuccessResponse<UserDetailResponse>> {
    const updatedUser = await this.usersService.updateUserProfile(id, updateProfileDto);
    
    return {
      success: true,
      message: 'User profile updated successfully',
      data: updatedUser,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * ✅ NEW: Get user profile separately
   */
  @Get(':id/profile')
  @ApiOperation({ 
    summary: 'Get user profile information',
    description: 'Get detailed profile information for a specific user'
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async getUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserContext,
  ): Promise<ApiSuccessResponse<UserDetailResponse['profile']>> {
    const user = await this.usersService.getUserById(id);
    
    return {
      success: true,
      message: 'User profile retrieved successfully',
      data: user.profile,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Delete user (Soft delete - Admin only)
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserContext,
  ): Promise<void> {
    await this.usersService.deleteUser(id);
  }

  /**
   * Restore deleted user (Admin only)
   */
  @Put(':id/restore')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Restore deleted user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  async restoreUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserContext,
  ): Promise<ApiSuccessResponse<UserResponse>> {
    const restoredUser = await this.usersService.restoreUser(id);
    
    return {
      success: true,
      message: 'User restored successfully',
      data: restoredUser,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Change user password (Admin only)
   */
  @Put(':id/password')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Change user password (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully'
  })
  async changeUserPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() currentUser: UserContext,
  ): Promise<ApiSuccessResponse<null>> {
    await this.usersService.changeUserPassword(id, changePasswordDto);
    
    return {
      success: true,
      message: 'Password changed successfully',
      data: null,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Upload user avatar - ✅ FIXED với any type
   */
  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image file (max 5MB)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar uploaded successfully'
  })
  async uploadAvatar(
    @Param('id', ParseIntPipe) userId: number,
    @UploadedFile() file: any,  // ✅ KEPT any type as discussed
    @CurrentUser() currentUser: UserContext,
  ): Promise<ApiSuccessResponse<{ avatarUrl: string }>> {
    const avatarUrl = await this.usersService.uploadAvatar(userId, file);
    
    return {
      success: true,
      message: 'Avatar uploaded successfully',
      data: { avatarUrl },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Search users
   */
  @Get('search/query')
@ApiOperation({ summary: 'Search users by keyword' })
@ApiResponse({
  status: 200,
  description: 'Search completed successfully'
})
async searchUsers(
  // ❌ Remove this line: @Query('q') keyword: string,
  @Query() query: UserQueryDto,
  @CurrentUser() currentUser: UserContext,
): Promise<ApiSuccessResponse<UserListResponse>> {
  // ✅ Use search from DTO instead of separate keyword
  const result = await this.usersService.searchUsers(query.search || '', query);
  
  return {
    success: true,
    message: 'Search completed successfully',
    data: result,
    timestamp: new Date().toISOString(),
  };
}


  /**
   * Get user statistics (Admin only)
   */
  @Get('admin/statistics')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get user statistics (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully'
  })
  async getUserStatistics(
    @CurrentUser() currentUser: UserContext,
  ): Promise<ApiSuccessResponse<UserStatistics>> {
    const statistics = await this.usersService.getUserStatistics();
    
    return {
      success: true,
      message: 'User statistics retrieved successfully',
      data: statistics,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get users by role
   */
  @Get('role/:role')
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get users by role' })
  @ApiParam({ 
    name: 'role', 
    description: 'User role',
    enum: UserRole,
    example: UserRole.PLAYER 
  })
  async getUsersByRole(
    @Param('role') role: UserRole,
    @CurrentUser() currentUser: UserContext,
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
