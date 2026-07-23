import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200">
                <span className="text-white font-bold text-xl">CD</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Chelsea Dental</h1>
                <p className="text-xs text-gray-500">Clinic Management System</p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-200 transition-all duration-200"
              >
                Register
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-100/20 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-8">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Trusted by 500+ Patients
              </div>

              {/* Hero Title */}
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                  Chelsea Dental
                </span>
              </h1>

              {/* Hero Subtitle */}
              <p className="text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                Your trusted partner in dental care. We provide comprehensive dental services
                with state-of-the-art technology and a caring team of professionals.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/appointments"
                  className="group relative px-8 py-4 text-lg font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl hover:from-teal-600 hover:to-teal-700 shadow-xl shadow-teal-200 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Book Appointment
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 text-lg font-semibold border-2 border-gray-200 text-gray-700 rounded-2xl hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300"
                >
                  Patient Portal
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-16 flex flex-wrap justify-center gap-8 text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Award Winning</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Modern Technology</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">Why Choose Us</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Everything You Need for Dental Care</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-teal-200 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-teal-200 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Scheduling</h3>
              <p className="text-gray-600 leading-relaxed">
                Book appointments online 24/7. Choose your preferred dentist and time slot that works for you.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Records</h3>
              <p className="text-gray-600 leading-relaxed">
                Your dental records are protected with enterprise-grade security and encryption.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Reminders</h3>
              <p className="text-gray-600 leading-relaxed">
                Never miss an appointment with automated email and SMS reminders.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-10 text-white shadow-2xl shadow-teal-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl lg:text-5xl font-bold mb-2">500+</p>
                <p className="text-teal-100 text-sm font-medium">Happy Patients</p>
              </div>
              <div>
                <p className="text-4xl lg:text-5xl font-bold mb-2">10+</p>
                <p className="text-teal-100 text-sm font-medium">Expert Dentists</p>
              </div>
              <div>
                <p className="text-4xl lg:text-5xl font-bold mb-2">15+</p>
                <p className="text-teal-100 text-sm font-medium">Years Experience</p>
              </div>
              <div>
                <p className="text-4xl lg:text-5xl font-bold mb-2">98%</p>
                <p className="text-teal-100 text-sm font-medium">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">Get In Touch</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Contact Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Address */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-200">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Address</h4>
              <p className="text-gray-600 leading-relaxed">
                123 Dental Avenue<br />
                Chelsea, London SW3 6NY
              </p>
            </div>

            {/* Phone */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Phone</h4>
              <p className="text-gray-600">+44 20 1234 5678</p>
              <p className="text-sm text-gray-500 mt-1">Mon-Fri 9am-6pm</p>
            </div>

            {/* Hours */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Hours</h4>
              <p className="text-gray-600 leading-relaxed">
                Mon-Fri: 9:00 AM - 6:00 PM<br />
                Sat: 9:00 AM - 2:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-10 lg:p-16 text-center text-white shadow-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Transform Your Smile?</h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied patients who trust Chelsea Dental for their dental care needs.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl hover:from-teal-600 hover:to-teal-700 shadow-xl shadow-teal-200 transition-all duration-300"
            >
              Get Started Today
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
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
                  <p className="text-slate-400 text-xs">Clinic Management System</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Providing exceptional dental care with modern technology and a compassionate team. Your smile is our priority.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-slate-400 hover:text-white transition-colors text-sm">Sign In</Link></li>
                <li><Link href="/register" className="text-slate-400 hover:text-white transition-colors text-sm">Register</Link></li>
                <li><Link href="/appointments" className="text-slate-400 hover:text-white transition-colors text-sm">Book Appointment</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>123 Dental Avenue</li>
                <li>Chelsea, London SW3 6NY</li>
                <li className="pt-2">+44 20 1234 5678</li>
                <li>info@chelseadental.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400 text-sm">
            <p>© {new Date().getFullYear()} Chelsea Dental Clinic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
