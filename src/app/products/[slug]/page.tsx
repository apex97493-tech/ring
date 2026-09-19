'use client';

import React, { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { Truck, Shield, RefreshCcw, ChevronDown } from 'lucide-react';
import { getProductBySlug, Product } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const product = getProductBySlug(resolvedParams.slug);

  const [activeImage, setActiveImage] = useState(0);
  
  // These would typically come from the product database, but we'll mock them for all products for now
  const metals = [
    { name: "Platinum", color: "#E5E4E2" },
    { name: "18K White Gold", color: "#F3F4F6" },
    { name: "18K Yellow Gold", color: "#F4E0A6" },
    { name: "18K Rose Gold", color: "#D9A0A0" }
  ];
  const carats = ["1.00", "1.50", "2.00", "2.50"];
  const sizes = ["5", "6", "7", "8"];

  const [selectedMetal, setSelectedMetal] = useState(
    metals.find(m => m.name.toLowerCase() === product?.metal.toLowerCase()) || metals[0]
  );
  const [selectedCarat, setSelectedCarat] = useState(carats[1]);
  const [selectedSize, setSelectedSize] = useState(sizes[1]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-cream)] text-[var(--color-brand-emerald-dark)]">
        <div className="text-center">
          <h1 className="font-serif text-4xl mb-4">Product Not Found</h1>
          <Link href="/" className="underline text-[var(--color-brand-gold)]">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36 bg-[var(--color-brand-cream)]">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left: Product Info & Images */}
        <div className="lg:w-3/5 flex flex-col">
          {/* Mobile Title */}
          <div className="block lg:hidden mb-8 text-center">
            <h1 className="font-serif text-3xl text-[var(--color-brand-emerald-dark)] leading-tight mb-2 uppercase tracking-wide">
              {product.name}
            </h1>
            <p className="font-sans text-sm tracking-widest text-[var(--color-brand-emerald-dark)]/70 mb-4 uppercase">
              {product.stone} Centerpiece
            </p>
            <p className="font-serif text-3xl text-[var(--color-brand-emerald-dark)] italic">
              ${product.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </p>
          </div>

          {/* Main Image */}
          <div className="w-full bg-[var(--color-brand-cream)] relative overflow-hidden aspect-square flex items-center justify-center mb-6 border border-[var(--color-brand-gold)]/20 shadow-lg">
            <motion.img 
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              src={product.images[activeImage]} 
              alt={product.name}
              className="object-cover w-[90%] h-[90%] opacity-90 mix-blend-multiply"
            />
          </div>
          
          {/* Thumbnail Rail (3 Angles) */}
          <div className="flex gap-4 justify-center">
            {product.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                className={`relative w-20 h-24 bg-white transition-all ${activeImage === idx ? 'border-2 border-[var(--color-brand-gold)] opacity-100 shadow-md' : 'border border-[var(--color-brand-gold)]/20 opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt={`Angle ${idx + 1}`} className="object-cover w-full h-full p-1" />
              </button>
            ))}
          </div>

          {/* Desktop Product Title & Description */}
          <div className="hidden lg:block mt-16 text-center lg:text-left">
            <h1 className="font-serif text-4xl lg:text-5xl text-[var(--color-brand-emerald-dark)] leading-tight mb-3 uppercase tracking-wide">
              {product.name}
            </h1>
            <p className="font-sans text-sm tracking-[0.2em] text-[var(--color-brand-emerald-dark)]/70 mb-8 uppercase">
              Premium {product.stone} Collection
            </p>
            <p className="font-serif text-4xl text-[var(--color-brand-emerald-dark)] mb-8 italic">
              ${product.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </p>

            <ul className="space-y-4 mb-12 inline-block text-left">
              <li className="font-serif text-[var(--color-brand-emerald-dark)] text-lg flex items-center gap-4">
                <span className="w-1.5 h-1.5 bg-[var(--color-brand-gold)] rotate-45 inline-block"></span>
                Conflict-Free {product.stone}
              </li>
              <li className="font-serif text-[var(--color-brand-emerald-dark)] text-lg flex items-center gap-4">
                <span className="w-1.5 h-1.5 bg-[var(--color-brand-gold)] rotate-45 inline-block"></span>
                GIA / IGI Certified
              </li>
              <li className="font-serif text-[var(--color-brand-emerald-dark)] text-lg flex items-center gap-4">
                <span className="w-1.5 h-1.5 bg-[var(--color-brand-gold)] rotate-45 inline-block"></span>
                Handcrafted to Order
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Selection Card */}
        <div className="lg:w-2/5">
          <div className="bg-[var(--color-brand-emerald-dark)] border border-[var(--color-brand-gold)]/30 p-8 lg:p-10 lg:sticky lg:top-36 shadow-royal text-[var(--color-brand-cream)]">
            
            {/* Metal Selection */}
            <div className="mb-8">
              <label className="block font-sans text-[11px] tracking-[0.2em] uppercase text-[var(--color-brand-gold)] mb-4">
                Metal: <span className="text-[var(--color-brand-cream)]">{selectedMetal.name}</span>
              </label>
              <div className="flex gap-4">
                {metals.map((metal) => (
                  <button
                    key={metal.name}
                    onClick={() => setSelectedMetal(metal)}
                    className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${selectedMetal.name === metal.name ? 'border border-[var(--color-brand-gold)] p-1' : 'border border-transparent'}`}
                    title={metal.name}
                  >
                    <span className="w-full h-full rounded-full border border-black/20" style={{ backgroundColor: metal.color }}></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Carat Selection */}
            <div className="mb-8">
              <label className="block font-sans text-[11px] tracking-[0.2em] uppercase text-[var(--color-brand-gold)] mb-4">
                Stone Size (Carats):
              </label>
              <div className="flex flex-wrap gap-3">
                {carats.map((carat) => (
                  <button
                    key={carat}
                    onClick={() => setSelectedCarat(carat)}
                    className={`px-4 py-2 font-serif text-lg italic transition-all ${selectedCarat === carat ? 'bg-[var(--color-brand-gold)] text-[var(--color-brand-emerald-dark)]' : 'bg-transparent border border-[var(--color-brand-gold)]/40 text-[var(--color-brand-cream)] hover:border-[var(--color-brand-gold)]'}`}
                  >
                    {carat}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <label className="font-sans text-[11px] tracking-[0.2em] uppercase text-[var(--color-brand-gold)]">
                  Ring Size:
                </label>
                <button className="font-sans text-[10px] tracking-widest text-[var(--color-brand-cream)]/70 hover:text-[var(--color-brand-gold)] underline underline-offset-4 uppercase">Find Size</button>
              </div>
              <div className="relative">
                <select 
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-transparent border border-[var(--color-brand-gold)]/40 text-[var(--color-brand-cream)] font-serif text-lg px-4 py-3 appearance-none focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors rounded-none"
                >
                  {sizes.map(size => (
                    <option key={size} value={size} className="text-black">US Size {size}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-brand-gold)] pointer-events-none" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <button className="w-full bg-[var(--color-brand-gold)] text-[var(--color-brand-emerald-dark)] py-4 font-sans text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[var(--color-brand-cream)] transition-colors">
                Add to Bag
              </button>
              
              <button className="w-full bg-transparent border border-[var(--color-brand-gold)]/50 text-[var(--color-brand-gold)] py-4 font-sans text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[var(--color-brand-gold)]/10 transition-colors">
                Book a Consultation
              </button>
            </div>
            
            <div className="mt-8 space-y-4 pt-8 border-t border-[var(--color-brand-gold)]/20">
              <div className="flex items-center gap-4 text-sm text-[var(--color-brand-cream)]/90 font-serif italic">
                <Truck className="w-5 h-5 text-[var(--color-brand-gold)]" strokeWidth={1.5} />
                <span>Complimentary Insured Delivery</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-[var(--color-brand-cream)]/90 font-serif italic">
                <RefreshCcw className="w-5 h-5 text-[var(--color-brand-gold)]" strokeWidth={1.5} />
                <span>Complimentary Returns</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-[var(--color-brand-cream)]/90 font-serif italic">
                <Shield className="w-5 h-5 text-[var(--color-brand-gold)]" strokeWidth={1.5} />
                <span>Lifetime Craftsmanship Warranty</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mt-32 border-t border-[var(--color-brand-gold)]/30 pt-20">
        <h2 className="font-serif text-3xl lg:text-4xl text-center text-[var(--color-brand-emerald-dark)] mb-4 italic">The Heritage Details</h2>
        <div className="w-16 h-[1px] bg-[var(--color-brand-gold)] mx-auto mb-16"></div>
        
        <div className="flex flex-col md:flex-row gap-16 max-w-5xl mx-auto">
          <div className="md:w-3/5">
             <div className="flex border-b border-[var(--color-brand-gold)]/30 mb-8 gap-8">
               <button className="pb-4 font-sans text-xs tracking-widest uppercase font-bold border-b-2 border-[var(--color-brand-emerald-dark)] text-[var(--color-brand-emerald-dark)]">The Inspiration</button>
               <button className="pb-4 font-sans text-xs tracking-widest uppercase text-[var(--color-brand-emerald-dark)]/50 hover:text-[var(--color-brand-emerald-dark)]">Specifications</button>
             </div>
             <p className="font-serif text-xl text-[var(--color-brand-emerald-dark)] leading-relaxed italic">
               {product.description}
             </p>
          </div>
          <div className="md:w-2/5 bg-[var(--color-brand-emerald-dark)] text-[var(--color-brand-cream)] p-10 shadow-royal">
             <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-[var(--color-brand-gold)] mb-8">Technical Details</h3>
             <div className="space-y-4 font-serif text-lg">
               <div className="flex justify-between border-b border-[var(--color-brand-gold)]/20 pb-3">
                 <span className="text-[var(--color-brand-cream)]/70">Primary Stone</span><span className="text-[var(--color-brand-gold)]">{product.stone}</span>
               </div>
               <div className="flex justify-between border-b border-[var(--color-brand-gold)]/20 pb-3">
                 <span className="text-[var(--color-brand-cream)]/70">Cut Quality</span><span className="text-[var(--color-brand-gold)]">Excellent</span>
               </div>
               <div className="flex justify-between border-b border-[var(--color-brand-gold)]/20 pb-3">
                 <span className="text-[var(--color-brand-cream)]/70">Clarity</span><span className="text-[var(--color-brand-gold)]">VVS1</span>
               </div>
               <div className="flex justify-between border-b border-[var(--color-brand-gold)]/20 pb-3">
                 <span className="text-[var(--color-brand-cream)]/70">Color Grade</span><span className="text-[var(--color-brand-gold)]">E / F</span>
               </div>
               <div className="flex justify-between border-b border-[var(--color-brand-gold)]/20 pb-3">
                 <span className="text-[var(--color-brand-cream)]/70">Certification</span><span className="text-[var(--color-brand-gold)]">GIA Certified</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
