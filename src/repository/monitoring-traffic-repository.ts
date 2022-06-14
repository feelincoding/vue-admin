import type { RequestTrafficParams, TrafficApi, TrafficService } from '@/types/MonitoringTrafficType';
import { AxiosClient } from '@/axios/AxiosClient';
import type { GateWayResponse } from '@/types/GateWayResponse';

export default class MonitoringTrafficRepository {
  public apiList: TrafficApi[] = [];
  public serviceList: TrafficService[] = [];

  async getServiceList(param: RequestTrafficParams) {
    const response = await AxiosClient.getInstance()
      .get<GateWayResponse<TrafficService[]>>(`/trafc/services`, param)
      .then((res) => {
        // console.log('response', res.data.value);
        return res.data.value;
      })
      .catch(() => {
        return Promise.reject();
      });
    return response;
  }

  async getApiList(param: RequestTrafficParams) {
    const response = await AxiosClient.getInstance()
      .get<GateWayResponse<TrafficApi[]>>(`/trafc/apis`, param)
      .then((res) => {
        return res.data.value;
      })
      .catch(() => {
        return Promise.reject();
      });
    return response;
  }
}
