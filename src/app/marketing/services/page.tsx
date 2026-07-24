'use client';

import Link from 'next/link';

const services = [
  {
    title: 'General Dentistry',
    description: 'Comprehensive dental care to maintain your oral health and prevent future problems.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    color: 'from-blue-500 to-blue-600',
    features: ['Regular Check-ups', 'Professional Cleaning', 'Fillings', 'X-rays', 'Preventive Care'],
    treatments: [
      { name: 'Dental Check-up', duration: '30 min', price: 'Free' },
      { name: 'Professional Clean', duration: '45 min', price: '£85' },
      { name: 'Digital X-Rays', duration: '15 min', price: 'From £35' },
      { name: 'White Fillings', duration: '30-60 min', price: 'From £95' },
      { name: 'Extraction', duration: '30-60 min', price: 'From £120' },
    ],
  },
  {
    title: 'Cosmetic Dentistry',
    description: 'Transform your smile with our range of cosmetic treatments.',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    color: 'from-purple-500 to-purple-600',
    features: ['Teeth Whitening', 'Porcelain Veneers', 'Dental Bonding', 'Smile Makeovers', 'Gum Contouring'],
    treatments: [
      { name: 'Teeth Whitening', duration: '60 min', price: 'From £295' },
      { name: 'Porcelain Veneers', duration: '2 visits', price: 'From £495 per tooth' },
      { name: 'Composite Bonding', duration: '45 min', price: 'From £150 per tooth' },
      { name: 'Smile Makeover', duration: 'Multiple visits', price: 'From £2,500' },
      { name: 'Gum Contouring', duration: '60 min', price: 'From £350' },
    ],
  },
  {
    title: 'Orthodontics',
    description: 'Straighten your teeth with modern orthodontic solutions.',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    color: 'from-emerald-500 to-emerald-600',
    features: ['Metal Braces', 'Ceramic Braces', 'Invisalign', 'Retainers', 'Jaw Correction'],
    treatments: [
      { name: 'Metal Braces', duration: '18-24 months', price: 'From £2,500' },
      { name: 'Ceramic Braces', duration: '18-24 months', price: 'From £3,500' },
      { name: 'Invisalign', duration: '12-18 months', price: 'From £2,800' },
      { name: 'Retainers', duration: '1 visit', price: 'From £150' },
    ],
  },
  {
    title: 'Dental Implants',
    description: 'Replace missing teeth with permanent, natural-looking dental implants.',
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.678-2.149-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    color: 'from-amber-500 to-orange-500',
    features: ['Single Implants', 'Multiple Implants', 'All-on-4', 'Implant Bridges', 'Bone Grafting'],
    treatments: [
      { name: 'Single Implant', duration: '3-6 months', price: 'From £2,500' },
      { name: 'Implant Bridge', duration: '4-6 months', price: 'From £4,500' },
      { name: 'All-on-4', duration: '1-2 days', price: 'From £12,000' },
      { name: 'Bone Grafting', duration: '1-2 months', price: 'From £500' },
    ],
  },
  {
    title: 'Root Canal Therapy',
    description: 'Save your natural tooth with pain-free root canal treatment.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'from-rose-500 to-rose-600',
    features: ['Root Canal Treatment', 'Retreatment', 'Apicoectomy', 'Pulpotomy', 'Post & Core'],
    treatments: [
      { name: 'Root Canal (Front)', duration: '60-90 min', price: 'From £495' },
      { name: 'Root Canal (Back)', duration: '90-120 min', price: 'From £595' },
      { name: 'Retreatment', duration: '90-120 min', price: 'From £695' },
      { name: 'Post & Core', duration: '45 min', price: 'From £295' },
    ],
  },
  {
    title: 'Emergency Dental Care',
    description: '24/7 emergency dental services for urgent situations.',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    color: 'from-red-500 to-red-600',
    features: ['Toothache Relief', 'Broken Tooth Repair', 'Lost Filling/Crown', 'Abscess Treatment', '24/7 Hotline'],
    treatments: [
      { name: 'Emergency Consultation', duration: '30 min', price: 'From £75' },
      { name: 'Emergency Treatment', duration: '30-60 min', price: 'From £150' },
      { name: 'Out-of-Hours Care', duration: 'As needed', price: 'From £200' },
    ],
  },
];

const processSteps = [
  { step: 1, title: 'Consultation', description: 'Meet with our team to discuss your needs' },
  { step: 2, title: 'Treatment Plan', description: 'Receive a personalized treatment plan' },
  { step: 3, title: 'Treatment', description: 'Begin your journey to a healthier smile' },
  { step: 4, title: 'Follow-up', description: 'Post-treatment care and support' },
];

export default function ServicesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-teal-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
            Our Services
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Comprehensive Dental Services
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
            From routine check-ups to advanced procedures, we offer a full range 
            of dental services to meet all your oral health needs.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-8 sm:py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <span className="text-teal-600 font-bold text-base sm:text-lg">{step.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{step.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gray-200" style={{ transform: 'translateX(50%)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 sm:space-y-16">
            {services.map((service, index) => (
              <div key={index} id={service.title.toLowerCase().replace(/\s+/g, '-')} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 sm:gap-12 items-start`}>
                <div className="flex-1">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg`}>
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{service.title}</h2>
                  <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{service.description}</p>
                  
                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2.5 sm:gap-3 text-gray-600 text-sm sm:text-base">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/marketing/booking"
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 text-sm font-medium shadow-lg shadow-teal-200 transition-all duration-200"
                  >
                    Book This Service
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
                
                <div className="flex-1 w-full">
                  {/* Treatments Table */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-3 sm:p-4 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Available Treatments</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {service.treatments.map((treatment, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors gap-1 sm:gap-0">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm sm:text-base">{treatment.name}</p>
                            <p className="text-xs sm:text-sm text-gray-500">{treatment.duration}</p>
                          </div>
                          <div className="sm:text-right">
                            <p className="font-semibold text-teal-600 text-sm sm:text-base">{treatment.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 sm:p-4 border-t border-gray-100 bg-gray-50 text-center">
                      <Link
                        href="/marketing/pricing"
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                      >
                        View all prices →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Not Sure Which Service You Need?</h2>
          <p className="text-teal-100 mb-6 sm:mb-8 text-sm sm:text-base">
            Book a free consultation and our experts will help you determine the best treatment plan.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              href="/marketing/booking"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-teal-600 rounded-2xl hover:bg-teal-50 font-semibold shadow-xl transition-all duration-200 text-sm sm:text-base"
            >
              Book Free Consultation
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/marketing/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/20 text-white rounded-2xl hover:bg-white/30 font-semibold border border-white/30 transition-all duration-200 text-sm sm:text-base"
            >
              View Pricing
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
