import axios from 'axios';
import api from '../../tenantApi';
import {
  TenantAdminLoginCredentials,
  TenantAdminLoginResponse,
  TenantAdminUser,
} from '../../types/tenantAdminAuth.types';
import { API_ENDPOINTS_ADMIN } from '@/store/endpoints';


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tenant-admin-token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export async function login(
  credentials: TenantAdminLoginCredentials,
): Promise<TenantAdminLoginResponse> {
  const response = await api.post<TenantAdminLoginResponse>(
    `${API_ENDPOINTS_ADMIN.AUTHSUPERADMIN.LOGIN}`,
    credentials,
  );

  const { access_token, refreshToken, user } = response.data;

  localStorage.setItem('tenant-admin-token', access_token);
  if (refreshToken) {
    localStorage.setItem('tenant-admin-refreshToken', refreshToken);
  }
  localStorage.setItem('tenant-admin-user', JSON.stringify(user));

  return response.data;
}

export async function logout(): Promise<void> {
  try {
    await api.post(`${API_ENDPOINTS_ADMIN.AUTHSUPERADMIN.LOGOUT}`);
  } catch (error) {
        console.warn("Backend logout failed, forcing local logout");

  } finally {
    localStorage.removeItem('tenant-admin-token');
    localStorage.removeItem('tenant-admin-refreshToken');
    localStorage.removeItem('tenant-admin-user');
  }
}

export async function getCurrentUser(): Promise<TenantAdminUser> {
  const response = await api.get<{ user: TenantAdminUser }>(
    'auth/me',
  );
  return response.data.user;
}
