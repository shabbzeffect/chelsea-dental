'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DateRangeFilter, { getPresetDates } from '../components/DateRangeFilter';
import ExportButton from '../components/ExportButton';
import EmailModal from '../components/EmailModal';

type PresetRange = 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'thisYear' | 'custom';

interface AppointmentsReport {
  dateRange: { start: string; end: string };
  selectedDentist: string;
  selectedPatient: string;
  dentists: { id: string; name: string }[];
  patients: { id: string; name: string }[];
  summary: {
    total: number;
    completed: number;
    canceled: number;
    noShow: number;
  };
  byStatus: { status: string; count: number }[];
  byDayOfWeek: { dayOfWeek: number; count: number }[];
  byHour: { hour: number; count: number }[];
  byDentist: { dentistId: string; name: string; count: number }[];
  byMonth: { month: string; count: number }[];
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-500',
  confirmed: 'bg-emerald-500',
  in_progress: 'bg-amber-500',
  completed: 'bg-teal-500',
  canceled: 'bg-rose-500',
  no_show: 'bg-orange-500',
};

const statusLabels: Record<string, string> = {
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  canceled: 'Canceled',
  no_show: 'No Show',
};

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AppointmentsReportPage() {
  const [report, setReport] = useState<AppointmentsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preset, setPreset] = useState<PresetRange>('thisMonth');
  const [startDate, setStartDate] = useState(() => getPresetDates('thisMonth').start);
  const [endDate, setEndDate] = useState(() => getPresetDates('thisMonth').end);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState('all');

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate, selectedDentist, selectedPatient]);

  const handlePresetChange = (newPreset: PresetRange) => {
    setPreset(newPreset);
    if (newPreset !== 'custom') {
      const dates = getPresetDates(newPreset);
      setStartDate(dates.start);
      setEndDate(dates.end);
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ 
        startDate, 
        endDate, 
        dentistId: selectedDentist,
        patientId: selectedPatient
      });
      const response = await fetch(`/api/reports/appointments?${params}`);
      if (response.status === 401) {
        setError('Please log in to view this report');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch appointments report');
      }
      const data = await response.json();
      setReport(data);
    } catch (err) {
      console.error('Failed to fetch appointments report:', err);
      setError(err instanceof Error ? err.message : 'Failed to load appointments report');
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
        <p className="text-gray-500 font-medium">Loading appointments report...</p>
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
        <p className="text-gray-700 font-medium text-lg">Failed to load appointments report</p>
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={fetchReport}
          className="mt-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 text-sm font-medium shadow-lg shadow-teal-200 transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
          </div>
        <p className="text-gray-500 font-medium">No data available</p>
      </div>
    );
  }

  const summary = report.summary || { total: 0, completed: 0, canceled: 0, noShow: 0 };
  const byStatus = report.byStatus || [];
  const byDayOfWeek = report.byDayOfWeek || [];
  const byHour = report.byHour || [];
  const byDentist = report.byDentist || [];
  const byMonth = report.byMonth || [];

  const maxByStatus = Math.max(...byStatus.map(s => s.count), 1);
  const maxByDay = Math.max(...byDayOfWeek.map(d => d.count), 1);
  const maxByHour = Math.max(...byHour.map(h => h.count), 1);
  const maxByDentist = Math.max(...byDentist.map(d => d.count), 1);
  const maxByMonth = Math.max(...byMonth.map(m => m.count), 1);

  const noShowRate = summary.total > 0 ? ((summary.noShow / summary.total) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Print Header */}
      <div className="print-header hidden">
        <h1>Appointment Report</h1>
        <p>Chelsea Dental Clinic</p>
        <p>{new Date(report.dateRange.start).toLocaleDateString()} - {new Date(report.dateRange.end).toLocaleDateString()}</p>
      </div>

      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg shadow-teal-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-teal-100 mb-2">
              <Link href="/admin/reports" className="hover:text-white transition-colors">Reports</Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Appointment Report</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Appointment Report</h1>
            <p className="text-teal-100 mt-1">
              {new Date(report.dateRange.start).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              {' - '}
              {new Date(report.dateRange.end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowEmailModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 text-sm font-medium transition-all duration-200 border border-white/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </button>
            <ExportButton reportTitle="Appointment Report" className="!bg-white/20 !text-white !border-white/20 hover:!bg-white/30 backdrop-blur-sm" />
          </div>
        </div>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        reportType="appointments"
        dateRange={report.dateRange}
      />

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Date Range Filter */}
          <div className="lg:col-span-2">
            <DateRangeFilter
              preset={preset}
              startDate={startDate}
              endDate={endDate}
              dateRange={report.dateRange}
              onPresetChange={handlePresetChange}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>

          {/* Dentist Filter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium">Dentist:</span>
            </div>
            <select
              value={selectedDentist}
              onChange={(e) => setSelectedDentist(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
            >
              <option value="all">All Dentists</option>
              {report.dentists?.map((dentist) => (
                <option key={dentist.id} value={dentist.id}>
                  {dentist.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Patient Filter */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium">Patient:</span>
          </div>
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="flex-1 md:w-64 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
          >
            <option value="all">All Patients</option>
            {report.patients?.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Completed</p>
              <p className="text-2xl font-bold text-emerald-600">{summary.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Canceled</p>
              <p className="text-2xl font-bold text-rose-600">{summary.canceled}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">No Show</p>
              <p className="text-2xl font-bold text-orange-600">{summary.noShow}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg shadow-purple-200 p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-purple-100 uppercase tracking-wide">No-Show Rate</p>
              <p className="text-2xl font-bold">{noShowRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            Appointments by Status
          </h2>
          <div className="space-y-3">
            {byStatus.map((item) => {
              const percentage = maxByStatus > 0 ? (item.count / maxByStatus) * 100 : 0;
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
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            By Day of Week
          </h2>
          <div className="flex items-end justify-between h-48 gap-2">
            {[1, 2, 3, 4, 5, 6, 0].map((day) => {
              const dayData = byDayOfWeek.find(d => d.dayOfWeek === day);
              const count = dayData?.count || 0;
              const height = maxByDay > 0 ? (count / maxByDay) * 100 : 0;
              return (
                <div key={day} className="flex-1 flex flex-col items-center group">
                  <div className="text-xs font-semibold text-gray-900 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{count}</div>
                  <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-500" style={{ height: `${Math.max(height, 8)}%` }} />
                  <div className="text-xs text-gray-500 mt-2 font-medium">{dayNames[day]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts Grid 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Hour */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
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
                  <div className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-300 group-hover:from-emerald-600 group-hover:to-emerald-500" style={{ height: `${Math.max(height, 8)}%` }} />
                  <div className="text-xs text-gray-500 mt-2 font-medium">{hour}:00</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Dentist */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
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
                const percentage = maxByDentist > 0 ? (item.count / maxByDentist) * 100 : 0;
                return (
                  <div key={item.dentistId} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-purple-600">{item.name.charAt(0)}</span>
                        </div>
                        {item.name}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500 ease-out"
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

      {/* Monthly Trend */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          Monthly Trend
        </h2>
        <div className="flex items-end justify-between h-56 gap-2">
          {byMonth.map((item) => {
            const height = maxByMonth > 0 ? (item.count / maxByMonth) * 100 : 0;
            const monthLabel = new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' });
            return (
              <div key={item.month} className="flex-1 flex flex-col items-center group">
                <div className="text-xs font-semibold text-gray-900 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{item.count}</div>
                <div className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg transition-all duration-300 group-hover:from-indigo-600 group-hover:to-indigo-500" style={{ height: `${Math.max(height, 8)}%` }} />
                <div className="text-xs text-gray-500 mt-2 font-medium">{monthLabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}