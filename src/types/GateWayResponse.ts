export interface GateWayResponse<T> {
  common: Common;
  data: Data<T>;
}
export interface Common {
  code: number;
  message: string;
}
export interface Data<T> {
  pagination?: Pagination;
  value: T;
}
export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPage: number;
  currentElements: number;
  currentPage: number;
  orderBy: string;
  sortBy: string;
  limit: number;
}
