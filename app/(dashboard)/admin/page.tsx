"use client";
import { useEffect, useState } from "react";
interface TenantAdminUser {
  name: string;
  role: 'tenant_admin' | 'user' | string;
  email?: string;

}
export default function AdminPage() {
  const [tenantAdminToken, setTenantAdminToken] = useState<TenantAdminUser | null>(null);
  useEffect(() => {
    const tenantAdminToken = localStorage.getItem("tenant-admin-user");
    if (tenantAdminToken) {
      setTenantAdminToken(JSON.parse(tenantAdminToken));
    }
    document.title = "Tenant Admin Dashboard";
  }, []);
  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
      <h1 className="text-3xl font-bold text-slate-900">Tenant Admin Dashboard</h1>
      <p className="mt-4 text-slate-600">
        Welcome to your company admin {tenantAdminToken?.name}
        {/* {
          
            tenantAdminToken ? (
              <span className="text-green-600 font-medium ml-2">Authenticated {tenantAdminToken.name}</span>
            ) : (
              <span className="text-red-600 font-medium ml-2">Not Authenticated</span>
            )
        } */}
      </p>
    </div>
  );
}
