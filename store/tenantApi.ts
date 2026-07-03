import axios from 'axios';

const tenantApi = axios.create({
  baseURL: 'http://187.124.0.42:3007/tenant/',
});

tenantApi.interceptors.request.use(
  (config) => {
  
    const tenantToken = localStorage.getItem('tenant-token');
    const token = tenantToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
tenantApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tenant-token');
      localStorage.removeItem('tenant-refreshToken');
      localStorage.removeItem('tenant-user');
      localStorage.removeItem('tenant-token');
      localStorage.removeItem('tenant-refreshToken');
      localStorage.removeItem('tenant-user');
    }

    return Promise.reject(error);
  }
);


export default tenantApi;
