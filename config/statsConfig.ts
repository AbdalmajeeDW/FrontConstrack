import i18n from "@/i18n/i18n";
import { TFunction } from "i18next";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Flame,
  type LucideIcon,
  Users,
  UserCheck,
  HardDrive,
  UserX,
  Building2,
  ListTodo,
  Calendar,
  TrendingUp,
  Receipt,
  Euro,
  Car,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export const statusOptions = [
  {
    value: "active",
    label: "Active",
    icon: "✅",
    color: "bg-green-100 text-green-700",
  },
  {
    value: "pending",
    label: "Pending",
    icon: "⏳",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "suspended",
    label: "Suspended",
    icon: "⛔",
    color: "bg-red-100 text-red-700",
  },
  {
    value: "expired",
    label: "Expired",
    icon: "⌛",
    color: "bg-slate-100 text-slate-600",
  },
];

export const planOptions = [
  { value: "Basic", label: "Basic", price: "$49", color: "bg-slate-100" },
  {
    value: "Professional",
    label: "Professional",
    price: "$99",
    color: "bg-blue-100",
  },
  {
    value: "Enterprise",
    label: "Enterprise",
    price: "$149",
    color: "bg-purple-100",
  },
];

export const statsTasks = (tasks: any[],t: TFunction) => {
  const completed = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const overdue = tasks.filter(
    (t) => t.status !== "done" && new Date(t.endWork) < new Date(),
  ).length;
  const highPriority = tasks.filter((t) => t.priority === "high").length;

  return [
    {
      id: "all",
      title: t("tasks.stats.all"),
      value: tasks.length,
      icon: FileText,
      filter: "all" as const,
      color: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      ringColor: "ring-purple-500",
      description: t("tasks.stats.all_desc"),
    },
    {
      id: "completed",
      title: t("tasks.stats.completed"),
      value: completed,
      filter: "done" as const,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      ringColor: "ring-green-500",
      description: t("tasks.stats.completed_desc"),
    },
    {
      id: "progress",
      title: t("tasks.stats.in_progress"),
      value: inProgress,
      filter: "in_progress" as const,
      icon: Clock,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      ringColor: "ring-blue-500",
      description: t("tasks.stats.in_progress_desc"),
    },
    {
      id: "overdue",
      title: t("tasks.stats.overdue"),
      value: overdue,
      filter: "overdue" as const,
      icon: AlertCircle,
      color: "from-red-500 to-rose-500",
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      ringColor: "ring-red-500",
      description: t("tasks.stats.overdue_desc"),
    },
    {
      id: "high",
      title: t("tasks.stats.high_priority"),
      value: highPriority,
      filter: "high_priority" as const,
      icon: Flame,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
      ringColor: "ring-orange-500",
      description: t("tasks.stats.high_priority_desc"),
    },
  ];
};
export const statsEmployees = (employees: any[], t: TFunction) => {
  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((e) => e.is_active).length,
    inactiveEmployees: employees.filter((e) => !e.is_active).length,
    withDrivingLicense: employees.filter((e) => e.driving_license).length,
    averageSalary:
      employees.length > 0
        ? employees.reduce((sum, e) => sum + Number(e.salary || 0), 0) /
          employees.length
        : 0,
    specializations: new Set(
      employees.map((e) => e.specialization).filter(Boolean),
    ).size,
  };

  const statCards = [
    {
      title: t("employees.stats.total"),
      value: stats.totalEmployees,
      icon: Users,
      gradient: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      description: t("employees.stats.total_desc"),
      ringColor: "ring-purple-600",
      filter: "all" as const,
    },
    {
      title: t("employees.stats.active"),
      value: stats.activeEmployees,
      icon: UserCheck,
      gradient: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600",
      description: t("employees.stats.active_desc"),
      ringColor: "ring-emerald-600",
      filter: "active" as const,
    },
    {
      title: t("employees.stats.inactive"),
      value: stats.inactiveEmployees,
      icon: UserX,
      gradient: "from-rose-500 to-pink-500",
      bgColor: "bg-rose-100",
      textColor: "text-rose-600",
      description: t("employees.stats.inactive_desc"),
      ringColor: "ring-rose-600",
      filter: "inactive" as const,
    },
    {
      title: t("employees.stats.license"),
      value: stats.withDrivingLicense,
      icon: HardDrive,
      gradient: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-100",
      textColor: "text-amber-600",
      description: t("employees.stats.license_desc"),
      ringColor: "ring-amber-600",
      filter: "license" as const,
    },
  ];

  return {
    stats,
    statCards,
  };
};
export const statsHomeAdmin = (employees: any[],projects:any,tasks:any, handleStatClick: (path: string) => void, t: TFunction) => {


  const statsCard = [
    {
      title: t("dashboard.stats.projects"),
      value: projects.length,
      icon: Building2 ,
      color: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      gradient: "from-purple-500 to-blue-500",
      description: t("dashboard.stats.projects_desc"),
      link: `/admin/projects`,
      onClick: () => handleStatClick("/admin/projects"),
    },
    {
      title: t("dashboard.stats.employees"),
      value: employees.length,
      icon: Users ,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      gradient: "from-blue-500 to-cyan-500",
      description: t("dashboard.stats.employees_desc"),
      link: `/admin/employees`,
      onClick: () => handleStatClick("/admin/employees"),
    },
    {
      title: t("dashboard.stats.tasks"),
      value: tasks.length,
      icon: ListTodo ,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      gradient: "from-blue-500 to-cyan-500",
      description: t("dashboard.stats.tasks_desc"),
      link: `/admin/tasks`,
      onClick: () => handleStatClick("/admin/tasks"),
    },
  ];

  return {

    statsCard,
  };
};

export const statsInvoices = (invoices: any[], t: TFunction) => {
   const stats = {
    total: invoices.length,
    today: invoices.filter((inv) => {
      const today = new Date();
      const invDate = new Date(inv.invoice_date);
      return (
        invDate.getDate() === today.getDate() &&
        invDate.getMonth() === today.getMonth() &&
        invDate.getFullYear() === today.getFullYear()
      );
    }).length,
    month: invoices.filter((inv) => {
      const today = new Date();
      const invDate = new Date(inv.invoice_date);
      return (
        invDate.getMonth() === today.getMonth() &&
        invDate.getFullYear() === today.getFullYear()
      );
    }).length,
    employees: new Set(invoices.map((inv) => inv.employee?.id)).size,
  };

  const statCards = [
 {
      title: t("invoices.stats.total"),
      value: stats.total,
      icon: Receipt ,
      gradient: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      description: t("invoices.stats.total_desc"),
      ringColor: "ring-purple-600",
      filter: "all" as const,
    },
    {
      title: t("invoices.stats.today"),
      value: stats.today,
      icon: Calendar ,
      gradient: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600",
      description: t("invoices.stats.today_desc"),
      ringColor: "ring-emerald-600",
      filter: "today" as const,
    },
    {
      title: t("invoices.stats.month"),
      value: stats.month,
      icon: TrendingUp ,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      description: t("invoices.stats.month_desc"),
      ringColor: "ring-blue-600",
      filter: "month" as const,
    },
  ];

  return {
    stats,
    statCards,
  };
};


export const statsProfileAdmin = (age:number,employee:any, t: TFunction) => {
const formatDate = (dateString: string | null | undefined) => {
    const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statsCard =[
              {
                icon: Calendar,
                label: t("profile.age"),
                value: `${age} ${t("profile.years")}`,
                bg: "bg-blue-50",
                iconColor: "text-blue-600",
              },
              {
                icon: Euro,
                label: t("profile.salary"),
                value: `${Number(employee.salary) || 0}`,
                bg: "bg-blue-50",
                iconColor: "text-blue-600",
              },
              {
                icon: Car,
                label: t("profile.driving_license"),
                value: employee.driving_license
                  ? t("profile.yes")
                  : t("profile.no"),
                bg: "bg-blue-50",
                iconColor: "text-blue-600",
              },
              {
                icon: Mail,
                label: t("profile.email"),
                value: employee.email,
                bg: "bg-blue-50",
                iconColor: "text-blue-600",
              },
              {
                icon: Phone,
                label: t("profile.phone"),
                value: employee.phone || t("profile.not_provided"),
                bg: "bg-green-50",
                iconColor: "text-green-600",
              },
              {
                icon: MapPin,
                label: t("profile.address"),
                value: employee.address || t("profile.not_provided"),
                bg: "bg-orange-50",
                iconColor: "text-orange-600",
              },
              {
                icon: Calendar,
                label: t("profile.birth_date"),
                value: employee.birth_date
                  ? formatDate(employee.birth_date)
                  : t("profile.not_provided"),
                bg: "bg-purple-50",
                iconColor: "text-purple-600",
              },
              {
                icon: Clock,
                label: t("profile.joined_date"),
                value: employee.created_at
                  ? formatDate(employee.created_at)
                  : "-",
                bg: "bg-amber-50",
                iconColor: "text-amber-600",
              },
            ]

  return {

    statsCard,
  };
};