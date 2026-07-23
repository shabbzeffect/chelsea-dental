'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PatientSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailReminders, setEmailReminders] = useState(true);
  const [smsReminders, setSmsReminders] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 rounded-2xl p-6 text-white shadow-lg shadow-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-200 mb-2">
              <Link href="/patient" className="hover:text-white transition-colors">Dashboard</Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Settings</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Profile Settings</h1>
            <p className="text-slate-200 mt-1">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              <p className="text-sm text-gray-500">Your basic account details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Full Name</label>
              <input type="text" defaultValue="" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700" readOnly />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Email</label>
              <input type="email" defaultValue="" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700" readOnly />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Phone</label>
              <input type="tel" defaultValue="" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Date of Birth</label>
              <input type="date" defaultValue="" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
          </div>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Current Password</label>
              <input type="password" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">New Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Confirm New Password</label>
              <input type="password" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
              <p className="text-sm text-gray-500">Choose how you want to be notified</p>
            </div>
          </div>
          <div className="space-y-5">
            {/* Email Reminders */}
            <button
              type="button"
              onClick={() => setEmailReminders(!emailReminders)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${emailReminders ? 'bg-blue-100' : 'bg-gray-200'}`}>
                  <svg className={`w-5 h-5 ${emailReminders ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Email Reminders</p>
                  <p className="text-xs text-gray-500">Receive appointment reminders via email</p>
                </div>
              </div>
              <div className={`w-14 h-8 rounded-full relative transition-colors ${emailReminders ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transition-all ${emailReminders ? 'right-1' : 'left-1'}`}>
                  {emailReminders && (
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </button>

            {/* SMS Reminders */}
            <button
              type="button"
              onClick={() => setSmsReminders(!smsReminders)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${smsReminders ? 'bg-emerald-100' : 'bg-gray-200'}`}>
                  <svg className={`w-5 h-5 ${smsReminders ? 'text-emerald-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">SMS Reminders</p>
                  <p className="text-xs text-gray-500">Receive appointment reminders via SMS</p>
                </div>
              </div>
              <div className={`w-14 h-8 rounded-full relative transition-colors ${smsReminders ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transition-all ${smsReminders ? 'right-1' : 'left-1'}`}>
                  {smsReminders && (
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 font-semibold shadow-lg shadow-teal-200 transition-all duration-200"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
