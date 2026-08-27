"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  Calendar,
  FileText,
  Building2,
  Phone,
  MapPin,
  Hash,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
  User,
  Info,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteProject,
  fetchProjectById,
  selectProjectsLoading,
  selectSelectedProject,
} from "@/store/slices/admin/projectsSlice";
import Link from "next/link";
import { DeleteConfirmModal } from "@/components/Modal/DeleteConfirmModal";
import { useTranslation } from "react-i18next";

type ProjectStatus = "planning" | "active" | "completed" | "cancelled";
interface StatusConfig {
  label: string;
  color: string;
  icon: React.ComponentType<any>;
}

export default function ProjectDetailsPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const projectId = params?.id as string;
  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const isLoading = useAppSelector(selectProjectsLoading);
  const project = useAppSelector(selectSelectedProject);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

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

  const fetchProjectData = async () => {
    setIsLoadingData(true);
    try {
      await dispatch(fetchProjectById(Number(projectId))).unwrap();
    } catch (error: any) {
      toast.error(error?.message || t("projectDetails.load_error"));
      router.back();
    } finally {
      setIsLoadingData(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return t("projectDetails.not_specified");
    return new Date(dateString).toLocaleDateString(
      t("locale") === "ar" ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  const getStatusConfig = (status: string | undefined): StatusConfig => {
    const statusMap: Record<string, StatusConfig> = {
      planning: {
        label: t("projects.status.planning"),
        color: "bg-amber-100 text-amber-700",
        icon: Clock,
      },
      active: {
        label: t("projects.status.active"),
        color: "bg-emerald-100 text-emerald-700",
        icon: CheckCircle,
      },
      completed: {
        label: t("projects.status.completed"),
        color: "bg-blue-100 text-blue-700",
        icon: CheckCircle,
      },
      cancelled: {
        label: t("projects.status.cancelled"),
        color: "bg-rose-100 text-rose-700",
        icon: AlertCircle,
      },
    };

    if (status && status in statusMap) {
      return statusMap[status];
    }
    return {
      label: status || t("projectDetails.unknown"),
      color: "bg-gray-100 text-gray-700",
      icon: AlertCircle,
    };
  };

  const projectStatus = project?.status as ProjectStatus | undefined;
  const statusInfo = getStatusConfig(projectStatus);

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-purple-600 animate-spin" />
          <p className="text-gray-600 font-medium">
            {t("projectDetails.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">
            {t("projectDetails.not_found")}
          </h2>
          <p className="text-gray-500 mt-2">
            {t("projectDetails.not_found_desc")}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {t("projectDetails.go_back")}
          </button>
        </div>
      </div>
    );
  }

  const tenantName = pathname.split("/")[1] || "";

  return (
    <div className="bg-linear-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10" />

      <div className="mx-auto space-y-8">
        <motion.div className="relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="inset-0 bg-linear-to-r from-indigo-500/10 to-cyan-500/10"></div>

          <div className="flex flex-col gap-5 p-5 md:flex-row">
            <div className="relative group">
              <div className="w-32 h-32 md:w-36 md:h-36">
                <div className="w-full h-full rounded-2xl bg-linear-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                  {project.name?.charAt(0).toUpperCase() || "P"}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 justify-center md:justify-start">
              <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {project.name}
              </h1>

              <p className="text-gray-500 flex items-center justify-start md:justify-start gap-2">
                <Building2 className="w-4 h-4" />
                {project.location || t("projectDetails.no_location")}
              </p>

              <div className="flex gap-3 justify-start md:justify-start flex-wrap">
                <span className="px-4 py-2 text-sm font-semibold rounded-full bg-blue-100 text-gray-700 shadow-sm">
                  {project.city || t("projectDetails.no_city")}
                </span>
                {project.postal_code && (
                  <span className="px-4 py-2 text-sm font-semibold rounded-full bg-purple-100 text-gray-700 shadow-sm">
                    {project.postal_code}
                  </span>
                )}
              </div>
            </div>
            <div
              className={`flex items-center flex-col justify-center gap-2 ${isRTL ? "mr-auto" : "ml-auto"} `}
            >
              <Link
                href={`/${tenantName}/admin/projects/edit/${project.id}/`}
                className="p-1 bg-white rounded-xl shadow-sm hover:shadow-md transition-all hover:bg-green-50"
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
                    name: project.name || "Unknown",
                  });
                }}
                className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all hover:bg-rose-50"
              >
                <Trash2 className="w-5 h-5 text-rose-600" />
              </button>
              <button
                onClick={() => router.back()}
                className=" p-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 border border-gray-200/50 group"
                aria-label={t("profile.back")}
              >
                {isRTL ? (
                  <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-indigo-600 transition-colors" />
                ) : (
                  <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-indigo-600 transition-colors" />
                )}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-linear-to-r from-purple-600 to-blue-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <Info className="w-6 h-6 text-white" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  {t("projectDetails.project_info")}
                </h2>
                <p className="text-purple-100 text-sm">
                  {t("projectDetails.project_info_desc")}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[
              {
                icon: FileText,
                label: t("projectDetails.description"),
                value:
                  project.description || t("projectDetails.no_description"),
                bg: "bg-blue-50",
                iconColor: "text-blue-600",
                fullWidth: true,
              },
              {
                icon: User,
                label: t("projectDetails.client_name"),
                value: project.client_name || t("projectDetails.not_specified"),
                bg: "bg-purple-50",
                iconColor: "text-purple-600",
              },
              {
                icon: Phone,
                label: t("projectDetails.client_phone"),
                value:
                  project.client_phone || t("projectDetails.not_specified"),
                bg: "bg-green-50",
                iconColor: "text-green-600",
              },
              {
                icon: MapPin,
                label: t("projectDetails.location"),
                value: project.location || t("projectDetails.not_specified"),
                bg: "bg-orange-50",
                iconColor: "text-orange-600",
              },
              {
                icon: Building2,
                label: t("projectDetails.city"),
                value: project.city || t("projectDetails.not_specified"),
                bg: "bg-indigo-50",
                iconColor: "text-indigo-600",
              },
              {
                icon: Hash,
                label: t("projectDetails.postal_code"),
                value: project.postal_code || t("projectDetails.not_specified"),
                bg: "bg-amber-50",
                iconColor: "text-amber-600",
              },
              {
                icon: Calendar,
                label: t("projectDetails.start_date"),
                value: formatDate(project.start_date),
                bg: "bg-emerald-50",
                iconColor: "text-emerald-600",
              },
              {
                icon: Calendar,
                label: t("projectDetails.end_date"),
                value: formatDate(project.end_date),
                bg:
                  project.end_date && new Date(project.end_date) < new Date()
                    ? "bg-rose-50"
                    : "bg-emerald-50",
                iconColor:
                  project.end_date && new Date(project.end_date) < new Date()
                    ? "text-rose-600"
                    : "text-emerald-600",
              },
              {
                icon: Clock,
                label: t("projectDetails.status"),
                value: statusInfo.label,
                bg: "bg-amber-50",
                iconColor: "text-amber-600",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className={`group flex items-center gap-4 p-4 rounded-2xl border border-gray-200 shadow-md transition-all ${
                    item.fullWidth ? "md:col-span-2 xl:col-span-3" : ""
                  }`}
                >
                  <div className={`${item.bg} p-3 rounded-xl shrink-0`}>
                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400 font-medium uppercase">
                      {item.label}
                    </p>

                    <p className="text-gray-800 font-semibold mt-1 truncate">
                      {item.value || t("projectDetails.not_provided")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
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
  );
}
