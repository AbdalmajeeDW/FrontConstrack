import i18n from '@/i18n/i18n';

const t = i18n.t;

export const validateFieldForEmployee = (name: string, value: any): string => {
  switch (name) {
    case "name":
      return !value ? t("validation.name.required") : "";
      
    case "email":
      if (!value) return t("validation.email.required");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return t("validation.email.invalid");
      return "";
      
    case "password":
      if (!value) return t("validation.password.required");
      if (value.length < 8)
        return t("validation.password.min_length");
      if (!/[A-Z]/.test(value))
        return t("validation.password.uppercase");
      if (!/[a-z]/.test(value))
        return t("validation.password.lowercase");
      if (!/[0-9]/.test(value))
        return t("validation.password.number");
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
        return t("validation.password.special");
      return "";
      
    case "birth_date": {
      if (!value) return t("validation.birth_date.required");
      const selected = new Date(value);
      const today = new Date();
      const minDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate(),
      );
      if (selected > minDate) {
        return t("validation.birth_date.min_age");
      }
      return "";
    }
    
    case "salary": {
      if (!value) return t("validation.salary.required");
      const salary = parseFloat(value);
      if (isNaN(salary) || salary <= 0) {
        return t("validation.salary.positive");
      }
      return "";
    }
    
    case "phone": {
      if (!value) return t("validation.phone.required");
      const cleanPhone = value.replace(/[\s\-\(\)\+]/g, "");
      if (!/^\d+$/.test(cleanPhone)) {
        return t("validation.phone.digits_only");
      }
      if (cleanPhone.length < 8 || cleanPhone.length > 15) {
        return t("validation.phone.length");
      }
      return "";
    }

    case "status":
      if (!value) return t("validation.status.required");
      if (!["in_progress", "done"].includes(value)) {
        return t("validation.status.invalid");
      }
      return "";
      
    default:
      return "";
  }
};

 export const validateFieldForTask = (name: string, value: any,isEditing?: boolean): string => {
  switch (name) {
    case "taskName":
      if (!value || value.trim() === "") return t("validation.name.task_required");
      if (value.trim().length < 3)
        return t("validation.name.task_min_length");
      return "";

    case "projectName":
      if (!value || value.trim() === "") return "Project name is required";
      return "";

    case "startWork":
      if (!value) return t("validation.start_date.required");
      
      if (!isEditing) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(value) < today) return t("validation.start_date.past");
      }
      return "";


    case "endWork":
      if (!value) return t("validation.end_date.required");
      return "";

    case "taskDescription":
      if (!value || value.trim() === "") return t("validation.description.required");
      if (value && value.length > 500) {
        return t("validation.description.max_length");
      }
      return "";

  case "city":
  if (!value || value.trim() === "") {
    return t("validation.city.required");
  }

  if (value.length > 100) {
    return t("validation.city.max_length");
  }

  if (!/^[a-zA-Z\u0600-\u06FF\s\-']+$/.test(value)) {
    return t("validation.city.invalid_chars");
  }

  return "";

    case "postal_code":
      if (!value || value.trim() === "") {
        return t("validation.postal_code.required");
      }
      if (!/^\d{4}[A-Z]{2}$/.test(value.trim())) {
        return t("validation.postal_code.invalid");
      }
      return "";

    case "house_number":
      if (!value || value.trim() === "") return t("validation.house_number.required");
      if (value && value.length > 20) {
        return t("validation.house_number.max_length");
      }
      if (value && !/^[a-zA-Z0-9\s\-]+$/.test(value)) {
        return t("validation.house_number.invalid");
      }
      return "";

    case "worker_arrival_time":
      if (!value || value.trim() === "")
        return t("validation.worker_arrival_time.required");
      if (value && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
        return t("validation.worker_arrival_time.invalid");
      }
      return "";

    case "task_type":
      if (!value || value.trim() === "") return t("validation.task_type.required");
      if (value && value.length > 100) {
        return t("validation.task_type.max_length");
      }
      return "";

    case "work_area":
      if (!value || value.trim() === "") return t("validation.work_area.required");
      return "";

    case "bus_number":
      if (!value || value.trim() === "") return t("validation.bus_number.required");
      if (value && value.length > 20) {
        return t("validation.bus_number.max_length");
      }
      if (value && !/^[a-zA-Z0-9\-]+$/.test(value)) {
        return t("validation.bus_number.invalid");
      }
      return "";

    case "driver_name":
      if (!value || value.trim() === "") return t("validation.driver_name.required");
      return "";

    case "priority":
      if (!value) return t("validation.priority.required");
      if (!["low", "medium", "high", "urgent"].includes(value)) {
        return t("validation.priority.invalid");
      }
      return "";

    case "status":
      if (!value) return t("validation.status.required");
      if (!["in_progress", "done", "planning", "active", "completed", "cancelled"].includes(value)) {
        return t("validation.status.invalid");
      }
      return "";

    default:
      return "";
  }
};

export const fieldsToValidateForTask = [
  "taskName",
  "taskDescription",
  "startWork",
  "endWork",
  "priority",
  "status",
  "city",
  "postal_code",
  "house_number",
  "worker_arrival_time",
  "task_type",
  "work_area",
  "bus_number",
  "driver_name",
];

export const validateFieldForTenants = (name: string, value: any): string => {
  switch (name) {
    case "adminName":
      return !value ? t("validation.name.admin_required") : "";
      
    case "address":
      return !value ? t("validation.address.required") : "";
      
    case "industry":
      return !value ? t("validation.industry.required") : "";

    case "databaseName":
      return !value ? t("validation.database_name.required") : "";
      
    case "kvkNumber":
      return !value ? t("validation.kvk_number.required") : "";
      
    case "btwNumber":
      return !value ? t("validation.btw_number.required") : "";
      
    case "name":
      if (!value) return t("validation.name.company_required");
      if (value.trim() === "")
        return t("validation.name.company_empty");
      if (/\s/.test(value)) return t("validation.name.company_no_spaces");
      if (/^\s/.test(value)) return t("validation.name.company_no_leading_space");
      return "";
      
    case "adminEmail":
      if (!value) return t("validation.email.admin_required");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return t("validation.email.invalid");
      return "";
      
    case "adminPassword":
      if (!value) return t("validation.password.admin_required");
      if (value.length < 8)
        return t("validation.password.min_length");
      if (!/[A-Z]/.test(value))
        return t("validation.password.uppercase");
      if (!/[a-z]/.test(value))
        return t("validation.password.lowercase");
      if (!/[0-9]/.test(value))
        return t("validation.password.number");
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
        return t("validation.password.special");
      return "";

    case "maxEmployees":
      if (!value) return t("validation.max_employees.required");
      if (value < 3) return t("validation.max_employees.min");
      return "";

    case "phone": {
      if (!value) return t("validation.phone.required");
      const cleanPhone = value.replace(/[\s\-\(\)\+]/g, "");
      if (!/^\d+$/.test(cleanPhone)) {
        return t("validation.phone.digits_only");
      }
      if (cleanPhone.length < 8 || cleanPhone.length > 15) {
        return t("validation.phone.length");
      }
      return "";
    }

    default:
      return "";
  }
};

export const getInputClassName = (
  fieldName: string,
  errors: any,
  hasIcon?: boolean,
) => {
  const baseClass = `w-full h-12 rounded-xl ${hasIcon && "pl-11"}  bg-slate-50/80 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none transition-all`;
  const errorClass = errors[fieldName]
    ? "border-2 border-red-500 focus:ring-2 focus:ring-red-500"
    : "border border-gray-400 focus:ring-2 focus:ring-violet-500";

  return `${baseClass} ${errorClass}`;
};

export const validateFieldForProject = (name: string, value: any): string => {
  switch (name) {
    case "name":
      if (!value || value.trim() === "") return t("validation.name.project_required");
      if (value.trim().length < 3)
        return t("validation.name.project_min_length");
      return "";

case "city":
  if (!value || value.trim() === "") {
    return t("validation.city.required");
  }

  if (value.length > 100) {
    return t("validation.city.max_length");
  }

  if (!/^[a-zA-Z\u0600-\u06FF\s\-']+$/.test(value)) {
    return t("validation.city.invalid_chars");
  }

  return "";
    case "postal_code":
      if (!value || value.trim() === "") {
        return t("validation.postal_code.required");
      }
      if (!/^\d{4}[A-Z]{2}$/.test(value.trim())) {
        return t("validation.postal_code.invalid");
      }
      return "";

    case "location":
      if (!value || value.trim() === "") return t("validation.location.required");
      return "";

    case "client_name":
      if (!value || value.trim() === "") return t("validation.client_name.required");
      return "";

    case "client_phone": {
      if (!value) return t("validation.phone.client_required");
      const cleanPhone = value.replace(/[\s\-\(\)\+]/g, "");
      if (!/^\d+$/.test(cleanPhone)) {
        return t("validation.phone.digits_only");
      }
      if (cleanPhone.length < 8 || cleanPhone.length > 15) {
        return t("validation.phone.length");
      }
      return "";
    }

    case "start_date":
      if (!value || value.trim() === "") {
        return t("validation.start_date.required");
      }
      return "";

    case "end_date":
      if (!value || value.trim() === "") {
        return t("validation.end_date.required");
      }
      return "";

    default:
      return "";
  }
};