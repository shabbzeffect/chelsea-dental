'use client';

import { useState } from 'react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: 'patient' | 'revenue' | 'appointments' | 'treatments' | 'dashboard';
  dateRange: { start: string; end: string };
}

const staffOptions = [
  { value: 'all-staff', label: 'All Staff' },
  { value: 'admin', label: 'Admin Only' },
];

export default function EmailModal({ isOpen, onClose, reportType, dateRange }: EmailModalProps) {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [customEmail, setCustomEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const reportTitles: Record<string, string> = {
    patient: 'Patient Report',
    revenue: 'Revenue Report',
    appointments: 'Appointment Report',
    treatments: 'Treatment Report',
    dashboard: 'Reports Dashboard',
  };

  const handleRecipientChange = (value: string) => {
    if (value === 'all-staff') {
      setRecipients(['all-staff']);
    } else if (value === 'admin') {
      setRecipients(['admin@chelseadental.com']);
    } else if (value === 'custom' && customEmail) {
      if (!recipients.includes(customEmail)) {
        setRecipients([...recipients, customEmail]);
      }
      setCustomEmail('');
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email));
  };

  const handleSend = async () => {
    if (recipients.length === 0) {
      setError('Please select at least one recipient');
      return;
    }

    setSending(true);
    setError(null);

    try {
      const response = await fetch('/api/reports/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType,
          recipients,
          dateRange,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setSent(true);
      setTimeout(() => {
        onClose();
        setSent(false);
        setRecipients([]);
        setMessage('');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Email Report</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-4">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-900">Report Sent!</p>
              <p className="text-sm text-gray-500 mt-1">The report has been emailed successfully.</p>
            </div>
          ) : (
            <>
              {/* Report Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900">{reportTitles[reportType]}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
                </p>
              </div>

              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                <select
                  onChange={(e) => handleRecipientChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  value=""
                >
                  <option value="" disabled>Select recipients...</option>
                  <option value="all-staff">All Staff</option>
                  <option value="admin">Admin Only</option>
                  <option value="custom">Custom Email...</option>
                </select>

                {recipients.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {recipients.map((email) => (
                      <span
                        key={email}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs"
                      >
                        {email}
                        <button
                          onClick={() => removeRecipient(email)}
                          className="hover:text-teal-900"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Email Input */}
              {recipients.includes('all-staff') === false && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Custom Email</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customEmail) {
                          e.preventDefault();
                          handleRecipientChange('custom');
                        }
                      }}
                    />
                    <button
                      onClick={() => handleRecipientChange('custom')}
                      disabled={!customEmail}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a note to include with the report..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {!sent && (
          <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending || recipients.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium disabled:opacity-50"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Report
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
