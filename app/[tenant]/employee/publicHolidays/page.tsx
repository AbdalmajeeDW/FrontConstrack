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
  Filter,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const holidaysData = [
  {
    id: 1,
    titleKey: "holidays.new_year",
    date: "2026-01-01",
    dayKey: "holidays.days.thursday",
    dutchName: "Nieuwjaarsdag",
    typeKey: "holidays.types.national",
    descriptionKey: "holidays.new_year_desc",
    icon: <Star className="w-5 h-5" />,
    color: "from-blue-500 to-purple-500",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  {
    id: 2,
    titleKey: "holidays.good_friday",
    date: "2026-04-03",
    dayKey: "holidays.days.friday",
    dutchName: "Goede Vrijdag",
    typeKey: "holidays.types.religious",
    descriptionKey: "holidays.good_friday_desc",
    icon: <Star className="w-5 h-5" />,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
  {
    id: 3,
    titleKey: "holidays.easter",
    date: "2026-04-05 - 2026-04-06",
    dayKey: "holidays.days.sunday_monday",
    dutchName: "Pasen",
    typeKey: "holidays.types.religious",
    descriptionKey: "holidays.easter_desc",
    icon: <Star className="w-5 h-5" />,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-100",
    textColor: "text-pink-700",
  },
  {
    id: 4,
    titleKey: "holidays.kings_day",
    date: "2026-04-27",
    dayKey: "holidays.days.monday",
    dutchName: "Koningsdag",
    typeKey: "holidays.types.national",
    descriptionKey: "holidays.kings_day_desc",
    icon: <Gift className="w-5 h-5" />,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
  {
    id: 5,
    titleKey: "holidays.liberation_day",
    date: "2026-05-05",
    dayKey: "holidays.days.tuesday",
    dutchName: "Bevrijdingsdag",
    typeKey: "holidays.types.national",
    descriptionKey: "holidays.liberation_day_desc",
    icon: <Gift className="w-5 h-5" />,
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  {
    id: 6,
    titleKey: "holidays.ascension_day",
    date: "2026-05-14",
    dayKey: "holidays.days.thursday",
    dutchName: "Hemelvaartsdag",
    typeKey: "holidays.types.religious",
    descriptionKey: "holidays.ascension_day_desc",
    icon: <Star className="w-5 h-5" />,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-700",
  },
  {
    id: 7,
    titleKey: "holidays.pentecost",
    date: "2026-05-24 - 2026-05-25",
    dayKey: "holidays.days.sunday_monday",
    dutchName: "Pinksteren",
    typeKey: "holidays.types.religious",
    descriptionKey: "holidays.pentecost_desc",
    icon: <Star className="w-5 h-5" />,
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-100",
    textColor: "text-violet-700",
  },
  {
    id: 8,
    titleKey: "holidays.christmas",
    date: "2026-12-25 - 2026-12-26",
    dayKey: "holidays.days.friday_saturday",
    dutchName: "Kerstmis",
    typeKey: "holidays.types.religious",
    descriptionKey: "holidays.christmas_desc",
    icon: <Star className="w-5 h-5" />,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
];

export default function PublicHolidays() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const holidayStats = {
    total: holidaysData.length,
    national: holidaysData.filter(
      (h) => t(h.typeKey) === t("holidays.types.national"),
    ).length,
    religious: holidaysData.filter(
      (h) => t(h.typeKey) === t("holidays.types.religious"),
    ).length,
    weekends: holidaysData.filter(
      (h) =>
        t(h.dayKey).includes("Sunday") ||
        t(h.dayKey).includes("Saturday") ||
        t(h.dayKey).includes("الأحد") ||
        t(h.dayKey).includes("السبت"),
    ).length,
  };

  const filteredHolidays = holidaysData.filter((holiday) => {
    const search = searchTerm.toLowerCase();
    const title = t(holiday.titleKey).toLowerCase();
    const dutchName = holiday.dutchName.toLowerCase();
    const type = t(holiday.typeKey).toLowerCase();

    const matchesSearch = title.includes(search) || dutchName.includes(search);
    const matchesType =
      selectedType === "all" ||
      type === t("holidays.types.national").toLowerCase() ||
      type === t("holidays.types.religious").toLowerCase();

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
      <div className="mx-auto">
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
                    {t("holidays.title")}
                  </h1>
                  <p className="text-sm text-slate-500">
                    {t("holidays.subtitle")} • {holidaysData.length}{" "}
                    {t("holidays.stats.total")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              label: t("holidays.stats.total"),
              value: holidayStats.total,
              icon: Calendar,
              color: "from-blue-500 to-cyan-500",
              bg: "bg-blue-100",
            },
            {
              label: t("holidays.stats.national"),
              value: holidayStats.national,
              icon: Building2,
              color: "from-orange-500 to-red-500",
              bg: "bg-orange-100",
            },
            {
              label: t("holidays.stats.religious"),
              value: holidayStats.religious,
              icon: Users,
              color: "from-purple-500 to-pink-500",
              bg: "bg-purple-100",
            },
            {
              label: t("holidays.stats.weekend"),
              value: holidayStats.weekends,
              icon: Clock,
              color: "from-green-500 to-emerald-500",
              bg: "bg-green-100",
            },
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
                  <p className="text-2xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center bg-gradient-to-br ${stat.color}`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

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
                      {t(holiday.titleKey)}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {holiday.dutchName}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl ${holiday.bgColor} flex items-center justify-center`}
                  >
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
                    <span className="text-slate-700">{t(holiday.dayKey)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        t(holiday.typeKey) === t("holidays.types.national")
                          ? "bg-orange-100 text-orange-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {t(holiday.typeKey)}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {t(holiday.descriptionKey)}
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
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              {t("holidays.no_holidays")}
            </h3>
            <p className="text-sm text-slate-500">
              {t("holidays.no_holidays_desc")}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
