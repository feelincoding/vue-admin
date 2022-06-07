export interface EachService {
  statPerd: number; // 통계 기준 시간
  svcId: string; // 서비스 ID
  svcDesc: string; // 서비스 설명
  totCnt: number; // 전체 서비스 건수
  sucesCnt: number; // 성공 건수
  failCnt: number; // 실패 건수
  sucesRate: number; // 성공율
  failRate: number; // 실패율
  crCnt: number; // Critical 건수
  maCnt: number; // Major 건수
  miCnt: number; // Minor 건수
  tps: number; // TPS
  avgResTm: number; // 평균 응답시간
  apiList: EachApi[]; // API 리스트
}

export interface EachApi {
  statPerd: number; // 통계 기준 시간
  sysId: string; // 시스템 ID
  apiId: string; // Api ID
  apiDesc: string; // Api 설명
  totCnt: number; // 전체 서비스 건수
  sucesCnt: number; // 성공 건수
  failCnt: number; // 실패 건수
  sucesRate: number; // 성공율
  failRate: number; // 실패율
  crCnt: number; // Critical 건수
  maCnt: number; // Major 건수
  miCnt: number; // Minor 건수
  tps: number; // TPS
  avgResTm: number; // 평균 응답시간
}

// 관제 api request type
export interface ControlRequest {
  statPerd: number;
  sortBase: string;
  retvCnt?: number;
}

// 관제 api detail props type
export interface apiStatDetailProps {
  msgId: string;
  msgType: string;
  msgEndTime: string;
  msgTimeInterval: number;
}

// 관제 api response type
export interface EachResponse {
  statPerd: number; // 통계 기준 시간
  svcId?: string; // 서비스 ID
  sysId?: string; // 시스템 ID
  apiId?: string; // API ID
  svcDesc?: string; // 서비스 설명
  apiDesc?: string; // API 설명
  totCnt: number; // 전체 서비스 건수
  sucesCnt: number; // 성공 건수
  failCnt: number; // 실패 건수
  sucesRate: number; // 성공율
  failRate: number; // 실패율
  crCnt: number; // Critical 건수
  maCnt: number; // Major 건수
  miCnt: number; // Minor 건수
  tps: number; // TPS
  avgResTm: number; // 평균 응답시간
  apiList?: EachApi[]; // API 리스트
}

// echart Line serise format type
export interface FormatterType {
  componentType: 'series';
  seriesType: string;
  seriesIndex: number;
  seriesName: string;
  name: string;
  dataIndex: number;
  data: object;
  value: number | object;
  encode: object;
  dimensionNames: Array<string>;
  dimensionIndex: number;
  color: string;
}

// 서비스 stat type
export interface ServiceStat {
  svcId: string; // 서비스 ID
  svcDesc: string; // 서비스 설명
  totCnt: number; // 전체 서비스 건수
  sucesCnt: number; // 성공 건수
  failCnt: number; // 실패 건수
  sucesRate: number; // 성공율
  failRate: number; // 실패율
  crCnt: number; // Critical 건수
  maCnt: number; // Major 건수
  miCnt: number; // Minor 건수
  tps: number; // TPS
  avgResTm: number; // 평균 응답시간
}

// api stat type
export interface ApiStat {
  sysId: string; // 시스템 ID
  apiId: string; // Api ID
  apiDesc: string; // Api 설명
  totCnt: number; // 전체 서비스 건수
  sucesCnt: number; // 성공 건수
  failCnt: number; // 실패 건수
  sucesRate: number; // 성공율
  failRate: number; // 실패율
  crCnt: number; // Critical 건수
  maCnt: number; // Major 건수
  miCnt: number; // Minor 건수
  tps: number; // TPS
  avgResTm: number; // 평균 응답시간
}

// 실시간 통계 조회 response
export interface RealTimeStat {
  statBaseTm: string; // 통계 기준 시각
  statPerd: number; // 통계 기간
  svcStat?: ServiceStat[]; // 서비스 stat
  apiStat?: ApiStat[]; // api stat
}

// 실시간 서비스 통계 상세 - 일별 트래픽 비교 (GET), Response
export interface RealtimeServiceStatDetail {
  statBaseDt: string; // 통계 기준 일자
  totCnt: number; // 전체 건수
  sucesCnt: number; // 성공 건수
  failCnt: number; // 실패 건수
}
export interface RealtimeApiStatDetail {
  statBaseDt: string; // 통계 기준 일자
  totCnt: number; // 전체 건수
  sucesCnt: number; // 성공 건수
  failCnt: number; // 실패 건수
}
// 서비스 트래픽 추이(GET), Response
export interface TrafcServices {
  statBaseTm: string; // 통계 기준 시각
  svcId: string; // 서비스 ID
  totCnt: number; // 전체 건수
  sucesCnt: number; // 성공 건수
  failCnt: number; // 실패 건수
}
export interface TrafcApi {
  statBaseTm: string; // 통계 기준 시각
  sysId: string; // sys ID
  apiId: string; // api ID
  totCnt: number; // 전체 건수
  sucesCnt: number; // 성공 건수
  failCnt: number; // 실패 건수
}
// 서비스 통계, Response -> 통계쪽 가져다 쓰자
//
export interface TrafficService {
  svcId: string;
  svcTrafc: ServiceTrafc[];
}
export interface ServiceTrafc {
  statBaseTm: string;
  totCnt: number;
  sucesCnt: number;
  failCnt: number;
}

export interface TrafficApi {
  apiId: string;
  apiTrafc: ApiTrafc[];
}

export interface ApiTrafc {
  statBaseTm: string;
  totCnt: number;
  sucesCnt: number;
  failCnt: number;
}