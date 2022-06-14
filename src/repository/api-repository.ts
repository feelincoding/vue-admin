import type { GateWayResponse, Pagination } from '@/types/GateWayResponse';
import type {
  ApiSearchQuery,
  ApiDetailResponse,
  ResponseApiIdValidCheck,
  ApiUpdateRequestBody,
  ApiCreateRequestBody,
} from '@/types/ApiType';
import { AxiosClient } from '@/axios/AxiosClient';
import type { GateWayError } from '@/error/GateWayError';

interface ApiListResponse {
  apiList: ApiDetailResponse[];
  pagination: Pagination | undefined;
}
export default class ApiRepository {
  //api 리스트 요청

  public apiList: ApiDetailResponse[] = [];
  public apiDetail: ApiDetailResponse | null = null;
  public apiPagination: Pagination = {} as Pagination;

  // 초기화

  // api 리스트 요청

  async getApiList(searchQuery?: ApiSearchQuery): Promise<ApiListResponse> {
    try {
      const response: GateWayResponse<ApiDetailResponse[]> = await AxiosClient.getInstance().get<
        GateWayResponse<ApiDetailResponse[]>
      >('/getApiList', searchQuery);
      return {
        apiList: response.data.value,
        pagination: response.data.pagination,
      };
    } catch (error: GateWayError | any) {
      return Promise.reject(error);

      // 디테일 에러 처리
    }
  }

  //api 상세 요청
  async getApiDetail(query: { id: string; sysId: string }) {
    try {
      const response = await AxiosClient.getInstance().get<GateWayResponse<ApiDetailResponse>>(
        '/getApiByIdAndSysId',
        query
      );
      return response.data.value;
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  // API 생성
  async postApi(api: ApiCreateRequestBody) {
    try {
      await AxiosClient.getInstance().post<GateWayResponse<ApiDetailResponse>>('/createApi', api);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  // Api 수정
  async putApi(api: ApiUpdateRequestBody) {
    try {
      await AxiosClient.getInstance().put<GateWayResponse<ApiDetailResponse>>('/api', api);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  // Api 삭제
  async deleteApi(query: { id: string; sysId: string }) {
    try {
      await AxiosClient.getInstance().delete<GateWayResponse<ApiDetailResponse[]>>('/api', query);
    } catch (error: GateWayError | any) {
      return Promise.reject(error);
    }
  }

  // 페이지네이션
}

// 중복 체크
export const apiValidationCheck = async (id: string, sysId: string) => {
  try {
    const response = await AxiosClient.getInstance().get<GateWayResponse<ResponseApiIdValidCheck>>(
      '/apiCheckByIdAndSysId',
      { id, sysId }
    );
    return response.data.value.isPkDuplicated as boolean;
  } catch (error: GateWayError | any) {
    return Promise.reject(error);
  }
};
