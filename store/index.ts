import { configureStore } from "@reduxjs/toolkit";
import superAuthSlice from "./slices/superAdmin/superAuthSlice";
import tenantSlice from "./slices/superAdmin/tenantSlice";
import tenantAdminAuthSlice from "./slices/admin/tenantAdminAuthSlice";
import superAdminSlice from "./slices/superAdmin/superAdminSlice";
import taskSlice from "./slices/admin/taskSlice";
import taskEmployeeSlice from "./slices/admin/employeeSlice";
import employeeSlice from "./slices/admin/employeeSlice";

export const store = configureStore({
  reducer: {
    superAuth: superAuthSlice,
    superAdmin: superAdminSlice,
    tenant: tenantSlice,
    tenantAdminAuth: tenantAdminAuthSlice,
    task: taskSlice,
    employee: employeeSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
