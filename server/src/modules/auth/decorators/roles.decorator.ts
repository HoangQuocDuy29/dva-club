import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/auth-status.enum';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required roles for a route
 * @Roles('admin', 'coach') - User must have admin OR coach role
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Specific role decorators for volleyball club
 */
export const AdminOnly = () => Roles(UserRole.ADMIN);
export const CoachOnly = () => Roles(UserRole.COACH);
export const ManagerOnly = () => Roles(UserRole.MANAGER);
export const PlayerOnly = () => Roles(UserRole.PLAYER);

/**
 * Combined role decorators
 */
export const AdminOrManager = () => Roles(UserRole.ADMIN, UserRole.MANAGER);
export const CoachOrPlayer = () => Roles(UserRole.COACH, UserRole.PLAYER);
export const StaffOnly = () => Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.COACH);
