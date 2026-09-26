'use client';

import React from 'react';
import { Product } from '@/lib/data';
import { Sparkles, ShieldCheck, Check, Gem } from 'lucide-react';

interface WokeProductDetailsGridProps {
  product: Product;
  selectedMetal?: string;
  selectedCarat?: string;
}

export default function WokeProductDetailsGrid({
  product,
  selectedMetal,
  selectedCarat,
}: WokeProductDetailsGridProps) {
  const currentMetal = selectedMetal || product.metal || '925 Sterling Silver';
  const currentCarat = selectedCarat || product.carat || '2.00 CT';

  const karatage =
    product.karatage ||
    (currentMetal.toLowerCase().includes('gold') ? '14k / 18k Solid Gold' : '925 Sterling Silver / 14k Gold');

  const materialColor =
    product.materialColor ||
    (currentMetal.toLowerCase().includes('rose')
      ? 'Rose Gold'
      : currentMetal.toLowerCase().includes('yellow')
      ? 'Yellow Gold'
      : 'Silver / White Gold');

  const grossWeight = product.grossWeight || '3.75G (approx)';
  const diamondType = product.diamondType || 'Lab Grown Moissanite Diamond (Passes Thermal Tester)';
  const diamondClarity = product.diamondClarity || product.clarity || 'VVS1 / Flawless (FL)';
  const diamondColor = product.diamondColor || product.colorGrade || 'White (D-Color / Colorless)';
  const shapeName = product.shape ? `${product.shape} Brilliant Cut` : 'Round Portuguese Cut';
  const settingStyle = product.settingStyle || product.ringStyle || 'Crown Setting / Handcrafted Solitaire';

  return (
    <div className="my-10 max-w-5xl mx-auto px-4 font-sans">
      {/* Centered Black Badge */}
      <div className="flex justify-center mb-6">
        <div className="bg-[#18181B] text-[#FAF8F5] text-xs font-bold tracking-[0.2em] px-6 py-2 rounded-xs uppercase shadow-xs">
          PRODUCT DETAILS
        </div>
      </div>

      <div className="space-y-4">
        {/* Card 1: Metal Details */}
        <div className="bg-[#F6F2EB] border border-[#E8E2D7] rounded-xl p-5 shadow-2xs">
          <h3 className="font-serif text-sm font-bold text-[#18181B] mb-3 pb-2 border-b border-[#E3DBD0]/70 flex items-center gap-2">
            <span>Metal Details</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {karatage}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Karatage
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {materialColor}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Material Colour
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {grossWeight}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Gross Weight
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {currentMetal}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Metal
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {currentCarat}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Size / Carat
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Diamond / Moissanite Details */}
        <div className="bg-[#F6F2EB] border border-[#E8E2D7] rounded-xl p-5 shadow-2xs">
          <h3 className="font-serif text-sm font-bold text-[#18181B] mb-3 pb-2 border-b border-[#E3DBD0]/70 flex items-center gap-2">
            <span>Diamond & Gemstone Details</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {diamondClarity}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Diamond Clarity
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {diamondType}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Diamond Type
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {diamondColor}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Diamond Colour
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {shapeName}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Shape & Cut
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: General & Crafting Details */}
        <div className="bg-[#F6F2EB] border border-[#E8E2D7] rounded-xl p-5 shadow-2xs">
          <h3 className="font-serif text-sm font-bold text-[#18181B] mb-3 pb-2 border-b border-[#E3DBD0]/70 flex items-center gap-2">
            <span>General Crafting & Certification Details</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {settingStyle}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Architecture / Setting
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                GRA Lab Report & Authenticity QR
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Certification
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                Rhodium / 18k High-Polish
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Plating & Anti-Tarnish
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                India (Jaipur & Surat Atelier)
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Country of Origin
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
