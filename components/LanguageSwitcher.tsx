// components/LanguageSwitcher.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";

interface LanguageOption {
  code: "en" | "ar";
  label: string;
  flag: string;
  dir: "ltr" | "rtl";
}

const languages: LanguageOption[] = [
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as "en" | "ar" | null;

    if (savedLang) {
      setLanguage(savedLang);
      i18n.changeLanguage(savedLang);

      const dir = savedLang === "ar" ? "rtl" : "ltr";
      document.documentElement.dir = dir;
      document.documentElement.lang = savedLang;
    }
  }, [i18n]);

  const changeLanguage = (langCode: "en" | "ar") => {
    const selectedLang = languages.find((l) => l.code === langCode);
    if (!selectedLang) return;

    setLanguage(langCode);
    localStorage.setItem("lang", langCode);
    i18n.changeLanguage(langCode);

    document.documentElement.dir = selectedLang.dir;
    document.documentElement.lang = langCode;

    if (langCode === "ar") {
      document.documentElement.classList.add("rtl");
      document.documentElement.classList.remove("ltr");
    } else {
      document.documentElement.classList.add("ltr");
      document.documentElement.classList.remove("rtl");
    }

    setIsOpen(false);
  };

  const currentLanguage = languages.find((l) => l.code === language);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-0.5 rounded-xl border border-purple-400 bg-white/80 backdrop-blur-sm hover:border-purple-400 hover:bg-white hover:shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="text-sm font-medium text-gray-700">
          {currentLanguage?.label}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 min-w-[200px] bg-white rounded-xl shadow-2xl border border-gray-100/50 backdrop-blur-sm py-2 z-50 overflow-hidden"
            role="listbox"
          >
            {languages.map((lang) => {
              const isActive = language === lang.code;
              return (
                <motion.button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-purple/10 text-primary-600"
                        : "hover:bg-gray-50 text-gray-700"
                    }
                  `}
                  whileHover={{ x: 5 }}
                  role="option"
                  aria-selected={isActive}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="flex-1 text-sm font-medium text-left">
                    {lang.label}
                  </span>
                  {isActive && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Check className="w-4 h-4 text-primary-500" />
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
