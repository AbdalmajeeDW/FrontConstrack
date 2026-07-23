"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  Search,
  PlusCircle,
  Eye,
  Edit,
  MoreVertical,
  Clock,
  Mail,
  ChevronLeft,
  ChevronRight,
  Zap,
  UserCheck,
  UserX,
  Shield,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import {
  fetchSuperAdmins,
  selectSuperAdminError,
  selectSuperAdminLoading,
  selectSuperAdmins,
} from "@/store/slices/superAdmin/superAdminSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import StatsCard from "@/components/Cards/StatsCard";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const dispatch = useAppDispatch();
  const superAdmins = useAppSelector(selectSuperAdmins);
  const isLoading = useAppSelector(selectSuperAdminLoading);
  const error = useAppSelector(selectSuperAdminError);

  useEffect(() => {
    dispatch(fetchSuperAdmins());
  }, [dispatch]);

  const stats = {
    totalUsers: superAdmins.length,
    activeUsers: 128,
    inactiveUsers: 25,
    pendingUsers: 3,
    adminUsers: 24,
    projectManagers: 48,
    regularUsers: 84,
    totalCompanies: 24,
  };

  const totalPages = Math.ceil(superAdmins.length / itemsPerPage);
  const paginatedUsers = superAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const containerVariants = {
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  

  // Stats cards for users
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="w-6 h-6 text-purple-600" />,
      gradient: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      description: "Platform users",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: <UserCheck className="w-6 h-6 text-green-600" />,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      description: "Currently active",
    },
    {
      title: "Admin Users",
      value: stats.adminUsers,
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      gradient: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-600",
      description: "Company admins",
    },
    {
      title: "Project Managers",
      value: stats.projectManagers,
      icon: <Briefcase className="w-6 h-6 text-blue-600" />,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      description: "Across companies",
    },
  ];

  const additionalStats = [
    {
      label: "Regular Users",
      value: stats.regularUsers,
      icon: Users,
      color: "from-slate-500 to-gray-500",
    },
    {
      label: "Pending Approval",
      value: stats.pendingUsers,
      icon: Clock,
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Inactive",
      value: stats.inactiveUsers,
      icon: UserX,
      color: "from-rose-500 to-red-500",
    },
    {
      label: "Companies",
      value: stats.totalCompanies,
      icon: Building2,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="lg:ml-0">
        <div className=" mx-auto p-6 md:p-6 lg:p-8 space-y-6 md:space-y-8">
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
                    placeholder="Search by name, email or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full min-w-0 pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex flex-row gap-3 sm:items-end">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 w-full min-w-0">
                    <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-purple-500 to-blue-500 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-md whitespace-nowrap">
                      <PlusCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Add User</span>
                      <span className="sm:hidden">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-hidden rounded-2xl w-full">
              <table className="table-auto w-full">
                <thead className="bg-linear-to-r from-purple-500 to-blue-500">
                  <tr>
                    <th className="text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
                      address
                    </th>

                    <th className=" px-4 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedUsers.map((user, idx) => {
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-3 min-w-0">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                              <span className="text-purple-600 font-medium text-sm"></span>
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-slate-900 group-hover:text-purple-600 transition-colors">
                                {user.name}
                              </p>
                              <p className="truncate text-xs text-slate-400">
                                ID: #{user.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 max-w-50">
                          <div className="space-y-1">
                            <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate block max-w-full">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 max-w-50">
                          <div className="space-y-1">
                            <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate block max-w-full">
                                {user.address}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex  items-center justify-center gap-3 ">
                            <Link href={`/superAdmin/users/${user.id}`}>
                              <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                                <Eye className="w-4 h-4 text-slate-500" />
                              </button>
                            </Link>
                            <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                              <Edit className="w-4 h-4 text-slate-500" />
                            </button>
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
                {Math.min(currentPage * itemsPerPage, superAdmins.length)} of{" "}
                {superAdmins.length} users
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
                  Page {currentPage} of {totalPages}
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
          {/* Quick Insights Section */}
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
                <p className="text-sm text-gray-500 mb-1">User Growth</p>
                <p className="text-2xl font-bold text-green-600">+18%</p>
                <p className="text-xs text-gray-400 mt-1">
                  Compared to last month
                </p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Most Common Role</p>
                <p className="text-xl font-bold text-purple-500">
                  Regular Users
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {stats.regularUsers} users
                </p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Active Rate</p>
                <p className="text-xl font-bold text-blue-600">
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                </p>
                <p className="text-xs text-gray-400 mt-1">Users active</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
