import { Task } from "@/store/types/task.types";
import { useMemo, useState, useCallback } from "react";

export function useTasks(tasks: Task[]) {
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");
  const [project, setProject] = useState<number | "all">("all");
  const [filterType, setFilterType] = useState<
    "all" | "done" | "in_progress" | "high_priority" | "overdue"|'urgent'
  >("all");

  const handleSetSearch = useCallback((value: string) => {
    setSearch(value);
    setFilterType("all");  
  }, []);

  const handleSetFilterType = useCallback((type: typeof filterType) => {
    setFilterType(type);
    if (type === "all") {
      setPriority("all");
      setStatus("all");
      setProject("all");
      setSearch("");
    }
  }, []);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (filterType === "all") {
      if (search) {
        result = result.filter(
          (t) =>
            t.taskName.toLowerCase().includes(search.toLowerCase()) ||
            t.taskDescription?.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (priority !== "all") {
        result = result.filter((t) => t.priority === priority);
      }

      if (status !== "all") {
        result = result.filter((t) => t.status === status);
      }

      if (project !== "all") {
        result = result.filter((t) => t.project_id === project);
      }
    } else {
      const now = new Date();
      
      switch (filterType) {
        case "done":
          result = result.filter((t) => t.status === "done");
          break;
        case "in_progress":
          result = result.filter((t) => t.status === "in_progress");
          break;
        case "high_priority":
          result = result.filter((t) => t.priority === "high");
          break;
           case "urgent":
          result = result.filter((t) => t.priority === "urgent");
          break;
        case "overdue":
          result = result.filter(
            (t) =>
              t.status !== "done" &&
              new Date(t.endWork) < now
          );
          break;
        default:
          break;
      }
    }

    return result;
  }, [tasks, search, priority, status, project, filterType]);

  return {
    filteredTasks,
    search,
    setSearch: handleSetSearch, 
    priority,
    setPriority,
    status,
    setStatus,
    project,
    setProject,
    filterType,
    setFilterType: handleSetFilterType,
  };
}