"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Mail,
  Phone,
  User,
  Lock,
  Briefcase,
  UserPlus,
  MapPin,
  Cake,
  Car,
  Wrench,
  Euro,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addEmployee,
  selectEmployeeLoading,
  selectEmployeeError,
} from "@/store/slices/admin/employeeSlice";
import { employee } from "@/store/services/admin/employee";
import { useRouter } from "next/navigation";
import { getInputClassName, validateFieldForEmployee } from "@/utils/validators/validate";
import { specializationOptions } from "@/utils/constants/specializationOptions";
import { toast } from "sonner";

export default function AddEmployeePage() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectEmployeeLoading);
  const error = useAppSelector(selectEmployeeError);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<employee>({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "employee",
    salary: "",
    address: "",
    birth_date: "",
    driving_license: false,
    specialization: "",
  });

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
    setSuccessMessage("");
    const fieldsToValidate = [
      "name",
      "email",
      "password",
      "birth_date",
      "phone",
    ];
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
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: formData.role,
      salary: formData.salary ? parseFloat(formData.salary) : null,
      address: formData.address,
      birth_date: formData.birth_date,
      driving_license: formData.driving_license,
      specialization: formData.specialization,
    };

    try {
      const resultAction = await dispatch(addEmployee(payload as any));
      if (addEmployee.fulfilled.match(resultAction)) {
        toast.success("Created Employee Successfly.");
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          role: "employee",
          salary: "",
          address: "",
          birth_date: "",
          driving_license: false,
          specialization: "",
        });
        router.back();
      } else {
        toast.error(`Failed To Create Employee: ${error}`);
      }
    } catch (err) {}
  };


  const textareaClass =
    "w-full rounded-xl border border-gray-400 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none";

  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  const cardClass = "rounded-3xl border border-slate-200 bg-white shadow-sm";

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto px-6 lg:px-8 pb-10 relative z-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-r from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Add New Employee
              </h1>
              <p className="text-sm text-slate-500">
                Create a new employee account for your workspace
              </p>
            </div>
          </div>
        </motion.div>
        {successMessage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            {successMessage}
          </motion.div>
        ) : null}

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
                      Personal Information
                    </h2>
                    <p className="text-sm text-slate-500">
                      Employee basic details
                    </p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={getInputClassName("name", errors)}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Birth Date</label>
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
                    <label className={labelClass}>Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`${getInputClassName("email", errors)} pl-11`}
                        placeholder="employee@company.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`${getInputClassName("password", errors)} pl-11`}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`${getInputClassName("phone", errors)} pl-11`}
                        placeholder="+31"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Accommodation Address</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`${textareaClass} pl-11`}
                        placeholder="Building name, street, city, country..."
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
                      Employment & Financial Information
                    </h2>
                    <p className="text-sm text-slate-500">
                      Salary and work details
                    </p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Monthly Salary</label>
                    <div className="relative">
                      <Euro className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        className={`${getInputClassName("salary", errors)} pl-11`}
                        placeholder="2000"
                      />
                    </div>
                    {errors.salary && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.salary}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Specialization</label>
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
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Driving License</label>
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
                          Has valid driving license
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
                      Employee Summary
                    </h2>
                    <p className="text-sm text-slate-500">
                      Review employee details
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Name:</span>
                      <span className="font-medium text-slate-700">
                        {formData.name || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-medium text-slate-700">
                        {formData.email || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-medium text-slate-700">
                        {formData.phone || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Role:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          formData.role === "admin"
                            ? "bg-violet-100 text-violet-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {formData.role === "admin" ? "Admin" : "Employee"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Specialization:</span>
                      <span className="font-medium text-slate-700">
                        {formData.specialization || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Monthly Salary:</span>
                      <span className="font-medium text-slate-700">
                        {formData.salary ? `$${formData.salary}` : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Birth Date:</span>
                      <span className="font-medium text-slate-700">
                        {formData.birth_date || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Driving License:</span>
                      <span className="font-medium text-slate-700">
                        {formData.driving_license ? "Yes" : "No"}
                      </span>
                    </div>
                    {formData.address && (
                      <div className="flex justify-between items-start text-sm">
                        <span className="text-slate-500">Address:</span>
                        <span className="font-medium text-slate-700 text-right max-w-[180px]">
                          {formData.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
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
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Employee...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create Employee
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
