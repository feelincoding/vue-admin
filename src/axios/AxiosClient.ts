import axios from '@/axios/AxiosIntercept';
import Axios, { CancelTokenSource } from 'axios';
import { GateWayError } from '@/error/GateWayError';
import ErrorCode from '@/error/ErrorCodes';
import { GateWayResponse } from '@/types/GateWayResponse';
import { AxiosResponse } from 'axios';

import router from '@/router/index';
import modal from '@/plugins/modal/ModalPlugin';

export class AxiosClient {
  private static instance: AxiosClient;
  source: CancelTokenSource | null = null;

  public static getInstance(): AxiosClient {
    if (!AxiosClient.instance) {
      AxiosClient.instance = new AxiosClient();
    }
    return AxiosClient.instance;
  }

  public async get<T>(url: string, query?: any) {
    const cancelToken = Axios.CancelToken;
    this.source = cancelToken.source();

    try {
      const response: AxiosResponse = await axios.get<T>(url, {
        params: query,
        cancelToken: this.source.token,
      });

      if (response.data.common.code != 200) {
        return Promise.reject(new GateWayError(response.data.common.code));
      } else {
        return response.data;
      }
    } catch (error: Error | any) {
      if (Axios.isCancel(error)) {
        return Promise.reject(new GateWayError(ErrorCode.CANCEL_ERROR));
      } else {
        if (!error.response) {
          throw new GateWayError(ErrorCode.NETWORK_ERROR);
        } else {
          if (error.response.status == ErrorCode.SESSION_ERROR) {
            router.push({
              name: 'login',
              params: {
                error_code: 'UNAUTHORIZED',
              },
            });
          } else {
            throw new GateWayError(error.response.status);
          }
        }
      }
    }
  }

  public async post<T>(url: string, data: any): Promise<GateWayResponse<T>> {
    const cancelToken = Axios.CancelToken;
    this.source = cancelToken.source();

    try {
      const response: AxiosResponse = await axios.post<T>(url, data, {
        cancelToken: this.source.token,
      });

      if (response.data.common.code != 200) {
        return Promise.reject(new GateWayError(response.data.common.code));
      } else {
        return response.data;
      }
    } catch (error: Error | any) {
      console.log('post error', error);
      if (!error.response) {
        throw new GateWayError(ErrorCode.NETWORK_ERROR);
      } else {
        if (error.response.status == ErrorCode.SESSION_ERROR) {
          router.push({
            name: 'login',
            params: {
              error_code: 'UNAUTHORIZED',
            },
          });
        }
        throw new GateWayError(error.response.status);
      }
    }
  }

  public async put<T>(url: string, data: any): Promise<GateWayResponse<T>> {
    const cancelToken = Axios.CancelToken;
    this.source = cancelToken.source();

    try {
      const response: AxiosResponse = await axios.put<T>(url, data, { cancelToken: this.source.token });

      if (response.data.common.code != 200) {
        return Promise.reject(new GateWayError(response.data.common.code));
      } else {
        return response.data;
      }
    } catch (error: Error | any) {
      if (!error.response) {
        throw new GateWayError(ErrorCode.NETWORK_ERROR);
      } else {
        if (error.response.status == ErrorCode.SESSION_ERROR) {
          router.push({
            name: 'login',
            params: {
              error_code: 'UNAUTHORIZED',
            },
          });
        }
        throw new GateWayError(error.response.status);
      }
    }
  }

  public async delete<T>(url: string, query?: any): Promise<GateWayResponse<T>> {
    const cancelToken = Axios.CancelToken;
    this.source = cancelToken.source();

    try {
      const response: AxiosResponse = await axios.delete<T>(url, {
        params: query,
        cancelToken: this.source.token,
      });

      if (response.data.common.code != 200) {
        return Promise.reject(new GateWayError(response.data.common.code));
      } else {
        return response.data;
      }
    } catch (error: Error | any) {
      if (!error.response) {
        throw new GateWayError(ErrorCode.NETWORK_ERROR);
      } else {
        if (error.response.status == ErrorCode.SESSION_ERROR) {
          router.push({
            name: 'login',
            params: {
              error_code: 'UNAUTHORIZED',
            },
          });
        }
        throw new GateWayError(error.response.status);
      }
    }
  }

  public cancel() {
    if (this.source != null) {
      this.source.cancel();
    }
  }
}
