import { ChartArea, Users, Home, Settings, FileText, ClipboardList, User, LogOut, Projector } from "lucide-react";
import { BrickWall } from "lucide-react";
import { ReactNode } from "react";
import { FolderOpenDot } from 'lucide-react';

export interface NavLink {
  id: number;
  name: string;
  url: string;
  icon?: ReactNode;
  title?: string;
  description?: string;
  subLinks?: NavLink[];
  protected?: boolean;
}

export const superAdminLinks: NavLink[] = [
  {
    id: 1,
    name: "Home",
    icon: <Home size={20} />,
    url: "/superAdmin",
    title: "Dashboard",
    description: "Welcome to the dashboard",
  },
  {
    id: 2,
    name: "Users",
    icon: <Users size={20} />,
    url: "/superAdmin/users",
    title: "Users Management",
    description: "Manage all users on the platform",
  },
  {
    id: 3,
    name: "Tenants",
    icon: <BrickWall size={20} />,
    url: "/superAdmin/tenants",
    title: "Companies Management",
    description: "Manage all companies on the platform",
  },

  {
    id: 5,
    name: "Subscriptions",
    icon: <ChartArea size={20} />,
    url: "/superAdmin/subscriptionsManagement",
    title: "Subscriptions Management",
    description: "Overview of subscriptions and plans",
  },
  {
    id: 6,
    name: "Logout",
    icon: <LogOut size={20} />,
    url: "/superAdmin/login",
  },
];

export const adminLinks: NavLink[] = [
  {
    id: 1,
    name: "Home",
    icon: <Home size={20} />,
    url: "/admin",
    title: "Tenant Admin Dashboard",
    description: "Overview of your company and operations",
  },
  {
    id: 2,
    name: "Employees",
    icon: <Users size={20} />,
    url: "/admin/employees",
    title: "Employees",
    description: "View all employees in the company",
  },
   {
    id: 3,
    name: "Projects",
    icon: <FolderOpenDot size={20} />,
    url: "/admin/projects",
    title: "Projects",
    description: "View all projects in the company",
  },
  {
    id: 4,
    name: "Reports",
    icon: <FileText size={20} />,
    url: "/admin/reports",
    title: "Reports",
    description: "View performance and statistics reports",
  },
    {
    id: 5,
    name: "Tasks",
    icon: <ClipboardList size={20} />,
    url: "/admin/tasks",
    title: "Tasks",
    description: "View and manage company tasks",
  },
  {
    id: 6,
    name: "Logout",
    icon: <LogOut size={20} />,
    url: "/admin/login",
  },
];

export const employeeLinks: NavLink[] = [
  {
    id: 1,
    name: "Home",
    icon: <Home size={20} />,
    url: "/employee",
    title: "Employee Dashboard",
    description: "Welcome to your employee workspace",
  },
  {
    id: 2,
    name: "My Tasks",
    icon: <ClipboardList size={20} />,
    url: "/employee/tasks",
    title: "My Tasks",
    description: "View your assigned tasks",
  },
  {
    id: 3,
    name: "Profile",
    icon: <User size={20} />,
    url: "/employee/profile",
    title: "Profile",
    description: "Update your personal account information",
  },
  {
    id: 4,
    name: "Logout",
    icon: <LogOut size={20} />,
    url: "/employee/login",
  },
];

export const links: NavLink[] = [
  ...superAdminLinks,
  ...adminLinks,
  ...employeeLinks,
];
