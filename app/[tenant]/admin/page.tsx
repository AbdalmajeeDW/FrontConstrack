"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Briefcase,
  HardHat,
  FileText,
  ArrowUpRight,
  Zap,
  Euro,
  Eye,
  Edit,
  Plus,
  MapPin,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  fetchEmployees,
  selectEmployees,
} from "@/store/slices/admin/employeeSlice";
import {
  fetchProjects,
  selectProject,
} from "@/store/slices/admin/projectsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import StatsCard from "@/components/Cards/StatsCard";
import { usePathname, useRouter } from "next/navigation";
import { fetchTasks, selectTasks } from "@/store/slices/admin/taskSlice";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";
import { statsHomeAdmin } from "@/config/statsConfig";

interface TenantAdminUser {
  name: string;
  role: "tenant_admin" | "user" | string;
  email?: string;
}
export default function AdminPage() {
  const { t } = useTranslation();
  const [tenantAdmin, setTenantAdmin] = useState<TenantAdminUser | null>(null);
  const dispatch = useAppDispatch();
  const employees = useAppSelector(selectEmployees);
  const projects = useAppSelector(selectProject);
  const pathname = usePathname();
  const tenantName = pathname.split("/")[1] || "";
  const router = useRouter();
  const tasks = useAppSelector(selectTasks);

  useEffect(() => {
    const tenantAdminToken = localStorage.getItem("tenant-user");
    if (tenantAdminToken) {
      setTenantAdmin(JSON.parse(tenantAdminToken));
    }
    dispatch(fetchTasks());
    dispatch(fetchEmployees());
    dispatch(fetchProjects());
    document.title = "Tenant Admin Dashboard";
  }, []);

  const handleStatClick = (path: string) => {
    router.push(`/${tenantName}${path}`);
  };
  const formatDate = (date: Date) => {
    const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
    return date.toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const { statsCard } = statsHomeAdmin(
    employees,
    projects,
    tasks,
    handleStatClick,
    t,
  );
  const recentProjects = [...projects]
    .sort((a, b) => new Date("").getTime() - new Date("").getTime())
    .slice(0, 4);

  return (
    <div className="bg-linear-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>

      <div className="mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span>👋</span>
              {t("dashboard.welcome", { name: tenantAdmin?.name || "Admin" })}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {formatDate(new Date())}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCard.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                onClick={stat.onClick}
                className="cursor-pointer transition-transform hover:shadow-xl rounded-2xl"
              >
                <StatsCard {...stat} icon={<Icon className="w-6 h-6" />} />
              </div>
            );
          })}
        </div>

        <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-800">
                  {t("dashboard.quick_actions.title")}
                </h3>
                <p className="text-sm text-gray-500">
                  {t("dashboard.quick_actions.subtitle")}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${tenantName}/admin/projects/create`}>
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:shadow-md transition-all text-sm border border-gray-200">
                  <Building2 className="w-4 h-4" />
                  {t("dashboard.quick_actions.new_project")}
                </button>
              </Link>
              <Link href={`/${tenantName}/admin/employees/new`}>
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:shadow-md transition-all text-sm border border-gray-200">
                  <Users className="w-4 h-4" />
                  {t("dashboard.quick_actions.add_employee")}
                </button>
              </Link>
              <Link href={`/${tenantName}/admin/projects`}>
                <button className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-all text-sm shadow-md">
                  <FileText className="w-4 h-4" />
                  {t("dashboard.quick_actions.view_projects")}
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-500" />
                {t("dashboard.recent_projects.title")}
              </h3>
              <Link href={`/${tenantName}/admin/projects`}>
                <button className="text-sm cursor-pointer text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                  {t("dashboard.recent_projects.view_all")}{" "}
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentProjects.length > 0 ? (
                recentProjects.map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() =>
                      router.push(`/${tenantName}/admin/projects/${project.id}`)
                    }
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-purple-50">
                              <Building2 className="w-3.5 h-3.5 text-purple-600" />
                            </div>
                            <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors truncate">
                              {project.name}
                            </h4>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            {project.city && (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                {project.city}
                              </span>
                            )}

                            {project.postal_code && (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                {project.postal_code}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                          <Link
                            onClick={(e) => e.stopPropagation()}
                            href={`/${tenantName}/admin/projects/${project.id}`}
                            className="p-1.5 rounded-lg hover:bg-purple-50 transition-colors "
                          >
                            <Eye className="w-4 h-4 text-purple-500 hover:text-purple-700" />
                          </Link>
                          <Link
                            onClick={(e) => e.stopPropagation()}
                            href={`/${tenantName}/admin/projects/edit/${project.id}`}
                            className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors  "
                          >
                            <Edit className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/${tenantName}/admin/projects/${project.id}`,
                              );
                            }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"
                >
                  <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                    {t("dashboard.recent_projects.no_projects")}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {t("dashboard.recent_projects.start_creating")}
                  </p>
                  <Link href={`/${tenantName}/admin/projects/create`}>
                    <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5">
                      <Plus className="w-4 h-4" />
                      {t("dashboard.recent_projects.create_first")}
                    </button>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                {t("dashboard.employee_overview.title")}
              </h3>
              <Link href={`/${tenantName}/admin/employees`}>
                <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                  {t("dashboard.employee_overview.view_all")}
                </button>
              </Link>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-600">
                    {t("dashboard.employee_overview.total_employees")}
                  </span>
                </div>
                <span className="font-bold text-gray-800">
                  {employees.length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <HardHat className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600">
                    {t("dashboard.employee_overview.driving_license")}
                  </span>
                </div>
                <span className="font-bold text-blue-600">
                  {employees.filter((e) => e.driving_license).length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-sm text-gray-600">
                    {t("dashboard.employee_overview.specializations")}
                  </span>
                </div>
                <span className="font-bold text-amber-600">
                  {
                    new Set(
                      employees.map((e) => e.specialization).filter(Boolean),
                    ).size
                  }
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Euro className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm text-gray-600">
                    {t("dashboard.employee_overview.average_salary")}
                  </span>
                </div>
                <span className="font-bold text-emerald-600">
                  €
                  {employees.length > 0
                    ? (
                        employees.reduce(
                          (sum, e) => sum + Number(e.salary || 0),
                          0,
                        ) / employees.length
                      ).toFixed(0)
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
