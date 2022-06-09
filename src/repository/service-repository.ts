import { AxiosClient } from '@/axios/AxiosClient';
import type { GateWayError } from '@/error/GateWayError';
import type { Data, GateWayResponse } from '@/types/GateWayResponse';
import type { SearchCondition } from '@/types/SearchType';
import type {
  ServiceResponse,
  ServiceRegisterRequest,
  duplicatedCheck,
  BasicAuthResponse,
  ApiAuthResponse,
  ServiceModifyRequest,
} from '@/types/ServiceType';

export default class ServiceRespository {
  //서비스 리스트 요청
  async getServiceList(searchOption?: SearchCondition) {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<ServiceResponse[]>>(
        '/getServiceList',
        searchOption
      );

      return Promise.resolve(response.data);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  //서비스 요청
  async getService(id: string) {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<ServiceResponse>>(`/getServiceById`, {
        id: id,
      });
      return Promise.resolve(response.data);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  //서비스 생성 요청
  async createService(data: ServiceRegisterRequest) {
    try {
      await AxiosClient.getInstance().post<GateWayResponse<ServiceResponse>>('/createServiceMngt', data);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  //서비스 수정 요청
  async editService(data: ServiceModifyRequest) {
    try {
      await AxiosClient.getInstance().put<GateWayResponse<ServiceModifyRequest>>('/service', data);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  //서비스ID 중복성 검사
  async getDuplicatedCheckId(id: string) {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<duplicatedCheck>>(`/serviceCheckById`, {
        id: id,
      });
      return Promise.resolve(response.data);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  //인증수단 BasicAuth ID, PW 요청
  async getBasicAuth(id: string) {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<BasicAuthResponse>>('/createAuthIdAndPwd', {
        id: id,
      });
      return Promise.resolve(response.data);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  //인증수단 JWT 알고리즘 요청
  async getJWTAlg() {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<string[]>>('/getAlgList');
      return Promise.resolve(response.data);
    } catch (error: GateWayError | any) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  //API 인증 권한 관리 리스트 요청
  async getApiAuthList() {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<ApiAuthResponse[]>>('/getApiAuthList');
      return Promise.resolve(response.data);
    } catch (error: GateWayError | any) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  //서비스 삭제 요청
  async deleteService(id: string) {
    try {
      await AxiosClient.getInstance().delete<GateWayResponse<null>>(`/service`, { id: id });
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }
}
