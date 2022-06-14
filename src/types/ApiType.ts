import type { GateWayResponse, Pagination } from './GateWayResponse';

export const dummyPagination: Pagination = {
  page: 1,
  size: 10,
  totalElements: 13,
  totalPage: 2,
  currentElements: 10,
  currentPage: 1,
  orderBy: 'ID',
  sortBy: 'DESC',
  limit: 10,
};
export interface ApiDetailResponse {
  id: string;
  sysId: string;
  ifNo: string;
  meth: string[];
  uriIn: string;
  uriOut: string;
  ifGrp: string;
  reqHndlrGrpId: string;
  resHndlrGrpId: string;
  timeOut: number;
  desc: string | null;
  cretDt: string;
  cretId: string | null;
  updDt: string;
  updId: string | null;
}
// [x:string ] => confirm 출력용으로 사용
export interface ApiCreateRequestBody {
  [x: string]: any;
  id: string;
  sysId: string;
  meth: string[];
  uriIn: string;
  uriOut: string;
  reqHndlrGrpId: string;
  resHndlrGrpId: string;
  timeOut: number;
  desc: string | null;
}

export interface ApiUpdateRequestBody {
  id: string;
  sysId: string;
  ifNo: string;
  meth: string[];
  uriIn: string;
  uriOut: string;
  reqHndlrGrpId: string;
  resHndlrGrpId: string;
  timeOut: number;
  desc: string | null;
}

export interface RequsetPagenation {
  page?: number;
  size?: number;
  total_elements?: number;
  total_pages?: number;
  current_elements?: number;
  current_page?: number;
  order_by?: string;
  sort_by?: string;
  limit?: number;
}
export interface ApiSearchQuery extends RequsetPagenation {
  id?: string;
  nm?: string;
  uri?: string;
}

export interface ApiSearchLabel {
  [key: string]: string;
}

export interface ResponseApiIdValidCheck {
  isPkDuplicated: boolean;
}
