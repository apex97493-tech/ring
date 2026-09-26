'use client';

import React, { useState, use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RefreshCcw,
  Star,
  CheckCircle,
  MessageCircle,
  Ruler,
  Award,
  ChevronDown,
  ChevronUp,
  Heart,
  Check,
  MapPin,
  Clock,
  Gem,
  Store,
  CheckCircle2,
  HelpCircle,
  Package,
} from 'lucide-react';
import { METALS } from '@/lib/data';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/products/ProductCard';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import MobileStickyBuyBar from '@/components/products/MobileStickyBuyBar';
import RingStackBuilder from '@/components/products/RingStackBuilder';
import MoissaniteComparison from '@/components/sections/MoissaniteComparison';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import RingSizeGuide from '@/components/sections/RingSizeGuide';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FaqSection from '@/components/sections/FaqSection';
import CustomJewelryBanner from '@/components/sections/CustomJewelryBanner';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { getProductBySlug, products, isLoading } = useProducts();
  const product = getProductBySlug(resolvedParams.slug);

  const { addToCart, isWishlisted, toggleWishlist } = useCart();

  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [selectedCarat, setSelectedCarat] = useState(product?.carat || '2.00 CT');
  const [selectedSize, setSelectedSize] = useState('6');
  const [engraving, setEngraving] = useState('');
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);
  const [isFollowingShop, setIsFollowingShop] = useState(false);
  const [isItemDetailsOpen, setIsItemDetailsOpen] = useState(true);
  const [isDeliveryPolicyOpen, setIsDeliveryPolicyOpen] = useState(true);
  const [pinCode, setPinCode] = useState('110001');
  const [pinCheckMsg, setPinCheckMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'certificate'>('details');
  const [isAdded, setIsAdded] = useState(false);

  // Sync selected carat if product loads asynchronously
  React.useEffect(() => {
    if (product?.carat) {
      setSelectedCarat(product.carat);
    }
  }, [product?.carat]);

  // If products are still being fetched from the server/storage and product is not ready yet
  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin mx-auto" />
          <h2 className="font-serif text-lg text-[#022C22] font-bold">Unlocking AURA Vault...</h2>
          <p className="text-xs text-gray-500 font-sans">Retrieving gemstone specifications & high-res angles</p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const activeVariant = product.variants[activeVariantIdx] || product.variants[0];
  const allImages = [activeVariant.image, ...product.images.filter((i) => i !== activeVariant.image)];

  const sizes = ['4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const caratOptions = ['1.50 CT', '2.00 CT', '2.50 CT', '3.00 CT'];

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const descriptionParagraphs = React.useMemo(() => {
    if (!product.description) return [];
    const cleaned = product.description
      .replace(/thanks for visiting foreverjewellstudio/gi, 'Thank you for choosing AURA Fine Jewelry')
      .replace(/foreverjewellstudio/gi, 'AURA Fine Jewelry')
      .replace(/important\*:-?/gi, '')
      .replace(/\*{1,5}/g, '');

    const lines = cleaned.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const narrative: string[] = [];

    for (const line of lines) {
      const isRawSpec = /^(Primary Gemstone|Secondary Gemstone|Cut\/Shape|Color|Clarity|Jewelry Type|Metal|Method|Personalization|Occasion|Style|Ring Size|Country of Manufacture|Standard Delivery|Speed Delivery):/i.test(line);
      if (!isRawSpec) {
        narrative.push(line);
      }
    }

    return narrative.length > 0 ? narrative : [product.description];
  }, [product.description]);

  const getEstimatedDelivery = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 4);
    const end = new Date(today);
    end.setDate(today.getDate() + 7);
    const opt: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
    return `${start.toLocaleDateString('en-IN', opt)} - ${end.toLocaleDateString('en-IN', opt)}`;
  };

  const handlePinCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.trim().length === 6) {
      setPinCheckMsg(`✓ Free Express Insured Air Delivery to ${pinCode} available! Dispatched in 24 hrs.`);
    } else {
      setPinCheckMsg('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  const handleAddToCart = () => {
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
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleWhatsAppOrder = () => {
    const cleanEngraving = engraving.replace(/<[^>]*>?/gm, '').replace(/[\r\n]+/g, ' ').slice(0, 30);
    const message = [
      `*ORDER INQUIRY: ${product.name.toUpperCase()}*`,
      `• Metal: ${activeVariant.metal}`,
      `• Carat: ${selectedCarat}`,
      `• Ring Size: US ${selectedSize}`,
      cleanEngraving ? `• Engraving: "${cleanEngraving}"` : '',
      `• Price: ₹${product.price.toLocaleString('en-IN')}`,
      '',
      'Please assist me with payment & delivery details!',
    ].filter(Boolean).join('\n');

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919999999999?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7]">
      {/* Breadcrumb (Etsy Style) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs font-sans text-gray-500 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-black">Homepage</Link>
        <span>&rsaquo;</span>
        <Link href="/shop" className="hover:text-black">Jewellery</Link>
        <span>&rsaquo;</span>
        <Link href="/category/rings" className="hover:text-black">Rings</Link>
        <span>&rsaquo;</span>
        <Link href="/shop" className="hover:text-black">Wedding & Engagement</Link>
        <span>&rsaquo;</span>
        <span className="text-[#18181B] font-medium truncate max-w-[280px] sm:max-w-none">{product.name}</span>
      </div>

      {/* Main Product Container */}
      <section className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ================================================================= */}
          {/* LEFT: ETSY-STYLE VERTICAL 10+ MULTI-PHOTO GALLERY SHOWCASE (7 COLS) */}
          {/* ================================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <ProductImageGallery
              images={allImages}
              productName={product.name}
              productId={product.id}
              badge={product.badge}
            />

            {/* Trust highlights under gallery */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E8E5DF] text-center font-sans text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#E8E5DF] shadow-xs">
                <Award className="w-5 h-5 text-[#B89035] mx-auto mb-1" />
                <span className="font-bold text-[#18181B] block">GRA Certified</span>
                <span className="text-[10px] text-gray-500">Report & Warranty Card</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E8E5DF] shadow-xs">
                <ShieldCheck className="w-5 h-5 text-[#064E3B] mx-auto mb-1" />
                <span className="font-bold text-[#18181B] block">100% Buyback</span>
                <span className="text-[10px] text-gray-500">Lifetime Upgrade Value</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E8E5DF] shadow-xs">
                <Truck className="w-5 h-5 text-[#059669] mx-auto mb-1" />
                <span className="font-bold text-[#18181B] block">Insured Delivery</span>
                <span className="text-[10px] text-gray-500">Tamper-Proof Box</span>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT: BUY BOX + ETSY SELLER CREDENTIALS + HIGHLIGHTS (5 COLS)     */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#E8E5DF] shadow-luxury">
            {/* Title & Headline (Etsy Style) */}
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#18181B] mb-2 leading-snug">
              {product.name}
            </h1>

            {/* Rare find tag */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-sans text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                Rare find
              </span>
              <span className="font-sans text-xs text-gray-500">
                • High in demand — Handcrafted in limited batches
              </span>
            </div>

            {/* Price Row (Etsy Format) */}
            <div className="mb-4 pb-4 border-b border-[#E8E5DF]">
              <div className="flex items-baseline gap-2.5">
                <span className="font-sans text-sm font-semibold text-gray-600">Now</span>
                <span className="font-sans text-3xl font-bold text-[#18181B]">
                  ₹{product.price.toLocaleString('en-IN')}+
                </span>
                <span className="font-sans text-sm text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}+
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs font-sans">
                <span className="text-emerald-700 font-bold">{discountPercent}% off</span>
                <span className="text-gray-400">•</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" /> Sale ends today
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Local taxes included (where applicable) • Free Luxury Velvet Gift Box
              </p>
            </div>

            {/* ============================================================= */}
            {/* ETSY SELLER / ARTISAN STUDIO BADGE (Direct Match to Etsy Screenshot 1 & 2) */}
            {/* ============================================================= */}
            <div className="bg-[#FAF8F5] border border-[#E8E5DF] rounded-2xl p-4 mb-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#022C22] text-[#D4AF37] border-2 border-[#D4AF37]/50 flex items-center justify-center font-serif text-lg font-bold shadow-sm flex-shrink-0">
                    S
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-sans text-xs font-bold text-gray-900">By Santosh & AURA Atelier</span>
                      <span className="font-sans text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                        Star Seller
                      </span>
                    </div>
                    <p className="font-sans text-[11px] text-gray-500">
                      foreverjewellstudio • Rajasthan & Surat, India
                    </p>
                    <div className="flex items-center gap-1.5 font-sans text-xs text-amber-600 mt-0.5">
                      <span className="font-bold">4.9</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-gray-500 text-[11px]">(538 reviews • 1.9k sales)</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFollowingShop(!isFollowingShop)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex-shrink-0 ${
                    isFollowingShop
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white hover:bg-gray-100 text-gray-800 border-gray-300'
                  }`}
                >
                  {isFollowingShop ? '✓ Following' : '+ Follow shop'}
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-[#E8E5DF] flex items-center justify-between text-[11px] font-sans text-gray-600">
                <span className="flex items-center gap-1 text-emerald-700">
                  <Clock className="w-3.5 h-3.5" /> Typically responds within 1 hour
                </span>
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="font-semibold text-[#064E3B] hover:text-[#043327] underline flex items-center gap-1 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#059669]" /> Message seller
                </button>
              </div>
            </div>

            {/* Dispatch & Delivery Guarantee Pill (Etsy Style) */}
            <div className="space-y-1.5 mb-5 font-sans text-xs">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span><strong>Dispatched from India</strong> (Jaipur & Surat Artisan Workshop)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Arrives soon!</strong> Get it by <strong>{getEstimatedDelivery()}</strong> if you order today
                </span>
              </div>
            </div>

            {/* Band colour dropdown (Etsy Style) */}
            <div className="mb-4">
              <label className="block font-sans text-xs font-semibold text-gray-800 mb-1.5">
                Band colour:
              </label>
              <select
                value={activeVariantIdx}
                onChange={(e) => setActiveVariantIdx(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-[#D5D1C9] hover:border-black rounded-xl p-3 text-xs font-sans text-gray-800 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer font-medium"
              >
                {product.variants.map((v, idx) => (
                  <option key={v.metal} value={idx}>
                    {v.metal}
                  </option>
                ))}
              </select>
            </div>

            {/* Ring size dropdown (Etsy Style) */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-sans text-xs font-semibold text-gray-800">
                  Ring size:
                </label>
                <a href="#size-guide" className="font-sans text-[11px] text-[#8C6A1F] underline flex items-center gap-0.5">
                  <Ruler className="w-3 h-3" /> Size Guide
                </a>
              </div>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5D1C9] hover:border-black rounded-xl p-3 text-xs font-sans text-gray-800 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer font-medium"
              >
                {sizes.map((s) => (
                  <option key={s} value={s}>
                    US {s} (Resize available on request)
                  </option>
                ))}
              </select>
            </div>

            {/* Add Personalisation (Etsy Style Collapsible) */}
            <div className="mb-5 border border-[#E8E5DF] rounded-xl overflow-hidden bg-[#FAF8F5]">
              <button
                type="button"
                onClick={() => setIsPersonalizationOpen(!isPersonalizationOpen)}
                className="w-full px-3.5 py-2.5 text-left text-xs font-sans font-semibold text-gray-800 hover:text-black flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-base text-gray-500 font-normal">+</span> Add personalisation <span className="text-gray-400 font-normal">(optional)</span>
                </span>
                <span className="text-xs text-gray-400">{isPersonalizationOpen ? '▲' : '▼'}</span>
              </button>

              {isPersonalizationOpen && (
                <div className="p-3.5 border-t border-[#E8E5DF] bg-white text-xs font-sans space-y-2">
                  <p className="text-gray-500 text-[11px]">
                    Enter inside ring engraving (Name, Date, or Secret Symbol). Up to 15 characters complimentary.
                  </p>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="e.g. Forever & Always"
                    value={engraving}
                    onChange={(e) => setEngraving(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              )}
            </div>

            {/* CTA Buttons (Etsy Dark Solid Button + WhatsApp) */}
            <div className="space-y-2.5 mb-6">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-[#222222] hover:bg-[#000000] text-white font-sans text-sm font-bold tracking-wide rounded-full transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAdded ? (
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <Check className="w-4 h-4" /> Added to cart!
                  </span>
                ) : (
                  'Add to cart'
                )}
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-3 bg-[#064E3B] hover:bg-[#043327] text-white font-sans text-xs font-bold tracking-wider uppercase transition-colors rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#34D399]" />
                Buy Instantly via WhatsApp
              </button>
            </div>

            {/* ============================================================= */}
            {/* ETSY ACCORDION 1: ITEM DETAILS (Direct Match to Etsy Screenshot 2) */}
            {/* ============================================================= */}
            <div className="border-t border-[#E8E5DF] pt-4 mb-4">
              <button
                type="button"
                onClick={() => setIsItemDetailsOpen(!isItemDetailsOpen)}
                className="w-full flex items-center justify-between py-2 text-left text-sm font-bold text-gray-900 cursor-pointer"
              >
                <span>Item details</span>
                {isItemDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isItemDetailsOpen && (
                <div className="pt-3 pb-2 text-xs font-sans text-gray-700 space-y-4">
                  {/* Highlights section */}
                  <div className="space-y-2.5 bg-[#F9F7F3] p-3.5 rounded-xl border border-[#E8E5DF]">
                    <span className="font-bold text-gray-900 block text-[11px] uppercase tracking-wider">
                      Highlights
                    </span>
                    <div className="flex items-center gap-2.5">
                      <Store className="w-4 h-4 text-[#064E3B] flex-shrink-0" />
                      <span>Delivery from a small business in India</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                      <span>Materials: Rose gold, Silver, Stone, White gold, Yellow gold</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Gem className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <span>Gemstone: {product.primaryGemstone || 'GRA Moissanite (Diamond Alternative)'}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-200 border border-rose-400 flex-shrink-0 inline-block" />
                      <span>Gem colour: {product.colorGrade}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>Style: {product.ringStyle || 'Art Deco / Royal Solitaire'}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Made to Order & Handcrafted</span>
                    </div>
                  </div>

                  {/* Detailed Description & Craftsmanship Narrative */}
                  <div className="space-y-3.5 border-t border-[#E8E5DF] pt-3.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="font-bold text-gray-900 text-[11px] uppercase tracking-wider">
                        About This Piece
                      </span>
                    </div>

                    <div className="space-y-2.5 text-[13px] font-sans text-gray-700 leading-relaxed">
                      {descriptionParagraphs.map((para, idx) => (
                        <p key={idx} className="text-gray-700">
                          {para}
                        </p>
                      ))}
                    </div>

                    {/* Luxury Perks Badges */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="flex items-center gap-2 p-2 bg-[#F9F7F3] rounded-lg border border-[#E8E5DF]/70 text-[11px] text-gray-800 font-medium">
                        <Package className="w-3.5 h-3.5 text-[#064E3B] flex-shrink-0" />
                        <span>Luxury Velvet Box</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-[#F9F7F3] rounded-lg border border-[#E8E5DF]/70 text-[11px] text-gray-800 font-medium">
                        <Ruler className="w-3.5 h-3.5 text-[#064E3B] flex-shrink-0" />
                        <span>Free Custom Sizing</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-[#F9F7F3] rounded-lg border border-[#E8E5DF]/70 text-[11px] text-gray-800 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#064E3B] flex-shrink-0" />
                        <span>Authenticity Card</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-[#F9F7F3] rounded-lg border border-[#E8E5DF]/70 text-[11px] text-gray-800 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                        <span>Lifetime Brilliance</span>
                      </div>
                    </div>

                    {/* Detailed Specifications Table */}
                    <div className="pt-2">
                      <span className="font-bold text-gray-900 block text-[11px] uppercase tracking-wider mb-2">
                        Specifications & Craftsmanship
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-gray-700">
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span className="text-gray-500">Primary Gemstone:</span>
                          <span className="font-semibold text-gray-900">{product.primaryGemstone || 'Moissanite'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span className="text-gray-500">Cut / Shape:</span>
                          <span className="font-semibold text-gray-900">{product.shape} Brilliant Cut</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span className="text-gray-500">Color Grade:</span>
                          <span className="font-semibold text-gray-900">{product.colorGrade}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span className="text-gray-500">Clarity:</span>
                          <span className="font-semibold text-gray-900">{product.clarity}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span className="text-gray-500">Secondary Gemstone:</span>
                          <span className="font-semibold text-gray-900">{product.secondaryGemstone || 'CZ Diamond Accents'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span className="text-gray-500">Band Metal:</span>
                          <span className="font-semibold text-gray-900">{activeVariant.metal}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span className="text-gray-500">Jewelry Style:</span>
                          <span className="font-semibold text-gray-900">{product.ringStyle || 'Art Deco Solitaire'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span className="text-gray-500">Occasion:</span>
                          <span className="font-semibold text-gray-900">{product.occasion || 'Engagement / Anniversary'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span className="text-gray-500">Personalization:</span>
                          <span className="font-semibold text-emerald-700">Free Laser Engraving</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span className="text-gray-500">Ring Size Range:</span>
                          <span className="font-semibold text-gray-900">US 4 to US 12 (Custom resize free)</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-gray-100">
                          <span className="text-gray-500">Method:</span>
                          <span className="font-semibold text-gray-900">100% Handcrafted in India</span>
                        </div>
                        {product.sku && (
                          <div className="flex items-center justify-between py-1 border-b border-gray-100">
                            <span className="text-gray-500">Vault SKU:</span>
                            <span className="font-mono text-gray-900 text-[10px]">{product.sku}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ============================================================= */}
            {/* ETSY ACCORDION 2: DELIVERY & RETURN POLICIES (Etsy Screenshot 3) */}
            {/* ============================================================= */}
            <div className="border-t border-[#E8E5DF] pt-4 mb-4">
              <button
                type="button"
                onClick={() => setIsDeliveryPolicyOpen(!isDeliveryPolicyOpen)}
                className="w-full flex items-center justify-between py-2 text-left text-sm font-bold text-gray-900 cursor-pointer"
              >
                <span>Delivery and return policies</span>
                {isDeliveryPolicyOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isDeliveryPolicyOpen && (
                <div className="pt-3 pb-2 text-xs font-sans text-gray-700 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <span>Order today to get by <strong>{getEstimatedDelivery()}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <RefreshCcw className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <span>Returns & exchanges: 30-Day Hassle-Free Replacement & Lifetime Brilliance Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-[#059669] flex-shrink-0" />
                    <span>Free express insured delivery across India & worldwide</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <span>Sent from: Jaipur & Surat, Rajasthan, India</span>
                  </div>

                  {/* PIN Code Delivery Checker */}
                  <form onSubmit={handlePinCheck} className="pt-2">
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Deliver to India (Check your PIN code):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 110001"
                        className="w-28 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-black font-mono"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-gray-100 border border-gray-300 text-gray-800 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Check
                      </button>
                    </div>
                    {pinCheckMsg && (
                      <p className="mt-1.5 text-[11px] text-emerald-700 font-medium">
                        {pinCheckMsg}
                      </p>
                    )}
                  </form>
                </div>
              )}
            </div>

            {/* Complete The Royal Stack */}
            <div className="pt-4 border-t border-[#E8E5DF]">
              <RingStackBuilder product={product} selectedMetal={activeVariant.metal} />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs / Specifications Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#E8E5DF]">
        <div className="max-w-4xl mx-auto">
          {/* Tab Header */}
          <div className="flex border-b border-[#E8E5DF] gap-8 justify-center mb-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 font-serif text-lg transition-all ${
                activeTab === 'details'
                  ? 'border-b-2 border-[#18181B] font-bold text-[#18181B]'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              The Design Story
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 font-serif text-lg transition-all ${
                activeTab === 'specs'
                  ? 'border-b-2 border-[#18181B] font-bold text-[#18181B]'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('certificate')}
              className={`pb-3 font-serif text-lg transition-all ${
                activeTab === 'certificate'
                  ? 'border-b-2 border-[#18181B] font-bold text-[#18181B]'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              GRA Lab Certificate
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'details' && (
            <div className="bg-white p-8 rounded-2xl border border-[#E8E5DF] shadow-xs leading-relaxed space-y-4 font-sans text-sm text-gray-700">
              <div className="space-y-3">
                {descriptionParagraphs.map((para, idx) => (
                  <p key={idx} className="leading-relaxed text-gray-700">
                    {para}
                  </p>
                ))}
              </div>
              <h4 className="font-serif text-lg font-bold text-[#18181B] pt-2">
                Signature Craftsmanship Highlights:
              </h4>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#059669] flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="bg-white p-8 rounded-2xl border border-[#E8E5DF] shadow-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 font-sans text-xs">
                <div>
                  <span className="text-gray-400 block">Stone Type</span>
                  <strong className="text-[#18181B] text-sm">Lab Moissanite</strong>
                </div>
                <div>
                  <span className="text-gray-400 block">Clarity Grade</span>
                  <strong className="text-[#18181B] text-sm">{product.clarity}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block">Color Grade</span>
                  <strong className="text-[#18181B] text-sm">{product.colorGrade}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block">Cut Symmetry</span>
                  <strong className="text-[#18181B] text-sm">{product.cut}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block">Mohs Hardness</span>
                  <strong className="text-[#18181B] text-sm">9.25 / 10</strong>
                </div>
                <div>
                  <span className="text-gray-400 block">Certification</span>
                  <strong className="text-[#18181B] text-sm">GRA Lab Report</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'certificate' && (
            <div className="bg-white p-8 rounded-2xl border border-[#E8E5DF] shadow-xs text-center">
              <Award className="w-12 h-12 text-[#B89035] mx-auto mb-3" />
              <h4 className="font-serif text-xl font-bold text-[#18181B] mb-2">
                Official Global Gemological Research Academy (GRA) Report
              </h4>
              <p className="font-sans text-xs text-gray-600 max-w-lg mx-auto mb-6">
                Your ring arrives with an embossed GRA credit card-sized authenticity certificate with a QR code and corresponding girdle serial number inscription.
              </p>
              <div className="inline-block p-4 bg-[#F7F5F0] rounded-xl border border-[#E8E5DF] text-xs font-mono text-gray-700">
                SERIAL: GRA-92847192 • D / VVS1 / EXCELLENT
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Carousel */}
      <section className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-16 border-t border-[#E8E5DF]">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center text-[#18181B] mb-1.5 sm:mb-2">
          You May Also Adore
        </h2>
        <p className="font-sans text-[11px] sm:text-xs text-gray-500 text-center mb-6 sm:mb-10 uppercase tracking-widest">
          Complementary Stacking Bands & Solitaires
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* The Signature Woke Educational Bottom Suite */}
      <MoissaniteComparison />
      <WhyChooseUs />
      <RingSizeGuide />
      <ReviewsSection />
      <FaqSection />
      <CustomJewelryBanner />

      {/* Floating Mobile Sticky Add to Bag / WhatsApp Bar (Inspired by Minimalist Jewels) */}
      <MobileStickyBuyBar
        product={product}
        selectedMetal={activeVariant.metal}
        selectedSize={selectedSize}
        selectedCarat={selectedCarat}
        activeImage={allImages[0]}
        onAddToCart={handleAddToCart}
        onWhatsAppOrder={handleWhatsAppOrder}
        isAdded={isAdded}
      />
    </div>
  );
}
