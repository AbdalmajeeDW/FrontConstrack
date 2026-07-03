"use client";

import React, { useState } from 'react';
import { Eye, EyeClosed, BrickWall } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { tenantAdminLogin } from '@/store/slices/admin/tenantAdminAuthSlice';
import { useRouter } from 'next/navigation';
import { decodeJWT } from '../AuthGuard';

const TenantAdminLoginForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error } = useAppSelector((state) => state.tenantAdminAuth);

  const validateForm = () => {
    if (!name.trim()) {
      setAlertMessage('Company name is required');
      setShowAlert(true);
      return false;
    }
    if (!email.trim()) {
      setAlertMessage('email is required.');
      setShowAlert(true);
      return false;
    }
    if (!password.trim()) {
      setAlertMessage('Password is required.');
      setShowAlert(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setShowAlert(false);
    if (!validateForm()) {
      return;
    }

    const result = await dispatch(
      tenantAdminLogin({ name, email, password }),
    );
    const token = localStorage.getItem('tenant-token');
    const decodedRole = token ? decodeJWT(token)?.role : null;

    if (tenantAdminLogin.fulfilled.match(result)) {
        if (decodedRole === 'tenant_admin') {
        router.push('/admin');
      }else if ( decodedRole === 'tenant_employee') {
        router.push('/employee');
      }
    
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-10 bg-linear-to-br from-violet-600 to-blue-600 text-white flex flex-col justify-center gap-6">
            <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-white/10 shadow-lg mx-auto">
              <BrickWall size={48} />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Tenant Admin</h1>
              <p className="mt-3 text-sm text-slate-200 leading-relaxed">
Log in as an admin to your dashboard using your company name, email, and password              </p>
            </div>
          </div>

          <div className="p-10">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Admin Login</h2>

            {(showAlert || error) && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
                {alertMessage || error || 'A login error occurred..'}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  placeholder="Enter admin email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-12 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-violet-600"
                  >
                    {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl bg-violet-600 px-5 py-3 text-white font-semibold transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Logging in, please wait...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantAdminLoginForm;
