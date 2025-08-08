export interface MediaFile {
  id: number;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  description?: string;
  uploadedBy: number;
  uploadedAt: Date;
  createdAt: Date;
}

export interface PlayerPhoto {
  id: number;
  playerId: number;
  mediaFileId: number;
  type: 'avatar' | 'action' | 'profile';
  isMain: boolean;
  displayOrder?: number;
  createdAt: Date;
}

export interface TeamLogo {
  id: number;
  teamId: number;
  mediaFileId: number;
  type: 'logo' | 'banner' | 'uniform';
  isActive: boolean;
  createdAt: Date;
}

export interface TournamentMedia {
  id: number;
  tournamentId: number;
  mediaFileId: number;
  type: 'logo' | 'banner' | 'poster' | 'gallery';
  displayOrder?: number;
  isActive: boolean;
  createdAt: Date;
}

export interface MatchMedia {
  id: number;
  matchId: number;
  mediaFileId: number;
  type: 'photo' | 'video' | 'highlight';
  title?: string;
  description?: string;
  displayOrder?: number;
  createdAt: Date;
}

// DTOs and utilities
export interface MediaUploadDto {
  file: File | Buffer;
  type: 'image' | 'video' | 'document';
  category: 'player' | 'team' | 'tournament' | 'match';
  entityId?: number;
  alt?: string;
  description?: string;
}

export interface MediaFilters {
  type?: 'image' | 'video' | 'document';
  category?: 'player' | 'team' | 'tournament' | 'match';
  uploadedBy?: number;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface MediaStats {
  totalFiles: number;
  totalSize: number;
  imageCount: number;
  videoCount: number;
  documentCount: number;
}
