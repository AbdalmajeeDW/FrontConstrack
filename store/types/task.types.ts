export interface TaskEmployee {
  id: number;
  name: string;
  email?: string;
  role?: string;
  avatar?: string;
}

export interface Task {
  id: number;
  taskName: string;
  taskDescription?: string;
  project_id: number|null;
  priority: "low" | "medium" | "high" | "urgent";
  status: "in_progress" | "done";
  startWork: string;
  endWork: string;
  assigned_at?: string;
  is_active?: boolean;

  city?: string;
  postal_code?: string;
  house_number?: string;

  worker_arrival_time?: string;
  task_type?: string;
  work_area?: number;
  images: [];
  bus_number?: string;
  driver_name?: string;

  employees?: TaskEmployee[];
}
