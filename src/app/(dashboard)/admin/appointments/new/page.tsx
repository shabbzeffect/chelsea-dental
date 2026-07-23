'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewAppointmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [form, setForm] = useState({
    patientId: '',
    dentistId: '',
    appointmentDate: '',
    startTime: '',
    endTime: '',
    reason: '',
    notes: '',
  });

  useEffect(() => {
    fetchPatients();
    fetchStaff();
  }, []);

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
    setLoading(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: form.patientId,
          dentistId: form.dentistId || undefined,
          appointmentDate: form.appointmentDate,
          startTime: form.startTime,
          endTime: form.endTime,
          reason: form.reason || undefined,
          notes: form.notes || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create appointment');

      router.push('/admin/appointments');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Appointment</h1>
          <p className="text-sm text-gray-500 mt-1">Schedule a new appointment</p>
        </div>
        <Link href="/admin/appointments" className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        {/* Patient & Dentist */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
              <select name="patientId" value={form.patientId} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                <option value="">Select patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.user?.fullName || p.patientNumber}</option>
                ))}
              </select>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
              <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
              <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
              <input type="text" name="reason" value={form.reason} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="Routine check-up, tooth pain, etc." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="Any additional notes..." />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/appointments" className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">Cancel</Link>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
}
