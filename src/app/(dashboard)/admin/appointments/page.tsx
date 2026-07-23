'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [startDate, endDate, statusFilter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      if (statusFilter) params.set('status', statusFilter);
      const response = await fetch(`/api/appointments?${params}`);
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('');
  };

  const hasFilters = startDate || endDate || statusFilter;

  const statusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'canceled': return 'bg-rose-100 text-rose-700';
      case 'no_show': return 'bg-orange-100 text-orange-700';
      case 'in_progress': return 'bg-amber-100 text-amber-700';
      case 'scheduled': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return 'M5 13l4 4L19 7';
      case 'completed': return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'canceled': return 'M6 18L18 6M6 6l12 12';
      case 'no_show': return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'in_progress': return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'scheduled': return 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z';
      default: return 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayCount = appointments.filter(a => a.appointmentDate === today).length;
  const upcomingCount = appointments.filter(a => a.appointmentDate > today).length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg shadow-purple-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-purple-100 mb-2">
              <Link href="/admin" className="hover:text-white transition-colors">Dashboard</Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Appointments</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Appointment Management</h1>
            <p className="text-purple-100 mt-1">{appointments.length} total appointments</p>
          </div>
          <Link
            href="/admin/appointments/new"
            className="flex items-center gap-2 px-5 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 text-sm font-semibold transition-all duration-200 shadow-lg self-start"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Appointment
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
              <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
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
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Today</p>
              <p className="text-2xl font-bold text-blue-600">{todayCount}</p>
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
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Completed</p>
              <p className="text-2xl font-bold text-emerald-600">{completedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Upcoming</p>
              <p className="text-2xl font-bold text-orange-600">{upcomingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-44">
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">From Date</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-sm"
            />
          </div>
          <div className="w-full md:w-44">
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">To Date</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-sm"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Status</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-sm"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
              <option value="no_show">No Show</option>
            </select>
          </div>
          {hasFilters && (
            <button 
              onClick={clearFilters} 
              className="px-4 py-3 text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative">
              <div className="w-10 h-10 border-4 border-purple-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-10 h-10 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500 font-medium">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium text-lg mb-2">No appointments found</p>
            <p className="text-gray-500 text-sm mb-4">{hasFilters ? 'Try adjusting your filters' : 'Get started by scheduling an appointment'}</p>
            {!hasFilters && (
              <Link 
                href="/admin/appointments/new" 
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 text-sm font-medium shadow-lg shadow-purple-200 transition-all duration-200"
              >
                Schedule an Appointment
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dentist</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex flex-col items-center justify-center text-white shadow-sm">
                          <span className="text-xs font-bold leading-none">{apt.appointmentDate?.slice(5, 7)}</span>
                          <span className="text-lg font-bold leading-none">{apt.appointmentDate?.slice(8, 10)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{formatDate(apt.appointmentDate)}</p>
                          <p className="text-xs text-gray-500">{apt.startTime?.slice(0, 5)} - {apt.endTime?.slice(0, 5)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                          {(apt.patient?.user?.fullName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{apt.patient?.user?.fullName || 'Unknown Patient'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                          {(apt.dentist?.user?.fullName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-600">{apt.dentist?.user?.fullName || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">{apt.reason || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full ${statusColor(apt.status)}`}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={statusIcon(apt.status)} />
                        </svg>
                        {apt.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/appointments/${apt.id}`} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
