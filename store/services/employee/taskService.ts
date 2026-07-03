import { API_ENDPOINTS_ADMIN } from '@/store/endpoints';
import tenantApi from '../../tenantApi';
import { Task } from '../../types/task.types';

export async function getTasksByEmployeeId(employeeId: number): Promise<Task[]> {
  const response = await tenantApi.get<Task[]>(`${API_ENDPOINTS_ADMIN.TASKS.GET_BY_EMPLOYEE_ID(employeeId)}`);
  return response.data;
}
