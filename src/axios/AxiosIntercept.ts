import ErrorCode from '@/error/ErrorCodes';
import Axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const axios = Axios.create({
  baseURL: 'http://ec2-43-200-30-176.ap-northeast-2.compute.amazonaws.com:8080/mngt/v1/',
  // baseURL: 'http://localhost:8080/mngt/v1/',
  // baseURL: 'http://platform-digico.com:8080/mngt/v1/',
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    Authorization: 'Basic QU5EOnNhZmUyZ29fYW5k',
  },
  // withCredentials: true,
});

axios.defaults.paramsSerializer = function (paramObj) {
  const params = new URLSearchParams();
  for (const key in paramObj) {
    params.append(key, paramObj[key]);
  }

  return params.toString();
};

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.request.use(
  async (config) => {
    if (config.headers === undefined) {
      config.headers = {
        Accept: 'application/json',
        Authorization: 'Basic QU5EOnNhZmUyZ29fYW5k',
        Session:
          sessionStorage.getItem('session_token') != undefined ? String(sessionStorage.getItem('session_token')) : '',
      };
    } else {
      config.headers.Session =
        sessionStorage.getItem('session_token') != undefined ? String(sessionStorage.getItem('session_token')) : '';
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axios;
