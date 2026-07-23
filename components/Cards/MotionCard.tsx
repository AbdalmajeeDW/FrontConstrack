// components/ui/MotionCard.tsx
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MotionCardProps {
  children: ReactNode;
  className?: string;
  hoverY?: number;
  hoverScale?: number;
  duration?: number;
  enableTap?: boolean;
}

export default function MotionCard({
  children,
  className = "",
  hoverY = -5,
  hoverScale = 1.02,
  duration = 0.30,
  enableTap = true,
}: MotionCardProps) {
  return (
    <motion.div
      whileHover={{
        y: hoverY,
        scale: hoverScale,
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 25,
          mass: 0.5,
          duration: duration,
        },
      }}
      whileTap={
        enableTap
          ? {
              scale: 0.98,
              transition: { duration: 0.08 },
            }
          : undefined
      }
      className={`
        bg-white rounded-2xl shadow-xl overflow-hidden 
        will-change-transform
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}