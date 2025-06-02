import { PaginationOptions, PaginationResponse } from '@interfaces/query/pagination.interface';

export const parsePagination = (page?: number, size?: number): PaginationOptions => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

export const paginateData = <T>(
  data: { count: number | any[]; rows: T[] },
  page?: number,
  limit?: number,
): PaginationResponse<T> => {
  const current_page = page ? +page : 0;
  const _limit = limit ? +limit : 10;
  const total_items = Array.isArray(data.count) ? data.count.length : data.count;
  const total_pages = Math.ceil(total_items / _limit);

  return {
    total_items,
    items: data.rows,
    total_pages,
    current_page,
  };
};
