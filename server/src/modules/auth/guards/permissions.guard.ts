import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has admin role (admins have all permissions)
    if (user.role === 'admin' || user.role === 'super_admin') {
      return true;
    }

    // For now, we'll use a simple role-based permission system
    // In a real app, you might have a more complex permission system
    const rolePermissions = this.getRolePermissions(user.role);
    
    const hasPermission = requiredPermissions.every(permission =>
      rolePermissions.includes(permission)
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }

  private getRolePermissions(role: string): string[] {
    const permissions = {
      'super_admin': ['*'], // All permissions
      'admin': [
        'read:users', 'write:users', 'delete:users',
        'read:teams', 'write:teams', 'delete:teams',
        'read:tournaments', 'write:tournaments', 'delete:tournaments',
        'read:matches', 'write:matches', 'delete:matches',
        'read:players', 'write:players', 'delete:players',
        'read:statistics', 'write:statistics',
      ],
      'manager': [
        'read:users', 'write:users',
        'read:teams', 'write:teams',
        'read:tournaments', 'write:tournaments',
        'read:matches', 'write:matches',
        'read:players', 'write:players',
        'read:statistics',
      ],
      'coach': [
        'read:users',
        'read:teams', 'write:teams',
        'read:tournaments',
        'read:matches', 'write:matches',
        'read:players', 'write:players',
        'read:statistics',
      ],
      'player': [
        'read:users',
        'read:teams',
        'read:tournaments',
        'read:matches',
        'read:players',
        'read:statistics',
      ],
      'viewer': [
        'read:tournaments',
        'read:matches',
        'read:statistics',
      ],
    };

    return permissions[role] || [];
  }
}
