'use client';

import React, { useState, useMemo } from 'react';
import { SHAPES } from '@/lib/data';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/products/ProductCard';
import ShapeFilterBar from '@/components/sections/ShapeFilterBar';
import MoissaniteComparison from '@/components/sections/MoissaniteComparison';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import RingSizeGuide from '@/components/sections/RingSizeGuide';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FaqSection from '@/components/sections/FaqSection';
import CustomJewelryBanner from '@/components/sections/CustomJewelryBanner';
import { Sparkles, ShieldCheck, Truck, Award, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

function getPaginationRange(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | string)[] = [];
  pages.push(1);

  if (current > 3) {
    pages.push('ellipsis-1');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('ellipsis-2');
  }

  pages.push(total);
  return pages;
}

export default function ShopPage() {
  const { products } = useProducts();
  const [selectedShape, setSelectedShape] = useState<string>('all');
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PRODUCTS_PER_PAGE = 8;

  // Sync shape filter if visited via /shop?shape=...
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlShape = params.get('shape');
      if (urlShape) {
        setSelectedShape(urlShape);
        setCurrentPage(1);
      }
    } catch {}
  }, []);

  const handleShapeChange = (shape: string) => {
    setSelectedShape(shape);
    setCurrentPage(1);
  };

  const handleMetalChange = (metal: string) => {
    setSelectedMetal(metal);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const queryTokens = query.split(/\s+/).filter(Boolean);

    return products
      .filter((p) => {
        if (queryTokens.length > 0) {
          const searchable = [
            p.name,
            p.category,
            p.shape,
            p.metal,
            p.primaryGemstone || '',
            p.secondaryGemstone || '',
            p.ringStyle || '',
            p.description || '',
          ].join(' ').toLowerCase();

          const matches = queryTokens.every((token) => searchable.includes(token));
          if (!matches) return false;
        }

        const matchesShape =
          selectedShape === 'all' ||
          (p.shape && p.shape.toLowerCase() === selectedShape.toLowerCase()) ||
          (p.name && p.name.toLowerCase().includes(selectedShape.toLowerCase()));

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
  }, [products, searchQuery, selectedShape, selectedMetal, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;

  // Clamp page if filtered count drops
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (newPage: number) => {
    const clamped = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(clamped);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const startIndex = filteredProducts.length > 0 ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 : 0;
  const endIndex = Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length);

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
      <ShapeFilterBar selectedShape={selectedShape} onSelectShape={handleShapeChange} />

      {/* Grid */}
      <section className="py-6 sm:py-10 max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[#E8E5DF] gap-3 sm:gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#022C22]">
              {selectedShape === 'all' ? 'All Jewelry Designs' : `${selectedShape} Cut Jewels`}
            </h2>
            <p className="font-sans text-xs text-gray-500 mt-0.5">
              Showing {filteredProducts.length > 0 ? `${startIndex}–${endIndex}` : 0} of {filteredProducts.length} certified jewelry pieces
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Quick Search */}
            <div className="relative flex-1 sm:flex-initial min-w-[180px] sm:min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search rings & styles..."
                className="w-full bg-white border border-[#E8E5DF] rounded-xl pl-8 pr-7 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans text-[#022C22] focus:outline-none focus:border-[#D4AF37] shadow-xs placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={selectedMetal}
              onChange={(e) => handleMetalChange(e.target.value)}
              className="flex-1 sm:flex-initial bg-white border border-[#E8E5DF] rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans text-[#022C22] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">All Metals</option>
              <option value="Silver">925 Sterling Silver</option>
              <option value="Yellow Gold">18K Yellow Gold</option>
              <option value="Rose Gold">18K Rose Gold</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
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
          {paginatedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

        {/* Boutique Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 pt-6 border-t border-[#E8E5DF] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-500 font-sans">
              Showing page <strong className="text-[#022C22] font-semibold">{currentPage}</strong> of{' '}
              <strong className="text-[#022C22] font-semibold">{totalPages}</strong> ({filteredProducts.length} designs)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3.5 py-2 bg-white border border-[#E8E5DF] text-[#022C22] disabled:opacity-30 rounded-xl text-xs font-semibold hover:border-[#D4AF37] transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-xs select-none active:scale-95"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {getPaginationRange(currentPage, totalPages).map((item, idx) => {
                  if (typeof item === 'string') {
                    return (
                      <span key={`${item}-${idx}`} className="px-1 text-gray-400 text-xs select-none">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handlePageChange(item)}
                      className={`min-w-[34px] h-[34px] px-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none active:scale-95 ${
                        currentPage === item
                          ? 'bg-[#022C22] text-[#D4AF37] shadow-md border border-[#022C22]'
                          : 'bg-white text-gray-700 hover:text-[#022C22] hover:border-[#D4AF37] border border-[#E8E5DF]'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3.5 py-2 bg-white border border-[#E8E5DF] text-[#022C22] disabled:opacity-30 rounded-xl text-xs font-semibold hover:border-[#D4AF37] transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-xs select-none active:scale-95"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
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
