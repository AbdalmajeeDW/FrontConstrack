// ✅ components/InsightsGrid.tsx
"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { ReactNode } from "react";

interface InsightItem {
  label: string;
  value: string | number;
  color?: string;
  description?: string;
}

interface InsightsGridProps {
  title: string;
  icon?: ReactNode;
  items: InsightItem[];
  columns?: 2 | 3 | 4;
  delay?: number;
}

export const InsightsGrid = ({
  title,
  icon = <Zap className="w-5 h-5 text-purple-500" />,
  items,
  columns = 3,
  delay = 0.5,
}: InsightsGridProps) => {
  const colClasses = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-linear-to-r from-purple-50 to-blue-50 rounded-2xl p-6 shadow-md"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>

      <div className={`grid grid-cols-1 ${colClasses[columns]} gap-4`}>
        {items.map((item, index) => (
          <div key={index} className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">{item.label}</p>
            <p
              className={`text-2xl font-bold ${item.color || "text-gray-800"}`}
            >
              {item.value}
            </p>
            {item.description && (
              <p className="text-xs text-gray-400 mt-1">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
