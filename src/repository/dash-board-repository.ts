import { AxiosClient } from '@/axios/AxiosClient';
import type { GateWayError } from '@/error/GateWayError';
import type { GateWayResponse } from '@/types/GateWayResponse';
import type { TotalTrafficStat, TrafficRequestType, TotalApiDetailRequest } from '@/types/DashBoardType';
export default class DashBoardRepository {
  public totaltrafficDetail: TotalTrafficStat[] = [];

  async getTotalAPITraffic(param: TrafficRequestType) {
    const response = await AxiosClient.getInstance()
      .get<GateWayResponse<TotalTrafficStat>>(`/getDashboardTrafficStat`, param)
      .then((res) => {
        console.log('!!!!!');
        console.log(res.data.value);
        console.log(typeof res.data.value);
        return Promise.resolve(res.data);
      })
      .catch((err) => {
        console.log('!!!!!');
        return Promise.reject(err);
      });
  }

  async getTrafficStatDetail(param: TotalApiDetailRequest) {
    const response = await AxiosClient.getInstance()
      .get<GateWayResponse<TotalTrafficStat[]>>(`/getDashboardTrafficStatDetail`, param)
      .then((res) => {
        console.log('getTrafficStatDetail response', res.data.value);
        return res.data.value;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
    return response;
  }
}
