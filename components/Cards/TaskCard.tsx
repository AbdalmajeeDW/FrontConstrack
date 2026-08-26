import { Task } from "@/store/types/task.types";
import {
  getPriorityColor,
  getPriorityConfig,
} from "@/utils/constants/priorityTask";
import {
  Bus,
  CheckCircle,
  Clock,
  Users,
  X,
  Pencil,
  Trash2,
  ImageDown,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { formatDateOnly } from "@/utils/constants/formatDate";
import { toast } from "sonner";
import confirmAction from "../Confirm/confirmSystem";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";

export default function TaskCard({
  task,
  onView,
  isEmployees,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  task: Task;
  isEmployees?: boolean | false;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Task["status"]) => void;
}) {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";

  const getGradient = () => {
    const gradients = [
      "from-rose-400 to-orange-400",
      "from-blue-400 to-cyan-400",
      "from-emerald-400 to-teal-400",
      "from-purple-400 to-indigo-400",
      "from-pink-400 to-rose-400",
    ];
    return gradients[task.id % gradients.length];
  };

  const prioritySettings = getPriorityConfig(task.priority);
  const priorityColor = getPriorityColor(task.priority);

  const images = Array.isArray(task.images)
    ? task.images.filter((image) => Boolean(image))
    : [];
  const hasImages = images.length > 0;

  const statusConfig =
    task.status === "in_progress"
      ? {
          label: t("taskCard.status.in_progress"),
          className: "bg-blue-100 text-blue-700 border-blue-200",
          icon: Clock,
        }
      : {
          label: t("taskCard.status.completed"),
          className: "bg-green-100 text-green-700 border-green-200",
          icon: CheckCircle,
        };

  const StatusIcon = statusConfig.icon;

  return (
    <>
      <motion.div
        className="relative bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full"
        style={{
          boxShadow: "0 20px 35px -10px rgba(0,0,0,0.1)",
        }}
      >
        <div className={`h-2 bg-linear-to-r ${getGradient()}`} />
        <h3 className="text-lg mt-5 font-black text-gray-900 mb-2 flex justify-center leading-tight">
          {task.taskName}
        </h3>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-3">
            <div className="space-y-1">
              <div className="text-xs font-mono text-gray-400">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.className}`}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  {statusConfig.label}
                </div>
              </div>
            </div>
            <div
              className={`px-2 py-1 rounded-lg text-xs font-bold ${priorityColor}`}
            >
              {t(prioritySettings.labelKey)}
            </div>
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ImageDown className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-800">
                    {images.length}{" "}
                    {t("taskCard.images", { count: images.length })}
                  </div>
                  <div className="text-xs text-gray-400">
                    {t("taskCard.click_to_view")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                <Eye className="w-4 h-4" />
                {t("taskCard.view")} →
              </div>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-gray-50 rounded-xl p-2 text-center">
              <div className="text-lg font-bold text-gray-800">
                {formatDateOnly(task.endWork, locale)}
              </div>
              <div className="text-[10px] text-gray-400">
                {t("taskCard.due_date")}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-2 text-center">
              <div className="text-lg font-bold text-gray-800">
                {task.work_area ? `${task.work_area}` : "—"}
              </div>
              <div className="text-[10px] text-gray-400">
                {t("taskCard.area")}
              </div>
            </div>
            {task.city && (
              <div className="bg-gray-50 rounded-xl p-2 text-center col-span-2">
                <div className="text-sm font-medium text-gray-800">
                  {task.city}
                </div>
                <div className="text-[10px] text-gray-400">
                  📍 {t("taskCard.location")}
                </div>
              </div>
            )}
          </div>

          <div>
            {(task.bus_number || task.driver_name) && (
              <div className="bg-blue-50 rounded-xl p-2 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bus className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    {task.bus_number && (
                      <div className="text-xs font-bold">
                        {t("taskCard.bus")} {task.bus_number}
                      </div>
                    )}
                    {task.driver_name && (
                      <div className="text-[10px] text-gray-500">
                        {t("taskCard.driver")}: {task.driver_name}
                      </div>
                    )}
                  </div>
                </div>
                {task.worker_arrival_time && (
                  <div className="text-right">
                    <div className="text-xs font-bold">
                      {task.worker_arrival_time}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {t("taskCard.arrival_time")}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="min-h-10.5">
            {task.employees && task.employees.length > 0 && (
              <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-xl">
                <Users className="w-4 h-4 text-gray-400" />
                <div className="flex gap-1 text-xs text-gray-600">
                  {task.employees.map((emp) => (
                    <span key={emp.id}>{emp.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-around gap-1 pt-2">
            {!isEmployees && (
              <button
                className={`w-full rounded-xl p-4 cursor-pointer flex items-center justify-center transition-all ${
                  task.status === "in_progress"
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 text-blue-400 hover:bg-blue-200"
                }`}
                title={t("taskCard.in_progress_title")}
                onClick={() => {
                  if (task.status === "in_progress") {
                    toast.info(
                      t("taskCard.already_in_progress", {
                        name: task.taskName,
                      }),
                    );
                  } else {
                    confirmAction(t("taskCard.confirm_in_progress"), () => {
                      onStatusChange(task.id, "in_progress");
                    });
                  }
                }}
              >
                <Clock className="w-4 h-4" />
              </button>
            )}
            {!isEmployees && (
              <button
                className={`w-full p-4 rounded-xl cursor-pointer flex items-center justify-center transition-all ${
                  task.status === "done"
                    ? "bg-green-500 text-white"
                    : "bg-green-100 text-green-400 hover:bg-green-200"
                }`}
                title={t("taskCard.completed_title")}
                onClick={() => {
                  if (task.status === "done") {
                    toast.info(
                      t("taskCard.already_completed", { name: task.taskName }),
                    );
                  } else {
                    confirmAction(
                      t("taskCard.confirm_completed", { name: task.taskName }),
                      () => {
                        onStatusChange(task.id, "done");
                      },
                    );
                  }
                }}
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            <button
              className={`w-full p-4 rounded-xl cursor-pointer flex items-center justify-center transition-all bg-purple-100 text-purple-400 hover:bg-purple-200`}
              title={t("taskCard.edit_title")}
              onClick={() => onEdit(task.id)}
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            {!isEmployees && (
              <button
                className={`w-full p-2 rounded-xl cursor-pointer flex items-center justify-center transition-all bg-red-200 text-red-600 hover:bg-red-600 hover:text-white`}
                title={t("taskCard.delete_title")}
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/20" />
      </motion.div>

      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] w-full bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("taskCard.images_title")}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {task.taskName} - {images.length}{" "}
                  </p>
                </div>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                {images.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <ImageDown className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{t("taskCard.no_images")}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <motion.div
                        key={`${image}-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative group aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
                        onClick={() => setSelectedImage(image)}
                      >
                        <Image
                          src={`http://187.124.0.42:3007${image}`}
                          alt={`Task image ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          #{index + 1}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                            <Eye className="w-5 h-5" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors flex items-center gap-2"
              >
                <X className="w-6 h-6" />
                <span className="text-sm">{t("taskCard.close")}</span>
              </button>
              <div className="relative bg-black/20 rounded-xl overflow-hidden">
                <Image
                  src={`http://187.124.0.42:3007${selectedImage}`}
                  alt="Selected image"
                  width={1200}
                  height={800}
                  className="max-h-[80vh] w-auto object-contain"
                  unoptimized
                />
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                {t("taskCard.click_to_close")}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
