"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Building2,
  Save,
  Phone,
  MapPin,
  Hash,
  Filter,
} from "lucide-react";

import { useAppDispatch } from "@/store/hooks";
import { createProject } from "@/store/slices/admin/projectsSlice";
import { Project } from "@/store/types/project.types";
import { FormField } from "@/components/Field/FormField";
import {
  getInputClassName,
  validateFieldForProject,
  validateFieldForTenants,
} from "@/utils/validators/validate";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function CreateProjectPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Project>({
    name: "",
    description: "",
    client_name: "",
    client_phone: "",
    location: "",
    city: "",
    postal_code: "",
    start_date: "",
    end_date: "",
    status: "planning",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    const errorMsg = validateFieldForProject(name, value);
    setForm((prev) => ({ ...prev, [name]: val }));
    if (errorMsg) {
      setErrors((prev) => ({ ...prev, [e.target.name]: errorMsg }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldsToValidate = [
      "name",
      "city",
      "postal_code",
      "phone",
      "client_name",
      "location",
      "start_date",
      "end_date",
    ];
    const newErrors: Record<string, string> = {};
    let hasError = false;
    fieldsToValidate.forEach((field) => {
      const value = form[field as keyof typeof form];
      const msg = validateFieldForProject(field, value);
      if (msg) {
        newErrors[field] = msg;
        hasError = true;
      }
    });
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    if (!form.name.trim()) {
      toast.error(t("addProjects.create_name_required"));
      return;
    }

    try {
      setLoading(true);
      await dispatch(createProject(form)).unwrap();
      toast.success(t("addProjects.create_success"));
      router.back();
    } catch (error: any) {
      console.error("Create project error:", error);
      toast.error(
        error?.response?.data?.message || t("addProjects.create_error"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-linear-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20 -z-10" />

      <div className="mx-auto">
        <HeaderSection router={router} t={t} />

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          <div className="grid md:grid-cols-4 gap-5">
            <div>
              <FormField
                label={t("addProjects.create_name")}
                name="name"
                value={form.name}
                onChange={handleChange}
                icon={Building2}
                placeholder={t("addProjects.create_name_placeholder")}
                className={getInputClassName("name", errors)}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <FormField
                label={t("addProjects.create_city")}
                name="city"
                value={form.city || ""}
                onChange={handleChange}
                icon={Building2}
                placeholder={t("addProjects.create_city_placeholder")}
                className={getInputClassName("city", errors)}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <FormField
                label={t("addProjects.create_client_name")}
                name="client_name"
                value={form.client_name || ""}
                onChange={handleChange}
                icon={Building2}
                className={getInputClassName("client_name", errors)}
                placeholder={t("addProjects.create_client_name_placeholder")}
              />
              {errors.client_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.client_name}
                </p>
              )}
            </div>
            <div>
              <FormField
                label={t("addProjects.create_client_phone")}
                name="client_phone"
                value={form.client_phone || ""}
                onChange={handleChange}
                icon={Phone}
                placeholder={t("addProjects.create_client_phone_placeholder")}
                className={getInputClassName("client_phone", errors)}
                type="tel"
              />
              {errors.client_phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.client_phone}
                </p>
              )}
            </div>
            <div>
              <FormField
                label={t("addProjects.create_location")}
                name="location"
                value={form.location || ""}
                onChange={handleChange}
                icon={MapPin}
                className={getInputClassName("location", errors)}
                placeholder={t("addProjects.create_location_placeholder")}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>
            <div>
              <FormField
                label={t("addProjects.create_postal_code")}
                name="postal_code"
                value={form.postal_code || ""}
                className={getInputClassName("postal_code", errors)}
                onChange={handleChange}
                icon={Hash}
                placeholder={t("addProjects.create_postal_code_placeholder")}
              />
              {errors.postal_code && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.postal_code}
                </p>
              )}
            </div>
            <div>
              <FormField
                label={t("addProjects.create_start_date")}
                name="start_date"
                value={form.start_date || ""}
                onChange={handleChange}
                icon={Calendar}
                type="date"
                className={getInputClassName("start_date", errors)}
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
              )}
            </div>
            <div>
              <FormField
                label={t("addProjects.create_end_date")}
                name="end_date"
                value={form.end_date || ""}
                onChange={handleChange}
                icon={Calendar}
                type="date"
                className={getInputClassName("end_date", errors)}
              />
              {errors.end_date && (
                <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
              )}
            </div>
          </div>

          <FormTextarea
            label={t("addProjects.create_description")}
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            icon={FileText}
            placeholder={t("addProjects.create_description_placeholder")}
            rows={5}
          />

          <div className="flex justify-end gap-2 pt-5">
            <Button
              className="px-8 py-3 rounded-xl bg-gray-300 cursor-pointer  flex items-center justify-center shadow-2xl"
              onClick={() => router.back()}
            >
              {t("addTask.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading
                ? t("addProjects.create_saving")
                : t("addProjects.create_button")}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

function HeaderSection({ router, t }: { router: any; t: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Building2 className="text-purple-600 w-8 h-8" />
          {t("addProjects.create_title")}
        </h1>
        <p className="text-gray-500 mt-2">{t("addProjects.create_subtitle")}</p>
      </div>
    </motion.div>
  );
}

function FormTextarea({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  placeholder,
  rows = 5,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  icon: any;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
      </div>
    </div>
  );
}
