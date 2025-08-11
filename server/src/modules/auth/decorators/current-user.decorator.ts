import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserContext } from '../interfaces/user-context.interface';

/**
 * Decorator to extract current user from request
 * Usage: @CurrentUser() user: UserContext
 * Usage with specific field: @CurrentUser('email') email: string
 */
export const CurrentUser = createParamDecorator(
  (data: keyof UserContext | undefined, ctx: ExecutionContext): UserContext | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    // Return specific field if requested
    if (data) {
      return user[data];
    }

    // Return entire user object
    return user;
  },
);

/**
 * Alias for CurrentUser for better readability
 */
export const User = CurrentUser;

/**
 * Get current user ID specifically
 */
export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.id;
  },
);
