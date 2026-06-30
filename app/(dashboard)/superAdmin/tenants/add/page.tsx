"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  CalendarDays,
  Check,
  Database,
  Globe2,
  Mail,
  Phone,
  Shield,
  Users,
  BadgePercent,
  FileText,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addTenant,
  selectTenantLoading,
  selectTenantError,
} from "@/store/slices/superAdmin/tenantSlice";
import Select from "@/components/superAdmin/Select";
import { planOptions, statusOptions } from "@/config/statusConfig";
import { useRouter } from "next/navigation";

interface AddTenantForm {
  name: string;
  address: string;
  phone: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  databaseName: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  discount: number;
  industry: string;
  plan: string;
  maxEmployees: number;
  kvkNumber: string;
  btwNumber: string;
  status: "active" | "pending" | "suspended" | "expired";
}

export default function AddTenantPage() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectTenantLoading);
  const error = useAppSelector(selectTenantError);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState<AddTenantForm>({
    name: "",
    address: "",
    phone: "",
    plan: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    databaseName: "",
    subscriptionStartDate: "",
    subscriptionEndDate: "",
    discount: 0,
    industry: "",
    maxEmployees: 10,
    kvkNumber: "",
    btwNumber: "",
    status: "active",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSuccessMessage("");

    const payload = {
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      status: formData.status,

      plan: formData.plan,
      maxEmployees: Number(formData.maxEmployees),
      subscriptionStartDate: formData.subscriptionStartDate,
      subscriptionEndDate: formData.subscriptionEndDate,
      discount: formData.discount,
      industry: formData.industry,
      databaseName: formData.databaseName,
      kvkNumber: formData.kvkNumber,
      btwNumber: formData.btwNumber,
      adminName: formData.adminName,
      adminEmail: formData.adminEmail,
      adminPassword: formData.adminPassword,
    };

    try {
      const resultAction = await dispatch(addTenant(payload as any));
      if (addTenant.fulfilled.match(resultAction)) {
        setSuccessMessage("تم إنشاء التيننت بنجاح.");
        router.push('/superAdmin/tenants')
        setFormData({
          name: "",
          address: "",
          phone: "",
          plan: "",
          adminName: "",
          adminEmail: "",
          adminPassword: "",
          databaseName: "",
          subscriptionStartDate: "",
          subscriptionEndDate: "",
          discount: 0,
          industry: "",
          maxEmployees: 10,
          kvkNumber: "",
          btwNumber: "",
          status: "active",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass =
    "w-full h-12 rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all";

  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  const cardClass = "rounded-3xl border border-slate-200 bg-white shadow-sm";

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto px-6 lg:px-8  pb-10 relative z-20">
        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
            حدث خطأ أثناء إنشاء التيننت: {error}
          </div>
        ) : null}
        {successMessage ? (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
            {successMessage}
          </div>
        ) : null}
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
                  <div>
                    <label className={labelClass}>Company Name</label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="United Contracting Co"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Industry</label>

                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Construction"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Phone Number</label>

                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`${inputClass} pl-11`}
                        placeholder="+31"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Number of Employees</label>

                    <div className="relative">
                      <Users className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                      <input
                        type="number"
                        name="maxEmployees"
                        value={formData.maxEmployees}
                        onChange={handleChange}
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>Address</label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`${inputClass} pl-11`}
                      placeholder="Company address..."
                    />
                  </div>
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
                  <div>
                    <label className={labelClass}>Admin Name</label>

                    <input
                      type="text"
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Admin Email</label>

                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                      <input
                        type="email"
                        name="adminEmail"
                        value={formData.adminEmail}
                        onChange={handleChange}
                        className={`${inputClass} pl-11`}
                        placeholder="admin@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Admin Password</label>

                    <input
                      type="password"
                      name="adminPassword"
                      value={formData.adminPassword}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="********"
                    />
                  </div>
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
                  <div>
                    <label className={labelClass}>KVK Number</label>

                    <div className="relative">
                      <Globe2 className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                      <input
                        type="text"
                        name="kvkNumber"
                        value={formData.kvkNumber}
                        onChange={handleChange}
                        className={`${inputClass} pl-11`}
                        placeholder="KVK Number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>BTW Number</label>

                    <div className="relative">
                      <Globe2 className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                      <input
                        type="text"
                        name="btwNumber"
                        value={formData.btwNumber}
                        onChange={handleChange}
                        className={`${inputClass} pl-11`}
                        placeholder="BTW Number"
                      />
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
                  <div>
                    <label className={labelClass}>Database Name</label>

                    <div className="relative">
                      <Database className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                      <input
                        type="text"
                        name="databaseName"
                        value={formData.databaseName}
                        onChange={handleChange}
                        className={`${inputClass} pl-11`}
                        placeholder="tenant_database"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Subscription Start</label>

                    <div className="relative">
                      <CalendarDays className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                      <input
                        type="date"
                        name="subscriptionStartDate"
                        value={formData.subscriptionStartDate}
                        onChange={handleChange}
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Subscription End</label>

                    <div className="relative">
                      <CalendarDays className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                      <input
                        type="date"
                        name="subscriptionEndDate"
                        value={formData.subscriptionEndDate}
                        onChange={handleChange}
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Discount %</label>

                    <div className="relative">
                      <BadgePercent className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                      <input
                        type="number"
                        step="0.01"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </div>
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
