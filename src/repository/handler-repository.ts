import type { HandlerGroupDetail } from '@/types/HandlerType';
import { AxiosClient } from '@/axios/AxiosClient';
import type { GateWayError } from '@/error/GateWayError';
import ErrorCode from '@/error/ErrorCodes';
import type { GateWayResponse } from '@/types/GateWayResponse';

function handleCommonError(error: GateWayError | any) {
  try {
    if (error.getErrorCode() == ErrorCode.NETWORK_ERROR) {
      console.log('NETWORK_ERROR');
    } else {
      console.log('서버통신에 실패하였습니다.');
    }
  } catch (e) {
    console.log('서버통신에 실패하였습니다.');
  }
  return Promise.reject(error);
}
export default class HandlerRepository {
  // 핸들러 Req 그룹리스트
  public reqHandlerGroupList: HandlerGroupDetail[] = [];
  async getReqHandlerGroupList() {
    try {
      // addMock('/api/getRequestHandlerGroupList', JSON.stringify(dummyReqHandlerGroupList));
      const response = await AxiosClient.getInstance().get<GateWayResponse<HandlerGroupDetail[]>>(
        '/getRequestHandlerGroupList'
      );
      return response.data.value;
    } catch (error: GateWayError | any) {
      return handleCommonError(error);
    }
  }

  // 핸들러 Res 그룹리스트
  public resHandlerGroupList: HandlerGroupDetail[] = [];
  async getResHandlerGroupList() {
    try {
      // addMock('/api/getResponseHandlerGroupList', JSON.stringify(dummyResHandlerGroupList));
      const response = await AxiosClient.getInstance().get<GateWayResponse<HandlerGroupDetail[]>>(
        '/getResponseHandlerGroupList'
      );
      return response.data.value;
    } catch (error: GateWayError | any) {
      return handleCommonError(error);
    }
  }
}
