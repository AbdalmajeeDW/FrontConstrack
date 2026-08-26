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
    label: "addTask.fields.task_name",
    labelKey: "addTask.fields.task_name",
    placeHolder: "addTask.placeholders.task_name",
    placeholderKey: "addTask.placeholders.task_name",
    icon: FolderKanban,
    group: 'taskProperties'
  },
  {
    id: 2,
    name: "project_id",
    type: "select",
    value: formData.project_id ?? "",
    label: "addTask.fields.project_name",
    labelKey: "addTask.fields.project_name",
    icon: Building2,
    options: [
      ...projects.map((project) => ({
        value: project.id,
        label: project.name,
        labelKey: project.name,
      })),
    ],
    group: "taskProperties"
  },
  {
    id: 3,
    name: "taskDescription",
    type: "textarea",
    value: formData.taskDescription,
    label: "addTask.fields.task_description",
    labelKey: "addTask.fields.task_description",
    placeHolder: "addTask.placeholders.task_description",
    placeholderKey: "addTask.placeholders.task_description",
    icon: FileText,
    group: 'taskProperties'
  },
  {
    id: 4,
    name: "startWork",
    type: "date",
    value: formData.startWork,
    label: "addTask.fields.start_date",
    labelKey: "addTask.fields.start_date",
    icon: Calendar,
    group: 'taskProperties'
  },
  {
    id: 5,
    name: "endWork",
    type: "date",
    value: formData.endWork,
    label: "addTask.fields.end_date",
    labelKey: "addTask.fields.end_date",
    icon: Calendar,
    group: 'taskProperties'
  },
  {
    id: 6,
    name: "priority",
    type: "select",
    value: formData.priority,
    label: "addTask.fields.priority",
    labelKey: "addTask.fields.priority",
    icon: FolderKanban,
    options: [
      { value: "low", label: "addTask.priority.low", labelKey: "addTask.priority.low" },
      { value: "medium", label: "addTask.priority.medium", labelKey: "addTask.priority.medium" },
      { value: "high", label: "addTask.priority.high", labelKey: "addTask.priority.high" },
      { value: "urgent", label: "addTask.priority.urgent", labelKey: "addTask.priority.urgent" },
    ],
    group: 'taskProperties'
  },
  {
    id: 7,
    name: "task_type",
    type: "text",
    value: formData.task_type,
    label: "addTask.fields.task_type",
    labelKey: "addTask.fields.task_type",
    placeHolder: "addTask.placeholders.task_type",
    placeholderKey: "addTask.placeholders.task_type",
    icon: FolderKanban,
    group: 'taskProperties'
  },
  {
    id: 8,
    name: "city",
    type: "text",
    value: formData.city,
    label: "addTask.fields.city",
    labelKey: "addTask.fields.city",
    placeHolder: "addTask.placeholders.city",
    placeholderKey: "addTask.placeholders.city",
    icon: MapPin,
    group: 'taskLocation'
  },
  {
    id: 9,
    name: "postal_code",
    type: "text",
    value: formData.postal_code,
    label: "addTask.fields.postal_code",
    labelKey: "addTask.fields.postal_code",
    placeHolder: "addTask.placeholders.postal_code",
    placeholderKey: "addTask.placeholders.postal_code",
    icon: MapPin,
    group: 'taskLocation'
  },
  {
    id: 10,
    name: "house_number",
    type: "text",
    value: formData.house_number,
    label: "addTask.fields.house_number",
    labelKey: "addTask.fields.house_number",
    placeHolder: "addTask.placeholders.house_number",
    placeholderKey: "addTask.placeholders.house_number",
    icon: Building2,
    group: 'taskLocation'
  },
  {
    id: 11,
    name: "worker_arrival_time",
    type: "time",
    value: formData.worker_arrival_time,
    label: "addTask.fields.arrival_time",
    labelKey: "addTask.fields.arrival_time",
    icon: Calendar,
    group: 'taskDetails'
  },
  {
    id: 12,
    name: "work_area",
    type: "number",
    value: formData.work_area,
    label: "addTask.fields.work_area",
    labelKey: "addTask.fields.work_area",
    placeHolder: "addTask.placeholders.work_area",
    placeholderKey: "addTask.placeholders.work_area",
    icon: MapPin,
    group: 'taskDetails'
  },
  {
    id: 13,
    name: "bus_number",
    type: "text",
    value: formData.bus_number,
    label: "addTask.fields.bus_number",
    labelKey: "addTask.fields.bus_number",
    placeHolder: "addTask.placeholders.bus_number",
    placeholderKey: "addTask.placeholders.bus_number",
    icon: Building2,
    group: 'Transportation'
  },
  {
    id: 14,
    name: "driver_name",
    type: "text",
    value: formData.driver_name,
    label: "addTask.fields.driver_name",
    labelKey: "addTask.fields.driver_name",
    placeHolder: "addTask.placeholders.driver_name",
    placeholderKey: "addTask.placeholders.driver_name",
    icon: User,
    group: 'Transportation'
  },
];