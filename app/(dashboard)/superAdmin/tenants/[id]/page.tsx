"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Check,
  Database,
  Shield,
  FileText,
  ArrowLeft,
  Save,
  Loader,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateTenant,
  selectTenantLoading,
  selectTenantError,
  selectTenants,
  fetchTenantById,
} from "@/store/slices/superAdmin/tenantSlice";
import Select from "@/components/superAdmin/Select";
import { planOptions, statusOptions } from "@/config/statsConfig";
import { useRouter, useParams } from "next/navigation";
import {
  getInputClassName,
  validateFieldForTenants,
} from "@/utils/validators/validate";
import { toast } from "sonner";
import {
  getInitialTenantForm,
  Tenant,
} from "@/store/services/superAdmins/tenantService";
import { tenantFormFields } from "@/config/tenantFormConfig";
import { FormField } from "@/components/Field/FormField";

export default function EditTenantPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const tenantId = params?.id as string;

  const isLoading = useAppSelector(selectTenantLoading);
  const error = useAppSelector(selectTenantError);
  const selectedTenant = useAppSelector(selectTenants);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Tenant>(getInitialTenantForm());

  useEffect(() => {
    if (tenantId) {
      fetchTenantData();
    }
  }, [tenantId]);

  const fetchTenantData = async () => {
    setIsLoadingData(true);
    try {
      const result = await dispatch(fetchTenantById(Number(tenantId))).unwrap();
      setFormData({
        name: result.name || "",
        address: result.address || "",
        phone: result.phone || "",
        plan: result.plan || "basic",
        adminName: result.adminName || "",
        adminEmail: result.adminEmail || "",
        adminPassword: "",
        databaseName: result.databaseName || "",
        subscriptionStartDate: result.subscriptionStartDate || "",
        subscriptionEndDate: result.subscriptionEndDate || "",
        discount: result.discount || 0,
        industry: result.industry || "",
        maxEmployees: result.maxEmployees || 0,
        kvkNumber: result.kvkNumber || "",
        btwNumber: result.btwNumber || "",
        status: result.status || "active",
      });
    } catch (error: any) {
      toast.error(error?.message || "Failed to load tenant data");
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
    const errorMsg = validateFieldForTenants(name, value);

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      "adminEmail",
      "phone",
      "adminName",
      "maxEmployees",
      "address",
      "industry",
      "kvkNumber",
      "btwNumber",
      "databaseName",
    ];

    const newErrors: Record<string, string> = {};
    let hasError = false;

    fieldsToValidate.forEach((field) => {
      const value = formData[field as keyof typeof formData];
      const msg = validateFieldForTenants(field, value);
      if (msg) {
        newErrors[field] = msg;
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const cleanString = (value: any): string | undefined => {
      if (!value) return undefined;
      const str = String(value).trim();
      return (
        str.replace(/[`~!@#$%^&*()_+={}[\];:'"<>,.?/\\|]/g, "").trim() ||
        undefined
      );
    };

    const cleanNumber = (value: any): number | undefined => {
      if (!value) return undefined;
      const num = Number(String(value).replace(/[^0-9.]/g, ""));
      return isNaN(num) ? undefined : num;
    };

    let startDate = null;
    let endDate = null;

    if (formData.subscriptionStartDate) {
      const date = new Date(formData.subscriptionStartDate);
      if (!isNaN(date.getTime())) {
        startDate = date.toISOString().split("T")[0];
      }
    }

    if (formData.subscriptionEndDate) {
      const date = new Date(formData.subscriptionEndDate);
      if (!isNaN(date.getTime())) {
        endDate = date.toISOString().split("T")[0];
      }
    }

    const payload: any = {
      name: cleanString(formData.name),
      address: cleanString(formData.address),
      phone: cleanString(formData.phone),
      plan: formData.plan,
      adminName: cleanString(formData.adminName),
      adminEmail: formData.adminEmail?.trim(),
      databaseName: cleanString(formData.databaseName),
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate,
      discount: cleanNumber(formData.discount),
      industry: cleanString(formData.industry),
      maxEmployees: cleanNumber(formData.maxEmployees) || 0,
      kvkNumber: cleanString(formData.kvkNumber),
      btwNumber: cleanString(formData.btwNumber),
      status: formData.status,
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key];
      }
    });

    if (formData.adminPassword && formData.adminPassword.length > 0) {
      payload.adminPassword = formData.adminPassword;
    }

    console.log("📤 Clean payload:", JSON.stringify(payload, null, 2));

    try {
      const resultAction = await dispatch(
        updateTenant({ id: Number(tenantId), data: payload }),
      );

      if (updateTenant.fulfilled.match(resultAction)) {
        toast.success("Tenant updated successfully.");
        router.push("/superAdmin/tenants");
      } else {
        toast.error(error || "Failed to update tenant");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update tenant");
    }
  };

  const inputClass =
    "w-full h-12 rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all";

  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  const cardClass = "rounded-3xl border border-slate-200 bg-white shadow-sm";
  const tenantFields = tenantFormFields(formData);

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-purple-600 animate-spin" />
          <p className="text-slate-600 font-medium">Loading tenant data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto px-6 lg:px-8 pb-10 relative z-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 rounded-2xl bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-all shadow-sm"
            >
              <ArrowLeft className="w-6 h-6 text-slate-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Edit Tenant</h1>
              <p className="text-sm text-slate-500">
                Update tenant information for {formData.name || "..."}
              </p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={cardClass}
              >
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-100 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-800">
                      Company Information
                    </h2>
                    <p className="text-sm text-slate-500">
                      Basic company details
                    </p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {tenantFields.map((e, i) => {
                    if (e.id <= 5) {
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
                            <p className="text-red-500 text-sm mt-1">
                              {errors[e.name]}
                            </p>
                          )}
                        </div>
                      );
                    }
                  })}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={cardClass}
              >
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-violet-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-800">
                      Admin Information
                    </h2>
                    <p className="text-sm text-slate-500">
                      Workspace administrator account
                    </p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                  {tenantFields.map((e, i) => {
                    if (e.id > 5 && e.id <= 8) {
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
                            <p className="text-red-500 text-sm mt-1">
                              {errors[e.name]}
                            </p>
                          )}
                        </div>
                      );
                    }
                  })}
                </div>
              </motion.div>

              {/* Legal Information */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={cardClass}
              >
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-800">
                      Legal Information
                    </h2>
                    <p className="text-sm text-slate-500">
                      Registration and tax details
                    </p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {tenantFields.map((e, i) => {
                    if (e.id > 8 && e.id <= 10) {
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
                            <p className="text-red-500 text-sm mt-1">
                              {errors[e.name]}
                            </p>
                          )}
                        </div>
                      );
                    }
                  })}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Subscription */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                className={cardClass}
              >
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-800">
                      Subscription
                    </h2>
                    <p className="text-sm text-slate-500">
                      Plan and database setup
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {tenantFields.map((e, i) => {
                    if (e.id > 10) {
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
                            <p className="text-red-500 text-sm mt-1">
                              {errors[e.name]}
                            </p>
                          )}
                        </div>
                      );
                    }
                  })}

                  <Select
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                    options={planOptions}
                    label="Plan"
                    className={inputClass}
                  />

                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={statusOptions}
                    label="Status"
                    className={inputClass}
                  />
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-linear-to-r from-indigo-600 via-violet-600 to-blue-600 text-white font-semibold shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Updating Tenant...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Tenant
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
