'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'contact' | 'booking'>('contact');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    appointmentType: '',
    preferredDate: '',
    preferredTime: '',
    reason: '',
    notes: '',
  });

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setLoading(false);
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

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/80 text-emerald-700 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Us
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Get in{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions or want to book an appointment? We're here to help you 
            achieve the perfect smile.
          </p>

          {/* Quick Contact Cards */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <a href="tel:+442012345678" className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-300">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500">Call us</p>
                <p className="text-sm font-semibold text-gray-900">+44 20 1234 5678</p>
              </div>
            </a>
            <a href="mailto:info@chelseadental.com" className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-300">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500">Email us</p>
                <p className="text-sm font-semibold text-gray-900">info@chelseadental.com</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-6 sm:py-8 border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-2 sm:gap-3">
            <button
              onClick={() => { setActiveTab('contact'); setSubmitted(false); }}
              className={`flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                activeTab === 'contact'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200/50'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Message
            </button>
            <button
              onClick={() => { setActiveTab('booking'); setSubmitted(false); }}
              className={`flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                activeTab === 'booking'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200/50'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book Appointment
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-colors">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                    <p className="text-gray-600 text-sm">123 Dental Avenue</p>
                    <p className="text-gray-600 text-sm">Chelsea, London SW3 6NY</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-colors">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-600 text-sm">+44 20 1234 5678</p>
                    <p className="text-gray-500 text-xs">Mon-Fri 9am-6pm, Sat 9am-2pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-600 text-sm break-all">info@chelseadental.com</p>
                    <p className="text-gray-500 text-xs">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-colors">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Opening Hours</h3>
                    <p className="text-gray-600 text-sm">Mon-Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600 text-sm">Saturday: 9:00 AM - 2:00 PM</p>
                    <p className="text-gray-600 text-sm">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Interactive Map */}
              <div className="mt-8 rounded-3xl overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-0.1755,51.4875,-0.1655,51.4925&layer=mapnik&marker=51.49,-0.17"
                  className="w-full h-64 border-0"
                  title="Chelsea Dental Clinic Location"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 text-center">
                <a 
                  href="https://www.openstreetmap.org/?mlat=51.49&mlon=-0.17#map=16/51.49/-0.17" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View larger map
                </a>
              </div>
            </div>

            {/* Forms */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10">
              {/* Contact Form */}
              {activeTab === 'contact' && (
                <>
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200/50">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent!</h3>
                      <p className="text-gray-600 mb-8 max-w-sm mx-auto">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                      <button
                        onClick={() => { setSubmitted(false); setContactForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 font-semibold shadow-lg shadow-emerald-200/50 transition-all duration-300"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-5">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                        <p className="text-gray-500 text-sm">We'd love to hear from you. Fill out the form below.</p>
                      </div>
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-5">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Us a Message</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Name</label>
                          <input type="text" name="name" value={contactForm.name} onChange={handleContactChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm" placeholder="Your name" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Email</label>
                          <input type="email" name="email" value={contactForm.email} onChange={handleContactChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm" placeholder="your@email.com" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Phone</label>
                          <input type="tel" name="phone" value={contactForm.phone} onChange={handleContactChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm" placeholder="+44 7700 900000" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Subject</label>
                          <select name="subject" value={contactForm.subject} onChange={handleContactChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm">
                            <option value="">Select subject</option>
                            <option value="appointment">Book an Appointment</option>
                            <option value="general">General Inquiry</option>
                            <option value="emergency">Emergency</option>
                            <option value="feedback">Feedback</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Message</label>
                        <textarea name="message" value={contactForm.message} onChange={handleContactChange} required rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm resize-none" placeholder="How can we help you?" />
                      </div>
                      <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 font-semibold shadow-lg shadow-teal-200 transition-all duration-200 disabled:opacity-50">
                        {loading ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  )}
                </>
              )}

              {/* Booking Form */}
              {activeTab === 'booking' && (
                <>
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Request Sent!</h3>
                      <p className="text-gray-600 mb-6">We'll confirm your appointment within 24 hours.</p>
                      <button onClick={() => { setSubmitted(false); setBookingForm({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: '', appointmentType: '', preferredDate: '', preferredTime: '', reason: '', notes: '' }); }} className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium">
                        Book Another Appointment
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="space-y-5">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Book an Appointment</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">First Name *</label>
                          <input type="text" name="firstName" value={bookingForm.firstName} onChange={handleBookingChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm" placeholder="John" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Last Name *</label>
                          <input type="text" name="lastName" value={bookingForm.lastName} onChange={handleBookingChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm" placeholder="Doe" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Email *</label>
                          <input type="email" name="email" value={bookingForm.email} onChange={handleBookingChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm" placeholder="your@email.com" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Phone *</label>
                          <input type="tel" name="phone" value={bookingForm.phone} onChange={handleBookingChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm" placeholder="+44 7700 900000" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Date of Birth</label>
                          <input type="date" name="dateOfBirth" value={bookingForm.dateOfBirth} onChange={handleBookingChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Gender</label>
                          <select name="gender" value={bookingForm.gender} onChange={handleBookingChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm">
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Appointment Type *</label>
                          <select name="appointmentType" value={bookingForm.appointmentType} onChange={handleBookingChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm">
                            <option value="">Select type</option>
                            <option value="consultation">Free Consultation</option>
                            <option value="checkup">Check-up & Clean</option>
                            <option value="whitening">Teeth Whitening</option>
                            <option value="veneers">Veneers</option>
                            <option value="braces">Braces / Invisalign</option>
                            <option value="implants">Dental Implants</option>
                            <option value="rootcanal">Root Canal</option>
                            <option value="emergency">Emergency</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Preferred Date *</label>
                          <input type="date" name="preferredDate" value={bookingForm.preferredDate} onChange={handleBookingChange} min={minDateString} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Preferred Time *</label>
                          <select name="preferredTime" value={bookingForm.preferredTime} onChange={handleBookingChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm">
                            <option value="">Select time</option>
                            {timeSlots.map((slot) => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Reason for Visit</label>
                          <input type="text" name="reason" value={bookingForm.reason} onChange={handleBookingChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm" placeholder="e.g., Annual check-up" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Additional Notes</label>
                        <textarea name="notes" value={bookingForm.notes} onChange={handleBookingChange} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-sm resize-none" placeholder="Any special requirements or information..." />
                      </div>
                      <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 font-semibold shadow-lg shadow-teal-200 transition-all duration-200 disabled:opacity-50">
                        {loading ? 'Submitting...' : 'Request Appointment'}
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-rose-50 via-red-50 to-rose-50"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-rose-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-200/50">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Dental Emergency?</h2>
          <p className="text-gray-600 mb-8 text-base sm:text-lg max-w-lg mx-auto">
            If you have a dental emergency, call us immediately. We offer 24/7 emergency care for urgent situations.
          </p>
          <a 
            href="tel:+442012345678" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-2xl hover:from-rose-600 hover:to-red-600 font-bold shadow-xl shadow-rose-200/50 transition-all duration-300 text-base sm:text-lg"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Now: +44 20 1234 5678
          </a>
        </div>
      </section>
    </div>
  );
}
