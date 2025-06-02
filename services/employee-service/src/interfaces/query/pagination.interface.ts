export interface PaginationQuery {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginationOptions {
  offset: number;
  limit: number;
}

export interface PaginationResponse<T> {
  total_items: number;
  items: T[];
  total_pages: number;
  current_page: number;
}
