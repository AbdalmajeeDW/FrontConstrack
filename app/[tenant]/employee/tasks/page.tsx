"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  Flag,
  CheckCircle,
  Circle,
  Eye,
  Users,
  AlertTriangle,
  ListTodo,
  MapPin,
  Bus,
  Briefcase,
  Building2,
  Flame,
  Loader,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchEmployeeTasks,
  selectEmployeeTaskError,
  selectEmployeeTaskLoading,
  selectEmployeeTasks,
} from "@/store/slices/employee/taskSlice";
import { Task } from "@/store/types/task.types";
import TaskCard from "@/components/Cards/TaskCard";
import AddTaskModal from "@/components/Modal/Modal";
import { fetchTasks, updateTask } from "@/store/slices/admin/taskSlice";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const priorityConfig = {
  low: {
    label: "myTasks.priority.low",
    color: "bg-green-100 text-green-700",
    icon: Flag,
    order: 1,
  },
  medium: {
    label: "myTasks.priority.medium",
    color: "bg-yellow-100 text-yellow-700",
    icon: Flag,
    order: 2,
  },
  high: {
    label: "myTasks.priority.high",
    color: "bg-orange-100 text-orange-700",
    icon: Flag,
    order: 3,
  },
  urgent: {
    label: "myTasks.priority.urgent",
    color: "bg-red-100 text-red-700",
    icon: AlertTriangle,
    order: 4,
  },
};

const statusConfig = {
  in_progress: {
    label: "myTasks.status.in_progress",
    color: "bg-blue-100 text-blue-700",
    icon: Clock,
    order: 2,
  },
  done: {
    label: "myTasks.status.done",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
    order: 4,
  },
};

const getPriorityConfig = (priority: string | undefined) => {
  if (!priority || !priorityConfig[priority as keyof typeof priorityConfig]) {
    return priorityConfig.medium;
  }
  return priorityConfig[priority as keyof typeof priorityConfig];
};

export default function EmployeeTasksPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectEmployeeTasks);
  const isLoading = useAppSelector(selectEmployeeTaskLoading);
  const error = useAppSelector(selectEmployeeTaskError);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  const [currentEmployeeId, setCurrentEmployeeId] = useState<number | null>(
    null,
  );

  const handleEditClick = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("tenant-user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setCurrentEmployeeId(user.id?.toString() || null);
      } catch {
        console.error("Failed to parse employee user");
      }
    }
  }, []);

  const handleUpdateTask = async (id: any, formData: any) => {
    try {
      const result = await dispatch(
        updateTask({ id: id, data: formData }),
      ).unwrap();
      await dispatch(fetchTasks()).unwrap();
      setEditingTask(null);
      toast.success(t("myTasks.update_success"));
      return result;
    } catch (error) {
      toast.error(t("myTasks.update_error"));
      throw error;
    }
  };

  useEffect(() => {
    if (currentEmployeeId) {
      dispatch(fetchEmployeeTasks(currentEmployeeId));
    }
  }, [dispatch, currentEmployeeId]);

  const employeeTasks = useMemo(() => tasks, [tasks]);

  const filteredTasks = useMemo(() => {
    let filtered = employeeTasks;
    if (search) {
      filtered = filtered.filter(
        (t) =>
          t.taskName?.toLowerCase().includes(search.toLowerCase()) ||
          t.taskDescription?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (filterPriority !== "all")
      filtered = filtered.filter((t) => t.priority === filterPriority);
    if (filterStatus !== "all")
      filtered = filtered.filter((t) => t.status === filterStatus);
    return filtered;
  }, [employeeTasks, search, filterPriority, filterStatus]);

  const statCards = [
    {
      title: t("myTasks.stats.my_tasks"),
      value: employeeTasks.length,
      icon: ListTodo,
      linear: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      description: t("myTasks.stats.my_tasks_desc"),
      status: "all",
      ringColor: "ring-purple-500",
    },
    {
      title: t("myTasks.stats.completed"),
      value: employeeTasks.filter((t) => t.status === "done").length,
      icon: CheckCircle,
      linear: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600",
      description: t("myTasks.stats.completed_desc"),
      ringColor: "ring-emerald-500",
      status: "done",
    },
    {
      title: t("myTasks.stats.in_progress"),
      value: employeeTasks.filter((t) => t.status === "in_progress").length,
      icon: Clock,
      linear: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      description: t("myTasks.stats.in_progress_desc"),
      status: "in_progress",
      ringColor: "ring-blue-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className="mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 p-4">
            {t("myTasks.error")}
          </div>
        )}

        <motion.div
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              onClick={() => setFilterStatus(card.status)}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden
${filterStatus === card.status ? `ring-2 ${card.ringColor}` : ""}
`}
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("myTasks.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="all">
                  {t("myTasks.filter.all_priorities")}
                </option>
                <option value="urgent">{t("myTasks.filter.urgent")}</option>
                <option value="high">{t("myTasks.filter.high")}</option>
                <option value="medium">{t("myTasks.filter.medium")}</option>
                <option value="low">{t("myTasks.filter.low")}</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="all">{t("myTasks.filter.all_status")}</option>
                <option value="in_progress">
                  {t("myTasks.filter.in_progress")}
                </option>
                <option value="done">{t("myTasks.filter.done")}</option>
              </select>
              <button
                onClick={() =>
                  setViewMode(viewMode === "list" ? "board" : "list")
                }
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {viewMode === "list"
                  ? t("myTasks.view_mode.board")
                  : t("myTasks.view_mode.list")}
              </button>
            </div>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <ListTodo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t("myTasks.no_tasks")}</p>
            <p className="text-gray-400 text-sm mt-1">
              {t("myTasks.no_tasks_desc")}
            </p>
          </div>
        ) : viewMode === "list" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                isEmployees={true}
                key={task.id}
                task={task}
                onView={(id) => console.log("View", id)}
                onEdit={handleEditClick}
                onDelete={() => console.log("")}
                onStatusChange={() => console.log("")}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(statusConfig).map(([statusKey, status]) => {
              const statusTasks = filteredTasks.filter(
                (t) => t.status === statusKey,
              );
              return (
                <div key={statusKey} className="bg-gray-50 rounded-xl p-3">
                  <div
                    className={`flex items-center justify-between mb-3 px-2 py-1.5 rounded-lg ${status.color} bg-opacity-20`}
                  >
                    <div className="flex items-center gap-2">
                      <status.icon className="w-4 h-4" />
                      <span className="font-medium">{t(status.label)}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {statusTasks.length}
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[70vh] overflow-y-auto">
                    {statusTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                      >
                        <h4 className="font-medium text-gray-800 text-sm line-clamp-2">
                          {task.taskName}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {task.project_id}
                        </p>
                        {task.city && (
                          <p className="text-xs text-gray-400 mt-1">
                            📍 {task.city}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${getPriorityConfig(task.priority).color}`}
                          >
                            {t(getPriorityConfig(task.priority).label)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {task.endWork
                              ? new Date(task.endWork).toLocaleDateString()
                              : "—"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <AddTaskModal
        isOpen={isModalOpen}
        isEmployee={true}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onAdd={async () => {}}
        onUpdate={handleUpdateTask}
        editingTask={editingTask}
      />
    </div>
  );
}
