"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
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
  Loader,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { Project } from "@/store/types/project.types";
import { FormField } from "@/components/Field/FormField";
import {
  getInputClassName,
  validateFieldForProject,
} from "@/utils/validators/validate";
import {
  fetchProjectById,
  selectProjectsLoading,
  selectSelectedProject,
  updateProject,
} from "@/store/slices/admin/projectsSlice";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function EditProjectPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const projectId = params?.id as string;

  const isLoading = useAppSelector(selectProjectsLoading);
  const selectedProject = useAppSelector(selectSelectedProject);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

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
  const formatDateForInput = (dateString: string | null | undefined) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const timezoneOffset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - timezoneOffset);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const fetchProjectData = async () => {
    setIsLoadingData(true);
    try {
      const result = await dispatch(
        fetchProjectById(Number(projectId)),
      ).unwrap();

      setForm({
        name: result.name || "",
        description: result.description || "",
        client_name: result.client_name || "",
        client_phone: result.client_phone || "",
        location: result.location || "",
        city: result.city || "",
        postal_code: result.postal_code || "",
        start_date: formatDateForInput(result.start_date) || "",
        end_date: formatDateForInput(result.end_date) || "",
        status: result.status || "planning",
      });
    } catch (error: any) {
      toast.error(error?.message || t("projects.edit_load_error"));
      // router.back();
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
      toast.error(t("projects.create_name_required"));
      return;
    }

    try {
      setLoading(true);
      await dispatch(
        updateProject({
          id: Number(projectId),
          data: form,
        }),
      ).unwrap();
      toast.success(t("editProjects.edit_success"));
      router.back();
    } catch (error: any) {
      console.error("Update project error:", error);
      toast.error(error?.response?.data?.message || t("projects.edit_error"));
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-purple-600 animate-spin" />
          <p className="text-gray-600 font-medium">
            {t("editProjects.edit_loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-linear-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20 -z-10" />

      <div className="mx-auto">
        <HeaderSection router={router} projectName={form.name} t={t} />

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
                className={getInputClassName("start_date", errors)}
                type="date"
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
                className={getInputClassName("end_date", errors)}
                icon={Calendar}
                type="date"
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
            placeholder={t("projects.create_description_placeholder")}
            rows={5}
          />
          <div className="flex justify-end gap-2 ">
            <div
              className="w-32 h-8 rounded-xl bg-gray-300 cursor-pointer  flex items-center justify-center shadow-2xl"
              onClick={() => router.back()}
            >
              {t("addTask.cancel")}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading
                ? t("editProjects.edit_updating")
                : t("editProjects.edit_button")}
            </Button>
          </div>{" "}
        </motion.form>
      </div>
    </div>
  );
}

function HeaderSection({
  router,
  projectName,
  t,
}: {
  router: any;
  projectName: string;
  t: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-8"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Building2 className="text-purple-600 w-8 h-8" />
            {t("editProjects.edit_title")}
          </h1>
          <p className="text-gray-500 mt-2">
            {t("editProjects.edit_subtitle")}{" "}
            <span className="font-semibold text-gray-700">
              {projectName || "..."}
            </span>
          </p>
        </div>
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
