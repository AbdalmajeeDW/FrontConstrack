import {
  Building2,
  FileText,
  MapPin,
  User,
  Phone,
  Calendar,
  FolderKanban,
} from "lucide-react";

export const taskFields = (
  formData: any,
  projects: any[],
) => [
  {
    id: 1,
    name: "taskName",
    type: "text",
    value: formData.taskName,
    label: "Task Name",
    placeHolder: "Foundation Excavation",
    icon: FolderKanban,
    group:'taskProperties'
  },
  {
    id: 2,
    name: "project_id",
    type: "select",
    value: formData.project_id,
    label: "Project",
    icon: Building2,
    options: projects.map((project) => ({
      value: project.id,
      label: project.name,
    })),
    group:'taskProperties'

  },
  {
    id: 3,
    name: "taskDescription",
    type: "textarea",
    value: formData.taskDescription,
    label: "Task Description",
    placeHolder: "Describe the task...",
    icon: FileText,
    group:'taskProperties'

  },
   {
    id: 4,
    name: "startWork",
    type: "date",
    value: formData.startWork,
    label: "Start Date",
    icon: Calendar,
    group:'taskProperties'

  },
  {
    id: 5,
    name: "endWork",
    type: "date",
    value: formData.endWork,
    label: "End Date",
    icon: Calendar,
    group:'taskProperties'

  },
   {
    id: 6,
    name: "priority",
    type: "select",
    value: formData.priority,
    label: "Priority",
    icon: FolderKanban,
    options: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
      { value: "urgent", label: "Urgent" },
    ],
    group:'taskProperties'

  },
    {
    id: 7,
    name: "task_type",
    type: "text",
    value: formData.task_type,
    label: "Task Type",
    placeHolder: "Concrete Work",
    icon: FolderKanban,
    group:'taskProperties'

  },
  {
    id: 8,
    name: "city",
    type: "text",
    value: formData.city,
    label: "City",
    placeHolder: "Amsterdam",
    icon: MapPin,
    group:'taskLocation'

  },
  {
    id: 9,
    name: "postal_code",
    type: "text",
    value: formData.postal_code,
    label: "Postal Code",
    placeHolder: "1012 AB",
    icon: MapPin,
    group:'taskLocation'

  },
  {
    id: 10,
    name: "house_number",
    type: "text",
    value: formData.house_number,
    label: "House Number",
    placeHolder: "25A",
    icon: Building2,
    group:'taskLocation'

  },
  {
    id: 11,
    name: "worker_arrival_time",
    type: "time",
    value: formData.worker_arrival_time,
    label: "Arrival Time",
    icon: Calendar,
    group:'taskDetails'

  },

  {
    id: 12,
    name: "work_area",
    type: "number",
    value: formData.work_area,
    label: "Work Area (m²)",
    placeHolder: "250",
    icon: MapPin,
    group:'taskDetails'

  },
  {
    id: 13,
    name: "bus_number",
    type: "text",
    value: formData.bus_number,
    label: "Bus Number",
    placeHolder: "BUS-01",
    icon: Building2,
    group:'Transportation'
  },
  {
    id: 14,
    name: "driver_name",
    type: "text",
    value: formData.driver_name,
    label: "Driver Name",
    placeHolder: "John Smith",
    icon: User,
    group:'Transportation'

  },
 
 

];

