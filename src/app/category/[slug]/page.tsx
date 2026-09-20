'use client';

import React, { useState, useMemo, use } from 'react';
import { getProductsByCategory, SHAPES, Product } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import ShapeFilterBar from '@/components/sections/ShapeFilterBar';
import MoissaniteComparison from '@/components/sections/MoissaniteComparison';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import RingSizeGuide from '@/components/sections/RingSizeGuide';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FaqSection from '@/components/sections/FaqSection';
import CustomJewelryBanner from '@/components/sections/CustomJewelryBanner';
import { Sparkles, ShieldCheck, Truck, Award } from 'lucide-react';
import Link from 'next/link';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const rawProducts = getProductsByCategory(slug);

  const [selectedShape, setSelectedShape] = useState<string>('all');
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  const categoryTitles: Record<string, { title: string; subtitle: string }> = {
    rings: {
      title: 'Moissanite Solitaire Rings',
      subtitle: 'Discover handcrafted solitaire engagement and promise rings featuring GRA-certified D-Color VVS1 Moissanite stones.',
    },
    band: {
      title: 'Moissanite Eternity & Wedding Bands',
      subtitle: 'Continuous 360-degree sparkle designed to stack seamlessly with your solitaire ring.',
    },
    'ring-set': {
      title: 'Bridal Stacks & Tiara Rings',
      subtitle: 'Contoured crown and tiara bands engineered to frame oval, pear, and round solitaires.',
    },
    pendant: {
      title: 'Solitaire Moissanite Pendants',
      subtitle: 'Effortless brilliance suspended on Italian 925 Silver and 18K Solid Gold chains.',
    },
    earrings: {
      title: 'Moissanite Stud & Drop Earrings',
      subtitle: 'Daily wear luxury featuring comfort screw-backs and certified VVS1 center stones.',
    },
  };

  const currentCategory = categoryTitles[slug] || {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Collection`,
    subtitle: 'Meticulously handcrafted in pure 925 Sterling Silver & BIS Hallmarked Solid Gold.',
  };

  const filteredProducts = useMemo(() => {
    return rawProducts
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
  }, [rawProducts, selectedShape, selectedMetal, sortBy]);

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7]">
      {/* Category Hero Banner */}
      <section className="bg-[#18181B] text-[#FDFBF7] py-16 md:py-20 border-b border-[#D4AF37]/30 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] rounded-full text-[11px] font-sans font-bold tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Woke Exclusive Collection
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
            {currentCategory.title}
          </h1>
          <div className="w-20 h-[1.5px] bg-[#B89035] mx-auto mb-6" />
          <p className="font-sans text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6">
            {currentCategory.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-sans text-gray-300">
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-[#D4AF37]" /> GRA Lab Certified
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> 100% Lifetime Buyback
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-[#059669]" /> Free Insured Delivery
            </span>
          </div>
        </div>
      </section>

      {/* Shape filter chips */}
      <ShapeFilterBar selectedShape={selectedShape} onSelectShape={setSelectedShape} />

      {/* Products Grid Section */}
      <section className="py-6 sm:py-10 max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Filter bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[#E8E5DF] gap-3 sm:gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#18181B]">
              {selectedShape === 'all' ? 'All Designs' : `${selectedShape} Cut`}
            </h2>
            <p className="font-sans text-xs text-gray-500 mt-0.5">
              Showing {filteredProducts.length} certified jewelry pieces
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={selectedMetal}
              onChange={(e) => setSelectedMetal(e.target.value)}
              className="flex-1 sm:flex-initial bg-white border border-[#E8E5DF] rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans text-[#18181B] focus:outline-none focus:border-[#B89035]"
            >
              <option value="all">All Metals</option>
              <option value="Silver">925 Sterling Silver</option>
              <option value="Yellow Gold">18K Yellow Gold</option>
              <option value="Rose Gold">18K Rose Gold</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-initial bg-white border border-[#E8E5DF] rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans text-[#18181B] focus:outline-none focus:border-[#B89035]"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 w-full max-w-full">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#E8E5DF]">
            <p className="font-serif text-2xl text-[#18181B] mb-2">No matching products found</p>
            <p className="font-sans text-xs text-gray-500 mb-6">
              Try switching your stone shape or metal filter.
            </p>
            <button
              onClick={() => {
                setSelectedShape('all');
                setSelectedMetal('all');
              }}
              className="px-6 py-2.5 bg-[#18181B] text-[#D4AF37] font-sans text-xs font-bold uppercase tracking-widest rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* The Signature Woke Educational Bottom Suite */}
      <MoissaniteComparison />
      <WhyChooseUs />
      <RingSizeGuide />
      <ReviewsSection />
      <FaqSection />
      <CustomJewelryBanner />
    </div>
  );
}
