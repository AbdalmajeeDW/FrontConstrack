// app/(landing)/page.tsx
"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Users,
  ClipboardCheck,
  FileText,
  BarChart3,
  Shield,
  Globe,
  Smartphone,
  Zap,
  Star,
  Clock,
  Headphones,
  HardHat,
  LogIn,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import I18nProvider from "@/components/I18nProvider";
import CompanyCheckModal from "@/components/landing/CompanyCheckModal";
import VersionFooter from "@/components/Footer/VersionFooter";

export default function LandingPage() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Users,
      title: t("app_name.features.employees"),
      description: t("app_name.features.employees_desc"),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: ClipboardCheck,
      title: t("app_name.features.tasks"),
      description: t("app_name.features.tasks_desc"),
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: FileText,
      title: t("app_name.features.invoices"),
      description: t("app_name.features.invoices_desc"),
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: BarChart3,
      title: t("app_name.features.reports"),
      description: t("app_name.features.reports_desc"),
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Shield,
      title: t("app_name.features.security"),
      description: t("app_name.features.security_desc"),
      color: "from-rose-500 to-pink-500",
    },
    {
      icon: Globe,
      title: t("app_name.features.languages"),
      description: t("app_name.features.languages_desc"),
      color: "from-cyan-500 to-sky-500",
    },
  ];

  const stats = [
    { icon: Users, value: "500+", label: t("app_name.stats.employees") },
    { icon: Building2, value: "50+", label: t("app_name.stats.companies") },
    { icon: ClipboardCheck, value: "1000+", label: t("app_name.stats.tasks") },
    { icon: Star, value: "4.9", label: t("app_name.stats.rating") },
  ];

  const benefits = [
    {
      icon: Zap,
      title: t("app_name.benefits.speed"),
      description: t("app_name.benefits.speed_desc"),
    },
    {
      icon: Smartphone,
      title: t("app_name.benefits.responsive"),
      description: t("app_name.benefits.responsive_desc"),
    },
    {
      icon: Clock,
      title: t("app_name.benefits.time"),
      description: t("app_name.benefits.time_desc"),
    },
    {
      icon: Headphones,
      title: t("app_name.benefits.support"),
      description: t("app_name.benefits.support_desc"),
    },
  ];
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <HardHat className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t("app_name.app_name")}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                {t("app_name.nav.features")}
              </Link>
              <Link
                href="#benefits"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                {t("app_name.nav.why_us")}
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                {t("app_name.nav.contact")}
              </Link>
              <I18nProvider>
                <LanguageSwitcher />
              </I18nProvider>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCompanyModalOpen(true)}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-xl font-semibold shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
              >
                <LogIn className="w-4 h-4" />
                {t("app_name.nav.login")}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-b border-gray-100"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                href="#features"
                className="block text-gray-600 hover:text-indigo-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("app_name.nav.features")}
              </Link>
              <Link
                href="#benefits"
                className="block text-gray-600 hover:text-indigo-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("app_name.nav.why_us")}
              </Link>
              <Link
                href="#contact"
                className="block text-gray-600 hover:text-indigo-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("app_name.nav.contact")}
              </Link>
              <div className="py-2">
                <LanguageSwitcher />
              </div>
              <motion.button
                onClick={() => setIsCompanyModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold shadow-md"
              >
                <LogIn className="w-4 h-4" />
                {t("app_name.nav.login")}
              </motion.button>
            </div>
          </motion.div>
        )}
      </header>
      <CompanyCheckModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />
      <section className="relative overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-300/10 to-cyan-300/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-200/5 to-purple-200/5 rounded-full blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #4f46e5 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />

          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-10 w-20 h-20 bg-indigo-400/10 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute top-1/2 left-1/4 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl"
          />
        </div>

        <div className="relative  mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-indigo-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-lg shadow-indigo-100/50 border border-white/50"
            >
              <HardHat className="w-4 h-4" />
              <span>{t("app_name.hero.badge")}</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t("app_name.hero.title_highlight")}
              </span>
              <br />
              <span className="text-gray-900">{t("app_name.hero.title")}</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              {t("app_name.hero.subtitle")}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex flex-wrap justify-center gap-6 md:gap-12"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <stat.icon className="w-5 h-5 text-indigo-500" />
                    <span className="text-2xl md:text-3xl font-bold text-gray-900">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
      <section id="features" className="py-20 bg-white">
        <div className=" mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("app_name.features.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("app_name.features.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl md:rounded-3xl transition-opacity duration-500`}
                  />
                  <div className="relative">
                    <div
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 md:mb-6`}
                    >
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <section
        id="benefits"
        className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50"
      >
        <div className=" mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("app_name.benefits.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("app_name.benefits.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <section
        id="contact"
        className="py-16 md:py-20 bg-gradient-to-r from-indigo-600 to-purple-600"
      >
        <div className=" mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("app_name.cta.title")}
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t("app_name.cta.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>
      <footer className="bg-gray-900 py-8 md:py-12">
        <div className=" mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <HardHat className="w-6 h-6 text-indigo-400" />
              <span className="text-white font-bold text-lg">
                {t("app_name.app_name")}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-400 text-sm">
              <Link href="#" className="hover:text-white transition-colors">
                {t("app_name.footer.terms")}
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                {t("app_name.footer.privacy")}
              </Link>
              <span>© 2026 {t("app_name.footer.rights")}</span>
              <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-mono">
                <VersionFooter />
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Play({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
