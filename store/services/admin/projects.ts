import { API_ENDPOINTS_ADMIN } from "@/store/endpoints";
import tenantApi from "../../tenantApi";
import { Project } from "@/store/types/project.types";

export async function getProjects(): Promise<Project[]> {
  const response = await tenantApi.get<Project[]>(`${API_ENDPOINTS_ADMIN.PROJECTS.GET_ALL}`);
  return response.data;
}

export async function createProjectServices(projectData: Partial<Project>) {

  const response = await tenantApi.post<Project>(`${API_ENDPOINTS_ADMIN.PROJECTS.CREATE}`, projectData);
  return response.data;
}
export async function updateProjectServices(
  id: number,
  projectData: Partial<Project>
): Promise<Project> {
  const response = await tenantApi.patch<Project>(
    `${API_ENDPOINTS_ADMIN.PROJECTS.UPDATE(id)}`,
    projectData
  );
  return response.data;
}

export async function deleteProjectServices(id: number): Promise<void> {
  const response = await tenantApi.delete(
    `${API_ENDPOINTS_ADMIN.PROJECTS.DELETE(id)}`
  );
  return response.data;
}
export async function getProjectById(id: number): Promise<Project> {
  const response = await tenantApi.get<Project>(
    `${API_ENDPOINTS_ADMIN.PROJECTS.GET_BY_ID(id)}`
  );
  return response.data;
}
