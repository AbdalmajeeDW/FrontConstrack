"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Briefcase,
  HardHat,
  FileText,
  ArrowUpRight,
  Activity,
  DollarSign,
  Target,
  Zap,
  User,
  Mail,
  Settings,
  Bell,
} from "lucide-react";
import Link from "next/link";

interface TenantAdminUser {
  name: string;
  role: "tenant_admin" | "user" | string;
  email?: string;
}

export default function AdminPage() {
  const [tenantAdmin, setTenantAdmin] = useState<TenantAdminUser | null>(null);

  useEffect(() => {
    const tenantAdminToken = localStorage.getItem("tenant-admin-user");
    if (tenantAdminToken) {
      setTenantAdmin(JSON.parse(tenantAdminToken));
    }
    document.title = "Tenant Admin Dashboard";
  }, []);

  // إحصائيات وهمية
  const stats = [
    {
      title: "Total Projects",
      value: "24",
      change: "+12%",
      icon: Building2,
      color: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: "Active Projects",
      value: "8",
      change: "+8%",
      icon: Activity,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600",
    },
    {
      title: "Total Employees",
      value: "156",
      change: "+15%",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Completion Rate",
      value: "68%",
      change: "+5%",
      icon: Target,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-100",
      textColor: "text-amber-600",
    },
  ];

  // مشاريع حديثة
  const recentProjects = [
    { name: "Al-Rayan Tower", progress: 62, status: "In Progress", team: 45 },
    { name: "Al-Noor School", progress: 85, status: "In Progress", team: 30 },
    { name: "Seaside Resort", progress: 4, status: "Planning", team: 0 },
    { name: "Industrial Zone", progress: 56, status: "In Progress", team: 65 },
  ];

  // أنشطة حديثة
  const activities = [
    { user: "Ahmed Al-Mansoori", action: "completed task", project: "Al-Rayan Tower", time: "2 min ago" },
    { user: "Fatima Al-Hassan", action: "updated budget", project: "Al-Noor School", time: "15 min ago" },
    { user: "Mohammed Al-Hamadi", action: "created new project", project: "Seaside Resort", time: "1 hour ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>

      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span>👋</span>
              Welcome back, {tenantAdmin?.name || "Admin"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {tenantAdmin?.name?.charAt(0) || "A"}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
                ></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                    <span className="text-sm font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                  <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Quick Actions</h3>
                <p className="text-sm text-gray-500">Manage your projects and team</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/projects/new">
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:shadow-md transition-all text-sm border border-gray-200">
                  <Building2 className="w-4 h-4" />
                  New Project
                </button>
              </Link>
              <Link href="/admin/employees/new">
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:shadow-md transition-all text-sm border border-gray-200">
                  <Users className="w-4 h-4" />
                  Add Employee
                </button>
              </Link>
              <Link href="/admin/tasks">
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-all text-sm shadow-md">
                  <FileText className="w-4 h-4" />
                  View Tasks
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Projects & Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-500" />
                Recent Projects
              </h3>
              <Link href="/admin/projects">
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                  View All <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentProjects.map((project, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{project.name}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {project.team}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          project.status === "In Progress"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-gray-500">{project.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            project.progress >= 80
                              ? "bg-emerald-500"
                              : project.progress >= 50
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Recent Activity
              </h3>
              <button className="text-xs text-gray-400 hover:text-gray-600">See All</button>
            </div>
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-gray-500"> {activity.action} </span>
                      <span className="font-medium text-purple-600">{activity.project}</span>
                    </p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Total Budget
            </div>
            <p className="text-xl font-bold text-gray-900 mt-1">$4.25M</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <HardHat className="w-4 h-4 text-blue-500" />
              On Site
            </div>
            <p className="text-xl font-bold text-gray-900 mt-1">43</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Completed
            </div>
            <p className="text-xl font-bold text-gray-900 mt-1">12</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4 text-amber-500" />
              In Progress
            </div>
            <p className="text-xl font-bold text-gray-900 mt-1">8</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
          <p>© 2026 Construction Management System. All rights reserved.</p>
          <p className="mt-1">Tenant Admin Dashboard v2.0</p>
        </div>
      </div>
    </div>
  );
}