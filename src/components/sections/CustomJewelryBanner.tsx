'use client';

import React from 'react';
import { Sparkles, MessageCircle, Send, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CustomJewelryBanner() {
  return (
    <section className="py-16 bg-[#18181B] text-[#FDFBF7] relative overflow-hidden">
      {/* Subtle gold background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-[#27272A] to-[#18181B] rounded-3xl border border-[#D4AF37]/30 p-8 sm:p-14 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] rounded-full text-xs font-sans font-bold tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Bespoke Custom Jewelry Studio
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 text-white">
              Have a Dream Design in Mind? <br />
              <span className="text-[#D4AF37] italic font-light">
                Let Our Master Jewelers Craft It.
              </span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
              Send us any photo, Pinterest moodboard, or CAD sketch. We will render a photorealistic 3D CAD model and handcraft your ring in solid 925 Silver, 14K, or 18K Hallmarked Gold within 7 business days.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-sans text-gray-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Free 3D CAD Preview
              </span>
              <span>•</span>
              <span>Laser-Engraved Personalization</span>
              <span>•</span>
              <span>Direct Master Jeweler Access</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <a
              href="https://wa.me/919999999999?text=Hi%2C%20I%20would%20like%20to%20consult%20for%20a%20Custom%20Bespoke%20Moissanite%20Ring!"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#064E3B] hover:bg-[#059669] text-[#D4AF37] hover:text-white font-sans text-xs font-bold tracking-widest uppercase rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp Now
            </a>

            <a
              href="mailto:contact@aurajewelry.com"
              className="px-8 py-4 bg-transparent border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 text-[#D4AF37] font-sans text-xs font-bold tracking-widest uppercase rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Email Us CAD Files <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
