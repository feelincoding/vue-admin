export interface StatResponse {
  totCnt: number; // 전체 건수
  sucesCnt: number; // 성공 건수
  failCnt: number; // 실패 건수
  sucesRate: number; // 성공율
  trafcStTm: string; // 트래픽 시작 시각
  trafcEndTm: string; // 트래픽 종료 시각
  svcStat?: StatiSvcStat[]; // 서비스 통계
  apiStat?: StatiApiStat[]; // API 통계
}

export interface StatiSvcStat {
  id: number; // id(pk)
  svcId: string; // 서비스 ID
  statBaseUnit: string; // 통계 범위
  statBaseTm: string; // 통계 범위 시작 시각
  totCnt: number; // 전체 건수
  sucesCnt: number; // 성공 건수
  failCnt: number; // 실패 건수
  resTmTot: number; // 응답 시간 합계
  stTrafcTm: string; // 트래픽 시작 시각
  lastTrafcTm: string; // 트래픽 종료 시각
  lastTrafcTxId: string; // 트래픽 종료 트랜잭션 ID
  sumYn: string; // 합계 여부
  cretDt: string; // 생성 시각
  sucesRate: number; // 성공율
  apiStat: StatiApiStat[]; // API 통계
}

export interface StatiApiStat {
  id: number; // id(pk)
  svcTrafcStatId: number; // 서비스 트래픽 통계 ID
  sysId: string; // 시스템 ID
  apiId: string; // API ID
  totCnt: number; // 전체 건수
  sucesCnt: number; // 성공 건수
  failCnt: number; // 실패 건수
  resTmTot: number; // 응답 시간 합계
  stTrafcTm: string; // 트래픽 시작 시각
  lastTrafcTm: string; // 트래픽 종료 시각
  lastTrafcTxId: string; // 트래픽 종료 트랜잭션 ID
  cretDt: string; // 생성 시각
  sucesRate: number; // 성공율
  rsltStat: ApiRsltStat[]; // 결과 통계
}

export interface ApiRsltStat {
  id: number; // id(pk)
  apiTrafcStatId: number; // API 트래픽 통계 ID
  rsltType: string; // 결과 유형
  totCnt: number; // 전체 건수
  resTmTot: number; // 응답 시간 합계
  stTrafcTm: string; // 트래픽 시작 시각
  lastTrafcTm: string; // 트래픽 종료 시각
  lastTrafcTxId: string; // 트래픽 종료 트랜잭션 ID
  cretDt: string; // 생성 시각
  errStat: ApiErrStat[]; // 에러 통계
}

export interface ApiErrStat {
  id: number; // id(pk)
  rsltTrafcStatId: number; // 결과 트래픽 통계 ID
  errLevel:string; // 에러 레벨
  errCd: string; // 에러 코드
  errMsg: string; // 에러 메시지
  totCnt: number; // 전체 건수
  resTmTot: number; // 응답 시간 합계
  stTrafcTm: string; // 트래픽 시작 시각
  lastTrafcTm: string; // 트래픽 종료 시각
  lastTrafcTxId: string; // 트래픽 종료 트랜잭션 ID
  cretDt: string; // 생성 시각
}

export interface ApiSearch {
  sysId: string; // 시스템 ID
  apis: string[]; // API ID 목록
}
