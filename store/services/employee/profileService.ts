import { API_ENDPOINTS_ADMIN } from '@/store/endpoints';
import tenantApi from '../../tenantApi';
import { EmployeeUser } from '@/store/types/employee.types';

export async function getByEmployeeId(employeeId: number): Promise<EmployeeUser> {
  const response = await tenantApi.get<EmployeeUser>(`${API_ENDPOINTS_ADMIN.EMPLOYEES.GET_BY_ID(employeeId)}`);
  return response.data;
}
