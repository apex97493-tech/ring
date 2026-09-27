'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
} from 'lucide-react';
import { SHAPES } from '@/lib/data';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/products/ProductCard';
import ShapeFilterBar from '@/components/sections/ShapeFilterBar';
import MoissaniteComparison from '@/components/sections/MoissaniteComparison';
import InteractiveSparkleSlider from '@/components/sections/InteractiveSparkleSlider';
import CutPersonalityGuide from '@/components/sections/CutPersonalityGuide';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import RingSizeGuide from '@/components/sections/RingSizeGuide';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FaqSection from '@/components/sections/FaqSection';
import CustomJewelryBanner from '@/components/sections/CustomJewelryBanner';
import CustomDesignStudio from '@/components/sections/CustomDesignStudio';
import UnboxingExperience from '@/components/sections/UnboxingExperience';
import MetalPurityGuide from '@/components/sections/MetalPurityGuide';

const slides = [
  {
    id: 0,
    type: 'hero', // The royal emerald shape with rotating levitating ring
  },
  {
    id: 1,
    type: 'promo',
    image: '/images/ai_ring1_front.jpg',
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
    image: '/images/ai_ring2_front.jpg',
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

interface CollectionItem {
  name: string;
  slug: string;
  img: string;
  tagline: string;
  unit: string;
}

const collections: CollectionItem[] = [
  {
    name: 'Rings',
    slug: 'rings',
    img: '/uploads/etsy_4514460848_img1.jpg',
    tagline: 'Solitaire & Promise',
    unit: 'Designs',
  },
  {
    name: 'Band',
    slug: 'band',
    img: '/uploads/etsy_4580287314_img1.jpg',
    tagline: 'Eternity & Stacking',
    unit: 'Designs',
  },
  {
    name: 'Lesbian Ring',
    slug: 'lesbian-ring',
    img: '/uploads/etsy_4522231201_img1.jpg',
    tagline: 'Sculptural & Pride',
    unit: 'Designs',
  },
  {
    name: 'Pendant',
    slug: 'pendant',
    img: '/uploads/etsy_4574617829_img1.jpg',
    tagline: 'Solitaire & Drops',
    unit: 'Designs',
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    img: '/uploads/etsy_4529748804_img1.jpg',
    tagline: 'Huggies & Teardrops',
    unit: 'Pairs',
  },
  {
    name: 'Necklace',
    slug: 'necklace',
    img: '/uploads/etsy_4524005419_img1.jpg',
    tagline: 'Serpent & Beaded',
    unit: 'Designs',
  },
  {
    name: 'Bracelet',
    slug: 'bracelet',
    img: '/uploads/etsy_4516789064_img1.jpg',
    tagline: 'Tennis & Beaded',
    unit: 'Designs',
  },
  {
    name: 'Nose Ring',
    slug: 'nose-ring',
    img: '/uploads/etsy_4524485399_img1.jpg',
    tagline: 'Dainty Pins & Studs',
    unit: 'Designs',
  },
  {
    name: 'Belly Rings',
    slug: 'belly-rings',
    img: '/uploads/etsy_4529755774_img1.jpg',
    tagline: 'Lotus & Navel Bars',
    unit: 'Designs',
  },
  {
    name: 'Ring Set',
    slug: 'ring-set',
    img: '/uploads/etsy_4522722815_img1.jpg',
    tagline: 'Bridal Stacks & Sets',
    unit: 'Sets',
  },
];

export default function Home() {
  const { products, getProductsByCategory } = useProducts();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedShape, setSelectedShape] = useState<string>('all');
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Dynamic category product counts for showcase
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    collections.forEach((cat) => {
      if (cat.name === 'Pendant') {
        const pendantCount = products.filter(
          (p) =>
            (p.category === 'necklace' || p.category === 'pendant') &&
            (p.name.toLowerCase().includes('pendant') || p.name.toLowerCase().includes('charm'))
        ).length;
        counts[cat.name] = pendantCount || 10;
      } else if (cat.name === 'Necklace') {
        const neckCount = products.filter(
          (p) => p.category === 'necklace' || p.category === 'pendant'
        ).length;
        counts[cat.name] = neckCount || 24;
      } else {
        counts[cat.name] = getProductsByCategory(cat.slug).length;
      }
    });
    return counts;
  }, [products, getProductsByCategory]);

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

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesShape = selectedShape === 'all' || p.shape === selectedShape;
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
  }, [products, selectedShape, selectedMetal, sortBy]);

  // Luxury Pagination State (16 items per page for clean, fast browsing)
  const PRODUCTS_PER_PAGE = 16;
  const [currentPage, setCurrentPage] = useState(1);

  // Automatically reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedShape, selectedMetal, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const startIndex = filteredProducts.length > 0 ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 : 0;
  const endIndex = Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length);

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7]">
      {/* ============================================================ */}
      {/* 1. ROYAL EMERALD ANIMATED HERO CAROUSEL                      */}
      {/* ============================================================ */}
      <section className="relative h-[85vh] sm:h-[90vh] w-full overflow-hidden bg-[#FDFBF7]">
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
              <div className="relative w-full h-full flex items-center pt-8 sm:pt-12 bg-[#FDFBF7]">
                {/* Royal Emerald Circle Backdrop */}
                <div className="absolute top-1/2 left-1/2 lg:left-[68%] -translate-y-1/2 -translate-x-1/2 lg:-translate-x-0 w-[100vw] h-[100vw] sm:w-[120vw] sm:h-[120vw] lg:w-[88vw] lg:h-[88vw] bg-[#064E3B] rounded-full z-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.6)]" />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
                  {/* Left: Editorial Text Content */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-center mb-8 lg:mb-0 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 self-center lg:self-start px-3 py-1 bg-[#064E3B]/10 border border-[#064E3B]/30 text-[#064E3B] rounded-full text-[10px] sm:text-xs font-sans font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase mb-3 sm:mb-6">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Royal Heritage Collection
                    </div>

                    <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-[#022C22] mb-3 sm:mb-6 leading-[1.1] sm:leading-[1.05] tracking-tight">
                      A Legacy in <br />
                      <span className="text-[#D4AF37] italic font-light">Every Carat.</span>
                    </h1>

                    <p className="font-serif text-sm sm:text-xl text-[#022C22]/80 mb-6 sm:mb-10 font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
                      Discover ethical VVS1 D-Color Moissanite that outshines natural diamonds with 2.4x more fire. Handcrafted in BIS Hallmarked Gold & 925 Sterling Silver.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                      <a
                        href="#collection"
                        className="w-full sm:w-auto inline-block bg-[#022C22] text-[#D4AF37] px-8 sm:px-12 py-3.5 sm:py-5 font-sans text-[11px] font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase hover:bg-[#D4AF37] hover:text-[#022C22] transition-colors shadow-royal border border-[#D4AF37]/40 text-center"
                      >
                        Explore Solitaires
                      </a>
                      <a
                        href="#comparison"
                        className="w-full sm:w-auto inline-block bg-transparent text-[#022C22] border border-[#022C22]/30 px-6 sm:px-8 py-3.5 sm:py-5 font-sans text-[11px] font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors text-center"
                      >
                        Moissanite Guide
                      </a>
                    </div>
                  </div>

                  {/* Right: Levitating & Rotating 3D Solitaire Ring */}
                  <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
                    <motion.div
                      animate={{
                        y: [0, -18, 0],
                        rotateY: [0, 8, -8, 0],
                        rotateZ: [0, -1.5, 1.5, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                      className="relative w-full max-w-[320px] sm:max-w-[480px] aspect-square flex items-center justify-center"
                    >
                      <img
                        src="/images/diamond_front.png"
                        alt="Floating Royal Solitaire Ring"
                        className="w-[85%] md:w-[92%] max-w-none object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)]"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            ) : slides[currentSlide].type === 'full-image' ? (
              // SLIDE 4: Full Image Banner
              <div className="relative w-full h-full flex items-center justify-center cursor-pointer overflow-hidden bg-black">
                <img
                  src={slides[currentSlide].image}
                  alt="Banner"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ) : (
              // SLIDE 2, 3: Promotional Emerald-Themed Slides
              <div className="relative w-full h-full bg-[#022C22]">
                <div className="absolute inset-0 z-0">
                  <img
                    src={slides[currentSlide].image}
                    alt="Banner"
                    className="w-full h-full object-cover object-center opacity-65 mix-blend-luminosity"
                  />
                  {/* Dark Emerald Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#022C22] via-[#022C22]/80 to-transparent" />
                </div>

                <div className="absolute inset-0 z-10 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32">
                  <div className="max-w-2xl text-[#FDFBF7]">
                    <div className="flex items-baseline gap-4 mb-2">
                      <h2 className="font-serif text-5xl md:text-7xl italic font-light tracking-wider text-[#D4AF37]">
                        {slides[currentSlide].titleTop}
                      </h2>
                      <h1 className="font-serif text-6xl md:text-8xl tracking-tight text-white">
                        {slides[currentSlide].titleMain}
                      </h1>
                    </div>

                    <div className="border border-[#D4AF37]/50 backdrop-blur-sm px-6 py-2 inline-block mb-3 min-w-[280px]">
                      <p className="font-sans text-base sm:text-lg tracking-widest text-[#FDFBF7] uppercase font-semibold">
                        {slides[currentSlide].subtitle}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-4 mb-4">
                      <span className="font-serif text-6xl md:text-8xl tracking-tighter text-white">
                        {slides[currentSlide].highlightPrefix}
                      </span>
                      <span className="font-serif text-4xl md:text-6xl italic font-light text-[#D4AF37]">
                        {slides[currentSlide].highlightSuffix}
                      </span>
                    </div>

                    <p className="font-serif text-lg sm:text-xl italic text-[#FDFBF7]/85 tracking-wider mb-8">
                      {slides[currentSlide].description}
                    </p>

                    <div>
                      <a
                        href="#collection"
                        className="inline-block bg-[#D4AF37] text-[#022C22] px-8 py-3.5 font-sans text-xs font-bold tracking-widest uppercase hover:bg-white transition-colors shadow-lg"
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
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-[#D4AF37]/60 rounded-full flex items-center justify-center text-[#D4AF37] bg-[#022C22]/60 backdrop-blur-xs hover:bg-[#D4AF37] hover:text-[#022C22] transition-all cursor-pointer shadow-md"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-[#D4AF37]/60 rounded-full flex items-center justify-center text-[#D4AF37] bg-[#022C22]/60 backdrop-blur-xs hover:bg-[#D4AF37] hover:text-[#022C22] transition-all cursor-pointer shadow-md"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicator Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all border border-[#D4AF37] cursor-pointer ${
                currentSlide === idx
                  ? 'bg-[#D4AF37] scale-125 shadow-gold'
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
      <section className="py-10 sm:py-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 bg-[#FDFBF7]">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <p className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#064E3B] uppercase mb-1.5 sm:mb-2">
            Signature Collections
          </p>
          <h2 className="font-serif text-2xl sm:text-5xl text-[#022C22] mb-2 sm:mb-3 italic">
            Curated Collections
          </h2>
          <div className="w-12 sm:w-16 h-[1.5px] bg-[#D4AF37] mx-auto mb-3 sm:mb-4" />
          <p className="font-sans text-xs sm:text-sm text-gray-600">
            Explore bespoke Jaipur fine jewelry categories engineered with authentic gemstones and hand-set brilliance.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {collections.map((cat) => {
            const count = categoryCounts[cat.name] || 0;
            return (
              <Link
                href={`/category/${cat.slug}`}
                key={cat.name}
                className="group cursor-pointer block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#022C22] mb-3 rounded-2xl border border-[#D4AF37]/35 shadow-royal transition-all duration-500 group-hover:border-[#D4AF37] group-hover:shadow-gold/30">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-95 group-hover:opacity-100"
                    loading="lazy"
                  />
                  {/* Luxury Quantity Pill Badge */}
                  <span className="absolute top-2.5 right-2.5 bg-[#022C22]/90 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/50 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold tracking-wider shadow-md">
                    {count} {cat.unit}
                  </span>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/90 via-[#022C22]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  <span className="absolute bottom-3 inset-x-3 text-center font-sans text-[10px] tracking-widest text-[#D4AF37] group-hover:text-white uppercase font-bold transition-colors">
                    View Collection →
                  </span>
                </div>
                <h3 className="text-center font-serif text-lg sm:text-xl tracking-wider text-[#022C22] group-hover:text-[#B89035] transition-colors italic">
                  {cat.name}
                </h3>
                <p className="text-center font-sans text-[11px] text-[#064E3B] font-semibold tracking-wider uppercase mt-0.5">
                  {count} {cat.unit}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2.5 STONE CUT & PERSONALITY STORYTELLING GUIDE               */}
      {/* ============================================================ */}
      <CutPersonalityGuide />

      {/* ============================================================ */}
      {/* 3. SHAPE FILTER BAR                                         */}
      {/* ============================================================ */}
      <ShapeFilterBar selectedShape={selectedShape} onSelectShape={setSelectedShape} />

      {/* ============================================================ */}
      {/* 4. HIGH-CONVERTING MOISSANITE COLLECTION GRID                */}
      {/* ============================================================ */}
      <section id="collection" className="py-8 sm:py-12 max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
        {/* Title & Filter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[#E8E5DF] gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-[#064E3B] font-sans text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>GRA Certified VVS1 D-Color Jewels</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#022C22] tracking-tight">
              {selectedShape === 'all'
                ? 'Featured Solitaire Rings'
                : `${selectedShape} Cut Moissanite Solitaires`}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-gray-500 mt-0.5">
              Showing <span className="text-[#022C22] font-semibold">{startIndex}–{endIndex}</span> of{' '}
              <span className="text-[#022C22] font-semibold">{filteredProducts.length}</span> certified jewelry creations
            </p>
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={selectedMetal}
              onChange={(e) => setSelectedMetal(e.target.value)}
              className="flex-1 sm:flex-initial bg-white border border-[#E8E5DF] rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans text-[#022C22] focus:outline-none focus:border-[#D4AF37] cursor-pointer shadow-xs"
            >
              <option value="all">All Metals</option>
              <option value="Silver">925 Sterling Silver</option>
              <option value="Yellow Gold">18K Yellow Gold</option>
              <option value="Rose Gold">18K Rose Gold</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-initial bg-white border border-[#E8E5DF] rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans text-[#022C22] focus:outline-none focus:border-[#D4AF37] cursor-pointer shadow-xs"
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
                  Page <strong className="text-[#022C22] font-semibold">{currentPage}</strong> of{' '}
                  <strong className="text-[#022C22] font-semibold">{totalPages}</strong> ({filteredProducts.length} total designs)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3.5 py-2 bg-white border border-[#E8E5DF] text-[#022C22] disabled:opacity-30 rounded-xl text-xs font-semibold hover:border-[#D4AF37] transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {totalPages <= 7 ? (
                      Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => {
                            setCurrentPage(pageNum);
                            document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            currentPage === pageNum
                              ? 'bg-[#022C22] text-[#D4AF37] shadow-md border border-[#022C22]'
                              : 'bg-white text-gray-700 hover:text-[#022C22] hover:border-[#D4AF37] border border-[#E8E5DF]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))
                    ) : (
                      <>
                        {[1, 2].map((pageNum) => (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => {
                              setCurrentPage(pageNum);
                              document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              currentPage === pageNum
                                ? 'bg-[#022C22] text-[#D4AF37] shadow-md border border-[#022C22]'
                                : 'bg-white text-gray-700 hover:text-[#022C22] hover:border-[#D4AF37] border border-[#E8E5DF]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}

                        {currentPage > 3 && <span className="px-1 text-gray-400 text-xs">...</span>}

                        {currentPage > 2 && currentPage < totalPages - 1 && (
                          <button
                            type="button"
                            className="w-8 h-8 rounded-xl text-xs font-bold bg-[#022C22] text-[#D4AF37] shadow-md border border-[#022C22]"
                          >
                            {currentPage}
                          </button>
                        )}

                        {currentPage < totalPages - 2 && <span className="px-1 text-gray-400 text-xs">...</span>}

                        {[totalPages - 1, totalPages].map((pageNum) => (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => {
                              setCurrentPage(pageNum);
                              document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              currentPage === pageNum
                                ? 'bg-[#022C22] text-[#D4AF37] shadow-md border border-[#022C22]'
                                : 'bg-white text-gray-700 hover:text-[#022C22] hover:border-[#D4AF37] border border-[#E8E5DF]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3.5 py-2 bg-white border border-[#E8E5DF] text-[#022C22] disabled:opacity-30 rounded-xl text-xs font-semibold hover:border-[#D4AF37] transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-xs"
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
              }}
              className="px-6 py-2.5 bg-[#022C22] text-[#D4AF37] font-sans text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#B89035] hover:text-white transition-all shadow-md cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* 4.5 BESPOKE CUSTOM ATELIER / PINTEREST CAD STUDIO            */}
      {/* ============================================================ */}
      <CustomDesignStudio />

      {/* ============================================================ */}
      {/* 5. THE SIGNATURE WOKE EDUCATIONAL & TRUST BOTTOM SECTIONS    */}
      {/* ============================================================ */}
      {/* Interactive Sparkle Drag Slider */}
      <InteractiveSparkleSlider />

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
