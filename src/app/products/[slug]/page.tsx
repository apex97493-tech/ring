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
  Heart,
  Check,
} from 'lucide-react';
import { getProductBySlug, products, METALS } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/products/ProductCard';
import MoissaniteComparison from '@/components/sections/MoissaniteComparison';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import RingSizeGuide from '@/components/sections/RingSizeGuide';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FaqSection from '@/components/sections/FaqSection';
import CustomJewelryBanner from '@/components/sections/CustomJewelryBanner';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const { addToCart, isWishlisted, toggleWishlist } = useCart();

  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedCarat, setSelectedCarat] = useState(product.carat);
  const [selectedSize, setSelectedSize] = useState('6');
  const [engraving, setEngraving] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'certificate'>('details');
  const [isAdded, setIsAdded] = useState(false);

  const activeVariant = product.variants[activeVariantIdx] || product.variants[0];
  const allImages = [activeVariant.image, ...product.images.filter((i) => i !== activeVariant.image)];

  const sizes = ['4', '5', '6', '7', '8', '9', '10'];
  const caratOptions = ['1.50 CT', '2.00 CT', '2.50 CT', '3.00 CT'];

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

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
    const text = `*ORDER INQUIRY: ${product.name.toUpperCase()}*%0A• Metal: ${activeVariant.metal}%0A• Carat: ${selectedCarat}%0A• Ring Size: US ${selectedSize}%0A${
      engraving ? `• Engraving: "${engraving}"%0A` : ''
    }• Price: ₹${product.price.toLocaleString('en-IN')}%0A%0APlease assist me with payment & delivery details!`;
    window.open(`https://wa.me/919999999999?text=${text}`, '_blank');
  };

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7]">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs font-sans text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link href={`/category/${product.category}`} className="hover:text-black capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#18181B] font-medium truncate">{product.name}</span>
      </div>

      {/* Main Product Container */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Gallery Showcase */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F7F5F0] border border-[#E8E5DF] shadow-md">
              <motion.img
                key={activeImageIdx + activeVariant.metal}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                src={allImages[activeImageIdx] || allImages[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#18181B] text-[#D4AF37] font-sans text-[10px] font-bold tracking-widest px-3 py-1 rounded-sm shadow-md uppercase">
                  {product.badge}
                </span>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full shadow-md backdrop-blur-md transition-all ${
                  isWishlisted(product.id)
                    ? 'bg-rose-50 text-rose-500'
                    : 'bg-white/90 text-gray-700 hover:text-[#B89035]'
                }`}
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-3 justify-center sm:justify-start overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 bg-white flex-shrink-0 transition-all ${
                    activeImageIdx === idx
                      ? 'border-[#B89035] scale-105 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Trust highlights under gallery */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#E8E5DF] text-center font-sans text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#E8E5DF]">
                <Award className="w-5 h-5 text-[#B89035] mx-auto mb-1" />
                <span className="font-bold text-[#18181B] block">GRA Certified</span>
                <span className="text-[10px] text-gray-500">Report & Warranty Card</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E8E5DF]">
                <ShieldCheck className="w-5 h-5 text-[#064E3B] mx-auto mb-1" />
                <span className="font-bold text-[#18181B] block">100% Buyback</span>
                <span className="text-[10px] text-gray-500">Lifetime Upgrade Value</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E8E5DF]">
                <Truck className="w-5 h-5 text-[#059669] mx-auto mb-1" />
                <span className="font-bold text-[#18181B] block">Insured Delivery</span>
                <span className="text-[10px] text-gray-500">Tamper-Proof Box</span>
              </div>
            </div>
          </div>

          {/* Right: Customization & Buy Box */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DF] shadow-luxury sticky top-28">
            {/* Reviews snippet */}
            <div className="flex items-center gap-2 mb-2 text-amber-500 text-xs font-sans">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-gray-800">{product.rating}</span>
              <span className="text-gray-400">({product.reviewsCount} customer reviews)</span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#18181B] mb-2 leading-tight">
              {product.name}
            </h1>

            <p className="font-sans text-xs text-gray-500 mb-4 uppercase tracking-wider">
              {product.shape} Cut • {product.carat} • {product.clarity} • {product.colorGrade}
            </p>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#E8E5DF]">
              <span className="font-sans text-3xl font-bold text-[#064E3B]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="font-sans text-base text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="font-sans text-xs font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-1 rounded-full">
                {discountPercent}% OFF
              </span>
            </div>

            {/* Metal Swatch Selection */}
            <div className="mb-6">
              <label className="block font-sans text-xs font-bold text-[#18181B] tracking-wider uppercase mb-2.5">
                Metal Type: <span className="text-[#8C6A1F]">{activeVariant.metal}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.metal}
                    onClick={() => {
                      setActiveVariantIdx(idx);
                      setActiveImageIdx(0);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-sans transition-all cursor-pointer ${
                      activeVariantIdx === idx
                        ? 'border-[#B89035] bg-[#F4E8C1]/30 font-bold text-[#18181B] ring-2 ring-[#B89035]/40'
                        : 'border-[#E8E5DF] bg-[#FDFBF7] text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/20"
                      style={{ backgroundColor: v.colorCode }}
                    />
                    <span>{v.metal}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Carat & Ring Size */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Carat */}
              <div>
                <label className="block font-sans text-xs font-bold text-[#18181B] tracking-wider uppercase mb-2">
                  Carat Size:
                </label>
                <select
                  value={selectedCarat}
                  onChange={(e) => setSelectedCarat(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#E8E5DF] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#B89035] font-semibold"
                >
                  {caratOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Ring Size */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-sans text-xs font-bold text-[#18181B] tracking-wider uppercase">
                    Ring Size:
                  </label>
                  <a href="#size-guide" className="font-sans text-[10px] text-[#8C6A1F] underline flex items-center gap-0.5">
                    <Ruler className="w-3 h-3" /> Size Guide
                  </a>
                </div>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#E8E5DF] rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#B89035] font-semibold"
                >
                  {sizes.map((s) => (
                    <option key={s} value={s}>US Size {s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Engraving */}
            <div className="mb-6 bg-[#F7F5F0] p-3.5 rounded-xl border border-[#E8E5DF]">
              <label className="block font-sans text-xs font-semibold text-[#18181B] mb-1">
                Complimentary Inner Laser Engraving:
              </label>
              <input
                type="text"
                maxLength={15}
                placeholder="e.g. Forever & Always (Max 15 chars)"
                value={engraving}
                onChange={(e) => setEngraving(e.target.value)}
                className="w-full bg-white border border-[#E8E5DF] rounded-lg px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#B89035]"
              />
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-[#18181B] hover:bg-[#B89035] text-[#D4AF37] hover:text-white font-sans text-xs font-bold tracking-widest uppercase transition-all rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAdded ? (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-4 h-4" /> Added to Shopping Bag!
                  </span>
                ) : (
                  'Add to Shopping Bag'
                )}
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-3.5 bg-[#064E3B] hover:bg-[#043327] text-white font-sans text-xs font-bold tracking-widest uppercase transition-colors rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4 text-[#34D399]" />
                Buy Instantly via WhatsApp
              </button>
            </div>

            {/* Delivery Estimator */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-sans text-gray-600">
              <Truck className="w-4 h-4 text-[#059669]" />
              <span>
                Dispatched in 24-48 hrs • <strong>Free Express Air Shipping</strong>
              </span>
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
              <p>{product.description}</p>
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
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#E8E5DF]">
        <h2 className="font-serif text-3xl font-bold text-center text-[#18181B] mb-2">
          You May Also Adore
        </h2>
        <p className="font-sans text-xs text-gray-500 text-center mb-10 uppercase tracking-widest">
          Complementary Stacking Bands & Solitaires
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
    </div>
  );
}
