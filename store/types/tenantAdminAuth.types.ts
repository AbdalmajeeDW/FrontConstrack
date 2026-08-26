export interface TenantAdminUser {
  id: string;
  tenantId: string;
  name: string;
  roleEn?:  string;
  roleAr?:  string;
  email?: string;
  avatar?: string;
  phone?: string;
  createdAt?: string;
}
export interface TenantEmployee {
  id: string;
  tenantId: string;
  name: string;
    roleEn?:  string;
  roleAr?:  string;
  email?: string;
  avatar?: string;
  phone?: string;
  createdAt?: string;
}
export interface TenantLoginCredentials {
  name: string;
  email: string;
  password: string;
}

export interface TenantAdminLoginResponse {
  user: TenantAdminUser;
  access_token: string;
  refreshToken?: string;
}
