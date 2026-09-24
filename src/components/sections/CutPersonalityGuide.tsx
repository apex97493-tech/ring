'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

const CUTS = [
  {
    id: 'Round',
    name: 'Round Brilliant',
    title: 'The Fire & Scintillation Champion',
    tagline: '58 mathematically calibrated facets designed for maximum rainbow fire.',
    fireScore: '10/10',
    fingerCoverage: '8/10',
    character: 'Classic, intensely dazzling, and the most iconic solitaire shape on Earth.',
    bestFor: 'Those who want head-turning rainbow sparkle in any light.',
    image: 'https://images.unsplash.com/photo-1599643478524-fb505410a40f?q=80&w=800&auto=format&fit=crop',
    recommendedMetal: '18K Yellow Gold or Platinum',
  },
  {
    id: 'Emerald',
    name: 'Royal Emerald',
    title: 'The Art Deco Hall of Mirrors',
    tagline: 'Stepped rectangular facets providing hypnotic flashes of clarity and understated majesty.',
    fireScore: '8.5/10',
    fingerCoverage: '9.5/10',
    character: 'Sophisticated, vintage architectural lines favored by royalty and connoisseurs.',
    bestFor: 'Connoisseurs of geometric symmetry and vintage glamour.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop',
    recommendedMetal: '18K Yellow Gold or 925 Silver',
  },
  {
    id: 'Oval',
    name: 'Modern Oval',
    title: 'The Finger-Elongating Muse',
    tagline: 'Combines the fiery brilliance of a round cut with graceful elongating proportions.',
    fireScore: '9.5/10',
    fingerCoverage: '10/10',
    character: 'Trending, supremely flattering on any hand, and appears visibly larger per carat.',
    bestFor: 'Maximum perceived size and elegant finger-lengthening aesthetics.',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
    recommendedMetal: '18K Rose Gold or Platinum',
  },
  {
    id: 'Pear',
    name: 'Dramatic Pear',
    title: 'The Romantic Teardrop',
    tagline: 'A harmonious hybrid of round brilliance and marquise point, radiating poetic charm.',
    fireScore: '9/10',
    fingerCoverage: '9/10',
    character: 'Avant-garde, expressive, and strikingly distinct from traditional solitaires.',
    bestFor: 'Brides looking for distinctive, unique luxury that stands out.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    recommendedMetal: '18K Yellow Gold',
  },
  {
    id: 'Cushion',
    name: 'Crushed-Ice Cushion',
    title: 'The Pillow of Pure Sparkle',
    tagline: 'Curved pillow corners with modern crushed-ice micro-facets that scatter light endlessly.',
    fireScore: '9.5/10',
    fingerCoverage: '8.5/10',
    character: 'Warm, antique-inspired charm combined with ultra-modern diamond fire.',
    bestFor: 'Those who adore vintage silhouette with intense modern shimmer.',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
    recommendedMetal: '18K Rose Gold or Solid Silver',
  },
  {
    id: 'Radiant',
    name: 'Baroque Radiant',
    title: 'The Brilliant Geometric Powerhouse',
    tagline: '70 intense facets in a cut-corner rectangular profile for supreme scintillation.',
    fireScore: '9.5/10',
    fingerCoverage: '9/10',
    character: 'Bold, daring brilliance that combines emerald geometry with round sparkle.',
    bestFor: 'High-impact presence and maximum sparkle in a modern shape.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
    recommendedMetal: 'Platinum & 18K Yellow Gold',
  },
];

export default function CutPersonalityGuide() {
  const [activeCutId, setActiveCutId] = useState('Round');
  const activeCut = CUTS.find((c) => c.id === activeCutId) || CUTS[0];

  return (
    <section className="py-12 sm:py-20 bg-[#FDFBF7] border-t border-[#E8E5DF]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4E8C1]/60 text-[#8C6A1F] rounded-full text-[11px] sm:text-xs font-sans font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B89035]" />
            Gemstone Storytelling
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#18181B] mb-3">
            Find Your Stone Personality
          </h2>
          <div className="w-16 h-[1.5px] bg-[#D4AF37] mx-auto mb-4" />
          <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Every gemstone cut tells a different love story. Explore the optical character, scintillation personality, and finger coverage of our master cuts.
          </p>
        </div>

        {/* Shape Pills Tab Bar */}
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 justify-start sm:justify-center mb-8 scrollbar-none">
          {CUTS.map((cut) => (
            <button
              key={cut.id}
              onClick={() => setActiveCutId(cut.id)}
              className={`px-4 sm:px-6 py-2.5 rounded-full font-sans text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap flex-shrink-0 cursor-pointer border ${
                activeCutId === cut.id
                  ? 'bg-[#022C22] text-[#D4AF37] border-[#022C22] shadow-md scale-105'
                  : 'bg-white text-gray-700 border-[#E8E5DF] hover:border-[#D4AF37] hover:text-[#022C22]'
              }`}
            >
              {cut.name}
            </button>
          ))}
        </div>

        {/* Active Cut Spotlight Showcase */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-[#E8E5DF] shadow-luxury overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCut.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-12 items-center"
            >
              {/* Left Photo Showcase */}
              <div className="md:col-span-5 relative aspect-[4/3] md:aspect-square w-full bg-[#F7F5F0] overflow-hidden">
                <img
                  src={activeCut.image}
                  alt={activeCut.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                <span className="absolute bottom-4 left-4 md:top-4 md:left-4 z-10 bg-[#022C22]/90 backdrop-blur-md text-[#D4AF37] font-sans text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded shadow-md border border-[#D4AF37]/30">
                  {activeCut.name} Cut
                </span>
              </div>

              {/* Right Editorial Details */}
              <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#8C6A1F] uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    {activeCut.title}
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#18181B] mb-3">
                    {activeCut.name} Moissanite
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    {activeCut.tagline} {activeCut.character}
                  </p>

                  {/* Spec Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-[#F7F5F0] rounded-xl border border-[#E8E5DF] font-sans text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Fire & Rainbow Sparkle</span>
                      <strong className="text-[#064E3B] text-sm">{activeCut.fireScore}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Finger Elongation</span>
                      <strong className="text-[#18181B] text-sm">{activeCut.fingerCoverage}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Ideal Setting Pairing</span>
                      <strong className="text-[#18181B] text-xs">{activeCut.recommendedMetal}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Best Match For</span>
                      <strong className="text-[#18181B] text-xs">{activeCut.bestFor}</strong>
                    </div>
                  </div>
                </div>

                {/* CTA to Filter Collection */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <a
                    href="#collection"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#022C22] hover:bg-[#B89035] text-[#D4AF37] hover:text-white rounded-xl font-sans text-xs font-bold tracking-widest uppercase transition-all shadow-md"
                  >
                    <span>Explore {activeCut.name} Solitaires</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <span className="font-sans text-[11px] text-gray-500 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Available in 1.50 CT to 3.00 CT
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
