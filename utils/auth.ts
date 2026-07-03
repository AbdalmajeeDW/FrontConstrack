export const clearAllSessions = () => {
  // Super Admin
  localStorage.removeItem("auth-token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  // Tenant Admin
  localStorage.removeItem("tenant-token");
  localStorage.removeItem("tenant-refreshToken");
  localStorage.removeItem("tenant-user");

  // Employee
  localStorage.removeItem("tenant-token");
  localStorage.removeItem("tenant-refreshToken");
  localStorage.removeItem("tenant-user");
};