'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

const faqs = [
  {
    question: 'What is Moissanite and does it pass electronic diamond testers?',
    answer:
      'Yes, 100%! Moissanite (Silicon Carbide) is a gemstone originally found in meteorites. Because its thermal conductivity matches natural diamond, standard diamond testing pens test positive for diamond. It boasts a higher refractive index (2.65 vs 2.42) and more fire dispersion (0.104 vs 0.044) than mined diamonds, giving you greater sparkle for life.',
  },
  {
    question: 'Will Moissanite ever get cloudy, dull, or lose its sparkle?',
    answer:
      'Never. Moissanite has an exceptional hardness of 9.25 on the Mohs scale (second only to diamond). Its atomic crystalline structure is indestructible under normal conditions, impervious to sunlight, water, perfumes, or sweat. We guarantee lifetime brilliance with our warranty card.',
  },
  {
    question: 'Are your rings certified and hallmarked?',
    answer:
      'Yes. Every Moissanite ring comes with an individual Global Gemological Research Academy (GRA) certificate detailing its Carat weight, D-Color grade, VVS1 Clarity, and Cut symmetry. The serial number is microscopically laser-inscribed on the girdle of the stone. Our silver pieces are stamped 925, and solid gold variants are officially BIS Hallmarked.',
  },
  {
    question: 'What is your 100% Lifetime Buyback and Exchange Policy?',
    answer:
      'We offer an industry-first 100% exchange value policy. If you ever want to upgrade your ring to a larger carat size, a different stone cut, or upgrade from Silver to 18K Solid Gold, we credit 100% of your original purchase price toward the new piece.',
  },
  {
    question: 'Can I order a custom design or custom ring size?',
    answer:
      'Absolutely! We specialize in bespoke bridal jewelry. If you have a specific CAD design, family heirloom inspiration, or custom ring size (below US 4 or above US 10), simply tap our WhatsApp Support button to consult directly with our 3D master artisans.',
  },
  {
    question: 'How long does shipping take and is the package insured?',
    answer:
      'All ready-to-ship orders are dispatched within 24-48 hours via Bluedart / Delhivery Air Express (delivery within 2-4 business days across India). Every parcel is 100% insured against loss or transit damage and delivered in discreet, tamper-evident armored packaging with luxury unboxing presentation.',
  },
  {
    question: 'How should I clean and care for my Moissanite ring?',
    answer:
      'Moissanite is easy to maintain. Simply soak it in warm water with mild liquid dish soap for 5-10 minutes, gently brush with a soft toothbrush around the prongs, rinse with clean water, and pat dry with the complimentary microfiber jewelry cloth included in your order box.',
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0); // First open by default

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faqs" className="py-20 bg-[#FDFBF7] border-t border-[#E8E5DF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4E8C1]/60 text-[#8C6A1F] rounded-full text-xs font-sans font-bold tracking-widest uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Client Care & Clarity
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#18181B] mb-4">
            Frequently Asked Questions
          </h2>
          <div className="w-20 h-[1.5px] bg-[#B89035] mx-auto mb-6" />
          <p className="font-sans text-sm sm:text-base text-gray-600">
            Everything you need to know about our certified Moissanite stones, hallmarking, delivery, and lifetime guarantees.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#E8E5DF] overflow-hidden transition-all duration-200 shadow-xs"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-serif text-lg font-bold text-[#18181B] hover:text-[#8C6A1F] transition-colors cursor-pointer select-none"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8C6A1F] flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 font-sans text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-[#FDFBF7]/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
