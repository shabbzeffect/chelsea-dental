'use client';

import { useEffect, useState } from 'react';

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No appointments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Dentist</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td className="py-3 text-sm text-gray-900">{apt.appointmentDate}</td>
                    <td className="py-3 text-sm text-gray-600">{apt.startTime?.slice(0, 5)} - {apt.endTime?.slice(0, 5)}</td>
                    <td className="py-3 text-sm text-gray-900">{apt.dentist?.user?.fullName || 'Unassigned'}</td>
                    <td className="py-3 text-sm text-gray-600">{apt.appointmentType?.name || 'N/A'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor(apt.status)}`}>{apt.status}</span>
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
