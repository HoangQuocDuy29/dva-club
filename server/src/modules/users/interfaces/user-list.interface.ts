import { UserResponse } from './user-response.interface';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FilterMeta {
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  appliedFilters: {
    total: number;
    filters: string[];
  };
}

export interface UserListResponse {
  data: UserResponse[];
  pagination: PaginationMeta;
  filters: FilterMeta;
  summary: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    roleDistribution: {
      [role: string]: number;
    };
  };
}

export interface UserSearchResponse {
  data: UserResponse[];
  searchMeta: {
    keyword: string;
    resultsCount: number;
    searchFields: string[];
    suggestions?: string[];
  };
  pagination: PaginationMeta;
}
