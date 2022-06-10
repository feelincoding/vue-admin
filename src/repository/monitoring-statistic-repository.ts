import { AxiosClient } from '@/axios/AxiosClient';
import type { GateWayError } from '@/error/GateWayError';
import type { Data, GateWayResponse } from '@/types/GateWayResponse';
import type { StatResponse, ApiSearch } from '@/types/MonitoringStatisticType';

export default class MonitoringStatisticRepository {
  async getServiceList(param: object) {
    const response = await AxiosClient.getInstance()
      .get<GateWayResponse<StatResponse>>(`/stat/services`, param)
      .then((res) => {
        console.log('getServiceList response', res.data.value);
        return res.data.value;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
    return response;
  }

  async getApiList(param: object) {
    // console.log('param : ', param);
    const response = await AxiosClient.getInstance()
      .get<GateWayResponse<StatResponse>>(`/stat/apis`, param)
      .then((res) => {
        console.log('getApiList response', res.data.value);
        return res.data.value;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
    return response;
  }

  async getSearchSvcList(param?: string) {
    const response = await AxiosClient.getInstance()
      .get<GateWayResponse<string[]>>('/stat/getServiceId', {
        keyword: param ? param : '',
      })
      .then((res) => {
        console.log('getSearchSvcList response', res.data.value);
        return res.data.value;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
    return response;
  }

  async getSearchApiList(param?: string) {
    const response = await AxiosClient.getInstance().get<GateWayResponse<string[]>>('/stat/getSysIdAndApiId', {
      keyword: param ? param : '',
    });

    const list: ApiSearch[] = [];

    response.data.value.map((item: string) => {
      const [sysId, apiId] = item.split('.');
      const isInclude = list.some((item) => item.sysId === sysId);

      if (isInclude) {
        list.map((item2: ApiSearch) => {
          if (item2.sysId === sysId) {
            item2.apis.push(apiId);
          }
        });
      } else {
        list.push({
          sysId,
          apis: [apiId],
        });
      }
    });

    return list;
  }
}
