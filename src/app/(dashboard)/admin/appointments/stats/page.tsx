'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AppointmentStats {
  period: { start: string; end: string };
  summary: {
    total: number;
    today: number;
    upcoming: number;
    revenue: string;
    pendingPayments: string;
  };
  byStatus: { status: string; count: number }[];
  byDay: { dayOfWeek: number; count: number }[];
  byDentist: { dentistId: string; name: string; count: number }[];
  byHour: { hour: number; count: number }[];
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-500',
  confirmed: 'bg-green-500',
  in_progress: 'bg-yellow-500',
  completed: 'bg-emerald-500',
  canceled: 'bg-red-500',
  no_show: 'bg-orange-500',
};

const statusLabels: Record<string, string> = {
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  canceled: 'Cancelled',
  no_show: 'No Show',
};

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AppointmentStatsPage() {
  const [stats, setStats] = useState<AppointmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      let start: Date;

      switch (dateRange) {
        case 'quarter':
          start = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          break;
        case 'year':
          start = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          start = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const response = await fetch(
        `/api/appointments/stats?startDate=${start.toISOString().split('T')[0]}&endDate=${end.toISOString().split('T')[0]}`
      );
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-500 font-medium">Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-gray-700 font-medium text-lg">Failed to load statistics</p>
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 text-sm font-medium shadow-lg shadow-indigo-200 transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">No data available</p>
      </div>
    );
  }

  const period = stats.period || { start: new Date().toISOString(), end: new Date().toISOString() };
  const summary = stats.summary || { total: 0, today: 0, upcoming: 0, revenue: '0', pendingPayments: '0' };
  const byDay = stats.byDay || [];
  const byHour = stats.byHour || [];
  const byDentist = stats.byDentist || [];
  const byStatus = stats.byStatus || [];

  const maxByDay = Math.max(...byDay.map(d => d.count), 1);
  const maxByHour = Math.max(...byHour.map(h => h.count), 1);
  const maxByDentist = Math.max(...byDentist.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-indigo-100 mb-2">
              <Link href="/admin" className="hover:text-white transition-colors">Dashboard</Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/admin/appointments" className="hover:text-white transition-colors">Appointments</Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Statistics</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Appointment Statistics</h1>
            <p className="text-indigo-100 mt-1">
              {new Date(period.start).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              {' - '}
              {new Date(period.end).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            {(['month', 'quarter', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  dateRange === range
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Today</p>
              <p className="text-2xl font-bold text-blue-600">{summary.today}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Upcoming</p>
              <p className="text-2xl font-bold text-emerald-600">{summary.upcoming}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${parseFloat(summary.revenue).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</p>
              <p className="text-2xl font-bold text-amber-600">
                ${parseFloat(summary.pendingPayments).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            By Status
          </h2>
          <div className="space-y-3">
            {byStatus.map((item) => {
              const percentage = summary.total > 0
                ? (item.count / summary.total) * 100
                : 0;
              return (
                <div key={item.status} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-600">{statusLabels[item.status] || item.status}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${statusColors[item.status] || 'bg-gray-400'} transition-all duration-500 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Day of Week */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            By Day of Week
          </h2>
          <div className="flex items-end justify-between h-48 gap-2">
            {[1, 2, 3, 4, 5, 6, 0].map((day) => {
              const dayData = byDay.find(d => d.dayOfWeek === day);
              const count = dayData?.count || 0;
              const height = maxByDay > 0 ? (count / maxByDay) * 100 : 0;
              return (
                <div key={day} className="flex-1 flex flex-col items-center group">
                  <div className="text-xs font-semibold text-gray-900 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{count}</div>
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-300 group-hover:from-purple-600 group-hover:to-purple-500"
                    style={{ height: `${Math.max(height, 8)}%` }}
                  />
                  <div className="text-xs text-gray-500 mt-2 font-medium">{dayNames[day]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Hour */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            By Hour of Day
          </h2>
          <div className="flex items-end justify-between h-48 gap-1">
            {Array.from({ length: 10 }, (_, i) => i + 8).map((hour) => {
              const hourData = byHour.find(h => h.hour === hour);
              const count = hourData?.count || 0;
              const height = maxByHour > 0 ? (count / maxByHour) * 100 : 0;
              return (
                <div key={hour} className="flex-1 flex flex-col items-center group">
                  <div className="text-xs font-semibold text-gray-900 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{count}</div>
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-500"
                    style={{ height: `${Math.max(height, 8)}%` }}
                  />
                  <div className="text-xs text-gray-500 mt-2 font-medium">{hour}:00</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Dentist */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            By Dentist
          </h2>
          {byDentist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-sm">No dentist data</p>
            </div>
          ) : (
            <div className="space-y-3">
              {byDentist.map((item) => {
                const percentage = maxByDentist > 0
                  ? (item.count / maxByDentist) * 100
                  : 0;
                return (
                  <div key={item.dentistId} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-teal-600">{item.name.charAt(0)}</span>
                        </div>
                        Dr. {item.name}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/appointments"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 text-sm font-medium shadow-lg shadow-indigo-200 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            View All Appointments
          </Link>
          <Link
            href="/admin/appointments/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-sm font-medium transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Appointment
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-sm font-medium transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
