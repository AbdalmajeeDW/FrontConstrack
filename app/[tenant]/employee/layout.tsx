"use client";
import AuthGuard from "@/components/AuthGuard";
import Drower from "@/components/Drawer/page";
import Header from "@/components/Header/page";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex">
        <Drower />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-6 overflow-x-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
