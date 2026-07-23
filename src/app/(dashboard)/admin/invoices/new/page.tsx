'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: string;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [form, setForm] = useState({
    patientId: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, unitPrice: '' },
  ]);

  useEffect(() => {
    fetchPatients();
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const total = items.reduce((sum, item) => {
    return sum + (item.quantity * parseFloat(item.unitPrice || '0'));
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: form.patientId,
          invoiceDate: form.invoiceDate,
          dueDate: form.dueDate || undefined,
          notes: form.notes || undefined,
          items: items.filter(item => item.description && item.unitPrice),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create invoice');

      router.push('/admin/invoices');
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
          <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
          <p className="text-sm text-gray-500 mt-1">Generate a new invoice for a patient</p>
        </div>
        <Link href="/admin/invoices" className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        {/* Invoice Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
              <select name="patientId" value={form.patientId} onChange={handleFormChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                <option value="">Select patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.user?.fullName || p.patientNumber}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date *</label>
              <input type="date" name="invoiceDate" value={form.invoiceDate} onChange={handleFormChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Line Items</h2>
            <button type="button" onClick={addItem} className="px-3 py-1 text-sm text-teal-600 hover:text-teal-700 font-medium">+ Add Item</button>
          </div>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex gap-3 items-start">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                <input
                  type="number"
                  placeholder="Price"
                  step="0.01"
                  min="0"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} className="px-2 py-2 text-red-500 hover:text-red-700">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
            <div className="text-right">
              <span className="text-sm text-gray-500">Total: </span>
              <span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
          <textarea name="notes" value={form.notes} onChange={handleFormChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="Additional notes for this invoice..." />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/invoices" className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">Cancel</Link>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
}
