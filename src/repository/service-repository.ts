import { AxiosClient } from '@/axios/AxiosClient';
import { GateWayError } from '@/error/GateWayError';
import { GateWayResponse } from '@/types/GateWayResponse';
import { ServiceResponse } from '@/types/ServiceType';

export default class ServiceRespository {
  async getServiceList(searchOption?: object): Promise<GateWayResponse<ServiceResponse[]>> {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<ServiceResponse[]>>('/getServiceList', {
        ...searchOption,
      });

      return Promise.resolve(response);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }
}
