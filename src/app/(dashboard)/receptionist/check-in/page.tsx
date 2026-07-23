'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ReceptionistCheckInPage() {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const response = await fetch(`/api/patients?search=${encodeURIComponent(search)}`);
      const data = await response.json();
      setPatients(data.patients || []);
    } catch (error) {
      console.error('Failed to search patients:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-emerald-100 mb-2">
              <Link href="/receptionist" className="hover:text-white transition-colors">Dashboard</Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Check-in</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Patient Check-in</h1>
            <p className="text-emerald-100 mt-1">Quickly check in patients for their appointments</p>
          </div>
        </div>
      </div>

      {/* Search Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Search Patient</h2>
            <p className="text-sm text-gray-500">Find a patient by name, number, or phone</p>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search by name, patient number, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 text-sm"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 font-medium shadow-lg shadow-emerald-200 transition-all duration-200"
          >
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="relative">
            <div className="w-10 h-10 border-4 border-emerald-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-10 h-10 border-4 border-transparent border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500 font-medium">Searching patients...</p>
        </div>
      ) : searched && patients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium text-lg">No patients found</p>
          <p className="text-gray-500 text-sm">Try a different search term</p>
        </div>
      ) : patients.length > 0 ? (
        <div className="space-y-4">
          {patients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-200">
                    {(patient.user?.fullName || 'N').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{patient.user?.fullName || 'N/A'}</p>
                    <p className="text-sm text-gray-500">
                      Patient #: {patient.patientNumber} | Phone: {patient.user?.phone || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      DOB: {patient.dateOfBirth || 'N/A'} | Status: {patient.status}
                    </p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 text-sm font-medium shadow-lg shadow-emerald-200 transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Check In
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
