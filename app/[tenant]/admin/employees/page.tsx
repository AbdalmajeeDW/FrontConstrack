"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  PlusCircle,
  Eye,
  Edit,
  Mail,
  ChevronLeft,
  ChevronRight,
  Zap,
  UserX,
  HardDrive,
  Euro,
  Loader,
  Trash2,
  Filter,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteEmployeeById,
  fetchEmployees,
  selectEmployeeError,
  selectEmployeeLoading,
} from "@/store/slices/admin/employeeSlice";
import { selectEmployees } from "@/store/slices/admin/employeeSlice";
import StatsCard from "@/components/Cards/StatsCard";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { DeleteConfirmModal } from "@/components/Modal/DeleteConfirmModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { statsEmployees } from "@/config/statsConfig";
import { EmployeeTable } from "@/components/tenantAdmin/Table/EmployeeTable";
import { InsightsGrid } from "@/components/tenantAdmin/InsightsGrid.tsx/Insights";
import { getEmployeesInsights } from "@/config/Insights";

export default function UsersPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "license"
  >("all");

  const [specializationFilter, setSpecializationFilter] =
    useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const dispatch = useAppDispatch();
  const employees = useAppSelector(selectEmployees);
  const isLoading = useAppSelector(selectEmployeeLoading);
  const error = useAppSelector(selectEmployeeError);
  const pathname = usePathname();
  const tenantName = pathname.split("/")[1] || "";
  const [deleteModal, setDeleteModal] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const { stats, statCards } = statsEmployees(employees, t);
  const specializations = Array.from(
    new Set(employees.map((e) => e.specialization).filter(Boolean)),
  );

  const filteredEmployees = employees.filter((employee) => {
    if (statusFilter === "active" && !employee.is_active) {
      return false;
    }
    if (statusFilter === "inactive" && employee.is_active) {
      return false;
    }
    if (statusFilter === "license" && !employee.driving_license) {
      return false;
    }

    if (
      specializationFilter !== "all" &&
      employee.specialization !== specializationFilter
    ) {
      return false;
    }

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      return (
        employee.name?.toLowerCase().includes(search) ||
        employee.email?.toLowerCase().includes(search) ||
        employee.address?.toLowerCase().includes(search) ||
        employee.specialization?.toLowerCase().includes(search)
      );
    }

    return true;
  });
  const insights = getEmployeesInsights(stats, t);

  const resetFilters = () => {
    setStatusFilter("all");
    setSpecializationFilter("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      await dispatch(deleteEmployeeById(id)).unwrap();
      toast.success(t("employees.delete_success"));
      setDeleteModal(null);
    } catch (err: any) {
      toast.error(err || t("employees.delete_error"));
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const paginatedUsers = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const containerVariants = {
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="lg:ml-0">
        <div className="mx-auto p-6 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          <motion.div
            variants={containerVariants}
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  onClick={() => {
                    setStatusFilter(card.filter);
                    setCurrentPage(1);
                  }}
                  className={`relative group cursor-pointer rounded-2xl transition-all hover:scale-105 ${
                    statusFilter === card.filter
                      ? `ring-2 ${card.ringColor}`
                      : ""
                  }`}
                >
                  <StatsCard
                    title={card.title}
                    value={card.value}
                    icon={<Icon className="w-6 h-6" />}
                    gradient={card.gradient}
                    bgColor={card.bgColor}
                    textColor={card.textColor}
                    description={card.description}
                  />
                  {statusFilter === card.filter && (
                    <span className="absolute top-2 right-2 text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg"
          >
            <div className="p-4 border-b border-slate-200 bg-white">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="text"
                      placeholder={t("employees.search_placeholder")}
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                      <Filter className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {t("employees.filter")}
                      </span>
                      {(statusFilter !== "all" ||
                        specializationFilter !== "all") && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-purple-500 text-white rounded-full">
                          {Number(statusFilter !== "all") +
                            Number(specializationFilter !== "all")}
                        </span>
                      )}
                    </Button>

                    <Link href={`/${tenantName}/admin/employees/new`}>
                      <Button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-purple-500 to-blue-500 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-md whitespace-nowrap">
                        <PlusCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          {t("employees.new_employee")}
                        </span>
                        <span className="sm:hidden">{t("employees.add")}</span>
                      </Button>
                    </Link>
                  </div>
                </div>

                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100"
                  >
                    {specializations.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">
                          {t("employees.table.specialization")}:
                        </span>
                        <select
                          value={specializationFilter}
                          onChange={(e) => {
                            setSpecializationFilter(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        >
                          <option value="all">
                            {t("employees.filter_all_specializations") ||
                              "جميع التخصصات"}
                          </option>
                          {specializations.map((spec) => (
                            <option key={spec} value={spec}>
                              {spec}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">
                        {t("employees.table.status") || "الحالة"}:
                      </span>
                      <select
                        value={statusFilter}
                        onChange={(e) => {
                          setStatusFilter(e.target.value as any);
                          setCurrentPage(1);
                        }}
                        className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                      >
                        <option value="all">
                          {t("employees.filter_all_status") || "جميع الحالات"}
                        </option>
                        <option value="active">
                          {t("employees.stats.active") || "نشط"}
                        </option>
                        <option value="inactive">
                          {t("employees.stats.inactive") || "غير نشط"}
                        </option>
                        <option value="license">
                          {t("employees.stats.license") || "لديه رخصة"}
                        </option>
                      </select>
                    </div>

                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-3 h-3" />
                      {t("employees.reset_filters") || "إعادة تعيين"}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
            <EmployeeTable
              employees={paginatedUsers}
              tenantName={tenantName}
              onEdit={(id) =>
                router.push(`/${tenantName}/admin/employees/edit/${id}`)
              }
              onDelete={(id, name) => setDeleteModal({ id, name })}
              onRowClick={(id) =>
                router.push(`/${tenantName}/admin/employees/${id}`)
              }
              t={t}
            />
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-slate-500 text-center sm:text-left">
                {t("employees.pagination.showing")}{" "}
                {filteredEmployees.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}{" "}
                {t("employees.pagination.to")}{" "}
                {Math.min(currentPage * itemsPerPage, filteredEmployees.length)}{" "}
                {t("employees.pagination.of")} {filteredEmployees.length}{" "}
                {t("employees.pagination.employees")}
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-slate-600">
                  {t("employees.pagination.page")} {currentPage}{" "}
                  {t("employees.pagination.of")} {totalPages || 1}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages || 1, p + 1))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          <InsightsGrid
            title={insights.title}
            items={insights.items}
            columns={3}
          />
          <DeleteConfirmModal
            isOpen={!!deleteModal}
            onClose={() => setDeleteModal(null)}
            onConfirm={() => handleDelete(deleteModal!.id)}
            title={t("employees.delete_title")}
            itemType="employee"
            itemName={deleteModal?.name}
            confirmText={t("employees.delete_confirm")}
            isLoading={isDeleting}
            icon={<UserX className="w-6 h-6 text-red-600" />}
          />
        </div>
      </div>
    </div>
  );
}
