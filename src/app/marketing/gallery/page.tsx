'use client';

import { useState } from 'react';
import Link from 'next/link';

const galleryCategories = [
  { id: 'all', label: 'All' },
  { id: 'clinic', label: 'Our Clinic' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'team', label: 'Our Team' },
  { id: 'smiles', label: 'Smile Transformations' },
];

const galleryItems = [
  {
    id: 1,
    category: 'clinic',
    title: 'Reception Area',
    description: 'Welcoming and comfortable waiting area',
    color: 'from-blue-400 to-blue-600',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    id: 2,
    category: 'clinic',
    title: 'Treatment Rooms',
    description: 'State-of-the-art treatment facilities',
    color: 'from-teal-400 to-teal-600',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    id: 3,
    category: 'equipment',
    title: 'Digital X-Ray System',
    description: 'Advanced digital imaging technology',
    color: 'from-purple-400 to-purple-600',
    icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
  },
  {
    id: 4,
    category: 'team',
    title: 'Dr. James Smith',
    description: 'Lead Dentist - Cosmetic Specialist',
    color: 'from-emerald-400 to-emerald-600',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    id: 5,
    category: 'smiles',
    title: 'Teeth Whitening Results',
    description: 'Dramatic smile transformation',
    color: 'from-amber-400 to-orange-500',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
  {
    id: 6,
    category: 'equipment',
    title: 'Dental Chair',
    description: 'Ergonomic patient chairs',
    color: 'from-indigo-400 to-indigo-600',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2-2.286L6 21l2.286-2.143L12 15l2.286 2.143L20 12l-5.714-2.143L16 5h-4z',
  },
  {
    id: 7,
    category: 'clinic',
    title: 'Consultation Room',
    description: 'Private consultation spaces',
    color: 'from-cyan-400 to-cyan-600',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
  {
    id: 8,
    category: 'team',
    title: 'Dr. Sarah Wilson',
    description: 'Orthodontist - Invisalign Expert',
    color: 'from-pink-400 to-pink-600',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    id: 9,
    category: 'smiles',
    title: 'Before & After Veneers',
    description: 'Complete smile makeover',
    color: 'from-rose-400 to-rose-600',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
  {
    id: 10,
    category: 'equipment',
    title: '3D Scanner',
    description: 'Digital impression technology',
    color: 'from-violet-400 to-violet-600',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  },
  {
    id: 11,
    category: 'clinic',
    title: 'Sterilization Room',
    description: 'Hospital-grade sterilization',
    color: 'from-green-400 to-green-600',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    id: 12,
    category: 'smiles',
    title: 'Invisalign Results',
    description: 'Perfect alignment achieved',
    color: 'from-cyan-400 to-cyan-600',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            Gallery
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            See Our Clinic
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take a virtual tour of our modern facility and see the technology 
            and environment that makes Chelsea Dental special.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {galleryCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${item.color} rounded-2xl aspect-[4/3] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]`}>
                  <div className="text-center text-white p-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-white/80 text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className={`bg-gradient-to-br ${selectedItem.color} rounded-2xl aspect-video flex items-center justify-center shadow-2xl`}>
              <div className="text-center text-white p-8">
                <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={selectedItem.icon} />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-2">{selectedItem.title}</h2>
                <p className="text-white/80 text-lg">{selectedItem.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Visit Us Today</h2>
          <p className="text-teal-100 mb-8">
            Experience our modern facility and friendly staff in person.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/marketing/booking"
              className="px-8 py-4 bg-white text-teal-600 rounded-2xl hover:bg-teal-50 font-semibold shadow-xl transition-all duration-200"
            >
              Book Appointment
            </Link>
            <Link
              href="/marketing/contact"
              className="px-8 py-4 bg-white/20 text-white rounded-2xl hover:bg-white/30 font-semibold border border-white/30 transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
