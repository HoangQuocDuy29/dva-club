import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

/**
 * Common API response decorators for auth endpoints
 */
export const ApiAuthResponse = () =>
  applyDecorators(
    ApiResponse({ status: 200, description: 'Success' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );

export const ApiProtectedRoute = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth(),
    ApiAuthResponse(),
  );

export const ApiPublicRoute = (summary: string) =>
  applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 200, description: 'Success' }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );

/**
 * Specific auth endpoint responses
 */
export const ApiLoginResponse = () =>
  applyDecorators(
    ApiResponse({ 
      status: 200, 
      description: 'Login successful',
      schema: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          user: { 
            type: 'object',
            properties: {
              id: { type: 'number' },
              email: { type: 'string' },
              username: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              role: { type: 'string' },
            }
          },
          expiresIn: { type: 'number' },
        }
      }
    }),
    ApiResponse({ status: 401, description: 'Invalid credentials' }),
  );

export const ApiRegisterResponse = () =>
  applyDecorators(
    ApiResponse({ 
      status: 201, 
      description: 'Registration successful' 
    }),
    ApiResponse({ status: 400, description: 'Validation failed' }),
    ApiResponse({ status: 409, description: 'Email or username already exists' }),
  );
