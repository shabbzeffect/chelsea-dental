'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PatientDashboard {
  upcomingAppointments: any[];
  recentTreatments: any[];
  outstandingBalance: string;
}

export default function PatientDashboard() {
  const [stats, setStats] = useState<PatientDashboard | null>(null);
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
          <div className="w-12 h-12 border-4 border-teal-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-teal-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-500 to-green-500 rounded-2xl p-6 text-white shadow-lg shadow-teal-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">My Dashboard</h1>
            <p className="text-teal-100 mt-1">
              Welcome back! Here's an overview of your dental care.
            </p>
          </div>
          <Link
            href="/patient/appointments/new"
            className="flex items-center gap-2 px-5 py-3 bg-white text-teal-600 rounded-xl hover:bg-teal-50 text-sm font-semibold transition-all duration-200 shadow-lg self-start"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Upcoming</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.upcomingAppointments?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Treatments</p>
              <p className="text-2xl font-bold text-purple-600">{stats?.recentTreatments?.length || 0}</p>
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
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Balance</p>
              <p className="text-2xl font-bold text-amber-600">
                ${parseFloat(stats?.outstandingBalance || '0').toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/patient/appointments"
            className="flex flex-col items-center p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl hover:from-blue-100 hover:to-blue-200/50 transition-all duration-200 border border-blue-100 group"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 mt-3">My Appointments</span>
          </Link>

          <Link
            href="/patient/treatments"
            className="flex flex-col items-center p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl hover:from-purple-100 hover:to-purple-200/50 transition-all duration-200 border border-purple-100 group"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 mt-3">Treatment History</span>
          </Link>

          <Link
            href="/patient/invoices"
            className="flex flex-col items-center p-5 bg-gradient-to-br from-amber-50 to-orange-100/50 rounded-xl hover:from-amber-100 hover:to-orange-200/50 transition-all duration-200 border border-amber-100 group"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 mt-3">My Invoices</span>
          </Link>

          <Link
            href="/patient/settings"
            className="flex flex-col items-center p-5 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl hover:from-gray-100 hover:to-gray-200/50 transition-all duration-200 border border-gray-100 group"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 mt-3">Account Settings</span>
          </Link>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Upcoming Appointments
          </h2>
          {stats?.upcomingAppointments && stats.upcomingAppointments.length > 0 && (
            <Link href="/patient/appointments" className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
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
                    <span className="text-xs font-bold leading-none">
                      {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {new Date(appointment.appointmentDate).getDate()}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {appointment.reason || 'Appointment'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.startTime?.slice(0, 5)} • {appointment.dentist?.user?.fullName ? `Dr. ${appointment.dentist.user.fullName}` : 'Dentist TBD'}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                    appointment.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm mb-3">No upcoming appointments</p>
            <Link
              href="/patient/appointments/new"
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 text-sm font-medium shadow-lg shadow-teal-200 transition-all duration-200"
            >
              Book Your First Appointment
            </Link>
          </div>
        )}
      </div>

      {/* Recent Treatments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Recent Treatments
          </h2>
        </div>
        {stats?.recentTreatments && stats.recentTreatments.length > 0 ? (
          <div className="space-y-3">
            {stats.recentTreatments.map((treatment) => (
              <div
                key={treatment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{treatment.description}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(treatment.treatmentDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      {treatment.dentist?.user?.fullName && ` • Dr. ${treatment.dentist.user.fullName}`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {treatment.actualCost && (
                    <div className="font-semibold text-gray-900">
                      ${parseFloat(treatment.actualCost).toFixed(2)}
                    </div>
                  )}
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      treatment.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {treatment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">No treatment history yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
