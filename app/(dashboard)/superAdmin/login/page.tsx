"use client";

import { useEffect, useState } from "react";
import LoginForm from "@/components/superAdmin/LoginForm";

export default function LoginClient() {

  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setReturnUrl(params.get("returnUrl"));
    }
  }, []);

 

  return (
    <div className="bg-gray-50 ">
      {returnUrl && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-2">
          يرجى تسجيل الدخول للوصول إلى هذه الصفحة
        </div>
      )}

      <LoginForm />
    </div>
  );
}
