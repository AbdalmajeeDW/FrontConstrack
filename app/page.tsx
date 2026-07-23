"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tenantAdminInitialize } from "@/store/slices/admin/tenantAdminAuthSlice";

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { tenantAdmin, isLoading, error, isAuthenticated, isInitialized } =
    useAppSelector((state) => state.tenantAdminAuth);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(tenantAdminInitialize());
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (isLoading) {
      return;
    }

    if (error) {
      router.replace("/");

      return;
    }

    if (!isAuthenticated || !tenantAdmin) {
      router.replace("/");

      return;
    }

    const tenantName = tenantAdmin.name;

    if (!tenantName) {
      console.error("Tenant name missing from token");

      router.replace("/");

      return;
    }

    if (tenantAdmin.role === "tenant_admin") {
      router.replace(`/${tenantName}/`);

      return;
    }

    if (
      tenantAdmin.role === "tenant_employee" ||
      tenantAdmin.role === "employee"
    ) {
      router.replace(`/${tenantName}/employee`);

      return;
    }

    router.replace("/");
  }, [tenantAdmin, isLoading, error, isAuthenticated, isInitialized, router]);

  return (
    <div
      className="
      min-h-screen 
      flex 
      items-center 
      justify-center 
      bg-linear-to-br 
      from-gray-50 
      to-gray-100
    "
    >
      <div className="text-center">
        <Loader
          className="
            w-12 
            h-12 
            text-purple-600 
            animate-spin 
            mx-auto
          "
        />

        <p
          className="
          mt-4 
          text-gray-600 
          font-medium
        "
        >
          {!isInitialized
            ? "Initializing..."
            : isLoading
              ? "Loading..."
              : "Redirecting..."}
        </p>
      </div>
    </div>
  );
}
