'use client';

import React, { useState } from 'react';
import { Sparkles, Plus, Check, ShieldCheck, Heart } from 'lucide-react';
import { Product } from '@/lib/data';
import { useCart } from '@/context/CartContext';

interface RingStackBuilderProps {
  product: Product;
  selectedMetal: string;
}

export default function RingStackBuilder({ product, selectedMetal }: RingStackBuilderProps) {
  const { addToCart } = useCart();
  const [includeBand, setIncludeBand] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Companion Band details (Curved Chevron Diamond / Moissanite Tiara Band)
  const bandPrice = 8499;
  const bundleDiscount = 0.15; // 15% discount on the set
  const originalTotalPrice = product.price + bandPrice;
  const discountedTotalPrice = Math.round(originalTotalPrice * (1 - bundleDiscount));
  const savings = originalTotalPrice - discountedTotalPrice;

  const handleAddStack = () => {
    // Add primary solitaire ring
    addToCart({
      product,
      quantity: 1,
      selectedMetal,
      selectedSize: '6',
      selectedCarat: product.carat,
      price: product.price,
      image: product.images[0],
    });

    // If companion band is selected, add it as bundle item
    if (includeBand) {
      addToCart({
        product: {
          ...product,
          id: `${product.id}-band`,
          name: 'The Crown Curved Tiara Band (Moissanite)',
          slug: 'curved-tiara-band',
          price: bandPrice,
          originalPrice: 10999,
          badge: 'Stacking Band',
        },
        quantity: 1,
        selectedMetal,
        selectedSize: '6',
        selectedCarat: '0.45 CT Pave',
        price: bandPrice,
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop',
      });
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-[#FDFBF7] to-[#F7F5F0] rounded-2xl border-2 border-[#D4AF37]/40 p-4 sm:p-6 my-6 shadow-luxury">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#18181B]">
            Complete The Royal Stack
          </h3>
        </div>
        <span className="bg-[#ECFDF5] text-[#065F46] font-sans text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border border-[#A7F3D0]">
          Save 15% on Ring Sets
        </span>
      </div>

      <p className="font-sans text-xs text-gray-600 mb-4 leading-relaxed">
        Our solitaire baskets are engineered with a micro-arch elevation to fit completely flush against our contoured Chevron Tiara Band with zero gap.
      </p>

      {/* Visual Ring Pairings Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Item 1: Main Ring */}
        <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-[#E8E5DF]">
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F7F5F0] flex-shrink-0">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <span className="font-sans text-[9px] uppercase tracking-wider text-[#8C6A1F] font-bold block">
              Item 1: Solitaire Ring
            </span>
            <p className="font-serif text-xs font-bold text-[#18181B] truncate">
              {product.name}
            </p>
            <p className="font-sans text-xs font-semibold text-[#064E3B]">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Item 2: Companion Tiara Band */}
        <div
          onClick={() => setIncludeBand(!includeBand)}
          className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
            includeBand
              ? 'bg-[#F4E8C1]/30 border-[#B89035] ring-2 ring-[#B89035]/30'
              : 'bg-white border-[#E8E5DF] opacity-75 hover:opacity-100'
          }`}
        >
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#F7F5F0] flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop"
              alt="Curved Chevron Tiara Band"
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-white ${
                includeBand ? 'bg-[#064E3B]' : 'bg-gray-300'
              }`}
            >
              <Check className="w-2.5 h-2.5" />
            </div>
          </div>
          <div className="min-w-0">
            <span className="font-sans text-[9px] uppercase tracking-wider text-[#064E3B] font-bold block">
              Item 2: Matching Band
            </span>
            <p className="font-serif text-xs font-bold text-[#18181B] truncate">
              Curved Chevron Tiara Band
            </p>
            <p className="font-sans text-xs font-semibold text-[#064E3B]">
              +₹{bandPrice.toLocaleString('en-IN')}{' '}
              <span className="text-[10px] text-gray-400 line-through">₹10,999</span>
            </p>
          </div>
        </div>
      </div>

      {/* Pricing & Add Stack Action */}
      <div className="pt-3 border-t border-[#E8E5DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-lg font-bold text-[#064E3B]">
              ₹{(includeBand ? discountedTotalPrice : product.price).toLocaleString('en-IN')}
            </span>
            {includeBand && (
              <>
                <span className="font-sans text-xs text-gray-400 line-through">
                  ₹{originalTotalPrice.toLocaleString('en-IN')}
                </span>
                <span className="font-sans text-[11px] font-bold text-[#059669]">
                  (You Save ₹{savings.toLocaleString('en-IN')})
                </span>
              </>
            )}
          </div>
          <p className="font-sans text-[10px] text-gray-500">
            {includeBand
              ? 'Includes 2 matching rings + Lifetime setting warranty'
              : 'Add matching curved band to unlock 15% set discount'}
          </p>
        </div>

        <button
          onClick={handleAddStack}
          className="px-5 py-2.5 bg-[#022C22] hover:bg-[#B89035] text-[#D4AF37] hover:text-white rounded-xl font-sans text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {isAdded ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Added Stack to Bag!
            </span>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>{includeBand ? 'Add 2-Piece Stack Set' : 'Add Solitaire Only'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
