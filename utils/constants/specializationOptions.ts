export const specializationOptions = [
  { value: "", labelKey: "specializations.select" },
  { value: "Concrete Worker", labelKey: "specializations.concrete_worker" },
  { value: "Electrician", labelKey: "specializations.electrician" },
  { value: "Plumber", labelKey: "specializations.plumber" },
  { value: "Carpenter", labelKey: "specializations.carpenter" },
  { value: "Steel Fixer", labelKey: "specializations.steel_fixer" },
  { value: "Painter", labelKey: "specializations.painter" },
  { value: "Tiler", labelKey: "specializations.tiler" },
  { value: "Welder", labelKey: "specializations.welder" },
  { value: "Driver", labelKey: "specializations.driver" },
  { value: "Safety Officer", labelKey: "specializations.safety_officer" },
  { value: "Site Supervisor", labelKey: "specializations.site_supervisor" },
  { value: "Foreman", labelKey: "specializations.foreman" },
];

export const getSpecializationLabel = (value: string, t: any) => {
  if (!value || value === "") {
    return t("specializations.not_specified") || "-";
  }
  
  const option = specializationOptions.find((opt) => opt.value === value);
  return option ? t(option.labelKey) : value;
};