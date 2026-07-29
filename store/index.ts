import { configureStore } from "@reduxjs/toolkit";
import superAuthSlice from "./slices/superAdmin/superAuthSlice";
import tenantSlice from "./slices/superAdmin/tenantSlice";
import tenantAdminAuthSlice from "./slices/admin/tenantAdminAuthSlice";
import superAdminSlice from "./slices/superAdmin/superAdminSlice";
import taskSlice from "./slices/admin/taskSlice";
import employeeTaskSlice from "./slices/employee/taskSlice";
import employeeSlice from "./slices/admin/employeeSlice";
import profileSlice from "./slices/employee/profileSlice";
import projectsSlice from "./slices/admin/projectsSlice";

export const store = configureStore({
  reducer: {
    superAuth: superAuthSlice,
    superAdmin: superAdminSlice,
    tenant: tenantSlice,
    tenantAdminAuth: tenantAdminAuthSlice,
    task: taskSlice,
    employeeTask: employeeTaskSlice,
    employeeProfile: profileSlice,
    employee: employeeSlice,
    projects: projectsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
