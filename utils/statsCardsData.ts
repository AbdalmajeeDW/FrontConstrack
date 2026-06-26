
import { Crown, Star, UserCheck, UserPlus, Users } from "lucide-react";
import React, { ReactNode } from "react";
import {
  Building2,    // للمباني/الشركات (Total Companies)
  Building,     // للمباني (Active Companies)
  Construction, // للبناء والتشييد (Projects)
  TicketCheck,  // للاشتراكات (Subscriptions)
  Clock,        // للساعة (Pending)
  Trophy,       // للكأس (Premium)
} from "lucide-react";
interface Card {
  title: { text: string };
  value: { text: number | string };
  icon?: ReactNode;
  bgColor: string;
  gradient: string;
  description: string;
}

type DataType = "trainers" | "players" | "premium";

const getNewSignupsCount = (users: any[]) => {
  return users.filter((u) => {
    if (!u?.createdAt) return false;
    const createdAt = new Date(u.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  }).length;
};

export const statsArray = (
  type?: DataType,
 
  premium?: number,
): Card[] => {
  switch (type) {
    case "trainers":
      return [
        {
          title: { text: "Total Trainers" },
          value: { text: 1 }, 
          icon: React.createElement(Users, {
            className: "w-7 h-7 text-blue-600",
          }),
          bgColor: "bg-blue-100",
          gradient: "from-blue-500 to-blue-600",
          description: "All registered trainers",
        },
        {
          title: { text: "Active Trainers" },
          value: { text: 1},
          icon: React.createElement(UserCheck, {
            className: "w-7 h-7 text-green-600",
          }),
          bgColor: "bg-green-100",
          gradient: "from-green-500 to-emerald-600",
          description: "Currently active trainers",
        },
        {
          title: { text: "New Trainers" },
          value: { text: 1},
          icon: React.createElement(UserPlus, {
            className: "w-7 h-7 text-orange-600",
          }),
          bgColor: "bg-orange-100",
          gradient: "from-orange-500 to-red-500",
          description: "New trainers in last 30 days",
        },
        {
          title: { text: "Rating" },
          value: { text:1 },
          icon: React.createElement(Star, {
            className: "w-7 h-7 text-orange-600",
          }),
          bgColor: "bg-orange-100",
          gradient: "from-orange-500 to-red-500",
          description: "rating trainers in last 30 days",
        },
      ];

    case "players":
return [
  {
    title: { text: "Total Companies" },
    value: { text: 0 },
    icon: React.createElement(Building2, {
      className: "w-7 h-7 text-blue-600",
    }),
    bgColor: "bg-blue-100",
    gradient: "from-blue-500 to-blue-600",
    description: "All registered companies",
  },
  {
    title: { text: "Active Companies" },
    value: { text: 0 },
    icon: React.createElement(Building, {
      className: "w-7 h-7 text-green-600",
    }),
    bgColor: "bg-green-100",
    gradient: "from-green-500 to-emerald-600",
    description: "Companies with active subscriptions",
  },
  {
    title: { text: "Pending Approval" },
    value: { text: 0 },
    icon: React.createElement(Clock, {
      className: "w-7 h-7 text-yellow-600",
    }),
    bgColor: "bg-yellow-100",
    gradient: "from-yellow-500 to-amber-600",
    description: "Companies waiting for approval",
  },
  {
    title: { text: "Premium Companies" },
    value: { text: 0 },
    icon: React.createElement(Trophy, {
      className: "w-7 h-7 text-purple-600",
    }),
    bgColor: "bg-purple-100",
    gradient: "from-purple-500 to-pink-500",
    description: "Companies on premium plan",
  },
];
    default:
      return [];
  }
};
