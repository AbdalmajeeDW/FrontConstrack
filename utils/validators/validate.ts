export const validateFieldForEmployee = (name: string, value: any): string => {
  switch (name) {
    case "name":
      return !value ? "Name is required" : "";
    case "email":
      if (!value) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Invalid email address";
      return "";
    case "password":
      if (!value) return "Password is required";
      if (value.length < 8)
        return "Password must be at least 8 characters long";
      if (!/[A-Z]/.test(value))
        return "Password must contain at least one uppercase letter";
      if (!/[a-z]/.test(value))
        return "Password must contain at least one lowercase letter";
      if (!/[0-9]/.test(value))
        return "Password must contain at least one number";
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
        return "Password must contain at least one special character";

      return "";
    case "birth_date": {
      if (!value) return "Birth date is required";
      const selected = new Date(value);
      const today = new Date();
      const minDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate(),
      );
      if (selected > minDate) {
        return "Age must be at least 18 years old";
      }
    }
    case "salary": {
      if (!value) return "Salary is required";
      const salary = parseFloat(value);
      if (isNaN(salary) || salary <= 0) {
        return "Salary must be a positive number greater than 0";
      }
      return "";
    }
    case "phone": {
      if (!value) return "Phone number is required";
      const cleanPhone = value.replace(/[\s\-\(\)\+]/g, "");
      if (!/^\d+$/.test(cleanPhone)) {
        return "Phone number must contain only digits";
      }
      if (cleanPhone.length < 8 || cleanPhone.length > 15) {
        return "Phone number must be between 8 and 15 digits";
      }

      return "";
    }

    case "status":
      if (!value) return "Status is required";
      if (!["todo", "in_progress", "review", "done"].includes(value)) {
        return "Invalid status";
      }
      return "";
    default:
      return "";
  }
};
export const validateFieldForTask = (name: string, value: any): string => {
  switch (name) {
    case "taskName":
      if (!value || value.trim() === "") return "Task name is required";
      if (value.trim().length < 3)
        return "Task name must be at least 3 characters";
      return "";

    case "projectName":
      if (!value || value.trim() === "") return "Project name is required";
      return "";

    case "startWork":
      if (!value) return "Start date is required";
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(value) < today) return "Start date cannot be in the past";
      return "";

    case "endWork":
      if (!value) return "End date is required";

      return "";

    case "taskDescription":
      if (!value || value.trim() === "") return "Task description is required";

      if (value && value.length > 500) {
        return "Description must be less than 500 characters";
      }
      return "";

    case "city":
      if (!value || value.trim() === "") return "City is required";

      if (value && value.length > 100) {
        return "City name must be less than 100 characters";
      }
      if (value && !/^[a-zA-Z\s\-']+$/.test(value)) {
        return "City name can only contain letters, spaces, hyphens, and apostrophes";
      }
      return "";

    case "postal_code":
      if (!value || value.trim() === "") return "Postal code is required";

      if (value && !/^[0-9]{4,10}$/.test(value)) {
        return "Invalid postal code format (must be 4-10 digits)";
      }
      return "";

    case "house_number":
      if (!value || value.trim() === "") return "House number is required";
      if (value && value.length > 20) {
        return "House number must be less than 20 characters";
      }
      if (value && !/^[a-zA-Z0-9\s\-]+$/.test(value)) {
        return "Invalid house number format";
      }
      return "";

    case "worker_arrival_time":
      if (!value || value.trim() === "")
        return "Worker arrival time is required";
      if (value && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
        return "Invalid time format (HH:MM)";
      }
      return "";

    case "task_type":
      if (!value || value.trim() === "") return "Task type is required";

      if (value && value.length > 100) {
        return "Task type must be less than 100 characters";
      }
      return "";

    case "work_area":
      if (!value || value.trim() === "") return "Work area is required";

      return "";

    case "bus_number":
      if (!value || value.trim() === "") return "Bus number is required";

      if (value && value.length > 20) {
        return "Bus number must be less than 20 characters";
      }
      if (value && !/^[a-zA-Z0-9\-]+$/.test(value)) {
        return "Invalid bus number format";
      }
      return "";

    case "driver_name":
      if (!value || value.trim() === "") return "Driver name is required";

      return "";

    case "priority":
      if (!value) return "Priority is required";
      if (!["low", "medium", "high", "urgent"].includes(value)) {
        return "Invalid priority level";
      }
      return "";

    case "status":

    default:
      return "";
  }
};

export const validateFieldForTenants = (name: string, value: any): string => {
  switch (name) {
    case "adminName":
      return !value ? "Name Admin is required" : "";
         case "address":
      return !value ? "Address is required" : "";
            case "industry":
      return !value ? "Industry is required" : "";


          case "databaseName":
      return !value ? "Database Name is required" : "";
              case "kvkNumber":
      return !value ? "kvk Number is required" : "";
              case "btwNumber":
      return !value ? "btw Number is required" : "";
    case "name":
      if (!value) return "Company Name is required";
      if (value.trim() === "")
        return "Company Name cannot be empty spaces only";
      if (/\s/.test(value)) return "Company Name cannot contain spaces";
      if (/^\s/.test(value)) return "Company Name cannot start with a space";
      return "";
    case "adminEmail":
      if (!value) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Invalid email address";
      return "";
    case "adminPassword":
      if (!value) return "Password is required";
      if (value.length < 8)
        return "Password must be at least 8 characters long";
      if (!/[A-Z]/.test(value))
        return "Password must contain at least one uppercase letter";
      if (!/[a-z]/.test(value))
        return "Password must contain at least one lowercase letter";
      if (!/[0-9]/.test(value))
        return "Password must contain at least one number";
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
        return "Password must contain at least one special character";

      return "";

    case "maxEmployees":
      if (!value) return "Employees count is required";
      if (value < 3) return "Minimum number of employees is 3";
      return "";

    case "phone": {
      if (!value) return "Phone number is required";
      const cleanPhone = value.replace(/[\s\-\(\)\+]/g, "");
      if (!/^\d+$/.test(cleanPhone)) {
        return "Phone number must contain only digits";
      }
      if (cleanPhone.length < 8 || cleanPhone.length > 15) {
        return "Phone number must be between 8 and 15 digits";
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
