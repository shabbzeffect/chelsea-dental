'use client';

import { useEffect, useState } from 'react';

export default function PatientTreatmentsPage() {
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    try {
      const response = await fetch('/api/treatments');
      const data = await response.json();
      setTreatments(data.treatments || []);
    } catch (error) {
      console.error('Failed to fetch treatments:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Treatment History</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : treatments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No treatments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Dentist</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {treatments.map((t) => (
                  <tr key={t.id}>
                    <td className="py-3 text-sm text-gray-900">{t.treatmentDate}</td>
                    <td className="py-3 text-sm text-gray-600">{t.description}</td>
                    <td className="py-3 text-sm text-gray-900">{t.dentist?.user?.fullName || 'N/A'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor(t.status)}`}>{t.status}</span>
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
