// import { useAuth } from "@/hooks/useAuth";

export const createAuthHeaders = () => {
  const token = localStorage.getItem("auth-token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("auth-token");

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
    throw new Error("Session expired");
  }

  return response;
};
