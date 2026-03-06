import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError  } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { getToken } from './token';
import { processErrorHandle } from './process-error-handle';

type DetailMessageType = {
  type: string;
  message: string;
  }

  const StatusCoseMapping: Record<number, boolean> = {
    [StatusCodes.BAD_REQUEST]: true,
    [StatusCodes.UNAUTHORIZED]: true,
    [StatusCodes.NOT_FOUND]: true
  }

  const shouldDisplayError = (response: AxiosResponse) => !!StatusCoseMapping[response.status];

const BACKEND_URL = 'http://localhost:5000';
const REQUEST_TIMEOUT = 5000;

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

   api.interceptors.request.use(
       (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
         const token = getToken();

        if (token) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }

         return config;
       },
        (error) => {
            return Promise.reject(error);
        }
     );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<DetailMessageType>) => {
      if (error.response && shouldDisplayError(error.response)) {
        const detailMessage = (error.response.data);

        processErrorHandle(detailMessage.message);
      }
      throw error;
    }
  );

  return api;
};