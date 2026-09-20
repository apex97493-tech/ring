'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 0,
    type: 'hero', // The rotating ring design
  },
  {
    id: 1,
    type: 'promo',
    image: "https://images.unsplash.com/photo-1599643478524-fb505410a40f?q=80&w=2000&auto=format&fit=crop", 
    titleTop: "Buy",
    titleMain: "One",
    subtitle: "Get Jewellery Worth",
    highlightPrefix: "10999",
    highlightSuffix: "Free",
    description: "For First Time Buyers",
  },
  {
    id: 2,
    type: 'promo',
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2000&auto=format&fit=crop", 
    titleTop: "New",
    titleMain: "Arrivals",
    subtitle: "Discover The",
    highlightPrefix: "Spring",
    highlightSuffix: "Collection",
    description: "Exclusive Designs",
  },
  {
    id: 3,
    type: 'promo',
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop", 
    titleTop: "Custom",
    titleMain: "Design",
    subtitle: "Create Your",
    highlightPrefix: "Dream",
    highlightSuffix: "Ring",
    description: "Consult with our experts",
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play loop: Slower transition to allow reading
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Changed to 5 seconds for a smoother, readable experience
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="bg-[var(--color-brand-cream)] w-full min-h-screen pb-20">
      
      {/* Unified Carousel Section */}
      <section className="relative h-[90vh] w-full overflow-hidden bg-[var(--color-brand-cream)]">
        
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
              // SLIDE 1: Rotating Ring Design
              <div className="relative w-full h-full flex items-center pt-20">
                {/* Massive Royal Emerald Shape */}
                <div className="absolute top-1/2 left-1/2 lg:left-[65%] -translate-y-1/2 -translate-x-1/2 lg:-translate-x-0 w-[150vw] h-[150vw] lg:w-[95vw] lg:h-[95vw] bg-[var(--color-brand-emerald)] rounded-full z-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
                  {/* Left: Text Content */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-center mb-16 lg:mb-0">
                    <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[var(--color-brand-emerald-dark)] font-bold mb-6">
                      Heritage of Excellence
                    </p>
                    <h1 className="font-serif text-6xl md:text-8xl text-[var(--color-brand-emerald-dark)] mb-6 leading-[1.05] tracking-tight">
                      A Legacy in <br/>
                      <span className="text-[var(--color-brand-gold)] italic">Every Carat.</span>
                    </h1>
                    <p className="font-serif text-xl text-[var(--color-brand-emerald-dark)]/80 mb-12 font-medium max-w-md leading-relaxed">
                      Discover unparalleled craftsmanship and ethically sourced diamonds, forged into timeless masterpieces.
                    </p>
                    <div>
                      <Link 
                        href="/products/imperial-emerald-solitaire" 
                        className="inline-block bg-[var(--color-brand-emerald-dark)] text-[var(--color-brand-gold)] px-12 py-5 font-sans text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-brand-emerald-dark)] transition-colors shadow-royal border border-[var(--color-brand-gold)]/30"
                      >
                        Explore High Jewelry
                      </Link>
                    </div>
                  </div>
                  
                  {/* Right: Levitating Ring */}
                  <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
                    <motion.div
                      animate={{ 
                        y: [0, -30, 0], 
                        rotateY: [0, 10, -10, 0],
                        rotateZ: [0, -1, 1, 0]
                      }}
                      transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                      className="relative w-full max-w-[500px] aspect-square flex items-center justify-center"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop" 
                        alt="Floating Single Diamond Ring" 
                        className="w-[80%] md:w-[90%] max-w-none object-contain mix-blend-screen drop-shadow-2xl opacity-90"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            ) : (
              // SLIDE 2, 3, 4: Promotional Image Designs
              <div className="relative w-full h-full bg-[var(--color-brand-emerald-dark)]">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={slides[currentSlide].image} 
                    alt="Banner" 
                    className="w-full h-full object-cover object-center opacity-70 mix-blend-luminosity"
                  />
                  {/* Dark emerald gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-emerald-dark)] via-[var(--color-brand-emerald-dark)]/70 to-transparent"></div>
                </div>

                {/* Text Content */}
                <div className="absolute inset-0 z-10 flex flex-col justify-center px-8 md:px-20 lg:px-32">
                  <div className="max-w-2xl text-[var(--color-brand-cream)]">
                    
                    <div className="flex items-baseline gap-4 mb-2">
                      <h2 className="font-serif text-5xl md:text-7xl italic font-light tracking-wider text-[var(--color-brand-gold)]">{slides[currentSlide].titleTop}</h2>
                      <h1 className="font-serif text-6xl md:text-8xl tracking-tight text-white">{slides[currentSlide].titleMain}</h1>
                    </div>
                    
                    <div className="border border-[var(--color-brand-gold)]/40 backdrop-blur-sm px-6 py-2 inline-block mb-2 min-w-[300px]">
                      <p className="font-sans text-lg tracking-widest text-[var(--color-brand-cream)] uppercase">{slides[currentSlide].subtitle}</p>
                    </div>
                    
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="font-serif text-6xl md:text-8xl tracking-tighter text-white">{slides[currentSlide].highlightPrefix}</span>
                      <span className="font-serif text-4xl md:text-6xl italic font-light text-[var(--color-brand-gold)]">{slides[currentSlide].highlightSuffix}</span>
                    </div>
                    
                    <div className="max-w-[400px] mt-4">
                      <p className="font-serif text-xl italic text-[var(--color-brand-cream)]/80 tracking-wider">
                        {slides[currentSlide].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-[var(--color-brand-gold)]/50 rounded-full flex items-center justify-center text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-brand-emerald-dark)] transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-[var(--color-brand-gold)]/50 rounded-full flex items-center justify-center text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-brand-emerald-dark)] transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentSlide(idx)} 
              className={`w-2.5 h-2.5 rounded-full transition-all border border-[var(--color-brand-gold)] ${currentSlide === idx ? 'bg-[var(--color-brand-gold)] scale-125' : 'bg-transparent shadow-[0_0_2px_black]'}`} 
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[var(--color-brand-cream)]">
        <h2 className="font-serif text-4xl text-center text-[var(--color-brand-emerald-dark)] mb-4 italic">Curated Collections</h2>
        <div className="w-16 h-[1px] bg-[var(--color-brand-gold)] mx-auto mb-16"></div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {[
            { name: 'Rings', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop&crop=bottom' },
            { name: 'Necklaces', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop' },
            { name: 'Earrings', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop&crop=top' },
            { name: 'Bracelets', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop&crop=left' },
            { name: 'Band', img: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=600&auto=format&fit=crop' },
            { name: 'Lesbian Ring', img: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=600&auto=format&fit=crop' },
            { name: 'Pendant', img: 'https://images.unsplash.com/photo-1599643478524-fb505410a40f?q=80&w=600&auto=format&fit=crop' },
            { name: 'Nose Ring', img: 'https://images.unsplash.com/photo-1599643478524-fb505410a40f?q=80&w=600&auto=format&fit=crop' },
            { name: 'Belly Rings', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop' },
            { name: 'Ring Set', img: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=600&auto=format&fit=crop' }
          ].map((cat) => (
            <Link href={`/category/${cat.name.toLowerCase().replace(/ /g, '-')}`} key={cat.name} className="group cursor-pointer block">
              <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-brand-emerald-dark)] mb-6 border border-[var(--color-brand-gold)]/20 shadow-lg">
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
              </div>
              <h3 className="text-center font-serif text-xl tracking-wider text-[var(--color-brand-emerald-dark)] group-hover:text-[var(--color-brand-gold)] transition-colors italic">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
