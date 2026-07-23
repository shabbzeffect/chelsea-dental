'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [form, setForm] = useState({
    patientId: '',
    dentistId: '',
    appointmentDate: '',
    startTime: '',
    endTime: '',
    status: 'scheduled',
    reason: '',
    notes: '',
    cancellationReason: '',
  });

  useEffect(() => {
    Promise.all([fetchAppointment(), fetchPatients(), fetchStaff()]);
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch appointment');

      const a = data.appointment;
      setForm({
        patientId: a.patientId || '',
        dentistId: a.dentistId || '',
        appointmentDate: a.appointmentDate || '',
        startTime: a.startTime?.slice(0, 5) || '',
        endTime: a.endTime?.slice(0, 5) || '',
        status: a.status || 'scheduled',
        reason: a.reason || '',
        notes: a.notes || '',
        cancellationReason: a.cancellationReason || '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients?limit=100');
      const data = await response.json();
      setPatients(data.patients || []);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff?limit=100');
      const data = await response.json();
      setStaff(data.staff || []);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dentistId: form.dentistId || undefined,
          appointmentDate: form.appointmentDate,
          startTime: form.startTime,
          endTime: form.endTime,
          status: form.status,
          notes: form.notes || undefined,
          cancellationReason: form.status === 'canceled' ? form.cancellationReason || undefined : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update appointment');

      setSuccess('Appointment updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to cancel appointment');
      router.push('/admin/appointments');
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading appointment...</div>
      </div>
    );
  }

  if (error && !form.patientId) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
        <Link href="/admin/appointments" className="text-teal-600 hover:text-teal-700">Back to Appointments</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Appointment</h1>
          <p className="text-sm text-gray-500 mt-1">{form.appointmentDate} at {form.startTime}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/appointments" className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
            Back
          </Link>
          {form.status !== 'canceled' && form.status !== 'completed' && (
            <button onClick={handleCancel} disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50">
              Cancel Appointment
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>
        )}

        {/* Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
          <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>

        {/* Patient & Dentist */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <select name="patientId" value={form.patientId} disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500">
                <option value="">Select patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.user?.fullName || p.patientNumber}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">Patient cannot be changed after creation</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dentist</label>
              <select name="dentistId" value={form.dentistId} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                <option value="">Select dentist</option>
                {staff.filter(s => s.position === 'dentist').map((s) => (
                  <option key={s.id} value={s.id}>{s.user?.fullName || s.staffNumber}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Date & Time</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <input type="text" name="reason" value={form.reason} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="Reason for visit" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="Additional notes..." />
            </div>
            {form.status === 'canceled' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Reason</label>
                <input type="text" name="cancellationReason" value={form.cancellationReason} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="Reason for cancellation" />
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/appointments" className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">Cancel</Link>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
