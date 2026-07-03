import api from '../../tenantApi';
import {
  TenantLoginCredentials,
  TenantAdminLoginResponse,
  TenantAdminUser,
} from '../../types/tenantAdminAuth.types';
import { API_ENDPOINTS_ADMIN } from '@/store/endpoints';
import { clearAllSessions } from '@/utils/auth';


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
  credentials: TenantLoginCredentials,
): Promise<TenantAdminLoginResponse> {
  clearAllSessions();

  const response = await api.post<TenantAdminLoginResponse>(
    `${API_ENDPOINTS_ADMIN.AUTHSUPERADMIN.LOGIN}`,
    credentials,
  );

  const { access_token, refreshToken, user } = response.data;

  localStorage.setItem('tenant-token', access_token);
  if (refreshToken) {
    localStorage.setItem('tenant-refreshToken', refreshToken);
  }
  localStorage.setItem('tenant-user', JSON.stringify(user));

  return response.data;
}

export async function logout(): Promise<void> {
  try {
    await api.post(`${API_ENDPOINTS_ADMIN.AUTHSUPERADMIN.LOGOUT}`);
  } catch (error) {
        console.warn("Backend logout failed, forcing local logout");

  } finally {
    localStorage.removeItem('tenant-token');
    localStorage.removeItem('tenant-refreshToken');
    localStorage.removeItem('tenant-user');
  }
}

export async function getCurrentUser(): Promise<TenantAdminUser> {
  const response = await api.get<{ user: TenantAdminUser }>(
    'auth/me',
  );
  return response.data.user;
}
