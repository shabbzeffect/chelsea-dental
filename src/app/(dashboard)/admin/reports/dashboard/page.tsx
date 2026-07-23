'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import EmailModal from '../components/EmailModal';

interface DrillDownItem {
  id: string;
  date: string;
  time?: string;
  status?: string;
  patientName: string;
  amount?: string;
  method?: string;
  cost?: string;
  dayOfWeek?: number;
  description?: string;
}

interface DashboardData {
  dateRange: { start: string; end: string };
  patients: {
    total: number;
    newInPeriod: number;
  };
  appointments: {
    today: number;
    upcoming: number;
    inPeriod: number;
    noShows: number;
    noShowRate: string;
  };
  revenue: {
    inPeriod: string;
    pending: string;
  };
  treatments: {
    inPeriod: number;
    revenueInPeriod: string;
  };
  charts: {
    appointmentsByStatus: { status: string; count: number }[];
    appointmentsByDay: { dayOfWeek: number; count: number }[];
    revenueByDay: { date: string; total: string }[];
    topTreatments: { description: string; count: number }[];
  };
  drillDown: {
    appointmentsByStatus: DrillDownItem[];
    appointmentsByDay: DrillDownItem[];
    revenueByDay: DrillDownItem[];
    treatmentsByType: DrillDownItem[];
  };
  recentAppointments: {
    id: string;
    date: string;
    time: string;
    status: string;
    patientName: string;
  }[];
  upcomingAppointments: {
    id: string;
    date: string;
    time: string;
    status: string;
    patientName: string;
  }[];
}

type PresetRange = 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'thisYear' | 'custom';

const presetLabels: Record<PresetRange, string> = {
  thisMonth: 'This Month',
  lastMonth: 'Last Month',
  thisQuarter: 'This Quarter',
  thisYear: 'This Year',
  custom: 'Custom',
};

function getPresetDates(preset: PresetRange): { start: string; end: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  switch (preset) {
    case 'thisMonth':
      return {
        start: new Date(year, month, 1).toISOString().split('T')[0],
        end: new Date(year, month + 1, 0).toISOString().split('T')[0],
      };
    case 'lastMonth':
      return {
        start: new Date(year, month - 1, 1).toISOString().split('T')[0],
        end: new Date(year, month, 0).toISOString().split('T')[0],
      };
    case 'thisQuarter': {
      const quarterStart = Math.floor(month / 3) * 3;
      return {
        start: new Date(year, quarterStart, 1).toISOString().split('T')[0],
        end: new Date(year, quarterStart + 3, 0).toISOString().split('T')[0],
      };
    }
    case 'thisYear':
      return {
        start: new Date(year, 0, 1).toISOString().split('T')[0],
        end: new Date(year, 11, 31).toISOString().split('T')[0],
      };
    case 'custom':
      return {
        start: new Date(year, month, 1).toISOString().split('T')[0],
        end: new Date(year, month + 1, 0).toISOString().split('T')[0],
      };
  }
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-emerald-100 text-emerald-700',
  canceled: 'bg-red-100 text-red-700',
  no_show: 'bg-orange-100 text-orange-700',
};

const statusLabels: Record<string, string> = {
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  canceled: 'Canceled',
  no_show: 'No Show',
};

interface ModalData {
  title: string;
  items: DrillDownItem[];
  type: 'status' | 'day' | 'revenue' | 'treatment';
}

export default function ReportsDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preset, setPreset] = useState<PresetRange>('thisMonth');
  const [startDate, setStartDate] = useState(() => getPresetDates('thisMonth').start);
  const [endDate, setEndDate] = useState(() => getPresetDates('thisMonth').end);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, [startDate, endDate]);

  const handlePresetChange = (newPreset: PresetRange) => {
    setPreset(newPreset);
    if (newPreset !== 'custom') {
      const dates = getPresetDates(newPreset);
      setStartDate(dates.start);
      setEndDate(dates.end);
    }
  };

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ startDate, endDate });
      const response = await fetch(`/api/reports/dashboard?${params}`);
      if (response.status === 401) {
        setError('Please log in to view the dashboard');
        return;
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || 'Failed to fetch dashboard data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (title: string, items: DrillDownItem[], type: ModalData['type']) => {
    setModalData({ title, items, type });
  };

  const closeModal = () => {
    setModalData(null);
  };

  const exportToCSV = () => {
    if (!data) return;

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const statusLabelsExport: Record<string, string> = {
      scheduled: 'Scheduled',
      confirmed: 'Confirmed',
      in_progress: 'In Progress',
      completed: 'Completed',
      canceled: 'Canceled',
      no_show: 'No Show',
    };

    // Build CSV content
    const rows: string[] = [];

    // Summary section
    rows.push('DASHBOARD REPORT');
    rows.push(`Date Range,${data.dateRange.start} to ${data.dateRange.end}`);
    rows.push('');
    rows.push('SUMMARY');
    rows.push('Metric,Value');
    rows.push(`Total Patients,${data.patients.total}`);
    rows.push(`New Patients in Period,${data.patients.newInPeriod}`);
    rows.push(`Appointments Today,${data.appointments.today}`);
    rows.push(`Upcoming Appointments,${data.appointments.upcoming}`);
    rows.push(`Appointments in Period,${data.appointments.inPeriod}`);
    rows.push(`No-Shows,${data.appointments.noShows}`);
    rows.push(`No-Show Rate,${data.appointments.noShowRate}%`);
    rows.push(`Revenue in Period,$${data.revenue.inPeriod}`);
    rows.push(`Pending Payments,$${data.revenue.pending}`);
    rows.push(`Treatments in Period,${data.treatments.inPeriod}`);
    rows.push(`Treatment Revenue,$${data.treatments.revenueInPeriod}`);
    rows.push('');

    // Appointments by Status
    rows.push('APPOINTMENTS BY STATUS');
    rows.push('Status,Count');
    data.charts.appointmentsByStatus.forEach(item => {
      rows.push(`${statusLabelsExport[item.status] || item.status},${item.count}`);
    });
    rows.push('');

    // Appointments by Day
    rows.push('APPOINTMENTS BY DAY');
    rows.push('Day,Count');
    data.charts.appointmentsByDay.forEach(item => {
      rows.push(`${dayNames[item.dayOfWeek]},${item.count}`);
    });
    rows.push('');

    // Revenue by Day
    rows.push('REVENUE BY DAY');
    rows.push('Date,Amount');
    data.charts.revenueByDay.forEach(item => {
      rows.push(`${item.date},$${item.total}`);
    });
    rows.push('');

    // Top Treatments
    rows.push('TOP TREATMENTS');
    rows.push('Treatment,Count');
    data.charts.topTreatments.forEach(item => {
      rows.push(`"${item.description}",${item.count}`);
    });
    rows.push('');

    // Detailed Appointments
    rows.push('DETAILED APPOINTMENTS');
    rows.push('Patient,Date,Time,Status');
    data.drillDown.appointmentsByStatus.forEach(item => {
      rows.push(`"${item.patientName}",${item.date},${item.time || ''},${statusLabelsExport[item.status || ''] || item.status || ''}`);
    });
    rows.push('');

    // Detailed Revenue
    rows.push('DETAILED REVENUE');
    rows.push('Patient,Date,Amount,Method');
    data.drillDown.revenueByDay.forEach(item => {
      rows.push(`"${item.patientName}",${item.date},$${item.amount || '0'},${item.method || ''}`);
    });
    rows.push('');

    // Detailed Treatments
    rows.push('DETAILED TREATMENTS');
    rows.push('Patient,Date,Description,Cost');
    data.drillDown.treatmentsByType.forEach(item => {
      rows.push(`"${item.patientName}",${item.date},"${item.description || ''}",$${item.cost || '0'}`);
    });

    // Create and download CSV file
    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dashboard-report-${data.dateRange.start}-to-${data.dateRange.end}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !data) {
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

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-gray-700 font-medium text-lg">Failed to load dashboard</p>
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={fetchDashboard}
          className="mt-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 text-sm font-medium shadow-lg shadow-teal-200 transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) {
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

  const patients = data.patients || { total: 0, newInPeriod: 0 };
  const appointments = data.appointments || { today: 0, upcoming: 0, inPeriod: 0, noShows: 0, noShowRate: '0' };
  const revenue = data.revenue || { inPeriod: '0', pending: '0' };
  const treatments = data.treatments || { inPeriod: 0, revenueInPeriod: '0' };
  const charts = data.charts || { appointmentsByStatus: [], appointmentsByDay: [], revenueByDay: [], topTreatments: [] };
  const drillDown = data.drillDown || { appointmentsByStatus: [], appointmentsByDay: [], revenueByDay: [], treatmentsByType: [] };
  const recentAppointments = data.recentAppointments || [];
  const upcomingAppointments = data.upcomingAppointments || [];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const chartStatusColors: Record<string, string> = {
    scheduled: 'bg-blue-500',
    confirmed: 'bg-green-500',
    in_progress: 'bg-yellow-500',
    completed: 'bg-emerald-500',
    canceled: 'bg-red-500',
    no_show: 'bg-orange-500',
  };

  const maxAppointmentsByDay = Math.max(...charts.appointmentsByDay.map(d => d.count), 1);
  const maxRevenueByDay = Math.max(...charts.revenueByDay.map(d => parseFloat(d.total) || 0), 1);
  const maxTopTreatments = Math.max(...charts.topTreatments.map(t => t.count), 1);
  const totalByStatus = charts.appointmentsByStatus.reduce((sum, s) => sum + s.count, 0);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleStatusClick = (status: string) => {
    const items = drillDown.appointmentsByStatus.filter(item => item.status === status);
    openModal(`${statusLabels[status] || status} Appointments`, items, 'status');
  };

  const handleDayClick = (dayOfWeek: number) => {
    const items = drillDown.appointmentsByDay.filter(item => item.dayOfWeek === dayOfWeek);
    openModal(`Appointments on ${dayNames[dayOfWeek]}`, items, 'day');
  };

  const handleRevenueClick = (date: string) => {
    const items = drillDown.revenueByDay.filter(item => item.date === date);
    openModal(`Revenue on ${formatDate(date)}`, items, 'revenue');
  };

  const handleTreatmentClick = (description: string) => {
    const items = drillDown.treatmentsByType.filter(item => item.description === description);
    openModal(`${description}`, items, 'treatment');
  };

  return (
    <div className="space-y-6">
      {/* Print Header */}
      <div className="print-header hidden">
        <h1>Reports Dashboard</h1>
        <p>Chelsea Dental Clinic</p>
        <p>{formatDate(data.dateRange.start)} - {formatDate(data.dateRange.end)}</p>
      </div>

      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-500 to-green-500 rounded-2xl p-6 text-white shadow-lg shadow-teal-200 no-print">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-teal-100 mb-2">
              <Link href="/admin/reports" className="hover:text-white transition-colors">Reports</Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Reports Dashboard</h1>
            <p className="text-teal-100 mt-1">
              {formatDate(data.dateRange.start)} - {formatDate(data.dateRange.end)}
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
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 text-sm font-medium transition-all duration-200 border border-white/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-teal-600 rounded-xl hover:bg-teal-50 text-sm font-medium transition-all duration-200 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {data && (
        <EmailModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          reportType="dashboard"
          dateRange={data.dateRange}
        />
      )}

      {/* Date Range Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 no-print">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">Date Range:</span>
          </div>

          <div className="flex gap-1">
            {(['thisMonth', 'lastMonth', 'thisQuarter', 'thisYear', 'custom'] as PresetRange[]).map((p) => (
              <button
                key={p}
                onClick={() => handlePresetChange(p)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  preset === p
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {presetLabels[p]}
              </button>
            ))}
          </div>

          {preset === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
              />
            </div>
          )}

          <div className="ml-auto text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
            {formatDate(data.dateRange.start)} - {formatDate(data.dateRange.end)}
          </div>
        </div>
      </div>

      {loading && data && (
        <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50 no-print">
          <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/reports/patient" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Patients</p>
              <p className="text-2xl font-bold text-gray-900">{patients.total}</p>
              <p className="text-xs text-emerald-600 font-medium">+{patients.newInPeriod} new</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/reports/appointments" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{appointments.inPeriod}</p>
              <p className="text-xs text-purple-600 font-medium">{appointments.today} today</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/reports/revenue" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${parseFloat(revenue.inPeriod).toLocaleString()}</p>
              <p className="text-xs text-amber-600 font-medium">${parseFloat(revenue.pending).toLocaleString()} pending</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/reports/treatments" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Treatments</p>
              <p className="text-2xl font-bold text-gray-900">{treatments.inPeriod}</p>
              <p className="text-xs text-orange-600 font-medium">${parseFloat(treatments.revenueInPeriod).toLocaleString()}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-200 p-5 text-white">
          <p className="text-xs font-medium text-blue-100 uppercase tracking-wide">Appointments in Period</p>
          <p className="text-2xl font-bold mt-1">{appointments.inPeriod}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg shadow-amber-200 p-5 text-white">
          <p className="text-xs font-medium text-amber-100 uppercase tracking-wide">No-Show Rate</p>
          <p className="text-2xl font-bold mt-1">{appointments.noShowRate}%</p>
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-red-500 rounded-2xl shadow-lg shadow-rose-200 p-5 text-white">
          <p className="text-xs font-medium text-rose-100 uppercase tracking-wide">No-Shows in Period</p>
          <p className="text-2xl font-bold mt-1">{appointments.noShows}</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments by Status - Clickable */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            Appointments by Status
          </h2>
          <p className="text-xs text-gray-400 mb-3">Click on a bar to see details</p>
          {charts.appointmentsByStatus.length === 0 ? (
            <p className="text-gray-500 text-sm">No data available</p>
          ) : (
            <div className="space-y-3">
              {charts.appointmentsByStatus.map((item) => {
                const percentage = totalByStatus > 0 ? (item.count / totalByStatus) * 100 : 0;
                return (
                  <button
                    key={item.status}
                    onClick={() => handleStatusClick(item.status)}
                    className="w-full group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-600">{statusLabels[item.status] || item.status}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${chartStatusColors[item.status] || 'bg-gray-400'} transition-all duration-500 ease-out group-hover:opacity-80`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Appointments by Day - Clickable */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Appointments by Day
          </h2>
          <p className="text-xs text-gray-400 mb-3">Click on a bar to see details</p>
          <div className="flex items-end justify-between h-48 gap-2">
            {[1, 2, 3, 4, 5, 6, 0].map((day) => {
              const dayData = charts.appointmentsByDay.find(d => d.dayOfWeek === day);
              const count = dayData?.count || 0;
              const height = maxAppointmentsByDay > 0 ? (count / maxAppointmentsByDay) * 100 : 0;
              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className="flex-1 flex flex-col items-center group"
                >
                  <div className="text-xs font-semibold text-gray-900 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{count}</div>
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-500"
                    style={{ height: `${Math.max(height, 8)}%` }}
                  />
                  <div className="text-xs text-gray-500 mt-2 font-medium">{dayNames[day]}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend - Clickable */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            Revenue Trend
          </h2>
          <p className="text-xs text-gray-400 mb-3">Click on a bar to see details</p>
          {charts.revenueByDay.length === 0 ? (
            <p className="text-gray-500 text-sm">No revenue data</p>
          ) : (
            <div className="flex items-end justify-between h-48 gap-1">
              {charts.revenueByDay.slice(-14).map((item) => {
                const revenueVal = parseFloat(item.total) || 0;
                const height = maxRevenueByDay > 0 ? (revenueVal / maxRevenueByDay) * 100 : 0;
                const dayLabel = new Date(item.date).toLocaleDateString('en-US', { day: 'numeric' });
                return (
                  <button
                    key={item.date}
                    onClick={() => handleRevenueClick(item.date)}
                    className="flex-1 flex flex-col items-center group"
                  >
                    <div className="text-xs font-semibold text-gray-900 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">${(revenueVal / 1000).toFixed(1)}k</div>
                    <div
                      className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-300 group-hover:from-emerald-600 group-hover:to-emerald-500"
                      style={{ height: `${Math.max(height, 8)}%` }}
                    />
                    <div className="text-xs text-gray-500 mt-2 font-medium">{dayLabel}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Treatments - Clickable */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Top Treatments
          </h2>
          <p className="text-xs text-gray-400 mb-3">Click on a bar to see details</p>
          {charts.topTreatments.length === 0 ? (
            <p className="text-gray-500 text-sm">No treatment data</p>
          ) : (
            <div className="space-y-3">
              {charts.topTreatments.map((item) => {
                const percentage = maxTopTreatments > 0 ? (item.count / maxTopTreatments) * 100 : 0;
                return (
                  <button
                    key={item.description}
                    onClick={() => handleTreatmentClick(item.description)}
                    className="w-full group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-600 truncate">{item.description}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500 ease-out group-hover:opacity-80"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Appointments Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Upcoming Appointments
            </h2>
            <Link href="/admin/appointments" className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
              View all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {upcomingAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex flex-col items-center justify-center text-white shadow-lg shadow-purple-200">
                      <span className="text-sm font-bold leading-none">{apt.time?.slice(0, 2)}</span>
                      <span className="text-xs opacity-80">{apt.time?.slice(3, 5)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{apt.patientName}</p>
                      <p className="text-sm text-gray-500">{new Date(apt.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusColors[apt.status] || 'bg-gray-100 text-gray-700'}`}>
                    {statusLabels[apt.status] || apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Recent Appointments
            </h2>
            <Link href="/admin/appointments" className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
              View all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {recentAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No recent appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex flex-col items-center justify-center text-white shadow-lg shadow-blue-200">
                      <span className="text-sm font-bold leading-none">{apt.time?.slice(0, 2)}</span>
                      <span className="text-xs opacity-80">{apt.time?.slice(3, 5)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{apt.patientName}</p>
                      <p className="text-sm text-gray-500">{new Date(apt.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusColors[apt.status] || 'bg-gray-100 text-gray-700'}`}>
                    {statusLabels[apt.status] || apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drill-Down Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 no-print">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">{modalData.title}</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[60vh]">
              {modalData.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">No items found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-3 font-medium">Patient</th>
                      <th className="pb-3 font-medium">Date</th>
                      {modalData.type === 'status' && <th className="pb-3 font-medium">Time</th>}
                      {modalData.type === 'status' && <th className="pb-3 font-medium">Status</th>}
                      {modalData.type === 'revenue' && <th className="pb-3 font-medium">Amount</th>}
                      {modalData.type === 'revenue' && <th className="pb-3 font-medium">Method</th>}
                      {modalData.type === 'treatment' && <th className="pb-3 font-medium">Cost</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {modalData.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="py-3 text-sm text-gray-900">{item.patientName}</td>
                        <td className="py-3 text-sm text-gray-600">{formatDate(item.date)}</td>
                        {modalData.type === 'status' && (
                          <td className="py-3 text-sm text-gray-600">{item.time}</td>
                        )}
                        {modalData.type === 'status' && (
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status || ''] || 'bg-gray-100 text-gray-700'}`}>
                              {statusLabels[item.status || ''] || item.status}
                            </span>
                          </td>
                        )}
                        {modalData.type === 'revenue' && (
                          <td className="py-3 text-sm font-medium text-green-600">${parseFloat(item.amount || '0').toLocaleString()}</td>
                        )}
                        {modalData.type === 'revenue' && (
                          <td className="py-3 text-sm text-gray-600 capitalize">{item.method}</td>
                        )}
                        {modalData.type === 'treatment' && (
                          <td className="py-3 text-sm font-medium text-gray-900">${parseFloat(item.cost || '0').toLocaleString()}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-500">{modalData.items.length} items total</p>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 text-sm font-medium shadow-lg shadow-teal-200 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
