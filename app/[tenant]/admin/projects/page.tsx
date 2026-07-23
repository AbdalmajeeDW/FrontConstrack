"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  Edit,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  Users,
  
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Zap,
  HardDrive,

  Euro,
} from "lucide-react";
import Link from "next/link";
import StatsCard from "@/components/Cards/StatsCard";

type ProjectStatus = "active" | "completed" | "pending" | "on_hold";
type ProjectPriority = "high" | "medium" | "low";

interface Project {
  id: number;
  name: string;
  location: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number;
  manager: string;
  teamSize: number;
  area: number;
}

const mockProjects: Project[] = [
  {
    id: 1,
    name: "Zuidas Toren",
    location: "Amsterdam",
    status: "active",
    priority: "high",
    startDate: "Jan 2025",
    endDate: "Jun 2026",
    budget: 45000000,
    spent: 28000000,
    progress: 62,
    manager: "Jan de Vries",
    teamSize: 45,
    area: 35000,
  },
  {
    id: 2,
    name: "Scholencomplex De Meer",
    location: "Utrecht",
    status: "active",
    priority: "medium",
    startDate: "Sep 2024",
    endDate: "Aug 2025",
    budget: 28000000,
    spent: 24000000,
    progress: 85,
    manager: "Emma Jansen",
    teamSize: 30,
    area: 22000,
  },
  {
    id: 3,
    name: "Noordzee Resort",
    location: "Zandvoort",
    status: "pending",
    priority: "medium",
    startDate: "Jan 2026",
    endDate: "Dec 2028",
    budget: 120000000,
    spent: 5000000,
    progress: 4,
    manager: "Pieter van der Meer",
    teamSize: 0,
    area: 85000,
  },
  {
    id: 4,
    name: "Rotterdamse Haven Uitbreiding",
    location: "Rotterdam",
    status: "active",
    priority: "high",
    startDate: "Mar 2025",
    endDate: "Sep 2026",
    budget: 75000000,
    spent: 42000000,
    progress: 56,
    manager: "Sophie Bakker",
    teamSize: 65,
    area: 120000,
  },
  {
    id: 5,
    name: "Groene Woonwijk",
    location: "Eindhoven",
    status: "completed",
    priority: "low",
    startDate: "Jun 2023",
    endDate: "May 2025",
    budget: 38000000,
    spent: 38000000,
    progress: 100,
    manager: "Lars van den Berg",
    teamSize: 0,
    area: 40000,
  },
  {
    id: 6,
    name: "Zorgcentrum De Meern",
    location: "Groningen",
    status: "on_hold",
    priority: "high",
    startDate: "Jul 2025",
    endDate: "Mar 2026",
    budget: 18000000,
    spent: 8000000,
    progress: 44,
    manager: "Fenna de Boer",
    teamSize: 20,
    area: 15000,
  },
];

const statusConfig = {
  active: {
    label: "Active",
    color: "bg-emerald-100 text-emerald-700",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700",
    icon: AlertCircle,
  },
  on_hold: {
    label: "On Hold",
    color: "bg-rose-100 text-rose-700",
    icon: AlertCircle,
  },
};

const priorityConfig = {
  high: { label: "High", color: "bg-red-100 text-red-700" },
  medium: { label: "Medium", color: "bg-amber-100 text-amber-700" },
  low: { label: "Low", color: "bg-blue-100 text-blue-700" },
};

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const itemsPerPage = 10;

  const filteredProjects = useMemo(() => {
    let result = mockProjects;

    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.manager.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((p) => p.status === filterStatus);
    }

    if (filterPriority !== "all") {
      result = result.filter((p) => p.priority === filterPriority);
    }

    return result;
  }, [searchTerm, filterStatus, filterPriority]);

  const stats = {
    totalProjects: mockProjects.length,
    activeProjects: mockProjects.filter((p) => p.status === "active").length,
    completedProjects: mockProjects.filter((p) => p.status === "completed")
      .length,
    onHoldProjects: mockProjects.filter((p) => p.status === "on_hold").length,
    totalBudget: mockProjects.reduce((sum, p) => sum + p.budget, 0),
    totalTeam: mockProjects.reduce((sum, p) => sum + p.teamSize, 0),
  };

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return `${amount}`;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-emerald-500";
    if (progress >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  const containerVariants = {
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    visible: { opacity: 1, y: 0 },
  };

  // Stats cards
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
      title: "Total Budget",
      value: formatCurrency(stats.totalBudget),
      icon: <Euro className="w-6 h-6 text-amber-600" />,
      gradient: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-100",
      textColor: "text-amber-600",
      description: "Across all projects",
    },
  ];

  const additionalStats = [
    {
      label: "On Hold",
      value: stats.onHoldProjects,
      icon: AlertCircle,
      color: "from-rose-500 to-red-500",
    },
    {
      label: "Team Members",
      value: stats.totalTeam,
      icon: Users,
      color: "from-indigo-500 to-purple-500",
    },
    {
      label: "Avg Progress",
      value: `${Math.round(mockProjects.reduce((sum, p) => sum + p.progress, 0) / mockProjects.length)}%`,
      icon: Target,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Area",
      value: `${(mockProjects.reduce((sum, p) => sum + p.area, 0) / 1000).toFixed(0)}K m²`,
      icon: HardDrive,
      color: "from-emerald-500 to-teal-500",
    },
  ];

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

          {/* Additional Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {additionalStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 group"
              >
                <div
                  className={`inline-flex p-2 rounded-lg bg-linear-to-r ${stat.color} text-white mb-3 group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="w-4 h-4" />
                </div>
                <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              </div>
            ))}
          </motion.div>

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
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto overflow-y-hidden rounded-2xl w-full">
              <table className="table-auto w-full">
                <thead className="bg-linear-to-r from-purple-500 to-blue-500">
                  <tr>
                    <th className="text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Project
                    </th>
                    <th className="text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Location
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="hidden lg:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Team
                    </th>
                    <th className="  text-center text-xs font-medium text-white uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedProjects.map((project, idx) => {
                    const StatusIcon = statusConfig[project.status].icon;
                    const statusColor = statusConfig[project.status].color;
                    const priorityColor =
                      priorityConfig[project.priority].color;
                    const progressColor = getProgressColor(project.progress);

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
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate block max-w-full">
                              {project.location}
                            </span>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig[project.status].label}
                          </span>
                        </td>
                        <td className="hidden sm:table-cell text-center ">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColor}`}
                          >
                            {priorityConfig[project.priority].label}
                          </span>
                        </td>
                        <td className="hidden sm:table-cell text-center ">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${progressColor} transition-all duration-1000 rounded-full`}
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-700">
                              {project.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell text-center">
                          <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                            <Euro className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate block max-w-full">
                              {formatCurrency(project.budget)}
                            </span>
                          </div>
                        </td>
                        <td className="hidden lg:table-cell text-center">
                          <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                            <Users className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate block max-w-full">
                              {project.teamSize}
                            </span>
                          </div>
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

            {/* Pagination */}
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

          {/* Quick Insights */}
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
                <p className="text-xs text-gray-400 mt-1">
                  {
                    mockProjects.filter((p) => p.location.includes("Amsterdam"))
                      .length
                  }{" "}
                  projects
                </p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Average Progress</p>
                <p className="text-xl font-bold text-blue-600">
                  {Math.round(
                    mockProjects.reduce((sum, p) => sum + p.progress, 0) /
                      mockProjects.length,
                  )}
                  %
                </p>
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
