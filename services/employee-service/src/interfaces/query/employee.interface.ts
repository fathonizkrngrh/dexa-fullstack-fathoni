import { PaginationQuery } from './pagination.interface';

export interface EmployeeFilterQuery extends PaginationQuery {
  department?: string;
  position?: string;
  search?: string;
}
