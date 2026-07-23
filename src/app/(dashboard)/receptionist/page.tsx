'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ReceptionistDashboard {
  todaysCheckins: number;
  pendingPayments: number;
  upcomingAppointments: any[];
}

export default function ReceptionistDashboard() {
  const [stats, setStats] = useState<ReceptionistDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Receptionist Dashboard</h1>
            <p className="text-blue-100 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Link
            href="/receptionist/check-in"
            className="flex items-center gap-2 px-5 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 text-sm font-semibold transition-all duration-200 shadow-lg self-start"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Check-in Patient
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Today's Check-ins</p>
              <p className="text-2xl font-bold text-emerald-600">{stats?.todaysCheckins || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending Payments</p>
              <p className="text-2xl font-bold text-amber-600">{stats?.pendingPayments || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Today's Appointments</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.upcomingAppointments?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/receptionist/check-in"
            className="flex flex-col items-center p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl hover:from-emerald-100 hover:to-emerald-200/50 transition-all duration-200 border border-emerald-100 group"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 mt-3">Check-in Patient</span>
          </Link>

          <Link
            href="/receptionist/appointments"
            className="flex flex-col items-center p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl hover:from-blue-100 hover:to-blue-200/50 transition-all duration-200 border border-blue-100 group"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 mt-3">Appointments</span>
          </Link>

          <Link
            href="/receptionist/patients"
            className="flex flex-col items-center p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl hover:from-purple-100 hover:to-purple-200/50 transition-all duration-200 border border-purple-100 group"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 mt-3">Patients</span>
          </Link>

          <Link
            href="/receptionist/billing"
            className="flex flex-col items-center p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl hover:from-orange-100 hover:to-orange-200/50 transition-all duration-200 border border-orange-100 group"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 mt-3">Billing</span>
          </Link>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Today's Appointments
          </h2>
          {stats?.upcomingAppointments && stats.upcomingAppointments.length > 0 && (
            <Link href="/receptionist/appointments" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
        {stats?.upcomingAppointments && stats.upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {stats.upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex flex-col items-center justify-center text-white shadow-lg shadow-blue-200">
                    <span className="text-sm font-bold leading-none">{appointment.startTime?.slice(0, 2)}</span>
                    <span className="text-xs opacity-80">{appointment.startTime?.slice(3, 5)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {appointment.patient?.user?.fullName || 'Unknown Patient'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Dr. {appointment.dentist?.user?.fullName || 'Unassigned'}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                    appointment.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : appointment.status === 'in_progress'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {appointment.status?.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No appointments scheduled for today</p>
          </div>
        )}
      </div>
    </div>
  );
}
