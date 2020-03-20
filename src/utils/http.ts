import Axios from 'axios';

const http = Axios.create({
  baseURL: '/api',
  timeout: 1000 * 10,
});

http.interceptors.response.use((response) => {
  return response.data;
});

export default http;
