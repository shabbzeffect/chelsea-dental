'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  todaysAppointments: number;
  pendingPayments: number;
  totalRevenue: string;
  activeStaff: number;
  pendingInvoices: number;
  completedToday: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchUpcomingAppointments();
    fetchPendingInvoices();
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

  const fetchUpcomingAppointments = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/appointments?startDate=${today}`);
      const data = await response.json();
      setUpcomingAppointments((data.appointments || []).slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const fetchPendingInvoices = async () => {
    try {
      const response = await fetch('/api/invoices?status=pending');
      const data = await response.json();
      setPendingInvoices((data.invoices || []).slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
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
      <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg shadow-teal-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-teal-100 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/reports"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 text-sm font-medium transition-all duration-200 border border-white/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Reports
            </Link>
            <Link
              href="/admin/appointments/new"
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-teal-600 rounded-xl hover:bg-teal-50 text-sm font-medium transition-all duration-200 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <Link href="/admin/patients" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalPatients || 0}</p>
              <p className="text-xs text-blue-600 font-medium">{stats?.activePatients || 0} active</p>
            </div>
          </div>
        </Link>

        {/* Today's Appointments */}
        <Link href="/admin/appointments" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.todaysAppointments || 0}</p>
              <p className="text-xs text-purple-600 font-medium">{stats?.completedToday || 0} completed</p>
            </div>
          </div>
        </Link>

        {/* Revenue */}
        <Link href="/admin/invoices" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${parseFloat(stats?.totalRevenue || '0').toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-emerald-600 font-medium">{stats?.pendingPayments || 0} pending</p>
            </div>
          </div>
        </Link>

        {/* Active Staff */}
        <Link href="/admin/staff" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Staff</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeStaff || 0}</p>
              <p className="text-xs text-orange-600 font-medium">{stats?.pendingInvoices || 0} invoices pending</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/patients/new"
            className="flex flex-col items-center p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl hover:from-blue-100 hover:to-blue-200/50 transition-all duration-200 border border-blue-100 group"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 mt-3">New Patient</span>
          </Link>

          <Link
            href="/admin/appointments/new"
            className="flex flex-col items-center p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl hover:from-purple-100 hover:to-purple-200/50 transition-all duration-200 border border-purple-100 group"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 mt-3">New Appointment</span>
          </Link>

          <Link
            href="/admin/staff/new"
            className="flex flex-col items-center p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl hover:from-emerald-100 hover:to-emerald-200/50 transition-all duration-200 border border-emerald-100 group"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 mt-3">Add Staff</span>
          </Link>

          <Link
            href="/admin/invoices/new"
            className="flex flex-col items-center p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl hover:from-orange-100 hover:to-orange-200/50 transition-all duration-200 border border-orange-100 group"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 mt-3">Create Invoice</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Upcoming Appointments
            </h2>
            {upcomingAppointments.length > 0 && (
              <Link href="/admin/appointments" className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                View all
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex flex-col items-center justify-center text-white shadow-lg shadow-teal-200">
                      <span className="text-sm font-bold leading-none">{apt.startTime?.slice(0, 2)}</span>
                      <span className="text-xs opacity-80">{apt.startTime?.slice(3, 5)}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{apt.patient?.user?.fullName || 'Unknown Patient'}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{apt.reason || 'General Checkup'}</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                    apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                    apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{apt.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">No upcoming appointments</p>
            </div>
          )}
        </div>

        {/* Pending Invoices */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Pending Invoices
            </h2>
            {pendingInvoices.length > 0 && (
              <Link href="/admin/invoices" className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                View all
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
          {pendingInvoices.length > 0 ? (
            <div className="space-y-3">
              {pendingInvoices.map((inv) => {
                const balance = parseFloat(inv.totalAmount) - parseFloat(inv.paidAmount || '0');
                return (
                  <div key={inv.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{inv.patient?.user?.fullName || 'Unknown Patient'}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{inv.invoiceNumber} • Due {inv.dueDate || 'N/A'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">${balance.toFixed(2)}</div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        inv.status === 'overdue' ? 'bg-rose-100 text-rose-700' :
                        inv.status === 'partial' ? 'bg-orange-100 text-orange-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>{inv.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
              <p className="text-sm">No pending invoices</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
