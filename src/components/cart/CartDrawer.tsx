'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShieldCheck, Sparkles, Send, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartDrawer() {
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

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isGiftWrap, setIsGiftWrap] = useState(false);

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'WOKE10') {
      setAppliedDiscount(subtotal * 0.1);
      setCouponError('');
    } else {
      setCouponError('Invalid code. Try "WOKE10" for 10% off!');
      setAppliedDiscount(0);
    }
  };

  const giftWrapFee = isGiftWrap ? 149 : 0;
  const finalTotal = Math.max(0, subtotal - appliedDiscount + giftWrapFee);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Generate pre-filled WhatsApp message for Indian jewelry clients
  const handleWhatsAppCheckout = () => {
    let message = `*ORDER INQUIRY - AURA FINE JEWELRY*%0A%0A`;
    cart.forEach((item, idx) => {
      message += `*${idx + 1}. ${item.product.name}*%0A`;
      message += `• Metal: ${item.selectedMetal}%0A`;
      message += `• Size: ${item.selectedSize} | Carat: ${item.selectedCarat}%0A`;
      if (item.engravingText) {
        message += `• Engraving: "${item.engravingText}"%0A`;
      }
      message += `• Qty: ${item.quantity} x ₹${item.price.toLocaleString('en-IN')}%0A%0A`;
    });

    if (appliedDiscount > 0) {
      message += `*Discount Applied (WOKE10):* -₹${Math.round(appliedDiscount).toLocaleString('en-IN')}%0A`;
    }
    if (isGiftWrap) {
      message += `*Luxury Velvet Gift Box:* +₹149%0A`;
    }
    message += `*Grand Total:* ₹${Math.round(finalTotal).toLocaleString('en-IN')}%0A`;
    message += `*Shipping:* Free Insured Delivery%0A%0A`;
    message += `Please confirm availability & delivery details for my pincode!`;

    window.open(`https://wa.me/919999999999?text=${message}`, '_blank');
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

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
              className="w-screen max-w-md bg-[#FDFBF7] shadow-2xl flex flex-col justify-between border-l border-[#E8E5DF]"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#E8E5DF] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#8C6A1F]" />
                  <h2 className="font-serif text-2xl font-bold text-[#18181B]">
                    Your Shopping Bag ({totalItems})
                  </h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="bg-[#F7F5F0] px-6 py-3 border-b border-[#E8E5DF]">
                <div className="flex items-center justify-between text-xs font-sans mb-1.5">
                  {remainingForFreeShipping > 0 ? (
                    <span className="text-[#18181B]">
                      Add <strong className="text-[#B89035]">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more for <span className="font-bold text-[#064E3B]">FREE Insured Express Shipping</span>
                    </span>
                  ) : (
                    <span className="text-[#064E3B] font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                      You qualify for Complimentary Express Insured Delivery!
                    </span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-[#E8E5DF] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#B89035] to-[#064E3B] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 bg-[#F7F5F0] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8E5DF]">
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-serif text-xl text-[#18181B] mb-2">
                      Your bag is currently empty
                    </h3>
                    <p className="font-sans text-xs text-gray-500 mb-6 max-w-xs mx-auto">
                      Explore our handcrafted Moissanite Solitaire rings certified with authentic GRA reports.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#18181B] text-[#D4AF37] font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#8C6A1F] hover:text-white transition-colors rounded-none"
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
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
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
                          <div className="flex items-center border border-gray-200 rounded-md bg-[#FDFBF7]">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 text-gray-600"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-sans text-xs font-semibold px-2">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 text-gray-600"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-sans text-sm font-bold text-[#064E3B]">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-6 bg-white border-t border-[#E8E5DF] space-y-4">
                  {/* Coupon Code Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. WOKE10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs font-sans uppercase focus:outline-none focus:border-[#B89035]"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-[#F7F5F0] hover:bg-[#E8E5DF] text-[#18181B] text-xs font-bold tracking-wider uppercase rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="font-sans text-[11px] text-red-500 -mt-2">{couponError}</p>
                  )}
                  {appliedDiscount > 0 && (
                    <p className="font-sans text-[11px] text-[#059669] font-medium -mt-2 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> 10% First Order Discount Applied!
                    </p>
                  )}

                  {/* Gift Wrap Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-sans text-gray-700">
                    <input
                      type="checkbox"
                      checked={isGiftWrap}
                      onChange={(e) => setIsGiftWrap(e.target.checked)}
                      className="rounded border-gray-300 text-[#B89035] focus:ring-[#B89035]"
                    />
                    <span>Add Premium Velvet Gift Packaging & Ribbon (+₹149)</span>
                  </label>

                  {/* Totals Summary */}
                  <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs font-sans">
                    <div className="flex justify-between text-gray-500">
                      <span>Bag Subtotal</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-[#059669] font-medium">
                        <span>Discount (WOKE10)</span>
                        <span>-₹{Math.round(appliedDiscount).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {isGiftWrap && (
                      <div className="flex justify-between text-gray-500">
                        <span>Luxury Gift Box</span>
                        <span>+₹149</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-500">
                      <span>Insured Express Shipping</span>
                      <span className="text-[#059669] font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#18181B] pt-2 border-t border-gray-200">
                      <span>Total (Incl. all taxes)</span>
                      <span>₹{Math.round(finalTotal).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-2 pt-2">
                    {/* 1-Click WhatsApp Quick Checkout */}
                    <button
                      onClick={handleWhatsAppCheckout}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#064E3B] text-[#D4AF37] hover:bg-[#043327] font-sans text-xs font-bold tracking-widest uppercase transition-all shadow-md rounded-none cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      Quick Order via WhatsApp
                    </button>

                    {/* Standard Secure Checkout */}
                    <button
                      onClick={() => alert(`Proceeding to Razorpay / Cashfree Gateway for ₹${Math.round(finalTotal)}`)}
                      className="w-full py-3.5 bg-[#18181B] text-white hover:bg-black font-sans text-xs font-bold tracking-widest uppercase transition-colors rounded-none cursor-pointer"
                    >
                      Secure Online Checkout
                    </button>
                  </div>

                  {/* Trust footer */}
                  <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-sans pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#B89035]" /> 100% Secure
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
