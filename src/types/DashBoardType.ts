export interface TotalTrafficStat {
  statBaseTm: string; // 통계 기준 시각
  totCnt: number; // 전체 건수
  sucesCnt: number; // 성공 건수
  failCnt: number; // 실패 건수
}

export interface ErrorStatsType {
  statBaseTm: string; // 통계 기준 시각
  failRate: number; // 실패율
  crCnt: number; // Critical 건수
  maCnt: number; // Major 건수
  miCnt: number; // Minor 건수
}

export interface ApiResponseStatus {
  statBaseTm: string; // 통계 기준 시각
  avgResTm: number; // 평균 응답 시간
  tps: number; // TPS
}

export interface RealTimeApiStat {
  statBaseTm: string; // 통계 기준 시각
  statPerd: number; // 통계 기간
  apiStat: ApiStat[]; // API 통계
}

export interface ApiStat {
  sysId: string; // 시스템 ID
  apiId: string; // API ID
  apiDesc: string; // API 설명
  totCnt: number; // 전체 건수
  sucesCnt: number; // 성공 건수
  failCnt: number; // 실패 건수
  sucesRate: number; // 성공률
  failRate: number; // 실패률
  crCnt: number; // Critical 건수
  maCnt: number; // Major 건수
  miCnt: number; // Minor 건수
  tps: number; // TPS
  avgResTm: number; // 평균 응답 시간
}

export interface RealTimeApiStatDetail {
  statBaseDt: string; // 통계 기준 일자
  sucesCnt: number; // 성공 건수
  failCnt: number; // 실패 건수
  sucesRate: number; // 성공률
}

export interface RealTimeServiceStat {
  statBaseTm: string; // 통계 기준 시각
  statPerd: number; // 통계 기간
  svcStat: ServiceStat[];
}

export interface ServiceStat {
  svcId: string; // 서비스 ID
  svcDesc: string; // 서비스 설명
  totCnt: number; // 전체 건수
  sucesCnt: number; // 성공 건수
  failCnt: number; // 실패 건수
  sucesRate: number; // 성공률
  failRate: number; // 실패율
  crCnt: number; // Criticla 건수
  maCnt: number; // Major 건수
  miCnt: number; // Minor 건수
  tps: number; // TPS
  avgResTm: number; // 평균 응답 시간
}

export interface RealTimeServiceStatDetail {
  msgId: string;
  msgType: string;
  msgEndTime: string;
  gseTimeInterval: number;
}

export interface LastResponseType {
  statBaseTm: string; // 통계 기준 시간
  todayAvgResTm: number; // 오늘 평균 응답시간
  ystdayAvgResTm: number; // 어제 평균 응답시간
  lstWkAvgResTm: number; // 저번주 평균 응답시간
}

export interface LastTrafficType {
  statBaseTm: string; // 통계 기준 시간
  todayCnt: number; // 오늘 응답 건수
  ystdayCnt: number; // 어제 응답 건수
  lstWkCnt: number; // 저번주 응답 건수
}

export interface TrafficRequestType {
  statBaseUnit: string;
  statPerd: number;
}

export interface TotalApiDetailRequest {
  statBaseTm: string;
  statBaseUnit: string;
  statPerd: number;
}

export interface ErrorStatsDetailRequest {
  statBaseTm: string;
  statBaseUnit: string;
  statPerd: number;
}
export interface ErrorStatsRequest {
  statPerd: number;
  statBaseUnit: string;
}
export interface ApiResponseRequest {
  statPerd: number;
}

export interface RealTimeRequest {
  statPerd: number;
  sortBase: string;
}
