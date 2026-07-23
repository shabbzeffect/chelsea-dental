'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    insuranceProvider: '',
    insuranceId: '',
    allergies: '',
    medicalConditions: '',
    status: 'active',
  });

  useEffect(() => {
    fetchPatient();
  }, [patientId]);

  const fetchPatient = async () => {
    try {
      const response = await fetch(`/api/patients/${patientId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch patient');

      const p = data.patient;
      setForm({
        fullName: p.user?.fullName || '',
        email: p.user?.email || '',
        phone: p.user?.phone || '',
        dateOfBirth: p.dateOfBirth || '',
        gender: p.gender || '',
        address: p.address || '',
        city: p.city || '',
        state: p.state || '',
        zip: p.zip || '',
        insuranceProvider: p.insuranceProvider || '',
        insuranceId: p.insuranceId || '',
        allergies: p.allergies || '',
        medicalConditions: p.medicalConditions || '',
        status: p.status || 'active',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateOfBirth: form.dateOfBirth || undefined,
          gender: form.gender || undefined,
          address: form.address || undefined,
          city: form.city || undefined,
          state: form.state || undefined,
          zip: form.zip || undefined,
          insuranceProvider: form.insuranceProvider || undefined,
          insuranceId: form.insuranceId || undefined,
          allergies: form.allergies || undefined,
          medicalConditions: form.medicalConditions || undefined,
          status: form.status,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update patient');

      setSuccess('Patient updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-500 font-medium">Loading patient...</p>
      </div>
    );
  }

  if (error && !form.fullName) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium">{error}</p>
          <Link href="/admin/patients" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium">
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-blue-100 mb-2">
              <Link href="/admin" className="hover:text-white transition-colors">Dashboard</Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/admin/patients" className="hover:text-white transition-colors">Patients</Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Edit</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Edit Patient</h1>
            <p className="text-blue-100 mt-1">{form.fullName} ({form.email})</p>
          </div>
          <Link href="/admin/patients" className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 text-sm font-medium transition-all duration-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Patients
          </Link>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {/* Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Status</h2>
              <p className="text-sm text-gray-500">Current patient status</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Patient Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 text-sm">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="transferred">Transferred</option>
            </select>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              <p className="text-sm text-gray-500">Basic patient details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Full Name</label>
              <input type="text" value={form.fullName} disabled className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500" />
              <p className="text-xs text-gray-400 mt-1">Name is managed via account settings</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Email</label>
              <input type="email" value={form.email} disabled className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500" />
              <p className="text-xs text-gray-400 mt-1">Email is managed via account settings</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Phone</label>
              <input type="tel" value={form.phone} disabled className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500" />
              <p className="text-xs text-gray-400 mt-1">Phone is managed via account settings</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm">
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Address</h2>
              <p className="text-sm text-gray-500">Patient contact address</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Street Address</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="123 Main Street" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="London" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">State/County</label>
              <input type="text" name="state" value={form.state} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="England" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Postcode</label>
              <input type="text" name="zip" value={form.zip} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="SW1A 1AA" />
            </div>
          </div>
        </div>

        {/* Insurance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Insurance Information</h2>
              <p className="text-sm text-gray-500">Insurance coverage details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Insurance Provider</label>
              <input type="text" name="insuranceProvider" value={form.insuranceProvider} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Dental Care Plus" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Insurance ID</label>
              <input type="text" name="insuranceId" value={form.insuranceId} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="DCP-123456" />
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Medical Information</h2>
              <p className="text-sm text-gray-500">Health and medical details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Allergies</label>
              <textarea name="allergies" value={form.allergies} onChange={handleChange} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none" placeholder="List any known allergies..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Medical Conditions</label>
              <textarea name="medicalConditions" value={form.medicalConditions} onChange={handleChange} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none" placeholder="List any medical conditions..." />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/patients" className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-medium transition-colors">Cancel</Link>
          <button 
            type="submit" 
            disabled={saving} 
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium shadow-lg shadow-blue-200 transition-all duration-200 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
