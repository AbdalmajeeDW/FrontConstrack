import { API_ENDPOINTS_ADMIN } from "@/store/endpoints";
import api from "../../tenantApi";

export interface employee {
  id?: number;
  name?: string;
    email: string;
    address?: string;
      salary: string;
  birth_date: string;
  phone: string;
  password?: string;
  driving_license: boolean;
  specialization: string;
    createdAt?: string;
    updatedAt?: string;
    role: string;
}

export async function getEmployees(): Promise<employee[]> {
  const response = await api.get<employee[]>(`${API_ENDPOINTS_ADMIN.EMPLOYEES.GET_ALL}`);
  return response.data;
}

export async function getEmployeeById(id: number): Promise<employee> {
  const response = await api.get<employee>(`${API_ENDPOINTS_ADMIN.EMPLOYEES.GET_BY_ID(id)}`);
  return response.data;
}

export async function createEmployee(employeeData: Partial<employee>) {
  const response = await api.post<employee>(`${API_ENDPOINTS_ADMIN.EMPLOYEES.CREATE}`, employeeData);
  return response.data;
}

export async function updateEmployee(id: number, employeeData: Partial<employee>) {
  const response = await api.patch<employee>(`${API_ENDPOINTS_ADMIN.EMPLOYEES.UPDATE(id)}`, employeeData);
  return response.data;
}
