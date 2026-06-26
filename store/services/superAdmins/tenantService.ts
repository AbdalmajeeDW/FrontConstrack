import { API_ENDPOINTS_SUPER_ADMIN } from "@/store/endpoints";
import api from "../../superApi";

export interface Tenant {
  id: number;
  name: string;
  adminEmail: string;
  phone: string;
  status: "active" | "pending" | "suspended" | "expired";
  plan: "Basic" | "Professional" | "Enterprise";
  maxEmployees: number;
  projects: number;
  joinedDate: string;
  lastActive: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  revenue: string;
  address: string;
}

export async function getTenants(): Promise<Tenant[]> {
  const response = await api.get<Tenant[]>(`${API_ENDPOINTS_SUPER_ADMIN.TENANTS.GET_ALL}`);
  return response.data;
}

export async function getTenantById(id: number): Promise<Tenant> {
  const response = await api.get<Tenant>(`${API_ENDPOINTS_SUPER_ADMIN.TENANTS.GET_BY_ID}/${id}`);
  return response.data;
}

export async function createTenant(tenantData: Partial<Tenant>) {
  const response = await api.post<Tenant>(`${API_ENDPOINTS_SUPER_ADMIN.TENANTS.CREATE}`, tenantData);
  return response.data;
}

export async function updateTenant(id: number, tenantData: Partial<Tenant>) {
  const response = await api.patch<Tenant>(`${API_ENDPOINTS_SUPER_ADMIN.TENANTS.UPDATE}/${id}`, tenantData);
  return response.data;
}
