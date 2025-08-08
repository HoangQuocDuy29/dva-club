// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: Date;
}

// Pagination interfaces
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// File upload types
export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  size: number;
  buffer: Buffer;
}

export interface UploadedFile {
  id: number;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedBy: number;
  uploadedAt: Date;
}

// Search and filter base
export interface BaseFilters {
  search?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SortOptions {
  field: string;
  order: 'ASC' | 'DESC';
}

// System settings
export interface SystemConfig {
  id: number;
  key: string;
  value: string;
  description?: string;
  isActive: boolean;
  updatedBy: number;
  updatedAt: Date;
}

// Error response
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: Date;
  path?: string;
}

// Audit log
export interface AuditLog {
  id: number;
  userId: number;
  action: string;
  resource: string;
  resourceId?: number;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}
