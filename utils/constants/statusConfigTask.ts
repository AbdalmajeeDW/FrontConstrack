import { CheckCircle, Circle, Clock, Eye } from "lucide-react";

export const statusConfig = {
 
  in_progress: {
    label: "In progress",
    color: "bg-blue-100 text-blue-700",
    icon: Clock,
    order: 2,
  },

  done: {
    label: "Completed",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
    order: 4,
  },
};