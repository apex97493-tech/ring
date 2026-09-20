'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Eye, Star, Check } from 'lucide-react';
import { Product } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import QuickViewModal from './QuickViewModal';

export default function ProductCard({ product }: { product: Product }) {
  const { isWishlisted, toggleWishlist, addToCart } = useCart();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAddedToast, setIsAddedToast] = useState(false);

  const activeVariant = product.variants[selectedVariantIdx] || product.variants[0];
  const primaryImage = activeVariant?.image || product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      product,
      quantity: 1,
      selectedMetal: activeVariant.metal,
      selectedSize: '6',
      selectedCarat: product.carat,
      price: product.price,
      image: primaryImage,
    });
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 2000);
  };

  return (
    <>
      <div
        className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl border border-[#E8E5DF] p-2 sm:p-3 hover:shadow-xl transition-all duration-300 hover:border-[#D4AF37]/50 overflow-hidden w-full min-w-0 box-border"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Showcase Container */}
        <div className="relative aspect-square w-full rounded-lg sm:rounded-xl overflow-hidden bg-[#F7F5F0] mb-2 sm:mb-2.5">
          {/* Badge */}
          {product.badge && (
            <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 bg-[#022C22] text-[#D4AF37] font-sans text-[8px] sm:text-[9px] font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded shadow-xs uppercase">
              {product.badge}
            </span>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isWishlisted(product.id)
                ? 'bg-rose-50 text-rose-500 shadow-sm'
                : 'bg-white/85 text-gray-600 hover:bg-white hover:text-[#B89035]'
            }`}
            aria-label="Save to Wishlist"
          >
            <Heart
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill={isWishlisted(product.id) ? 'currentColor' : 'none'}
            />
          </button>

          {/* Product Image */}
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            <img
              src={isHovered ? secondaryImage : primaryImage}
              alt={product.name}
              loading="lazy"
              onError={(e) => {
                // Fallback image if remote url fails
                e.currentTarget.src = '/images/ai_ring1_front.jpg';
              }}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Quick View Button on Hover (Desktop only, mobile has direct touch) */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="hidden sm:flex absolute bottom-2.5 inset-x-2.5 bg-white/95 text-[#18181B] hover:bg-[#022C22] hover:text-[#D4AF37] font-sans text-[10px] sm:text-[11px] font-bold tracking-widest uppercase py-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 items-center justify-center gap-1.5 backdrop-blur-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>

        {/* Swatches & Cut row: neatly spaced so they never collide on small screens */}
        <div className="flex items-center justify-between gap-1 mb-1 px-0.5 min-w-0 w-full">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {product.variants.map((v, idx) => (
              <button
                key={v.metal}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariantIdx(idx);
                }}
                title={v.metal}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border transition-all ${
                  selectedVariantIdx === idx
                    ? 'ring-1.5 ring-[#D4AF37] ring-offset-1 border-black/30 scale-105'
                    : 'border-black/20 hover:scale-110'
                }`}
                style={{ backgroundColor: v.colorCode }}
              />
            ))}
          </div>
          <span className="text-[9px] sm:text-[10px] font-sans font-semibold text-[#8C6A1F] uppercase tracking-wider truncate min-w-0 text-right">
            {product.shape} Cut
          </span>
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className="group/title block min-w-0 w-full">
          <h3 className="font-serif text-xs sm:text-sm md:text-[15px] font-medium text-[#18181B] group-hover/title:text-[#B89035] line-clamp-1 mb-0.5 transition-colors leading-snug truncate">
            {product.name}
          </h3>
        </Link>

        {/* Specs / Carat Tag */}
        <p className="font-sans text-[10px] sm:text-[11px] text-gray-500 mb-1.5 truncate min-w-0">
          {product.carat} • {product.clarity}
        </p>

        {/* Pricing Row: Cleanly wrapped for small phone screens */}
        <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap mb-1.5 min-w-0 w-full">
          <span className="font-sans text-xs sm:text-sm md:text-base font-bold text-[#064E3B]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="font-sans text-[10px] sm:text-xs text-gray-400 line-through">
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
          <span className="font-sans text-[9px] sm:text-[10px] font-bold text-[#059669]">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Ratings & Free Delivery Badge */}
        <div className="mt-auto pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px] sm:text-[11px] font-sans min-w-0 w-full">
          <div className="flex items-center gap-0.5 text-amber-500">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-gray-800 text-[10px] sm:text-xs">{product.rating}</span>
            <span className="text-gray-400 text-[9px] sm:text-[10px]">({product.reviewsCount})</span>
          </div>

          <span className="bg-[#ECFDF5] text-[#065F46] font-semibold px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] whitespace-nowrap">
            Free Del.
          </span>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          className="mt-2 w-full py-1.5 sm:py-2 bg-[#F7F5F0] hover:bg-[#022C22] text-[#022C22] hover:text-[#D4AF37] font-sans text-[10px] sm:text-[11px] font-bold tracking-wider uppercase rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer border border-[#E8E5DF] hover:border-[#022C22]"
        >
          {isAddedToast ? (
            <span className="text-[#059669] flex items-center gap-1">
              <Check className="w-3 h-3" /> Added
            </span>
          ) : (
            'Add to Bag'
          )}
        </button>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal
          product={product}
          initialVariantIdx={selectedVariantIdx}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
}
