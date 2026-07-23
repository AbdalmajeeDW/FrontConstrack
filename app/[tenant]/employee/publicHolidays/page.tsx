"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Building2,
  Gift,
  Star,
  Clock,
  ChevronRight,
  Filter,
  Search,
  Sun,
  Moon,
} from "lucide-react";

const holidaysData = [
  {
    id: 1,
    title: "New Year's Day",
    date: "2026-01-01",
    day: "Thursday",
    dutchName: "Nieuwjaarsdag",
    type: "national",
    description: "Celebration of the start of the new year. Many people attend fireworks and family gatherings.",
    icon: <Star className="w-5 h-5" />,
    color: "from-blue-500 to-purple-500",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  {
    id: 2,
    title: "Good Friday",
    date: "2026-04-03",
    day: "Friday",
    dutchName: "Goede Vrijdag",
    type: "religious",
    description: "Commemoration of the crucifixion of Jesus. Many businesses remain open but some may close early.",
    icon: <Star className="w-5 h-5" />,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
  {
    id: 3,
    title: "Easter Sunday & Monday",
    date: "2026-04-05 - 2026-04-06",
    day: "Sunday & Monday",
    dutchName: "Pasen",
    type: "religious",
    description: "Celebration of the resurrection of Jesus. Two-day celebration with family gatherings and Easter egg hunts.",
    icon: <Star className="w-5 h-5" />,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-100",
    textColor: "text-pink-700",
  },
  {
    id: 4,
    title: "King's Day",
    date: "2026-04-27",
    day: "Monday",
    dutchName: "Koningsdag",
    type: "national",
    description: "Celebration of the King's birthday. The entire country turns orange with festivals, flea markets, and parties.",
    icon: <Gift className="w-5 h-5" />,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
  {
    id: 5,
    title: "Liberation Day",
    date: "2026-05-05",
    day: "Tuesday",
    dutchName: "Bevrijdingsdag",
    type: "national",
    description: "Celebration of the end of WWII occupation. Special celebration in 2026 as it's a lustrum year (every 5 years).",
    icon: <Gift className="w-5 h-5" />,
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  {
    id: 6,
    title: "Ascension Day",
    date: "2026-05-14",
    day: "Thursday",
    dutchName: "Hemelvaartsdag",
    type: "religious",
    description: "Commemoration of Jesus' ascension to heaven. Many people take a long weekend.",
    icon: <Star className="w-5 h-5" />,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-700",
  },
  {
    id: 7,
    title: "Pentecost",
    date: "2026-05-24 - 2026-05-25",
    day: "Sunday & Monday",
    dutchName: "Pinksteren",
    type: "religious",
    description: "Celebration of the descent of the Holy Spirit. Two-day celebration with church services and family time.",
    icon: <Star className="w-5 h-5" />,
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-100",
    textColor: "text-violet-700",
  },
  {
    id: 8,
    title: "Christmas Day",
    date: "2026-12-25 - 2026-12-26",
    day: "Friday & Saturday",
    dutchName: "Kerstmis",
    type: "religious",
    description: "Celebration of the birth of Jesus. Two-day celebration with family gatherings, feasts, and gift-giving.",
    icon: <Star className="w-5 h-5" />,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
];

const holidayStats = {
  total: holidaysData.length,
  national: holidaysData.filter(h => h.type === "national").length,
  religious: holidaysData.filter(h => h.type === "religious").length,
  weekends: holidaysData.filter(h => h.day.includes("Sunday") || h.day.includes("Saturday")).length,
};

export default function PublicHolidays() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const filteredHolidays = holidaysData.filter((holiday) => {
    const matchesSearch = holiday.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          holiday.dutchName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || holiday.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getDayName = (dateString: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
      <div className="mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">
                    Public Holidays 
                  </h1>
                  <p className="text-sm text-slate-500">
                    2026 Calendar • {holidaysData.length} Official Holidays
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl shadow-sm">
                <Sun className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-slate-600">2026</span>
                <Moon className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Holidays", value: holidayStats.total, icon: Calendar, color: "from-blue-500 to-cyan-500", bg: "bg-blue-100" },
            { label: "National", value: holidayStats.national, icon: Building2, color: "from-orange-500 to-red-500", bg: "bg-orange-100" },
            { label: "Religious", value: holidayStats.religious, icon: Users, color: "from-purple-500 to-pink-500", bg: "bg-purple-100" },
            { label: "Weekend", value: holidayStats.weekends, icon: Clock, color: "from-green-500 to-emerald-500", bg: "bg-green-100" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6 flex flex-wrap items-center gap-4"
        >
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search holidays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Types</option>
              <option value="national">National</option>
              <option value="religious">Religious</option>
            </select>
          </div>
        </motion.div>

        {/* Holidays Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredHolidays.map((holiday, index) => (
            <motion.div
              key={holiday.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              <div className={`h-2 bg-gradient-to-r ${holiday.color}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800 group-hover:text-orange-600 transition-colors">
                      {holiday.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {holiday.dutchName}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${holiday.bgColor} flex items-center justify-center`}>
                    {holiday.icon}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{holiday.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{holiday.day}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      holiday.type === 'national' 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {holiday.type.charAt(0).toUpperCase() + holiday.type.slice(1)}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {holiday.description}
                </p>

                
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredHolidays.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-2xl border border-slate-100"
          >
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">No holidays found</h3>
            <p className="text-sm text-slate-500">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}

 
      </div>
    </div>
  );
}