export interface UserResponse {
  id: string; // id
  pwd: string; // 비밀번호
  pwdConfirm?: string; // 비밀번호 확인
  nm: string; // 이름
  pos: string; // 소속
  eml: string; // 이메일
  tel: string; // 전화번호
  sttus: string; // 상태
  autId: string; // 권한 id
  stpltId: string; // 약관 id
  stpltAgreeDt: string; //약관 동의 일시
  lastLoginDt: string; // 마지막 로그인 일시
  lastLoginFailDt: string; // 마지막 로그인 실패 일시
  loginFailCnt: number; // 로그인 실패 건수
  cretDt: string; // 생성 일자
  updDt: string; // 갱신 일자
  cretId: string; // 생성 id
  updId: string; // 갱신 id
}

// 사용자 권한
export interface UserAuth {
  [menu: string]: AuthDtl;
}

// 사용자 권한 상세
export interface AuthDtl {
  isShow: boolean; // 노출 여부
  action?: AuthAction; // CRUD 접근 권한 정보
}

// 사용자 접근 권한
export interface AuthAction {
  isView?: boolean; //조회 권한 여부
  isEdit?: boolean; //수정 권한 여부
  isDelete?: boolean; //삭제 권한 여부
}

// 로그인 성공 시 사용자 정보
export interface LoginUserResponse {
  userInfo: UserResponse; // 사용자 정보
  session: string; // 세션
  autDtl: UserAuth; // 사용자 권한
}

export interface StipulationResponse {
  id: string; // id
  stpltType: string; // 약관 유형
  stpltSbst: string[]; // 약관 내용
  cretDt: string; // 생성 일자
  updDt: string; // 갱신 일자
  cretId: string; // 생성 id
  updId: string; // 갱신 id
}
