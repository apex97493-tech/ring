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
  const details = product.itemDetails || {};

  const currentMetal = selectedMetal || details['Metal'] || product.metal || '925 Sterling Silver';
  const currentCarat = selectedCarat || product.carat || '2.00 CT';

  const karatage =
    product.karatage ||
    details['Metal'] ||
    (currentMetal.toLowerCase().includes('gold') ? '14k / 18k Solid Gold' : '925 Sterling Silver / 14k Gold');

  const materialColor =
    product.materialColor ||
    (currentMetal.toLowerCase().includes('rose')
      ? 'Rose Gold'
      : currentMetal.toLowerCase().includes('yellow')
      ? 'Yellow Gold'
      : 'Silver / White Gold');

  const grossWeight = details['Weight'] || product.grossWeight || '3.5G (approx)';
  const stoneSize = details['Stone Size'] || details['Size'] || (product.shape === 'Round' ? '8.0mm' : '7x9mm');
  const mainStone = details['Main stone'] || details['Main Stone'] || details['Primary Gemstone'] || product.primaryGemstone || 'Moissanite';
  const secondaryStone = details['Secondary Stone'] || details['Secondary Gemstone(s)'] || product.secondaryGemstone || 'CZ Diamond Accents';
  const diamondType = `${mainStone} (${details['Method'] || 'Handmade Fine Jewelry'})`;
  const diamondClarity = product.diamondClarity || product.clarity || 'VVS1 / Flawless (FL)';
  const diamondColor = details['Stone Color'] || details['Color'] || product.diamondColor || 'Colorless (D-Grade)';
  const shapeName = details['Stone Shape'] || details['Cut/Shape'] || (product.shape ? `${product.shape} Cut` : 'Oval Cut');
  const settingStyle = details['Style'] || product.settingStyle || 'Art Deco / Designer Solitaire';
  const ringSizeRange = details['Ring Size'] || 'US 4 to US 10 (Free Custom Resizing)';
  const occasion = details['Occasion'] || product.occasion || 'Engagement, Wedding, Anniversary, Promise Ring';
  const country = details['Country of Manufacture'] || 'India (Jaipur Atelier)';

  return (
    <div className="my-10 max-w-5xl mx-auto px-4 font-sans">
      {/* Centered Black Badge */}
      <div className="flex justify-center mb-6">
        <div className="bg-[#18181B] text-[#FAF8F5] text-xs font-bold tracking-[0.2em] px-6 py-2 rounded-xs uppercase shadow-xs">
          PRODUCT DETAILS & SPECIFICATIONS
        </div>
      </div>

      <div className="space-y-4">
        {/* Card 1: Metal & Ring Structure Details */}
        <div className="bg-[#F6F2EB] border border-[#E8E2D7] rounded-xl p-5 shadow-2xs">
          <h3 className="font-serif text-sm font-bold text-[#18181B] mb-3 pb-2 border-b border-[#E3DBD0]/70 flex items-center gap-2">
            <span>Metal & Ring Specifications</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {karatage}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Karatage / Base
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
                Selected Metal
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {ringSizeRange}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Ring Sizes Available
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Primary & Secondary Gemstone Details */}
        <div className="bg-[#F6F2EB] border border-[#E8E2D7] rounded-xl p-5 shadow-2xs">
          <h3 className="font-serif text-sm font-bold text-[#18181B] mb-3 pb-2 border-b border-[#E3DBD0]/70 flex items-center gap-2">
            <span>Gemstone & Stone Dimensions</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {mainStone}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Primary Stone
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

            <div>
              <span className="text-xs font-bold text-[#18181B] block text-[#8C6A1F]">
                {stoneSize}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Stone Dimensions
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {diamondColor}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Stone Colour
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {secondaryStone}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Secondary Stones
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Atelier Crafting & Occasion Details */}
        <div className="bg-[#F6F2EB] border border-[#E8E2D7] rounded-xl p-5 shadow-2xs">
          <h3 className="font-serif text-sm font-bold text-[#18181B] mb-3 pb-2 border-b border-[#E3DBD0]/70 flex items-center gap-2">
            <span>Atelier Crafting & Certification</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {settingStyle}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Style / Setting
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {details['Method'] || '100% Handmade'}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Crafting Method
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {occasion}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Occasion
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#18181B] block">
                {country}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                Country of Manufacture
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
