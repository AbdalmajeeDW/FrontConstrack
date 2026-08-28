// components/landing/CompanyCheckModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  X,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface CompanyCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompanyCheckModal({
  isOpen,
  onClose,
}: CompanyCheckModalProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"choose" | "enter" | "login">("choose");

  const checkCompany = async (tenantName: string) => {
    try {
      const response = await fetch(
        `http://187.124.0.42:3007/tenant/auth/check-company?tenantName=${tenantName}`,
      );
      const data = await response.json();

      if (data.exists && data.status === "active") {
        router.push(`/${tenantName}/login`);
      } else if (data.exists && data.status === "inactive") {
        setError(t("company.inactive"));
      } else {
        setError(t("company.not_found"));
      }
    } catch (error) {
      setError(t("company.check_error"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setError(t("company.enter_name"));
      return;
    }
    await checkCompany(companyName.trim());
  };

  const handleChooseCompany = () => {
    setStep("enter");
  };

  const handleCreateCompany = () => {
    router.push("/register");
    onClose();
  };

  const handleReset = () => {
    setStep("choose");
    setCompanyName("");
    setError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white font-bold text-lg">
                    {t("company.title")}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {step === "choose" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <p className="text-gray-600 text-center">
                    {t("company.ask")}
                  </p>
                  <div className="flex flex-col gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleChooseCompany}
                      className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-2xl transition-all border-2 border-transparent hover:border-indigo-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-800">
                            {t("company.have_company")}
                          </div>
                          <div className="text-xs text-gray-400">
                            {t("company.have_company_desc")}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-indigo-600" />
                    </motion.button>

                    {/* <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreateCompany}
                      className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all border-2 border-transparent hover:border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-800">
                            {t("company.new_company")}
                          </div>
                          <div className="text-xs text-gray-400">
                            {t("company.new_company_desc")}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-emerald-600" />
                    </motion.button> */}
                  </div>
                </motion.div>
              )}

              {step === "enter" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("company.enter_name_label")}
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => {
                            setCompanyName(e.target.value);
                            setError("");
                          }}
                          placeholder={t("company.enter_name_placeholder")}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                          autoFocus
                          disabled={isLoading}
                        />
                      </div>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-red-500 text-sm mt-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {error}
                        </motion.p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-medium"
                        disabled={isLoading}
                      >
                        {t("projectDetails.go_back")}
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {t("company.checking")}
                          </>
                        ) : (
                          <>
                            {t("company.continue")}
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === "login" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {t("company.redirecting")}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {t("company.redirecting_desc", { company: companyName })}
                  </p>
                  <div className="mt-4 flex justify-center">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
