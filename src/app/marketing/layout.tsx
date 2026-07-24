'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100/50">
        {/* Top bar with contact info - hidden on mobile */}
        <div className="hidden lg:block bg-gray-900 text-gray-300 text-xs py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+44 20 1234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Mon-Fri: 9am-6pm | Sat: 9am-2pm</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:text-teal-400 transition-colors">Staff Portal</Link>
              <span className="text-gray-600">|</span>
              <Link href="/register" className="hover:text-teal-400 transition-colors">Register</Link>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-18">
            {/* Logo */}
            <Link href="/marketing" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200 group-hover:shadow-teal-300 transition-shadow">
                <span className="text-white font-bold text-lg">CD</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors">Chelsea Dental</h1>
                <p className="text-xs text-gray-500 tracking-wider uppercase">Premium Dental Care</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <Link href="/marketing" className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors rounded-lg hover:bg-teal-50/50">
                Home
              </Link>
              <Link href="/marketing/services" className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors rounded-lg hover:bg-teal-50/50">
                Services
              </Link>
              <Link href="/marketing/about" className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors rounded-lg hover:bg-teal-50/50">
                About
              </Link>
              <Link href="/marketing/team" className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors rounded-lg hover:bg-teal-50/50">
                Our Team
              </Link>
              <Link href="/marketing/pricing" className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors rounded-lg hover:bg-teal-50/50">
                Pricing
              </Link>
              <Link href="/marketing/testimonials" className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors rounded-lg hover:bg-teal-50/50">
                Testimonials
              </Link>
              <Link href="/marketing/contact" className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors rounded-lg hover:bg-teal-50/50">
                Contact
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:flex px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors rounded-lg hover:bg-teal-50/50"
              >
                Sign In
              </Link>
              <Link
                href="/marketing/booking"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 text-sm font-semibold shadow-lg shadow-teal-200/50 hover:shadow-xl hover:shadow-teal-300/50 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book Now
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-gray-600 hover:bg-teal-50 hover:text-teal-600 min-w-[44px] min-h-[44px] flex items-center justify-center transition-all"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100 bg-white relative z-50 animate-fade-in">
              <div className="flex flex-col space-y-1">
                <Link href="/marketing" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 py-3 px-4 rounded-xl transition-all">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
                <Link href="/marketing/services" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 py-3 px-4 rounded-xl transition-all">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Services
                </Link>
                <Link href="/marketing/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 py-3 px-4 rounded-xl transition-all">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About
                </Link>
                <Link href="/marketing/team" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 py-3 px-4 rounded-xl transition-all">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Our Team
                </Link>
                <Link href="/marketing/pricing" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 py-3 px-4 rounded-xl transition-all">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pricing
                </Link>
                <Link href="/marketing/testimonials" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 py-3 px-4 rounded-xl transition-all">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Testimonials
                </Link>
                <Link href="/marketing/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 py-3 px-4 rounded-xl transition-all">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact
                </Link>
                
                <div className="pt-3 border-t border-gray-100 mt-2 space-y-2">
                  <Link
                    href="/marketing/booking"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 text-sm font-semibold shadow-lg shadow-teal-200/50 transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Book Appointment
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-[calc(4rem+2rem)] lg:pt-[calc(4.5rem+2rem)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Gradient top border */}
        <div className="h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          {/* Top section with newsletter */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Brand & Newsletter */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <span className="text-white font-bold text-xl">CD</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Chelsea Dental</h3>
                  <p className="text-teal-400 text-xs font-medium tracking-wider uppercase">Premium Dental Care</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-6">
                Providing exceptional dental care with modern technology and a compassionate team. 
                Your smile is our priority, and we're committed to making every visit comfortable and effective.
              </p>
              
              {/* Newsletter */}
              <div>
                <h4 className="font-semibold text-sm mb-3 text-gray-300">Stay updated with dental tips</h4>
                <div className="flex gap-2 max-w-md">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-medium text-sm hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/20">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:text-right">
              <h4 className="font-semibold text-sm mb-6 text-gray-300 uppercase tracking-wider">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 lg:justify-end">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm">123 Dental Avenue</p>
                    <p className="text-gray-400 text-xs">Chelsea, London SW3 6NY</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 lg:justify-end">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm">+44 20 1234 5678</p>
                    <p className="text-gray-400 text-xs">Mon-Fri 9am-6pm</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 lg:justify-end">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm">info@chelseadental.com</p>
                    <p className="text-gray-400 text-xs">We respond within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 mt-6 lg:justify-end">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-600 transition-all duration-300 group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-600 transition-all duration-300 group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-600 transition-all duration-300 group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-600 transition-all duration-300 group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-gray-800">
            <div>
              <h4 className="font-semibold text-sm mb-4 text-white">Services</h4>
              <ul className="space-y-2.5">
                <li><Link href="/marketing/services" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  General Dentistry
                </Link></li>
                <li><Link href="/marketing/services" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Cosmetic Dentistry
                </Link></li>
                <li><Link href="/marketing/services" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Orthodontics
                </Link></li>
                <li><Link href="/marketing/services" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Dental Implants
                </Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-white">Company</h4>
              <ul className="space-y-2.5">
                <li><Link href="/marketing/about" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link></li>
                <li><Link href="/marketing/team" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Our Team
                </Link></li>
                <li><Link href="/marketing/gallery" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Gallery
                </Link></li>
                <li><Link href="/marketing/testimonials" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Testimonials
                </Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-white">Support</h4>
              <ul className="space-y-2.5">
                <li><Link href="/marketing/pricing" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Pricing
                </Link></li>
                <li><Link href="/marketing/contact" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact Us
                </Link></li>
                <li><Link href="/marketing/booking" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Book Appointment
                </Link></li>
                <li><Link href="/marketing" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-white">Legal</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Terms of Service
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Cookie Policy
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Accessibility
                </a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-400 text-sm">
              <p>&copy; {new Date().getFullYear()} Chelsea Dental Clinic. All rights reserved.</p>
              <span className="hidden sm:inline">|</span>
              <div className="flex gap-4">
                <Link href="/login" className="hover:text-teal-400 transition-colors">Staff Login</Link>
                <Link href="/register" className="hover:text-teal-400 transition-colors">Patient Registration</Link>
              </div>
            </div>
            
            {/* Back to top */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors text-sm group"
            >
              Back to top
              <svg className="w-4 h-4 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
