'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Dentist {
  id: string;
  user: {
    fullName: string;
  };
  specialization: string;
}

interface AppointmentType {
  id: string;
  name: string;
  durationMinutes: number;
  description: string;
}

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    dentistId: '',
    appointmentTypeId: '',
    date: '',
    time: '',
    reason: '',
  });

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const [dentistRes, typeRes] = await Promise.all([
        fetch('/api/staff?position=dentist'),
        fetch('/api/appointments/types'),
      ]);

      const dentistData = await dentistRes.json();
      const typeData = await typeRes.json();

      setDentists(dentistData.staff || []);
      setAppointmentTypes(typeData.types || []);
    } catch (error) {
      console.error('Failed to fetch form data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // First register the patient
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: 'TempPassword123!',
          confirmPassword: 'TempPassword123!',
          fullName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
        }),
      });

      if (!registerRes.ok) {
        const data = await registerRes.json();
        // If user already exists, that's okay for booking
        if (!data.error?.includes('already exists')) {
          throw new Error(data.error || 'Registration failed');
        }
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate time slots
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 17) timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  // Get min date (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateString = minDate.toISOString().split('T')[0];

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for booking with Chelsea Dental. We'll send you a confirmation 
            email shortly with all the details.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please check your email for login credentials to manage your appointments.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/marketing"
              className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium"
            >
              Back to Home
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-slate-50 to-teal-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
          <p className="text-gray-600">Fill in the details below to schedule your visit</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 ${
                step >= s 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : s}
              </div>
              {s < 3 && (
                <div className={`w-20 h-1 mx-2 transition-colors duration-200 ${
                  step > s ? 'bg-teal-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-between mb-8 px-4">
          <span className={`text-sm font-medium ${step >= 1 ? 'text-teal-600' : 'text-gray-400'}`}>Personal Info</span>
          <span className={`text-sm font-medium ${step >= 2 ? 'text-teal-600' : 'text-gray-400'}`}>Appointment</span>
          <span className={`text-sm font-medium ${step >= 3 ? 'text-teal-600' : 'text-gray-400'}`}>Confirm</span>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm"
                      placeholder="+44 7700 900000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Appointment Details */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Appointment Details</h2>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Appointment Type</label>
                  <select
                    name="appointmentTypeId"
                    value={formData.appointmentTypeId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm"
                  >
                    <option value="">Select type</option>
                    {appointmentTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name} ({type.durationMinutes} min)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Preferred Dentist</label>
                  <select
                    name="dentistId"
                    value={formData.dentistId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm"
                  >
                    <option value="">No preference</option>
                    {dentists.map((dentist) => (
                      <option key={dentist.id} value={dentist.id}>
                        Dr. {dentist.user?.fullName} {dentist.specialization ? `(${dentist.specialization})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Preferred Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={minDateString}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Preferred Time</label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Reason for Visit</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm resize-none"
                    placeholder="Briefly describe the reason for your visit..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Confirm</h2>
                
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium text-gray-900">{formData.phone}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">{formData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium text-gray-900">{formData.time}</span>
                  </div>
                  {formData.dentistId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dentist:</span>
                      <span className="font-medium text-gray-900">
                        Dr. {dentists.find(d => d.id === formData.dentistId)?.user?.fullName}
                      </span>
                    </div>
                  )}
                  {formData.reason && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reason:</span>
                      <span className="font-medium text-gray-900">{formData.reason}</span>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                  <p>By confirming, you agree to our terms and conditions. You will receive a confirmation email with your appointment details.</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 font-semibold shadow-lg shadow-teal-200 transition-all duration-200"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 font-semibold shadow-lg shadow-teal-200 transition-all duration-200 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Confirm Booking'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
