"use client";

import { motion } from "framer-motion";
import { Mail, Euro, HardDrive, Eye, Edit, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { EmployeeUser } from "@/store/types/employee.types";
import { employee } from "@/store/services/admin/employee";
import { getSpecializationLabel } from "@/utils/constants/specializationOptions";

interface EmployeeTableProps {
  employees: employee[];
  tenantName: string;
  onEdit: (id: number) => void;
  onDelete: (id: number, name: string) => void;
  onRowClick: (id: number) => void;
  t: any;
}

export const EmployeeTable = ({
  employees,
  tenantName,
  onEdit,
  onDelete,
  onRowClick,
  t,
}: EmployeeTableProps) => {
  return (
    <div className="overflow-x-auto overflow-y-hidden rounded-2xl w-full">
      <table className="table-auto w-full">
        <thead className="bg-linear-to-r from-purple-500 to-blue-500">
          <tr>
            <th className="text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
              {t("employees.table.user")}
            </th>
            <th className="text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
              {t("employees.table.contact")}
            </th>
            <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
              {t("employees.table.address")}
            </th>
            <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
              {t("employees.table.salary")}
            </th>
            <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
              {t("employees.table.birth_date")}
            </th>
            <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
              {t("employees.table.license")}
            </th>
            <th className="hidden sm:table-cell text-center px-4 py-4 text-xs font-medium text-white uppercase tracking-wider">
              {t("employees.table.specialization")}
            </th>
            <th className="px-4 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
              {t("employees.table.action")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {employees.length > 0 ? (
            employees.map((user, idx) => {
              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-100 cursor-pointer transition-colors group"
                  onClick={() => onRowClick(user.id!)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-purple-600 font-medium text-sm uppercase">
                          {user.name?.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 text-center">
                        <p className="truncate font-medium text-slate-900 group-hover:text-purple-600 transition-colors">
                          {user.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-50">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate block max-w-full">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-50">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                        <span className="truncate block max-w-full">
                          {user.address}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-50">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                        <Euro className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate block max-w-full">
                          {Number(user.salary) || 0}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-50">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                        <span className="truncate block max-w-full">
                          {user.birth_date}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-50">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                        <HardDrive className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate block max-w-full">
                          {user.driving_license
                            ? t("employees.yes")
                            : t("employees.no")}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-50">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                        <span className="truncate block max-w-full">
                          <p>
                            {getSpecializationLabel(user.specialization, t)}
                          </p>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-3">
                      <Link
                        onClick={(e) => e.stopPropagation()}
                        href={`/${tenantName}/admin/employees/${user.id}`}
                      >
                        <button className="p-1.5 cursor-pointer hover:bg-slate-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(user.id!);
                        }}
                        className="p-1.5 cursor-pointer hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-green-500" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(user.id!, user.name || "Unknown");
                        }}
                        className="p-1.5 cursor-pointer hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <Users className="w-12 h-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">
                    {t("employees.no_employees") || "لا يوجد موظفين"}
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
