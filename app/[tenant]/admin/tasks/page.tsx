"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  ListTodo,
  Building2,
  Flame,
  Loader,
  UserX,
  Trash2,
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
import TaskCard from "@/components/Cards/TaskCard";
import AddTaskModal from "@/components/Modal/Modal";
import StatsCard from "@/components/Cards/StatsCard";
import { toast } from "sonner";
import {
  fetchProjects,
  selectProject,
} from "@/store/slices/admin/projectsSlice";
import { useTasks } from "@/hooks/useTasks";
import { statsTasks } from "@/config/statsConfig";
import { DeleteConfirmModal } from "@/components/Modal/DeleteConfirmModal";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

export default function TasksPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const isLoading = useAppSelector(selectTaskLoading);
  const error = useAppSelector(selectTaskError);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const projects = useAppSelector(selectProject);
  const [deleteModal, setDeleteModal] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    filteredTasks,
    search,
    setSearch,
    priority: filterPriority,
    setPriority: setFilterPriority,
    status: filterStatus,
    setStatus: setFilterStatus,
    project: filterProject,
    setProject: setFilterProject,
    filterType,
    setFilterType,
  } = useTasks(tasks);

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
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleAddTask = async (newTask: any) => {
    try {
      const result = await dispatch(createTask(newTask)).unwrap();
      await dispatch(fetchTasks()).unwrap();
      toast.success(t("tasks.create_success"));
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
      toast.success(t("tasks.update_success"));
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleStatusChange = (id: number, status: Task["status"]) => {
    dispatch(updateTask({ id, data: { status } }));
  };

  const handleDeleteClick = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setDeleteModal({
        id: task.id,
        name: task.taskName,
      });
    }
  };

  const handleConfirmDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      await dispatch(deleteTask(id)).unwrap();
      toast.success(t("tasks.delete_success"));
      setDeleteModal(null);
      await dispatch(fetchTasks()).unwrap();
    } catch (err: any) {
      toast.error(err || t("tasks.delete_error"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatCardClick = (filter: string) => {
    if (
      filter === "all" ||
      filter === "done" ||
      filter === "in_progress" ||
      filter === "high_priority" ||
      filter === "overdue"
    ) {
      setFilterType(filter);
    }

    if (filter === "done") {
      setFilterStatus("done");
    } else if (filter === "in_progress") {
      setFilterStatus("in_progress");
    } else if (filter === "high_priority") {
      setFilterPriority("high");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
      </div>
    );
  }

  const statCards = statsTasks(tasks, t);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className="mx-auto px-4 py-6 space-y-6">
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            const { icon, ...cardProps } = card;
            return (
              <div
                key={index}
                onClick={() => handleStatCardClick(card.filter)}
                className={`
                  relative group cursor-pointer rounded-2xl
                  ${filterType === card.filter ? `ring-2 ${card.ringColor}` : ""}
                `}
              >
                <StatsCard {...cardProps} icon={<Icon />} />
              </div>
            );
          })}
        </motion.div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder={t("tasks.search_placeholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={filterProject}
                onChange={(e) =>
                  setFilterProject(
                    e.target.value === "all" ? "all" : Number(e.target.value),
                  )
                }
                className="px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="all">{t("tasks.filter_all_projects")}</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="all">{t("tasks.filter_all_priorities")}</option>
                <option value="high">{t("tasks.priority.high")}</option>
                <option value="medium">{t("tasks.priority.medium")}</option>
                <option value="low">{t("tasks.priority.low")}</option>
                <option value="urgent">{t("addTask.priority.urgent")}</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="all">{t("tasks.filter_all_status")}</option>
                <option value="in_progress">
                  {t("tasks.status.in_progress")}
                </option>
                <option value="done">{t("tasks.status.done")}</option>
              </select>

              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{t("tasks.new_task")}</span>
              </button>
            </div>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <ListTodo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t("tasks.no_tasks")}</p>
            <p className="text-gray-400 text-sm mt-1">
              {filterType !== "all"
                ? t("tasks.no_tasks_filter")
                : t("tasks.no_tasks_add")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onView={(id) => console.log("View", id)}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
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

      <DeleteConfirmModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={() => handleConfirmDelete(deleteModal!.id)}
        title={t("tasks.delete_title")}
        itemType="task"
        itemName={deleteModal?.name}
        confirmText={t("tasks.delete_confirm")}
        isLoading={isDeleting}
        icon={<Trash2 className="w-6 h-6 text-red-600" />}
      />
    </div>
  );
}
