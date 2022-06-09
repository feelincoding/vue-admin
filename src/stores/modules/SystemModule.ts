import { AxiosClient } from '@/axios/AxiosClient';

import type { GateWayError } from '@/error/GateWayError';

import type { GateWayResponse, Data } from '@/types/GateWayResponse';
import type { SystemResponse, SystemRegisterResponse, SystemIdEdpt, SystemCheckById } from '@/types/SystemType';
import type { SearchCondition } from '@/types/SearchType';

export default class SystemModule {
  // 시스템 관리 리스트 조회
  async getSystemList(searchOption?: SearchCondition): Promise<GateWayResponse<SystemResponse[]>> {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<SystemResponse[]>>(
        '/getSystemList',
        searchOption
      );
      return Promise.resolve(response.data);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  // 시스템 관리 상세 정보
  async getSystemDetail(id: string): Promise<SystemResponse> {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<SystemResponse>>('/getSystemById', {
        systemId: id,
      });
      return Promise.resolve(response.data.value);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  // 시스템 관리 등록
  async registerSystem(data: SystemRegisterResponse): Promise<void> {
    try {
      await AxiosClient.getInstance().post<GateWayResponse<SystemResponse>>('/createSystem', data);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  // 시스템 관리 수정
  async updateSystemDetail(data: SystemResponse): Promise<void> {
    try {
      await AxiosClient.getInstance().put<GateWayResponse<SystemResponse>>('/system', data);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  // 시스템 관리 삭제
  async deleteSystem(id: string): Promise<void> {
    try {
      await AxiosClient.getInstance().delete<GateWayResponse<SystemResponse>>('/system', { systemId: id });
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  // System ID 중복 체크
  async duplicateCheck(id: string): Promise<boolean> {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<SystemCheckById>>('/systemCheckById', {
        systemId: id,
      });
      return Promise.resolve(response.data.value.isPkDuplicated);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  async getSystemIdEdptList() {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<SystemIdEdpt[]>>('/getSystemIdList');

      return Promise.resolve(response.data.value);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }
}
