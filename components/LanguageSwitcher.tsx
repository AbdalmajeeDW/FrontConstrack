// components/LanguageSwitcher.tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const [language, setLanguage] = useState<"en" | "ar">("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as "en" | "ar" | null;

    if (savedLang) {
      setLanguage(savedLang);
      i18n.changeLanguage(savedLang);

      // ✅ تعيين اتجاه الصفحة
      const dir = savedLang === "ar" ? "rtl" : "ltr";
      document.documentElement.dir = dir;
      document.documentElement.lang = savedLang;
    }
  }, [i18n]);

  const toggleLanguage = () => {
    const newLang = language === "ar" ? "en" : "ar";

    setLanguage(newLang);
    localStorage.setItem("lang", newLang);
    i18n.changeLanguage(newLang);

    const dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = newLang;

    if (newLang === "ar") {
      document.documentElement.classList.add("rtl");
      document.documentElement.classList.remove("ltr");
    } else {
      document.documentElement.classList.add("ltr");
      document.documentElement.classList.remove("rtl");
    }
  };

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={toggleLanguage}
        className="flex items-center cursor-pointer gap-2 px-4 py-1.5 rounded-xl border border-primary text-primary-400 hover:bg-white hover:text-primary-400 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium uppercase">
          {language === "ar" ? "AR" : "EN"}
        </span>
      </motion.button>
    </div>
  );
}
