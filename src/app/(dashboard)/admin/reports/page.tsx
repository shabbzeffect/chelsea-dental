'use client';

import { useState } from 'react';
import Link from 'next/link';
import ScheduledReportsManager from './components/ScheduledReportsManager';

export default function AdminReportsPage() {
  const [showScheduledReports, setShowScheduledReports] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-emerald-100 mb-2">
              <Link href="/admin" className="hover:text-white transition-colors">Dashboard</Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Reports</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-emerald-100 mt-1">Insights and trends for your dental practice</p>
          </div>
          <button
            onClick={() => setShowScheduledReports(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white text-emerald-600 rounded-xl hover:bg-emerald-50 text-sm font-semibold transition-all duration-200 shadow-lg self-start"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Scheduled Reports
          </button>
        </div>
      </div>

      {/* Dashboard Overview Card */}
      <Link
        href="/admin/reports/dashboard"
        className="block bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 rounded-2xl p-6 hover:shadow-xl hover:shadow-teal-200/50 transition-all duration-300 group"
      >
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">Reports Dashboard</h2>
            <p className="text-teal-100 text-sm mt-1">View key metrics, charts, and trends across all reports</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Patient Report */}
        <Link
          href="/admin/reports/patient"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Report</h3>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">View patient demographics, visit frequency, and treatment history.</p>
          <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-center text-white text-sm font-semibold shadow-lg shadow-blue-200 group-hover:from-blue-600 group-hover:to-blue-700 transition-all">
            View Report
          </div>
        </Link>

        {/* Revenue Report */}
        <Link
          href="/admin/reports/revenue"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Report</h3>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">Track revenue, outstanding payments, and financial trends.</p>
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-center text-white text-sm font-semibold shadow-lg shadow-emerald-200 group-hover:from-emerald-600 group-hover:to-emerald-700 transition-all">
            View Report
          </div>
        </Link>

        {/* Appointment Report */}
        <Link
          href="/admin/reports/appointments"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-purple-200 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center group-hover:bg-purple-100 transition-colors">
              <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointment Report</h3>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">Analyze appointment trends, no-show rates, and scheduling patterns.</p>
          <div className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-center text-white text-sm font-semibold shadow-lg shadow-purple-200 group-hover:from-purple-600 group-hover:to-purple-700 transition-all">
            View Report
          </div>
        </Link>

        {/* Treatment Report */}
        <Link
          href="/admin/reports/treatments"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-orange-200 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-colors">
              <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Treatment Report</h3>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">Review treatment types, success rates, and clinical outcomes.</p>
          <div className="px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-center text-white text-sm font-semibold shadow-lg shadow-orange-200 group-hover:from-orange-600 group-hover:to-orange-700 transition-all">
            View Report
          </div>
        </Link>
      </div>

      {/* Quick Stats Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          Report Categories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Patient Data</p>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-xl">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Financial</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Scheduling</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Clinical</p>
          </div>
        </div>
      </div>

      {/* Scheduled Reports Manager */}
      <ScheduledReportsManager
        isOpen={showScheduledReports}
        onClose={() => setShowScheduledReports(false)}
      />
    </div>
  );
}
