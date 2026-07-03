"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Calendar,
  User,
  Activity,
  Briefcase,
  DollarSign,
  MapPin,
  Car,
  BadgeCheck,
  Clock,
  Shield,
  Users,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchEmployee,
  selectEmployee,
} from "@/store/slices/employee/profileSlice";
import { EmployeeUser } from "@/store/types/employee.types";

export default function EmployeeProfilePage() {
  const dispatch = useAppDispatch();
  const Employee = useAppSelector(selectEmployee);

  const [employee, setEmployee] = useState<EmployeeUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("tenant-user") as any;
    const user = JSON.parse(stored);
    dispatch(fetchEmployee(user.id?.toString() || null)).then((action) => {
      if (fetchEmployee.fulfilled.match(action)) {
        setEmployee(action.payload);
      }
    });
  }, [dispatch]);

  console.log(employee, "dafs");

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const fullName = employee.name;
  const age = calculateAge(employee.birth_date);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statusColor = employee.is_active
    ? "bg-green-200 text-green-700"
    : "bg-green-200 text-green-700";

  const stats = [
    {
      icon: DollarSign,
      label: "Salary",
      value: `$${employee.salary}`,
      color: "from-emerald-400 to-teal-500",
    },
    {
      icon: Briefcase,
      label: "Specialization",
      value: employee.specialization,
      color: "from-blue-400 to-indigo-500",
    },
    {
      icon: Calendar,
      label: "Age",
      value: `${age} years`,
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: Shield,
      label: "Status",
      value: employee.is_active ? "Active" : "Inactive",
      color: employee.is_active
        ? "from-green-400 to-green-500"
        : "from-green-400 to-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <div className=" inset-0 bg-linear-to-r from-indigo-500/10 to-cyan-500/10"></div>

          <div className="flex flex-col gap-5 p-5  md:flex-row">
            <div className="relative group">
              <div
                className={`  rounded-2xl bg-linear-to-r from-purple-500 to-blue-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
              ></div>

              <div className=" w-32 h-32 md:w-36 md:h-36">
                <div className="w-full h-full rounded-2xl bg-linear-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                  {fullName}
                </div>
              </div>

              <div
                className={`w-full flex justify-center ${statusColor}  px-3 py-2 rounded-full text-xs font-bold shadow-lg`}
              >
                {employee.is_active ? "Active" : "Inactive"}
              </div>
            </div>

            <div  className="flex flex-col gap-4  justify-center md:justify-start">
              <h1 className="text-3xl md:text-4xl font-bold  bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {fullName}
              </h1>

              <p className="text-gray-500  flex  items-center  justify-start md:justify-start gap-2">
                <Mail className="w-4 h-4" />
                {employee.email}
              </p>

              <div className="flex  gap-3  justify-start md:justify-start">
                <span className="px-4 py-2 text-sm font-semibold rounded-full bg-linear-to-r from-indigo-100 to-indigo-200 text-indigo-700 shadow-sm">
                  {employee.specialization}
                </span>
                <span className="px-4 py-2 text-sm font-semibold rounded-full bg-blue-100 text-gray-700 shadow-sm">
                  Employee
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-r ${stat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
              ></div>

              <div className="relative p-6">
                <div
                  className={`inline-flex p-3 rounded-xl bg-linear-to-r ${stat.color} text-white shadow-lg mb-4`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>

                <p className="text-gray-500 text-sm font-medium mb-1">
                  {stat.label}
                </p>

                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="bg-linear-to-r from-purple-500 to-blue-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: employee.email,
                  color: "text-blue-500",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: employee.phone,
                  color: "text-green-500",
                },
                {
                  icon: MapPin,
                  label: "Address",
                  value: employee.address,
                  color: "text-orange-500",
                },
                {
                  icon: Calendar,
                  label: "Birth Date",
                  value: formatDate(employee.birth_date),
                  color: "text-purple-500",
                },
                {
                  icon: Car,
                  label: "Driving License",
                  value: employee.driving_license ? "Yes" : "No",
                  color: "text-cyan-500",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 bg-gray-100 rounded-lg ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-medium">
                      {item.label}
                    </p>
                    <p className="text-gray-700 font-medium mt-1">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="bg-linear-to-r from-purple-500 to-blue-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Work Details
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {[
                {
                  icon: DollarSign,
                  label: "Salary",
                  value: `$${employee.salary|0}`,
                  color: "text-emerald-500",
                },
                {
                  icon: BadgeCheck,
                  label: "Specialization",
                  value: employee.specialization,
                  color: "text-indigo-500",
                },
                {
                  icon: Clock,
                  label: "Joined Date",
                  value: formatDate(employee.created_at),
                  color: "text-amber-500",
                },
                {
                  icon: Activity,
                  label: "Last Updated",
                  value: formatDate(employee.updated_at),
                  color: "text-rose-500",
                },
                {
                  icon: Users,
                  label: "Status",
                  value: employee.is_active ? "Active" : "Inactive",
                  color: employee.is_active
                    ? "text-emerald-500"
                    : "text-rose-500",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 bg-gray-100 rounded-lg ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-medium">
                      {item.label}
                    </p>
                    <p className="text-gray-700 font-medium mt-1">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
