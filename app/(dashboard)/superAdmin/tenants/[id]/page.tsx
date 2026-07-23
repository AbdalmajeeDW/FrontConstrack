"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectTenantError, selectTenantLoading, updateTenant } from "@/store/slices/superAdmin/tenantSlice";
import { getTenantById, Tenant } from "@/store/services/superAdmins/tenantService";
import Select from "@/components/superAdmin/Select";
import { planOptions, statusOptions } from "@/config/statusConfig";
import { ArrowLeft, Building2, CalendarDays, Check, Mail, Phone, Shield, Users } from "lucide-react";

export default function EditTenantPage() {
  const params = useParams() as { id?: string };
  const tenantId = params.id ? Number(params.id) : 1;
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectTenantLoading);
  const error = useAppSelector(selectTenantError);

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState<Partial<Tenant>>({
    name: "",
    address: "",
    phone: "",
    plan: "Basic",
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
    status: "pending",
  });
  const [loadingTenant, setLoadingTenant] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!tenantId) return;

    const loadTenant = async () => {
      setLoadingTenant(true);
      try {
        const data = await getTenantById(tenantId);
        setTenant(data);
        setFormData({
          name: data.name,
          address: data.address,
          phone: data.phone,
          plan: data.plan,
          adminName: data.adminName,
          adminEmail: data.adminEmail,
          adminPassword: data.adminPassword,

          databaseName: data.databaseName,
          maxEmployees: data.maxEmployees,
          subscriptionStartDate: data.subscriptionStartDate,
          subscriptionEndDate: data.subscriptionEndDate,
          kvkNumber: data.kvkNumber,
          btwNumber: data.btwNumber,
          status: data.status,
        });
      } catch (err) {
        console.error("Failed to load tenant:", err);
      } finally {
        setLoadingTenant(false);
      }
    };
    loadTenant();
  }, [tenantId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!tenantId) return;

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
  maxEmployees: Number(formData.maxEmployees) || 0,
  kvkNumber: formData.kvkNumber,
  btwNumber: formData.btwNumber,
  status: formData.status,
};


    try {
      
      const resultAction = await dispatch(updateTenant({ id: tenantId, data: payload }));
      if (updateTenant.fulfilled.match(resultAction)) {
        setSuccessMessage("تم تحديث بيانات التيننت بنجاح.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass =
    "w-full h-12 rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all";

  if (loadingTenant) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center p-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-lg p-8 text-slate-700">
          جاري تحميل تفاصيل التيننت...
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] p-6">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 shadow-sm p-8 text-rose-700">
          لم يتم العثور على بيانات التيننت.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto px-6 lg:px-8 pb-10 relative z-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">تعديل بيانات التيننت</h1>
            <p className="text-sm text-slate-500">قم بتحديث معلومات التيننت ثم احفظ التغييرات.</p>
          </div>
          <Link
            href="/superAdmin/tenants"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" /> العودة إلى القائمة
          </Link>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
            حدث خطأ: {error}
          </div>
        ) : null}
        {successMessage ? (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">Company Information</h2>
                  <p className="text-sm text-slate-500">تحديث معلومات الشركة الأساسية.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Company Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleChange}
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">البريد الإلكتروني للمسؤول</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail || ""}
                      onChange={handleChange}
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Max Employees</label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      name="maxEmployees"
                      value={formData.maxEmployees || 0}
                      onChange={handleChange}
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
                  <input
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-violet-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">Subscription</h2>
                  <p className="text-sm text-slate-500">تحديث حالة الاشتراك والخطة.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Select
                    name="plan"
                    value={formData.plan || "Basic"}
                    onChange={handleChange}
                    options={planOptions}
                    label="Plan"
                  />
                </div>
                <div>
                  <Select
                    name="status"
                    value={formData.status || "active"}
                    onChange={handleChange}
                    options={statusOptions}
                    label="Status"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Subscription Start</label>
                  <input
                    type="date"
                    name="subscriptionStartDate"
                    value={formData.subscriptionStartDate || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Subscription End</label>
                  <input
                    type="date"
                    name="subscriptionEndDate"
                    value={formData.subscriptionEndDate || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check className="w-4 h-4" />
                {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </button>
            </div>
          </div>

      
        </form>
      </div>
    </div>
  );
}
