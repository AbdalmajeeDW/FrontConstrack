"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Loader, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tenantAdminInitialize } from "@/store/slices/admin/tenantAdminAuthSlice";

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { tenantAdmin, isLoading, error, isAuthenticated, isInitialized } =
    useAppSelector((state) => state.tenantAdminAuth);
  console.log(tenantAdmin);

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
      router.replace("/login");
      return;
    }

    if (!isAuthenticated || !tenantAdmin) {
      router.replace("/login");
      return;
    }

    if (tenantAdmin.role === "super_admin") {
      router.replace("/superAdmin");
    } else if (tenantAdmin.role === "tenant_admin") {
      router.replace("/admin");
    } else if (tenantAdmin.role === "employee") {
      router.replace("/employee");
    } else {
      router.replace("/login");
    }
  }, [tenantAdmin, isLoading, error, isAuthenticated, isInitialized, router]);

  // عرض شاشة تحميل
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
        <p className="mt-4 text-gray-600 font-medium">
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
