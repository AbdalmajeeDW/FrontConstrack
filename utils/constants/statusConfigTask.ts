import { CheckCircle, Circle, Clock, Eye } from "lucide-react";

export const statusConfig = {
  todo: {
    label: "Pending",
    color: "bg-gray-100 text-gray-600",
    icon: Circle,
    order: 1,
  },
  in_progress: {
    label: "In progress",
    color: "bg-blue-100 text-blue-700",
    icon: Clock,
    order: 2,
  },
  review: {
    label: "Review",
    color: "bg-purple-100 text-purple-700",
    icon: Eye,
    order: 3,
  },
  done: {
    label: "Completed",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
    order: 4,
  },
};