export interface ServiceStat {
  id: string;
  apiStatList: ApiStat[];
}

export interface ApiStat {
  id: string;
  sysId: string;
  success: number;
  fail: number;
}
