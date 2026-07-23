"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  Eye,
  FileText,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
 
  Users,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Calendar,
  Printer,
  Mail,
  Zap,
  HardDrive,
  Target,
  Award,
  Euro,
} from "lucide-react";
import Link from "next/link";
import StatsCard from "@/components/Cards/StatsCard";

// Types
type ReportStatus = "ready" | "processing" | "draft" | "failed";
type ReportCategory = "project" | "financial" | "hr" | "quality" | "resource";

interface Report {
  id: number;
  name: string;
  category: ReportCategory;
  description: string;
  generatedAt: string;
  status: ReportStatus;
  size: string;
  views: number;
  downloads: number;
  generatedBy: string;
}



// Mock Data
const mockReports: Report[] = [
  {
    id: 1,
    name: "Maandelijkse Voortgangsrapportage",
    category: "project",
    description:
      "Volledig overzicht van alle projectvoortgang en mijlpalen voor juni 2026",
    generatedAt: "2026-06-28T10:30:00",
    status: "ready",
    size: "2.4 MB",
    views: 45,
    downloads: 23,
    generatedBy: "Jan de Vries",
  },
  {
    id: 2,
    name: "Kwartaal 2 Financiële Analyse",
    category: "financial",
    description:
      "Begrotingsanalyse, kostenverdeling en financiële prognoses voor Q2",
    generatedAt: "2026-06-27T14:15:00",
    status: "ready",
    size: "1.8 MB",
    views: 38,
    downloads: 19,
    generatedBy: "Emma Jansen",
  },
  {
    id: 3,
    name: "Team Prestatie Rapport",
    category: "hr",
    description:
      "Productiviteit van werknemers, taakvoltooiingspercentages en teamefficiëntie",
    generatedAt: "2026-06-26T09:45:00",
    status: "processing",
    size: "3.1 MB",
    views: 12,
    downloads: 5,
    generatedBy: "Pieter van der Meer",
  },
  {
    id: 4,
    name: "Kwaliteits- en Veiligheidsaudit",
    category: "quality",
    description: "Veiligheidsincidenten, kwaliteitsmetrics en nalevingsrapport",
    generatedAt: "2026-06-25T16:20:00",
    status: "ready",
    size: "4.2 MB",
    views: 28,
    downloads: 14,
    generatedBy: "Sophie Bakker",
  },
  {
    id: 5,
    name: "Middelenallocatierapport",
    category: "resource",
    description:
      "Distributie van middelen, apparatuurgebruik en materiaaltracking",
    generatedAt: "2026-06-24T11:00:00",
    status: "draft",
    size: "1.2 MB",
    views: 8,
    downloads: 2,
    generatedBy: "Lars van den Berg",
  },
  {
    id: 6,
    name: "Project Tijdspad Analyse",
    category: "project",
    description: "Schemaprestatie, vertragingen en tijdlijnvoorspellingen",
    generatedAt: "2026-06-23T13:30:00",
    status: "ready",
    size: "3.7 MB",
    views: 34,
    downloads: 17,
    generatedBy: "Fenna de Boer",
  },
  {
    id: 7,
    name: "Begrotingsafwijkingenrapport",
    category: "financial",
    description:
      "Analyse van begrotingsafwijkingen voor alle actieve projecten",
    generatedAt: "2026-06-22T10:00:00",
    status: "failed",
    size: "0 KB",
    views: 0,
    downloads: 0,
    generatedBy: "Jan de Vries",
  },
];

// Configurations
const categoryConfig = {
  project: {
    label: "Project",
    color: "bg-purple-100 text-purple-700",
    icon: Building2,
  },
  financial: {
    label: "Financial",
    color: "bg-emerald-100 text-emerald-700",
    icon: Euro,
  },
  hr: { label: "HR", color: "bg-blue-100 text-blue-700", icon: Users },
  quality: {
    label: "Quality",
    color: "bg-amber-100 text-amber-700",
    icon: Award,
  },
  resource: {
    label: "Resource",
    color: "bg-rose-100 text-rose-700",
    icon: HardDrive,
  },
};

const statusConfig = {
  ready: {
    label: "Ready",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle,
  },
  processing: {
    label: "Processing",
    color: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700", icon: FileText },
  failed: {
    label: "Failed",
    color: "bg-blue-100 text-blue-700",
    icon: AlertCircle,
  },
};

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredReports = useMemo(() => {
    let result = mockReports;

    if (searchTerm) {
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.generatedBy.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterCategory !== "all") {
      result = result.filter((r) => r.category === filterCategory);
    }

    if (filterStatus !== "all") {
      result = result.filter((r) => r.status === filterStatus);
    }

    return result;
  }, [searchTerm, filterCategory, filterStatus]);

  const stats = {
    total: mockReports.length,
    ready: mockReports.filter((r) => r.status === "ready").length,
    processing: mockReports.filter((r) => r.status === "processing").length,
    totalDownloads: mockReports.reduce((sum, r) => sum + r.downloads, 0),
    totalViews: mockReports.reduce((sum, r) => sum + r.views, 0),
  };

const StatCard = [
  {
    title: "Total Reports",
    value: stats.total,
    gradient: "from-emerald-500 to-blue-500",
    bgColor: "bg-emerald-100 text-emerald-700",
    icon: <FileText />,
    description: "All reports created across the platform",
    color: "from-emerald-500 to-blue-500",
  },
  {
    title: "Ready Reports",
    value: stats.ready,
    gradient: "from-emerald-500 to-blue-500",
    bgColor: "bg-emerald-100 text-emerald-700",
    icon: <CheckCircle />,
    description: "Reports finalized and available for download",
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Total Downloads",
    value: stats.totalDownloads,
    gradient: "from-emerald-500 to-blue-500",
    bgColor: "bg-amber-100 text-amber-700",
    icon: <Download />,
    description: "Total download count across all reports",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Total Views",
    value: stats.totalViews,
    gradient: "from-emerald-500 to-blue-500",
    bgColor: "bg-emerald-100 text-emerald-700",
    icon: <Eye />,
    description: "Total views across all reports",
    color: "from-amber-500 to-orange-500",
  },
];

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>

      <div className="lg:ml-0">
        <div className="mx-auto p-6 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                Reports & Analytics
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Generate, manage, and analyze reports across all projects
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Calendar className="w-4 h-4" />
                This Month
              </button>
              <Link href="/reports/new">
                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-purple-500 to-blue-500 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-md">
                  <PlusCircle className="w-4 h-4" />
                  Generate Report
                </button>
              </Link>
            </div>
          </div>

          {/* Metrics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {StatCard.map((metric, index) => (
              <StatsCard key={index} {...metric} />
            ))}
          </motion.div>

          {/* Quick Actions */}
          <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-purple-600" />
                <div>
                  <h4 className="font-medium text-gray-800">Quick Actions</h4>
                  <p className="text-sm text-gray-500">
                    Generate reports or export data instantly
                  </p>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:shadow-md transition-all text-sm border border-gray-200">
                  <Download className="w-4 h-4" />
                  Export All
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:shadow-md transition-all text-sm border border-gray-200">
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:shadow-md transition-all text-sm border border-gray-200">
                  <Mail className="w-4 h-4" />
                  Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg"
          >
            {/* Filters */}
            <div className="p-4 border-b border-slate-200 bg-white">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="relative min-w-0">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search reports by name, description, or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full min-w-0 pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Categories</option>
                    {Object.entries(categoryConfig).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Status</option>
                    {Object.entries(statusConfig).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto overflow-y-hidden rounded-2xl w-full">
              <table className="table-auto w-full">
                <thead className="bg-linear-to-r from-purple-500 to-blue-500">
                  <tr>
                    <th className="text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Report
                    </th>
                    <th className="text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Category
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="hidden md:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Generated
                    </th>
                    <th className="hidden lg:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Views
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedReports.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
                          <FileText className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-1">
                          No reports found
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Try adjusting your search or filters
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedReports.map((report, idx) => {
                      const CategoryIcon = categoryConfig[report.category].icon;
                      const StatusIcon = statusConfig[report.status].icon;
                      const categoryColor =
                        categoryConfig[report.category].color;
                      const statusColor = statusConfig[report.status].color;

                      return (
                        <motion.tr
                          key={report.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-slate-50 transition-colors group"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-purple-600" />
                              </div>
                              <div className="flex-1 text-center">
                                <p className="truncate font-medium text-slate-900 group-hover:text-purple-600 transition-colors text-sm">
                                  {report.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}
                            >
                              <CategoryIcon className="w-3 h-3" />
                              {categoryConfig[report.category].label}
                            </span>
                          </td>
                          <td className="hidden sm:table-cell px-4 py-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig[report.status].label}
                            </span>
                          </td>
                          <td className="hidden md:table-cell px-4 py-3">
                            <div className="text-center">
                              <p className="text-sm text-slate-700">
                                {formatDate(report.generatedAt)}
                              </p>
                              <p className="text-xs text-slate-400">
                                {formatTime(report.generatedAt)}
                              </p>
                            </div>
                          </td>
                          <td className="hidden lg:table-cell px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-3 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3 text-slate-400" />
                                {report.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Download className="w-3 h-3 text-slate-400" />
                                {report.downloads}
                              </span>
                            </div>
                          </td>
                          <td className="hidden sm:table-cell px-4 py-3 text-center text-sm text-slate-600">
                            {report.size}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                                title="View Report"
                              >
                                <Eye className="w-4 h-4 text-slate-500" />
                              </button>
                              <button
                                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Download"
                              >
                                <Download className="w-4 h-4 text-slate-500" />
                              </button>
                              <button
                                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                                title="More"
                              >
                                <FileText className="w-4 h-4 text-slate-500" />
                              </button>
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
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredReports.length)}{" "}
                of {filteredReports.length} reports
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
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 col-span-1">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-500" />
                Category Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(categoryConfig).map(([key, value]) => {
                  const count = mockReports.filter(
                    (r) => r.category === key,
                  ).length;
                  const percentage = Math.round(
                    (count / mockReports.length) * 100,
                  );
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{value.label}</span>
                        <span className="font-medium text-gray-800">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${value.color.replace("text-", "")} rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 col-span-1">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" />
                Report Status
              </h3>
              <div className="space-y-3">
                {Object.entries(statusConfig).map(([key, value]) => {
                  const count = mockReports.filter(
                    (r) => r.status === key,
                  ).length;
                  const percentage = Math.round(
                    (count / mockReports.length) * 100,
                  );
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{value.label}</span>
                        <span className="font-medium text-gray-800">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${value.color.replace("text-", "")} rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 col-span-1">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Quick Insights
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-600">Most Generated</span>
                  <span className="text-sm font-semibold text-purple-600">
                    Project Reports
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <span className="text-sm text-gray-600">Avg. Views</span>
                  <span className="text-sm font-semibold text-emerald-600">
                    {Math.round(
                      mockReports.reduce((sum, r) => sum + r.views, 0) /
                        mockReports.length,
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <span className="text-sm text-gray-600">Total Downloads</span>
                  <span className="text-sm font-semibold text-amber-600">
                    {stats.totalDownloads}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
