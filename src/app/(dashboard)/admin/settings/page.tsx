'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Settings {
  emailNotifications: boolean;
  autoConfirmAppointments: boolean;
  smsNotifications: boolean;
  darkMode: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    emailNotifications: true,
    autoConfirmAppointments: false,
    smsNotifications: false,
    darkMode: false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings(data.settings);
          // Apply dark mode immediately
          if (data.settings.darkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        // Save to localStorage for immediate effect
        localStorage.setItem('clinic-settings', JSON.stringify(settings));
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleSetting = (key: keyof Settings) => {
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));
    
    // Apply dark mode immediately
    if (key === 'darkMode') {
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 rounded-2xl p-6 text-white shadow-lg shadow-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-200 mb-2">
              <Link href="/admin" className="hover:text-white transition-colors">Dashboard</Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Settings</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Clinic Settings</h1>
            <p className="text-slate-200 mt-1">Manage your clinic information and preferences</p>
          </div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-3 bg-white text-slate-700 rounded-xl hover:bg-slate-50 text-sm font-semibold transition-all duration-200 shadow-lg disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                Saving...
              </>
            ) : saved ? (
              <>
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Clinic Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Clinic Information</h2>
            <p className="text-sm text-gray-500">Basic information about your dental practice</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Clinic Name</label>
            <input 
              type="text" 
              defaultValue="Chelsea Dental Clinic" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              readOnly 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Phone</label>
            <input 
              type="text" 
              defaultValue="+44 20 1234 5678" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              readOnly 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Address</label>
            <input 
              type="text" 
              defaultValue="123 Dental Avenue, Chelsea, London SW3 6NY" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              readOnly 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Email</label>
            <input 
              type="text" 
              defaultValue="info@chelseadental.com" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              readOnly 
            />
          </div>
        </div>
      </div>

      {/* Hours */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Operating Hours</h2>
            <p className="text-sm text-gray-500">Set your clinic's operating schedule</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Weekday Hours</label>
            <input 
              type="text" 
              defaultValue="9:00 AM - 6:00 PM" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
              readOnly 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Saturday Hours</label>
            <input 
              type="text" 
              defaultValue="9:00 AM - 2:00 PM" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
              readOnly 
            />
          </div>
        </div>
      </div>

      {/* System Preferences */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">System Preferences</h2>
            <p className="text-sm text-gray-500">Configure system behavior and notifications</p>
          </div>
        </div>
        
        <div className="space-y-5">
          {/* Email Notifications */}
          <button
            onClick={() => toggleSetting('emailNotifications')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${settings.emailNotifications ? 'bg-blue-100' : 'bg-gray-200'}`}>
                <svg className={`w-5 h-5 ${settings.emailNotifications ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Email Notifications</p>
                <p className="text-xs text-gray-500">Send appointment reminders and confirmations via email</p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full relative transition-colors ${settings.emailNotifications ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transition-all ${settings.emailNotifications ? 'right-1' : 'left-1'}`}>
                {settings.emailNotifications && (
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </button>

          {/* Auto-confirm Appointments */}
          <button
            onClick={() => toggleSetting('autoConfirmAppointments')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${settings.autoConfirmAppointments ? 'bg-purple-100' : 'bg-gray-200'}`}>
                <svg className={`w-5 h-5 ${settings.autoConfirmAppointments ? 'text-purple-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Auto-confirm Appointments</p>
                <p className="text-xs text-gray-500">Automatically confirm new appointments</p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full relative transition-colors ${settings.autoConfirmAppointments ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transition-all ${settings.autoConfirmAppointments ? 'right-1' : 'left-1'}`}>
                {settings.autoConfirmAppointments && (
                  <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </button>

          {/* SMS Notifications */}
          <button
            onClick={() => toggleSetting('smsNotifications')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${settings.smsNotifications ? 'bg-emerald-100' : 'bg-gray-200'}`}>
                <svg className={`w-5 h-5 ${settings.smsNotifications ? 'text-emerald-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">SMS Notifications</p>
                <p className="text-xs text-gray-500">Send text message reminders to patients</p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full relative transition-colors ${settings.smsNotifications ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transition-all ${settings.smsNotifications ? 'right-1' : 'left-1'}`}>
                {settings.smsNotifications && (
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </button>

          {/* Dark Mode */}
          <button
            onClick={() => toggleSetting('darkMode')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${settings.darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                <svg className={`w-5 h-5 ${settings.darkMode ? 'text-yellow-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {settings.darkMode ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  )}
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Dark Mode</p>
                <p className="text-xs text-gray-500">Switch between light and dark theme</p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full relative transition-colors ${settings.darkMode ? 'bg-gradient-to-r from-slate-600 to-slate-700' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transition-all ${settings.darkMode ? 'right-1' : 'left-1'}`}>
                {settings.darkMode && (
                  <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Danger Zone</h2>
            <p className="text-sm text-gray-500">Irreversible actions that affect your account</p>
          </div>
        </div>
        
        <div className="p-4 bg-red-50 rounded-xl border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Delete Clinic Account</p>
              <p className="text-xs text-gray-500">Permanently delete all clinic data and accounts</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium transition-colors shadow-sm">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
