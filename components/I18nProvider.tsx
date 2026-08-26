// components/I18nProvider.tsx
"use client";

import { useEffect, useState } from "react";
import i18n from "@/i18n/i18n";

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";

    const dir = savedLang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = savedLang;

    i18n.changeLanguage(savedLang).then(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return <>{children}</>;
}
