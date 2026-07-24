'use client';

import Link from 'next/link';

const team = [
  {
    name: 'Dr. James Smith',
    role: 'Lead Dentist & Founder',
    specialty: 'Cosmetic Dentistry & Smile Makeovers',
    experience: '15+ years',
    education: 'BDS, London Royal College',
    bio: 'Dr. Smith founded Chelsea Dental with a vision to provide world-class dental care. He specializes in cosmetic dentistry and has transformed over 2,000 smiles.',
    achievements: ['Award-winning cosmetic dentist', 'Published researcher', 'International speaker'],
    color: 'from-teal-400 to-teal-600',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
  },
  {
    name: 'Dr. Sarah Wilson',
    role: 'Orthodontist',
    specialty: 'Invisalign & Braces',
    experience: '12+ years',
    education: 'BDS, MSc Orthodontics',
    bio: 'Dr. Wilson is a certified Invisalign Diamond provider with expertise in complex orthodontic cases. She has helped hundreds of patients achieve perfect smiles.',
    achievements: ['Invisalign Diamond Provider', '300+ Invisalign cases', 'Orthodontic teaching faculty'],
    color: 'from-purple-400 to-purple-600',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=400&h=400&fit=crop&crop=face',
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Oral Surgeon',
    specialty: 'Dental Implants & Bone Grafting',
    experience: '10+ years',
    education: 'BDS, MClinDent Oral Surgery',
    bio: 'Dr. Chen specializes in dental implants and oral surgery. He has placed over 3,000 implants with a 99.5% success rate.',
    achievements: ['3,000+ implants placed', '99.5% success rate', 'Advanced implant training'],
    color: 'from-amber-400 to-orange-500',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
  },
  {
    name: 'Dr. Emily Brown',
    role: 'General Dentist',
    specialty: 'Preventive Care & Family Dentistry',
    experience: '8+ years',
    education: 'BDS, PgCert Restorative Dentistry',
    bio: 'Dr. Brown is passionate about preventive care and making dental visits comfortable for all ages. She specializes in anxiety-free dentistry.',
    achievements: ['Sedation dentistry certified', 'Pediatric care specialist', 'Patient satisfaction 98%'],
    color: 'from-rose-400 to-rose-600',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
  },
  {
    name: 'Dr. David Kim',
    role: 'Endodontist',
    specialty: 'Root Canal Therapy',
    experience: '9+ years',
    education: 'BDS, MSc Endodontics',
    bio: 'Dr. Kim is an expert in root canal treatments, performing over 500 procedures annually with a pain-free approach.',
    achievements: ['500+ root canals/year', 'Pain-free technique specialist', 'Endodontic conference speaker'],
    color: 'from-blue-400 to-blue-600',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face',
  },
  {
    name: 'Dr. Lisa Martinez',
    role: 'Periodontist',
    specialty: 'Gum Disease Treatment',
    experience: '11+ years',
    education: 'BDS, MClinDent Periodontics',
    bio: 'Dr. Martinez specializes in treating gum disease and performing gum grafting procedures to restore oral health.',
    achievements: ['Periodontal specialist', 'Gum disease expert', 'Published researcher'],
    color: 'from-emerald-400 to-emerald-600',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
  },
];

const values = [
  {
    title: 'Patient First',
    description: 'Every decision we make is centered around providing the best care for our patients.',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
  {
    title: 'Excellence',
    description: 'We strive for excellence in everything we do, from treatment to patient experience.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    title: 'Innovation',
    description: 'We embrace the latest technology to provide cutting-edge dental care.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    title: 'Compassion',
    description: 'We treat every patient with kindness, empathy, and understanding.',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                About Us
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Dedicated to Your Dental Health
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                For over 15 years, Chelsea Dental has been providing exceptional dental care 
                to the London community. Our team of experienced professionals is committed 
                to helping you achieve and maintain a healthy, beautiful smile.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                We combine the latest dental technology with a warm, caring approach to 
                ensure every visit is comfortable and effective. Your oral health is our 
                top priority, and we're here to support you every step of the way.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl p-5 sm:p-8 shadow-xl">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white/20 rounded-2xl p-3 sm:p-6 text-center">
                  <p className="text-xl sm:text-3xl font-bold text-white">15+</p>
                  <p className="text-blue-100 text-xs sm:text-sm">Years Experience</p>
                </div>
                <div className="bg-white/20 rounded-2xl p-3 sm:p-6 text-center">
                  <p className="text-xl sm:text-3xl font-bold text-white">10K+</p>
                  <p className="text-blue-100 text-xs sm:text-sm">Happy Patients</p>
                </div>
                <div className="bg-white/20 rounded-2xl p-3 sm:p-6 text-center">
                  <p className="text-xl sm:text-3xl font-bold text-white">50+</p>
                  <p className="text-blue-100 text-xs sm:text-sm">Expert Dentists</p>
                </div>
                <div className="bg-white/20 rounded-2xl p-3 sm:p-6 text-center">
                  <p className="text-xl sm:text-3xl font-bold text-white">99%</p>
                  <p className="text-blue-100 text-xs sm:text-sm">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
              Our Values
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What We Stand For
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((value, index) => (
              <div key={index} className="text-center p-5 sm:p-6 rounded-2xl bg-gray-50 hover:bg-teal-50 transition-colors">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              Our Team
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Dentists
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Our team of experienced professionals is dedicated to providing you with 
              the best possible dental care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header with image */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-white/90 text-xs sm:text-sm">{member.role}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <div className="mb-3 sm:mb-4 flex flex-wrap gap-1.5 sm:gap-2">
                    <span className="inline-block px-2.5 sm:px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                      {member.specialty}
                    </span>
                    <span className="inline-block px-2.5 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      {member.experience}
                    </span>
                  </div>

                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">{member.bio}</p>

                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-1.5 sm:mb-2">Education</p>
                    <p className="text-xs sm:text-sm text-gray-700">{member.education}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5 sm:mb-2">Achievements</p>
                    <ul className="space-y-1">
                      {member.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {achievement}
                        </li>
                      ))}
                    </ul>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Ready to Meet Our Team?</h2>
          <p className="text-teal-100 mb-6 sm:mb-8 text-sm sm:text-base">
            Schedule a consultation and experience the Chelsea Dental difference.
          </p>
          <Link
            href="/marketing/booking"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-teal-600 rounded-2xl hover:bg-teal-50 font-semibold shadow-xl transition-all duration-200 text-sm sm:text-base"
          >
            Book Consultation
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
