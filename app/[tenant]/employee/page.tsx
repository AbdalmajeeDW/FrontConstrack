"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowUpRight, Loader } from "lucide-react";
import Link from "next/link";
import { fetchEmployee } from "@/store/slices/employee/profileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchEmployeeTasks,
  selectEmployeeTasks,
} from "@/store/slices/employee/taskSlice";
import { usePathname } from "next/navigation";
import { useTaskData } from "@/hooks/useTaskData";
import { useTranslation } from "react-i18next";

export default function EmployeePage() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { employee, error, isLoading } = useAppSelector(
    (state) => state.employeeProfile,
  );

  const tasks = useAppSelector(selectEmployeeTasks);
  const pathname = usePathname();

  const tenantName = pathname.split("/")[1] || "";

  const formatDate = (dateString: string | null | undefined) => {
    const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const getRemainingTime = (endWork: string) => {
    const end = new Date(endWork);
    const now = new Date();

    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      return t("employeeDashboard.expired");
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return t("employeeDashboard.days_left", { count: days });
    }

    return t("employeeDashboard.hours_left", { count: hours });
  };

  const formatDisplayDate = (dateString: string) => {
    const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
    return new Date(dateString).toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const { filteredTasks, setSelectedStatus, stats, selectedStatus } =
    useTaskData(tasks);

  useEffect(() => {
    const stored = localStorage.getItem("tenant-user") as any;
    const user = JSON.parse(stored);
    dispatch(fetchEmployee(user.id?.toString() || null));
    dispatch(fetchEmployeeTasks(user.id?.toString() || null));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 p-6 relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>

      <div className="mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span>👋</span>
              {t("employeeDashboard.welcome", {
                name: employee?.name || t("employeeDashboard.employee"),
              })}
            </h1>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>{formatDisplayDate(new Date().toISOString())}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              onClick={() => setSelectedStatus(stat.filter as any)}
              className={`
                relative group cursor-pointer rounded-2xl
                ${selectedStatus === stat.filter ? `ring-2 ${stat.ringColor}` : ""}
              `}
            >
              <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-cyan-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${stat.bgColor} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
                ></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-500" />
                {t("employeeDashboard.current_tasks")}
              </h3>
              <Link href={`/${tenantName}/employee/tasks`}>
                <button className="text-sm cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                  {t("employeeDashboard.view_all")}{" "}
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="space-y-4">
              {filteredTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="min-w-0">
                      <h4 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {task.taskName}
                      </h4>
                    </div>

                    <span
                      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        task.status === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : task.status === "done"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {task.status === "in_progress"
                        ? t("employeeDashboard.in_progress")
                        : task.status === "done"
                          ? t("employeeDashboard.completed")
                          : task.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
                    <div className="rounded-xl bg-red-50 p-3">
                      <p className="text-xs text-red-500">
                        {t("employeeDashboard.remaining")}
                      </p>
                      <p className="mt-1 font-semibold text-red-700">
                        {getRemainingTime(task.endWork)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-purple-50 p-3">
                      <p className="text-xs text-purple-500">
                        {t("employeeDashboard.driver_name")}
                      </p>
                      <p className="mt-1 font-semibold text-purple-700 truncate">
                        {task.driver_name || "-"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-blue-50 p-3">
                      <p className="text-xs text-blue-500">
                        {t("employeeDashboard.bus_number")}
                      </p>
                      <p className="mt-1 font-semibold text-blue-700">
                        {task.bus_number || "-"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50 p-3">
                      <p className="text-xs text-emerald-500">
                        {t("employeeDashboard.location")}
                      </p>
                      <p className="mt-1 font-semibold text-emerald-700 truncate">
                        {task.city || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-row sm:items-center gap-2 mt-5 pt-4 border-t border-gray-100 text-sm">
                    <div className="flex justify-center items-center gap-2 text-gray-500">
                      <span>{t("employeeDashboard.deadline")}:</span>
                      <span className="font-medium text-gray-700">
                        {formatDate(task.endWork)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
