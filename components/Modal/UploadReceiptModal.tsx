"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Receipt,
  Trash2,
  Loader,
  Image,
  FileText,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectEmployees,
  fetchEmployees,
} from "@/store/slices/admin/employeeSlice";
import { useTranslation } from "react-i18next";

interface UploadReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId?: number;
  onSuccess?: () => void;
}

export default function UploadReceiptModal({
  isOpen,
  onClose,
  employeeId,
  onSuccess,
}: UploadReceiptModalProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const employees = useAppSelector(selectEmployees);

  // ✅ State
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ جلب دور المستخدم من localStorage
  const getUserRole = () => {
    try {
      const userData = localStorage.getItem("tenant-user");
      if (userData) {
        const user = JSON.parse(userData);
        return user.roleEn || user.role || "";
      }
    } catch (error) {
      console.error("Error getting user role:", error);
    }
    return "";
  };

  const userRole = getUserRole();
  const isAdmin = userRole === "tenant_admin";

  console.log("🔍 User Role:", userRole);
  console.log("🔍 Is Admin:", isAdmin);

  // ✅ عند فتح المودال - جلب الموظفين
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchEmployees());
    }
  }, [isOpen]); // ✅ اعتماديات ثابتة

  // ✅ تعيين القيمة الافتراضية - اعتماديات ثابتة
  useEffect(() => {
    if (isOpen) {
      if (!isAdmin && employeeId) {
        // ✅ للموظف العادي
        setSelectedEmployeeId(String(employeeId));
      } else if (isAdmin) {
        // ✅ للمدير - فارغ
        setSelectedEmployeeId("");
      }
    }
  }, [isOpen, isAdmin, employeeId]); // ✅ اعتماديات ثابتة

  // ✅ تنظيف عند الإغلاق
  useEffect(() => {
    if (!isOpen) {
      setDescription("");
      setImages([]);
      setPreviews([]);
      if (!isAdmin) {
        setSelectedEmployeeId("");
      }
    }
  }, [isOpen]); // ✅ اعتماديات ثابتة

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const isFormValid = (): boolean => {
    if (images.length === 0) return false;
    if (isAdmin && !selectedEmployeeId) return false;
    if (!isAdmin && !employeeId) return false;
    return true;
  };

  const handleSubmit = async () => {
    console.log("🔍 SUBMIT - selectedEmployeeId:", selectedEmployeeId);
    console.log("🔍 SUBMIT - employeeId prop:", employeeId);
    console.log("🔍 SUBMIT - isAdmin:", isAdmin);

    if (images.length === 0) {
      toast.error(
        t("upload_receipt.no_images") || "Please select at least one image",
      );
      return;
    }

    // ✅ تحديد targetEmployeeId
    let targetEmployeeId: number;

    if (isAdmin) {
      // ✅ المدير: يجب اختيار موظف من القائمة
      if (!selectedEmployeeId || selectedEmployeeId === "") {
        toast.error(
          t("upload_receipt.select_employee") || "Please select an employee",
        );
        return;
      }
      targetEmployeeId = Number(selectedEmployeeId);
      console.log("✅ Admin selected employee:", targetEmployeeId);
    } else {
      // ✅ الموظف العادي: يرفع لنفسه
      if (!employeeId) {
        toast.error("Employee ID not found");
        return;
      }
      targetEmployeeId = employeeId;
      console.log("✅ Employee uploading for himself:", targetEmployeeId);
    }

    if (isNaN(targetEmployeeId) || targetEmployeeId <= 0) {
      toast.error("Invalid employee ID");
      return;
    }

    console.log("✅ FINAL Target Employee ID:", targetEmployeeId);

    setIsLoading(true);

    try {
      const formData = new FormData();
      const now = new Date();

      const currentDateTime =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0") +
        " " +
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0") +
        ":" +
        String(now.getSeconds()).padStart(2, "0");

      formData.append("employee_id", String(targetEmployeeId));
      formData.append("description", description);
      formData.append("status", "pending");

      images.forEach((image) => {
        formData.append("images", image);
      });

      const token = localStorage.getItem("tenant-token");
      const response = await fetch("http://187.124.0.42:3007/tenant/invoices", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload invoice");
      }

      toast.success(
        t("upload_receipt.success") || "Invoice uploaded successfully!",
      );
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(t("upload_receipt.error") || "Failed to upload invoice");
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white/80 backdrop-blur-xl w-full max-w-2xl rounded-3xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400/10 rounded-full blur-2xl -ml-16 -mb-16" />

              <div className="relative flex justify-between items-center px-6 py-5 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg shadow-purple-500/25">
                    <Receipt className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {t("upload_receipt.title") || "New Invoice"}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {t("upload_receipt.subtitle") ||
                        "Fill in the details below"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100/80 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* ✅ Select - يظهر فقط للمدير */}
              {isAdmin && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {t("upload_receipt.select_employee_label") ||
                      "Select Employee"}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={selectedEmployeeId}
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log("📤 SELECT CHANGED TO:", value);
                      setSelectedEmployeeId(value);
                    }}
                    className="w-full mt-1.5 px-4 py-3 bg-gray-50/50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 outline-none transition-all duration-200 text-sm"
                  >
                    <option value="">
                      {t("upload_receipt.select_employee_placeholder") ||
                        "Select an employee..."}
                    </option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={String(emp.id)}>
                        {emp.name} - {emp.email}
                      </option>
                    ))}
                  </select>

                  {!selectedEmployeeId && (
                    <p className="text-xs text-red-500 mt-1">
                      {t("upload_receipt.select_employee_required") ||
                        "Please select an employee"}
                    </p>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  {t("upload_receipt.description") || "Description"}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    t("upload_receipt.description_placeholder") ||
                    "Add a short description..."
                  }
                  rows={3}
                  className="w-full mt-1.5 px-4 py-3 bg-gray-50/50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 outline-none transition-all duration-200 text-sm resize-none"
                />
              </div>

              {/* Images */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Image className="w-3.5 h-3.5" />
                    {t("upload_receipt.images") || "Invoice Images"}
                    <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full">
                    {images.length} / 10
                  </span>
                </div>

                {images.length === 0 && (
                  <p className="text-xs text-red-500 mb-2">
                    {t("upload_receipt.images_required") ||
                      "Please select at least one image"}
                  </p>
                )}

                {images.length < 10 && (
                  <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all duration-300">
                    <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-600">
                      {t("upload_receipt.click_to_upload") || "Click to upload"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {t("upload_receipt.upload_hint") ||
                        "PNG, JPG, WEBP up to 10MB"}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleImagesChange}
                    />
                  </label>
                )}

                {previews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {previews.map((preview, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <img
                          src={preview}
                          alt={`invoice ${index + 1}`}
                          className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1.5 right-1.5 bg-red-500/90 backdrop-blur-sm text-white p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-lg">
                          #{index + 1}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-100/80 bg-gray-50/30 rounded-b-3xl">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 active:scale-95"
              >
                {t("upload_receipt.cancel") || "Cancel"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || isLoading}
                className="relative group px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 disabled:opacity-50 disabled:shadow-none active:scale-95 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      {t("upload_receipt.processing") || "Processing..."}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {t("upload_receipt.upload") || "Upload Invoice"}
                    </>
                  )}
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
