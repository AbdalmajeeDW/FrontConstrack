"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Clock,
  Flag,
  CheckCircle,
  Circle,
  Eye,
  X,
  Save,
  Users,
  AlertTriangle,
  ListTodo,
  MapPin,
  Bus,
  Briefcase,
  Building2,
  FlagIcon,
  Flame,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  selectTaskError,
  selectTaskLoading,
  selectTasks,
} from "@/store/slices/admin/taskSlice";
import { Task } from "@/store/types/task.types";


const priorityConfig = {
  low: {
    label: "low",
    color: "bg-green-100 text-green-700",
    icon: Flag,
    order: 1,
  },
  medium: {
    label: "medium",
    color: "bg-yellow-100 text-yellow-700",
    icon: Flag,
    order: 2,
  },
  high: {
    label: "high",
    color: "bg-orange-100 text-orange-700",
    icon: Flag,
    order: 3,
  },
  urgent: {
    label: "urgent",
    color: "bg-red-100 text-red-700",
    icon: AlertTriangle,
    order: 4,
  },
};

const statusConfig = {
  todo: {
    label: "قيد الانتظار",
    color: "bg-gray-100 text-gray-600",
    icon: Circle,
    order: 1,
  },
  in_progress: {
    label: "قيد التنفيذ",
    color: "bg-blue-100 text-blue-700",
    icon: Clock,
    order: 2,
  },
  review: {
    label: "مراجعة",
    color: "bg-purple-100 text-purple-700",
    icon: Eye,
    order: 3,
  },
  done: {
    label: "مكتملة",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
    order: 4,
  },
};

const projects = [
  "تطوير منصة النادي",
  "تحسين الأداء",
  "إصلاح الأخطاء",
  "تسويق وإعلانات",
  "تدريب المدربين",
];

function TaskCard({
  task,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  task: Task;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Task["status"]) => void;
}) {
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

  return (
    <motion.div
      initial={{ rotate: -2, scale: 0.95 }}
      animate={{ rotate: 0, scale: 1 }}
      whileHover={{ rotate: 1, scale: 1.02 }}
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden"
      style={{
        boxShadow: "0 20px 35px -10px rgba(0,0,0,0.1)",
      }}
    >
      {/* شريط علوي ملون */}
      <div className={`h-2 bg-linear-to-r ${getGradient()}`} />

      {/* محتوى البطاقة */}
      <div className="p-5">
        {/* رقم المهمة ونوعها */}
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
            className={`px-2 py-1 rounded-lg text-xs font-bold  ${
              task.priority === "urgent"
                ? "bg-red-500 text-white"
                : task.priority === "high"
                  ? "bg-orange-500 text-white"
                  : task.priority === "medium"
                    ? "bg-yellow-500 text-white"
                    : "bg-green-500 text-white"
            }`}
          >
            {priorityConfig[task.priority].label}
          </div>
        </div>

        {/* عنوان المهمة */}
        <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight">
          {task.taskName}
        </h3>

        {/* وصف المهمة - خط صغير وأنيق */}
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 ">
          {task.taskDescription}
        </p>

        {/* لوحة المعلومات - تصميم بطاقات صغيرة */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <div className="text-lg font-bold text-gray-800">
              {new Date(task.endWork).toLocaleDateString("ar-EG", {
                day: "numeric",
                month: "short",
              })}
            </div>
            <div className="text-[10px] text-gray-400">Due Date</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <div className="text-lg font-bold text-gray-800">
              {task.work_area ? `${task.work_area}` : "—"}
            </div>
            <div className="text-[10px] text-gray-400">Area (m²)

</div>
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

        {/* وسيلة النقل - تصميم مميز */}
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

        {/* الفريق */}
        {task.employees && task.employees.length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-xl">
            <Users className="w-4 h-4 text-gray-400" />
            <div className="flex gap-1 text-xs text-gray-600">
              {task.employees.map((emp, i) => (
                <span key={emp.id}>{emp.name}</span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-around gap-1 pt-2">
          <button
            onClick={() => onStatusChange(task.id, "todo")}
            className={`bg-gray-600 w-full rounded-full flex items-center justify-center transition-all ${
              task.status === "todo"
                ? "bg-gray-500 text-white"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
            title="قيد الانتظار"
          >
            <Circle className="w-4 h-4" />
          </button>
          <button
            onClick={() => onStatusChange(task.id, "in_progress")}
            className={`bg-gray-600 w-full rounded-full flex items-center justify-center transition-all ${
              task.status === "in_progress"
                ? "bg-blue-500 text-white"
                : "bg-blue-100 text-blue-400 hover:bg-blue-200"
            }`}
            title="قيد التنفيذ"
          >
            <Clock className="w-4 h-4" />
          </button>
          <button
            onClick={() => onStatusChange(task.id, "review")}
            className={`bg-gray-600 w-full rounded-full flex items-center justify-center transition-all ${
              task.status === "review"
                ? "bg-purple-500 text-white"
                : "bg-purple-100 text-purple-400 hover:bg-purple-200"
            }`}
            title="مراجعة"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onStatusChange(task.id, "done")}
            className={`bg-gray-600 w-full p-2 rounded-full flex items-center justify-center transition-all ${
              task.status === "done"
                ? "bg-green-500 text-white"
                : "bg-green-100 text-green-400 hover:bg-green-200"
            }`}
            title="مكتملة"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ظل زائف */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/20" />
    </motion.div>
  );
}

function AddTaskModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: any) => void;
}) {
  const [formData, setFormData] = useState({
    taskName: "",
    projectName: projects[0],
    taskDescription: "",
    startWork: new Date().toISOString().split("T")[0],
    endWork: "",
    priority: "medium" as Task["priority"],
    status: "todo" as Task["status"],
    employeeIds: [] as number[],
    city: "",
    postal_code: "",
    house_number: "",
    worker_arrival_time: "",
    task_type: "",
    work_area: "",
    bus_number: "",
    driver_name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      work_area: formData.work_area
        ? parseFloat(formData.work_area)
        : undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-linear-to-r from-purple-500 to-blue-500 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Add New Task</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title Task *
              </label>
              <input
                type="text"
                value={formData.taskName}
                onChange={(e) =>
                  setFormData({ ...formData, taskName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <select
                value={formData.projectName}
                onChange={(e) =>
                  setFormData({ ...formData, projectName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {projects.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Description
            </label>
            <textarea
              rows={2}
              value={formData.taskDescription}
              onChange={(e) =>
                setFormData({ ...formData, taskDescription: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startWork}
                onChange={(e) =>
                  setFormData({ ...formData, startWork: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                value={formData.endWork}
                onChange={(e) =>
                  setFormData({ ...formData, endWork: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as any })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Type
              </label>
              <input
                type="text"
                value={formData.task_type}
                onChange={(e) =>
                  setFormData({ ...formData, task_type: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Example: Concrete Pouring, Electrical Installation..."
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
             Task Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="px-4 py-2 border rounded-lg"
                placeholder="City"
              />
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) =>
                  setFormData({ ...formData, postal_code: e.target.value })
                }
                className="px-4 py-2 border rounded-lg"
                placeholder="Postal Code"
              />
              <input
                type="text"
                value={formData.house_number}
                onChange={(e) =>
                  setFormData({ ...formData, house_number: e.target.value })
                }
                className="px-4 py-2 border rounded-lg"
                placeholder="House Number/Building"
              />
            </div>
          </div>

          {/* تفاصيل العمل*/}
          <div className="border-t pt-4">
            <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Task Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="time"
                value={formData.worker_arrival_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    worker_arrival_time: e.target.value,
                  })
                }
                className="px-4 py-2 border rounded-lg"
                placeholder="Worker Arrival Time"
              />
              <input
                type="number"
                step="0.01"
                value={formData.work_area}
                onChange={(e) =>
                  setFormData({ ...formData, work_area: e.target.value })
                }
                className="px-4 py-2 border rounded-lg"
                placeholder="Work Area (m²)"
              />
            </div>
          </div>

          {/* وسيلة النقل*/}
          <div className="border-t pt-4">
            <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Bus className="w-4 h-4" />
              Transportation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.bus_number}
                onChange={(e) =>
                  setFormData({ ...formData, bus_number: e.target.value })
                }
                className="px-4 py-2 border rounded-lg"
                placeholder="Bus Number"
              />
              <input
                type="text"
                value={formData.driver_name}
                onChange={(e) =>
                  setFormData({ ...formData, driver_name: e.target.value })
                }
                className="px-4 py-2 border rounded-lg"
                placeholder="Driver Name"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Task
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const isLoading = useAppSelector(selectTaskLoading);
  const error = useAppSelector(selectTaskError);

  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const statCards = [
    {
      title: "Total Tasks",
      value: tasks.length,
      change: "+12%",
      icon: Building2,
      linear: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      description: "Registered companies",
    },
    {
      title: "Priority high",
      value: tasks.filter((t) => t.priority === "high").length,
      change: "+12%",
      icon: Flame,
      linear: "from-red-500 to-blue-500",
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      description: "Registered companies",
    },
 
  ];
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (search) {
      filtered = filtered.filter(
        (t) =>
          t.taskName.toLowerCase().includes(search.toLowerCase()) ||
          t.taskDescription?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (filterPriority !== "all")
      filtered = filtered.filter((t) => t.priority === filterPriority);
    if (filterStatus !== "all")
      filtered = filtered.filter((t) => t.status === filterStatus);
    if (filterProject !== "all")
      filtered = filtered.filter((t) => t.projectName === filterProject);
    return filtered;
  }, [tasks, search, filterPriority, filterStatus, filterProject]);

  const handleAddTask = (newTask: any) => {
    dispatch(createTask(newTask));
  };

  const handleStatusChange = (id: number, status: Task["status"]) => {
    dispatch(updateTask({ id, data: { status } }));
  };

  const handleDeleteTask = (id: number) => {
    dispatch(deleteTask(id));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className=" mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 p-4">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 text-slate-600 p-4">
            جاري تحميل المهام...
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for tasks..."
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
                <option value="all">All</option>
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
                <option value="all">All</option>
                <option value="todo">Todo</option>
                <option value="in_progress">in_progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
        
            
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <ListTodo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد مهام</p>
            <p className="text-gray-400 text-sm mt-1">
              قم بإضافة مهمة جديدة للبدء
            </p>
          </div>
        ) : viewMode === "list" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onView={(id) => console.log("View", id)}
                onEdit={(id) => console.log("Edit", id)}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
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
                            className={`text-xs px-1.5 py-0.5 rounded ${priorityConfig[task.priority].color}`}
                          >
                            {priorityConfig[task.priority].label}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(task.endWork).toLocaleDateString()}
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
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
}
