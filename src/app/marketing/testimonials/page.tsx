'use client';

import Link from 'next/link';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Patient since 2020',
    content: 'Chelsea Dental completely transformed my smile. The team is incredibly professional and caring. I was nervous about getting veneers, but Dr. Smith made the entire process comfortable and stress-free. The results exceeded my expectations!',
    rating: 5,
    treatment: 'Veneers',
    color: 'from-pink-400 to-pink-600',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Patient since 2019',
    content: 'The best dental experience I\'ve ever had. The staff is friendly, the technology is state-of-the-art, and the results are amazing. I\'ve been coming here for regular check-ups and couldn\'t be happier.',
    rating: 5,
    treatment: 'General Care',
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 3,
    name: 'Emma Williams',
    role: 'Patient since 2021',
    content: 'I was terrified of dentists until I came to Chelsea Dental. They made me feel completely comfortable and the treatment was painless. Now I actually look forward to my appointments!',
    rating: 5,
    treatment: 'Anxiety Management',
    color: 'from-emerald-400 to-emerald-600',
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Patient since 2018',
    content: 'Had a dental emergency and they saw me immediately. The team was professional, efficient, and genuinely caring. I\'ve been a loyal patient ever since.',
    rating: 5,
    treatment: 'Emergency Care',
    color: 'from-rose-400 to-rose-600',
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    role: 'Patient since 2022',
    content: 'My Invisalign treatment was seamless. Dr. Wilson monitored my progress carefully and the results are perfect. I couldn\'t be happier with my straight teeth!',
    rating: 5,
    treatment: 'Invisalign',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 6,
    name: 'Robert Martinez',
    role: 'Patient since 2020',
    content: 'After losing a tooth, I was worried about dental implants. The team at Chelsea Dental made the process easy and the implant looks and feels completely natural.',
    rating: 5,
    treatment: 'Dental Implant',
    color: 'from-amber-400 to-amber-600',
  },
  {
    id: 7,
    name: 'Jennifer Lee',
    role: 'Patient since 2021',
    content: 'Professional, clean, and welcoming environment. The staff remembers my name and preferences. It feels like family here. Highly recommend to anyone looking for quality dental care.',
    rating: 5,
    treatment: 'Regular Check-ups',
    color: 'from-teal-400 to-teal-600',
  },
  {
    id: 8,
    name: 'Mark Thompson',
    role: 'Patient since 2019',
    content: 'I needed extensive work done and was anxious about the cost. Chelsea Dental worked with me on a payment plan that made everything affordable. The quality of care is exceptional.',
    rating: 5,
    treatment: 'Full Mouth Restoration',
    color: 'from-indigo-400 to-indigo-600',
  },
  {
    id: 9,
    name: 'Amanda Garcia',
    role: 'Patient since 2023',
    content: 'My kids actually enjoy going to the dentist now! The pediatric team is amazing with children. They make dental visits fun and educational.',
    rating: 5,
    treatment: 'Pediatric Care',
    color: 'from-cyan-400 to-cyan-600',
  },
];

const stats = [
  { number: '500+', label: '5-Star Reviews' },
  { number: '99%', label: 'Satisfaction Rate' },
  { number: '95%', label: 'Would Recommend' },
  { number: '4.9', label: 'Average Rating' },
];

export default function TestimonialsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our Patients Say
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Hear from our happy patients about their 
            experience at Chelsea Dental.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-teal-600">{stat.number}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292c.097-.346.018-.73-.267-1.017L4.049 6.215a1.603 1.603 0 011.902 0l1.07 3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-white font-semibold shadow-lg`}>
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                    {testimonial.treatment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonial */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-200">
              <span className="text-white font-bold text-3xl">"</span>
            </div>
            <p className="text-xl md:text-2xl text-gray-700 italic mb-6 leading-relaxed">
              Chelsea Dental changed my life. After years of being self-conscious about my smile, 
              I now beam with confidence. The entire team made the journey comfortable and enjoyable. 
              I can't thank them enough!
            </p>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292c.097-.346.018-.73-.267-1.017L4.049 6.215a1.603 1.603 0 011.902 0l1.07 3.292z" />
                </svg>
              ))}
            </div>
            <p className="font-semibold text-gray-900">Sarah Johnson</p>
            <p className="text-sm text-gray-500">Patient since 2020 • Veneers</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join Our Happy Patients?</h2>
          <p className="text-teal-100 mb-8">
            Book your appointment today and experience the Chelsea Dental difference.
          </p>
          <Link
            href="/marketing/booking"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-600 rounded-2xl hover:bg-teal-50 font-semibold shadow-xl transition-all duration-200"
          >
            Book Your Appointment
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
