'use client';

import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

const reviews = [
  {
    id: 1,
    author: 'Ananya Sharma',
    platform: 'Google',
    rating: 5,
    date: '3 days ago',
    content: 'Mindblowing brilliance and fire!',
  },
  {
    id: 2,
    author: 'Rohan Mehta',
    platform: 'Trustpilot',
    rating: 5,
    date: '1 week ago',
    content: 'Flawless clarity, fast delivery.',
  },
  {
    id: 3,
    author: 'Sneha Patel',
    platform: 'Google',
    rating: 5,
    date: '2 weeks ago',
    content: 'Obsessed with the sparkle.',
  },
  {
    id: 4,
    author: 'Vikram Singh',
    platform: 'Google',
    rating: 5,
    date: '1 month ago',
    content: 'Looks like natural diamond!',
  },
  {
    id: 5,
    author: 'Kavya Reddy',
    platform: 'Trustpilot',
    rating: 5,
    date: '2 months ago',
    content: 'Fits perfectly. Great service.',
  },
  {
    id: 6,
    author: 'Aarav Gupta',
    platform: 'Google',
    rating: 4,
    date: '2 months ago',
    content: 'Stunning craftsmanship.',
  },
  {
    id: 7,
    author: 'Meera N.',
    platform: 'Google',
    rating: 5,
    date: '3 months ago',
    content: 'Exactly what I wanted!',
  },
  {
    id: 8,
    author: 'Siddharth V.',
    platform: 'Trustpilot',
    rating: 5,
    date: '4 months ago',
    content: 'Exquisite hidden halo.',
  }
];

export default function ReviewsSection() {
  return (
    <section id="reviews" className="py-10 sm:py-12 bg-[#F7F5F0] border-t border-[#E8E5DF]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-[#18181B] text-sm">Excellent</span>
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span className="font-sans text-xs font-semibold text-gray-600">4.9/5 based on 10,000+ reviews</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#18181B] font-bold">
            Real Customer Reviews
          </h2>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-xl border border-[#E8E5DF] p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'fill-gray-200 text-gray-200'}`} />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {rev.platform === 'Google' ? (
                    <span className="text-blue-600">G</span>
                  ) : (
                    <span className="text-green-600">★</span>
                  )}
                  {rev.platform}
                </div>
              </div>
              
              <p className="font-sans text-xs sm:text-[13px] text-gray-700 leading-relaxed mb-4 flex-grow">
                "{rev.content}"
              </p>
              
              <div className="flex items-center justify-between mt-auto border-t border-gray-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span className="font-bold text-[#18181B] text-[11px] sm:text-xs">{rev.author}</span>
                </div>
                <span className="text-[10px] text-gray-400">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
