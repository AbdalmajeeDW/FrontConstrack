"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  User,
  Lock,
  Briefcase,
  MapPin,
  Cake,
  Car,
  Wrench,
  Euro,
  Save,
  UserPlus,
  ArrowBigRight,
  ArrowBigLeft,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addEmployee,
  updateEmployee,
  selectEmployeeLoading,
  selectEmployeeError,
} from "@/store/slices/admin/employeeSlice";
import { employee, getEmployeeById } from "@/store/services/admin/employee";
import { useRouter } from "next/navigation";
import {
  getInputClassName,
  validateFieldForEmployee,
} from "@/utils/validators/validate";
import { specializationOptions } from "@/utils/constants/specializationOptions";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";

interface EmployeeFormProps {
  mode: "add" | "edit";
  employeeId?: string;
}

export default function EmployeeForm({ mode, employeeId }: EmployeeFormProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectEmployeeLoading);
  const error = useAppSelector(selectEmployeeError);
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingData, setIsLoadingData] = useState(mode === "edit");

  const isEditMode = mode === "edit";
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";

  const [formData, setFormData] = useState<Partial<employee>>({
    name: "",
    email: "",
    password: "",
    phone: "",
    salary: "",
    address: "",
    birth_date: "",
    driving_license: false,
    specialization: "",
  });

  useEffect(() => {
    if (isEditMode && employeeId) {
      const id = parseInt(employeeId);
      if (!isNaN(id) && id > 0) {
        fetchEmployeeData(id);
      } else {
        toast.error(t("employeeEdit.invalid_id"));
        router.back();
      }
    }
  }, [employeeId]);

  const fetchEmployeeData = async (id: number) => {
    setIsLoadingData(true);
    try {
      const data = await getEmployeeById(id);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        password: "",
        phone: data.phone || "",
        salary: data.salary?.toString() || "",
        address: data.address || "",
        birth_date: data.birth_date || "",
        driving_license: data.driving_license || false,
        specialization: data.specialization || "",
      });
    } catch (err) {
      toast.error(t("employeeEdit.load_error"));
      router.back();
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));

    const errorMsg = validateFieldForEmployee(name, val);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (isEditMode) {
      const id = parseInt(employeeId!);
      if (!employeeId || isNaN(id) || id <= 0) {
        toast.error(t("employeeEdit.invalid_id"));
        return;
      }
    }
    const fieldsToValidate = ["name", "email", "birth_date", "phone"];
    const newErrors: Record<string, string> = {};
    let hasError = false;

    fieldsToValidate.forEach((field) => {
      const value = formData[field as keyof typeof formData];
      const msg = validateFieldForEmployee(field, value);
      if (msg) {
        newErrors[field] = msg;
        hasError = true;
      }
    });
    if (!isEditMode) {
      const passwordMsg = validateFieldForEmployee(
        "password",
        formData.password,
      );
      if (passwordMsg) {
        newErrors.password = passwordMsg;
        hasError = true;
      }
    } else if (formData.password && formData.password.length > 0) {
      const passwordMsg = validateFieldForEmployee(
        "password",
        formData.password,
      );
      if (passwordMsg) {
        newErrors.password = passwordMsg;
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }
    const payload: any = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      salary: formData.salary ? parseFloat(formData.salary) : null,
      address: formData.address,
      birth_date: formData.birth_date,
      driving_license: formData.driving_license,
      specialization: formData.specialization,
    };
    if (formData.password && formData.password.length > 0) {
      payload.password = formData.password;
    }

    try {
      let resultAction;
      if (isEditMode) {
        resultAction = await dispatch(
          updateEmployee({
            id: parseInt(employeeId!),
            data: payload,
          }),
        );
      } else {
        resultAction = await dispatch(addEmployee(payload as any));
      }

      if (resultAction.meta.requestStatus === "fulfilled") {
        toast.success(
          isEditMode ? t("employeeEdit.success") : t("employeeAdd.success"),
        );
        router.back();
      } else {
        toast.error(
          isEditMode ? t("employeeEdit.update_error") : t("employeeAdd.error"),
        );
      }
    } catch (err) {
      toast.error(
        isEditMode ? t("employeeEdit.error") : t("employeeAdd.error"),
      );
    }
  };

  const textareaClass =
    "w-full rounded-xl border border-gray-400 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none";

  const labelClass = "mb-2 block text-sm font-medium text-slate-700";
  const cardClass = "rounded-3xl border border-slate-200 bg-white shadow-sm";

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">
            {t("employeeEdit.loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto px-6 lg:px-8 pb-10 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-r from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg">
              {isEditMode ? (
                <Briefcase className="w-6 h-6 text-white" />
              ) : (
                <UserPlus className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {isEditMode ? t("employeeEdit.title") : t("employeeAdd.title")}
              </h1>
              <p className="text-sm text-slate-500">
                {isEditMode
                  ? `${t("employeeEdit.subtitle")} ${formData.name || ""}`
                  : t("employeeAdd.subtitle")}
              </p>
            </div>
          </div>
        </motion.div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={cardClass}
              >
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-800">
                      {isEditMode
                        ? t("employeeEdit.personal_info")
                        : t("employeeAdd.personal_info")}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {isEditMode
                        ? t("employeeEdit.personal_info_desc")
                        : t("employeeAdd.personal_info_desc")}
                    </p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>
                      {isEditMode
                        ? t("employeeEdit.full_name")
                        : t("employeeAdd.full_name")}{" "}
                      *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={getInputClassName("name", errors)}
                      placeholder={
                        isEditMode
                          ? t("employeeEdit.name_placeholder")
                          : t("employeeAdd.name_placeholder")
                      }
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>
                      {isEditMode
                        ? t("employeeEdit.birth_date")
                        : t("employeeAdd.birth_date")}
                    </label>
                    <div className="relative">
                      <Cake className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        className={`${getInputClassName("birth_date", errors)} pl-11`}
                      />
                    </div>
                    {errors.birth_date && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.birth_date}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>
                      {isEditMode
                        ? t("employeeEdit.email")
                        : t("employeeAdd.email")}{" "}
                      *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`${getInputClassName("email", errors)} pl-11`}
                        placeholder={
                          isEditMode
                            ? t("employeeEdit.email_placeholder")
                            : t("employeeAdd.email_placeholder")
                        }
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>
                      {isEditMode
                        ? t("employeeEdit.password")
                        : t("employeeAdd.password")}
                      {isEditMode && (
                        <span className="text-xs text-slate-400 ml-2">
                          ({t("employeeEdit.password_optional")})
                        </span>
                      )}
                      {!isEditMode && " *"}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`${getInputClassName("password", errors)} pl-11`}
                        placeholder={
                          isEditMode
                            ? t("employeeEdit.password_placeholder")
                            : ""
                        }
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>
                      {isEditMode
                        ? t("employeeEdit.phone")
                        : t("employeeAdd.phone")}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`${getInputClassName("phone", errors)} pl-11`}
                        placeholder={
                          isEditMode
                            ? t("employeeEdit.phone_placeholder")
                            : t("employeeAdd.phone_placeholder")
                        }
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>
                      {isEditMode
                        ? t("employeeEdit.address")
                        : t("employeeAdd.address")}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`${textareaClass} pl-11`}
                        placeholder={
                          isEditMode
                            ? t("employeeEdit.address_placeholder")
                            : t("employeeAdd.address_placeholder")
                        }
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className={cardClass}
              >
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center">
                    <Euro className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-800">
                      {isEditMode
                        ? t("employeeEdit.employment_info")
                        : t("employeeAdd.employment_info")}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {isEditMode
                        ? t("employeeEdit.employment_info_desc")
                        : t("employeeAdd.employment_info_desc")}
                    </p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>
                      {isEditMode
                        ? t("employeeEdit.salary")
                        : t("employeeAdd.salary")}
                    </label>
                    <div className="relative">
                      <Euro className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        className={`${getInputClassName("salary", errors)} pl-11`}
                        placeholder={
                          isEditMode
                            ? t("employeeEdit.salary_placeholder")
                            : t("employeeAdd.salary_placeholder")
                        }
                      />
                    </div>
                    {errors.salary && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.salary}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>
                      {isEditMode
                        ? t("employeeEdit.specialization")
                        : t("employeeAdd.specialization")}
                    </label>
                    <div className="relative">
                      <Wrench className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className={`${getInputClassName("specialization", errors)} pl-11 appearance-none`}
                      >
                        {specializationOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {t(opt.labelKey)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>
                      {isEditMode
                        ? t("employeeEdit.driving_license")
                        : t("employeeAdd.driving_license")}
                    </label>
                    <div className="flex items-center gap-3 h-12 px-4 rounded-xl border border-gray-400 bg-slate-50/80">
                      <Car className="w-4 h-4 text-slate-400" />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="driving_license"
                          checked={formData.driving_license}
                          onChange={handleChange}
                          className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                        />
                        <span className="text-sm text-slate-600">
                          {isEditMode
                            ? t("employeeEdit.has_license")
                            : t("employeeAdd.has_license")}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                className={cardClass}
              >
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-800">
                      {isEditMode
                        ? t("employeeEdit.summary")
                        : t("employeeAdd.summary")}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {isEditMode
                        ? t("employeeEdit.summary_desc")
                        : t("employeeAdd.summary_desc")}
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">
                        {isEditMode
                          ? t("employeeEdit.summary_name")
                          : t("employeeAdd.summary_name")}
                        :
                      </span>
                      <span className="font-medium text-slate-700">
                        {formData.name || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">
                        {isEditMode
                          ? t("employeeEdit.summary_email")
                          : t("employeeAdd.summary_email")}
                        :
                      </span>
                      <span className="font-medium text-slate-700">
                        {formData.email || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">
                        {isEditMode
                          ? t("employeeEdit.summary_phone")
                          : t("employeeAdd.summary_phone")}
                        :
                      </span>
                      <span className="font-medium text-slate-700">
                        {formData.phone || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">
                        {isEditMode
                          ? t("employeeEdit.summary_specialization")
                          : t("employeeAdd.summary_specialization")}
                        :
                      </span>
                      <span className="font-medium text-slate-700">
                        {formData.specialization || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">
                        {isEditMode
                          ? t("employeeEdit.summary_salary")
                          : t("employeeAdd.summary_salary")}
                        :
                      </span>
                      <span className="font-medium text-slate-700">
                        {formData.salary ? `€${formData.salary}` : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">
                        {isEditMode
                          ? t("employeeEdit.summary_birth_date")
                          : t("employeeAdd.summary_birth_date")}
                        :
                      </span>
                      <span className="font-medium text-slate-700">
                        {formData.birth_date || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">
                        {isEditMode
                          ? t("employeeEdit.summary_license")
                          : t("employeeAdd.summary_license")}
                        :
                      </span>
                      <span className="font-medium text-slate-700">
                        {formData.driving_license
                          ? isEditMode
                            ? t("employeeEdit.yes")
                            : t("employeeAdd.yes")
                          : isEditMode
                            ? t("employeeEdit.no")
                            : t("employeeAdd.no")}
                      </span>
                    </div>
                    {formData.address && (
                      <div className="flex justify-between items-start text-sm">
                        <span className="text-slate-500">
                          {isEditMode
                            ? t("employeeEdit.summary_address")
                            : t("employeeAdd.summary_address")}
                          :
                        </span>
                        <span className="font-medium text-slate-700 text-right max-w-[180px]">
                          {formData.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              <div className="flex gap-2">
                <div
                  className="w-32 h-10 rounded-2xl bg-gray-300 cursor-pointer  flex items-center justify-center shadow-2xl"
                  onClick={() => router.back()}
                >
                  {t("addTask.cancel")}
                </div>
                <motion.button
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 rounded-2xl bg-linear-to-r from-indigo-600 via-violet-600 to-blue-600 text-white font-semibold shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isEditMode
                        ? t("employeeEdit.updating")
                        : t("employeeAdd.creating")}
                    </>
                  ) : (
                    <>
                      {isEditMode ? (
                        <Save className="w-5 h-5" />
                      ) : (
                        <UserPlus className="w-5 h-5" />
                      )}
                      {isEditMode
                        ? t("employeeEdit.update")
                        : t("employeeAdd.create")}
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
