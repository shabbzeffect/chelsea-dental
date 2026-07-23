'use client';

import { useEffect, useState } from 'react';

export default function PatientInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Invoices</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No invoices found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="pb-3">Invoice #</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Paid</th>
                  <th className="pb-3">Balance</th>
                  <th className="pb-3">Due Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((inv) => {
                  const balance = parseFloat(inv.totalAmount) - parseFloat(inv.paidAmount || '0');
                  return (
                    <tr key={inv.id}>
                      <td className="py-3 text-sm font-mono text-gray-900">{inv.invoiceNumber}</td>
                      <td className="py-3 text-sm text-gray-600">{inv.invoiceDate}</td>
                      <td className="py-3 text-sm text-gray-900">${parseFloat(inv.totalAmount).toFixed(2)}</td>
                      <td className="py-3 text-sm text-gray-600">${parseFloat(inv.paidAmount || '0').toFixed(2)}</td>
                      <td className="py-3 text-sm text-gray-900">${balance.toFixed(2)}</td>
                      <td className="py-3 text-sm text-gray-600">{inv.dueDate || 'N/A'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor(inv.status)}`}>{inv.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
