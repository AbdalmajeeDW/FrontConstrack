import { API_ENDPOINTS_SUPER_ADMIN } from '@/store/endpoints';
import api from '../../superApi';
import { clearAllSessions } from '@/utils/auth';

export interface User {
  id: string;
  email: string;
  name: string;
    roleEn?:  string;
  roleAr?:  string;
  tenantId?: string | null;
  tenantName?: string;
  avatar?: string;
  phone?: string;
  createdAt?: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}



export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    clearAllSessions();
  
  const response = await api.post<LoginResponse>(
    `${API_ENDPOINTS_SUPER_ADMIN.AUTHSUPERADMIN.LOGIN}`,
    credentials
  );
  
   const { access_token, refreshToken, user } = response.data;
  
  localStorage.setItem('auth-token', access_token);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
  if (typeof window !== 'undefined') {
  localStorage.setItem('user', JSON.stringify(user));
}
  return response.data;
}

export async function logout(): Promise<void> {
  try {
    await api.post(`${API_ENDPOINTS_SUPER_ADMIN.AUTHSUPERADMIN.LOGOUT}`);
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

//export async function getCurrentUser(): Promise<User> {
//  const response = await api.get<{ user: User }>(`${API_ENDPOINTS_SUPER_ADMIN.AUTHSUPERADMIN.GET_USER}`);
//  return response.data.user;
//}

//export async function refreshToken(): Promise<string> {
  //const refreshTokenValue = localStorage.getItem('refreshToken');
 // const response = await api.post<{ token: string }>(
  //  `${API_ENDPOINTS_SUPER_ADMIN.AUTHSUPERADMIN.REFRESH}`,
  //  { refreshToken: refreshTokenValue }
  //);
  
 // localStorage.setItem('auth-token', response.data.token);
 // return response.data.token;
//}

//export async function verifyToken(): Promise<boolean> {
  //try {
    //await api.get(`${API_ENDPOINTS_SUPER_ADMIN.AUTHSUPERADMIN.VERIFY}`);
    //return true;
  //} catch {
    //return false;
  //}
//}