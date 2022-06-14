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

export interface RequestTrafficAPIParams {
  apiId: string[];
  statBaseUnit: string;
  statStTm: string;
  statEndTm: string;
}

export interface RequestTrafficServiceParams {
  svcId: string[];
  statBaseUnit: string;
  statStTm: string;
  statEndTm: string;
}
