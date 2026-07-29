import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchEmployees,
  selectEmployees,
} from "@/store/slices/admin/employeeSlice";
import { Task } from "@/store/types/task.types";
import {
  fieldsToValidateForTask,
  getInputClassName,
  validateFieldForTask,
} from "@/utils/validators/validate";
import {
  Briefcase,
  Bus,
  Loader,
  MapPin,
  Save,
  Users,
  X,
  Trash2,
  Pencil,
  ImageDown,
  Building2,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, number } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
import { getTodayDate } from "@/utils/constants/formatDate";
import { fetchProjects } from "@/store/slices/admin/projectsSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { FormField } from "../Field/FormField";
import { taskFields } from "@/config/taskFormConfig";

export default function AddTaskModal({
  isOpen,
  isEmployee,
  onClose,
  onAdd,
  onUpdate,
  editingTask,
}: {
  isOpen: boolean;
  isEmployee?: boolean;
  onClose: () => void;
  onAdd: (task: any) => Promise<any>;
  onUpdate?: (id: number, task: any) => Promise<any>;
  editingTask?: Task | null;
}) {
  const dispatch = useAppDispatch();
  const employees = useAppSelector(selectEmployees);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([]);
  const imageEntriesRef = useRef<ImageEntry[]>([]);
  const projectsForTasks = useSelector(
    (state: RootState) => state.projects.projects,
  );

  type ImageEntry = {
    id: string;
    url: string;
    file?: File;
    isExisting: boolean;
  };
  const createImageEntryId = () =>
    crypto.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const imageFiles = imageEntries
    .filter((e) => !e.isExisting && e.file)
    .map((e) => e.file!);
  const imagePreviews = imageEntries.map((e) => e.url);

  const normalizeDateValue = (value?: string | null) => {
    const match = String(value ?? "")
      .trim()
      .match(/^(\d{4}-\d{2}-\d{2})/);
    return match?.[1] || "";
  };

  const normalizeTimeValue = (value?: string | null) => {
    if (!value) return "";

    const trimmed = String(value).trim();
    if (!trimmed) return "";

    const match = trimmed.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      const hours = Number(match[1]).toString().padStart(2, "0");
      const minutes = match[2];
      return `${hours}:${minutes}`;
    }

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      const hours = `${parsed.getHours()}`.padStart(2, "0");
      const minutes = `${parsed.getMinutes()}`.padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    return trimmed;
  };

  const getInitialFormData = () => ({
    taskName: "",
    project_id: 0,
    taskDescription: "",
    startWork: getTodayDate(),
    endWork: "",
    priority: "medium" as Task["priority"],
    status: "todo" as Task["status"],
    employeeIds: [] as number[],
    city: "",
    postal_code: "",
    house_number: "",
    worker_arrival_time: "",
    task_type: "",
    work_area: "",
    bus_number: "",
    driver_name: "",
  });

  const [formData, setFormData] = useState(getInitialFormData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!editingTask;

  const revokeBlobImages = () => {
    imageEntriesRef.current.forEach((entry) => {
      if (!entry.isExisting && entry.url.startsWith("blob:")) {
        URL.revokeObjectURL(entry.url);
      }
    });
  };
  const tasksFields = taskFields(formData, projectsForTasks);

  useEffect(() => {
    imageEntriesRef.current = imageEntries;
  }, [imageEntries]);
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);
  useEffect(() => {
    if (!isOpen) {
      revokeBlobImages();
      setImageEntries([]);
      setImagesToDelete([]);
      setErrors({});
      setFormData(getInitialFormData());
      return;
    }

    if (editingTask) {
      const nextProjectName = editingTask.project_id || projectsForTasks[0];
      const nextStartWork = normalizeDateValue(
        editingTask.startWork?.toString(),
      );
      const nextEndWork = normalizeDateValue(editingTask.endWork?.toString());
      const nextArrivalTime = normalizeTimeValue(
        editingTask.worker_arrival_time,
      );

      setFormData({
        taskName: editingTask.taskName || "",
        project_id: editingTask.project_id || 0,
        taskDescription: editingTask.taskDescription || "",
        startWork: nextStartWork,
        endWork: nextEndWork,
        priority: editingTask.priority || "medium",
        status: editingTask.status || "todo",
        employeeIds: editingTask.employees?.map((e: any) => e.id) || [],
        city: editingTask.city || "",
        postal_code: editingTask.postal_code || "",
        house_number: editingTask.house_number || "",
        worker_arrival_time: nextArrivalTime,
        task_type: editingTask.task_type || "",
        work_area: editingTask.work_area?.toString() || "",
        bus_number: editingTask.bus_number || "",
        driver_name: editingTask.driver_name || "",
      });

      const startInput = document.querySelector<HTMLInputElement>(
        'input[name="startWork"]',
      );
      if (startInput && nextStartWork) {
        startInput.value = nextStartWork;
      }

      const endInput = document.querySelector<HTMLInputElement>(
        'input[name="endWork"]',
      );
      if (endInput && nextEndWork) {
        endInput.value = nextEndWork;
      }

      const timeInput = document.querySelector<HTMLInputElement>(
        'input[name="worker_arrival_time"]',
      );
      if (timeInput && nextArrivalTime) {
        timeInput.value = nextArrivalTime;
      }

      if (editingTask.images && Array.isArray(editingTask.images)) {
        setImageEntries(
          editingTask.images.map((imageUrl: string) => ({
            id: createImageEntryId(),
            url: imageUrl,
            isExisting: true,
          })),
        );
      } else {
        setImageEntries([]);
      }
      setImagesToDelete([]);
      setErrors({});
      return;
    }

    setFormData(getInitialFormData());
    setImageEntries([]);
    setImagesToDelete([]);
    setErrors({});
  }, [editingTask, isOpen]);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value),
    );
    setFormData((prev) => ({ ...prev, employeeIds: selectedOptions }));
  };

  const removeEmployee = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      employeeIds: prev.employeeIds.filter((empId) => empId !== id),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newEntries: ImageEntry[] = [];

    if (imageEntries.length + files.length > 20) {
      toast.error("You can upload maximum 20 images");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        continue;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        continue;
      }
      newEntries.push({
        id: createImageEntryId(),
        url: URL.createObjectURL(file),
        file,
        isExisting: false,
      });
    }

    if (newEntries.length > 0) {
      setImageEntries((prev) => {
        const nextEntries = [...prev, ...newEntries];
        imageEntriesRef.current = nextEntries;
        return nextEntries;
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const entry = imageEntries[index];
    if (!entry) return;

    if (entry.isExisting) {
      setImagesToDelete((prev) =>
        prev.includes(entry.url) ? prev : [...prev, entry.url],
      );
    } else if (entry.url.startsWith("blob:")) {
      URL.revokeObjectURL(entry.url);
    }

    setImageEntries((prev) => {
      const nextEntries = prev.filter((_, i) => i !== index);
      imageEntriesRef.current = nextEntries;
      return nextEntries;
    });
  };

  const clearAllImages = () => {
    const existingUrlsToDelete = imageEntries
      .filter((entry) => entry.isExisting)
      .map((entry) => entry.url);

    imageEntries.forEach((entry) => {
      if (!entry.isExisting && entry.url.startsWith("blob:")) {
        URL.revokeObjectURL(entry.url);
      }
    });

    setImagesToDelete((prev) =>
      Array.from(new Set([...prev, ...existingUrlsToDelete])),
    );
    setImageEntries([]);
    imageEntriesRef.current = [];
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    let hasError = false;
    fieldsToValidateForTask.forEach((field) => {
      const value = formData[field as keyof typeof formData];
      const msg = validateFieldForTask(field, value);
      if (msg) {
        newErrors[field] = msg;
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      toast.error("Please fix all errors before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "employeeIds" && !isEmployee) {
          const ids = formData.employeeIds;
          if (ids && ids.length > 0) {
            ids.forEach((id) => {
              formDataToSend.append("employeeIds[]", String(id));
            });
          } else {
            formDataToSend.append("employeeIds[]", "");
          }
        } else if (!isEmployee) {
          formDataToSend.append(
            key,
            String(formData[key as keyof typeof formData] ?? ""),
          );
        }
      });

      const currentEntries = imageEntriesRef.current;
      const newFilesToSend = currentEntries
        .filter((entry) => !entry.isExisting && entry.file)
        .map((entry) => entry.file as File);

      newFilesToSend.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const remainingExistingImages = currentEntries
        .filter(
          (entry) => entry.isExisting && !imagesToDelete.includes(entry.url),
        )
        .map((entry) => entry.url);

      if (isEditing && imagesToDelete.length > 0) {
        formDataToSend.append("deleteImages", JSON.stringify(imagesToDelete));
      }

      if (isEditing && remainingExistingImages.length > 0) {
        formDataToSend.append(
          "existingImages",
          JSON.stringify(remainingExistingImages),
        );
      }

      if (isEditing && onUpdate) {
        await onUpdate(editingTask.id, formDataToSend);
      } else {
        await onAdd(formDataToSend);
      }

      resetForm();
      onClose();
    } catch (error: any) {
      toast.error(
        isEditing ? "Failed to update task" : "Failed to create task",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
    clearAllImages();
    setErrors({});
    setImagesToDelete([]);
  };

  const closeModal = () => {
    revokeBlobImages();
    setImageEntries([]);
    imageEntriesRef.current = [];
    setImagesToDelete([]);
    setErrors({});
    setFormData(getInitialFormData());
    onClose();
  };

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));

    const errorMsg = validateFieldForTask(name, val);
    setErrors((prev) => {
      if (errorMsg) {
        return { ...prev, [name]: errorMsg };
      } else {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
    });
  };
  const fieldGenerate = (n: string) => {
    return tasksFields.map((e, i) => {
      if (e.group === n) {
        if (e.type === "select") {
          return (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {e.label}
              </label>

              <select
                name={e.name}
                value={e.value}
                onChange={handleChange}
                className={getInputClassName(e.name, errors)}
              >
                {e.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {errors[e.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[e.name]}</p>
              )}
            </div>
          );
        }

        return (
          <div key={i}>
            <FormField
              type={e.type}
              label={e.label}
              name={e.name}
              value={e.value}
              className={getInputClassName(e.name, errors)}
              onChange={handleChange}
              icon={e.icon}
              placeholder={e.placeHolder}
            />

            {errors[e.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[e.name]}</p>
            )}
          </div>
        );
      }

      return null;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 z-20 bg-linear-to-r from-purple-500 to-blue-500 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {isEditing ? (
              <>
                <Pencil className="w-5 h-5" />
                Edit Task #{editingTask?.id}
              </>
            ) : (
              "Add New Task"
            )}
          </h2>
          <button
            onClick={closeModal}
            className="text-white/80 hover:text-white"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldGenerate("taskProperties")}
          </div>

          <div className="border-t pt-4 text-gray-400">
            <h3 className="text-md font-semibold text-gray-500 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Task Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fieldGenerate("taskLocation")}
            </div>
          </div>

          <div className="border-t pt-4 text-gray-400">
            <h3 className="text-md font-semibold text-gray-500 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Task Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fieldGenerate("taskDetails")}
            </div>
          </div>

          <div className="border-t pt-4 text-gray-400">
            <h3 className="text-md font-semibold text-gray-500 mb-3 flex items-center gap-2">
              <Bus className="w-4 h-4" />
              Transportation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fieldGenerate("Transportation")}
            </div>
          </div>
          {!isEmployee && (
            <div className="border-t pt-4 text-gray-400">
              <h3 className="text-md font-semibold text-gray-500 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Assign Employees
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Select Employees (Hold Ctrl/Cmd for multiple)
                </label>
                <select
                  multiple
                  disabled={isEmployee}
                  value={formData.employeeIds.map(String)}
                  onChange={handleEmployeeChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 min-h-30"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.email}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Hold Ctrl (Windows) or Cmd (Mac) to select multiple employees
                </p>
              </div>

              {formData.employeeIds.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected ({formData.employeeIds.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.employeeIds.map((id) => {
                      const emp = employees.find((e) => e.id === id);
                      return emp ? (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {emp.name}
                          <button
                            type="button"
                            onClick={() => removeEmployee(id)}
                            className="hover:text-purple-900 ml-1 text-purple-500"
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {formData.employeeIds.length === 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  No employees selected
                </p>
              )}
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-purple-400 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                <ImageDown className="w-4 h-4 inline mr-2" />
                Task Images
                <span className="text-xs text-gray-400 ml-2">
                  (max 20 images, 5MB each)
                </span>
              </label>
              {(imageFiles.length > 0 ||
                imageEntries.some((entry) => entry.isExisting)) && (
                <button
                  type="button"
                  onClick={clearAllImages}
                  className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <AnimatePresence>
                  {imagePreviews.map((preview, index) => {
                    const entry = imageEntries[index];
                    return (
                      <motion.div
                        key={entry?.id ?? index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group"
                      >
                        <div className="relative h-24 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                          <Image
                            src={`${entry.isExisting ? `http://187.124.0.42:3007${preview}` : preview}`}
                            alt={`Preview ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 100vw, 25vw"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                          {index + 1}
                        </span>
                        {entry?.isExisting && (
                          <span className="absolute left-1 top-1 rounded bg-purple-600/90 px-1.5 py-0.5 text-[10px] font-medium text-white">
                            Saved
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-gray-600 hover:text-purple-600"
                disabled={imageEntries.length >= 20}
              >
                <ImageDown className="w-4 h-4 inline mr-2" />
                {imageEntries.length >= 20 ? "Max 20 images" : "Choose Images"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                disabled={imageEntries.length >= 20}
              />
              <span className="text-sm text-gray-400">
                {imageEntries.length} / 20 images
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 text-white animate-spin mx-auto" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditing ? "Update Task" : "Save Task"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
