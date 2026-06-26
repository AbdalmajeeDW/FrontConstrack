"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Props = { children: React.ReactNode };

function parseLocalUser() {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isSuperAdminAuthPage = pathname === "/superAdmin/login" || pathname === "/register";
    const isTenantAuthPage = pathname === "/tenant/auth/login" || pathname === "/admin/login";
    const isSuperAdminRoute = pathname.startsWith("/superAdmin");
    const isTenantAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

    if (isSuperAdminAuthPage || isTenantAuthPage) {
      const authToken = localStorage.getItem("auth-token");
      const tenantToken = localStorage.getItem("tenant-admin-token");

      if (isSuperAdminAuthPage && authToken) {
        router.push("/superAdmin");
        return;
      }

      if (isTenantAuthPage && tenantToken) {
        router.push("/admin");
        return;
      }

      setChecked(true);
      return;
    }

    if (isSuperAdminRoute) {
      const token = localStorage.getItem("auth-token");
      const authToken = localStorage.getItem("auth-token");


      if (!token) {
        router.push("/superAdmin/login");
        return;
      }

      setChecked(true);
      return;
    }

    if (isTenantAdminRoute) {
      const tenantToken = localStorage.getItem("tenant-admin-token");
      if (!tenantToken) {
        router.push("/admin/login");
        return;
      }
      setChecked(true);
      return;
    }

    setChecked(true);
  }, [pathname, router]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
