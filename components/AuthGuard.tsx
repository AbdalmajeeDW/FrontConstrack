"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export function decodeJWT(token: string | null) {
  try {
    if (!token) return null;

    const payload = token.split(".")[1];

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    return JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      ),
    );
  } catch {
    return null;
  }
}

export default function AuthGuard({ children }: Props) {
  const router = useRouter();

  const pathname = usePathname();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    const tenantName = parts[0];

    const section = parts[1];

    const superToken = localStorage.getItem("auth-token");

    const tenantToken = localStorage.getItem("tenant-token");

    const tenantUser = decodeJWT(tenantToken);

    if (pathname.startsWith("/superAdmin")) {
      if (pathname === "/superAdmin/login") {
        setChecked(true);
        return;
      }

      if (!superToken) {
        router.replace("/superAdmin/login");

        return;
      }

      setChecked(true);

      return;
    }

    if (section === "login") {
      setChecked(true);

      return;
    }

    if (section === "admin") {
      if (!tenantToken || tenantUser?.role !== "tenant_admin") {
        router.replace(`/${tenantName}/login`);

        return;
      }

      setChecked(true);

      return;
    }

    if (section === "employee") {
      if (!tenantToken || tenantUser?.role !== "tenant_employee") {
        router.replace(`/${tenantName}/login`);

        return;
      }

      setChecked(true);

      return;
    }

    setChecked(true);
  }, [pathname, router]);

  if (!checked) return null;

  return <>{children}</>;
}
