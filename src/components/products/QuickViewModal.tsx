'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { X, Star, ShieldCheck, Truck, Check, ArrowRight, ChevronDown, Package, Zap } from 'lucide-react';
import { Product, STANDARD_METAL_TIERS, PRODUCT_METAL_PRICES } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import FindYourSizeDrawer, { US_RING_SIZES } from '@/components/products/FindYourSizeDrawer';
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
  const router = useRouter();
  const { addToCart, buyNow, setIsCartOpen, triggerFlyAnimation } = useCart();
  const { formatPrice } = useCurrency();

  // ── DYNAMIC METAL OFFERINGS & ACCURATE LIVE ETSY PRICING ──────────
  const basePrice = product.price;
  const baseMRP = product.originalPrice;
  const exactPrices = product.metalPrices ?? PRODUCT_METAL_PRICES[product.id] ?? null;

  const relevantTiers = STANDARD_METAL_TIERS.filter((tier) => {
    if (exactPrices) {
      const p = exactPrices[tier.metal];
      return p !== undefined && p > 0;
    }

    const category = (product.category || '').toLowerCase();
    const text = ((product.name || '') + ' ' + (product.description || '')).toLowerCase();
    const isSilverOnlyCategory =
      category.includes('necklace') || category.includes('pendant') || category.includes('bracelet');
    const mentionsSolidGold =
      text.includes('solid gold') ||
      text.includes('14k solid') ||
      text.includes('18k solid') ||
      text.includes('9k solid') ||
      text.includes('10k solid');

    if (isSilverOnlyCategory && !mentionsSolidGold) {
      return tier.group === 'Silver' || tier.group === 'Gold Overlay';
    }

    const has9k = text.includes('9k') || text.includes('9kt') || text.includes('9ct') || text.includes('375');
    const has10k = text.includes('10k') || text.includes('10kt') || text.includes('10ct') || text.includes('417');

    if (tier.group === '9k Gold') {
      if (has9k) return true;
      if (has10k) return false;
      return true;
    }

    if (tier.group === '10k Gold') {
      if (has10k) return true;
      if (has9k) return false;
      return false;
    }

    return true;
  });

  const metalBandOptions = relevantTiers.map((tier) => {
    const price =
      exactPrices && exactPrices[tier.metal] !== undefined
        ? exactPrices[tier.metal]
        : basePrice + tier.priceAddon;

    const originalPrice =
      tier.priceAddon === 0 ? baseMRP : Math.round(price * 2);

    return {
      metal: tier.metal,
      colorCode: tier.colorCode,
      group: tier.group,
      price,
      originalPrice,
      image:
        product.variants?.find((v) =>
          v.metal.toLowerCase().includes(tier.metal.toLowerCase().split(' ')[0])
        )?.image ||
        product.images?.[0] ||
        '',
    };
  });

  // Default selected metal matches initialVariantIdx or first available tier
  const defaultMetal =
    product.variants?.[initialVariantIdx]?.metal &&
    metalBandOptions.some((m) => m.metal === product.variants[initialVariantIdx].metal)
      ? product.variants[initialVariantIdx].metal
      : metalBandOptions[0]?.metal || '925 Sterling Silver';

  const [selectedMetal, setSelectedMetal] = useState<string>(defaultMetal);
  const [selectedSize, setSelectedSize] = useState('US 7');
  const [selectedCarat, setSelectedCarat] = useState(product.carat || '2.00 CT');
  const [engraving, setEngraving] = useState('');
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isSizeDrawerOpen, setIsSizeDrawerOpen] = useState(false);

  // Active metal tier
  const activeTier =
    metalBandOptions.find((o) => o.metal === selectedMetal) || metalBandOptions[0];

  const currentPrice = activeTier ? activeTier.price : product.price;
  const currentOriginalPrice = activeTier ? activeTier.originalPrice : product.originalPrice;
  const discountPercent = Math.max(
    5,
    Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
  );

  // Images list
  const activeVariantImage = activeTier?.image || product.images?.[0] || '';
  const allImages = [
    activeVariantImage,
    ...(product.images || []).filter((img) => img !== activeVariantImage),
  ];

  const caratOptions = ['1.00 CT', '1.50 CT', '2.00 CT', '2.50 CT', '3.00 CT'];

  // Check if center stone carat is applicable
  const titleLower = (product.name || '').toLowerCase();
  const isRing = (product.category || '').toLowerCase().includes('ring') || titleLower.includes('ring');
  const isPlainOrSignetOrBand =
    titleLower.includes('signet') ||
    titleLower.includes('plain band') ||
    titleLower.includes('wedding band') ||
    titleLower.includes('eternity band') ||
    titleLower.includes('engraved band') ||
    titleLower.includes('cuff') ||
    titleLower.includes('statement ring') ||
    titleLower.includes('pride');

  const hasCenterStone =
    isRing &&
    !isPlainOrSignetOrBand &&
    Boolean(product.carat) &&
    product.carat.toLowerCase() !== 'n/a' &&
    product.carat.trim() !== '';

  const handleAdd = (e: React.MouseEvent) => {
    addToCart({
      product,
      quantity: 1,
      selectedMetal: activeTier.metal,
      selectedSize,
      selectedCarat: hasCenterStone ? selectedCarat : (product.carat || 'N/A'),
      engravingText: engraving.trim() || undefined,
      price: currentPrice,
      image: activeVariantImage,
    });
    triggerFlyAnimation(activeVariantImage, e);
    setIsAdded(true);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    buyNow({
      product,
      quantity: 1,
      selectedMetal: activeTier.metal,
      selectedSize,
      selectedCarat: hasCenterStone ? selectedCarat : (product.carat || 'N/A'),
      engravingText: engraving.trim() || undefined,
      price: currentPrice,
      image: activeVariantImage,
    });
    triggerFlyAnimation(activeVariantImage, e, 'drop');
    setIsCartOpen(false);
    setTimeout(() => {
      onClose();
      router.push('/checkout');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[#FFF0F5] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-[#D39EAA]/30 my-6 max-h-[92vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2 bg-white/90 hover:bg-white text-gray-700 hover:text-black rounded-full shadow-md backdrop-blur-xs transition-colors cursor-pointer select-none active:scale-90"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
          {/* Left Gallery */}
          <div className="p-4 sm:p-6 bg-[#F7F5F0] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8E5DF]">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-[#E8E5DF] mb-3 shadow-xs">
              <img
                src={allImages[activeImgIdx] || allImages[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#592D37] text-[#D39EAA] font-sans text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-sm uppercase shadow-sm">
                {product.certification || 'GRA CERTIFIED'}
              </span>
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2 justify-center overflow-x-auto py-1">
              {allImages.slice(0, 5).map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-all bg-white shrink-0 cursor-pointer select-none active:scale-95 ${
                    activeImgIdx === idx
                      ? 'border-[#C88E91] scale-105 shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Details & Customizer */}
          <div className="p-5 sm:p-7 flex flex-col justify-between bg-[#FFF0F5]">
            <div>
              {/* Rating & Shape */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-sans">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-gray-800">{product.rating}</span>
                  <span className="text-gray-500">({product.reviewsCount} verified reviews)</span>
                </div>
                <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-[#8C6A1F] bg-[#F4E8C1]/60 px-2.5 py-0.5 rounded-full border border-[#D39EAA]/30">
                  {product.shape} Cut
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#592D37] mb-2 leading-snug">
                {product.name}
              </h2>

              {/* Dynamic Live Price */}
              <div className="flex items-baseline flex-wrap gap-2.5 mb-5 p-3 rounded-xl bg-white border border-[#E8E5DF]">
                <span className="font-sans text-2xl sm:text-3xl font-bold text-[#B76E79]">
                  {formatPrice(currentPrice)}
                </span>
                <span className="font-sans text-sm text-gray-400 line-through">
                  {formatPrice(currentOriginalPrice)}
                </span>
                <span className="font-sans text-xs font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded">
                  ({discountPercent}% OFF)
                </span>
              </div>

              {/* Metal Selection Dropdown with Live Prices */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-sans text-xs font-bold text-[#592D37] tracking-wider uppercase">
                    Band Colour / Metal:
                  </label>
                  <span className="text-xs font-medium text-[#8C6A1F]">
                    {activeTier?.metal}
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={selectedMetal}
                    onChange={(e) => {
                      setSelectedMetal(e.target.value);
                      setActiveImgIdx(0);
                    }}
                    className="w-full bg-white border border-gray-300 hover:border-[#D39EAA] rounded-lg px-3 py-2.5 text-xs font-sans font-semibold text-[#18181B] appearance-none cursor-pointer focus:outline-none focus:border-[#592D37] transition-colors shadow-2xs pr-9"
                  >
                    {metalBandOptions.map((opt) => (
                      <option key={opt.metal} value={opt.metal}>
                        {opt.metal} — {formatPrice(opt.price)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                </div>

                {/* Quick Swatch Pills for quick tap */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {metalBandOptions.slice(0, 5).map((opt) => (
                    <button
                      key={opt.metal}
                      type="button"
                      onClick={() => {
                        setSelectedMetal(opt.metal);
                        setActiveImgIdx(0);
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-sans transition-all cursor-pointer border ${
                        selectedMetal === opt.metal
                          ? 'border-[#592D37] bg-[#592D37] text-[#FFF0F5] font-semibold'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: opt.colorCode }}
                      />
                      <span className="truncate max-w-[130px]">
                        {opt.metal.replace('14k ', '').replace('18k ', '').replace('9k ', '')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Options: Center Stone Carat & Ring Size */}
              <div className={`grid ${hasCenterStone ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-4`}>
                {hasCenterStone && (
                  <div>
                    <label className="block font-sans text-xs font-bold text-[#592D37] tracking-wider uppercase mb-1.5">
                      Center Stone:
                    </label>
                    <select
                      value={selectedCarat}
                      onChange={(e) => setSelectedCarat(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs font-sans text-gray-800 focus:outline-none focus:border-[#D39EAA]"
                    >
                      {caratOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {isRing && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-[#18181B]">
                        Ring size
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsSizeDrawerOpen(true)}
                        className="text-[11px] text-gray-500 hover:text-black font-medium underline underline-offset-2 cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <Package className="w-3 h-3 text-gray-400" />
                        <span>Find your size</span>
                      </button>
                    </div>
                    <div className="relative">
                      <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-full bg-white border border-gray-300 hover:border-[#D39EAA] rounded-lg px-3 py-2.5 text-xs font-sans text-gray-800 appearance-none focus:outline-none focus:border-[#592D37] pr-8 cursor-pointer shadow-2xs"
                      >
                        {US_RING_SIZES.map((s) => (
                          <option key={s.us} value={`US ${s.us}`}>
                            US {s.us} ({s.diameterMm} mm)
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Engraving */}
              <div className="mb-5">
                <label className="block font-sans text-[11px] font-medium text-gray-600 mb-1">
                  Complimentary Inner Band Engraving (Max 15 chars):
                </label>
                <input
                  type="text"
                  maxLength={15}
                  placeholder="e.g. Forever & Always"
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#592D37]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-full py-3 bg-[#592D37] hover:bg-[#D39EAA] active:scale-95 text-[#D39EAA] hover:text-[#592D37] font-sans text-xs font-bold tracking-widest uppercase transition-all rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer border border-[#D39EAA]/40"
                >
                  {isAdded ? (
                    <span className="flex items-center gap-1 text-white">
                      <Check className="w-3.5 h-3.5" /> Added
                    </span>
                  ) : (
                    'Add to Bag'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3 bg-[#D39EAA] hover:bg-[#C88E91] active:scale-95 text-[#592D37] font-sans text-xs font-bold tracking-widest uppercase transition-all rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" /> Buy It Now
                </button>
              </div>

              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="w-full py-2.5 bg-transparent border border-gray-300 hover:border-[#592D37] text-[#592D37] font-sans text-xs font-semibold tracking-wider uppercase transition-colors rounded-xl flex items-center justify-center gap-1.5 text-center"
              >
                View Full Product Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Trust Footer */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500 font-sans pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C88E91]" /> GRA Certified
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

      {/* Interactive Find Your Size Drawer */}
      <FindYourSizeDrawer
        isOpen={isSizeDrawerOpen}
        onClose={() => setIsSizeDrawerOpen(false)}
        selectedSize={selectedSize.replace('US ', '')}
        onSelectSize={(size) => {
          setSelectedSize(size.startsWith('US ') ? size : `US ${size}`);
          setIsSizeDrawerOpen(false);
        }}
      />
    </div>
  );
}
