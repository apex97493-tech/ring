'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Star, ShieldCheck, Sparkles, Truck, Check, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function QuickViewModal({
  product,
  initialVariantIdx = 0,
  onClose,
}: {
  product: Product;
  initialVariantIdx?: number;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(initialVariantIdx);
  const [selectedSize, setSelectedSize] = useState('6');
  const [selectedCarat, setSelectedCarat] = useState(product.carat);
  const [engraving, setEngraving] = useState('');
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const activeVariant = product.variants[selectedVariantIdx] || product.variants[0];
  const allImages = [activeVariant.image, ...product.images.filter(img => img !== activeVariant.image)];

  const sizes = ['4', '5', '6', '7', '8', '9', '10'];
  const caratOptions = ['1.50 CT', '2.00 CT', '2.50 CT', '3.00 CT'];

  const handleAdd = () => {
    addToCart({
      product,
      quantity: 1,
      selectedMetal: activeVariant.metal,
      selectedSize,
      selectedCarat,
      engravingText: engraving.trim() || undefined,
      price: product.price,
      image: activeVariant.image,
    });
    setIsAdded(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[#FDFBF7] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-[#E8E5DF] my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow-sm backdrop-blur-xs transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Gallery */}
          <div className="p-6 bg-[#F7F5F0] flex flex-col justify-between">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-[#E8E5DF] mb-4">
              <img
                src={allImages[activeImgIdx] || allImages[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#18181B] text-[#D4AF37] font-sans text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-sm uppercase">
                {product.certification}
              </span>
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2 justify-center">
              {allImages.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all bg-white ${
                    activeImgIdx === idx ? 'border-[#B89035] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Details & Customizer */}
          <div className="p-6 sm:p-8 flex flex-col justify-between bg-[#FDFBF7]">
            <div>
              {/* Rating & Shape */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-sans">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-gray-800">{product.rating}</span>
                  <span className="text-gray-400">({product.reviewsCount} verified reviews)</span>
                </div>
                <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-[#8C6A1F] bg-[#F4E8C1]/50 px-2 py-0.5 rounded">
                  {product.shape} Brilliant
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl font-bold text-[#18181B] mb-2 leading-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-sans text-2xl font-bold text-[#064E3B]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="font-sans text-sm text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="font-sans text-xs font-bold text-[#059669]">
                  (50% OFF Limited Offer)
                </span>
              </div>

              {/* Metal Selection */}
              <div className="mb-5">
                <label className="block font-sans text-xs font-bold text-[#18181B] tracking-wider uppercase mb-2">
                  Selected Metal: <span className="text-[#8C6A1F]">{activeVariant.metal}</span>
                </label>
                <div className="flex gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.metal}
                      onClick={() => {
                        setSelectedVariantIdx(idx);
                        setActiveImgIdx(0);
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-sans transition-all ${
                        selectedVariantIdx === idx
                          ? 'border-[#B89035] bg-[#F4E8C1]/30 font-bold text-[#18181B]'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: v.colorCode }}
                      />
                      <span>{v.metal.replace('18K ', '').replace(' Plated', '')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Carat & Size Selectors */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                {/* Carat */}
                <div>
                  <label className="block font-sans text-xs font-bold text-[#18181B] tracking-wider uppercase mb-2">
                    Center Stone:
                  </label>
                  <select
                    value={selectedCarat}
                    onChange={(e) => setSelectedCarat(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs font-sans focus:outline-none focus:border-[#B89035]"
                  >
                    {caratOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Ring Size */}
                <div>
                  <label className="block font-sans text-xs font-bold text-[#18181B] tracking-wider uppercase mb-2">
                    US Ring Size:
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs font-sans focus:outline-none focus:border-[#B89035]"
                  >
                    {sizes.map((s) => (
                      <option key={s} value={s}>US Size {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional Engraving */}
              <div className="mb-6">
                <label className="block font-sans text-xs font-medium text-gray-600 mb-1">
                  Complimentary Inner Band Engraving (Max 15 characters):
                </label>
                <input
                  type="text"
                  maxLength={15}
                  placeholder="e.g. Forever & Always"
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#B89035]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleAdd}
                className="w-full py-3.5 bg-[#18181B] hover:bg-[#B89035] text-[#D4AF37] hover:text-white font-sans text-xs font-bold tracking-widest uppercase transition-colors rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAdded ? (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-4 h-4" /> Added to Shopping Bag
                  </span>
                ) : (
                  'Add to Shopping Bag'
                )}
              </button>

              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="w-full py-2.5 bg-transparent border border-gray-300 hover:border-[#18181B] text-[#18181B] font-sans text-xs font-semibold tracking-wider uppercase transition-colors rounded-xl flex items-center justify-center gap-1.5"
              >
                View Full Product Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Trust Footer */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500 font-sans pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B89035]" /> GRA Certified
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#059669]" /> Free Insured Shipping
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
