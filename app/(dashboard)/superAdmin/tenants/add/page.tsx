"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Check, Database, Shield, FileText } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addTenant,
  selectTenantLoading,
  selectTenantError,
} from "@/store/slices/superAdmin/tenantSlice";
import Select from "@/components/superAdmin/Select";
import { planOptions, statusOptions } from "@/config/statsConfig";
import { useRouter } from "next/navigation";
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

export default function AddTenantPage() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectTenantLoading);
  const error = useAppSelector(selectTenantError);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Tenant>(getInitialTenantForm());
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
    setSuccessMessage("");
    const fieldsToValidate = [
      "name",
      "adminEmail",
      "adminPassword",
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
    const payload = {
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      plan: formData.plan,
      adminName: formData.adminName,
      adminEmail: formData.adminEmail,
      adminPassword: formData.adminPassword,
      databaseName: formData.databaseName,
      subscriptionStartDate: formData.subscriptionStartDate,
      subscriptionEndDate: formData.subscriptionEndDate,
      discount: formData.discount,
      industry: formData.industry,
      maxEmployees: Number(formData.maxEmployees),
      kvkNumber: formData.kvkNumber,
      btwNumber: formData.btwNumber,
      status: formData.status,
    };

    try {
      const resultAction = await dispatch(addTenant(payload as any));
      if (addTenant.fulfilled.match(resultAction)) {
        toast.success("Created Tenants Successfly.");
        router.push("/superAdmin/tenants");
        setFormData(getInitialTenantForm());
      } else {
        toast.error(error);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const inputClass =
    "w-full h-12 rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all";

  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  const cardClass = "rounded-3xl border border-slate-200 bg-white shadow-sm";
  const tenantFields = tenantFormFields(formData);
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto px-6 lg:px-8  pb-10 relative z-20">
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
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-linear-to-r from-indigo-600 via-violet-600 to-blue-600 text-white font-semibold shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check className="w-5 h-5" />

                {isLoading ? "Creating Tenant..." : "Create Tenant"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
