'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/lib/data';

interface MobileStickyBuyBarProps {
  product: Product;
  selectedMetal: string;
  selectedSize: string;
  selectedCarat: string;
  activeImage: string;
  onAddToCart: () => void;
  onWhatsAppOrder: () => void;
  isAdded: boolean;
}

export default function MobileStickyBuyBar({
  product,
  selectedMetal,
  selectedSize,
  selectedCarat,
  activeImage,
  onAddToCart,
  onWhatsAppOrder,
  isAdded,
}: MobileStickyBuyBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past 450px (after the main image and buy box heading)
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E8E5DF] shadow-[0_-4px_25px_rgba(0,0,0,0.12)] px-3 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))]"
        >
          <div className="flex items-center justify-between gap-2.5 max-w-md mx-auto">
            {/* Left: Thumbnail & Price */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-11 h-11 rounded-lg overflow-hidden border border-[#E8E5DF] bg-[#F7F5F0] flex-shrink-0">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-serif text-xs font-bold text-[#18181B] truncate leading-tight">
                  {product.name}
                </p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-sans text-xs font-bold text-[#064E3B]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="font-sans text-[9px] text-gray-500 uppercase">
                    • {selectedMetal.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={onAddToCart}
                className="px-3 py-2 bg-[#18181B] hover:bg-[#B89035] text-[#D4AF37] hover:text-white rounded-lg font-sans text-[11px] font-bold tracking-wider uppercase transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
              >
                {isAdded ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Added
                  </span>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={onWhatsAppOrder}
                className="px-3 py-2 bg-[#064E3B] hover:bg-[#043327] text-white rounded-lg font-sans text-[11px] font-bold tracking-wider uppercase transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#34D399]" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
