"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Props = { children: React.ReactNode };


export function decodeJWT(token: any): any | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}
export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isSuperAdminAuthPage =
      pathname === "/superAdmin/login" || pathname === "/register";
    const isTenantAuthPage = pathname === "/" || pathname === "/login";
    const isSuperAdminRoute = pathname.startsWith("/superAdmin");
    const isTenantAdminRoute =
      pathname === "/admin" || pathname.startsWith("/admin/");
    const isTenantEmployeeRoute =
      pathname === "/employee" || pathname.startsWith("/employee/");
    const token = localStorage.getItem("tenant-token");
    if (token) {
      const decoded = decodeJWT(token);
      console.log(decoded, "eddd");
    }
    if (isSuperAdminAuthPage || isTenantAuthPage) {
      const authToken = localStorage.getItem("auth-token");
      const tenantToken = localStorage.getItem("tenant-token");

      if (isSuperAdminAuthPage && authToken) {
        router.push("/superAdmin");
        return;
      }

      if (tenantToken) {
        router.push("/admin");
        return;
      }

      setChecked(true);
      return;
    }

    if (isSuperAdminRoute) {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        router.push("/superAdmin/login");
        return;
      }

      setChecked(true);
      return;
    }
 
    if (isTenantAdminRoute) {
      const tenantToken = localStorage.getItem("tenant-token");
      if (!tenantToken|| decodeJWT(localStorage.getItem("tenant-token"))?.role !== "tenant_admin") {
        router.push("/login");
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
