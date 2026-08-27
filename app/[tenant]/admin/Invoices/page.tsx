"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Eye,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
  Users,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatsCard from "@/components/Cards/StatsCard";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";
import { InsightsGrid } from "@/components/tenantAdmin/InsightsGrid.tsx/Insights";
import { getInvoicesInsights } from "@/config/Insights";
import { statsInvoices } from "@/config/statsConfig";

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
    email: string;
  };
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [filterDate, setFilterDate] = useState("");

  const [filterEmployee, setFilterEmployee] = useState<string>("all");

  const [activeFilter, setActiveFilter] = useState<"all" | "today" | "month">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { t } = useTranslation();

  const fetchInvoices = async (showToast = false) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("tenant-token");
      const response = await fetch("http://187.124.0.42:3007/tenant/invoices", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        toast.error(t("invoices.refresh.error"));
        throw new Error("Failed to fetch invoices");
      }
      const data = await response.json();
      setInvoices(data);
      if (showToast) {
        toast.success(t("invoices.refresh.success"));
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error(t("invoices.refresh.error"));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  useEffect(() => {
    fetchInvoices(false);
  }, []);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchInvoices(true);
  };
  const employeeList = useMemo(() => {
    const employees = new Map<number, string>();
    invoices.forEach((invoice) => {
      if (invoice.employee?.id && invoice.employee?.name) {
        employees.set(invoice.employee.id, invoice.employee.name);
      }
    });
    return Array.from(employees.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [invoices]);

  const { stats, statCards } = statsInvoices(invoices, t);

  const insights = getInvoicesInsights(stats, t);
  const filteredInvoices = useMemo(() => {
    let filtered = invoices;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoiceNumber?.toLowerCase().includes(search) ||
          invoice.description?.toLowerCase().includes(search) ||
          invoice.employee?.name?.toLowerCase().includes(search) ||
          invoice.employee?.email?.toLowerCase().includes(search),
      );
    }

    if (filterDate) {
      const filterDateObj = new Date(filterDate);
      filterDateObj.setHours(0, 0, 0, 0);

      filtered = filtered.filter((invoice) => {
        const invDate = new Date(invoice.invoice_date);
        invDate.setHours(0, 0, 0, 0);
        return invDate.getTime() === filterDateObj.getTime();
      });
    }

    if (filterEmployee !== "all") {
      filtered = filtered.filter(
        (invoice) => invoice.employee?.id === Number(filterEmployee),
      );
    }

    if (activeFilter === "today") {
      const today = new Date();
      filtered = filtered.filter((inv) => {
        const invDate = new Date(inv.invoice_date);
        return (
          invDate.getDate() === today.getDate() &&
          invDate.getMonth() === today.getMonth() &&
          invDate.getFullYear() === today.getFullYear()
        );
      });
    } else if (activeFilter === "month") {
      const today = new Date();
      filtered = filtered.filter((inv) => {
        const invDate = new Date(inv.invoice_date);
        return (
          invDate.getMonth() === today.getMonth() &&
          invDate.getFullYear() === today.getFullYear()
        );
      });
    }

    return filtered;
  }, [invoices, searchTerm, filterDate, filterEmployee, activeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDate, filterEmployee, activeFilter]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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

  const handleFilterClick = (filter: "all" | "today" | "month") => {
    setActiveFilter(filter);
    setCurrentPage(1);
    if (filter === "today" || filter === "month") {
      setFilterDate("");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterDate("");
    setFilterEmployee("all");
    setActiveFilter("all");
    setCurrentPage(1);
  };

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

  const containerVariants = {
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

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
            {statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  onClick={() => {
                    handleFilterClick(card.filter);
                  }}
                  className={`relative group cursor-pointer rounded-2xl transition-all hover:scale-105 ${
                    activeFilter === card.filter
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
                  {activeFilter === card.filter && (
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
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="relative min-w-0">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder={t("invoices.filters.search_placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full min-w-0 pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => {
                        setFilterDate(e.target.value);
                        setActiveFilter("all");
                      }}
                      className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  </div>

                  {employeeList.length > 0 && (
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        value={filterEmployee}
                        onChange={(e) => {
                          setFilterEmployee(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="pl-10 pr-8 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm appearance-none bg-white"
                      >
                        <option value="all">
                          {t("invoices.filters.all_employees") ||
                            "All Employees"}
                        </option>
                        {employeeList.map((emp) => (
                          <option key={emp.id} value={String(emp.id)}>
                            {emp.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <Button
                    onClick={resetFilters}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    {t("invoices.filters.reset") || "Reset"}
                  </Button>
                  <Button
                    onClick={handleRefresh}
                    disabled={isRefreshing || isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                    {isRefreshing
                      ? t("invoices.filters.refreshing")
                      : t("invoices.filters.refresh")}
                  </Button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500">{t("invoices.loading")}</p>
              </div>
            ) : paginatedInvoices.length > 0 ? (
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paginatedInvoices.map((invoice, index) => {
                    const imageUrls = getImageUrls(invoice.images);
                    const hasMultipleImages = imageUrls.length > 1;

                    return (
                      <motion.div
                        key={invoice.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-purple-400 transition-all duration-300 shadow-sm hover:shadow-xl bg-white"
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
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
                              <FileText className="w-12 h-12 text-purple-300" />
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

                          {invoice.employee?.name && (
                            <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-lg">
                              {invoice.employee.name}
                            </span>
                          )}
                        </div>

                        <div className="p-3 space-y-1">
                          <p className="text-sm font-bold text-gray-800 truncate">
                            {invoice.invoiceNumber ||
                              `${t("invoices.invoice")} #${invoice.id}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(invoice.invoice_date)}
                          </p>
                          {invoice.description && (
                            <p className="text-[10px] text-gray-400 truncate">
                              {invoice.description}
                            </p>
                          )}
                          {hasMultipleImages && (
                            <p className="text-[10px] text-purple-500 font-medium">
                              {imageUrls.length} {t("invoices.card.images")}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-sm text-slate-500 text-center sm:text-left">
                    {t("invoices.pagination.showing")}{" "}
                    {filteredInvoices.length > 0
                      ? (currentPage - 1) * itemsPerPage + 1
                      : 0}{" "}
                    {t("invoices.pagination.to")}{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredInvoices.length,
                    )}{" "}
                    {t("invoices.pagination.of")} {filteredInvoices.length}{" "}
                    {t("invoices.pagination.invoices")}
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
                      {t("invoices.pagination.page")} {currentPage}{" "}
                      {t("invoices.pagination.of")} {totalPages || 1}
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
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="p-6 bg-purple-50 rounded-full mb-4">
                  <FileText className="w-12 h-12 text-purple-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600">
                  {t("invoices.no_data.title")}
                </h3>
                <p className="text-sm text-gray-400 mt-1 max-w-sm">
                  {searchTerm ||
                  filterDate ||
                  filterEmployee !== "all" ||
                  activeFilter !== "all"
                    ? t("invoices.no_data.no_results")
                    : t("invoices.no_data.description")}
                </p>
              </div>
            )}
          </motion.div>

          <InsightsGrid
            title={insights.title}
            items={insights.items}
            columns={3}
          />
        </div>
      </div>

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
