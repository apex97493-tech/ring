'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { ShippingAddress, Order, OrderItem } from '@/lib/types/order';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  CreditCard,
  ArrowLeft,
  Truck,
  Sparkles,
  MapPin,
  User,
  Mail,
  Phone,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Package,
  Clock,
  Send,
  HelpCircle,
} from 'lucide-react';

const POPULAR_COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'India',
  'Germany',
  'France',
  'United Arab Emirates',
  'Singapore',
  'Netherlands',
  'Italy',
  'Spain',
  'Japan',
  'Other',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();
  const { formatPrice, selectedCurrency, t } = useCurrency();

  // Form State
  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  const [saveAddress, setSaveAddress] = useState(true);
  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'payoneer' | 'whatsapp'>('paypal');
  const [payoneerReference, setPayoneerReference] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedPayoneer, setCopiedPayoneer] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState('');

  // Load saved address from localStorage on mount (Amazon-style)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fj_saved_shipping_address');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.firstName && parsed.streetAddress) {
          setFormData(parsed);
          setHasSavedAddress(true);
        }
      }
    } catch (e) {
      console.error('Error loading saved address:', e);
    }
  }, []);

  // Calculate currency converted prices using selectedCurrency object
  const currencyCode = selectedCurrency.code;
  const currencySymbol = selectedCurrency.symbol;
  const convertedSubtotal = Math.round(subtotal * selectedCurrency.rate);
  const shippingFee = 0; // Free express worldwide shipping
  const finalTotal = convertedSubtotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim() || !formData.email.includes('@'))
      newErrors.email = 'Valid email is required for receipt & tracking';
    if (!formData.phone.trim() || formData.phone.length < 7)
      newErrors.phone = 'Valid phone number is required for shipping courier';
    if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'ZIP / Postal code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    if (paymentMethod === 'payoneer' && !payoneerReference.trim()) {
      newErrors.payoneer = 'Please enter your Payoneer email or Transaction Reference ID';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Order to backend
  const handlePlaceOrder = async (overridePayment?: {
    method: 'paypal' | 'card' | 'payoneer' | 'whatsapp';
    status: 'paid' | 'pending';
    transactionId?: string;
  }) => {
    if (!validateForm()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save address if opted in
      if (saveAddress) {
        localStorage.setItem('fj_saved_shipping_address', JSON.stringify(formData));
      }

      // Prepare order items
      const orderItems: OrderItem[] = cart.map((item) => {
        const itemConvertedPrice = Math.round(item.price * selectedCurrency.rate);
        return {
          productId: item.product.id,
          productName: item.product.name,
          productSlug: item.product.slug,
          metal: item.selectedMetal,
          size: item.selectedSize || 'US 7',
          carat: item.selectedCarat || item.product.carat,
          engraving: item.engravingText,
          quantity: item.quantity,
          unitPrice: itemConvertedPrice,
          totalPrice: itemConvertedPrice * item.quantity,
          image: item.image || item.product.images?.[0] || '',
        };
      });

      const effectivePayment = overridePayment || {
        method: paymentMethod,
        status: paymentMethod === 'paypal' ? 'paid' : 'pending',
        payoneerReference: paymentMethod === 'payoneer' ? payoneerReference : undefined,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: orderItems,
          currency: currencyCode,
          currencySymbol: currencySymbol,
          subtotal: convertedSubtotal,
          shippingFee: 0,
          total: finalTotal,
          payment: effectivePayment,
        }),
      });

      const data = await res.json();

      if (data.success && data.order) {
        setCompletedOrder(data.order);
        setWhatsAppUrl(data.whatsAppUrl || '');
        clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(data.error || 'Failed to place order. Please try again.');
      }
    } catch (err: any) {
      console.error('Order error:', err);
      alert('An unexpected error occurred while placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPayoneerEmail = () => {
    const email = process.env.NEXT_PUBLIC_PAYONEER_EMAIL || 'payments@foreverjewellstudio.com';
    navigator.clipboard.writeText(email);
    setCopiedPayoneer(true);
    setTimeout(() => setCopiedPayoneer(false), 2500);
  };

  // SUCCESS SCREEN
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white border border-[#E5E0D8] rounded-xl shadow-lg p-6 sm:p-10 text-center">
          <div className="w-16 h-16 bg-[#064E3B]/10 text-[#064E3B] rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase tracking-widest text-[#B89035] font-semibold">
            Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#18181B] mt-2 mb-2">
            Thank you, {completedOrder.customer.firstName}!
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Your handcrafted jewelry order has been received and registered under order ID{' '}
            <strong className="text-[#18181B]">#{completedOrder.id}</strong>.
          </p>

          {/* WhatsApp Direct Notification Callout */}
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-5 mb-8 text-left">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#064E3B] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Send className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#064E3B]">
                  Send Order to ForeverJewell Concierge on WhatsApp
                </h3>
                <p className="text-xs text-gray-600 mt-1 mb-3">
                  Click below to instantly send your order details, ring size confirmation, and address directly to our jewelry artisan team on WhatsApp.
                </p>
                {whatsAppUrl && (
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#064E3B] hover:bg-[#043327] text-white text-xs font-bold uppercase tracking-wider rounded shadow transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Open WhatsApp Order Message
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="border border-gray-200 rounded-lg p-5 text-left mb-8 bg-[#FAFAFA]">
            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3">
              Delivery Details
            </h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-semibold text-gray-900">
                {completedOrder.customer.firstName} {completedOrder.customer.lastName}
              </p>
              <p>
                {completedOrder.customer.streetAddress}
                {completedOrder.customer.apartment && `, ${completedOrder.customer.apartment}`}
              </p>
              <p>
                {completedOrder.customer.city}, {completedOrder.customer.state}{' '}
                {completedOrder.customer.postalCode}, {completedOrder.customer.country}
              </p>
              <p className="text-xs text-gray-500 pt-1">
                Phone: {completedOrder.customer.phone} | Email: {completedOrder.customer.email}
              </p>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <h4 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3">
                Items ({completedOrder.items.length})
              </h4>
              <div className="space-y-3">
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-gray-900">{it.productName}</span>
                      <p className="text-gray-500 text-[11px]">
                        Metal: {it.metal} | Size: {it.size} | Qty: {it.quantity}
                      </p>
                    </div>
                    <span className="font-medium text-gray-900">
                      {completedOrder.currencySymbol}
                      {it.totalPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-3 flex justify-between text-sm font-bold text-gray-900">
              <span>Total Paid / Due</span>
              <span>
                {completedOrder.currencySymbol}
                {completedOrder.total.toLocaleString()} {completedOrder.currency}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="px-6 py-3 bg-[#18181B] text-white hover:bg-black text-xs font-bold tracking-widest uppercase transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART SCREEN
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FDFBF7] px-4">
        <div className="max-w-md w-full bg-white border border-[#E5E0D8] rounded-xl p-8 text-center shadow-sm">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Package className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-serif text-gray-900 mb-2">Your Shopping Bag is Empty</h2>
          <p className="text-xs text-gray-500 mb-6">
            Add your favorite handcrafted moissanite rings and fine jewelry before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-[#064E3B] text-white hover:bg-[#043327] text-xs font-bold tracking-widest uppercase transition-colors rounded shadow"
          >
            Explore Jewelry Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#18181B]">
      {/* Checkout Minimal Top Bar */}
      <header className="border-b border-[#E5E0D8] bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Shop</span>
          </Link>

          <Link href="/" className="font-serif text-lg tracking-widest uppercase font-bold text-[#18181B]">
            FOREVER JEWELL STUDIO
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-[#064E3B] font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">256-Bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Customer Form & Payment (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Contact Info */}
            <div className="bg-white border border-[#E5E0D8] rounded-xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#18181B] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-base font-serif font-bold tracking-wide">
                    Contact Information
                  </h2>
                </div>
                {hasSavedAddress && (
                  <span className="text-[11px] text-[#064E3B] bg-[#F0FDF4] px-2 py-0.5 rounded font-medium border border-[#BBF7D0]">
                    ✓ Saved Address Loaded
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email Address * (for order receipt & tracking)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className={`w-full px-3.5 py-2.5 text-xs bg-white border ${
                      errors.email ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                    } rounded focus:outline-none focus:border-[#B89035]`}
                  />
                  {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Phone Number * (for delivery courier)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full px-3.5 py-2.5 text-xs bg-white border ${
                      errors.phone ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                    } rounded focus:outline-none focus:border-[#B89035]`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address (Amazon-style) */}
            <div className="bg-white border border-[#E5E0D8] rounded-xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-6 h-6 rounded-full bg-[#18181B] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-base font-serif font-bold tracking-wide">
                  Shipping Address
                </h2>
              </div>

              <div className="space-y-4">
                {/* Country */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Country / Region *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded focus:outline-none focus:border-[#B89035]"
                  >
                    {POPULAR_COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* First and Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Jane"
                      className={`w-full px-3.5 py-2.5 text-xs bg-white border ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      } rounded focus:outline-none focus:border-[#B89035]`}
                    />
                    {errors.firstName && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className={`w-full px-3.5 py-2.5 text-xs bg-white border ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      } rounded focus:outline-none focus:border-[#B89035]`}
                    />
                    {errors.lastName && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    placeholder="123 Luxury Lane"
                    className={`w-full px-3.5 py-2.5 text-xs bg-white border ${
                      errors.streetAddress ? 'border-red-500' : 'border-gray-300'
                    } rounded focus:outline-none focus:border-[#B89035]`}
                  />
                  {errors.streetAddress && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.streetAddress}</p>
                  )}
                </div>

                {/* Apartment, Suite, etc. */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Apartment, Suite, Unit, etc. (optional)
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment || ''}
                    onChange={handleInputChange}
                    placeholder="Apt 4B, Penthouse"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded focus:outline-none focus:border-[#B89035]"
                  />
                </div>

                {/* City, State, ZIP */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className={`w-full px-3.5 py-2.5 text-xs bg-white border ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      } rounded focus:outline-none focus:border-[#B89035]`}
                    />
                    {errors.city && <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="NY"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded focus:outline-none focus:border-[#B89035]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      ZIP / Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      className={`w-full px-3.5 py-2.5 text-xs bg-white border ${
                        errors.postalCode ? 'border-red-500' : 'border-gray-300'
                      } rounded focus:outline-none focus:border-[#B89035]`}
                    />
                    {errors.postalCode && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.postalCode}</p>
                    )}
                  </div>
                </div>

                {/* Amazon-style "Save this address" checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="w-4 h-4 text-[#064E3B] rounded border-gray-300 focus:ring-0"
                    />
                    <span className="text-xs text-gray-700 font-medium">
                      Save this address for a faster 1-click checkout next time
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Selector */}
            <div className="bg-white border border-[#E5E0D8] rounded-xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-6 h-6 rounded-full bg-[#18181B] text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="text-base font-serif font-bold tracking-wide">
                  Payment Method
                </h2>
              </div>

              {/* Tabs for Payment Gateways */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-lg mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`py-2.5 px-2 text-xs font-semibold rounded-md transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                    paymentMethod === 'paypal'
                      ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#B89035]" />
                  <span>PayPal / Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('payoneer')}
                  className={`py-2.5 px-2 text-xs font-semibold rounded-md transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                    paymentMethod === 'payoneer'
                      ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-[#FF4800] text-white text-[10px] font-bold flex items-center justify-center">
                    P
                  </span>
                  <span>Payoneer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`py-2.5 px-2 text-xs font-semibold rounded-md transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                    paymentMethod === 'whatsapp'
                      ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Send className="w-4 h-4 text-[#064E3B]" />
                  <span>WhatsApp</span>
                </button>
              </div>

              {/* TAB 1: PAYPAL & CARDS */}
              {paymentMethod === 'paypal' && (
                <div className="space-y-4">
                  <div className="bg-[#F8FAFC] border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-900">
                        Pay with PayPal or Any Debit / Credit Card
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <Lock className="w-3 h-3 text-[#064E3B]" /> Encrypted
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      Accepts <strong>Visa, MasterCard, American Express, Discover, and PayPal Balance</strong>. Customers outside India can pay directly in their local currency without extra exchange fees.
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {['VISA', 'Mastercard', 'AMEX', 'Discover', 'PayPal'].map((brand) => (
                        <span
                          key={brand}
                          className="px-2 py-0.5 bg-white border border-gray-300 rounded text-[10px] font-bold text-gray-700 tracking-wider"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() =>
                        handlePlaceOrder({
                          method: 'paypal',
                          status: 'paid',
                          transactionId: `PP-${Date.now().toString().slice(-8)}`,
                        })
                      }
                      className="w-full py-3.5 bg-[#FFC439] hover:bg-[#F2BA36] text-black font-sans text-xs font-bold tracking-widest uppercase transition-all shadow rounded flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      {isSubmitting
                        ? 'Processing Payment...'
                        : `Pay ${currencySymbol}${finalTotal.toLocaleString()} with PayPal / Card`}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: PAYONEER */}
              {paymentMethod === 'payoneer' && (
                <div className="space-y-4">
                  <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-lg p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-xs font-bold text-[#9A3412] uppercase tracking-wider">
                          Payoneer Direct Transfer
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Transfer directly using your Payoneer balance or Payoneer payment link.
                        </p>
                      </div>
                      <span className="px-2 py-0.5 bg-[#EA580C] text-white text-[10px] font-bold rounded">
                        0% Surcharge
                      </span>
                    </div>

                    <div className="bg-white border border-gray-200 rounded p-3 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="text-gray-500 block text-[10px] uppercase font-semibold">
                            Beneficiary Payoneer Email
                          </span>
                          <span className="font-mono font-bold text-gray-900 select-all">
                            {process.env.NEXT_PUBLIC_PAYONEER_EMAIL || 'payments@foreverjewellstudio.com'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={copyPayoneerEmail}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                        >
                          {copiedPayoneer ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Your Payoneer Email or Transaction Reference ID *
                      </label>
                      <input
                        type="text"
                        value={payoneerReference}
                        onChange={(e) => setPayoneerReference(e.target.value)}
                        placeholder="e.g. your_email@example.com or Trx ID #10892"
                        className={`w-full px-3.5 py-2.5 text-xs bg-white border ${
                          errors.payoneer ? 'border-red-500' : 'border-gray-300'
                        } rounded focus:outline-none focus:border-[#B89035]`}
                      />
                      {errors.payoneer && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.payoneer}</p>
                      )}
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handlePlaceOrder()}
                        className="w-full py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-sans text-xs font-bold tracking-widest uppercase transition-all shadow rounded flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {isSubmitting
                          ? 'Submitting Order...'
                          : `Confirm Payoneer Order (${currencySymbol}${finalTotal.toLocaleString()})`}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: WHATSAPP DIRECT ORDER */}
              {paymentMethod === 'whatsapp' && (
                <div className="space-y-4">
                  <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Send className="w-4 h-4 text-[#064E3B]" />
                      <h4 className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
                        1-Click WhatsApp Concierge Order
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 mb-4">
                      Prefer to finalize payment and discuss custom engraving or ring sizing directly with our jewelry team? Submit your order here and it will open directly on WhatsApp with your complete shipping address.
                    </p>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handlePlaceOrder({ method: 'whatsapp', status: 'pending' })}
                      className="w-full py-3.5 bg-[#064E3B] hover:bg-[#043327] text-[#D4AF37] font-sans text-xs font-bold tracking-widest uppercase transition-all shadow rounded flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      {isSubmitting
                        ? 'Creating Order...'
                        : `Place Order & Message on WhatsApp (${currencySymbol}${finalTotal.toLocaleString()})`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Order Summary (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-white border border-[#E5E0D8] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                <h3 className="font-serif text-base font-bold text-gray-900">
                  Order Summary ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </h3>
                <span className="text-xs text-gray-500 font-mono">
                  {selectedCurrency.code}
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1">
                {cart.map((item) => {
                  const itemConvertedPrice = Math.round(item.price * selectedCurrency.rate);
                  return (
                    <div key={item.id} className="py-3 flex gap-3 items-center">
                      <div className="w-14 h-14 relative bg-[#F4F1EA] rounded shrink-0 overflow-hidden border border-gray-200">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        )}
                        <span className="absolute -top-1 -right-1 bg-gray-800 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {item.selectedMetal} • Size: {item.selectedSize || 'US 7'}
                        </p>
                        {item.engravingText && (
                          <p className="text-[10px] text-[#B89035] italic">
                            Engraving: &ldquo;{item.engravingText}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="text-xs font-bold text-gray-900 shrink-0">
                        {currencySymbol}
                        {(itemConvertedPrice * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {currencySymbol}
                    {convertedSubtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#064E3B]" />
                    Insured Express Worldwide Shipping
                  </span>
                  <span className="text-[#064E3B] font-bold uppercase tracking-wider text-[11px]">
                    FREE
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B89035]" />
                    Velvet Ring Box & GRA Certificate
                  </span>
                  <span className="text-[#064E3B] font-bold uppercase tracking-wider text-[11px]">
                    INCLUDED
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <span className="text-lg font-serif font-bold text-gray-900">
                      {currencySymbol}
                      {finalTotal.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-gray-400">
                      Includes all applicable duties & packaging
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3 text-xs text-gray-700">
                <ShieldCheck className="w-4 h-4 text-[#B89035] shrink-0" />
                <span>
                  <strong>GRA Certified Moissanite:</strong> Authenticity card & laser inscription with every ring.
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-700">
                <Truck className="w-4 h-4 text-[#064E3B] shrink-0" />
                <span>
                  <strong>Doorstep Courier Delivery:</strong> Dispatched via FedEx / DHL with full door-to-door tracking.
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-700">
                <Clock className="w-4 h-4 text-[#B89035] shrink-0" />
                <span>
                  <strong>15-Day Exchange Guarantee:</strong> Sizing adjustments and return support.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
