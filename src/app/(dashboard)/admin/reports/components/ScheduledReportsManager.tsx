'use client';

import { useState, useEffect } from 'react';

interface ScheduledReport {
  id: string;
  reportType: string;
  recipients: string[];
  frequency: string;
  dayOfWeek: number | null;
  dayOfMonth: number | null;
  timeOfDay: string;
  message: string | null;
  isActive: boolean;
  lastSentAt: string | null;
  nextSendAt: string | null;
  createdAt: string;
}

interface ScheduledReportsManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const reportTypes = [
  { value: 'dashboard', label: 'Dashboard Summary' },
  { value: 'patient', label: 'Patient Report' },
  { value: 'revenue', label: 'Revenue Report' },
  { value: 'appointments', label: 'Appointment Report' },
  { value: 'treatments', label: 'Treatment Report' },
];

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ScheduledReportsManager({ isOpen, onClose }: ScheduledReportsManagerProps) {
  const [reports, setReports] = useState<ScheduledReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    reportType: 'dashboard',
    recipients: [] as string[],
    frequency: 'weekly',
    dayOfWeek: 1,
    dayOfMonth: 1,
    timeOfDay: '09:00',
    message: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchReports();
    }
  }, [isOpen]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports/scheduled');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Failed to fetch scheduled reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editingReport ? '/api/reports/scheduled' : '/api/reports/scheduled';
      const method = editingReport ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: editingReport?.id,
          isActive: true,
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingReport(null);
        resetForm();
        fetchReports();
      }
    } catch (error) {
      console.error('Failed to save scheduled report:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scheduled report?')) {
      return;
    }

    try {
      const response = await fetch(`/api/reports/scheduled?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error('Failed to delete scheduled report:', error);
    }
  };

  const handleToggleActive = async (report: ScheduledReport) => {
    try {
      const response = await fetch('/api/reports/scheduled', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...report,
          isActive: !report.isActive,
          recipients: report.recipients,
        }),
      });

      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error('Failed to toggle scheduled report:', error);
    }
  };

  const handleEdit = (report: ScheduledReport) => {
    setEditingReport(report);
    setFormData({
      reportType: report.reportType,
      recipients: report.recipients,
      frequency: report.frequency,
      dayOfWeek: report.dayOfWeek ?? 1,
      dayOfMonth: report.dayOfMonth ?? 1,
      timeOfDay: report.timeOfDay,
      message: report.message || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      reportType: 'dashboard',
      recipients: [],
      frequency: 'weekly',
      dayOfWeek: 1,
      dayOfMonth: 1,
      timeOfDay: '09:00',
      message: '',
    });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Scheduled Reports</h3>
          <div className="flex gap-2">
            {!showForm && (
              <button
                onClick={() => {
                  setEditingReport(null);
                  resetForm();
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium"
              >
                Add Schedule
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {showForm ? (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">{editingReport ? 'Edit Schedule' : 'New Schedule'}</h4>

              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <div className="flex gap-2">
                  {frequencies.map((freq) => (
                    <button
                      key={freq.value}
                      onClick={() => setFormData({ ...formData, frequency: freq.value })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        formData.frequency === freq.value
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Selection */}
              {formData.frequency === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  >
                    {dayNames.map((day, index) => (
                      <option key={index} value={index}>{day}</option>
                    ))}
                  </select>
                </div>
              )}

              {formData.frequency === 'monthly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day of Month</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.dayOfMonth}
                    onChange={(e) => setFormData({ ...formData, dayOfMonth: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>
              )}

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={formData.timeOfDay}
                  onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.recipients.map((email) => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs"
                    >
                      {email}
                      <button
                        onClick={() => setFormData({
                          ...formData,
                          recipients: formData.recipients.filter(r => r !== email)
                        })}
                        className="hover:text-teal-900"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value && !formData.recipients.includes(e.target.value)) {
                        setFormData({
                          ...formData,
                          recipients: [...formData.recipients, e.target.value]
                        });
                      }
                      e.target.value = '';
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  >
                    <option value="">Add recipient...</option>
                    <option value="all-staff">All Staff</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Add a note to include with the report..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingReport(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium"
                >
                  {editingReport ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
                  <p className="text-gray-500 mt-2">Loading...</p>
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No scheduled reports yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Click "Add Schedule" to create one.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className={`p-4 rounded-lg border ${report.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              report.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {report.isActive ? 'Active' : 'Paused'}
                            </span>
                            <span className="font-medium text-gray-900">
                              {reportTypes.find(t => t.value === report.reportType)?.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {frequencies.find(f => f.value === report.frequency)?.label}
                            {report.frequency === 'weekly' && ` on ${dayNames[report.dayOfWeek || 0]}`}
                            {report.frequency === 'monthly' && ` on day ${report.dayOfMonth}`}
                            {' at '}
                            {report.timeOfDay}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Recipients: {(report.recipients as string[]).join(', ')}
                          </p>
                          <p className="text-xs text-gray-400">
                            Next send: {formatDate(report.nextSendAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(report)}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              report.isActive
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {report.isActive ? 'Pause' : 'Resume'}
                          </button>
                          <button
                            onClick={() => handleEdit(report)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(report.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
