import { API_ENDPOINTS_SUPER_ADMIN } from "@/store/endpoints";
import api from "../../superApi";

export interface Tenant {
  id?: number;
  name: string;
  address: string;
  phone: string;
  plan: "Basic" | "Professional" | "Enterprise" ;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  databaseName: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  discount: number;
  industry: string;
  maxEmployees: number;
  kvkNumber: string;
  btwNumber: string;

  status: "active" | "pending" | "expired";
}
export const getInitialTenantForm = (): Tenant => ({
  name: "",
  address: "",
  phone: "",
  plan: "Basic",
  adminName: "",
  adminEmail: "",
  adminPassword: "",
  databaseName: "",
  subscriptionStartDate: "",
  subscriptionEndDate: "",
  discount: 0,
  industry: "",
  maxEmployees: 3,
  kvkNumber: "",
  btwNumber: "",
  status: "pending",
});

export async function getTenants(): Promise<Tenant[]> {
  const response = await api.get<Tenant[]>(
    `${API_ENDPOINTS_SUPER_ADMIN.TENANTS.GET_ALL}`,
  );
  return response.data;
}

export async function getTenantById(id: number): Promise<Tenant> {
  const response = await api.get<Tenant>(
    `${API_ENDPOINTS_SUPER_ADMIN.TENANTS.GET_BY_ID(id)}`,
  );
  return response.data;
}

export async function createTenant(tenantData: Partial<Tenant>) {
  const response = await api.post<Tenant>(
    `${API_ENDPOINTS_SUPER_ADMIN.TENANTS.CREATE}`,
    tenantData,
  );
  return response.data;
}

export async function updateTenant(id: number, tenantData: Partial<Tenant>) {
  const response = await api.patch<Tenant>(
    `${API_ENDPOINTS_SUPER_ADMIN.TENANTS.UPDATE(id)}`,
    tenantData,
  );
  return response.data;
}
export async function activateTenant(id: number) {
  const response = await api.patch<Tenant>(
    `${API_ENDPOINTS_SUPER_ADMIN.TENANTS.ACTIVATE(id)}`,
    {},
  );
  return response.data;
}
