"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Mail,
  Phone,
  Users,
  Calendar,
  Activity,
  DollarSign,
  Eye,
  Edit,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Tenant } from "@/store/services/superAdmins/tenantService";



type StatusKey = "active" | "suspended" | "pending" | "expired";
type PlanKey = "basic" | "pro" | "enterprise";

interface StatusConfig {
  label: string;
  color: string;
  icon: string;
}

interface PlanConfig {
  label: string;
  class: string;
}

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

interface TenantsTableProps {
  tenants: Tenant[];
  onSort?: (key: string, order: "asc" | "desc") => void;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}



const statusConfig: Record<StatusKey, StatusConfig> = {
  active: { label: "Active", color: "bg-green-100 text-green-700", icon: "✅" },
  suspended: { label: "Suspended", color: "bg-red-100 text-red-700", icon: "⛔" },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: "⏳" },
  expired: { label: "Expired", color: "bg-gray-100 text-gray-700", icon: "⏰" },
};

const planConfig: Record<PlanKey, PlanConfig> = {
  basic: { label: "Basic", class: "bg-slate-100 text-slate-600" },
  pro: { label: "Pro", class: "bg-blue-100 text-blue-700" },
  enterprise: { label: "Enterprise", class: "bg-purple-100 text-purple-700" },
};

const columns: Column[] = [
  { key: "company", label: "Company", sortable: true },
  { key: "contact", label: "Contact", sortable: false },
  { key: "status", label: "Status", sortable: true },
  { key: "plan", label: "Plan", sortable: true },
  { key: "users", label: "Users", sortable: true },
  { key: "subscription", label: "Subscription", sortable: false },
  { key: "revenue", label: "Revenue", sortable: true },
  { key: "action", label: "ACTION", sortable: false },
];


  const getPlanConfig = (plan: string) => {
    const configs = {
      Basic: "bg-slate-100 text-slate-700",
      Professional: "bg-blue-100 text-blue-700",
      Enterprise: "bg-purple-100 text-purple-700",
      Premium: "bg-purple-100 text-purple-700",
    };
    return configs[plan as keyof typeof configs] || "bg-slate-100 text-slate-700";
  };

export default function TenantsTable({
  tenants,
  onSort,
  onEdit,
  onView,
  sortBy = "",
  sortOrder = "asc",
}: TenantsTableProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  const paginatedTenants: Tenant[] = tenants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages: number = Math.ceil(tenants.length / itemsPerPage);

  const renderCell = (tenant: Tenant, columnKey: string): React.ReactNode => {
    switch (columnKey) {
      case "company":
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900 group-hover:text-purple-600 transition-colors">
                {tenant.name}
              </p>
              <p className="text-xs text-slate-400">{tenant.address}</p>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-slate-600">
              <Mail className="w-3 h-3 text-slate-400" />
              <span>{tenant.adminEmail}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-600">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>{tenant.phone}</span>
            </div>
          </div>
        );

      case "status":
        const status = statusConfig[tenant.status] || statusConfig.pending;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${status.color}`}
          >
            <span>{status.icon}</span>
            {status.label}
          </span>
        );

      case "plan":
        const planClass = getPlanConfig(tenant.plan);

        return (
          <span
            className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${planClass}`}
          >
            {tenant.plan}
          </span>
        );

      case "users":
        return (
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">
              {tenant.maxEmployees}
            </span>
          </div>
        );

      case "subscription":
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="w-3 h-3" />
              <span>Starts: {tenant.subscriptionStartDate}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Activity className="w-3 h-3" />
              <span>Ends: {tenant.subscriptionEndDate}</span>
            </div>
          </div>
        );

      case "revenue":
        return (
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">
              {tenant.revenue}
            </span>
          </div>
        );

      case "action":
        return (
          <div className="flex items-center gap-1">
            <Link
              href={`/superadmin/tenants/${tenant.id}`}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4 text-slate-500" />
            </Link>
            <Link
              href={`/superadmin/tenants/${tenant.id}`}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 text-slate-500" />
            </Link>
            <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSort = (key: string): void => {
    if (onSort) {
      const newOrder: "asc" | "desc" =
        sortBy === key && sortOrder === "asc" ? "desc" : "asc";
      onSort(key, newOrder);
    }
  };

  const goToPreviousPage = (): void => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = (): void => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-linear-to-r from-purple-500 to-blue-500">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`text-left px-6 py-4 text-xs font-medium text-white uppercase tracking-wider ${
                    col.sortable
                      ? "cursor-pointer hover:bg-white/10 transition-colors"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortBy === col.key && (
                      <span className="text-xs">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedTenants.map((tenant, idx) => (
              <motion.tr
                key={tenant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-slate-50 transition-colors group"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4">
                    {renderCell(tenant, col.key)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-6 py-3 border-t">
          <div className="text-sm text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, tenants.length)} of{" "}
            {tenants.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-2 border rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="px-3 py-2 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="p-2 border rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}