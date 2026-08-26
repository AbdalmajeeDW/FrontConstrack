import { ReactNode } from "react";
import MotionCard from "./MotionCard";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  bgColor: string;
  gradient?: string;
  description?: string;
  textColor?: string;
}
export default function StatsCard({
  title,
  value,
  icon,
  bgColor,
  gradient,
  description,
  textColor,
}: StatsCardProps) {
  return (
    <MotionCard className="relative group">
      <div
        className={`
          absolute top-0 right-0 w-32 h-32 
          bg-linear-to-br ${gradient} 
          opacity-10 rounded-full blur-2xl 
     
        
        `}
      />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={` p-3 rounded-xl ${bgColor} ${textColor}`}>
            {icon}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-800 transition-all duration-300 ">
              {value}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-1 transition-colors duration-300 ">
          {title}
        </h3>
        <p className="text-sm text-gray-500 transition-opacity duration-300 group-hover:opacity-80">
          {description}
        </p>
      </div>
    </MotionCard>
  );
}
