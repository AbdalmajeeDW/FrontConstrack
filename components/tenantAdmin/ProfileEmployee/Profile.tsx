"use client";
import { DeleteConfirmModal } from "@/components/Modal/DeleteConfirmModal";
import { useAppDispatch } from "@/store/hooks";
import { deleteEmployeeById } from "@/store/slices/admin/employeeSlice";
import { EmployeeUser } from "@/store/types/employee.types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Edit,
  Eye,
  FileText,
  Mail,
  Phone,
  Shield,
  Trash2,
  User,
  UserX,
  Search,
  Filter,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { statsProfileAdmin } from "@/config/statsConfig";
import { getSpecializationLabel } from "@/utils/constants/specializationOptions";

interface EmployeeProfileProps {
  employee: EmployeeUser;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  invoice_date: string;
  description: string;
  images: string[];
  employeeId: number;
  createdAt: string;
  employee: {
    id: number;
    name: string;
  };
}

export default function ProfilePage({ employee }: EmployeeProfileProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const fullName = employee.name;
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const [filterDate, setFilterDate] = useState(today);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const age = calculateAge(employee.birth_date);
  const { statsCard } = statsProfileAdmin(age, employee, t);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const tenantName = pathname.split("/")[1] || "";

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!employee?.id) {
        setIsLoadingInvoices(false);
        return;
      }

      setIsLoadingInvoices(true);
      try {
        const token = localStorage.getItem("tenant-token");
        const response = await fetch(
          `http://187.124.0.42:3007/tenant/invoices/employee/${employee.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch invoices");
        }
        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error(t("profile.invoices_error"));
      } finally {
        setIsLoadingInvoices(false);
      }
    };

    fetchInvoices();
  }, [employee?.id, t]);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
    const date = new Date(dateString);
    const timezoneOffset = date.getTimezoneOffset();
    const offsetHours = -timezoneOffset / 60;
    date.setHours(date.getHours() + offsetHours);

    return date.toLocaleString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      await dispatch(deleteEmployeeById(id)).unwrap();
      toast.success(t("profile.delete_success"));
      router.back();
      setDeleteModal(null);
    } catch (err: any) {
      toast.error(err || t("profile.delete_error"));
    } finally {
      setIsDeleting(false);
    }
  };

  const getImageUrls = (images: string[]) => {
    if (images && images.length > 0) {
      return images.map((img) => `http://187.124.0.42:3007${img}`);
    }
    return [];
  };

  const openGallery = (images: string[]) => {
    const urls = getImageUrls(images);
    if (urls.length > 0) {
      setGalleryImages(urls);
      setCurrentImageIndex(0);
      setIsGalleryOpen(true);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = filterDate
      ? new Date(invoice.invoice_date).toDateString() ===
        new Date(filterDate).toDateString()
      : true;

    return matchesSearch && matchesDate;
  });

  const employeeInvoices = filteredInvoices.filter(
    (e) => e.employee.id === employee.id,
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="mx-auto space-y-8">
        <motion.div className="relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 to-cyan-500/10"></div>

          <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-6 p-6 lg:p-8">
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="relative group">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                  {fullName?.charAt(0)?.toUpperCase() || "?"}
                </div>
              </div>

              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                  employee.is_active
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}
              >
                {employee.is_active
                  ? t("profile.active")
                  : t("profile.inactive")}
              </span>
            </div>

            <div className={`flex-1 min-w-0  ${isRTL ? "mr-auto" : "ml-auto"}`}>
              <div className="flex items-center justify-center lg:justify-start gap-2 mt-1 text-gray-500">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="text-sm break-all">{employee.email}</span>
              </div>{" "}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent break-words">
                {fullName}
              </h1>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mt-3">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
                  <Shield className="w-3.5 h-3.5" />
                  {t("profile.employee")}
                </span>
                {employee.specialization && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200 shadow-sm">
                    <Briefcase className="w-3.5 h-3.5" />
                    {getSpecializationLabel(employee.specialization, t)}
                  </span>
                )}
                {employee.phone && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200 shadow-sm">
                    <Phone className="w-3.5 h-3.5" />
                    {employee.phone}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/${tenantName}/admin/employees/edit/${employee.id}`}
                className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all hover:bg-green-50 border border-gray-200 hover:border-green-200"
              >
                <Edit className="w-5 h-5 text-green-500" />
              </Link>
              <button
                onClick={() => {
                  setDeleteModal({
                    id: employee.id!,
                    name: employee.name || "Unknown",
                  });
                }}
                className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all hover:bg-rose-50 border border-gray-200 hover:border-rose-200"
              >
                <Trash2 className="w-5 h-5 text-rose-600" />
              </button>
            </div>
          </div>

          <div className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"></div>
        </motion.div>

        <motion.div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-linear-to-r from-purple-600 to-blue-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  {t("profile.personal_info")}
                </h2>

                <p className="text-purple-100 text-sm">
                  {t("profile.personal_info_desc")}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {statsCard.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="group flex items-center gap-4 p-4 rounded-2xl border border-gray-200 shadow-md transition-all hover:shadow-lg hover:border-purple-200"
                >
                  <div className={`${item.bg} p-3 rounded-xl shrink-0`}>
                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400 font-medium uppercase">
                      {item.label}
                    </p>

                    <p className="text-gray-800 font-semibold mt-1 truncate">
                      {item.value || t("profile.not_provided")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Invoice Documents */}
        <motion.div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-linear-to-r from-amber-500 to-orange-500 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  {t("profile.invoice_documents")}
                </h2>

                <p className="text-amber-100 text-sm">
                  {t("profile.invoice_documents_desc")}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("profile.search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 outline-none transition-all"
                />
              </div>
            </div>

            {isLoadingInvoices ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500">
                  {t("profile.loading_invoices")}
                </p>
              </div>
            ) : employeeInvoices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {employeeInvoices.map((invoice, index) => {
                  const imageUrls = getImageUrls(invoice.images);
                  const hasMultipleImages = imageUrls.length > 1;

                  return (
                    <motion.div
                      key={invoice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-xl bg-white"
                    >
                      <div
                        className="relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer"
                        onClick={() =>
                          imageUrls.length > 0 && openGallery(invoice.images)
                        }
                      >
                        {imageUrls.length > 0 ? (
                          <>
                            <img
                              src={imageUrls[0]}
                              alt={invoice.invoiceNumber || "Invoice"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {hasMultipleImages && (
                              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" />
                                {imageUrls.length}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                            <FileText className="w-12 h-12 text-amber-300" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {imageUrls.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openGallery(invoice.images);
                            }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                          >
                            <Eye className="w-5 h-5 text-gray-700" />
                          </button>
                        )}

                        <span className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-mono px-2.5 py-1 rounded-lg shadow-lg">
                          #{index + 1}
                        </span>

                        {invoice.employee.name && (
                          <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-lg">
                            {invoice.employee?.name}
                          </span>
                        )}
                      </div>

                      <div className="p-3 space-y-1">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {t("profile.employee_name")}: {invoice.employee?.name}
                        </p>

                        <p className="text-[15px] text-gray-400">
                          {formatDateTime(invoice.invoice_date)}
                        </p>
                        {invoice.description && (
                          <p className="text-[10px] text-gray-500 truncate">
                            {invoice.description}
                          </p>
                        )}
                        {hasMultipleImages && (
                          <p className="text-[10px] text-amber-500 font-medium">
                            {imageUrls.length} {t("profile.images")}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="p-6 bg-amber-50 rounded-full mb-4">
                  <FileText className="w-12 h-12 text-amber-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600">
                  {t("profile.no_invoices")}
                </h3>
                <p className="text-sm text-gray-400 mt-1 max-w-sm">
                  {searchTerm || filterDate
                    ? t("profile.no_results")
                    : t("profile.no_invoices_desc")}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={() => handleDelete(deleteModal!.id)}
        title={t("profile.delete_title")}
        itemType="employee"
        itemName={deleteModal?.name}
        confirmText={t("profile.delete_confirm")}
        isLoading={isDeleting}
        icon={<UserX className="w-6 h-6 text-red-600" />}
      />

      <AnimatePresence>
        {isGalleryOpen && galleryImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsGalleryOpen(false)}
          >
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="absolute top-4 left-4 text-white/80 text-sm">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages[currentImageIndex]}
                alt={`Invoice ${currentImageIndex + 1}`}
                className="w-full h-full max-h-[85vh] object-contain rounded-2xl"
              />

              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                    {galleryImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? "bg-white w-8"
                            : "bg-white/40 hover:bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
