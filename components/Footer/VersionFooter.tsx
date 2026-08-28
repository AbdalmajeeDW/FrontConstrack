"use client";

import packageJson from "@/package.json";
import { useTranslation } from "react-i18next";

export default function VersionFooter() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <footer className={`fixed bottom-4 z-50 ${isRTL ? "left-4" : "right-4"}`}>
      <div className="bg-purple-700 backdrop-blur-sm text-white text-[11px] px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">
        v {packageJson.version}
      </div>
    </footer>
  );
}
