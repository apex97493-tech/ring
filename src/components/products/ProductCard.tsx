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
        className="group relative flex flex-col bg-white rounded-2xl border border-[#E8E5DF] p-3 hover:shadow-xl transition-all duration-300 hover:border-[#D4AF37]/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Showcase Container */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F7F5F0] mb-3">
          {/* Badge */}
          {product.badge && (
            <span className="absolute top-2.5 left-2.5 z-10 bg-[#18181B] text-[#D4AF37] font-sans text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-sm shadow-xs uppercase">
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
            className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isWishlisted(product.id)
                ? 'bg-rose-50 text-rose-500 shadow-sm'
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-[#B89035]'
            }`}
            aria-label="Save to Wishlist"
          >
            <Heart
              className="w-4 h-4"
              fill={isWishlisted(product.id) ? 'currentColor' : 'none'}
            />
          </button>

          {/* Product Images with smooth transition */}
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            <img
              src={isHovered ? secondaryImage : primaryImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Quick View Button on Hover */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="absolute bottom-3 inset-x-3 bg-white/95 text-[#18181B] hover:bg-[#18181B] hover:text-[#D4AF37] font-sans text-[11px] font-bold tracking-widest uppercase py-2.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-1.5 backdrop-blur-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>

        {/* Metal Swatch Selector */}
        <div className="flex items-center gap-2 mb-2 px-1">
          {product.variants.map((v, idx) => (
            <button
              key={v.metal}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedVariantIdx(idx);
              }}
              title={v.metal}
              className={`w-4 h-4 rounded-full border transition-all ${
                selectedVariantIdx === idx
                  ? 'ring-2 ring-[#B89035] ring-offset-1 border-black/30'
                  : 'border-black/20 hover:scale-110'
              }`}
              style={{ backgroundColor: v.colorCode }}
            />
          ))}
          <span className="text-[10px] font-sans text-gray-400 ml-auto uppercase tracking-wider">
            {product.shape} Cut
          </span>
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className="group/title">
          <h3 className="font-serif text-[15px] font-medium text-[#18181B] group-hover/title:text-[#B89035] line-clamp-1 mb-1 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Specs / Carat Tag */}
        <p className="font-sans text-[11px] text-gray-500 mb-2">
          {product.carat} • {product.clarity} • {product.colorGrade.split(' ')[0]}
        </p>

        {/* Pricing Row */}
        <div className="flex items-baseline gap-2 flex-wrap mb-2">
          <span className="font-sans text-base font-bold text-[#064E3B]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="font-sans text-xs text-gray-400 line-through">
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
          <span className="font-sans text-[11px] font-bold text-[#059669]">
            ({discountPercent}% OFF)
          </span>
        </div>

        {/* Ratings & Free Delivery Badge */}
        <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-sans">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-gray-800">{product.rating}</span>
            <span className="text-gray-400">({product.reviewsCount})</span>
          </div>

          <span className="bg-[#ECFDF5] text-[#065F46] font-semibold px-2 py-0.5 rounded-full text-[10px]">
            FREE Delivery
          </span>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          className="mt-3 w-full py-2 bg-[#F7F5F0] hover:bg-[#18181B] text-[#18181B] hover:text-[#D4AF37] font-sans text-[11px] font-bold tracking-wider uppercase rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          {isAddedToast ? (
            <span className="text-[#059669] flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Added to Bag
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
