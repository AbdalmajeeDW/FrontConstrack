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


