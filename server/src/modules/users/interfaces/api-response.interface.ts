export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
  path?: string;
  statusCode?: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
  path: string;
  details?: ValidationError[];
  stack?: string; // Only in development
}

export interface ValidationError {
  field: string;
  value: any;
  constraints: {
    [constraint: string]: string;
  };
}

export interface ApiSuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiListResponse<T = any> extends ApiSuccessResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    filters?: {
      [key: string]: any;
    };
  };
}

export interface ApiFileUploadResponse extends ApiSuccessResponse<{
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
}> {}
