export const clearAllSessions = () => {
  // Super Admin
  localStorage.removeItem("auth-token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  // Tenant Admin
  localStorage.removeItem("tenant-admin-token");
  localStorage.removeItem("tenant-admin-refreshToken");
  localStorage.removeItem("tenant-admin-user");

  // Employee
  localStorage.removeItem("employee-token");
  localStorage.removeItem("employee-refreshToken");
  localStorage.removeItem("employee-user");
};