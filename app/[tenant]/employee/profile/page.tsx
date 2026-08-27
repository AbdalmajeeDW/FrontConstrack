"use client";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchEmployee,
  selectEmployee,
} from "@/store/slices/employee/profileSlice";
import ProfilePage from "@/components/tenantAdmin/ProfileEmployee/Profile";

export default function EmployeeProfilePage() {
  const dispatch = useAppDispatch();
  const Employee = useAppSelector(selectEmployee);

  useEffect(() => {
    const stored = localStorage.getItem("tenant-user") as any;
    const user = JSON.parse(stored);
    dispatch(fetchEmployee(user.id?.toString() || null));
  }, [dispatch]);

  if (!Employee) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div>
      {" "}
      <ProfilePage employee={Employee} isEmployee={true} />
    </div>
  );
}
