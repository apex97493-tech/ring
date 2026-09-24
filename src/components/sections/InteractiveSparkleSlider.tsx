'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Sun, Moon, Flame, ShieldCheck, ArrowLeftRight } from 'lucide-react';

export default function InteractiveSparkleSlider() {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [activeLighting, setActiveLighting] = useState<'sunlight' | 'indoor'>('sunlight');
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const percentage = (clampedX / rect.width) * 100;
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleInteractionStart = (clientX: number) => {
    setIsDragging(true);
    handleMove(clientX);
  };

  return (
    <section className="py-12 sm:py-20 bg-[#F7F5F0] border-t border-b border-[#E8E5DF] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4E8C1] text-[#8C6A1F] rounded-full text-[11px] sm:text-xs font-sans font-bold tracking-widest uppercase mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Visual Proof
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#18181B] mb-3">
            Drag to Compare: Diamond vs. Moissanite
          </h2>
          <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Experience the optical science yourself. Slide back and forth to see how AURA Moissanite produces 2.4x higher rainbow fire and scintillation than a mined diamond.
          </p>

          {/* Lighting Mode Selector */}
          <div className="mt-5 inline-flex items-center gap-1.5 p-1 bg-white rounded-full border border-[#E8E5DF] shadow-xs">
            <button
              onClick={() => setActiveLighting('sunlight')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold transition-all ${
                activeLighting === 'sunlight'
                  ? 'bg-[#022C22] text-[#D4AF37] shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              Direct Natural Sunlight
            </button>
            <button
              onClick={() => setActiveLighting('indoor')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold transition-all ${
                activeLighting === 'indoor'
                  ? 'bg-[#022C22] text-[#D4AF37] shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-blue-400" />
              Intimate Evening Light
            </button>
          </div>
        </div>

        {/* Visual Slider Frame */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            onMouseDown={(e) => handleInteractionStart(e.clientX)}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX)}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setIsDragging(false)}
            className="relative h-[360px] sm:h-[480px] md:h-[540px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/40 cursor-ew-resize select-none bg-black"
          >
            {/* RIGHT SIDE / BACKGROUND (AURA MOISSANITE) */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={
                  activeLighting === 'sunlight'
                    ? 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=1200&auto=format&fit=crop'
                    : 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=1200&auto=format&fit=crop'
                }
                alt="AURA Royal Moissanite Fire"
                className="w-full h-full object-cover brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
              
              {/* Moissanite Label & Specs (Right Side) */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-right z-10 pointer-events-none">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#064E3B]/90 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/50 rounded-full font-sans text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-lg">
                  <Flame className="w-3 h-3 text-amber-400" /> AURA Moissanite (VVS1 D)
                </span>
                <p className="text-white text-xs sm:text-sm font-sans mt-1.5 drop-shadow-md">
                  <strong>2.69 Brilliance Index</strong> • 2.4x Higher Rainbow Fire
                </p>
                <p className="text-emerald-300 font-bold text-xs sm:text-base font-sans drop-shadow-md">
                  From ₹24,900 <span className="text-[10px] text-gray-300 font-normal">(Ethical & Conflict-Free)</span>
                </p>
              </div>
            </div>

            {/* LEFT SIDE / CLIPPED FOREGROUND (MINED DIAMOND) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <div
                className="absolute inset-0"
                style={{ width: containerRef.current?.clientWidth || '100%' }}
              >
                <img
                  src={
                    activeLighting === 'sunlight'
                      ? 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop'
                      : 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop'
                  }
                  alt="Standard Mined Diamond"
                  className="w-full h-full object-cover filter contrast-90 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                
                {/* Diamond Label & Specs (Left Side) */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-left z-10 pointer-events-none">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-black/80 backdrop-blur-md text-gray-200 border border-white/20 rounded-full font-sans text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-lg">
                    Traditional Mined Diamond
                  </span>
                  <p className="text-white text-xs sm:text-sm font-sans mt-1.5 drop-shadow-md">
                    <strong>2.42 Brilliance Index</strong> • Standard White Light
                  </p>
                  <p className="text-gray-300 font-bold text-xs sm:text-base font-sans drop-shadow-md">
                    ₹3,50,000+ <span className="text-[10px] text-gray-400 font-normal">(High Markup & Mining)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* SLIDER DIVIDER LINE & HANDLE */}
            <div
              className="absolute inset-y-0 w-0.5 sm:w-1 bg-[#D4AF37] pointer-events-none shadow-[0_0_15px_rgba(212,175,55,0.9)]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#022C22] border-2 border-[#D4AF37] text-[#D4AF37] flex items-center justify-center shadow-2xl">
                <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              </div>
            </div>

            {/* Bottom Drag Instruction Pill */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/75 backdrop-blur-md text-white rounded-full font-sans text-[10px] sm:text-xs tracking-wider flex items-center gap-2 border border-white/10 pointer-events-none shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Drag slider left & right to inspect optical brilliance</span>
            </div>
          </div>

          {/* 3 Value Pillars Under Slider */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E8E5DF] text-center shadow-xs">
              <span className="font-serif text-lg sm:text-xl font-bold text-[#064E3B] block">2.69 vs 2.42</span>
              <span className="font-sans text-xs font-bold text-[#18181B] block mt-0.5">Higher Refractive Index</span>
              <p className="font-sans text-[11px] text-gray-500 mt-1">Moissanite bends light sharper, emitting more rainbow brilliance.</p>
            </div>
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E8E5DF] text-center shadow-xs">
              <span className="font-serif text-lg sm:text-xl font-bold text-[#B89035] block">9.25 Hardness</span>
              <span className="font-sans text-xs font-bold text-[#18181B] block mt-0.5">Lifetime Mohs Durability</span>
              <p className="font-sans text-[11px] text-gray-500 mt-1">Second hardest gemstone on Earth. Impervious to scratches forever.</p>
            </div>
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E8E5DF] text-center shadow-xs">
              <span className="font-serif text-lg sm:text-xl font-bold text-[#064E3B] block">100% Passes</span>
              <span className="font-sans text-xs font-bold text-[#18181B] block mt-0.5">Thermal Diamond Testers</span>
              <p className="font-sans text-[11px] text-gray-500 mt-1">Tests positive as real diamond on standard professional testers.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
