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
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=450&fit=crop',
  },
  {
    id: 2,
    category: 'clinic',
    title: 'Treatment Rooms',
    description: 'State-of-the-art treatment facilities',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&h=450&fit=crop',
  },
  {
    id: 3,
    category: 'equipment',
    title: 'Digital X-Ray System',
    description: 'Advanced digital imaging technology',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=450&fit=crop',
  },
  {
    id: 4,
    category: 'team',
    title: 'Dr. James Smith',
    description: 'Lead Dentist - Cosmetic Specialist',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=450&fit=crop',
  },
  {
    id: 5,
    category: 'smiles',
    title: 'Teeth Whitening Results',
    description: 'Dramatic smile transformation',
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=450&fit=crop',
  },
  {
    id: 6,
    category: 'equipment',
    title: 'Dental Chair',
    description: 'Ergonomic patient chairs',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=450&fit=crop',
  },
  {
    id: 7,
    category: 'clinic',
    title: 'Consultation Room',
    description: 'Private consultation spaces',
    image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=600&h=450&fit=crop',
  },
  {
    id: 8,
    category: 'team',
    title: 'Dr. Sarah Wilson',
    description: 'Orthodontist - Invisalign Expert',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=600&h=450&fit=crop',
  },
  {
    id: 9,
    category: 'smiles',
    title: 'Before & After Veneers',
    description: 'Complete smile makeover',
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&h=450&fit=crop',
  },
  {
    id: 10,
    category: 'equipment',
    title: '3D Scanner',
    description: 'Digital impression technology',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=450&fit=crop',
  },
  {
    id: 11,
    category: 'clinic',
    title: 'Sterilization Room',
    description: 'Hospital-grade sterilization',
    image: 'https://images.unsplash.com/photo-1581595220911-39e5f66986f2?w=600&h=450&fit=crop',
  },
  {
    id: 12,
    category: 'smiles',
    title: 'Invisalign Results',
    description: 'Perfect alignment achieved',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=450&fit=crop',
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
      <section className="bg-gradient-to-br from-slate-50 to-purple-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            Gallery
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            See Our Clinic
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Take a virtual tour of our modern facility and see the technology 
            and environment that makes Chelsea Dental special.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 sm:py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {galleryCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
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
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group cursor-pointer"
              >
                <div className="relative rounded-2xl aspect-[4/3] overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="text-sm sm:text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-white/80 text-xs sm:text-sm">{item.description}</p>
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
              className="absolute top-2 right-2 sm:-top-12 sm:right-0 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 sm:bg-transparent text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={selectedItem.image} 
                alt={selectedItem.title}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 sm:p-8">
                <h2 className="text-xl sm:text-3xl font-bold text-white mb-2">{selectedItem.title}</h2>
                <p className="text-white/80 text-sm sm:text-lg">{selectedItem.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Visit Us Today</h2>
          <p className="text-teal-100 mb-6 sm:mb-8 text-sm sm:text-base">
            Experience our modern facility and friendly staff in person.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              href="/marketing/booking"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-teal-600 rounded-2xl hover:bg-teal-50 font-semibold shadow-xl transition-all duration-200 text-sm sm:text-base"
            >
              Book Appointment
            </Link>
            <Link
              href="/marketing/contact"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/20 text-white rounded-2xl hover:bg-white/30 font-semibold border border-white/30 transition-all duration-200 text-sm sm:text-base"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
