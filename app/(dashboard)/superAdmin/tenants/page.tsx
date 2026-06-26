"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Search,
  PlusCircle,
  CheckCircle,
  Clock,
  Ban,
  AlertTriangle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchTenants,
  selectTenants,
  selectTenantLoading,
  selectTenantError,
} from "@/store/slices/superAdmin/tenantSlice";
import TenantsTable from "@/components/superAdmin/Table";

export default function TenantsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const dispatch = useAppDispatch();
  const tenants = useAppSelector(selectTenants);
  const isLoading = useAppSelector(selectTenantLoading);
  const error = useAppSelector(selectTenantError);

  useEffect(() => {
    dispatch(fetchTenants());
  }, [dispatch]);

  const stats = useMemo(
    () => ({
      totalTenants: tenants.length,
      activeTenants: tenants.filter((tenant) => tenant.status === "active")
        .length,
      pendingTenants: tenants.filter((tenant) => tenant.status == "pending")
        .length,
      suspendedTenants: tenants.filter(
        (tenant) => tenant.status === "suspended",
      ).length,
      expiredTenants: tenants.filter((tenant) => tenant.status === "expired")
        .length,
      totalUsers: tenants.reduce(
        (sum, tenant) => sum + (tenant.maxEmployees || 0),
        0,
      ),
    }),
    [tenants],
  );
  const tenantsData = tenants;
  const loadingMessage = isLoading ? "جاري تحميل بيانات التيننت..." : "";
  const errorMessage = error ? `حدث خطأ في تحميل البيانات: ${error}` : "";
  
  const filteredTenants = tenantsData.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.adminEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || tenant.status === statusFilter;
    const matchesPlan = planFilter === "all" || tenant.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const containerVariants = {
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    visible: { opacity: 1, y: 0 },
  };

  const statCards = [
    {
      title: "Total Companies",
      value: stats.totalTenants,
      change: "+12%",
      icon: Building2,
      linear: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      description: "Registered companies",
    },
    {
      title: "Active Companies",
      value: stats.activeTenants,
      change: "+8%",
      icon: CheckCircle,
      linear: "from-green-500 to-emerald-500",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      description: "Currently active",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      change: "+15%",
      icon: Users,
      linear: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      description: "Across all companies",
    },
  ];

  const additionalStats = [
    {
      label: "Pending Approval",
      value: stats.pendingTenants,
      icon: Clock,
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Suspended",
      value: stats.suspendedTenants,
      icon: Ban,
      color: "from-rose-500 to-red-500",
    },
    {
      label: "Expired",
      value: stats.expiredTenants,
      icon: AlertTriangle,
      color: "from-slate-500 to-gray-500",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>

      <div className="mx-auto p-6 lg:p-8 space-y-8">
        {loadingMessage ? (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-700">
            {loadingMessage}
          </div>
        ) : null}
        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <motion.div
          variants={containerVariants}
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${card.linear} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
                ></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${card.bgColor}`}>
                      <card.icon className={`w-6 h-6 ${card.textColor}`} />
                    </div>
                    <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {card.change}
                    </span>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">
                    {card.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 mb-1">
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-400">{card.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4"
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
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by company name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                    <option value="expired">Expired</option>
                  </select>
                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="all">All Plans</option>
                    <option value="Basic">Basic</option>
                    <option value="Professional">Professional</option>
                 
                  </select>
                </div>
                <Link
                  href="/superAdmin/tenants/add"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-purple-500 to-blue-500 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-md"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Company
                </Link>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <TenantsTable tenants={filteredTenants} />
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
              <p className="text-sm text-gray-500 mb-1">Company Growth</p>
              <p className="text-2xl font-bold text-green-600">+18%</p>
              <p className="text-xs text-gray-400 mt-1">
                Compared to last month
              </p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Most Popular Plan</p>
              <p className="text-xl font-bold text-purple-500">Professional</p>
              <p className="text-xs text-gray-400 mt-1">45% of companies</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">
                Average Users/Company
              </p>
              <p className="text-xl font-bold text-blue-600">6.5</p>
              <p className="text-xs text-gray-400 mt-1">Across all companies</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
