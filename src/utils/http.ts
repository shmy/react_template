import Axios from 'axios';
import {message as AntMessage} from 'antd';
import {logout} from "@/utils/history";

const http = Axios.create({
  baseURL: '/api',
  timeout: 1000 * 10,
});


interface ResponseError {
  showAlert: () => void;
}
export type AfterResponse<T> = T | ResponseError

const _createError = message => {
  const err = new Error(message);
  // @ts-ignore
  err.showAlert = function() {
    AntMessage.error(this.message)
  };
  return err
};
http.interceptors.request.use((request) => {
  const token = window.localStorage.getItem('token');
  if (token) {
    request.headers['Authorization'] = "Bearer " + token;
  }
  return request;
});
http.interceptors.response.use((response) => response.data, error => {
  let message = error.message;
  if (error.response) {
    if (error.response.status === 401) {
      AntMessage.warning("请重新登录");
      logout();
    }
    message = error.response.data.msg
  }
  return Promise.reject(_createError(message));
});

export default http;
export const isHttpError = (error: any) => {
  return error instanceof Error || !!error.showAlert;
};
