import { API_ENDPOINTS_ADMIN } from "@/store/endpoints";
import tenantApi from "../../tenantApi";
import { Task, TaskEmployee } from "../../types/task.types";

export async function getTasks(): Promise<Task[]> {
  const response = await tenantApi.get<Task[]>(`${API_ENDPOINTS_ADMIN.TASKS.GET_ALL}`);
  return response.data;
}

export async function getTaskById(id: number): Promise<Task> {
  const response = await tenantApi.get<Task>(`${API_ENDPOINTS_ADMIN.TASKS.GET_BY_ID(id)}`);
  return response.data;
}

export async function getTaskEmployees(id: number): Promise<TaskEmployee[]> {
  const response = await tenantApi.get<TaskEmployee[]>(`${API_ENDPOINTS_ADMIN.TASKS.GET_TASK_EMPLOYEE(id)}`);
  return response.data;
}

export async function createTask(taskData: Partial<Task>) {

  const response = await tenantApi.post<Task>(`${API_ENDPOINTS_ADMIN.TASKS.CREATE}`, taskData);
  return response.data;
}

export async function updateTask(id: number, taskData: Partial<Task>) {
    console.log(taskData instanceof FormData);
  console.log(taskData,'ddd');
  const response = await tenantApi.patch<Task>(`${API_ENDPOINTS_ADMIN.TASKS.UPDATE(id)}`, taskData, {
    
    });
  return response.data;
}

export async function deleteTask(id: number): Promise<void> {
  await tenantApi.delete(`${API_ENDPOINTS_ADMIN.TASKS.DELETE(id)}`);
}

export async function assignEmployeesToTask(taskId: number, employeeIds: number[]): Promise<TaskEmployee[]> {
  const response = await tenantApi.post<TaskEmployee[]>(`${API_ENDPOINTS_ADMIN.TASKS.ASSIGN_EMPLOYEES(taskId)}`, {
    employeeIds,
  });
  return response.data;
}
