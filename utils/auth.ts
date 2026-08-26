export const clearAllSessions = () => {
  localStorage.removeItem("auth-token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  localStorage.removeItem("tenant-token");
  localStorage.removeItem("tenant-refreshToken");
  localStorage.removeItem("tenant-user");

  localStorage.removeItem("tenant-token");
  localStorage.removeItem("tenant-refreshToken");
  localStorage.removeItem("tenant-user");
};