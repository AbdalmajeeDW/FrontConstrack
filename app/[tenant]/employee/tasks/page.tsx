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

const priorityConfig = {
  low: {
    label: "Low",
    color: "bg-green-100 text-green-700",
    icon: Flag,
    order: 1,
  },
  medium: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-700",
    icon: Flag,
    order: 2,
  },
  high: {
    label: "High",
    color: "bg-orange-100 text-orange-700",
    icon: Flag,
    order: 3,
  },
  urgent: {
    label: "Urgent",
    color: "bg-red-100 text-red-700",
    icon: AlertTriangle,
    order: 4,
  },
};

const statusConfig = {
  todo: {
    label: "Pending",
    color: "bg-gray-100 text-gray-600",
    icon: Circle,
    order: 1,
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-700",
    icon: Clock,
    order: 2,
  },
  review: {
    label: "Review",
    color: "bg-purple-100 text-purple-700",
    icon: Eye,
    order: 3,
  },
  done: {
    label: "Completed",
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

const getPriorityColor = (priority: string | undefined) => {
  if (!priority) return "bg-gray-500 text-white";
  const colors = {
    urgent: "bg-red-500 text-white",
    high: "bg-orange-500 text-white",
    medium: "bg-yellow-500 text-white",
    low: "bg-green-500 text-white",
  };
  return colors[priority as keyof typeof colors] || "bg-gray-500 text-white";
};

function EmployeeTaskCard({ task }: { task: Task }) {
  const getGradient = () => {
    const gradients = [
      "from-rose-400 to-orange-400",
      "from-blue-400 to-cyan-400",
      "from-emerald-400 to-teal-400",
      "from-purple-400 to-indigo-400",
      "from-pink-400 to-rose-400",
    ];
    return gradients[task.id % gradients.length];
  };

  const prioritySettings = getPriorityConfig(task.priority);
  const priorityColor = getPriorityColor(task.priority);

  return (
    <motion.div
      initial={{ rotate: -2, scale: 0.95 }}
      animate={{ rotate: 0, scale: 1 }}
      whileHover={{ rotate: 1, scale: 1.02 }}
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden"
      style={{ boxShadow: "0 20px 35px -10px rgba(0,0,0,0.1)" }}
    >
      <div className={`h-2 bg-linear-to-r ${getGradient()}`} />

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-1">
            <div className="text-xs font-mono text-gray-400">#{task.id}</div>
            {task.task_type && (
              <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-black/5 text-gray-700">
                {task.task_type}
              </div>
            )}
          </div>
          <div
            className={`px-2 py-1 rounded-lg text-xs font-bold ${priorityColor}`}
          >
            {prioritySettings.label}
          </div>
        </div>

        <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight">
          {task.taskName}
        </h3>

        <p className="text-xs text-gray-500 mb-4 line-clamp-2">
          {task.taskDescription}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <div className="text-lg font-bold text-gray-800">
              {task.endWork
                ? new Date(task.endWork).toLocaleDateString("en-EG", {
                    day: "numeric",
                    month: "short",
                  })
                : "—"}
            </div>
            <div className="text-[10px] text-gray-400">Due Date</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <div className="text-lg font-bold text-gray-800">
              {task.work_area ? `${task.work_area}` : "—"}
            </div>
            <div className="text-[10px] text-gray-400">Area (m²)</div>
          </div>
          {task.city && (
            <div className="bg-gray-50 rounded-xl p-2 text-center col-span-2">
              <div className="text-sm font-medium text-gray-800">
                {task.city}
              </div>
              <div className="text-[10px] text-gray-400">📍 Work Location</div>
            </div>
          )}
        </div>

        {(task.bus_number || task.driver_name) && (
          <div className="bg-blue-50 rounded-xl p-2 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bus className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                {task.bus_number && (
                  <div className="text-xs font-bold">Bus {task.bus_number}</div>
                )}
                {task.driver_name && (
                  <div className="text-[10px] text-gray-500">
                    Driver: {task.driver_name}
                  </div>
                )}
              </div>
            </div>
            {task.worker_arrival_time && (
              <div className="text-right">
                <div className="text-xs font-bold">
                  {task.worker_arrival_time}
                </div>
                <div className="text-[10px] text-gray-500">Arrival Time</div>
              </div>
            )}
          </div>
        )}

        {/* عرض الحالة فقط (غير قابل للتغيير) */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="text-xs text-gray-500">Status:</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              task.status === "in_progress"
                ? "bg-blue-100 text-blue-700"
                : task.status === "done"
                  ? "bg-green-100 text-green-700"
                  : "bg-green-100 text-green-700"
            }`}
          >
            {task.status}
          </span>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/20" />
    </motion.div>
  );
}

export default function EmployeeTasksPage() {
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

      toast.success("Task updated successfully!");
      return result;
    } catch (error) {
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
      title: "My Tasks",
      value: employeeTasks.length,
      icon: ListTodo,
      linear: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      description: "Assigned to you",
    },
    {
      title: "Completed",
      value: employeeTasks.filter((t) => t.status === "done").length,
      icon: CheckCircle,
      linear: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600",
      description: "Tasks done",
    },
    {
      title: "In Progress",
      value: employeeTasks.filter((t) => t.status === "in_progress").length,
      icon: Clock,
      linear: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      description: "Ongoing tasks",
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
            {error}
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
                placeholder="Search my tasks..."
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
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="todo">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
              <button
                onClick={() =>
                  setViewMode(viewMode === "list" ? "board" : "list")
                }
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {viewMode === "list" ? "Board View" : "List View"}
              </button>
            </div>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <ListTodo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tasks assigned to you</p>
            <p className="text-gray-400 text-sm mt-1">
              You don't have any tasks yet.
            </p>
          </div>
        ) : viewMode === "list" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
              // <EmployeeTaskCard key={task.id} task={task} />
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
                      <span className="font-medium">{status.label}</span>
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
                          {task.projectName}
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
                            {getPriorityConfig(task.priority).label}
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
