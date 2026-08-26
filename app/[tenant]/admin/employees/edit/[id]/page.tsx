"use client";

import { useParams } from "next/navigation";
import EmployeeForm from "@/components/tenantAdmin/EmployeesForm/Employees";

export default function EditEmployeePage() {
  const params = useParams();
  const employeeId = params?.id as string;

  return <EmployeeForm mode="edit" employeeId={employeeId} />;
}
