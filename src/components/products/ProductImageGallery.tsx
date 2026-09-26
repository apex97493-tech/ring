'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, ZoomIn, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  productId: string;
  badge?: string;
}

export default function ProductImageGallery({
  images,
  productName,
  productId,
  badge,
}: ProductImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const { isWishlisted, toggleWishlist } = useCart();

  // Reset to first image whenever primary image changes (e.g. metal variant switch)
  useEffect(() => {
    setActiveIdx(0);
  }, [images[0]]);

  // Ensure we have at least 1 image
  const displayImages = images && images.length > 0 ? images : ['/images/ai_ring1_front.jpg'];

  const nextImage = () => {
    setActiveIdx((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setActiveIdx((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3 sm:gap-4 items-start w-full">
      {/* 1. ETSY-STYLE VERTICAL THUMBNAIL STRIP (Desktop left column / Mobile bottom row) */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[580px] w-full md:w-20 lg:w-24 flex-shrink-0 scrollbar-thin scrollbar-thumb-gray-300 py-1">
        {displayImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`relative aspect-square w-16 sm:w-18 md:w-full rounded-xl overflow-hidden bg-white border-2 flex-shrink-0 transition-all cursor-pointer ${
              activeIdx === idx
                ? 'border-[#064E3B] ring-2 ring-[#D4AF37]/50 shadow-md scale-102'
                : 'border-[#E8E5DF] opacity-70 hover:opacity-100 hover:border-gray-400'
            }`}
            aria-label={`Thumbnail ${idx + 1}`}
          >
            <img
              src={img}
              alt={`${productName} thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/ai_ring1_front.jpg';
              }}
            />
            {activeIdx === idx && (
              <div className="absolute inset-0 bg-[#064E3B]/10 pointer-events-none" />
            )}
          </button>
        ))}
      </div>

      {/* 2. LARGE MAIN STAGE PHOTO WITH PREV / NEXT CONTROLS (Etsy Style) */}
      <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F7F5F0] border border-[#E8E5DF] shadow-luxury flex-1 group select-none">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIdx}
            src={displayImages[activeIdx]}
            alt={`${productName} photo ${activeIdx + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
            onError={(e) => {
              e.currentTarget.src = '/images/ai_ring1_front.jpg';
            }}
          />
        </AnimatePresence>

        {/* Badge in top left (e.g. RARE FIND, BESTSELLER) */}
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-[#022C22] text-[#D4AF37] font-sans text-[10px] sm:text-xs font-bold tracking-widest px-3 py-1 rounded-full shadow-md uppercase border border-[#D4AF37]/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              {badge}
            </span>
          </div>
        )}

        {/* Wishlist Heart Button top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(productId);
          }}
          className={`absolute top-4 right-4 z-10 p-3 rounded-full shadow-md backdrop-blur-md transition-all cursor-pointer ${
            isWishlisted(productId)
              ? 'bg-rose-50 text-rose-500 scale-105'
              : 'bg-white/90 text-gray-700 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart
            className="w-5 h-5"
            fill={isWishlisted(productId) ? 'currentColor' : 'none'}
          />
        </button>

        {/* Previous Image Arrow Button (Etsy style) */}
        {displayImages.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer opacity-90 hover:opacity-100 border border-gray-200"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Next Image Arrow Button (Etsy style) */}
        {displayImages.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer opacity-90 hover:opacity-100 border border-gray-200"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Bottom Image Counter Pill (e.g. 1 / 8) */}
        <div className="absolute bottom-4 right-4 z-10 bg-black/75 backdrop-blur-xs text-white px-3 py-1 rounded-full font-sans text-xs font-semibold tracking-wider flex items-center gap-1.5 shadow-md">
          <span>{activeIdx + 1}</span>
          <span className="text-gray-400">/</span>
          <span>{displayImages.length}</span>
        </div>
      </div>
    </div>
  );
}
