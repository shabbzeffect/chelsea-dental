'use client';

import Link from 'next/link';

const dentists = [
  {
    name: 'Dr. James Smith',
    role: 'Lead Dentist & Founder',
    specialty: 'Cosmetic Dentistry',
    experience: '15+ years',
    education: 'BDS, London Royal College',
    bio: 'Dr. Smith founded Chelsea Dental with a vision to provide world-class dental care. He specializes in cosmetic dentistry and has transformed over 2,000 smiles.',
    achievements: ['Award-winning cosmetic dentist', 'Published researcher', 'International speaker'],
    color: 'from-teal-400 to-teal-600',
    initial: 'JS',
  },
  {
    name: 'Dr. Sarah Wilson',
    role: 'Orthodontist',
    specialty: 'Invisalign & Braces',
    experience: '12+ years',
    education: 'BDS, MSc Orthodontics',
    bio: 'Dr. Wilson is a certified Invisalign Diamond provider with expertise in complex orthodontic cases.',
    achievements: ['Invisalign Diamond Provider', '300+ Invisalign cases', 'Teaching faculty'],
    color: 'from-purple-400 to-purple-600',
    initial: 'SW',
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Oral Surgeon',
    specialty: 'Dental Implants',
    experience: '10+ years',
    education: 'BDS, MClinDent Oral Surgery',
    bio: 'Dr. Chen specializes in dental implants and oral surgery with a 99.5% success rate.',
    achievements: ['3,000+ implants placed', '99.5% success rate', 'Advanced training'],
    color: 'from-amber-400 to-orange-500',
    initial: 'MC',
  },
  {
    name: 'Dr. Emily Brown',
    role: 'General Dentist',
    specialty: 'Preventive Care',
    experience: '8+ years',
    education: 'BDS, PgCert Restorative Dentistry',
    bio: 'Dr. Brown is passionate about preventive care and anxiety-free dentistry.',
    achievements: ['Sedation certified', 'Pediatric specialist', '98% satisfaction'],
    color: 'from-rose-400 to-rose-600',
    initial: 'EB',
  },
  {
    name: 'Dr. David Kim',
    role: 'Endodontist',
    specialty: 'Root Canal Therapy',
    experience: '9+ years',
    education: 'BDS, MSc Endodontics',
    bio: 'Dr. Kim is an expert in pain-free root canal treatments.',
    achievements: ['500+ root canals/year', 'Pain-free specialist', 'Conference speaker'],
    color: 'from-blue-400 to-blue-600',
    initial: 'DK',
  },
  {
    name: 'Dr. Lisa Martinez',
    role: 'Periodontist',
    specialty: 'Gum Disease',
    experience: '11+ years',
    education: 'BDS, MClinDent Periodontics',
    bio: 'Dr. Martinez specializes in gum disease treatment and restoration.',
    achievements: ['Periodontal specialist', 'Published researcher', 'Expert in grafting'],
    color: 'from-emerald-400 to-emerald-600',
    initial: 'LM',
  },
];

const supportStaff = [
  {
    name: 'Amanda Foster',
    role: 'Practice Manager',
    description: 'Oversees daily operations and ensures exceptional patient experience.',
    color: 'from-indigo-400 to-indigo-600',
    initial: 'AF',
  },
  {
    name: 'Rachel Green',
    role: 'Head Dental Nurse',
    description: 'Leads our nursing team with 10+ years of clinical experience.',
    color: 'from-pink-400 to-pink-600',
    initial: 'RG',
  },
  {
    name: 'Tom Bradley',
    role: 'Lead Dental Hygienist',
    description: 'Specializes in preventive care and patient education.',
    color: 'from-cyan-400 to-cyan-600',
    initial: 'TB',
  },
  {
    name: 'Sophie Chen',
    role: 'Reception Team Lead',
    description: 'First point of contact, ensuring smooth patient journeys.',
    color: 'from-amber-400 to-amber-600',
    initial: 'SC',
  },
];

export default function TeamPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-purple-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            Our Team
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Meet Our Expert Team
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Our dedicated team of dental professionals is committed to providing 
            you with the highest quality care in a welcoming environment.
          </p>
        </div>
      </section>

      {/* Dentists Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
              Clinical Team
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Dentists
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Highly qualified professionals with decades of combined experience 
              in various dental specialties.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {dentists.map((dentist, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className={`bg-gradient-to-br ${dentist.color} p-5 sm:p-6 text-center`}>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                    <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-br bg-clip-text text-transparent" style={{backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`}}>
                      {dentist.initial}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">{dentist.name}</h3>
                  <p className="text-white/80 text-xs sm:text-sm">{dentist.role}</p>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    <span className="inline-block px-2.5 sm:px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                      {dentist.specialty}
                    </span>
                    <span className="inline-block px-2.5 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      {dentist.experience}
                    </span>
                  </div>

                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">{dentist.bio}</p>

                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-1.5 sm:mb-2">Education</p>
                    <p className="text-xs sm:text-sm text-gray-700">{dentist.education}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5 sm:mb-2">Achievements</p>
                    <ul className="space-y-1">
                      {dentist.achievements.map((achievement, i) => (
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

      {/* Support Staff Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              Support Team
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Support Staff
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              The friendly faces who make your visit comfortable and ensure 
              everything runs smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {supportStaff.map((staff, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 text-center hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${staff.color} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg`}>
                  <span className="text-xl sm:text-2xl font-bold text-white">{staff.initial}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{staff.name}</h3>
                <p className="text-teal-600 text-xs sm:text-sm font-medium mb-2">{staff.role}</p>
                <p className="text-gray-500 text-xs sm:text-sm">{staff.description}</p>
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
            Book a consultation and experience the Chelsea Dental difference.
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
