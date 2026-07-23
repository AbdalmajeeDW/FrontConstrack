// components/ui/StatsCard.tsx
import React, { ReactNode } from "react";
import MotionCard from "./MotionCard";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  bgColor: string;
  gradient?: string;
  description?: string;
  change?: string; 
  changeColor?: string; 
}

export default function StatsCard({
  title,
  value,
  icon,
  bgColor,
  gradient,
  description,
  change,
  changeColor = "text-green-600 bg-green-100",
}: StatsCardProps) {
  return (
    <MotionCard 
      className="relative group"
      hoverY={-6}
      hoverScale={1.02}
      duration={0.12}
    >
      <div
        className={`
          absolute top-0 right-0 w-32 h-32 
          bg-linear-to-br ${gradient} 
          opacity-10 rounded-full blur-2xl 
          transition-all duration-300 ease-out
          group-hover:opacity-20 group-hover:scale-110
        `}
      />

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`
              p-3 rounded-xl ${bgColor} 
              transition-all duration-300 ease-out
              group-hover:scale-110 group-hover:shadow-lg
            `}
          >
            {icon}
          </div>
          
          <div className="flex items-center gap-3">
            {change && (
              <span
                className={`
                  text-xs font-medium px-2 py-1 rounded-full
                  ${changeColor}
                  transition-all duration-300
                  group-hover:scale-105
                `}
              >
                {change}
              </span>
            )}
            <span className="text-2xl font-bold text-gray-800 transition-all duration-300 group-hover:scale-105">
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