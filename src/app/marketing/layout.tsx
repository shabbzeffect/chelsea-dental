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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/marketing" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200">
                <span className="text-white font-bold text-lg">CD</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">Chelsea Dental</h1>
                <p className="text-xs text-gray-500">Premium Dental Care</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/marketing" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
                Home
              </Link>
              <Link href="/marketing/services" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
                Services
              </Link>
              <Link href="/marketing/about" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
                About
              </Link>
              <Link href="/marketing/team" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
                Our Team
              </Link>
              <Link href="/marketing/pricing" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
                Pricing
              </Link>
              <Link href="/marketing/gallery" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
                Gallery
              </Link>
              <Link href="/marketing/testimonials" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
                Testimonials
              </Link>
              <Link href="/marketing/contact" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
                Contact
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:flex px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/marketing/booking"
                className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 text-sm font-semibold shadow-lg shadow-teal-200 transition-all duration-200"
              >
                Book Now
              </Link>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
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
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-3">
                <Link href="/marketing" className="text-sm font-medium text-gray-700 hover:text-teal-600 py-2">
                  Home
                </Link>
                <Link href="/marketing/services" className="text-sm font-medium text-gray-700 hover:text-teal-600 py-2">
                  Services
                </Link>
                <Link href="/marketing/about" className="text-sm font-medium text-gray-700 hover:text-teal-600 py-2">
                  About
                </Link>
                <Link href="/marketing/team" className="text-sm font-medium text-gray-700 hover:text-teal-600 py-2">
                  Our Team
                </Link>
                <Link href="/marketing/pricing" className="text-sm font-medium text-gray-700 hover:text-teal-600 py-2">
                  Pricing
                </Link>
                <Link href="/marketing/gallery" className="text-sm font-medium text-gray-700 hover:text-teal-600 py-2">
                  Gallery
                </Link>
                <Link href="/marketing/testimonials" className="text-sm font-medium text-gray-700 hover:text-teal-600 py-2">
                  Testimonials
                </Link>
                <Link href="/marketing/contact" className="text-sm font-medium text-gray-700 hover:text-teal-600 py-2">
                  Contact
                </Link>
                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-teal-600 py-2">
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CD</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Chelsea Dental</h3>
                  <p className="text-gray-400 text-xs">Premium Dental Care</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                Providing exceptional dental care with modern technology and a compassionate team. Your smile is our priority.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/marketing/services" className="text-gray-400 hover:text-white transition-colors text-sm">Services</Link></li>
                <li><Link href="/marketing/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link></li>
                <li><Link href="/marketing/about" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</Link></li>
                <li><Link href="/marketing/team" className="text-gray-400 hover:text-white transition-colors text-sm">Our Team</Link></li>
                <li><Link href="/marketing/gallery" className="text-gray-400 hover:text-white transition-colors text-sm">Gallery</Link></li>
                <li><Link href="/marketing/testimonials" className="text-gray-400 hover:text-white transition-colors text-sm">Testimonials</Link></li>
                <li><Link href="/marketing/booking" className="text-gray-400 hover:text-white transition-colors text-sm">Book Appointment</Link></li>
                <li><Link href="/marketing/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>123 Dental Avenue</li>
                <li>Chelsea, London SW3 6NY</li>
                <li className="pt-2">+44 20 1234 5678</li>
                <li>info@chelseadental.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Chelsea Dental Clinic. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/login" className="hover:text-white transition-colors">Staff Login</Link>
              <Link href="/register" className="hover:text-white transition-colors">Patient Registration</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
