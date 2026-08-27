"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchEmployee,
  selectEmployee,
} from "@/store/slices/employee/profileSlice";
import ProfilePage from "@/components/tenantAdmin/ProfileEmployee/Profile";

export default function EmployeeProfilePage() {
  const dispatch = useAppDispatch();
  const employee = useAppSelector(selectEmployee);
  const params = useParams();
  const id = params.id as string;
  const employeeId = Number(id);
  useEffect(() => {
    if (!Number.isNaN(employeeId)) {
      dispatch(fetchEmployee(employeeId));
    }
  }, [dispatch, employeeId]);
  if (!employee) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div>
      <ProfilePage employee={employee} isEmployee={false} />
    </div>
  );
}
