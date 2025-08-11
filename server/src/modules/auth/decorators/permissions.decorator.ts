import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator to specify required permissions for a route
 * @Permissions('read:users', 'write:users') - User must have ALL specified permissions
 */
export const Permissions = (...permissions: string[]) => 
  SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * Common permission decorators for volleyball club
 */

// User permissions
export const CanReadUsers = () => Permissions('read:users');
export const CanWriteUsers = () => Permissions('write:users');
export const CanDeleteUsers = () => Permissions('delete:users');
export const CanManageUsers = () => Permissions('read:users', 'write:users', 'delete:users');

// Team permissions
export const CanReadTeams = () => Permissions('read:teams');
export const CanWriteTeams = () => Permissions('write:teams');
export const CanDeleteTeams = () => Permissions('delete:teams');
export const CanManageTeams = () => Permissions('read:teams', 'write:teams', 'delete:teams');

// Tournament permissions
export const CanReadTournaments = () => Permissions('read:tournaments');
export const CanWriteTournaments = () => Permissions('write:tournaments');
export const CanDeleteTournaments = () => Permissions('delete:tournaments');
export const CanManageTournaments = () => Permissions('read:tournaments', 'write:tournaments', 'delete:tournaments');

// Match permissions
export const CanReadMatches = () => Permissions('read:matches');
export const CanWriteMatches = () => Permissions('write:matches');
export const CanDeleteMatches = () => Permissions('delete:matches');
export const CanManageMatches = () => Permissions('read:matches', 'write:matches', 'delete:matches');

// Player permissions
export const CanReadPlayers = () => Permissions('read:players');
export const CanWritePlayers = () => Permissions('write:players');
export const CanDeletePlayers = () => Permissions('delete:players');
export const CanManagePlayers = () => Permissions('read:players', 'write:players', 'delete:players');

// Statistics permissions
export const CanReadStatistics = () => Permissions('read:statistics');
export const CanWriteStatistics = () => Permissions('write:statistics');
