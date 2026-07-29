"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, ListTodo, Building2, Flame, Loader } from "lucide-react";
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
import TaskCard from "@/components/Cards/TaskCard";
import AddTaskModal from "@/components/Modal/Modal";
import StatsCard from "@/components/Cards/StatsCard";
import { toast } from "sonner";

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const isLoading = useAppSelector(selectTaskLoading);
  const error = useAppSelector(selectTaskError);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditClick = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setIsModalOpen(true);
    }
  };
  const handleAdd = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const statCards = [
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: <Building2 className="w-6 h-6 text-purple-600" />,
      linear: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      description: "Registered companies",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      title: "Priority high",
      value: tasks.filter((t) => t.priority === "high").length,
      icon: <Flame className="w-6 h-6 text-red-600" />,
      linear: "from-red-500 to-blue-500",
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      description: "Registered companies",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      title: "Completed Tasks",
      value: tasks.filter((t) => t.status === "done").length,
      icon: <Flame className="w-6 h-6 text-green-600" />,
      linear: "from-green-500 to-green-500",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      description: "Registered companies",
      gradient: "from-purple-500 to-blue-500",
    },
  ];

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
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
    // if (filterProject !== "all")
    //   filtered = filtered.filter((t) => t.project_id === filterProject);
    return filtered;
  }, [tasks, search, filterPriority, filterStatus, filterProject]);

  const handleAddTask = async (newTask: any) => {
    try {
      const result = await dispatch(createTask(newTask)).unwrap();
      await dispatch(fetchTasks()).unwrap();
      toast.success("Created task successfly.");
      return result;
    } catch (error) {
      throw error;
    }
  };
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
  const handleStatusChange = (id: number, status: Task["status"]) => {
    dispatch(updateTask({ id, data: { status } }));
  };

  const handleDeleteTask = (id: number) => {
    dispatch(deleteTask(id));
  };
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
        {isLoading && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 text-slate-600 p-4">
            Loading tasks...
          </div>
        )}
        <motion.div
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {statCards.map((card, index) => (
            <StatsCard key={index} {...card} />
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
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>
            </div>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <ListTodo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tasks available</p>
            <p className="text-gray-400 text-sm mt-1">
              Add a new task to start.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {!isLoading &&
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={(id) => console.log("View", id)}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
          </div>
        )}
      </div>
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onAdd={handleAddTask}
        onUpdate={handleUpdateTask}
        editingTask={editingTask}
      />
    </div>
  );
}
