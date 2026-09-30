'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  ShieldCheck,
  Truck,
  ArrowRight,
  Search,
  X,
} from 'lucide-react';
import { SHAPES } from '@/lib/data';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/products/ProductCard';
import ShapeFilterBar from '@/components/sections/ShapeFilterBar';
import MoissaniteComparison from '@/components/sections/MoissaniteComparison';
import CutPersonalityGuide from '@/components/sections/CutPersonalityGuide';


import WhyChooseUs from '@/components/sections/WhyChooseUs';
import RingSizeGuide from '@/components/sections/RingSizeGuide';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FaqSection from '@/components/sections/FaqSection';
import CustomJewelryBanner from '@/components/sections/CustomJewelryBanner';

import UnboxingExperience from '@/components/sections/UnboxingExperience';
import MetalPurityGuide from '@/components/sections/MetalPurityGuide';

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

const slides = [
  {
    id: 0,
    type: 'hero', // The royal emerald shape with rotating levitating ring
  },
  {
    id: 1,
    type: 'promo',
    image:
      'https://i.etsystatic.com/40882668/r/il/003823/8343343079/il_fullxfull.8343343079_agny.jpg',
    titleTop: 'New',
    titleMain: 'Arrivals',
    subtitle: 'Discover The',
    highlightPrefix: 'Royal',
    highlightSuffix: 'Collection',
    description: 'VVS1 D-Color Moissanite Solitaires',
  },
  {
    id: 2,
    type: 'promo',
    image:
      'https://i.etsystatic.com/40882668/r/il/ef3b53/8339199783/il_fullxfull.8339199783_lv2w.jpg',
    titleTop: 'Custom',
    titleMain: 'Design',
    subtitle: 'Create Your',
    highlightPrefix: 'Dream',
    highlightSuffix: 'Ring',
    description: 'Consult Directly With Master Artisans On WhatsApp',
  },
  {
    id: 3,
    type: 'full-image',
    image: '/images/diamond_shapes_banner.jpg',
  },
];

const collections = [
  { name: 'Rings', slug: 'rings', img: '/images/home-rings.jpg' },
  { name: 'Band', slug: 'band', img: '/images/home-band.jpg' },
  { name: 'Lesbian Ring', slug: 'lesbian-ring', img: '/images/home-lesbian-ring.jpg' },
  { name: 'Pendant', slug: 'pendant', img: '/images/home-pendant.jpg' },
  { name: 'Earrings', slug: 'earrings', img: '/images/home-earrings.jpg' },
  { name: 'Necklace', slug: 'necklace', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop' },
  { name: 'Bracelet', slug: 'bracelet', img: '/images/home-bracelet.jpg' },
  { name: 'Nose Ring', slug: 'nose-ring', img: '/images/home-nose-ring.jpg' },
  { name: 'Belly Rings', slug: 'belly-rings', img: '/images/home-belly-rings.jpg' },
  { name: 'Ring Set', slug: 'ring-set', img: '/images/home-ring-set.jpg' },
];

export default function Home() {
  const { products } = useProducts();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedShape, setSelectedShape] = useState<string>('all');
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PRODUCTS_PER_PAGE = 8;

  // Auto-play loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

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

  // Filter and Sort Logic
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
          p.variants.some((v) =>
            v.metal.toLowerCase().includes(selectedMetal.toLowerCase())
          );
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
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (newPage: number) => {
    const clamped = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(clamped);
    if (typeof window !== 'undefined') {
      const el = document.getElementById('collection');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
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
      {/* ============================================================ */}
      {/* 1. ROYAL EMERALD ANIMATED HERO CAROUSEL                      */}
      {/* ============================================================ */}
      <section className="relative h-[45vh] sm:h-[60vh] lg:h-[90vh] w-full overflow-hidden bg-[#FFF0F5]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {slides[currentSlide].type === 'hero' ? (
              // SLIDE 1: Royal Emerald Shape with 3D Levitating & Rotating Ring
              <div className="relative w-full h-full flex items-center justify-center lg:pt-0 lg:pb-0 bg-[#FFF0F5]">
                <div className="relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex flex-row items-center justify-between gap-2 sm:gap-6">
                  {/* Left: Editorial Text Content */}
                  <div className="w-1/2 flex flex-col justify-center text-left">
                    <div className="inline-flex items-center gap-1 sm:gap-2 self-start px-2 sm:px-3 py-0.5 sm:py-1 bg-[#B76E79]/10 border border-[#B76E79]/30 text-[#B76E79] rounded-full text-[8px] sm:text-xs font-sans font-bold tracking-[0.1em] sm:tracking-[0.25em] uppercase mb-2 sm:mb-6 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                      <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#D39EAA] flex-shrink-0" />
                      <span className="truncate">Royal Heritage</span>
                    </div>

                    <h1 className="font-serif text-lg sm:text-5xl md:text-7xl lg:text-8xl text-[#592D37] mb-2 sm:mb-6 leading-[1.1] sm:leading-[1.05] tracking-tight">
                      A Legacy in <br />
                      <span className="text-[#D39EAA] italic font-light">Every Carat.</span>
                    </h1>

                    <p className="font-serif text-[9px] sm:text-xl text-[#592D37]/80 mb-4 sm:mb-10 font-medium max-w-md leading-snug sm:leading-relaxed">
                      Discover ethical VVS1 D-Color Moissanite that outshines natural diamonds with 2.4x more fire. Handcrafted in BIS Hallmarked Gold & 925 Sterling Silver.
                    </p>

                    <div className="flex flex-col sm:flex-row items-start gap-1.5 sm:gap-4">
                      <a
                        href="#collection"
                        className="inline-block bg-[#592D37] text-[#D39EAA] px-3 sm:px-12 py-1.5 sm:py-5 font-sans text-[8px] sm:text-[11px] font-bold tracking-[0.1em] sm:tracking-[0.25em] uppercase hover:bg-[#D39EAA] hover:text-[#592D37] transition-colors shadow-royal border border-[#D39EAA]/40 text-center whitespace-nowrap"
                      >
                        Explore Solitaires
                      </a>
                      <a
                        href="#comparison"
                        className="inline-block bg-transparent text-[#592D37] border border-[#592D37]/30 px-3 sm:px-8 py-1.5 sm:py-5 font-sans text-[8px] sm:text-[11px] font-bold tracking-[0.1em] sm:tracking-[0.25em] uppercase hover:border-[#D39EAA] hover:text-[#D39EAA] transition-colors text-center whitespace-nowrap"
                      >
                        Moissanite Guide
                      </a>
                    </div>
                  </div>

                  {/* Right: Levitating & Rotating 3D Solitaire Ring */}
                  <div className="w-1/2 flex items-center justify-end relative">

                    <motion.div
                      animate={{
                        y: [0, -18, 0],
                        rotateY: [0, 8, -8, 0],
                        rotateZ: [0, -1.5, 1.5, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                      className="relative w-full max-w-[160px] sm:max-w-[480px] aspect-square flex items-center justify-center"
                    >
                      <Image
                        src="https://i.etsystatic.com/40882668/r/il/c5d69c/8083961552/il_fullxfull.8083961552_n07y.jpg"
                        alt="Floating Royal Solitaire Ring"
                        width={800}
                        height={800}
                        quality={100}
                        unoptimized
                        priority
                        className="w-[85%] md:w-[92%] max-w-none object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)]"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            ) : slides[currentSlide].type === 'full-image' ? (
              // SLIDE 4: Full Image Banner
              <div className="relative w-full h-full flex items-center justify-center cursor-pointer overflow-hidden bg-[#FFF0F5]">
                <div className="absolute inset-0 z-0">
                  <Image
                    src={slides[currentSlide].image || '/images/ai_ring1_front.jpg'}
                    alt="Banner"
                    fill
                    quality={100}
                    unoptimized
                    priority
                    className="object-contain object-center grayscale contrast-125 brightness-105 mix-blend-darken"
                  />
                </div>
              </div>
            ) : (
              // SLIDE 2, 3: Promotional Slides
              <div className="relative w-full h-full bg-[#FFF0F5]">
                <div className="absolute inset-0 z-0">
                  <Image
                    src={slides[currentSlide].image || '/images/ai_ring1_front.jpg'}
                    alt="Banner"
                    fill
                    quality={100}
                    unoptimized
                    priority
                    className="object-cover object-center"
                  />
                  {/* Subtle dark gradient just behind text for readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
                </div>

                <div className="absolute inset-0 z-10 flex flex-col justify-center px-4 sm:px-16 md:px-24 lg:px-32">
                  <div className="max-w-2xl text-[#FFF0F5]">
                    <div className="flex items-baseline gap-2 sm:gap-4 mb-1 sm:mb-2">
                      <h2 className="font-serif text-2xl sm:text-5xl md:text-7xl italic font-light tracking-wider text-[#D39EAA]">
                        {slides[currentSlide].titleTop}
                      </h2>
                      <h1 className="font-serif text-3xl sm:text-6xl md:text-8xl tracking-tight text-white">
                        {slides[currentSlide].titleMain}
                      </h1>
                    </div>

                    <div className="border border-[#D39EAA]/50 backdrop-blur-sm px-3 py-1 sm:px-6 sm:py-2 inline-block mb-2 sm:mb-3 min-w-[140px] sm:min-w-[280px]">
                      <p className="font-sans text-[10px] sm:text-base sm:text-lg tracking-widest text-[#FFF0F5] uppercase font-semibold">
                        {slides[currentSlide].subtitle}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-2 sm:gap-4 mb-2 sm:mb-4">
                      <span className="font-serif text-3xl sm:text-6xl md:text-8xl tracking-tighter text-white">
                        {slides[currentSlide].highlightPrefix}
                      </span>
                      <span className="font-serif text-xl sm:text-4xl md:text-6xl italic font-light text-[#D39EAA]">
                        {slides[currentSlide].highlightSuffix}
                      </span>
                    </div>

                    <p className="font-serif text-xs sm:text-lg sm:text-xl italic text-[#FFF0F5]/85 tracking-wider mb-4 sm:mb-8">
                      {slides[currentSlide].description}
                    </p>

                    <div>
                      <a
                        href="#collection"
                        className="inline-block bg-[#D39EAA] text-[#592D37] px-4 py-2 sm:px-8 sm:py-3.5 font-sans text-[9px] sm:text-xs font-bold tracking-widest uppercase hover:bg-white transition-colors shadow-lg"
                      >
                        Claim Offer Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-[65%] sm:top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 border border-[#D39EAA]/60 rounded-full flex items-center justify-center text-[#D39EAA] bg-[#592D37]/60 backdrop-blur-xs hover:bg-[#D39EAA] hover:text-[#592D37] transition-all cursor-pointer shadow-md"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-[65%] sm:top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 border border-[#D39EAA]/60 rounded-full flex items-center justify-center text-[#D39EAA] bg-[#592D37]/60 backdrop-blur-xs hover:bg-[#D39EAA] hover:text-[#592D37] transition-all cursor-pointer shadow-md"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>

        {/* Carousel Indicator Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all border border-[#D39EAA] cursor-pointer ${
                currentSlide === idx
                  ? 'bg-[#D39EAA] scale-125 shadow-gold'
                  : 'bg-transparent'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. CURATED COLLECTIONS SHOWCASE (PREVIOUS POPULAR SECTION)   */}
      {/* ============================================================ */}
      <section className="py-10 sm:py-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 bg-[#FFF0F5]">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <p className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#B76E79] uppercase mb-1.5 sm:mb-2">
            Signature Collections
          </p>
          <h2 className="font-serif text-2xl sm:text-5xl text-[#592D37] mb-2 sm:mb-3 italic">
            Curated Collections
          </h2>
          <div className="w-12 sm:w-16 h-[1.5px] bg-[#D39EAA] mx-auto mb-3 sm:mb-4" />
          <p className="font-sans text-xs sm:text-sm text-gray-600">
            Explore bespoke categories engineered to capture light with mathematical perfection.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-8">
          {collections.map((cat) => (
            <Link
              href={`/category/${cat.slug}`}
              key={cat.name}
              className="group cursor-pointer block"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#592D37] mb-4 rounded-xl border border-[#D39EAA]/30 shadow-royal">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#592D37]/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <span className="absolute bottom-3 inset-x-3 text-center font-sans text-[10px] tracking-widest text-[#D39EAA] uppercase font-bold">
                  View Collection →
                </span>
              </div>
              <h3 className="text-center font-serif text-xl tracking-wider text-[#592D37] group-hover:text-[#C88E91] transition-colors italic">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2.5 STONE CUT & PERSONALITY STORYTELLING GUIDE               */}
      {/* ============================================================ */}
      <CutPersonalityGuide />

      {/* ============================================================ */}
      {/* 3. SHAPE FILTER BAR                                         */}
      {/* ============================================================ */}
      <ShapeFilterBar selectedShape={selectedShape} onSelectShape={handleShapeChange} />
      {/* ============================================================ */}
      {/* 4. HIGH-CONVERTING MOISSANITE COLLECTION GRID                */}
      {/* ============================================================ */}
      <section id="collection" className="py-8 sm:py-12 max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
        {/* Title & Filter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[#E8E5DF] gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-[#B76E79] font-sans text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D39EAA]" />
              <span>GRA Certified VVS1 D-Color Jewels</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#592D37] tracking-tight">
              {selectedShape === 'all'
                ? 'Featured Solitaire Rings'
                : `${selectedShape} Cut Moissanite Solitaires`}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-gray-500 mt-0.5">
              Showing {filteredProducts.length > 0 ? `${startIndex}–${endIndex}` : 0} of {filteredProducts.length} certified jewelry creations
            </p>
          </div>

          {/* Filter & Sort & Search Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Quick Search in Collection */}
            <div className="relative flex-1 sm:flex-initial min-w-[180px] sm:min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search rings & styles..."
                className="w-full bg-white border border-[#E8E5DF] rounded-xl pl-8 pr-7 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans text-[#592D37] focus:outline-none focus:border-[#D39EAA] shadow-xs placeholder:text-gray-400"
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
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="flex-1 sm:flex-initial bg-white border border-[#E8E5DF] rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans text-[#592D37] focus:outline-none focus:border-[#D39EAA] cursor-pointer shadow-xs"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid: gap-2 on mobile so both columns fit seamlessly within 412px */}
        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 w-full max-w-full">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Luxury Pagination Navigation Bar */}
            {totalPages > 1 && (
              <div className="mt-10 pt-6 border-t border-[#E8E5DF] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-gray-500 font-sans">
                  Page <strong className="text-[#592D37] font-semibold">{currentPage}</strong> of{' '}
                  <strong className="text-[#592D37] font-semibold">{totalPages}</strong> ({filteredProducts.length} total designs)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3.5 py-2 bg-white border border-[#E8E5DF] text-[#592D37] disabled:opacity-30 rounded-xl text-xs font-semibold hover:border-[#D39EAA] transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-xs select-none active:scale-95"
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
                              ? 'bg-[#592D37] text-[#D39EAA] shadow-md border border-[#592D37]'
                              : 'bg-white text-gray-700 hover:text-[#592D37] hover:border-[#D39EAA] border border-[#E8E5DF]'
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
                    className="px-3.5 py-2 bg-white border border-[#E8E5DF] text-[#592D37] disabled:opacity-30 rounded-xl text-xs font-semibold hover:border-[#D39EAA] transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-xs select-none active:scale-95"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>

        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-[#E8E5DF] my-4">
            <p className="font-serif text-xl sm:text-2xl text-[#18181B] mb-2">No matching pieces found</p>
            <p className="font-sans text-xs text-gray-500 mb-6">
              Try switching your stone shape or metal filter to explore more designs.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedShape('all');
                setSelectedMetal('all');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-[#592D37] text-[#D39EAA] font-sans text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#C88E91] hover:text-white transition-all shadow-md cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* 5. THE SIGNATURE EDUCATIONAL & TRUST ATELIER SECTIONS        */}
      {/* ============================================================ */}
      {/* Interactive Sparkle Drag Slider */}


      {/* Deep Moissanite vs Diamond vs CZ Comparison Matrix */}
      <MoissaniteComparison />

      {/* Precious Metal & Karat Hallmarking Standards */}
      <MetalPurityGuide />

      {/* Why Choose Us / 6 Trust Guarantees */}
      <WhyChooseUs />

      {/* The Royal Unboxing Presentation Suite */}
      <UnboxingExperience />

      {/* Interactive Ring Size & Carat Visualizer Simulator */}
      <RingSizeGuide />

      {/* Verified Client Photo Reviews Wall */}
      <ReviewsSection />

      {/* Frequently Asked Questions Accordion */}
      <FaqSection />

      {/* Bespoke Custom CAD Studio & WhatsApp Support */}
      <CustomJewelryBanner />
    </div>
  );
}
