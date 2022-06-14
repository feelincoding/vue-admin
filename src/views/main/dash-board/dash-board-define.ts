import type { TrafficRequestType, ApiResponseRequest, ErrorStatsRequest, RealTimeRequest } from '@/types/DashBoardType';

export const TOTAL_TRAFFIC_PARAM: TrafficRequestType = {
  statPerd: 1440,
  statBaseUnit: 'MI',
};

export const ERROR_STATS_PARAM: ErrorStatsRequest = {
  statPerd: 1440,
  statBaseUnit: 'MI',
};

export const API_RESPONSE_PARAM: ApiResponseRequest = {
  statPerd: 1440,
};

export const REAL_TIME_PARAM: RealTimeRequest = {
  statPerd: 1440,
  sortBase: 'totCnt',
};

export function getDetailParam(baseTime: string) {
  return {
    statBaseTm: baseTime,
    statPerd: 1440,
    statBaseUnit: 'MI',
  };
}
