export const getInvoicesInsights = (stats: any, t: any) => {
  return {
    title: t("invoices.insights.title"),
    items: [
      {
        label: t("invoices.insights.total"),
        value: stats.total,
        color: "text-purple-600",
        description: t("invoices.insights.total_desc"),
      },
      {
        label: t("invoices.insights.today"),
        value: stats.today,
        color: "text-emerald-600",
        description: t("invoices.insights.today_desc"),
      },
      {
        label: t("invoices.insights.employees"),
        value: stats.employees,
        color: "text-blue-600",
        description: t("invoices.insights.employees_desc"),
      },
    ],
  };
};
export const getEmployeesInsights = (stats: any, t: any) => {
  return {
    title: t("employees.insights.title"),
    items: [
      {
        label: t("employees.insights.average_salary"),
        value: `€${stats.averageSalary.toFixed(0)}`,
        color: "text-emerald-600",
        description: `${stats.totalEmployees} ${t("employees.insights.employees_count")}`,
      },
      {
        label: t("employees.insights.specializations"),
        value: stats.specializations,
        color: "text-purple-600",
        description: t("employees.insights.different_roles"),
      },
      {
        label: t("employees.insights.license_holders"),
        value: stats.totalEmployees > 0
          ? `${Math.round((stats.withDrivingLicense / stats.totalEmployees) * 100)}%`
          : "0%",
        color: "text-amber-600",
        description: `${stats.withDrivingLicense} ${t("employees.insights.have_license")}`,
      },
    ],
  };
};
export const getProjectsInsights = (stats: any, mostActiveCity: string, newestProject: any, endingThisMonth: number, t: any) => {
  return {
    title: t("projects.insights.title"),
    items: [
      {
        label: t("projects.insights.most_active_city"),
        value: mostActiveCity || "N/A",
        color: "text-purple-600",
        description: `${stats.totalProjects} ${t("projects.insights.projects")}`,
      },
      {
        label: t("projects.insights.newest_project"),
        value: newestProject?.name || "N/A",
        color: "text-blue-600",
        description: newestProject
          ? new Date(newestProject.start_date).toLocaleDateString()
          : t("projects.insights.no_projects"),
      },
      {
        label: t("projects.insights.ending_this_month"),
        value: endingThisMonth,
        color: "text-amber-600",
        description: t("projects.insights.deadlines"),
      },
    ],
  };
};