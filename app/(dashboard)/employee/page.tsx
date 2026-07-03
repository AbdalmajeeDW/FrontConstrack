"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  Briefcase,
  FileText,
  ArrowUpRight,
  Activity,
  Calendar,
  Target,
  Zap,
  Users,
  Mail,
  HardHat,
  Euro,
} from "lucide-react";
import Link from "next/link";
import { fetchEmployee, selectEmployee } from "@/store/slices/employee/profileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { EmployeeUser } from "@/store/types/employee.types";
import { fetchEmployeeTasks, selectEmployeeTasks } from "@/store/slices/employee/taskSlice";
import { TaskEmployee } from "@/store/types/task.types";



export default function EmployeePage() {
  const [employee, setEmployee] = useState<EmployeeUser | null>(null);
  const Employee = useAppSelector(selectEmployee);
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectEmployeeTasks);

 useEffect(() => {
    const stored = localStorage.getItem("tenant-user") as any;
    const user = JSON.parse(stored);
    dispatch(fetchEmployee(user.id?.toString() || null)).then((action) => {
      if (fetchEmployee.fulfilled.match(action)) {
        setEmployee(action.payload);
      }
    });
    dispatch(fetchEmployeeTasks(user.id?.toString() || null));
  }, [dispatch]);

  const stats = [
    {
      title: "Assigned Tasks",
      value: tasks.length,
      change: "+3",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Completed Tasks",
      value: tasks.filter((e)=>e.status==="done").length,
      change: "+2",
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600",
    },
    {
      title: "Pending Tasks",
      value: "5",
      change: "-1",
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-100",
      textColor: "text-amber-600",
    },
    {
      title: "Completion Rate",
      value: "64%",
      change: "+8%",
      icon: Target,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
  ];

 
  
function formatDate(isoString:string) {
  const date = new Date(isoString);
  return date.toISOString().replace('T', ' ').slice(0, 16);
}

  // Recent activities
  const activities = [
    { action: "Completed task", project: "Update Database", time: "10 minutes ago" },
    { action: "Commented on", project: "Design UI", time: "1 hour ago" },
    { action: "Uploaded file", project: "Performance Report", time: "3 hours ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 relative">
      {/* Decorative backgrounds */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>

      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span>👋</span>
              Welcome back, {employee?.name || "Employee"}
            </h1>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
              <span>{ "Department not set"}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
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
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
              {employee?.name?.charAt(0) || "E"}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
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
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
                ></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-full ${
                        stat.change.startsWith("+")
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
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


        {/* Tasks & Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Current Tasks */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-500" />
                My Current Tasks
              </h3>
              <Link href="/employee/tasks">
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                  View All <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{task.taskName}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(task.endWork)   }
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          task.status === "in_progress"
                            ? "bg-blue-100 text-blue-700"
                            : task.status === "done"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-gray-500">{task.id}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            task.id >= 80
                              ? "bg-emerald-500"
                              : task.id >= 50
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${task.id}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Additional Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <HardHat className="w-4 h-4 text-blue-500" />
              Location
            </div>
            <p className="text-xl font-bold text-gray-900 mt-1">Main Office</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4 text-purple-500" />
              Team
            </div>
            <p className="text-xl font-bold text-gray-900 mt-1">12</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Euro className="w-4 h-4 text-emerald-500" />
              Hourly Rate
            </div>
            <p className="text-xl font-bold text-gray-900 mt-1">{employee?.salary}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Target className="w-4 h-4 text-rose-500" />
              Completion Rate
            </div>
            <p className="text-xl font-bold text-gray-900 mt-1">64%</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
          <p>© 2026 Project Management System. All rights reserved.</p>
          <p className="mt-1">Employee Dashboard v2.0</p>
        </div>
      </div>
    </div>
  );
}