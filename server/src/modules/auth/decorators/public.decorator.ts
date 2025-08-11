import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to mark routes as public (skip authentication)
 * @Public() routes will bypass JWT authentication
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
