"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  adminLinks,
  employeeLinks,
  links,
  superAdminLinks,
} from "../../utils/navigation/links";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { BrickWall } from "lucide-react";
import { initializeAuth } from "@/store/slices/superAdmin/superAuthSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { tenantAdminInitialize } from "@/store/slices/admin/tenantAdminAuthSlice";
import { logout as tenantLogout } from "../../store/services/admin/tenantAdminAuth";
import { logout as superLogout } from "../../store/services/superAdmins/superAdmin";

export default function Page() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    dispatch(initializeAuth());
    dispatch(tenantAdminInitialize());
  }, [dispatch]);

  const { user } = useAppSelector((state) => state.superAuth);

  const { tenantAdmin } = useAppSelector((state) => state.tenantAdminAuth);

  const currentUser = user || tenantAdmin;

  const tenantName = pathname.split("/")[1] || "";
  const currentRoleLabel = pathname.startsWith("/superAdmin")
    ? user?.name
    : pathname.includes("/admin")
      ? tenantAdmin?.name
      : pathname.includes("/employee")
        ? "Employee"
        : "Guest";

  const displayName = currentUser?.name || "Guest";

  const displayRole = currentUser?.role
    ? currentUser.role.replace(/_/g, " ")
    : currentRoleLabel;

  const getMenuItems = () => {
    if (pathname.startsWith("/superAdmin")) {
      return superAdminLinks;
    }

    if (pathname.includes("/admin")) {
      return adminLinks;
    }

    if (pathname.includes("/employee")) {
      return employeeLinks;
    }

    return [];
  };
  const buildLink = (linkUrl: string) => {
    const cleaned = linkUrl.replace(/^\/+/, "");

    if (pathname.includes("/admin")) {
      return `/${tenantName}/admin${cleaned ? "/" + cleaned : ""}`;
    }

    if (pathname.includes("/employee")) {
      return `/${tenantName}/employee${cleaned ? "/" + cleaned : ""}`;
    }

    return linkUrl;
  };
  const handleLogout = async () => {
    try {
      console.log("PATH:", pathname);
      console.log("TENANT:", tenantName);

      if (tenantName && tenantName !== "superAdmin") {
        await tenantLogout();

        router.replace(`/${tenantName}/login`);
        return;
      }

      if (pathname.startsWith("/superAdmin")) {
        await superLogout();

        router.replace("/superAdmin/login");
        return;
      }

      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const menuItems = getMenuItems();

  const logoutItem =
    menuItems.find((link) => link.name === "Logout") ||
    links.find((link) => link.name === "Logout");

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarVariants = {
    expanded: {
      width: "208px",
    },

    collapsed: {
      width: "80px",
    },
  };

  const linkVariants = {
    initial: {
      opacity: 0,
      x: -20,
    },

    animate: {
      opacity: 1,
      x: 0,
    },

    exit: {
      opacity: 0,
      x: -20,
    },
  };

  return (
    <>
      <motion.div
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, type: "spring", damping: 20 }}
        className="fixed top-0 left-0 h-screen z-50 
          bg-linear-to-b from-gray-900 via-gray-800 to-gray-900
          shadow-2xl overflow-hidden"
      >
        <div className="relative h-full flex flex-col overflow-y-auto overflow-x-hidden">
          <style jsx>{`
            .overflow-y-auto::-webkit-scrollbar {
              width: 4px;
            }
            .overflow-y-auto::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 10px;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.3);
              border-radius: 10px;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.5);
            }
          `}</style>
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-20 z-50 p-1.5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-500 transition-colors" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-purple-500 transition-colors" />
            )}
          </button>
          <div
            className={`px-4 pt-8 pb-6 shrink-0 ${isCollapsed ? "px-2" : "px-4"}`}
          >
            <div
              className={`flex items-center ${isCollapsed ? "justify-center" : "justify-center gap-2"}`}
            >
              <motion.div whileHover={{ rotate: 10 }} className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-50"></div>
                <BrickWall
                  size={28}
                  className="relative text-purple-400 rotate-60"
                />
              </motion.div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent whitespace-nowrap"
                  >
                    CONSTRACK
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="h-0.5 bg-linear-to-r from-transparent via-purple-800 to-transparent mx-4 "></div>{" "}
          <div
            className={`px-4 py-6 shrink-0 ${isCollapsed ? "px-2" : "px-4"}`}
          >
            <motion.div whileHover={{ scale: 1.02 }} className="relative group">
              <div
                className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}
              >
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-blue-500 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-12 h-12 rounded-full bg-linear-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg"></div>
                </div>

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-gray-200 font-semibold truncate">
                        {displayName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs  py-0.5 rounded-full text-gray-200`}
                        >
                          {displayRole}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
          <div className="h-0.5 bg-linear-to-r from-transparent via-purple-800 to-transparent mx-4 "></div>{" "}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-3 min-h-0">
            <ul className="space-y-1">
              {menuItems.map((link, index) => {
                const parts = pathname.split("/");

                console.log(pathname);

                const isActive =
                  parts[3] === link.url ||
                  pathname === link.url ||
                  link.subLinks?.some((sub) => pathname === sub.url);

                return (
                  <motion.li
                    key={link.id}
                    initial="initial"
                    animate="animate"
                    variants={linkVariants}
                    transition={{ delay: index * 0.05 }}
                  >
                    {!link.name.includes("Logout") && (
                      <Link
                        href={buildLink(link.url)}
                        className={`
                        relative flex items-center 
                        ${isCollapsed ? "justify-center" : "gap-3"} 
                        px-3 py-3 rounded-xl
                        transition-all duration-300 group
                        ${
                          isActive
                            ? "bg-linear-to-r from-purple-500/20 to-blue-500/20 text-white shadow-lg"
                            : "text-gray-300 hover:text-white hover:bg-white/10"
                        }
                      `}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 w-1 h-8 bg-linear-to-b from-purple-400 to-blue-400 rounded-r-full"
                          />
                        )}

                        <span
                          className={`relative z-10 shrink-0 ${isActive ? "text-purple-400" : "text-gray-400 group-hover:text-purple-400"}`}
                        >
                          {link.icon}
                        </span>

                        <AnimatePresence>
                          {!isCollapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              className="relative z-10 font-medium text-sm whitespace-nowrap"
                            >
                              {link.name}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {isCollapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                            {link.name}
                          </div>
                        )}
                      </Link>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </nav>
          <div className="p-3 mt-auto border-t border-gray-700/50 shrink-0">
            <button
              onClick={handleLogout}
              className={`
    w-full flex items-center 
    ${isCollapsed ? "justify-center" : "gap-3"} 
    px-3 py-3 rounded-xl
    transition-all duration-300 group
    text-red-300 hover:text-red-400 hover:bg-red-500/10
  `}
            >
              <LogOut className="w-5 h-5 shrink-0" />

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium text-sm whitespace-nowrap"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>

              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                  Logout
                </div>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      <div
        className={`transition-all duration-300 ${isCollapsed ? "w-20" : "w-52"}`}
      />
    </>
  );
}
