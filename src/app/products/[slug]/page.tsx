'use client';

import React, { useState, use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Heart,
  MessageCircle,
  Package,
  Award,
  Check,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  HelpCircle,
  ShoppingBag,
} from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/products/ProductCard';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import FindYourSizeDrawer, { INDIAN_SIZE_CHART, US_RING_SIZES } from '@/components/products/FindYourSizeDrawer';
import TrustCertificationRibbon from '@/components/products/TrustCertificationRibbon';
import WokeProductDetailsGrid from '@/components/products/WokeProductDetailsGrid';
import LiveDiamondTestBanner from '@/components/products/LiveDiamondTestBanner';
import WokeAccordions from '@/components/products/WokeAccordions';
import WokeOfferCard from '@/components/products/WokeOfferCard';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { getProductBySlug, products, isLoading } = useProducts();
  const product = getProductBySlug(resolvedParams.slug);

  const { addToCart, isWishlisted, toggleWishlist } = useCart();

  // State hooks - Etsy style selectors
  const [activeVariantIdx, setActiveVariantIdx] = useState<number>(0);
  const [selectedBandColour, setSelectedBandColour] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [personalisationText, setPersonalisationText] = useState<string>('');
  const [showPersonalisation, setShowPersonalisation] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{ band?: boolean; size?: boolean }>({});
  const [isSizeDrawerOpen, setIsSizeDrawerOpen] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [showStickyBar, setShowStickyBar] = useState<boolean>(false);

  // Sync scroll for bottom sticky buy bar
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If products are still being fetched from the server/storage and product is not ready yet
  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin mx-auto" />
          <h2 className="font-serif text-xl text-[#18181B] font-bold">Loading Studio Gemstone Vault...</h2>
          <p className="text-xs text-gray-500 font-sans">Retrieving gemstone specifications & high-res angles</p>
        </div>
      </div>
    );
  }

  // Not found fallback
  if (!product) {
    notFound();
  }

  // Band options
  const bandOptions = (product.variants && product.variants.length > 0)
    ? product.variants
    : [
        { metal: '14k Yellow Gold', colorCode: '#CA8A04', image: product.images?.[0] || '', priceModifier: 4500 },
        { metal: '14k Rose Gold', colorCode: '#FB7185', image: product.images?.[1] || product.images?.[0] || '', priceModifier: 4500 },
        { metal: '925 Sterling Silver', colorCode: '#E2E8F0', image: product.images?.[2] || product.images?.[0] || '', priceModifier: 0 },
      ];

  // Active variant resolution
  const activeVariant = (selectedBandColour && bandOptions.find((v) => v.metal === selectedBandColour))
    || bandOptions[activeVariantIdx]
    || bandOptions[0]
    || {
      metal: product.metal || '925 Sterling Silver',
      colorCode: '#E2E8F0',
      image: product.images?.[0] || '/images/ai_ring1_front.jpg',
    };

  // Dynamic price calculation based on selected band colour / variant
  const currentPrice = typeof activeVariant.price === 'number'
    ? activeVariant.price
    : product.price + (activeVariant.priceModifier || 0);

  const currentOriginalPrice = typeof activeVariant.originalPrice === 'number'
    ? activeVariant.originalPrice
    : product.originalPrice + (activeVariant.priceModifier ? (activeVariant.priceModifier > 0 ? activeVariant.priceModifier * 2 : activeVariant.priceModifier) : 0);

  const discountPercent = Math.max(
    5,
    Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
  );

  const allImages = [
    activeVariant.image,
    ...(product.images || []).filter((img) => img !== activeVariant.image),
  ];

  // Add to cart handler
  const handleAddToCart = () => {
    const errors: { band?: boolean; size?: boolean } = {};
    if (!selectedBandColour) errors.band = true;
    if (!selectedSize) errors.size = true;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    addToCart({
      product,
      quantity: 1,
      selectedMetal: activeVariant.metal,
      selectedSize: selectedSize,
      selectedCarat: product.carat,
      price: currentPrice,
      image: activeVariant.image,
      engravingText: personalisationText.trim() || undefined,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  // Buy it now (adds to cart & opens WhatsApp inquiry)
  const handleBuyNow = () => {
    const errors: { band?: boolean; size?: boolean } = {};
    if (!selectedBandColour) errors.band = true;
    if (!selectedSize) errors.size = true;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    handleAddToCart();
    const message = encodeURIComponent(
      `*ORDER INQUIRY: ${product.name.toUpperCase()}*\n• Band Colour: ${activeVariant.metal}\n• Ring Size: ${selectedSize}\n• Carat: ${product.carat}${personalisationText ? `\n• Personalisation: ${personalisationText}` : ''}\n• Price: ₹${currentPrice.toLocaleString('en-IN')}\n\nI want to complete the purchase with ₹300 OFF prepaid discount!`
    );
    window.open(`https://wa.me/919999999999?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  // WhatsApp order inquiry
  const handleWhatsAppOrder = () => {
    const metalName = selectedBandColour || activeVariant.metal;
    const sizeName = selectedSize || 'US 7';
    const message = encodeURIComponent(
      `*INQUIRY: ${product.name}*\n• Band Colour: ${metalName}\n• Ring Size: ${sizeName}\n• Carat: ${product.carat}${personalisationText ? `\n• Personalisation: ${personalisationText}` : ''}\n• Price: ₹${currentPrice.toLocaleString('en-IN')}\n\nHi ForeverJewellStudio team, please assist me with ordering this piece!`
    );
    window.open(`https://wa.me/919999999999?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] text-[#18181B] font-sans antialiased">
      {/* 1. CLEAN BREADCRUMB */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 text-xs text-gray-500 flex items-center gap-2 overflow-x-auto whitespace-nowrap border-b border-[#F0ECE1]">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span className="text-gray-300">/</span>
        <Link href="/shop" className="hover:text-black transition-colors">Moissanite Jewellery</Link>
        <span className="text-gray-300">/</span>
        <Link href={`/category/${product.category}`} className="hover:text-black capitalize transition-colors">
          {product.category}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium truncate max-w-[280px] sm:max-w-none">{product.name}</span>
      </div>

      {/* 2. MAIN PRODUCT SECTION (2-COLUMNS: WOKE COLLECTION LAYOUT) */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* ================================================================= */}
          {/* LEFT COLUMN: LARGE HIGH-RES PHOTO + THUMBNAILS (7 COLS)           */}
          {/* ================================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <ProductImageGallery
              images={allImages}
              productName={product.name}
              productId={product.id}
              badge={product.badge}
            />
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: BUY BOX, SELECTORS, CTAS, OFFERS (5 COLS)            */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Category / Collection Tag */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6A1F] block mb-1">
                Moissanite Solitaire Rings
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#18181B] leading-snug">
                {product.name} | Certified Moissanite & Fine Gold Ring
              </h1>
            </div>

            {/* Price Block */}
            <div className="space-y-1 pb-4 border-b border-[#E8E5DF]">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-sans text-2xl sm:text-3xl font-bold text-[#18181B]">
                  Rs. {currentPrice.toLocaleString('en-IN')}.00
                </span>
                <span className="font-sans text-base text-gray-400 line-through">
                  Rs. {currentOriginalPrice.toLocaleString('en-IN')}.00
                </span>
                <span className="bg-[#18181B] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-xs tracking-wider uppercase">
                  {discountPercent}% OFF
                </span>
                <span className="text-xs text-gray-500 font-sans cursor-pointer hover:underline">
                  Final sale ?
                </span>
              </div>
              <p className="text-xs text-gray-500">Taxes included.</p>
            </div>

            {/* ETSY STYLE SELECTORS (SS2 DESIGN) */}
            <div className="space-y-4 pt-1">
              {/* 1. Band colour Select */}
              <div>
                <label className="block text-sm font-semibold text-[#222222] mb-1.5">
                  Band colour
                </label>
                <div className="relative">
                  <select
                    value={selectedBandColour}
                    onChange={(e) => {
                      setSelectedBandColour(e.target.value);
                      setValidationErrors((prev) => ({ ...prev, band: false }));
                      const idx = bandOptions.findIndex((v) => v.metal === e.target.value);
                      if (idx >= 0) setActiveVariantIdx(idx);
                    }}
                    className={`w-full bg-white border ${
                      validationErrors.band
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-gray-400 hover:border-gray-600 focus:border-black focus:ring-1 focus:ring-black'
                    } rounded-md px-3.5 py-3 pr-10 text-sm text-[#222222] appearance-none cursor-pointer transition-colors shadow-2xs font-sans`}
                  >
                    <option value="" disabled>Select an option</option>
                    {bandOptions.map((v) => {
                      const modifier = v.priceModifier || 0;
                      let label = v.metal;
                      if (modifier !== 0) {
                        label += ` (${modifier > 0 ? '+' : ''}Rs. ${Math.abs(modifier).toLocaleString('en-IN')}.00)`;
                      } else if (typeof v.price === 'number' && v.price !== product.price) {
                        label += ` (Rs. ${v.price.toLocaleString('en-IN')}.00)`;
                      }
                      return (
                        <option key={v.metal} value={v.metal}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 pointer-events-none" />
                </div>
                {validationErrors.band && (
                  <p className="text-xs text-red-600 mt-1">Please select an option</p>
                )}
              </div>

              {/* 2. Ring size Select */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-[#222222]">
                    Ring size
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSizeDrawerOpen(true)}
                    className="text-xs text-gray-600 hover:text-black font-medium underline underline-offset-2 cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Package className="w-3.5 h-3.5 text-gray-500" />
                    <span>Find your size</span>
                  </button>
                </div>
                <div className="relative">
                  <select
                    value={selectedSize}
                    onChange={(e) => {
                      setSelectedSize(e.target.value);
                      setValidationErrors((prev) => ({ ...prev, size: false }));
                    }}
                    className={`w-full bg-white border ${
                      validationErrors.size
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-gray-400 hover:border-gray-600 focus:border-black focus:ring-1 focus:ring-black'
                    } rounded-md px-3.5 py-3 pr-10 text-sm text-[#222222] appearance-none cursor-pointer transition-colors shadow-2xs font-sans`}
                  >
                    <option value="" disabled>Select an option</option>
                    {US_RING_SIZES.map((s) => (
                      <option key={s.us} value={`US ${s.us}`}>
                        US {s.us} ({s.diameterMm} mm)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 pointer-events-none" />
                </div>
                {validationErrors.size && (
                  <p className="text-xs text-red-600 mt-1">Please select an option</p>
                )}
              </div>

              {/* 3. + Add personalisation (optional) */}
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowPersonalisation(!showPersonalisation)}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#222222] hover:text-black cursor-pointer group py-1"
                >
                  {showPersonalisation ? (
                    <Minus className="w-4 h-4 text-gray-700 group-hover:text-black" />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-700 group-hover:text-black" />
                  )}
                  <span className="group-hover:underline">Add personalisation (optional)</span>
                </button>

                <AnimatePresence>
                  {showPersonalisation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden space-y-2 pt-2"
                    >
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Add your personalisation (optional). Enter custom engraving text, ring sizing notes, or gift message.
                      </p>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={50}
                          value={personalisationText}
                          onChange={(e) => setPersonalisationText(e.target.value)}
                          placeholder="e.g. Forever & Always ♡ / Custom engraving"
                          className="w-full bg-white border border-gray-400 focus:border-black focus:ring-1 focus:ring-black rounded-md px-3.5 py-2.5 text-sm text-[#222222] focus:outline-none transition-colors pr-14"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-mono">
                          {personalisationText.length}/50
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 4. Action Buttons (Etsy Pill Button + Secondary Checkout) */}
              <div className="space-y-3 pt-2">
                {/* Etsy Large Pill Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3.5 sm:py-4 bg-[#222222] hover:bg-black text-white font-bold text-sm sm:text-base rounded-full transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Added to cart</span>
                    </>
                  ) : (
                    <span>Add to cart</span>
                  )}
                </button>

                {/* Secondary Fast Checkout & WhatsApp Inquiry */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full py-3 bg-white hover:bg-gray-50 text-[#18181B] font-bold text-xs tracking-wider uppercase rounded-full border border-gray-300 hover:border-black transition-colors cursor-pointer"
                  >
                    BUY IT NOW
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="w-full py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs tracking-wider uppercase rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                    <span>WHATSAPP</span>
                  </button>
                </div>
              </div>
            </div>

            {/* AVAILABLE OFFERS & STORE ATELIER CARDS */}
            <WokeOfferCard />
          </div>
        </div>

        {/* 3. TRUST & ACCREDITATION RIBBON (GIA, IGI, GRA, BIS HALLMARK) */}
        <TrustCertificationRibbon />

        {/* 4. PRODUCT DETAILS SPECIFICATION GRID (WARM BEIGE CARDS) */}
        <WokeProductDetailsGrid
          product={product}
          selectedMetal={activeVariant.metal}
          selectedCarat={product.carat}
        />

        {/* 5. LIVE DIAMOND TEST VIRTUAL VIDEO CALL BANNER */}
        <LiveDiamondTestBanner productName={product.name} />

        {/* 6. CLEAN ACCORDIONS (DESCRIPTION, SHIPPING, RETURNS, CARE) */}
        <WokeAccordions
          product={product}
          selectedMetal={activeVariant.metal}
          selectedCarat={product.carat}
        />

        {/* 7. CURATED RECOMMENDATIONS */}
        <div className="my-16 max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6A1F] block">
              Curated Pairings
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#18181B] font-bold mt-1">
              You May Also Adore
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      </main>

      {/* 8. FIND YOUR SIZE SLIDE-OVER DRAWER */}
      <FindYourSizeDrawer
        isOpen={isSizeDrawerOpen}
        onClose={() => setIsSizeDrawerOpen(false)}
        selectedSize={selectedSize}
        onSelectSize={(newSize) => {
          setSelectedSize(newSize);
          setValidationErrors((prev) => ({ ...prev, size: false }));
        }}
      />

      {/* 9. BOTTOM STICKY BUY BAR */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E5DF] py-3 px-4 shadow-xl"
          >
            <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={allImages[0]}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                />
                <div className="min-w-0 hidden sm:block">
                  <span className="font-serif text-xs font-bold text-[#18181B] truncate block">
                    {product.name}
                  </span>
                  <span className="text-[10px] text-gray-500 font-sans">
                    {activeVariant.metal} {selectedSize ? `• ${selectedSize}` : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <span className="font-sans text-sm sm:text-base font-bold text-[#18181B] block">
                    Rs. {currentPrice.toLocaleString('en-IN')}.00
                  </span>
                  <span className="font-sans text-[10px] text-gray-400 line-through block">
                    Rs. {currentOriginalPrice.toLocaleString('en-IN')}.00
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="px-6 py-2.5 bg-[#222222] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                >
                  {isAdded ? '✓ Added' : 'Add to cart'}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="px-5 py-2.5 bg-white hover:bg-gray-100 text-[#18181B] font-bold text-xs uppercase tracking-wider rounded-full border border-gray-300 hover:border-black transition-colors cursor-pointer hidden md:block"
                >
                  BUY IT NOW
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
