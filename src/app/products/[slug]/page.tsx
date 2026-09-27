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
  HelpCircle,
  ShoppingBag,
} from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/products/ProductCard';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import FindYourSizeDrawer, { INDIAN_SIZE_CHART } from '@/components/products/FindYourSizeDrawer';
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

  // State hooks
  const [activeVariantIdx, setActiveVariantIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('10'); // Default Indian Size 10 / US 6
  const [selectedStyle, setSelectedStyle] = useState<string>('Crown Setting');
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

  // Active variant resolution
  const activeVariant = product.variants?.[activeVariantIdx] || product.variants?.[0] || {
    metal: product.metal || '925 Sterling Silver',
    colorCode: '#E2E8F0',
    image: product.images?.[0] || '/images/ai_ring1_front.jpg',
  };

  const allImages = [
    activeVariant.image,
    ...(product.images || []).filter((img) => img !== activeVariant.image),
  ];

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const styleOptions = [
    product.settingStyle || 'Crown Setting',
    'Solitaire Prong',
    'Vintage Bezel',
  ];

  // Add to cart handler
  const handleAddToCart = () => {
    addToCart({
      product,
      quantity: 1,
      selectedMetal: activeVariant.metal,
      selectedSize: `Indian Size ${selectedSize}`,
      selectedCarat: product.carat,
      price: product.price,
      image: activeVariant.image,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  // Buy it now (adds to cart & opens WhatsApp or direct checkout)
  const handleBuyNow = () => {
    handleAddToCart();
    const message = encodeURIComponent(
      `*ORDER INQUIRY: ${product.name.toUpperCase()}*\n• Metal: ${activeVariant.metal}\n• Ring Size: Indian Size ${selectedSize}\n• Carat: ${product.carat}\n• Price: ₹${product.price.toLocaleString('en-IN')}\n\nI want to complete the purchase with ₹300 OFF prepaid discount!`
    );
    window.open(`https://wa.me/919999999999?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  // WhatsApp order inquiry
  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `*INQUIRY: ${product.name}*\n• Metal: ${activeVariant.metal}\n• Ring Size: Indian Size ${selectedSize}\n• Carat: ${product.carat}\n• Price: ₹${product.price.toLocaleString('en-IN')}\n\nHi ForeverJewellStudio team, please assist me with ordering this piece!`
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
                  Rs. {product.price.toLocaleString('en-IN')}.00
                </span>
                <span className="font-sans text-base text-gray-400 line-through">
                  Rs. {product.originalPrice.toLocaleString('en-IN')}.00
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

            {/* Find Your Size Trigger */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setIsSizeDrawerOpen(true)}
                className="flex items-center gap-1.5 text-xs text-[#18181B] hover:text-[#8C6A1F] font-semibold underline underline-offset-4 cursor-pointer transition-colors group"
              >
                <Package className="w-4 h-4 text-gray-700 group-hover:text-[#8C6A1F]" />
                <span>Find Your Size</span>
              </button>
              <span className="text-[11px] text-gray-500">
                Selected: Indian Size {selectedSize}
              </span>
            </div>

            {/* Size Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#18181B] block">
                Size
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full bg-white border border-[#D1CDC4] rounded-xs px-3.5 py-2.5 text-xs text-[#18181B] focus:outline-none focus:border-black cursor-pointer shadow-2xs font-sans"
              >
                {INDIAN_SIZE_CHART.map((s) => (
                  <option key={s.indian} value={s.indian}>
                    Indian Size {s.indian} (US {s.us} • {s.diameterMm} mm)
                  </option>
                ))}
              </select>
            </div>

            {/* Style / Setting Pills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#18181B]">
                  Style
                </label>
                <span className="text-xs text-gray-500">{selectedStyle}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {styleOptions.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStyle(st)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all cursor-pointer ${
                      selectedStyle === st
                        ? 'bg-[#18181B] text-white border-[#18181B]'
                        : 'bg-white text-gray-700 border-[#D1CDC4] hover:border-gray-500'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Material Selector Pills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#18181B]">
                  Material
                </label>
                <span className="text-xs text-gray-500">{activeVariant.metal}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(product.variants && product.variants.length > 0
                  ? product.variants
                  : [
                      { metal: '925 STERLING SILVER', colorCode: '#E2E8F0', image: '' },
                      { metal: '14K YELLOW GOLD', colorCode: '#CA8A04', image: '' },
                      { metal: '14K ROSE GOLD', colorCode: '#FB7185', image: '' },
                    ]
                ).map((v, idx) => {
                  const isSelected = activeVariantIdx === idx;
                  const label = v.metal.toUpperCase();

                  return (
                    <button
                      key={v.metal + idx}
                      type="button"
                      onClick={() => setActiveVariantIdx(idx)}
                      className={`px-4 py-2.5 text-xs font-bold tracking-wider rounded-xs border transition-all flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-[#18181B] text-white border-[#18181B]'
                          : 'bg-white text-gray-800 border-[#D1CDC4] hover:border-gray-500'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/20 flex-shrink-0"
                        style={{ backgroundColor: v.colorCode || '#E2E8F0' }}
                      />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ACTION BUTTONS (ADD TO CART, BUY IT NOW, WHATSAPP) */}
            <div className="space-y-2.5 pt-2">
              {/* Add To Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-[#0B2545] hover:bg-[#081B33] text-white font-bold text-xs uppercase tracking-widest rounded-xs transition-colors shadow-sm cursor-pointer"
              >
                {isAdded ? '✓ ADDED TO BAG' : 'ADD TO CART'}
              </button>

              {/* Buy It Now with top discount pill */}
              <div className="relative pt-3">
                <div className="absolute top-0 right-0 z-10">
                  <span className="bg-[#4338CA] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs tracking-wider">
                    {product.prepaidDiscountNote || '₹300 OFF on prepaid orders'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-[#18181B] hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xs transition-colors shadow-sm cursor-pointer"
                >
                  BUY IT NOW
                </button>
              </div>

              {/* Order on WhatsApp Button */}
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                <span>ORDER ON WHATSAPP</span>
              </button>
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
        onSelectSize={(newSize) => setSelectedSize(newSize)}
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
                    {activeVariant.metal} • Indian Size {selectedSize}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <span className="font-sans text-sm sm:text-base font-bold text-[#18181B] block">
                    Rs. {product.price.toLocaleString('en-IN')}.00
                  </span>
                  <span className="font-sans text-[10px] text-gray-400 line-through block">
                    Rs. {product.originalPrice.toLocaleString('en-IN')}.00
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="px-5 py-2.5 bg-[#0B2545] hover:bg-[#081B33] text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                >
                  {isAdded ? '✓ ADDED' : 'ADD TO CART'}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="px-5 py-2.5 bg-[#18181B] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer hidden md:block"
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
