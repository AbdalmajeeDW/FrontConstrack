
import { useMemo, useState } from "react";
import { statsTasks } from "@/config/statsConfig";
import { useTranslation } from "react-i18next";

export type TaskFilter =
  | "all"
  | "done"
  | "in_progress"
  | "overdue";

export function useTaskData(tasks: any[]) {
    const { t } = useTranslation();
  
  const [selectedStatus, setSelectedStatus] =
    useState<TaskFilter>("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      switch (selectedStatus) {
        case "done":
          return task.status === "done";

        case "in_progress":
          return task.status === "in_progress";

        case "overdue":
          return (
            task.status !== "done" &&
            new Date(task.endWork) < new Date()
          );

        default:
          return true;
      }
    });
  }, [tasks, selectedStatus]);

  const stats = useMemo(
    () => statsTasks(tasks,t),
    [tasks]
  );

  return {
    stats,
    filteredTasks,
    selectedStatus,
    setSelectedStatus,
  };
}