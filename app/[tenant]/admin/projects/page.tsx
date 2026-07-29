"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  Edit,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Plus,
  Map,
} from "lucide-react";
import Link from "next/link";
import StatsCard from "@/components/Cards/StatsCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProjects } from "@/store/slices/admin/projectsSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatDateOnly } from "@/utils/constants/formatDate";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const itemsPerPage = 10;
  const router = useRouter();
  const pathname = usePathname();

  const tenantName = pathname.split("/")[1] || "";
  const dispatch = useAppDispatch();
  const projects = useSelector((state: RootState) => state.projects.projects);
  const { isLoading, error } = useAppSelector((state) => state.projects);
  console.log(isLoading);

  const filteredProjects = useMemo(() => {
    let result = projects;

    if (searchTerm) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((p) => p.status === filterStatus);
    }

    // if (filterPriority !== "all") {
    //   result = result.filter((p) => p.priority === filterPriority);
    // }

    return result;
  }, [projects,searchTerm, filterStatus, filterPriority]);

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    completedProjects: projects.filter((p) => p.status === "completed").length,
    onHoldProjects: projects.filter((p) => p.status === "planning").length,
  };

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return `${amount}`;
  };

  const containerVariants = {
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: <Building2 className="w-6 h-6 text-purple-600" />,
      gradient: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      description: "All projects",
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      icon: <Clock className="w-6 h-6 text-emerald-600" />,
      gradient: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600",
      description: "Currently in progress",
    },
    {
      title: "Completed",
      value: stats.completedProjects,
      icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      description: "Finished projects",
    },
    {
      title: "Planning",
      value: stats.onHoldProjects,
      icon: <Map className="w-6 h-6 text-amber-600" />,
      gradient: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-100",
      textColor: "text-amber-600",
      description: "Across all projects",
    },
  ];

  const statusConfig = {
    planning: {
      label: "Planning",
      color: "bg-emerald-100 text-emerald-700",
      icon: Clock,
    },
    active: {
      label: "Active",
      color: "bg-blue-100 text-blue-700",
      icon: CheckCircle,
    },
    completed: {
      label: "Completed",
      color: "bg-amber-100 text-amber-700",
      icon: AlertCircle,
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-rose-100 text-rose-700",
      icon: AlertCircle,
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>

      <div className="lg:ml-0">
        <div className="mx-auto p-6 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          <motion.div
            variants={containerVariants}
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {statCards.map((card, index) => (
              <StatsCard key={index} {...card} />
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
                  <input
                    type="text"
                    placeholder="Search by project name, location or manager..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full min-w-0 pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <button
                    onClick={() =>
                      router.push(`/${tenantName}/admin/projects/create`)
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Project</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-hidden rounded-2xl w-full">
              <table className="table-auto w-full">
                <thead className="bg-linear-to-r from-purple-500 to-blue-500">
                  <tr>
                    <th className="text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Project Name
                    </th>
                    <th className="text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Location
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      client_name
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      client_phone
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      postal_code
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      city
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Time
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-center text-xs font-medium text-white uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedProjects.map((project, idx) => {
              
                    const StatusIcon = statusConfig[project.status].icon;
                    const statusColor = statusConfig[project.status].color;
                    return (
                      <motion.tr
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                              <span className="text-purple-600 font-medium text-sm uppercase">
                                {project.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 text-center">
                              <p className="truncate font-medium text-slate-900 group-hover:text-purple-600 transition-colors">
                                {project.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="">
                          <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                            <span className="truncate block max-w-full">
                              {project.location}
                            </span>
                          </div>
                        </td>
                        <td className="">
                          <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                            <span className="truncate block max-w-full">
                              {project.client_name}
                            </span>
                          </div>
                        </td>
                        <td className="">
                          <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                            <span className="truncate block max-w-full">
                              {project.client_phone}
                            </span>
                          </div>
                        </td>
                        <td className="">
                          <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                            <span className="truncate block max-w-full">
                              {project.postal_code}
                            </span>
                          </div>
                        </td>
                        <td className="">
                          <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                            <span className="truncate block max-w-full">
                              {project.city}
                            </span>
                          </div>
                        </td>
                        <td className="">
                          <div className="flex flex-col items-center justify-center gap-1 text-sm text-slate-600">
                            <span className="truncate block max-w-full">
                              start : {formatDateOnly(project.start_date)}
                            </span>
                            <span className="truncate block max-w-full">
                              End : {formatDateOnly(project.end_date)}
                            </span>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                          >
                             <StatusIcon className="w-4 h-4"/>
                            {statusConfig[project.status].label}
                          </span>
                        </td>
                        <td className="">
                          <div className="flex items-center justify-center gap-3">
                            <Link href={`/projects/${project.id}`}>
                              <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                                <Eye className="w-4 h-4 text-slate-500" />
                              </button>
                            </Link>
                            <Link href={`/projects/edit/${project.id}`}>
                              <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                                <Edit className="w-4 h-4 text-slate-500" />
                              </button>
                            </Link>
                            <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4 text-slate-500" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-slate-500 text-center sm:text-left">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredProjects.length)}{" "}
                of {filteredProjects.length} projects
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-linear-to-r from-purple-50 to-blue-50 rounded-2xl p-6 shadow-md"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              Quick Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Project Growth</p>
                <p className="text-2xl font-bold text-green-600">+18%</p>
                <p className="text-xs text-gray-400 mt-1">
                  Compared to last quarter
                </p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">
                  Most Active Location
                </p>
                <p className="text-xl font-bold text-purple-500">Amsterdam</p>
                {/* <p className="text-xs text-gray-400 mt-1">
                  {
                    projects.filter((p) => p?.location.includes("Amsterdam"))
                      .length
                  }{" "}
                  projects
                </p> */}
              </div>
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Average Progress</p>
                {/* <p className="text-xl font-bold text-blue-600">
                  {Math.round(
                    projects.reduce((sum, p) => sum + p.progress, 0) /
                      projects.length,
                  )}
                  %
                </p> */}
                <p className="text-xs text-gray-400 mt-1">
                  Across all projects
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
