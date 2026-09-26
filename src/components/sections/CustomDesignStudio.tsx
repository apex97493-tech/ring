'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MessageCircle,
  Gem,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Upload,
  ArrowRight,
} from 'lucide-react';

const SILHOUETTES = [
  { id: 'solitaire', name: 'Royal Solitaire', desc: 'Timeless high-elevation claw basket' },
  { id: 'vintage', name: 'Art Deco Milgrain', desc: 'Antique beaded edging with filigree' },
  { id: 'botanical', name: 'Botanical Twig & Leaf', desc: 'Hand-sculpted organic nature vines' },
  { id: 'hidden-halo', name: 'Hidden Diamond Halo', desc: 'Secret collar of pavé diamonds' },
  { id: 'toi-et-moi', name: 'Toi et Moi (Two-Stone)', desc: 'Dual complementary gemstone bypass' },
];

const STONE_CUTS = [
  { id: 'Oval', name: 'Modern Oval', icon: '✨' },
  { id: 'Emerald', name: 'Royal Emerald', icon: '💎' },
  { id: 'Round', name: 'Round Brilliant', icon: '👑' },
  { id: 'Pear', name: 'Teardrop Pear', icon: '💧' },
  { id: 'Cushion', name: 'Crushed-Ice Cushion', icon: '🧊' },
];

const METALS_LIST = [
  { id: 'silver', name: '925 Solid Sterling Silver (Rhodium Plated)', basePrice: 3499 },
  { id: '14k', name: '14K Solid Gold (Yellow / White / Rose)', basePrice: 28900 },
  { id: '18k', name: '18K Solid Royal Gold (High Karat Luster)', basePrice: 38900 },
  { id: 'plat', name: '950 Pure Solid Platinum (Heirloom Density)', basePrice: 48900 },
];

const CARAT_SIZES = ['1.50 CT', '2.00 CT', '2.50 CT', '3.00 CT'];

export default function CustomDesignStudio() {
  const [selectedSilhouette, setSelectedSilhouette] = useState(SILHOUETTES[0]);
  const [selectedCut, setSelectedCut] = useState(STONE_CUTS[0]);
  const [selectedMetal, setSelectedMetal] = useState(METALS_LIST[0]);
  const [selectedCarat, setSelectedCarat] = useState('2.00 CT');
  const [customNotes, setCustomNotes] = useState('');

  const handleWhatsAppQuote = () => {
    const sanitizedNotes = customNotes
      .replace(/<[^>]*>?/gm, '')
      .replace(/[\r\n]+/g, ' ')
      .slice(0, 200);

    const message = [
      '*BESPOKE CUSTOM JEWELRY INQUIRY (AURA ATELIER)*',
      '',
      `• Setting Silhouette: ${selectedSilhouette.name}`,
      `• Center Stone: ${selectedCut.name} (${selectedCarat} Moissanite)`,
      `• Precious Metal: ${selectedMetal.name}`,
      sanitizedNotes ? `• Custom Request / Pinterest Idea: "${sanitizedNotes}"` : '',
      '',
      '*I would like a complimentary 3D CAD render and price quotation!*',
    ].filter(Boolean).join('\n');

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919999999999?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="custom-studio" className="py-12 sm:py-24 bg-[#022C22] text-white relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#064E3B] rounded-full filter blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/20 rounded-full filter blur-[140px] opacity-30 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 rounded-full text-[11px] sm:text-xs font-sans font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Bespoke Artisan CAD Studio
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#FDFBF7] mb-4">
            Design Your Dream Heirloom
          </h2>
          <div className="w-16 h-[1.5px] bg-[#D4AF37] mx-auto mb-4" />
          <p className="font-sans text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Have a Pinterest inspiration, sketch, or antique design? Choose your dream configuration below or send us your photo. Our master jewelers will craft a <strong>complimentary 3D CAD model within 24 hours</strong>.
          </p>
        </div>

        {/* Studio Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column: Interactive Configuration Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Silhouette */}
            <div className="bg-[#043327]/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-[#D4AF37]/25 shadow-royal">
              <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mb-2">
                Step 1: Choose Ring Setting Style
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SILHOUETTES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSilhouette(s)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedSilhouette.id === s.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]'
                        : 'border-white/10 bg-black/20 hover:border-white/30'
                    }`}
                  >
                    <span className="font-serif text-sm font-bold text-white block">
                      {s.name}
                    </span>
                    <span className="font-sans text-[11px] text-gray-300 leading-tight block mt-0.5">
                      {s.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Stone Cut & Carat */}
            <div className="bg-[#043327]/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-[#D4AF37]/25 shadow-royal">
              <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mb-2">
                Step 2: Center Stone Cut & Size
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {STONE_CUTS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCut(c)}
                    className={`p-2.5 rounded-xl border text-center font-sans text-xs transition-all cursor-pointer ${
                      selectedCut.id === c.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/20 font-bold text-white ring-1 ring-[#D4AF37]'
                        : 'border-white/10 bg-black/20 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    <span className="block text-base mb-0.5">{c.icon}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>

              {/* Carat Select */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <span className="font-sans text-xs text-gray-300 flex-shrink-0">Center Carat:</span>
                <div className="flex gap-2 flex-wrap">
                  {CARAT_SIZES.map((ct) => (
                    <button
                      key={ct}
                      onClick={() => setSelectedCarat(ct)}
                      className={`px-3 py-1 rounded-lg font-sans text-xs transition-all cursor-pointer ${
                        selectedCarat === ct
                          ? 'bg-[#D4AF37] text-[#022C22] font-bold'
                          : 'bg-black/30 text-gray-300 hover:text-white border border-white/10'
                      }`}
                    >
                      {ct}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Precious Metal */}
            <div className="bg-[#043327]/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-[#D4AF37]/25 shadow-royal">
              <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mb-2">
                Step 3: Select Precious Metal Purity
              </span>
              <div className="space-y-2">
                {METALS_LIST.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMetal(m)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedMetal.id === m.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/20 ring-1 ring-[#D4AF37]'
                        : 'border-white/10 bg-black/20 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3.5 h-3.5 rounded-full border border-white/40 flex items-center justify-center ${
                          selectedMetal.id === m.id ? 'bg-[#D4AF37]' : ''
                        }`}
                      />
                      <span className="font-sans text-xs text-white">{m.name}</span>
                    </div>
                    <span className="font-sans text-xs font-bold text-[#D4AF37]">
                      Starts ₹{m.basePrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4: Notes / Pinterest description */}
            <div className="bg-[#043327]/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-[#D4AF37]/25 shadow-royal">
              <label className="block font-sans text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] mb-1.5">
                Have a Pinterest Ring or Specific Instructions? (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Please add secret emerald stones inside the inner band or send a photo via WhatsApp..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs font-sans text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Right Column: Live Configuration Summary Card (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#064E3B] to-[#022C22] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/40 shadow-2xl sticky top-28">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <span className="font-sans text-xs text-[#D4AF37] font-bold tracking-widest uppercase">
                Bespoke Atelier Specification
              </span>
              <span className="bg-[#ECFDF5] text-[#065F46] font-sans text-[10px] font-bold px-2 py-0.5 rounded-full">
                Free 3D CAD Included
              </span>
            </div>

            {/* Visual Ring Spec Summary */}
            <div className="space-y-3 font-sans text-xs mb-6">
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-gray-300">Setting Style:</span>
                <strong className="text-white text-right">{selectedSilhouette.name}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-gray-300">Center Gemstone:</span>
                <strong className="text-[#D4AF37] text-right">
                  {selectedCarat} {selectedCut.name} (VVS1 D)
                </strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-gray-300">Precious Metal:</span>
                <strong className="text-white text-right">{selectedMetal.name.split('(')[0]}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-gray-300">Lab Certification:</span>
                <strong className="text-emerald-400 text-right">GRA Gemological Report</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-gray-300">Handcrafting Timeline:</span>
                <span className="text-white flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> 7–10 Business Days
                </span>
              </div>
            </div>

            {/* Estimated Price */}
            <div className="bg-black/30 p-4 rounded-xl border border-white/10 mb-6">
              <span className="font-sans text-[10px] uppercase tracking-wider text-gray-400 block mb-0.5">
                Estimated Starting Investment
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-[#D4AF37]">
                  ₹{selectedMetal.basePrice.toLocaleString('en-IN')}
                </span>
                <span className="font-sans text-xs text-gray-300">
                  (Includes Ring Box & Insured Shipping)
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleWhatsAppQuote}
              className="w-full py-4 bg-[#D4AF37] hover:bg-white text-[#022C22] font-sans text-xs font-bold tracking-widest uppercase transition-all rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer mb-3"
            >
              <MessageCircle className="w-4 h-4 text-[#064E3B]" />
              <span>Get Free 3D CAD on WhatsApp</span>
            </button>

            {/* Reassurance points */}
            <div className="space-y-1.5 font-sans text-[11px] text-gray-300 pt-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Unlimited CAD revisions until 100% satisfied</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>You approve wax resin model before final gold casting</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                <span>Lifetime prong & craftsmanship warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
