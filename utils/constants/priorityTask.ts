import { AlertTriangle, Flag } from "lucide-react";

export const priorityConfig = {
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
export const getPriorityColor = (priority: string | undefined) => {
  if (!priority) return "bg-gray-500 text-white";
  
  const colors = {
    urgent: "bg-red-500 text-white",
    high: "bg-orange-500 text-white",
    medium: "bg-yellow-500 text-white",
    low: "bg-green-500 text-white",
  };
  
  return colors[priority as keyof typeof colors] || "bg-gray-500 text-white";
};
export const getPriorityConfig = (priority: string | undefined) => {
  if (!priority || !priorityConfig[priority as keyof typeof priorityConfig]) {
    return priorityConfig.medium;
  }
  return priorityConfig[priority as keyof typeof priorityConfig];
};