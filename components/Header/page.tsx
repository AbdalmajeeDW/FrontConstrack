"use client";

import { usePathname, useRouter } from "next/navigation";
import { links } from "@/utils/navigation/links";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import UploadReceiptModal from "../Modal/UploadReceiptModal";
import I18nProvider from "../I18nProvider";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";

function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openReceipt, setOpenReceipt] = useState(false);
  const [empID, setEmpID] = useState<Number>(0);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    let userData = localStorage.getItem("tenant-user");

    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        console.log("User Data:", parsedData);

        if (parsedData?.id) {
          setEmpID(parsedData.id);
        }
        if (parsedData?.role) {
          setRole(parsedData.role);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showNotifications) setShowNotifications(false);
      if (showUserMenu) setShowUserMenu(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showNotifications, showUserMenu]);

  const getPageInfoFromPath = () => {
    const segments = pathname.split("/");
    const tenantName = segments[1] || "";
    const roleFromPath = segments[2] || "";
    const pageName = segments[3] || "dashboard";

    const getLinksByRole = () => {
      if (roleFromPath === "admin") {
        return links.filter(
          (link) =>
            link.url?.startsWith("admin") ||
            link.url === "" ||
            link.url === "employees" ||
            link.url === "tasks" ||
            link.url === "projects" ||
            link.url === "Invoices" ||
            link.url === "reports" ||
            link.url === "activities",
        );
      } else if (roleFromPath === "employee") {
        return links.filter(
          (link) =>
            link.url?.startsWith("employee") ||
            link.url === "" ||
            link.url === "tasks" ||
            link.url === "publicHolidays" ||
            link.url === "profile",
        );
      }
      return links;
    };

    const relevantLinks = getLinksByRole();

    let foundLink = relevantLinks.find((link) => {
      if (link.url === pageName) return true;
      if (link.url === pathname) return true;
      if (link.url === segments[segments.length - 1]) return true;
      if (link.url === "" && pageName === "dashboard") return true;
      return false;
    });

    if (!foundLink) {
      for (const link of relevantLinks) {
        if (link.subLinks) {
          const subMatch = link.subLinks.find(
            (sub) =>
              sub.url === pageName ||
              sub.url === pathname ||
              sub.url === segments[segments.length - 1],
          );
          if (subMatch) {
            foundLink = subMatch;
            break;
          }
        }
      }
    }

    const pageTitle = foundLink?.title
      ? t(`navigation.${foundLink.title}`, foundLink.title)
      : pageName.charAt(0).toUpperCase() + pageName.slice(1);

    const pageDescription = foundLink?.description
      ? t(`navigation.${foundLink.description}`, foundLink.description)
      : `Welcome to ${pageName}` || "Welcome to CONSTRACK";

    return {
      pageTitle,
      pageDescription,
      tenantName,
      role: roleFromPath,
      pageName,
    };
  };

  const {
    pageTitle,
    pageDescription,
    tenantName,
    role: roleFromPath,
    pageName,
  } = getPageInfoFromPath();

  return (
    <div>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`
          sticky top-0 z-40 transition-all duration-300
          ${
            scrolled
              ? "bg-white/95 backdrop-blur-md shadow-lg"
              : "bg-white shadow-md"
          }
        `}
      >
        <div className="px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <motion.h1
                key={pageTitle}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-2xl lg:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent truncate ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {pageTitle}
              </motion.h1>
              <motion.p
                key={pageDescription}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className={`text-sm text-gray-500 mt-1 truncate ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {pageDescription}
              </motion.p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <I18nProvider>
                <LanguageSwitcher />
              </I18nProvider>
              <Button
                className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white font-bold cursor-pointer rounded-lg hover:opacity-90 transition-all text-sm shadow-md whitespace-nowrap"
                onClick={() => setOpenReceipt(true)}
              >
                {t("invoices.header.upload_button")}
              </Button>
            </div>
          </div>
        </div>

        <div
          className="h-px bg-linear-to-r 
          from-transparent via-gray-200 to-transparent"
        ></div>
      </motion.div>

      <UploadReceiptModal
        isOpen={openReceipt}
        onClose={() => setOpenReceipt(false)}
        employeeId={Number(empID)}
        onSuccess={() => {}}
      />
    </div>
  );
}

export default Page;
