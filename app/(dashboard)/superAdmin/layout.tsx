"use client";
import AuthGuard from "@/components/AuthGuard";
import Drower from "../../../components/Drawer/page";
import Header from "../../../components/Header/page";
import { usePathname } from "next/navigation";
import StoreProvider from "./StoreProvider";
import { Toaster } from "sonner";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/superAdmin/login" || pathname === "/register";

  return (
  
      <AuthGuard>
        {isAuthPage ? (
          <main className="max-h-screen">{children}</main>
        ) : (
          <div className="min-h-screen bg-gray-50 flex">
              <Drower />

              <div className="flex-1 flex flex-col min-w-0">
                <Header />
<Toaster/>

                <main className="flex-1 p-6 overflow-x-auto">
              <StoreProvider>
                  {children}
                  
          </StoreProvider>
                  </main>
              </div>
            </div>
        )}
      </AuthGuard>

  );
}
