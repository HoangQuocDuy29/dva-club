import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
  Repository, 
  FindOptionsWhere, 
  MoreThanOrEqual, 
  SelectQueryBuilder, 
  Not, 
  IsNull 
} from 'typeorm';
import * as bcrypt from 'bcrypt';

// Import entities từ thư mục entities có sẵn
import { User } from '../../../entities/user.entity';
import { UserProfile } from '../../../entities/user-profile.entity';

// Import DTOs
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserQueryDto } from '../dto/user-query.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto'; 

// Import Enums
import { UserStatus, UserAction } from '../enums';
import { UserRole } from '../../auth/enums/auth-status.enum';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  /**
   * Find all users with pagination, filtering, and sorting
   * ✅ SIMPLIFIED: TypeORM automatically excludes soft deleted records
   */
  async findAll(query: UserQueryDto): Promise<{
    data: User[];
    total: number;
  }> {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      role, 
      isActive, 
      sortBy = 'createdAt', 
      sortOrder = 'DESC' 
    } = query;

    // ✅ TypeORM automatically excludes soft deleted records
    const queryBuilder = this.createBaseQueryBuilder();

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(user.email ILIKE :search OR user.username ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply role filter
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    // Apply active status filter
    if (typeof isActive === 'boolean') {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive });
    }

    // Apply sorting
    const allowedSortFields = ['createdAt', 'updatedAt', 'username', 'email', 'firstName', 'lastName'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`user.${safeSortBy}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  /**
   * Find user by ID with profile
   * ✅ SIMPLIFIED: TypeORM automatically excludes soft deleted records
   */
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  /**
   * ✅ Update user profile data
   */
  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<void> {
    // Convert string date to Date object if provided
    const profileData: any = { ...updateProfileDto };
    
    if (updateProfileDto.dateOfBirth) {
      profileData.dateOfBirth = new Date(updateProfileDto.dateOfBirth);
    }

    // Update profile record where userId matches
    await this.userProfileRepository.update(
      { userId }, 
      profileData
    );
  }

  /**
   * Find user by email
   * ✅ SIMPLIFIED: TypeORM automatically excludes soft deleted records
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['profile'],
    });
  }

  /**
   * Find user by username
   * ✅ SIMPLIFIED: TypeORM automatically excludes soft deleted records
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['profile'],
    });
  }

  /**
   * Check if email exists (excluding soft deleted)
   */
  async emailExists(email: string, excludeId?: number): Promise<boolean> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    if (excludeId) {
      queryBuilder.andWhere('user.id != :excludeId', { excludeId });
    }

    const count = await queryBuilder.getCount();
    return count > 0;
  }

  /**
   * Check if username exists (excluding soft deleted)
   */
  async usernameExists(username: string, excludeId?: number): Promise<boolean> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username });

    if (excludeId) {
      queryBuilder.andWhere('user.id != :excludeId', { excludeId });
    }

    const count = await queryBuilder.getCount();
    return count > 0;
  }

  /**
   * Create new user - ✅ UNCHANGED (working properly)
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    // Create user
    const user = this.userRepository.create({
      email: createUserDto.email,
      username: createUserDto.username,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phone: createUserDto.phone,
      role: createUserDto.role,
      avatarUrl: createUserDto.avatarUrl,
      passwordHash: hashedPassword,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    // Create user profile với EXACT fields từ UserProfile entity
    const profile = this.userProfileRepository.create({
      userId: savedUser.id,
      dateOfBirth: null,
      gender: null,
      address: null,
      emergencyContact: null,
      bio: null,
      socialLinks: null,
    });

    await this.userProfileRepository.save(profile);

    return this.findById(savedUser.id);
  }

  /**
   * Update user
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    // Check if email already exists (exclude current user)
    if (updateUserDto.email) {
      const emailExists = await this.emailExists(updateUserDto.email, id);
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }

    // Check if username already exists (exclude current user)
    if (updateUserDto.username) {
      const usernameExists = await this.usernameExists(updateUserDto.username, id);
      if (usernameExists) {
        throw new Error('Username already exists');
      }
    }

    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  /**
   * ✅ UPDATED: Use TypeORM softDelete method
   */
async softDelete(id: number): Promise<void> {
  console.log('🔍 Starting softDelete for user ID:', id);
  
  try {
    // Check user exists trước khi delete
    const user = await this.userRepository.findOne({ where: { id } });
    console.log('🔍 User found before delete:', user ? 'YES' : 'NO');
    console.log('🔍 User current deletedAt:', user?.deletedAt);
    
    // Execute soft delete
    const result = await this.userRepository.softDelete(id);
    console.log('✅ SoftDelete result:', result);
    
    // Verify immediately after delete với withDeleted
    const userAfter = await this.userRepository.findOne({ 
      where: { id }, 
      withDeleted: true 
    });
    console.log('🔍 User deletedAt after softDelete:', userAfter?.deletedAt);
    
  } catch (error) {
    console.error('❌ SoftDelete error:', error);
    throw error;
  }
}



  /**
   * Hard delete user
   */
  async delete(id: number): Promise<void> {
    // Delete user profile first (foreign key constraint)
    await this.userProfileRepository.delete({ userId: id });
    
    // Delete user
    await this.userRepository.delete(id);
  }

  /**
   * ✅ UPDATED: Use TypeORM restore method
   */
  async restore(id: number): Promise<User | null> {
    await this.userRepository.restore(id);
    return this.findById(id);
  }

  /**
   * Change user password
   */
  async changePassword(id: number, newPassword: string): Promise<void> {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    await this.userRepository.update(id, { 
      passwordHash: hashedPassword,
      updatedAt: new Date(),
    });
  }

  /**
   * Update user avatar
   */
  async updateAvatar(id: number, avatarUrl: string): Promise<User | null> {
    await this.userRepository.update(id, { 
      avatarUrl,
      updatedAt: new Date(),
    });
    return this.findById(id);
  }

  /**
   * Search users - ✅ SIMPLIFIED
   */
  async search(keyword: string, query: UserQueryDto): Promise<{
    data: User[];
    total: number;
  }> {
    return this.findAll({ ...query, search: keyword });
  }

  /**
   * Get users by role - ✅ SIMPLIFIED
   */
  async findByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({
      where: { role, isActive: true },
      relations: ['profile'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get active users count - ✅ SIMPLIFIED
   */
  async getActiveUsersCount(): Promise<number> {
    return this.userRepository.count({
      where: { isActive: true },
    });
  }

  /**
   * Get users statistics - ✅ FIXED: Automatic soft delete exclusion
   */
  async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
    recentRegistrations: {
      today: number;
      thisWeek: number;
      thisMonth: number;
    };
  }> {
    // ✅ TypeORM automatically excludes soft deleted records
    const [total, active, inactive] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { isActive: true } }),
      this.userRepository.count({ where: { isActive: false } }),
    ]);

    // Get role distribution (soft deleted automatically excluded)
    const roleStats = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    const byRole = roleStats.reduce((acc, stat) => {
      acc[stat.role] = parseInt(stat.count);
      return acc;
    }, {} as Record<string, number>);

    // Get recent registrations (soft deleted automatically excluded)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayCount, weekCount, monthCount] = await Promise.all([
      this.userRepository.count({
        where: {
          createdAt: MoreThanOrEqual(today),
        },
      }),
      this.userRepository.count({
        where: {
          createdAt: MoreThanOrEqual(thisWeek),
        },
      }),
      this.userRepository.count({
        where: {
          createdAt: MoreThanOrEqual(thisMonth),
        },
      }),
    ]);

    return {
      total,
      active,
      inactive,
      byRole,
      recentRegistrations: {
        today: todayCount,
        thisWeek: weekCount,
        thisMonth: monthCount,
      },
    };
  }

  /**
   * Get users with avatars - ✅ SIMPLIFIED
   */
  async findUsersWithAvatars(): Promise<User[]> {
    return this.userRepository.find({
      where: {
        avatarUrl: Not(IsNull()),
      },
      select: ['id', 'username', 'avatarUrl'],
    });
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(id: number): Promise<void> {
    await this.userRepository.update(id, {
      lastLogin: new Date(),
    });
  }

  /**
   * Get recently active users - ✅ SIMPLIFIED
   */
  async getRecentlyActiveUsers(limit: number = 10): Promise<User[]> {
    return this.userRepository.find({
      where: { isActive: true },
      order: { lastLogin: 'DESC' },
      take: limit,
      relations: ['profile'],
    });
  }

  /**
   * ✅ NEW METHOD: Get soft deleted users for admin management
   */
  async getSoftDeletedUsers(query?: UserQueryDto): Promise<{
    data: User[];
    total: number;
  }> {
    const { page = 1, limit = 20, search, role } = query || {};

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .withDeleted()  // ✅ Include soft deleted records
      .where('user.deletedAt IS NOT NULL');  // ✅ Only soft deleted users

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(user.email ILIKE :search OR user.username ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply role filter
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);
    queryBuilder.orderBy('user.deletedAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  /**
   * ✅ NEW METHOD: Restore user by email (recovery feature)
   */
  async restoreByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      withDeleted: true,  // Include soft deleted
      relations: ['profile'],
    });

    if (!user || !user.deletedAt) {
      return null;  // User not found or not deleted
    }

    await this.userRepository.restore(user.id);
    return this.findById(user.id);
  }

  /**
   * Private helper: Create base query builder with relations
   * ✅ SIMPLIFIED: TypeORM automatically excludes soft deleted
   */
  private createBaseQueryBuilder(): SelectQueryBuilder<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile');
    // No need to manually exclude soft deleted - TypeORM handles automatically
  }

  /**
   * Bulk operations
   */
  async bulkUpdateStatus(userIds: number[], isActive: boolean): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ isActive, updatedAt: new Date() })
      .where('id IN (:...userIds)', { userIds })
      .execute();
  }

  /**
   * ✅ UPDATED: Bulk soft delete using TypeORM softDelete
   */
  async bulkSoftDelete(userIds: number[]): Promise<void> {
    await this.userRepository.softDelete(userIds);
  }

  /**
   * Hard delete - Keep existing implementation
   */
  async bulkDelete(userIds: number[]): Promise<void> {
    // Delete profiles first
    await this.userProfileRepository
      .createQueryBuilder()
      .delete()
      .where('userId IN (:...userIds)', { userIds })
      .execute();

    // Delete users
    await this.userRepository
      .createQueryBuilder()
      .delete()
      .where('id IN (:...userIds)', { userIds })
      .execute();
  }

  /**
   * ✅ NEW METHOD: Bulk restore users
   */
  async bulkRestore(userIds: number[]): Promise<void> {
    await this.userRepository.restore(userIds);
  }
}
