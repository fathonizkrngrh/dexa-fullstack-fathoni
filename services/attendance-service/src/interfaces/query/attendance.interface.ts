import { PaginationQuery } from './pagination.interface';

export interface AttendanceFilterQuery extends PaginationQuery {
  date_from?: string;
  date_to?: string;
}
