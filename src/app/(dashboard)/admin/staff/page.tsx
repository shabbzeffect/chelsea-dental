'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState('');

  useEffect(() => {
    fetchStaff();
  }, [search, positionFilter]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (positionFilter) params.set('position', positionFilter);
      const response = await fetch(`/api/staff?${params}`);
      const data = await response.json();
      setStaff(data.staff || []);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setPositionFilter('');
  };

  const hasFilters = search || positionFilter;

  const positionColor = (position: string) => {
    switch (position) {
      case 'dentist': return 'bg-teal-500';
      case 'hygienist': return 'bg-purple-500';
      case 'receptionist': return 'bg-blue-500';
      case 'admin': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const positionBadgeColor = (position: string) => {
    switch (position) {
      case 'dentist': return 'bg-teal-100 text-teal-700';
      case 'hygienist': return 'bg-purple-100 text-purple-700';
      case 'receptionist': return 'bg-blue-100 text-blue-700';
      case 'admin': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'on_leave': return 'bg-amber-100 text-amber-700';
      case 'inactive': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const dentistCount = staff.filter(s => s.position === 'dentist').length;
  const hygienistCount = staff.filter(s => s.position === 'hygienist').length;
  const receptionistCount = staff.filter(s => s.position === 'receptionist').length;
  const adminCount = staff.filter(s => s.position === 'admin').length;

  return (
    <div className="space-y-6">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-500 to-green-500 rounded-2xl p-6 text-white shadow-lg shadow-teal-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-teal-100 mb-2">
              <Link href="/admin" className="hover:text-white transition-colors">Dashboard</Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Staff</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Staff Management</h1>
            <p className="text-teal-100 mt-1">{staff.length} team members</p>
          </div>
          <Link
            href="/admin/staff/new"
            className="flex items-center gap-2 px-5 py-3 bg-white text-teal-600 rounded-xl hover:bg-teal-50 text-sm font-semibold transition-all duration-200 shadow-lg self-start"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add Staff
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dentists</p>
              <p className="text-2xl font-bold text-blue-600">{dentistCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Hygienists</p>
              <p className="text-2xl font-bold text-purple-600">{hygienistCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reception</p>
              <p className="text-2xl font-bold text-emerald-600">{receptionistCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Search</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, email, or staff #..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Position</label>
            <select 
              value={positionFilter} 
              onChange={(e) => setPositionFilter(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm"
            >
              <option value="">All Positions</option>
              <option value="dentist">Dentist</option>
              <option value="hygienist">Hygienist</option>
              <option value="receptionist">Receptionist</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {hasFilters && (
            <button 
              onClick={clearFilters} 
              className="px-4 py-3 text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative">
              <div className="w-10 h-10 border-4 border-teal-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-10 h-10 border-4 border-transparent border-t-teal-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500 font-medium">Loading staff...</p>
          </div>
        ) : staff.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium text-lg mb-2">No staff found</p>
            <p className="text-gray-500 text-sm mb-4">{hasFilters ? 'Try adjusting your search or filters' : 'Get started by adding your first staff member'}</p>
            {!hasFilters && (
              <Link 
                href="/admin/staff/new" 
                className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-600 hover:to-emerald-600 text-sm font-medium shadow-lg shadow-teal-200 transition-all duration-200"
              >
                Add Staff Member
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff #</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Specialization</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {staff.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-lg">
                        {s.staffNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${positionColor(s.position)} rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm`}>
                          {(s.user?.fullName || 'N').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{s.user?.fullName || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{s.user?.email || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.user?.email || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full capitalize ${positionBadgeColor(s.position)}`}>
                        {s.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.specialization || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColor(s.status)}`}>
                        {s.status?.replace('_', ' ')}
                      </span>
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
