'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShieldCheck, Sparkles, Send, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import Link from 'next/link';

export default function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    freeShippingThreshold,
    totalItems,
  } = useCart();
  const { formatPrice, selectedCurrency, t } = useCurrency();


  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isGiftWrap, setIsGiftWrap] = useState(false);

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'FOREVER10') {
      setAppliedDiscount(subtotal * 0.1);
      setCouponError('');
    } else {
      setCouponError('Invalid code. Try "FOREVER10" for 10% off!');
      setAppliedDiscount(0);
    }
  };

  const giftWrapFee = isGiftWrap ? 149 : 0;
  const finalTotal = Math.max(0, subtotal - appliedDiscount + giftWrapFee);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Generate pre-filled WhatsApp message for Indian jewelry clients
  const handleWhatsAppCheckout = () => {
    let message = `*ORDER INQUIRY - FOREVERJEWELLSTUDIO*%0A%0A`;
    cart.forEach((item, idx) => {
      message += `*${idx + 1}. ${item.product.name}*%0A`;
      message += `• Metal: ${item.selectedMetal}%0A`;
      message += `• Size: ${item.selectedSize} | Carat: ${item.selectedCarat}%0A`;
      if (item.engravingText) {
        message += `• Engraving: "${item.engravingText}"%0A`;
      }
      message += `• Qty: ${item.quantity} x ${formatPrice(item.price)}%0A%0A`;
    });

    if (appliedDiscount > 0) {
      message += `*Discount Applied (FOREVER10):* -${formatPrice(appliedDiscount)}%0A`;
    }
    if (isGiftWrap) {
      message += `*Luxury Velvet Gift Box:* +${formatPrice(149)}%0A`;
    }
    message += `*Grand Total:* ${formatPrice(finalTotal)} (${selectedCurrency.code})%0A`;
    message += `*Shipping:* Free Insured International Delivery%0A%0A`;
    message += `Please confirm availability & delivery details for my address!`;

    window.open(`https://wa.me/919828930454?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
              className="w-screen max-w-md bg-[#FFF0F5] shadow-2xl flex flex-col justify-between border-l border-[#E8E5DF]"
            >
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-[#E8E5DF] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#8C6A1F]" />
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#18181B]">
                    {t.cart.title} ({totalItems})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700 active:scale-90 rounded-full transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="bg-[#F7F5F0] px-4 sm:px-6 py-2.5 sm:py-3 border-b border-[#E8E5DF]">
                <div className="flex items-center justify-between text-xs font-sans mb-1.5">
                  {remainingForFreeShipping > 0 ? (
                    <span className="text-[#18181B] text-[11px] sm:text-xs">
                      Add <strong className="text-[#C88E91]">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more for <span className="font-bold text-[#B76E79]">FREE Shipping</span>
                    </span>
                  ) : (
                    <span className="text-[#B76E79] font-semibold flex items-center gap-1 text-[11px] sm:text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                      You qualify for Free Express Delivery!
                    </span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-[#E8E5DF] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C88E91] to-[#B76E79] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
                {cart.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 bg-[#F7F5F0] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8E5DF]">
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-serif text-xl text-[#18181B] mb-2">
                      {t.cart.empty}
                    </h3>
                    <p className="font-sans text-xs text-gray-500 mb-6 max-w-xs mx-auto">
                      Explore our handcrafted Moissanite Solitaire rings certified with authentic GRA reports.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsCartOpen(false)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#18181B] text-[#D39EAA] font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#8C6A1F] hover:text-white active:scale-95 transition-all rounded-xl cursor-pointer"
                    >
                      Browse Solitaires <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-white rounded-xl border border-[#E8E5DF] shadow-xs"
                    >
                      <img
                        src={item.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-100 bg-[#F7F5F0]"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif text-sm font-semibold text-[#18181B] leading-tight line-clamp-2">
                              {item.product.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 active:scale-90 transition-all p-1 cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="font-sans text-[11px] text-gray-500 mt-1">
                            {item.selectedMetal} • US {item.selectedSize} • {item.selectedCarat}
                          </p>
                          {item.engravingText && (
                            <p className="font-sans text-[10px] text-[#8C6A1F] italic mt-0.5">
                              Engraving: "{item.engravingText}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                          <div className="flex items-center border border-gray-200 rounded-md bg-[#FFF0F5]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 hover:bg-gray-100 active:scale-90 text-gray-600 cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-sans text-xs font-semibold px-2">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-gray-100 active:scale-90 text-gray-600 cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-sans text-sm font-bold text-[#B76E79]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-3 sm:p-5 bg-white border-t border-[#E8E5DF] space-y-2 sm:space-y-3">
                  {/* Gift Wrap Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] sm:text-xs font-sans text-gray-700">
                    <input
                      type="checkbox"
                      checked={isGiftWrap}
                      onChange={(e) => setIsGiftWrap(e.target.checked)}
                      className="rounded border-gray-300 text-[#C88E91] focus:ring-[#C88E91]"
                    />
                    <span>Add Premium Velvet Gift Packaging & Ribbon (+₹149)</span>
                  </label>

                  {/* Totals Summary */}
                  <div className="space-y-1 pt-1.5 border-t border-gray-100 text-[11px] sm:text-xs font-sans">
                    <div className="flex justify-between text-gray-500">
                      <span>{t.cart.subtotal}</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-[#059669] font-medium">
                        <span>Discount</span>
                        <span>-{formatPrice(appliedDiscount)}</span>
                      </div>
                    )}
                    {isGiftWrap && (
                      <div className="flex justify-between text-gray-500">
                        <span>Luxury Gift Box</span>
                        <span>+{formatPrice(149)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-500">
                      <span>Insured Express Shipping</span>
                      <span className="text-[#059669] font-bold">{t.cart.freeShipping}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm font-bold text-[#18181B] pt-1.5 border-t border-gray-200">
                      <span>Total</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-2 pt-1">
                    {/* View Full Cart */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartOpen(false);
                        router.push('/cart');
                      }}
                      className="flex-1 py-2.5 sm:py-3 border border-gray-300 bg-white hover:bg-gray-50 text-[#222222] font-sans text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-colors rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#8C6A1F]" />
                      View Cart
                    </button>

                    {/* Standard Secure Checkout */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartOpen(false);
                        router.push('/checkout');
                      }}
                      className="flex-1 py-2.5 sm:py-3 bg-[#222222] text-white hover:bg-black active:scale-95 font-sans text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D39EAA]" />
                      Checkout
                    </button>
                  </div>

                  {/* Trust footer */}
                  <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-sans pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#C88E91]" /> 100% Secure
                    </span>
                    <span>•</span>
                    <span>GRA Verified</span>
                    <span>•</span>
                    <span>15-Day Exchange</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
