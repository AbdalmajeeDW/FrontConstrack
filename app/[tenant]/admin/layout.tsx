"use client";
import AuthGuard from "@/components/AuthGuard";
import Drower from "../../../components/Drawer/page";
import Header from "../../../components/Header/page";
import { usePathname } from "next/navigation";
import StoreProvider from "@/app/(dashboard)/superAdmin/StoreProvider";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
const isAuthPage = pathname.match(/^\/[^\/]+\/login$/);
  return (
    <>
      {isAuthPage ? (
        <main className="max-h-screen">{children}</main>
      ) : (
        <AuthGuard>
          <div className="min-h-screen bg-gray-50 flex">
            <Drower />

            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <Toaster />
              <main className="flex-1 p-6 overflow-x-auto">
                <StoreProvider>{children}</StoreProvider>
              </main>
            </div>
          </div>
        </AuthGuard>
      )}
    </>
  );
}
