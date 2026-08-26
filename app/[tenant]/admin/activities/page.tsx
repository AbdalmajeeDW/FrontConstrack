"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  Activity,
  AlertCircle,
  Zap,
  Mail,
  LogIn,
  LogOut,
  FileText,
  Edit,
  Users,
  Calendar,
  TrendingUp,
  Eye,
  ListTodo,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatsCard from "@/components/Cards/StatsCard";
import { useTranslation } from "react-i18next";

interface ActivityLog {
  id: number;
  action: string;
  message: string;
  employeeId: string;
  employee: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    specialization?: string;
  } | null;
  ipAddress: string;
  created_at: string;
  details?: string;
}

interface Stats {
  today: number;
  month: number;
  totalActivities?: number;
  actionStats: Array<{
    action: string;
    count: number;
  }>;
  topEmployees: Array<{
    employeeId: string;
    employeeName: string;
    employeeEmail: string;
    activityCount: number;
    lastActivity: string;
  }>;
  recentActivities: Array<{
    id: number;
    action: string;
    message: string;
    employeeId: number;
    employeeName: string;
    employeeEmail: string;
    created_at: string;
  }>;
}

export default function ActivitiesPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";

  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterEmployee, setFilterEmployee] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState<"all" | "today" | "month">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const pathname = usePathname();
  const router = useRouter();
  const tenantName = pathname.split("/")[1] || "";

  // ✅ تصحيح فلتر الأكشن - استخدام قيم ثابتة وترجمات منفصلة
  const actions = [
    {
      value: "all",
      label: t("activities.filter.all_actions"),
      icon: Activity,
    },
    {
      value: "login",
      label: t("activities.filter.login"),
      icon: LogIn,
      color: "text-green-500",
    },
    {
      value: "logout",
      label: t("activities.filter.logout"),
      icon: LogOut,
      color: "text-red-500",
    },
    {
      value: "upload_images_for_task",
      label: t("activities.filter.upload_images_for_task"),
      icon: Edit,
      color: "text-blue-500",
    },
    {
      value: "upload_invoice",
      label: t("activities.filter.upload_invoice"),
      icon: FileText,
      color: "text-purple-500",
    },
    {
      value: "view_invoices",
      label: t("activities.filter.view_invoices"),
      icon: FileText,
      color: "text-purple-500",
    },
    {
      value: "view_tasks",
      label: t("activities.filter.view_tasks"),
      icon: FileText,
      color: "text-blue-500",
    },
  ];

  const actionColors: Record<string, string> = {
    login: "bg-green-100 text-green-700",
    logout: "bg-red-100 text-red-700",
    upload_images_for_task: "bg-blue-100 text-blue-700",
    upload_invoice: "bg-purple-100 text-purple-700",
    view_invoices: "bg-indigo-100 text-indigo-700",
    view_tasks: "bg-amber-100 text-amber-700",
    create_invoice: "bg-emerald-100 text-emerald-700",
  };

  const actionIcons: Record<string, React.ReactNode> = {
    login: <LogIn className="w-4 h-4" />,
    logout: <LogOut className="w-4 h-4" />,
    upload_images_for_task: <Edit className="w-4 h-4" />,
    upload_invoice: <FileText className="w-4 h-4" />,
    view_invoices: <Eye className="w-4 h-4" />,
    view_tasks: <ListTodo className="w-4 h-4" />,
  };
  const getSelectedActionLabel = (value: string) => {
    const action = actions.find((a) => a.value === value);
    return action ? action.label : value;
  };
  const statCards = [
    {
      title: t("activities.stats.today"),
      value: stats?.today || 0,
      icon: <Clock className="w-6 h-6 text-emerald-600" />,
      gradient: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600",
      description: t("activities.stats.today_desc"),
      ringColor: "ring-emerald-600",
      filter: "today" as const,
    },
    {
      title: t("activities.stats.month"),
      value: stats?.month || 0,
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      description: t("activities.stats.month_desc"),
      ringColor: "ring-blue-600",
      filter: "month" as const,
    },
    {
      title: t("activities.stats.total"),
      value: stats?.totalActivities || 0,
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      gradient: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      description: t("activities.stats.total_desc"),
      ringColor: "ring-purple-600",
      filter: "all" as const,
    },
  ];

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("tenant-token");
      let url = `http://localhost:3000/tenant/logs/activities?page=${currentPage}&limit=${itemsPerPage}`;

      if (filterAction !== "all") {
        url += `&action=${filterAction}`;
      }

      if (filterEmployee !== "all") {
        url += `&employeeId=${filterEmployee}`;
      }

      if (filterPeriod === "today") {
        url += `&period=today`;
      } else if (filterPeriod === "month") {
        url += `&period=month`;
      }

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch activities");

      const data = await response.json();

      const formattedActivities = data.activities.map((log: any) => ({
        id: log.id,
        action: log.action,
        message: log.message,
        employeeId: log.employeeId || log.user_id,
        employee: log.employee || null,
        ipAddress: log.ipAddress || log.ip_address,
        created_at: log.created_at,
        details: log.details,
      }));

      setActivities(formattedActivities);
      setTotalPages(data.totalPages || 1);
      setTotalItems(Number(data.total) || 0);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error(t("activities.load_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("tenant-token");
      const response = await fetch("http://localhost:3000/tenant/logs/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // ✅ تحديث useEffect ليشمل جميع الفلاتر
  useEffect(() => {
    fetchActivities();
    fetchStats();
  }, [currentPage, filterAction, filterEmployee, filterPeriod, searchTerm]);

  // ✅ إزالة useEffect القديم لإعادة تعيين الصفحة
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterEmployee, filterPeriod, filterAction]);

  const formatTime = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString(locale, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionIcon = (action: string) => {
    return actionIcons[action] || <Activity className="w-4 h-4" />;
  };

  const getActionColor = (action: string) => {
    return actionColors[action] || "bg-gray-100 text-gray-700";
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      login: t("activities.filter.login"),
      logout: t("activities.filter.logout"),
      upload_images_for_task: t("activities.filter.upload_images_for_task"),
      upload_invoice: t("activities.filter.upload_invoice"),
      view_invoices: t("activities.filter.view_invoices"),
      view_tasks: t("activities.filter.view_tasks"),
    };
    return labels[action] || action;
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  // ✅ إزالة filteredActivities المحلية (الفلترة تتم في Backend)
  const displayedActivities = activities;

  const goToEmployee = (employeeId: number) => {
    if (employeeId) {
      router.push(`/${tenantName}/admin/employees/${employeeId}`);
    }
  };

  const containerVariants = {
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>

      <div className="lg:ml-0">
        <div className="mx-auto p-6 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          <motion.div
            variants={containerVariants}
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {statCards.map((card, index) => (
              <div
                key={index}
                onClick={() => {
                  setFilterPeriod(card.filter);
                  setCurrentPage(1);
                }}
                className={`relative group cursor-pointer rounded-2xl transition-all hover:scale-105 ${
                  filterPeriod === card.filter ? `ring-2 ${card.ringColor}` : ""
                }`}
              >
                <StatsCard
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  gradient={card.gradient}
                  bgColor={card.bgColor}
                  textColor={card.textColor}
                  description={card.description}
                />
                {filterPeriod === card.filter && (
                  <span className="absolute top-2 right-2 text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">
                    ✓
                  </span>
                )}
              </div>
            ))}
          </motion.div>

          {stats?.topEmployees && stats.topEmployees.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                {t("activities.most_active")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {stats.topEmployees.map((emp, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setFilterEmployee(String(emp.employeeId));
                      setCurrentPage(1);
                    }}
                    className="bg-gray-50 rounded-xl p-4 text-center hover:bg-purple-50 transition-all cursor-pointer hover:shadow-md"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg mx-auto mb-2">
                      {getInitials(emp.employeeName)}
                    </div>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {emp.employeeName || `Employee #${emp.employeeId}`}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {emp.employeeEmail || t("activities.no_email")}
                    </p>
                    <p className="text-xl font-bold text-purple-600 mt-1">
                      {emp.activityCount}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {t("activities.activities")}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg"
          >
            <div className="p-4 border-b border-slate-200 bg-white">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="flex flex-wrap gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder={t("activities.search")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full min-w-0 pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Select
                    value={filterAction}
                    onValueChange={(value) => {
                      setFilterAction(value || "all");
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[180px] px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <SelectValue
                        placeholder={t("activities.filter_all_actions")}
                      >
                        {getSelectedActionLabel(filterAction)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {actions.map((action) => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-hidden rounded-2xl w-full">
              <table className="table-auto w-full">
                <thead className="bg-linear-to-r from-purple-500 to-blue-500">
                  <tr>
                    <th className="text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      {t("activities.table.employee")}
                    </th>
                    <th className="text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      {t("activities.table.action")}
                    </th>
                    <th className="text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      {t("activities.table.message")}
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      {t("activities.table.time")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                          <p className="mt-2 text-gray-500">
                            {t("activities.loading")}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : displayedActivities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <AlertCircle className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">
                          {t("activities.no_data.title")}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {searchTerm
                            ? t("activities.no_data.no_results")
                            : t("activities.no_data.description")}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    displayedActivities.map((activity, idx) => {
                      let langDetails = null;
                      let displayMessage = activity.message || "N/A";

                      try {
                        if (activity.message) {
                          langDetails = JSON.parse(activity.message);

                          if (langDetails && typeof langDetails === "object") {
                            displayMessage =
                              langDetails[i18n.language] ||
                              langDetails.en ||
                              activity.message ||
                              "N/A";
                          }
                        }
                      } catch (error) {
                        console.warn(
                          "Invalid JSON in details:",
                          activity.details,
                        );
                      }

                      return (
                        <motion.tr
                          key={activity.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-slate-100 transition-colors group cursor-pointer"
                          onClick={() => {
                            if (activity.employee?.id) {
                              goToEmployee(activity.employee.id);
                            }
                          }}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-purple-200 transition-colors">
                                <span className="text-purple-600 font-medium text-sm uppercase">
                                  {getInitials(activity.employee?.name || "")}
                                </span>
                              </div>
                              <div className="flex-1 text-center">
                                <p className="truncate font-medium text-slate-900 group-hover:text-purple-600 transition-colors">
                                  {activity.employee?.name ||
                                    `${t("activities.employee_prefix")} #${activity.employeeId}`}
                                </p>
                                {activity.employee?.email && (
                                  <p className="text-xs text-gray-500 truncate flex items-center justify-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {activity.employee.email}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex justify-center">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}
                              >
                                {getActionIcon(activity.action)}
                                {getActionLabel(activity.action)}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="text-center">
                              <p className="text-sm text-slate-700 truncate mx-auto">
                                {displayMessage || ""}
                              </p>
                            </div>
                          </td>

                          <td className="hidden sm:table-cell px-4 py-3">
                            <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span>{formatTime(activity.created_at)}</span>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-slate-500 text-center sm:text-left">
                {t("activities.pagination.showing")} {startItem}{" "}
                {t("activities.pagination.to")} {endItem}{" "}
                {t("activities.pagination.of")} {totalItems}{" "}
                {t("activities.pagination.activities")}
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
                  {t("activities.pagination.page")} {currentPage}{" "}
                  {t("activities.pagination.of")} {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-linear-to-r from-purple-50 to-blue-50 rounded-2xl p-6 shadow-md"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              {t("activities.insights.title")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">
                  {t("activities.insights.most_active")}
                </p>
                <p className="text-xl font-bold text-purple-600">
                  {stats?.actionStats?.length
                    ? getActionLabel(
                        stats.actionStats.reduce((a, b) =>
                          a.count > b.count ? a : b,
                        ).action,
                      )
                    : "N/A"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {t("activities.insights.most_active_desc")}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">
                  {t("activities.insights.today")}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats?.today || 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {t("activities.insights.today_desc")}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">
                  {t("activities.insights.employees")}
                </p>
                <p className="text-2xl font-bold text-amber-600">
                  {stats?.topEmployees?.length || 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {t("activities.insights.employees_desc")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
