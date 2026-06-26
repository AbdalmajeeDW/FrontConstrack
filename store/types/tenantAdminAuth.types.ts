export interface TenantAdminUser {
  id: string;
  tenantId: string;
  name: string;
  role: 'tenant_admin' | 'user' | string;
  email?: string;
  avatar?: string;
  phone?: string;
  createdAt?: string;
}

export interface TenantAdminLoginCredentials {
  name: string;
  email: string;
  password: string;
}

export interface TenantAdminLoginResponse {
  user: TenantAdminUser;
  access_token: string;
  refreshToken?: string;
}
