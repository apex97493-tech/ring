'use client';

import React, { useState, useMemo } from 'react';
import { products, SHAPES } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import ShapeFilterBar from '@/components/sections/ShapeFilterBar';
import MoissaniteComparison from '@/components/sections/MoissaniteComparison';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import RingSizeGuide from '@/components/sections/RingSizeGuide';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FaqSection from '@/components/sections/FaqSection';
import CustomJewelryBanner from '@/components/sections/CustomJewelryBanner';
import { Sparkles, ShieldCheck, Truck, Award } from 'lucide-react';

export default function ShopPage() {
  const [selectedShape, setSelectedShape] = useState<string>('all');
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesShape = selectedShape === 'all' || p.shape === selectedShape;
        const matchesMetal =
          selectedMetal === 'all' ||
          p.variants.some((v) => v.metal.toLowerCase().includes(selectedMetal.toLowerCase()));
        return matchesShape && matchesMetal;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [selectedShape, selectedMetal, sortBy]);

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7]">
      {/* Shop Hero */}
      <section className="bg-[#022C22] text-[#FDFBF7] py-16 md:py-20 border-b border-[#D4AF37]/30 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] rounded-full text-[11px] font-sans font-bold tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Complete Fine Jewelry Collection
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
            The Royal Moissanite Collection
          </h1>
          <div className="w-20 h-[1.5px] bg-[#D4AF37] mx-auto mb-6" />
          <p className="font-sans text-sm sm:text-base text-[#FDFBF7]/80 max-w-2xl mx-auto leading-relaxed mb-6">
            Handcrafted with individual GRA lab certification, ethical VVS1 D-Color center stones, and 100% lifetime buyback assurance.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-sans text-[#F3E5AB]">
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-[#D4AF37]" /> GRA Lab Certified
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> 100% Lifetime Buyback
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-[#34D399]" /> Free Insured Delivery
            </span>
          </div>
        </div>
      </section>

      {/* Shape filter chips */}
      <ShapeFilterBar selectedShape={selectedShape} onSelectShape={setSelectedShape} />

      {/* Grid */}
      <section className="py-6 sm:py-10 max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[#E8E5DF] gap-3 sm:gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#022C22]">
              {selectedShape === 'all' ? 'All Jewelry Designs' : `${selectedShape} Cut Jewels`}
            </h2>
            <p className="font-sans text-xs text-gray-500 mt-0.5">
              Showing {filteredProducts.length} certified jewelry pieces
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={selectedMetal}
              onChange={(e) => setSelectedMetal(e.target.value)}
              className="flex-1 sm:flex-initial bg-white border border-[#E8E5DF] rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans text-[#022C22] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">All Metals</option>
              <option value="Silver">925 Sterling Silver</option>
              <option value="Yellow Gold">18K Yellow Gold</option>
              <option value="Rose Gold">18K Rose Gold</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-initial bg-white border border-[#E8E5DF] rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans text-[#022C22] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 w-full max-w-full">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Educational & Trust suite */}
      <MoissaniteComparison />
      <WhyChooseUs />
      <RingSizeGuide />
      <ReviewsSection />
      <FaqSection />
      <CustomJewelryBanner />
    </div>
  );
}
