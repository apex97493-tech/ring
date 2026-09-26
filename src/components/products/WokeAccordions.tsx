'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ShieldCheck, Truck, RotateCcw, Sparkles, HelpCircle, FileText } from 'lucide-react';
import { Product } from '@/lib/data';

interface WokeAccordionsProps {
  product: Product;
  selectedMetal?: string;
  selectedCarat?: string;
}

export default function WokeAccordions({ product, selectedMetal, selectedCarat }: WokeAccordionsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: true,
    shipping: false,
    returns: false,
    care: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentMetal = selectedMetal || product.metal || '925 sterling silver';
  const currentCarat = selectedCarat || product.carat || '2.00 CT';
  const bespokeText = product.bespokeNotice || (product.readyToShip ? 'READY TO SHIP • DISPATCHES IN 24-48 HRS' : 'BESPOKE! SHIPS IN 2-3 WEEKS!');

  return (
    <div className="my-8 max-w-5xl mx-auto px-4 font-sans divide-y divide-[#E8E5DF] border-t border-b border-[#E8E5DF]">
      {/* 1. DESCRIPTION ACCORDION */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection('description')}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <span className="font-serif text-base sm:text-lg font-bold text-[#18181B] group-hover:text-[#8C6A1F] transition-colors">
            Description
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              openSections.description ? 'rotate-180 text-[#8C6A1F]' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {openSections.description && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-2 space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
                <p className="font-serif text-base text-[#18181B] font-semibold">
                  {currentCarat} {product.shape} Cut Ring | Moissanite Ring in Gold & 925 Sterling Silver
                </p>

                <div className="inline-block px-3 py-1.5 bg-[#FAF3E0] text-[#8C6A1F] border border-[#8C6A1F]/30 rounded-md font-bold text-xs tracking-wider uppercase">
                  {bespokeText}
                </div>

                <div className="space-y-1.5 pt-1">
                  <p>
                    <span className="font-bold text-[#18181B]">Material: </span>
                    {currentMetal}
                  </p>
                  <p>
                    <span className="font-bold text-[#18181B]">Stone used: </span>
                    GRA certified moissanites. Passes thermal diamond test.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li><span className="font-semibold text-gray-800">Clarity:</span> {product.diamondClarity || product.clarity || 'Flawless (FL) / VVS1'}</li>
                    <li><span className="font-semibold text-gray-800">Colour:</span> {product.diamondColor || product.colorGrade || 'D-Colorless (Highest White Grade)'}</li>
                    <li><span className="font-semibold text-gray-800">Cut:</span> {currentCarat} {product.shape} Cut with Maximum Fire Refraction</li>
                    <li><span className="font-semibold text-gray-800">Type:</span> {product.category.toUpperCase()}</li>
                    <li><span className="font-semibold text-gray-800">Plating:</span> Anti-Tarnish Multi-Layer Rhodium & High-Carat Gold</li>
                    <li><span className="font-semibold text-gray-800">Country of Origin:</span> Handcrafted in India by Master Artisans</li>
                  </ul>
                </div>

                {product.description && (
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    {product.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                      <p key={idx} className="text-gray-700 leading-relaxed text-sm">
                        {line.trim()}
                      </p>
                    ))}
                  </div>
                )}

                {product.features && product.features.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="font-semibold text-[#18181B] text-sm mb-2">What&apos;s Included:</p>
                    <ul className="space-y-1.5">
                      {product.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-[#8C6A1F] mt-0.5 flex-shrink-0">✦</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 flex items-center gap-2 text-emerald-800 font-medium text-xs">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Complimentary 100-Day Polish Warranty & Velvet Presentation Box included.</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. SHIPPING & DELIVERY ACCORDION */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection('shipping')}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <span className="font-serif text-base sm:text-lg font-bold text-[#18181B] group-hover:text-[#8C6A1F] transition-colors">
            Shipping & Insured Delivery
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              openSections.shipping ? 'rotate-180 text-[#8C6A1F]' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {openSections.shipping && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-2 space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
                <p>
                  Every piece is individually handcrafted and cast to order. Ready-to-ship designs dispatch within 24-48 hours; bespoke pieces ship within 2-3 weeks.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                  <li><span className="font-semibold text-gray-800">100% Insured Transit:</span> Full transit insurance covers your jewelry until it reaches your doorstep.</li>
                  <li><span className="font-semibold text-gray-800">Discreet Tamper-Proof Packaging:</span> Delivered in unmarked luxury packaging with digital OTP verification.</li>
                  <li><span className="font-semibold text-gray-800">Courier Partners:</span> Shipped via BlueDart Express, Delhivery Air, and DTDC Priority across India.</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. RETURNS & LIFETIME BUYBACK ACCORDION */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection('returns')}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <span className="font-serif text-base sm:text-lg font-bold text-[#18181B] group-hover:text-[#8C6A1F] transition-colors">
            Returns, Exchanges & Lifetime Upgrade
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              openSections.returns ? 'rotate-180 text-[#8C6A1F]' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {openSections.returns && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-2 space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
                <p>
                  We stand 100% behind the craftsmanship of every AURA creation.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                  <li><span className="font-semibold text-gray-800">15-Day Exchange:</span> If the size or style isn&apos;t flawless, exchange it within 15 days in unworn condition.</li>
                  <li><span className="font-semibold text-gray-800">100% Lifetime Buyback:</span> Trade in or upgrade your moissanite and gold jewelry anytime at transparent market valuation.</li>
                  <li><span className="font-semibold text-gray-800">Free Resizing Support:</span> Complimentary 1-size adjustment within 30 days of delivery.</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. CARE & AUTHENTICITY ACCORDION */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection('care')}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <span className="font-serif text-base sm:text-lg font-bold text-[#18181B] group-hover:text-[#8C6A1F] transition-colors">
            Authenticity & Jewelry Care
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              openSections.care ? 'rotate-180 text-[#8C6A1F]' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {openSections.care && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-2 space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
                <p>
                  Moissanite registers 9.25 on the Mohs hardness scale (second only to diamond) and will never lose its fire, cloud, or fade over time.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                  <li><span className="font-semibold text-gray-800">GRA Certificate:</span> Includes individual serial number matched to an online international verification card.</li>
                  <li><span className="font-semibold text-gray-800">Cleaning:</span> Gently soak in lukewarm water with mild dish soap and brush with a soft toothbrush. Rinse and pat dry with the provided lint-free polishing cloth.</li>
                  <li><span className="font-semibold text-gray-800">Storage:</span> Store in your velvet AURA box to prevent contact with other hard gemstones.</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
