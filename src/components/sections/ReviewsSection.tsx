'use client';

import React from 'react';
import { Star, CheckCircle, ShieldCheck } from 'lucide-react';

const reviews = [
  {
    id: 1,
    author: 'Ananya Sharma',
    city: 'Mumbai, Maharashtra',
    rating: 5,
    date: 'Verified Buyer • 3 days ago',
    title: 'Outshines my natural diamond engagement ring!',
    content: 'I ordered the Celeste Oval 2.00 CT in 18K Yellow Gold. The brilliance and fire under sunlight are mindblowing. My jeweler friend tested it with his diamond tester and it beeped positive immediately! GRA certificate was in the box. 10/10 recommend.',
    ringName: 'The Celeste Oval Solitaire Moissanite Ring',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 2,
    author: 'Rohan & Priya Mehta',
    city: 'Bengaluru, Karnataka',
    rating: 5,
    date: 'Verified Buyer • 1 week ago',
    title: 'The best anniversary gift ever. Saved thousands of dollars.',
    content: 'We compared real diamonds at Tanishq vs this 2.50 CT Emerald cut ring. The clarity is flawless (pure VVS1 colorless). The packaging was luxurious with a rich velvet box. Super fast insured delivery to Bangalore.',
    ringName: 'The Royal Emerald-Cut Solitaire with Hidden Halo',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 3,
    author: 'Sneha Patel',
    city: 'Ahmedabad, Gujarat',
    rating: 5,
    date: 'Verified Buyer • 2 weeks ago',
    title: 'Stacking it with the Tiara band — looks like a $10,000 ring set!',
    content: 'Obsessed with the sparkle. I wear it everyday in the shower, gym, and office without worrying about losing a multi-lakh diamond. Zero tarnishing or discoloration on the 925 silver finish.',
    ringName: 'The Crown Round Brilliant Solitaire Ring',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop',
  },
];

export default function ReviewsSection() {
  return (
    <section id="reviews" className="py-20 bg-[#F7F5F0] border-t border-[#E8E5DF]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-sans text-xs font-bold text-gray-800">
                4.95 / 5.0 Average Rating
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#18181B]">
              Loved by Over 10,000+ Couples
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-gray-600 mt-4 md:mt-0 max-w-md">
            Read unfiltered feedback and see unedited customer wrist & finger photos of our certified Moissanite creations.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-[#E8E5DF] p-6 shadow-xs flex flex-col justify-between hover:shadow-xl transition-shadow"
            >
              <div>
                {/* Photo & Ring snippet */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <img
                    src={rev.image}
                    alt={rev.ringName}
                    className="w-14 h-14 object-cover rounded-xl border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-xs font-semibold text-[#18181B] truncate">
                      {rev.ringName}
                    </p>
                    <div className="flex text-amber-400 mt-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review text */}
                <h4 className="font-serif text-lg font-bold text-[#18181B] mb-2 leading-snug">
                  "{rev.title}"
                </h4>
                <p className="font-sans text-xs text-gray-600 leading-relaxed mb-6">
                  {rev.content}
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-sans">
                <div>
                  <p className="font-bold text-[#18181B] flex items-center gap-1">
                    {rev.author}
                    <CheckCircle className="w-3.5 h-3.5 text-[#059669]" />
                  </p>
                  <p className="text-[11px] text-gray-400">{rev.city}</p>
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
