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
import { products, SHAPES } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import ShapeFilterBar from '@/components/sections/ShapeFilterBar';
import MoissaniteComparison from '@/components/sections/MoissaniteComparison';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import RingSizeGuide from '@/components/sections/RingSizeGuide';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FaqSection from '@/components/sections/FaqSection';
import CustomJewelryBanner from '@/components/sections/CustomJewelryBanner';

const slides = [
  {
    id: 0,
    type: 'hero', // The royal emerald shape with rotating levitating ring
  },
  {
    id: 1,
    type: 'promo',
    image:
      'https://images.unsplash.com/photo-1599643478524-fb505410a40f?q=80&w=2000&auto=format&fit=crop',
    titleTop: 'Buy',
    titleMain: 'One',
    subtitle: 'Get Jewellery Worth',
    highlightPrefix: '10,999',
    highlightSuffix: 'Free',
    description: 'Complimentary Solid Silver Pendant on First Purchase',
  },
  {
    id: 2,
    type: 'promo',
    image:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2000&auto=format&fit=crop',
    titleTop: 'New',
    titleMain: 'Arrivals',
    subtitle: 'Discover The',
    highlightPrefix: 'Royal',
    highlightSuffix: 'Collection',
    description: 'VVS1 D-Color Moissanite Solitaires',
  },
  {
    id: 3,
    type: 'promo',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop',
    titleTop: 'Custom',
    titleMain: 'Design',
    subtitle: 'Create Your',
    highlightPrefix: 'Dream',
    highlightSuffix: 'Ring',
    description: 'Consult Directly With Master Artisans On WhatsApp',
  },
];

const collections = [
  {
    name: 'Solitaire Rings',
    slug: 'rings',
    img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Eternity Bands',
    slug: 'band',
    img: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Ring Stacks',
    slug: 'ring-set',
    img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Pendants',
    slug: 'pendant',
    img: 'https://images.unsplash.com/photo-1599643478524-fb505410a40f?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Stud Earrings',
    slug: 'earrings',
    img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop&crop=top',
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedShape, setSelectedShape] = useState<string>('all');
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

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
  }, [selectedShape, selectedMetal, sortBy]);

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
                {/* Massive Royal Emerald Circle Backdrop */}
                <div className="absolute top-1/2 left-1/2 lg:left-[68%] -translate-y-1/2 -translate-x-1/2 lg:-translate-x-0 w-[140vw] h-[140vw] sm:w-[120vw] sm:h-[120vw] lg:w-[88vw] lg:h-[88vw] bg-[#064E3B] rounded-full z-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.6)]" />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
                  {/* Left: Editorial Text Content */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-center mb-8 lg:mb-0 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 self-center lg:self-start px-3.5 py-1 bg-[#064E3B]/10 border border-[#064E3B]/30 text-[#064E3B] rounded-full text-[10px] sm:text-xs font-sans font-bold tracking-[0.25em] uppercase mb-4 sm:mb-6">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Royal Heritage Atelier
                    </div>

                    <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#022C22] mb-4 sm:mb-6 leading-[1.05] tracking-tight">
                      A Legacy in <br />
                      <span className="text-[#D4AF37] italic font-light">Every Carat.</span>
                    </h1>

                    <p className="font-serif text-lg sm:text-xl text-[#022C22]/80 mb-8 sm:mb-10 font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
                      Discover ethical VVS1 D-Color Moissanite that outshines natural diamonds with 2.4x more fire. Handcrafted in BIS Hallmarked Gold & 925 Sterling Silver.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                      <a
                        href="#collection"
                        className="inline-block bg-[#022C22] text-[#D4AF37] px-10 sm:px-12 py-4 sm:py-5 font-sans text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[#D4AF37] hover:text-[#022C22] transition-colors shadow-royal border border-[#D4AF37]/40 text-center"
                      >
                        Explore Solitaires
                      </a>
                      <a
                        href="#comparison"
                        className="inline-block bg-transparent text-[#022C22] border border-[#022C22]/30 px-8 py-4 sm:py-5 font-sans text-[11px] font-bold tracking-[0.25em] uppercase hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors text-center"
                      >
                        Moissanite Guide
                      </a>
                    </div>
                  </div>

                  {/* Right: Levitating & Rotating 3D Solitaire Ring */}
                  <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
                    <motion.div
                      animate={{
                        y: [0, -25, 0],
                        rotateY: [0, 8, -8, 0],
                        rotateZ: [0, -1.5, 1.5, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                      className="relative w-full max-w-[420px] sm:max-w-[480px] aspect-square flex items-center justify-center"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop"
                        alt="Floating Royal Solitaire Ring"
                        className="w-[85%] md:w-[92%] max-w-none object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)]"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            ) : (
              // SLIDE 2, 3, 4: Promotional Emerald-Themed Slides
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
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#FDFBF7]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="font-sans text-xs font-bold tracking-[0.25em] text-[#064E3B] uppercase mb-2">
            The Emerald Archive
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#022C22] mb-3 italic">
            Curated Collections
          </h2>
          <div className="w-16 h-[1.5px] bg-[#D4AF37] mx-auto mb-4" />
          <p className="font-sans text-xs sm:text-sm text-gray-600">
            Explore bespoke categories engineered to capture light with mathematical perfection.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {collections.map((cat) => (
            <Link
              href={`/category/${cat.slug}`}
              key={cat.name}
              className="group cursor-pointer block"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#022C22] mb-4 rounded-xl border border-[#D4AF37]/30 shadow-royal">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <span className="absolute bottom-3 inset-x-3 text-center font-sans text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">
                  View Collection →
                </span>
              </div>
              <h3 className="text-center font-serif text-xl tracking-wider text-[#022C22] group-hover:text-[#B89035] transition-colors italic">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SHAPE FILTER BAR                                         */}
      {/* ============================================================ */}
      <ShapeFilterBar selectedShape={selectedShape} onSelectShape={setSelectedShape} />

      {/* ============================================================ */}
      {/* 4. HIGH-CONVERTING MOISSANITE COLLECTION GRID                */}
      {/* ============================================================ */}
      <section id="collection" className="py-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title & Filter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#E8E5DF] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-[#064E3B] font-sans text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>GRA Certified VVS1 D-Color Jewels</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#022C22] tracking-tight">
              {selectedShape === 'all'
                ? 'Featured Solitaire Rings'
                : `${selectedShape} Cut Moissanite Solitaires`}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-gray-500 mt-1">
              Showing {filteredProducts.length} certified jewelry creations
            </p>
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedMetal}
              onChange={(e) => setSelectedMetal(e.target.value)}
              className="bg-white border border-[#E8E5DF] rounded-xl px-3 py-2 text-xs font-sans text-[#022C22] focus:outline-none focus:border-[#D4AF37] cursor-pointer shadow-xs"
            >
              <option value="all">All Metals</option>
              <option value="Silver">925 Sterling Silver</option>
              <option value="Yellow Gold">18K Yellow Gold</option>
              <option value="Rose Gold">18K Rose Gold</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#E8E5DF] rounded-xl px-3 py-2 text-xs font-sans text-[#022C22] focus:outline-none focus:border-[#D4AF37] cursor-pointer shadow-xs"
            >
              <option value="featured">Featured / Bestsellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. THE SIGNATURE WOKE EDUCATIONAL & TRUST BOTTOM SECTIONS    */}
      {/* ============================================================ */}
      {/* Deep Moissanite vs Diamond vs CZ Comparison Matrix */}
      <MoissaniteComparison />

      {/* Why Choose Us / 6 Trust Guarantees */}
      <WhyChooseUs />

      {/* Interactive Ring Size & Carat Visualizer Simulator */}
      <RingSizeGuide />

      {/* Verified Client Photo Reviews Wall */}
      <ReviewsSection />

      {/* Frequently Asked Questions Accordion */}
      <FaqSection />

      {/* Bespoke Custom CAD Atelier & WhatsApp Concierge */}
      <CustomJewelryBanner />
    </div>
  );
}
