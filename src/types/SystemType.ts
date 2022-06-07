//연동방식
export interface SystemEdptType {
  protocol: string;
  domain: string;
  port: string;
}
export interface SystemIdEdpt {
  id: string;
  edpt: string[];
}

//시스템 관리
export interface SystemResponse {
  id: string; // system id(PK)
  tkcgrNm: string; // 담당자 이름
  tkcgrPos: string; //담당자 소속
  tkcgrEml: string; //담당자 이메일
  edpt: string[]; //엔드포인트
  desc: string; //설명
  cretDt: string;
  cretId: string;
  updDt: string;
  updId: string;
}
//시스템 관리
export interface SystemRegisterResponse {
  id: string; // system id(PK)
  tkcgrNm: string; // 담당자 이름
  tkcgrPos: string; //담당자 소속
  tkcgrEml: string; //담당자 이메일
  edpt: string[]; //엔드포인트
  desc: string; //설명
  cretId: string;
  updId: string;
}
//pagination
export interface PaginationType {
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
