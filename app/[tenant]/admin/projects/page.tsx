"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Plus,
  Map,
  Trash2,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import StatsCard from "@/components/Cards/StatsCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteProject,
  fetchProjects,
} from "@/store/slices/admin/projectsSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatDateOnly } from "@/utils/constants/formatDate";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { DeleteConfirmModal } from "@/components/Modal/DeleteConfirmModal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { InsightsGrid } from "@/components/tenantAdmin/InsightsGrid.tsx/Insights";
import { getProjectsInsights } from "@/config/Insights";

export default function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const itemsPerPage = 10;
  const router = useRouter();
  const pathname = usePathname();
  const [deleteModal, setDeleteModal] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const tenantName = pathname.split("/")[1] || "";
  const dispatch = useAppDispatch();
  const projects = useSelector((state: RootState) => state.projects.projects);
  const { isLoading, error } = useAppSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const formatDate = (dateString: string | null | undefined) => {
    const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getActiveProjects = (projects: any[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return projects.filter((p) => {
      // ✅ استثناء المكتملة والملغية
      if (p.status === "completed" || p.status === "cancelled") return false;

      // ✅ لا يوجد تاريخ بداية
      if (!p.start_date) return false;

      const startDate = new Date(p.start_date);
      startDate.setHours(0, 0, 0, 0);

      // ✅ بدأت (start_date <= today)
      if (startDate > today) return false;

      // ✅ إذا كان هناك تاريخ انتهاء، تأكد من أنه لم ينتهي بعد
      if (p.end_date) {
        const endDate = new Date(p.end_date);
        endDate.setHours(0, 0, 0, 0);
        if (endDate < today) return false;
      }

      return true;
    });
  };

  const getOverdueProjects = (projects: any[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return projects.filter((p) => {
      if (p.status === "completed" || p.status === "cancelled") return false;

      if (!p.end_date) return false;

      const endDate = new Date(p.end_date);
      endDate.setHours(0, 0, 0, 0);

      return endDate < today;
    });
  };
  const stats = {
    totalProjects: projects.length,
    activeProjects: getActiveProjects(projects).length,
    completedProjects: projects.filter((p) => p.status === "completed").length,
    overdueProjects: getOverdueProjects(projects).length,
  };

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (project) =>
          project.name?.toLowerCase().includes(search) ||
          project.client_name?.toLowerCase().includes(search) ||
          project.city?.toLowerCase().includes(search) ||
          project.location?.toLowerCase().includes(search),
      );
    }

    if (filterStatus !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      result = result.filter((project) => {
        if (filterStatus === "overdue") {
          if (project.status === "completed" || project.status === "cancelled")
            return false;
          if (!project.end_date) return false;
          const endDate = new Date(project.end_date);
          endDate.setHours(0, 0, 0, 0);
          return endDate < today;
        }

        if (filterStatus === "active") {
          if (project.status === "completed" || project.status === "cancelled")
            return false;

          if (!project.start_date) return false;

          const startDate = new Date(project.start_date);
          startDate.setHours(0, 0, 0, 0);

          if (startDate > today) return false;

          if (project.end_date) {
            const endDate = new Date(project.end_date);
            endDate.setHours(0, 0, 0, 0);
            if (endDate < today) return false;
          }

          return true;
        }

        if (filterStatus === "planning") {
          if (project.status === "completed" || project.status === "cancelled")
            return false;

          if (!project.start_date) return true;
          const startDate = new Date(project.start_date);
          startDate.setHours(0, 0, 0, 0);
          return startDate > today;
        }

        return true;
      });
    }

    return result;
  }, [projects, searchTerm, filterStatus]);

  const cityCount = projects.reduce(
    (acc, p) => {
      if (!p.city) return acc;
      acc[p.city] = (acc[p.city] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const mostActiveCityEntry = Object.entries(cityCount).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const mostActiveCity = mostActiveCityEntry?.[0] || "N/A";
  const mostActiveCityCount = mostActiveCityEntry?.[1] || 0;

  const newestProject = [...projects].sort(
    (a, b) =>
      new Date(b.created_at ?? "").getTime() -
      new Date(a.created_at ?? "").getTime(),
  )[0];

  const now = new Date();
  const endingThisMonth = projects.filter((p) => {
    if (!p.end_date) return false;
    const end = new Date(p.end_date);
    return (
      end.getFullYear() === now.getFullYear() &&
      end.getMonth() === now.getMonth() &&
      p.status !== "completed" &&
      p.status !== "cancelled"
    );
  }).length;

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      await dispatch(deleteProject(id)).unwrap();
      toast.success(t("projects.delete_success"));
      setDeleteModal(null);
    } catch (error: any) {
      toast.error(error?.message || t("projects.delete_error"));
    } finally {
      setIsDeleting(false);
    }
  };

  const containerVariants = {
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const statCards = [
    {
      title: t("projects.stats.total"),
      value: stats.totalProjects,
      icon: <Building2 className="w-6 h-6 text-purple-600" />,
      gradient: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      description: t("projects.stats.total_desc"),
      ringColor: "ring-purple-600",
      filter: "all" as const,
    },
    {
      title: t("projects.stats.active"),
      value: stats.activeProjects,
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      description: t("projects.stats.active_desc"),
      filter: "active" as const,
      ringColor: "ring-blue-600",
    },

    {
      title: t("projects.stats.overdue"),
      value: stats.overdueProjects,
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      gradient: "from-red-500 to-rose-500",
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      description: t("projects.stats.overdue_desc"),
      filter: "overdue" as const,
      ringColor: "ring-red-600",
    },
  ];
  const insights = getProjectsInsights(
    stats,
    mostActiveCity,
    newestProject,
    endingThisMonth,
    t,
  );
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
                  setFilterStatus(card.filter);
                  setCurrentPage(1);
                }}
                className={`relative group cursor-pointer rounded-2xl transition-all hover:scale-105 ${
                  filterStatus === card.filter ? `ring-2 ${card.ringColor}` : ""
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
                {filterStatus === card.filter && (
                  <span className="absolute top-2 right-2 text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">
                    ✓
                  </span>
                )}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg"
          >
            <div className="p-4 border-b border-slate-200 bg-white">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="relative min-w-0">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder={t("projects.search_placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full min-w-0 pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() =>
                      router.push(`/${tenantName}/admin/projects/create`)
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t("projects.new_project")}</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-hidden rounded-2xl w-full">
              <table className="table-auto w-full">
                <thead className="bg-linear-to-r from-purple-500 to-blue-500">
                  <tr>
                    <th className="text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      {t("projects.table.name")}
                    </th>
                    <th className="text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      {t("projects.table.location")}
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      {t("projects.table.client_name")}
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      {t("projects.table.client_phone")}
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      {t("projects.table.city")}
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      {t("projects.table.time")}
                    </th>

                    <th className="text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      {t("projects.table.action")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedProjects.length > 0 ? (
                    paginatedProjects.map((project, idx) => {
                      const isOverdue =
                        project.end_date &&
                        new Date(project.end_date) < new Date() &&
                        project.status !== "completed" &&
                        project.status !== "cancelled";

                      return (
                        <motion.tr
                          key={project.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-slate-100 transition-colors group cursor-pointer"
                          onClick={() =>
                            router.push(
                              `/${tenantName}/admin/projects/${project.id}`,
                            )
                          }
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                                <span className="text-purple-600 font-medium text-sm uppercase">
                                  {project.name?.charAt(0) || "?"}
                                </span>
                              </div>
                              <div className="flex-1 text-center">
                                <p className="truncate font-medium text-slate-900 group-hover:text-purple-600 transition-colors">
                                  {project.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="truncate block max-w-full text-sm text-slate-600">
                              {project.location || "-"}
                            </span>
                          </td>
                          <td className="hidden sm:table-cell px-4 py-3 text-center">
                            <span className="truncate block max-w-full text-sm text-slate-600">
                              {project.client_name || "-"}
                            </span>
                          </td>
                          <td className="hidden sm:table-cell px-4 py-3 text-center">
                            <span className="truncate block max-w-full text-sm text-slate-600">
                              {project.client_phone || "-"}
                            </span>
                          </td>
                          <td className="hidden sm:table-cell px-4 py-3 text-center">
                            <span className="truncate block max-w-full text-sm text-slate-600">
                              {project.city || "-"}
                            </span>
                          </td>
                          <td className="hidden sm:table-cell px-4 py-3">
                            <div className="flex flex-col items-center justify-center gap-0.5 text-sm text-slate-600">
                              <span className="text-xs">
                                {t("projects.start")}:{" "}
                                {formatDate(project.start_date)}
                              </span>
                              <span className="text-xs">
                                {t("projects.end")}:{" "}
                                {formatDate(project.end_date)}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                onClick={(e) => e.stopPropagation()}
                                href={`/${tenantName}/admin/projects/${project.id}`}
                              >
                                <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                                  <Eye className="w-4 h-4 text-blue-500" />
                                </button>
                              </Link>
                              <Link
                                onClick={(e) => e.stopPropagation()}
                                href={`/${tenantName}/admin/projects/edit/${project.id}`}
                              >
                                <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                                  <Edit className="w-4 h-4 text-green-500" />
                                </button>
                              </Link>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteModal({
                                    id: project.id!,
                                    name: project.name,
                                  });
                                }}
                                className="p-1.5 cursor-pointer hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">
                          {t("projects.no_projects") || "لا توجد مشاريع"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {searchTerm || filterStatus !== "all"
                            ? t("projects.no_results") ||
                              "لا توجد نتائج تطابق الفلاتر"
                            : t("projects.start_adding") ||
                              "ابدأ بإضافة مشاريع"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-slate-500 text-center sm:text-left">
                {t("projects.pagination.showing")}{" "}
                {filteredProjects.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}{" "}
                {t("projects.pagination.to")}{" "}
                {Math.min(currentPage * itemsPerPage, filteredProjects.length)}{" "}
                {t("projects.pagination.of")} {filteredProjects.length}{" "}
                {t("projects.pagination.projects")}
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
                  {t("projects.pagination.page")} {currentPage}{" "}
                  {t("projects.pagination.of")} {totalPages || 1}
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
        </div>

        <DeleteConfirmModal
          isOpen={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={() => handleDelete(deleteModal!.id)}
          title={t("projects.delete_title")}
          itemType="project"
          itemName={deleteModal?.name}
          confirmText={t("projects.delete_confirm")}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
