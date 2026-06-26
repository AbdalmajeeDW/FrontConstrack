import axios from 'axios';

const tenantApi = axios.create({
  baseURL: 'http://localhost:3000/tenant/',
});

tenantApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tenant-admin-token');
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
      localStorage.removeItem('tenant-admin-token');
      localStorage.removeItem('tenant-admin-refreshToken');
      localStorage.removeItem('tenant-admin-user');
    }

    return Promise.reject(error);
  }
);


export default tenantApi;
