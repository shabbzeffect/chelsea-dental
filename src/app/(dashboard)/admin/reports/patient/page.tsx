'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DateRangeFilter, { getPresetDates } from '../components/DateRangeFilter';
import ExportButton from '../components/ExportButton';
import EmailModal from '../components/EmailModal';

type PresetRange = 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'thisYear' | 'custom';

interface PatientReport {
  dateRange: { start: string; end: string };
  summary: {
    totalPatients: number;
    newInPeriod: number;
    activePatients: number;
    avgVisitsPerPatient: number;
  };
  demographics: {
    ageGroups: { group: string; count: number }[];
    genderBreakdown: { gender: string; count: number }[];
  };
  visitFrequency: {
    frequency: string;
    patientCount: number;
  }[];
  recentPatients: {
    id: string;
    firstName: string;
    lastName: string;
    lastVisit: string;
    totalVisits: number;
  }[];
}

export default function PatientReportPage() {
  const [report, setReport] = useState<PatientReport | null>(null);
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
      const response = await fetch(`/api/reports/patients?${params}`);
      if (response.status === 401) {
        setError('Please log in to view this report');
        return;
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || 'Failed to fetch patient report');
      }
      const data = await response.json();
      setReport(data);
    } catch (err) {
      console.error('Failed to fetch patient report:', err);
      setError(err instanceof Error ? err.message : 'Failed to load patient report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-500">Loading patient report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-red-500 text-4xl">!</div>
        <p className="text-gray-700 font-medium">Failed to load patient report</p>
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={fetchReport}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
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

  const summary = report.summary || { totalPatients: 0, newInPeriod: 0, activePatients: 0, avgVisitsPerPatient: 0 };
  const demographics = report.demographics || { ageGroups: [], genderBreakdown: [] };
  const ageGroups = demographics.ageGroups || [];
  const genderBreakdown = demographics.genderBreakdown || [];
  const visitFrequency = report.visitFrequency || [];
  const recentPatients = report.recentPatients || [];

  const maxAgeGroup = Math.max(...ageGroups.map(g => g.count), 1);
  const maxGender = Math.max(...genderBreakdown.map(g => g.count), 1);
  const maxFrequency = Math.max(...visitFrequency.map(f => f.patientCount), 1);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Print Header */}
      <div className="print-header">
        <h1>Patient Report</h1>
        <p>Chelsea Dental Clinic</p>
        <p>{formatDate(report.dateRange.start)} - {formatDate(report.dateRange.end)}</p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between no-print">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/reports" className="hover:text-gray-700">Reports</Link>
            <span>/</span>
            <span>Patient Report</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Report</h1>
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
          <ExportButton reportTitle="Patient Report" />
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
        reportType="patient"
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
          <p className="text-sm font-medium text-gray-500">Total Patients</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{summary.totalPatients}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-500">New in Period</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{summary.newInPeriod}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Active Patients</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{summary.activePatients}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Avg Visits/Patient</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">{summary.avgVisitsPerPatient.toFixed(1)}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Groups */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Age Demographics</h2>
          <div className="space-y-3">
            {ageGroups.map((group) => {
              const percentage = maxAgeGroup > 0 ? (group.count / maxAgeGroup) * 100 : 0;
              return (
                <div key={group.group} className="flex items-center gap-3">
                  <div className="w-20 text-sm text-gray-600">{group.group}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-sm font-medium text-gray-900">
                    {group.count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gender Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Gender Breakdown</h2>
          <div className="space-y-3">
            {genderBreakdown.map((item) => {
              const percentage = maxGender > 0 ? (item.count / maxGender) * 100 : 0;
              return (
                <div key={item.gender} className="flex items-center gap-3">
                  <div className="w-20 text-sm text-gray-600 capitalize">{item.gender}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
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
      </div>

      {/* Visit Frequency */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Visit Frequency Distribution</h2>
        <div className="flex items-end justify-between h-48 gap-2">
          {visitFrequency.map((item) => {
            const height = maxFrequency > 0 ? (item.patientCount / maxFrequency) * 100 : 0;
            return (
              <div key={item.frequency} className="flex-1 flex flex-col items-center">
                <div className="text-xs font-medium text-gray-900 mb-1">{item.patientCount}</div>
                <div
                  className="w-full bg-teal-500 rounded-t"
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
                <div className="text-xs text-gray-500 mt-2 text-center">{item.frequency}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Patients */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Patients</h2>
        {recentPatients.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent patients</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Last Visit</th>
                  <th className="pb-3 font-medium text-right">Total Visits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <Link
                        href={`/admin/patients/${patient.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {patient.firstName} {patient.lastName}
                      </Link>
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {new Date(patient.lastVisit).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-sm text-gray-900 text-right font-medium">
                      {patient.totalVisits}
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
