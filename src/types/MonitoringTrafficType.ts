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

export interface RequestTrafficParams {
  svcId?: string;
  apiId?: string;
  statBaseUnit: string;
  statStTm: string;
  statEndTm: string;
}
