import { AxiosClient } from '@/axios/AxiosClient';
import type { GateWayError } from '@/error/GateWayError';
import type { GateWayResponse } from '@/types/GateWayResponse';
import type {
  TotalTrafficStat,
  TrafficRequestType,
  TotalApiDetailRequest,
  ErrorStatsType,
  ErrorStatsRequest,
  ErrorStatsDetailRequest,
  ApiResponseRequest,
  ApiResponseStatus,
  RealTimeApiStat,
  RealTimeServiceStat,
} from '@/types/DashBoardType';
export default class DashBoardRepository {
  public totaltrafficDetail: TotalTrafficStat[] = [];

  async getTotalAPITraffic(param: TrafficRequestType) {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<TotalTrafficStat>>(
        `/getDashboardTrafficStat`,
        param
      );
      return Promise.resolve(response.data);
    } catch (error: GateWayError | any) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  async getTrafficStatDetail(param: TotalApiDetailRequest) {
    const response = await AxiosClient.getInstance()
      .get<GateWayResponse<TotalTrafficStat[]>>(`/getDashboardTrafficStatDetail`, param)
      .then((res) => {
        return res.data.value;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
    return response;
  }

  async getErrorStats(param: ErrorStatsRequest) {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<ErrorStatsType>>(
        `/getDashboardErrorStat`,
        param
      );
      return Promise.resolve(response.data);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  async getErrorStatsDetail(param: ErrorStatsDetailRequest) {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<ErrorStatsType>>(
        `/getDashboardErrorStatDetail`,
        param
      );
      return Promise.resolve(response.data);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  async getApiResponseStatus(param: ApiResponseRequest) {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<ApiResponseStatus>>(
        `/getDashboardTrafficStus`,
        param
      );
      return Promise.resolve(response.data);
      // this.context.commit('setApiResponseStatus', response.data.value);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  async getApiResponseStatusDetail(param: object) {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<ApiResponseStatus[]>>(
        `/getDashboardTrafficStusDetail`,
        param
      );
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  async getRealTimeApiStat(param: { statPerd: number; sortBase: string; retvCnt?: number }) {
    if (!param.retvCnt) {
      try {
        const response = await AxiosClient.getInstance().get<GateWayResponse<RealTimeApiStat>>(
          `/realtimeApiStat`,
          param
        );
        console.log('ccs1', response.data.value);

        return Promise.resolve(response.data);
      } catch (error: GateWayError | any) {
        return Promise.reject(error);
      }
    } else {
      try {
        const response = await AxiosClient.getInstance().get<GateWayResponse<RealTimeApiStat>>(
          `/realtimeApiStat`,
          param
        );
        return Promise.resolve(response.data);
      } catch (error: GateWayError | any) {
        return Promise.reject(error);
      }
    }
  }

  async getRealTimeServiceStat(param: { statPerd: number; sortBase: string; retvCnt?: number }) {
    if (!param.retvCnt) {
      try {
        const response = await AxiosClient.getInstance().get<GateWayResponse<RealTimeServiceStat>>(
          `/realtimeServiceStat`,
          param
        );
        console.log('ccs2', response.data.value);
        return Promise.resolve(response.data);
      } catch (error: GateWayError | any) {
        return Promise.reject(error);
      }
    } else {
      try {
        const response = await AxiosClient.getInstance().get<GateWayResponse<RealTimeServiceStat>>(
          `/realtimeServiceStat`,
          param
        );
        return Promise.resolve(response.data);
      } catch (error: GateWayError | any) {
        return Promise.reject(error);
      }
    }
  }
}
