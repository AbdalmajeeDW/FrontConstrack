import superApi from "./superApi";
import tenantApi from "./tenantApi";

export const API_ENDPOINTS_SUPER_ADMIN = {
  USERS: {
    BASE: superApi,
    GET_ALL: "/users/",
    GET_BY_ID: (id: number) => `/users/${id}`,
    CREATE: "/users/player",
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    STATS: "/users/stats",
    SEARCH: "/users/search",
    FILTER: "/users/filter",
  },
  TENANTS: {
    BASE: superApi,
    GET_ALL: "/tenants/",
    GET_BY_ID: (id: number) => `/tenants/${id}`,
    CREATE: "/tenants",
    UPDATE: (id: number) => `/tenants/${id}`,
    DELETE: (id: number) => `/tenants/${id}`,
  },
  AUTHSUPERADMIN: {
    BASE: superApi,
    LOGOUT: "/auth/logout",
    LOGIN: "/auth/login",
  },

};

export const API_ENDPOINTS_ADMIN = {
  EMPLOYEES: {
    BASE: tenantApi,
    GET_ALL: "/employees/",
    GET_BY_ID: (id: number) => `/employees/${id}`,
    CREATE: "/employees",
    UPDATE: (id: number) => `/employees/${id}`,
    DELETE: (id: number) => `/employees/${id}`,
  },
  TASKS: {
    BASE: tenantApi,
    GET_ALL: "/tasks/",
    GET_BY_ID: (id: number) => `/tasks/${id}`,
    GET_TASK_EMPLOYEE: (id: number) => `/tasks/${id}/employees`,
    CREATE: "/tasks",
    UPDATE: (id: number) => `/tasks/${id}`,
    ASSIGN_EMPLOYEES: (taskId: number) => `/tasks/${taskId}/assign-employees`,
    DELETE: (id: number) => `/tasks/${id}`,
  },
  AUTHSUPERADMIN: {
    BASE: tenantApi,
    LOGOUT: "/auth/logout",
    LOGIN: "/auth/login",
  },

};