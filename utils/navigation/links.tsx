import {
  ChartArea,
  Users,
  Home,
  Settings,
  FileText,
  ClipboardList,
  User,
  LogOut,
  Projector,
  Building2,
  Receipt,
  Activity,
} from "lucide-react";
import { BrickWall } from "lucide-react";
import { ReactNode } from "react";
import { FolderOpenDot } from "lucide-react";
import { CalendarCheck } from "lucide-react";
import { PartyPopper } from "lucide-react";

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
    name: "Super Admins",
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
    url: "",
    title: "Dashboard",
    description: "Overview of your company and operations",
  },
  {
    id: 2,
    name: "Employees",
    icon: <Users size={20} />,
    url: "employees",
    title: "Employees",
    description: "View all employees in the company",
  },
  {
    id: 3,
    name: "Projects",
    icon: <Building2 size={20} />,
    url: "projects",
    title: "Projects",
    description: "View all projects in the company",
  },
  {
    id: 4,
    name: "Invoices",
    icon: <Receipt size={20} />,
    url: "Invoices",
    title: "Invoices",
    description: "View performance and statistics Invoices",
  },
  // {
  //   id: 5,
  //   name: "Reports",
  //   icon: <FileText size={20} />,
  //   url: "reports",
  //   title: "Reports",
  //   description: "View performance and statistics reports",
  // },
  {
    id: 6,
    name: "Tasks",
    icon: <CalendarCheck size={20} />,
    url: "tasks",
    title: "Tasks",
    description: "View and manage company tasks",
  },
  {
    id: 7,
    name: "Activity",
    icon: <Activity size={20} />,
    url: "activities",
    title: "Activity",
    description: "View and manage company Activity",
  },
];

export const employeeLinks: NavLink[] = [
  {
    id: 1,
    name: "Home",
    icon: <Home size={20} />,
    url: "",
    title: "Employee Dashboard",
    description: "Welcome to your employee workspace",
  },
  {
    id: 2,
    name: "My Tasks",
    icon: <CalendarCheck size={20} />,
    url: "tasks",
    title: "My Tasks",
    description: "View your assigned tasks",
  },
  {
    id: 3,
    name: "Public holidays",
    icon: <PartyPopper size={20} />,
    url: "publicHolidays",
    title: "Public holidays",
    description: "View public holidays",
  },
  {
    id: 4,
    name: "Profile",
    icon: <User size={20} />,
    url: "profile",
    title: "Profile",
    description: "Update your personal account information",
  },
];

export const links: NavLink[] = [
  ...superAdminLinks,
  ...adminLinks,
  ...employeeLinks,
];
