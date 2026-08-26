import { AlertTriangle, Flag } from "lucide-react";

export const priorityConfig = {
  low: {
    labelKey: "taskCard.priority.low",
    color: "bg-green-100 text-green-700",
    icon: Flag,
    order: 1,
  },
  medium: {
    labelKey: "taskCard.priority.medium",
    color: "bg-yellow-100 text-yellow-700",
    icon: Flag,
    order: 2,
  },
  high: {
    labelKey: "taskCard.priority.high",
    color: "bg-orange-100 text-orange-700",
    icon: Flag,
    order: 3,
  },
  urgent: {
    labelKey: "taskCard.priority.urgent",
    color: "bg-red-100 text-red-700",
    icon: AlertTriangle,
    order: 4,
  },
};
export const getPriorityColor = (priority?: string) => {
  const config = getPriorityConfig(priority);
  return config.color;
};
export const getPriorityConfig = (priority?: string) => {
  if (!priority || !priorityConfig[priority as keyof typeof priorityConfig]) {
    return priorityConfig.medium;
  }
  return priorityConfig[priority as keyof typeof priorityConfig];
};export const getPriorityIcon = (priority?: string) => {
  const config = getPriorityConfig(priority);
  return config.icon;
};