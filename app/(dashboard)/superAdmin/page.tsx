"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Chartline from "../../../components/superAdmin/Chartline";
import {
  Users,
  Calendar,
  TrendingUp,
  Activity,
  BarChart3,
  LineChart,
  Target,
  Zap,
  Award,
  Menu,
  X,
  Home,
  Building2,
  UserCircle,
  Settings,
  LogOut,
  ChevronDown,
  BarChart as BarChartIcon,
} from "lucide-react";
import StatsCard from "@/components/Cards/StatsCard";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";

export default function AnalyticsDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    totalCompanies: 24,
    activeCompanies: 18,
    retentionRate: 94,
    activeCompaniesCount: 18,
    totalProjects: 342,
    newCompaniesThisMonth: 4,
    totalUsers: 156,
  });
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#3b82f6",
    },
    mobile: {
      label: "Mobile",
      color: "#22c55e",
    },
    subscribers: {
      label: "Subscribers",
      color: "#ef4444",
    },
    active: {
      label: "Active",
      color: "#f59e0b",
    },
  };
  const monthlySubscriptionsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New companies",
        data: [2, 3, 4, 3, 5, 4],
        backgroundColor: "#8b5cf6",
        borderWidth: 1,
        borderRadius: 8,
      },
      {
        label: "Active companies",
        data: [12, 14, 16, 18, 20, 22],
        backgroundColor: "#3b82f6",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };
  // ✅ الشكل الصحيح مباشرة
  const monthly = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];
  const playerData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "New companies",
        data: [2, 3, 4, 5, 6],
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#fff",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
      },
      {
        label: "Total companies",
        data: [12, 15, 19, 24, 30],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
      },
    ],
  };

  const statCards = [
    {
      title: "Total companies",
      value: stats.totalCompanies,
      icon: <Users className="w-6 h-6 text-purple-600" />,
      gradient: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      description: "Total registered companies",
    },
    {
      title: "Active companies",
      value: stats.activeCompanies,
      icon: <Calendar className="w-6 h-6 text-green-600" />,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      description: "Currently active companies",
    },
    {
      title: "Retention rate",
      value: `${stats.retentionRate}%`,
      icon: <TrendingUp className="w-6 h-6 text-red-600" />,
      gradient: "from-red-500 to-pink-500",
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      description: "Company retention rate",
    },
  ];

  const additionalStats = [
    {
      label: "Total users",
      value: stats.totalUsers,
      icon: Activity,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total projects",
      value: stats.totalProjects,
      icon: Target,
      color: "from-orange-500 to-red-500",
    },
    {
      label: "New this month",
      value: stats.newCompaniesThisMonth,
      icon: Zap,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Platform users",
      value: stats.totalUsers,
      icon: Award,
      color: "from-yellow-500 to-amber-500",
    },
  ];

  const menuItems = [
    { name: "Dashboard", icon: Home, href: "/superadmin" },
    { name: "Companies", icon: Building2, href: "/superadmin/tenants" },
    { name: "Users", icon: UserCircle, href: "/superadmin/users" },
    { name: "Analytics", icon: BarChart3, href: "/superadmin/analytics" },
    { name: "Settings", icon: Settings, href: "/superadmin/settings" },
  ];

  const containerVariants = {
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className="fixed top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>

      <div className="lg:ml-0">
        <div className=" mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          <motion.div
            variants={containerVariants}
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {statCards.map((card, index) => (
              <StatsCard key={index} {...card} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4"
          >
            {additionalStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-3 md:p-4 hover:shadow-lg transition-all duration-300 group"
              >
                <div
                  className={`inline-flex p-1.5 md:p-2 rounded-lg bg-linear-to-r ${stat.color} text-white mb-2 md:mb-3 group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="w-3 h-3 md:w-4 md:h-4" />
                </div>
                <p className="text-slate-500 text-xs mb-0.5 md:mb-1">
                  {stat.label}
                </p>
                <p className="text-base md:text-xl font-bold text-slate-800">
                  {stat.value}
                </p>
              </div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="bg-linear-to-r from-blue-500 to-purple-500 px-4 md:px-6 py-3 md:py-4 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <LineChart className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    <h2 className="text-base md:text-lg font-bold text-white">
                      Growth Trends
                    </h2>
                  </div>
                  <span className="text-white/80 text-xs md:text-sm">
                    Last 5 months
                  </span>
                </div>
              </div>
              <div className="p-4 md:p-6 flex-1">
                <ChartContainer 
                  config={chartConfig}
                  className="h-full w-full"
                >
                  
                  <BarChart
                    accessibilityLayer
                    data={monthly}
                    
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                      dataKey="desktop"
                      fill="var(--color-desktop)"
                      radius={4}
                    />
                    <Bar
                      dataKey="mobile"
                      fill="var(--color-mobile)"
                      radius={4}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </motion.div>

            {/* Bar Chart - Companies Analysis */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="bg-linear-to-r from-purple-500 to-blue-500 px-4 md:px-6 py-3 md:py-4 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    <h2 className="text-base md:text-lg font-bold text-white">
                      Companies Analysis
                    </h2>
                  </div>
                  <span className="text-white/80 text-xs md:text-sm">
                    Last 6 months
                  </span>
                </div>
              </div>
              <div className="p-4 md:p-6 flex-1 "></div>
            </motion.div>
          </div>

          {/* Quick Insights Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-linear-to-r from-purple-50 to-blue-50 rounded-2xl p-4 md:p-6 shadow-md"
          >
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-3 md:mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
              Quick Insights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <div className="bg-white rounded-xl p-3 md:p-4">
                <p className="text-xs md:text-sm text-slate-500 mb-1">
                  Company Growth
                </p>
                <p className="text-xl md:text-2xl font-bold text-green-600">
                  +18%
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Compared to last month
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 md:p-4">
                <p className="text-xs md:text-sm text-slate-500 mb-1">
                  Most Active Period
                </p>
                <p className="text-base md:text-xl font-bold text-purple-500">
                  Q2 2024
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Peak company registrations
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 md:p-4">
                <p className="text-xs md:text-sm text-slate-500 mb-1">
                  Avg Companies/Month
                </p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">
                  4.2
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  New companies per month
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
