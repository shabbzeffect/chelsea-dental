'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DateRangeFilter, { getPresetDates } from '../components/DateRangeFilter';
import ExportButton from '../components/ExportButton';
import EmailModal from '../components/EmailModal';

type PresetRange = 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'thisYear' | 'custom';

interface RevenueReport {
  dateRange: { start: string; end: string };
  summary: {
    totalRevenue: string;
    periodRevenue: string;
    pendingPayments: string;
    overduePayments: string;
  };
  revenueByMonth: { month: string; total: string }[];
  revenueByMethod: { method: string; total: string; count: number }[];
  revenueByDentist: { dentistId: string; name: string; total: string }[];
  invoiceStatusBreakdown: { status: string; count: number; total: string }[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  partial: 'bg-blue-500',
  paid: 'bg-green-500',
  overdue: 'bg-red-500',
  canceled: 'bg-gray-500',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  partial: 'Partial',
  paid: 'Paid',
  overdue: 'Overdue',
  canceled: 'Canceled',
};

const methodLabels: Record<string, string> = {
  cash: 'Cash',
  card: 'Card',
  check: 'Check',
  insurance: 'Insurance',
};

export default function RevenueReportPage() {
  const [report, setReport] = useState<RevenueReport | null>(null);
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
      const response = await fetch(`/api/reports/revenue?${params}`);
      if (response.status === 401) {
        setError('Please log in to view this report');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch revenue report');
      }
      const data = await response.json();
      setReport(data);
    } catch (err) {
      console.error('Failed to fetch revenue report:', err);
      setError(err instanceof Error ? err.message : 'Failed to load revenue report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        <p className="text-gray-500">Loading revenue report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-red-500 text-4xl">!</div>
        <p className="text-gray-700 font-medium">Failed to load revenue report</p>
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={fetchReport}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
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

  const summary = report.summary || { totalRevenue: '0', periodRevenue: '0', pendingPayments: '0', overduePayments: '0' };
  const revenueByMonth = report.revenueByMonth || [];
  const revenueByMethod = report.revenueByMethod || [];
  const revenueByDentist = report.revenueByDentist || [];
  const invoiceStatusBreakdown = report.invoiceStatusBreakdown || [];

  const maxMonthlyRevenue = Math.max(...revenueByMonth.map(m => parseFloat(m.total) || 0), 1);
  const maxMethodRevenue = Math.max(...revenueByMethod.map(m => parseFloat(m.total) || 0), 1);
  const maxDentistRevenue = Math.max(...revenueByDentist.map(d => parseFloat(d.total) || 0), 1);
  const totalInvoiceAmount = invoiceStatusBreakdown.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Print Header */}
      <div className="print-header">
        <h1>Revenue Report</h1>
        <p>Chelsea Dental Clinic</p>
        <p>{formatDate(report.dateRange.start)} - {formatDate(report.dateRange.end)}</p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between no-print">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/reports" className="hover:text-gray-700">Reports</Link>
            <span>/</span>
            <span>Revenue Report</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue Report</h1>
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
          <ExportButton reportTitle="Revenue Report" />
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
        reportType="revenue"
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
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">${parseFloat(summary.totalRevenue).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Revenue in Period</p>
          <p className="text-3xl font-bold text-green-600 mt-1">${parseFloat(summary.periodRevenue).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Pending</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">${parseFloat(summary.pendingPayments).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Overdue</p>
          <p className="text-3xl font-bold text-red-600 mt-1">${parseFloat(summary.overduePayments).toLocaleString()}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Month */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Month</h2>
          <div className="flex items-end justify-between h-48 gap-1">
            {revenueByMonth.map((item) => {
              const revenue = parseFloat(item.total) || 0;
              const height = maxMonthlyRevenue > 0 ? (revenue / maxMonthlyRevenue) * 100 : 0;
              const monthLabel = new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' });
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center">
                  <div className="text-xs font-medium text-gray-900 mb-1">${(revenue / 1000).toFixed(1)}k</div>
                  <div
                    className="w-full bg-green-500 rounded-t"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <div className="text-xs text-gray-500 mt-2">{monthLabel}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue by Payment Method */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Payment Method</h2>
          <div className="space-y-3">
            {revenueByMethod.map((item) => {
              const revenue = parseFloat(item.total) || 0;
              const percentage = maxMethodRevenue > 0 ? (revenue / maxMethodRevenue) * 100 : 0;
              return (
                <div key={item.method} className="flex items-center gap-3">
                  <div className="w-24 text-sm text-gray-600">{methodLabels[item.method] || item.method}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-20 text-right text-sm font-medium text-gray-900">
                    ${revenue.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Dentist */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Dentist</h2>
          {revenueByDentist.length === 0 ? (
            <p className="text-gray-500 text-sm">No data available</p>
          ) : (
            <div className="space-y-3">
              {revenueByDentist.map((item) => {
                const revenue = parseFloat(item.total) || 0;
                const percentage = maxDentistRevenue > 0 ? (revenue / maxDentistRevenue) * 100 : 0;
                return (
                  <div key={item.dentistId} className="flex items-center gap-3">
                    <div className="w-32 text-sm text-gray-600 truncate">Dr. {item.name}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-20 text-right text-sm font-medium text-gray-900">
                      ${revenue.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Invoice Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Status</h2>
          {invoiceStatusBreakdown.length === 0 ? (
            <p className="text-gray-500 text-sm">No invoices</p>
          ) : (
            <div className="space-y-3">
              {invoiceStatusBreakdown.map((item) => {
                const total = parseFloat(item.total) || 0;
                const percentage = totalInvoiceAmount > 0 ? (total / totalInvoiceAmount) * 100 : 0;
                return (
                  <div key={item.status} className="flex items-center gap-3">
                    <div className="w-24 text-sm text-gray-600">{statusLabels[item.status] || item.status}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${statusColors[item.status] || 'bg-gray-400'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-20 text-right text-sm font-medium text-gray-900">
                      ${total.toLocaleString()}
                    </div>
                    <div className="w-12 text-right text-xs text-gray-500">
                      {item.count}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
