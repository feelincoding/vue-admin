import { AxiosClient } from '@/axios/AxiosClient';
import type { GateWayError } from '@/error/GateWayError';
import type { GateWayResponse } from '@/types/GateWayResponse';
import type {
  ControlRequest,
  ControlDetailRequest,
  RealTimeStat,
  RealtimeServiceStatDetail,
  RealtimeApiStatDetail,
  TrafcApi,
  TrafcServices,
} from '@/types/MonitoringControlType';

export default class MonitoringControlRepository {
  async getApiList(searchOption: ControlRequest): Promise<RealTimeStat> {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<RealTimeStat>>(
        '/realtimeApiStat',
        searchOption
      );
      return Promise.resolve(response.data.value);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  async getServiceList(searchOption: ControlRequest): Promise<RealTimeStat> {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<RealTimeStat>>(
        '/realtimeServiceStat',
        searchOption
      );
      return Promise.resolve(response.data.value);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  // modal area

  // 1. 7일 그래프(모달 오른쪽), 실시간 *** 통계 상세 - 일별 트래픽 비교
  // service
  async getRealtimeServiceStatDetailList(param: ControlDetailRequest): Promise<RealtimeServiceStatDetail[]> {
    // console.log('param : ', param);
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<RealtimeServiceStatDetail[]>>(
        `/realtimeServiceStatDetail`,
        param
      );
      return Promise.resolve(response.data.value);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  // api
  async getRealtimeApiStatDetailList(param: ControlDetailRequest) {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<RealtimeApiStatDetail[]>>(
        `/realtimeApiStatDetail`,
        param
      );
      return Promise.resolve(response.data.value);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  // 2. 기준시간별 추이(모달 왼쪽),*** 트래픽 추이
  // service
  async getTrafficService(param: ControlDetailRequest) {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<TrafcServices[]>>(`/trafc/services`, param);
      return Promise.resolve(response.data.value);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  // api
  async getTrafficApi(param: ControlDetailRequest) {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<TrafcApi[]>>(`/trafc/apis`, param);
      return Promise.resolve(response.data.value);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }
  // 3. 리스트, *** 통계
}
