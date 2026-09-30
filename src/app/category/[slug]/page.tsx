'use client';

import React, { useState, useMemo, use } from 'react';
import { SHAPES, Product } from '@/lib/data';
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
import Link from 'next/link';

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

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { getProductsByCategory } = useProducts();
  const rawProducts = getProductsByCategory(slug);

  const [selectedShape, setSelectedShape] = useState<string>('all');
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync shape filter if navigated via /category/rings?shape=Round etc.
  React.useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const urlShape = p.get('shape');
      if (urlShape) {
        setSelectedShape(urlShape);
        setCurrentPage(1);
      }
    } catch {}
  }, []);

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
      title: 'Bridal Stacks & Ring Sets',
      subtitle: 'Contoured crown and tiara bands engineered to frame oval, pear, and round solitaires.',
    },
    necklace: {
      title: 'Moissanite & Gemstone Necklaces',
      subtitle: 'Effortless brilliance and handcrafted pendants suspended on pure 925 Silver and Solid Gold chains.',
    },
    pendant: {
      title: 'Solitaire Moissanite Pendants',
      subtitle: 'Effortless brilliance suspended on Italian 925 Silver and 18K Solid Gold chains.',
    },
    'lesbian-ring': {
      title: 'Sculptural Couple & Lesbian Rings',
      subtitle: 'Art Deco handcrafted romantic couple kiss and sculptural promise rings in solid gold & sterling silver.',
    },
    earrings: {
      title: 'Moissanite Stud & Drop Earrings',
      subtitle: 'Daily wear luxury featuring comfort screw-backs and certified VVS1 center stones.',
    },
    bracelet: {
      title: 'Tennis & Fine Gemstone Bracelets',
      subtitle: 'Hand-set brilliance crafted for radiant everyday elegance and wrist luxury.',
    },
    'nose-ring': {
      title: 'Fine Nose Pins & Rings',
      subtitle: 'Dainty handcrafted nose jewelry with sparkling lab-created and natural gemstones.',
    },
    'belly-rings': {
      title: 'Designer Belly & Navel Rings',
      subtitle: 'Artisan crafted body jewelry with shimmering moissanite and gemstones.',
    },
  };

  const currentCategory = categoryTitles[slug] || {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Collection`,
    subtitle: 'Meticulously handcrafted in pure 925 Sterling Silver & BIS Hallmarked Solid Gold.',
  };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const PRODUCTS_PER_PAGE = 8;

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

    return rawProducts
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
  }, [rawProducts, searchQuery, selectedShape, selectedMetal, sortBy]);

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
    <div className="w-full min-h-screen bg-[#FFF0F5]">
      {/* Category Hero Banner */}
      <section className="bg-[#592D37] text-[#FFF0F5] py-16 md:py-20 border-b border-[#D39EAA]/30 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D39EAA]/20 border border-[#D39EAA]/40 text-[#D39EAA] rounded-full text-[11px] font-sans font-bold tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Signature Atelier Collection
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-[#FFF0F5]">
            {currentCategory.title}
          </h1>
          <div className="w-20 h-[1.5px] bg-[#C88E91] mx-auto mb-6" />
          <p className="font-sans text-sm sm:text-base text-[#FFF0F5]/80 max-w-2xl mx-auto leading-relaxed mb-6">
            {currentCategory.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-sans text-[#FFF0F5]/70">
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-[#D39EAA]" /> GRA Lab Certified
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#D39EAA]" /> 100% Lifetime Buyback
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-[#D39EAA]" /> Free Insured Delivery
            </span>
          </div>
        </div>
      </section>

      {/* Shape filter chips */}
      <ShapeFilterBar selectedShape={selectedShape} onSelectShape={handleShapeChange} />

      {/* Products Grid Section */}
      <section className="py-6 sm:py-10 max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Filter bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[#E8E5DF] gap-3 sm:gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#18181B]">
              {selectedShape === 'all' ? 'All Designs' : `${selectedShape} Cut`}
            </h2>
            <p className="font-sans text-xs text-gray-500 mt-0.5">
              Showing {filteredProducts.length > 0 ? `${startIndex}–${endIndex}` : 0} of {filteredProducts.length} certified jewelry pieces
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Search Input for Category */}
            <div className="relative flex-1 sm:flex-initial min-w-[180px] sm:min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search designs in this collection..."
                className="w-full bg-white border border-[#E8E5DF] rounded-xl pl-8 pr-7 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans text-[#18181B] focus:outline-none focus:border-[#C88E91] shadow-xs placeholder:text-gray-400"
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
              className="flex-1 sm:flex-initial bg-white border border-[#E8E5DF] rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans text-[#18181B] focus:outline-none focus:border-[#C88E91]"
            >
              <option value="all">All Metals</option>
              <option value="Silver">925 Sterling Silver</option>
              <option value="Yellow Gold">18K Yellow Gold</option>
              <option value="Rose Gold">18K Rose Gold</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="flex-1 sm:flex-initial bg-white border border-[#E8E5DF] rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans text-[#18181B] focus:outline-none focus:border-[#C88E91]"
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
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 w-full max-w-full">
              {paginatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>

            {/* Boutique Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 pt-6 border-t border-[#E8E5DF] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-gray-500 font-sans">
                  Showing page <strong className="text-[#18181B] font-semibold">{currentPage}</strong> of{' '}
                  <strong className="text-[#18181B] font-semibold">{totalPages}</strong> ({filteredProducts.length} designs)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3.5 py-2 bg-white border border-[#E8E5DF] text-[#18181B] disabled:opacity-30 rounded-xl text-xs font-semibold hover:border-[#D39EAA] transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-xs select-none active:scale-95"
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
                              ? 'bg-[#18181B] text-[#D39EAA] shadow-md border border-[#18181B]'
                              : 'bg-white text-gray-600 hover:text-[#18181B] hover:border-[#D39EAA] border border-[#E8E5DF]'
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
                    className="px-3.5 py-2 bg-white border border-[#E8E5DF] text-[#18181B] disabled:opacity-30 rounded-xl text-xs font-semibold hover:border-[#D39EAA] transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-xs select-none active:scale-95"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
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
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-[#18181B] text-[#D39EAA] font-sans text-xs font-bold uppercase tracking-widest rounded-lg"
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
