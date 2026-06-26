import { API_ENDPOINTS_SUPER_ADMIN } from "@/store/endpoints";
import api from "../../superApi";

export interface superAdmin {
  id: number;
  name: string;
  email: string;
  address?: string;

  createdAt?: string;
  updatedAt?: string;
}

export async function getSuperAdmins(): Promise<superAdmin[]> {
  const response = await api.get<superAdmin[]>(
    `${API_ENDPOINTS_SUPER_ADMIN.USERS.GET_ALL}`,
  );
  return response.data;
}

export async function getSuperAdminById(id: number): Promise<superAdmin> {
  const response = await api.get<superAdmin>(
    `${API_ENDPOINTS_SUPER_ADMIN.USERS.GET_BY_ID}/${id}`,
  );
  return response.data;
}
export async function logout(): Promise<void> {
  try {
    await api.post(`${API_ENDPOINTS_SUPER_ADMIN.AUTHSUPERADMIN.LOGOUT}`);
  } catch (error) {
  } finally {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('super-admin-refreshToken');
    localStorage.removeItem('user');
  }
}
export async function createSuperAdmin(superAdminData: Partial<superAdmin>) {
  const response = await api.post<superAdmin>(
    `${API_ENDPOINTS_SUPER_ADMIN.USERS.CREATE}`,
    superAdminData,
  );
  return response.data;
}

export async function updateSuperAdmin(
  id: number,
  superAdminData: Partial<superAdmin>,
) {
  const response = await api.patch<superAdmin>(
    `${API_ENDPOINTS_SUPER_ADMIN.USERS.UPDATE}/${id}`,
    superAdminData,
  );
  return response.data;
}
