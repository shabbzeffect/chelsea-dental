'use client';

import Link from 'next/link';

const pricingCategories = [
  {
    title: 'General Dentistry',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    color: 'from-blue-500 to-blue-600',
    services: [
      { name: 'Consultation', price: 'Free', description: 'Initial assessment and treatment plan' },
      { name: 'Check-up & Clean', price: '£85', description: 'Professional examination and cleaning' },
      { name: 'X-Rays', price: 'From £35', description: 'Digital dental X-rays' },
      { name: 'Fillings', price: 'From £95', description: 'White composite fillings' },
      { name: 'Extraction', price: 'From £120', description: 'Simple tooth extraction' },
    ],
  },
  {
    title: 'Cosmetic Dentistry',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    color: 'from-purple-500 to-purple-600',
    services: [
      { name: 'Teeth Whitening', price: 'From £295', description: 'Professional in-surgery whitening' },
      { name: 'Porcelain Veneers', price: 'From £495', description: 'Per tooth, custom-made' },
      { name: 'Composite Bonding', price: 'From £150', description: 'Per tooth, same-day results' },
      { name: 'Smile Makeover', price: 'From £2,500', description: 'Complete smile transformation' },
      { name: 'Gum Contouring', price: 'From £350', description: 'Gum reshaping treatment' },
    ],
  },
  {
    title: 'Orthodontics',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    color: 'from-emerald-500 to-emerald-600',
    services: [
      { name: 'Metal Braces', price: 'From £2,500', description: 'Traditional metal bracket braces' },
      { name: 'Ceramic Braces', price: 'From £3,500', description: 'Tooth-colored ceramic braces' },
      { name: 'Invisalign', price: 'From £2,800', description: 'Clear aligner treatment' },
      { name: 'Retainers', price: 'From £150', description: 'Post-treatment retainers' },
    ],
  },
  {
    title: 'Dental Implants',
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.678-2.149-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    color: 'from-amber-500 to-orange-500',
    services: [
      { name: 'Single Implant', price: 'From £2,500', description: 'Includes implant and crown' },
      { name: 'Implant Bridge', price: 'From £4,500', description: 'Replace multiple missing teeth' },
      { name: 'All-on-4', price: 'From £12,000', description: 'Full arch restoration' },
      { name: 'Bone Grafting', price: 'From £500', description: 'Pre-implant bone augmentation' },
    ],
  },
  {
    title: 'Root Canal Therapy',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'from-rose-500 to-rose-600',
    services: [
      { name: 'Anterior Root Canal', price: 'From £495', description: 'Front tooth root canal' },
      { name: 'Posterior Root Canal', price: 'From £595', description: 'Back tooth root canal' },
      { name: 'Retreatment', price: 'From £695', description: 'Root canal retreatment' },
      { name: 'Post & Core', price: 'From £295', description: 'Post and core restoration' },
    ],
  },
  {
    title: 'Emergency Care',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    color: 'from-red-500 to-red-600',
    services: [
      { name: 'Emergency Consultation', price: 'From £75', description: 'Urgent dental assessment' },
      { name: 'Emergency Treatment', price: 'From £150', description: 'Immediate pain relief and treatment' },
      { name: 'Out-of-Hours', price: 'From £200', description: '24/7 emergency dental care' },
    ],
  },
];

const paymentPlans = [
  {
    name: 'Pay As You Go',
    description: 'Pay for each treatment as you go',
    features: ['No commitment required', 'Pay at each visit', 'Standard pricing'],
    highlight: false,
  },
  {
    name: 'Monthly Plan',
    description: 'Spread the cost over 12 months',
    features: ['0% interest for 12 months', 'Automatic monthly payments', 'Priority booking', 'Free emergency cover'],
    highlight: true,
  },
  {
    name: 'Dental Finance',
    description: 'Flexible finance from £500',
    features: ['Loans from £500-£25,000', '6-60 month terms', 'Competitive rates', 'Quick decision'],
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-green-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Transparent Pricing
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
            We believe in clear, upfront pricing with no hidden fees. 
            View our treatment costs below.
          </p>
        </div>
      </section>

      {/* Price Guarantee Banner */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-white text-center sm:text-left">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="font-semibold text-sm sm:text-base">Price Promise: No hidden fees, guaranteed.</span>
            <span className="text-teal-100 text-xs sm:text-sm">Get a written quote before any treatment.</span>
          </div>
        </div>
      </section>

      {/* Pricing Categories */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Treatment Prices</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              All prices are guides and may vary depending on individual treatment requirements. 
              A full treatment plan and quote will be provided during your consultation.
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {pricingCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{category.title}</h3>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {category.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 hover:bg-gray-50 transition-colors gap-1 sm:gap-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{service.name}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{service.description}</p>
                      </div>
                      <div className="sm:text-right sm:ml-4">
                        <p className="text-base sm:text-lg font-bold text-teal-600">{service.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Plans */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Payment Options</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer flexible payment options to make dental care affordable for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {paymentPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-2xl p-6 sm:p-8 border ${
                  plan.highlight 
                    ? 'border-teal-500 shadow-xl shadow-teal-100 ring-2 ring-teal-500' 
                    : 'border-gray-100 shadow-sm'
                }`}
              >
                {plan.highlight && (
                  <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">{plan.description}</p>
                <ul className="space-y-3 mb-6 sm:mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-gray-600 text-sm sm:text-base">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/marketing/booking"
                  className={`block w-full text-center py-3 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-200 hover:from-teal-600 hover:to-teal-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl p-6 sm:p-8 md:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Insurance Accepted</h2>
                <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base">
                  We work with most major dental insurance providers. We can help you 
                  maximize your benefits and handle all the paperwork.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs sm:text-sm">Bupa Dental</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs sm:text-sm">AXA Health</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs sm:text-sm">Denplan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs sm:text-sm">Vitality Health</span>
                  </div>
                </div>
              </div>
              <div className="text-center lg:text-right">
                <p className="text-blue-100 mb-4 text-sm sm:text-base">
                  Not sure if you're covered? We can check for you!
                </p>
                <Link
                  href="/marketing/contact"
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 font-semibold shadow-lg transition-all duration-200 text-sm sm:text-base"
                >
                  Contact Us
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Ready to Get Started?</h2>
          <p className="text-teal-100 mb-6 sm:mb-8 text-sm sm:text-base">
            Book a free consultation to discuss your treatment options and get a personalized quote.
          </p>
          <Link
            href="/marketing/booking"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-teal-600 rounded-2xl hover:bg-teal-50 font-semibold shadow-xl transition-all duration-200 text-sm sm:text-base"
          >
            Book Free Consultation
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
