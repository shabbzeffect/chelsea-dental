'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DateRangeFilter, { getPresetDates } from '../components/DateRangeFilter';
import ExportButton from '../components/ExportButton';
import EmailModal from '../components/EmailModal';

type PresetRange = 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'thisYear' | 'custom';

interface TreatmentsReport {
  dateRange: { start: string; end: string };
  summary: {
    total: number;
    inPeriod: number;
    totalRevenue: string;
    periodRevenue: string;
    avgCost: string;
  };
  byStatus: { status: string; count: number }[];
  byType: { description: string; count: number; totalRevenue: string }[];
  byDentist: { dentistId: string; name: string; count: number; totalRevenue: string }[];
  byMonth: { month: string; count: number; totalRevenue: string }[];
  topTeeth: { tooth: number; count: number }[];
}

const statusColors: Record<string, string> = {
  planned: 'bg-yellow-500',
  in_progress: 'bg-blue-500',
  completed: 'bg-green-500',
};

const statusLabels: Record<string, string> = {
  planned: 'Planned',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export default function TreatmentsReportPage() {
  const [report, setReport] = useState<TreatmentsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preset, setPreset] = useState<PresetRange>('thisMonth');
  const [startDate, setStartDate] = useState(() => getPresetDates('thisMonth').start);
  const [endDate, setEndDate] = useState(() => getPresetDates('thisMonth').end);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

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
      const params = new URLSearchParams({ startDate, endDate });
      const response = await fetch(`/api/reports/treatments?${params}`);
      if (response.status === 401) {
        setError('Please log in to view this report');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch treatments report');
      }
      const data = await response.json();
      setReport(data);
    } catch (err) {
      console.error('Failed to fetch treatments report:', err);
      setError(err instanceof Error ? err.message : 'Failed to load treatments report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
        <p className="text-gray-500">Loading treatments report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-red-500 text-4xl">!</div>
        <p className="text-gray-700 font-medium">Failed to load treatments report</p>
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={fetchReport}
          className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const summary = report.summary || { total: 0, inPeriod: 0, totalRevenue: '0', periodRevenue: '0', avgCost: '0' };
  const byStatus = report.byStatus || [];
  const byType = report.byType || [];
  const byDentist = report.byDentist || [];
  const byMonth = report.byMonth || [];
  const topTeeth = report.topTeeth || [];

  const maxByStatus = Math.max(...byStatus.map(s => s.count), 1);
  const maxByType = Math.max(...byType.map(t => t.count), 1);
  const maxByDentist = Math.max(...byDentist.map(d => d.count), 1);
  const maxByMonth = Math.max(...byMonth.map(m => m.count), 1);
  const maxByTooth = Math.max(...topTeeth.map(t => t.count), 1);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Print Header */}
      <div className="print-header">
        <h1>Treatment Report</h1>
        <p>Chelsea Dental Clinic</p>
        <p>{formatDate(report.dateRange.start)} - {formatDate(report.dateRange.end)}</p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between no-print">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/reports" className="hover:text-gray-700">Reports</Link>
            <span>/</span>
            <span>Treatment Report</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Treatment Report</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowEmailModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email
          </button>
          <ExportButton reportTitle="Treatment Report" />
          <Link
            href="/admin/reports"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
          >
            Back to Reports
          </Link>
        </div>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        reportType="treatments"
        dateRange={report.dateRange}
      />

      {/* Date Range Filter */}
      <DateRangeFilter
        preset={preset}
        startDate={startDate}
        endDate={endDate}
        dateRange={report.dateRange}
        onPresetChange={handlePresetChange}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Treatments</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{summary.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-500">In Period</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">{summary.inPeriod}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Revenue in Period</p>
          <p className="text-3xl font-bold text-green-600 mt-1">${parseFloat(summary.periodRevenue).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Avg Cost</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">${parseFloat(summary.avgCost).toFixed(0)}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">By Status</h2>
          <div className="space-y-3">
            {byStatus.map((item) => {
              const percentage = maxByStatus > 0 ? (item.count / maxByStatus) * 100 : 0;
              return (
                <div key={item.status} className="flex items-center gap-3">
                  <div className="w-24 text-sm text-gray-600">{statusLabels[item.status] || item.status}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${statusColors[item.status] || 'bg-gray-400'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-sm font-medium text-gray-900">
                    {item.count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Treatment Types */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Treatment Types</h2>
          {byType.length === 0 ? (
            <p className="text-gray-500 text-sm">No data available</p>
          ) : (
            <div className="space-y-3">
              {byType.slice(0, 5).map((item) => {
                const percentage = maxByType > 0 ? (item.count / maxByType) * 100 : 0;
                return (
                  <div key={item.description} className="flex items-center gap-3">
                    <div className="w-32 text-sm text-gray-600 truncate">{item.description}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-16 text-right text-sm font-medium text-gray-900">
                      {item.count}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Dentist */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">By Dentist</h2>
          {byDentist.length === 0 ? (
            <p className="text-gray-500 text-sm">No data available</p>
          ) : (
            <div className="space-y-3">
              {byDentist.map((item) => {
                const percentage = maxByDentist > 0 ? (item.count / maxByDentist) * 100 : 0;
                return (
                  <div key={item.dentistId} className="flex items-center gap-3">
                    <div className="w-32 text-sm text-gray-600 truncate">Dr. {item.name}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-16 text-right text-sm font-medium text-gray-900">
                      {item.count}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Teeth Treated */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Most Treated Teeth</h2>
          {topTeeth.length === 0 ? (
            <p className="text-gray-500 text-sm">No data available</p>
          ) : (
            <div className="flex items-end justify-between h-48 gap-1">
              {topTeeth.slice(0, 8).map((item) => {
                const height = maxByTooth > 0 ? (item.count / maxByTooth) * 100 : 0;
                return (
                  <div key={item.tooth} className="flex-1 flex flex-col items-center">
                    <div className="text-xs font-medium text-gray-900 mb-1">{item.count}</div>
                    <div
                      className="w-full bg-orange-500 rounded-t"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                    <div className="text-xs text-gray-500 mt-2">#{item.tooth}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h2>
        <div className="flex items-end justify-between h-48 gap-1">
          {byMonth.map((item) => {
            const height = maxByMonth > 0 ? (item.count / maxByMonth) * 100 : 0;
            const monthLabel = new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' });
            return (
              <div key={item.month} className="flex-1 flex flex-col items-center">
                <div className="text-xs font-medium text-gray-900 mb-1">{item.count}</div>
                <div
                  className="w-full bg-indigo-500 rounded-t"
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
                <div className="text-xs text-gray-500 mt-2">{monthLabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
