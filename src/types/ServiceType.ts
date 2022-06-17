export interface ApiAuthResponse {
  sysId: string;
  apiId: string[];
}

interface AuthResponse {
  basic: BasicAuthDetail;
  jwt: JWTDetail;
}
interface BasicAuthDetail {
  id: string;
  pw: string;
}

interface JWTDetail {
  alg: string;
  iss: string;
  aud: string;
  pubKey: string;
}
export interface ServiceResponse {
  id: string;
  tkcgrNm: string | null;
  tkcgrPos: string | null;
  tkcgrEml: string | null;
  svcStDt: string;
  svcEndDt: string;
  athnType: string;
  athn: AuthResponse;
  sla: { sec: number | null; min: number | null; hr: number | null; day: number | null; mon: number | null };
  apiAut: ApiAuthResponse[];
  desc: string;
  cretDt: string;
  updDt: string;
  cretId: string;
  updId: string;
}
export interface BasicAuthResponse {
  id: string;
  pw: string;
}

export interface duplicatedCheck {
  isPkDuplicated: boolean;
}
export interface ServiceRegisterRequest {
  id: string;
  tkcgrNm: string | null;
  tkcgrPos: string | null;
  tkcgrEml: string | null;
  svcStDt: string;
  svcEndDt: string;
  athnType: string;
  athn: AuthResponse;
  sla: { sec: number | null; min: number | null; hr: number | null; day: number | null; mon: number | null };
  apiAut: ApiAuthResponse[];
  desc: string;
}

export interface ServiceModifyRequest {
  id: string;
  tkcgrNm: string | null;
  tkcgrPos: string | null;
  tkcgrEml: string | null;
  svcStDt: string;
  svcEndDt: string;
  athnType: string;
  athn: AuthResponse;
  sla: { sec: number | null; min: number | null; hr: number | null; day: number | null; mon: number | null };
  apiAut: ApiAuthResponse[];
  desc: string;
  updId: string;
}
