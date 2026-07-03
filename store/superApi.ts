import axios from "axios";

const API_BASE_URL_SUPER= "http://187.124.0.42:3007/super/";

const api = axios.create({
  baseURL: API_BASE_URL_SUPER,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;
