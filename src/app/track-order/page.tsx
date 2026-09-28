'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Search,
  Truck,
  Sparkles,
  Clock,
  CheckCircle2,
  MapPin,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Send,
  Printer,
  ChevronRight,
  AlertCircle,
  Gem,
} from 'lucide-react';
import { Order } from '@/lib/types/order';

export default function TrackOrderPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);

  // Check URL params if navigated with ?orderId=...
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('orderId') || params.get('id');
    if (id) {
      setQuery(id);
      handleSearch(id);
    }
  }, []);

  const handleSearch = async (searchTerm?: string) => {
    const term = (searchTerm !== undefined ? searchTerm : query).trim();
    if (!term) {
      setError('Please enter your Order ID (e.g. #FJ-123456) or Email Address.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(term)}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
        setOrders(data.orders);
      } else {
        setOrders([]);
        setError(data.error || `No orders found for "${term}". Please verify your details.`);
      }
    } catch (err: any) {
      console.error('Tracking fetch error:', err);
      setError('Could not connect to tracking server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: Order['orderStatus']) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Order Confirmed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'processing':
        return { label: 'In Artisan Workshop', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'shipped':
        return { label: 'Dispatched with Courier', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'delivered':
        return { label: 'Delivered', color: 'bg-green-50 text-green-700 border-green-200' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200' };
      default:
        return { label: 'Order Registered', color: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#18181B] py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <span className="text-xs uppercase tracking-widest text-[#B89035] font-semibold flex items-center justify-center gap-1.5 mb-2">
          <Gem className="w-3.5 h-3.5 text-[#B89035]" />
          Forever Jewell Studio Concierge
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#18181B] font-normal mb-3">
          Track Your Jewelry Order
        </h1>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          Enter your Order ID (e.g. <strong className="text-gray-900 font-mono">#FJ-XXXXXX</strong>) or Email Address to check crafting progress, insured dispatch tracking, and past order history.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="mt-6 max-w-xl mx-auto flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-xl shadow-md border border-[#E5E0D8]"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Order ID (#FJ-...) or Email"
              className="w-full pl-10 pr-3 py-3 text-xs bg-transparent focus:outline-none text-gray-900"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-[#064E3B] hover:bg-[#043327] text-[#D4AF37] text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
            ) : (
              <>
                <span>Lookup Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 max-w-xl mx-auto p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Orders Result List */}
      <div className="max-w-4xl mx-auto space-y-8">
        {orders.map((order) => {
          const badge = getStatusBadge(order.orderStatus);
          const isPaid = order.payment.status === 'paid';
          const clientPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918387072406';
          const whatsappInquiry = encodeURIComponent(
            `Hi ForeverJewellStudio, I am checking the status of my order #${order.id} for ${order.customer.firstName} ${order.customer.lastName}.`
          );

          return (
            <div
              key={order.id}
              className="bg-white border border-[#E5E0D8] rounded-xl shadow-md overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-[#FAF8F5] border-b border-[#E5E0D8] p-5 sm:px-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-serif font-bold text-base text-[#18181B]">
                      Order #{order.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${clientPhone}?text=${whatsappInquiry}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#064E3B] text-white hover:bg-[#043327] rounded text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>WhatsApp Concierge</span>
                  </a>
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 text-gray-500 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50"
                    title="Print Receipt"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Real-Time Fulfillment Timeline */}
              <div className="p-6 border-b border-gray-100 bg-[#FCFBF9]">
                <h4 className="text-[11px] uppercase font-bold text-gray-400 tracking-wider mb-4">
                  Crafting & Delivery Milestones
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                  {/* Step 1: Confirmed */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                      ✓
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-900">Order Confirmed</h5>
                      <p className="text-[11px] text-gray-500 mt-0.5">Payment verified & logged</p>
                    </div>
                  </div>

                  {/* Step 2: Artisan Workshop */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        ['processing', 'shipped', 'delivered'].includes(order.orderStatus)
                          ? 'bg-[#B89035] text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-900">Artisan Workshop</h5>
                      <p className="text-[11px] text-gray-500 mt-0.5">Handcrafted & hallmarked</p>
                    </div>
                  </div>

                  {/* Step 3: Courier Dispatch */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        ['shipped', 'delivered'].includes(order.orderStatus)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-900">Dispatched</h5>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {order.trackingNumber
                          ? `Tracking: ${order.trackingNumber}`
                          : 'Insured international air'}
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        order.orderStatus === 'delivered'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-900">Delivered</h5>
                      <p className="text-[11px] text-gray-500 mt-0.5">Signed upon receipt</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items & Customer Details */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left 7 cols: Items */}
                <div className="md:col-span-7 space-y-4">
                  <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                    Purchased Jewelry ({order.items.length})
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3.5 p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        {item.image ? (
                          <div className="w-14 h-14 relative rounded overflow-hidden bg-white border border-gray-200 shrink-0">
                            <Image
                              src={item.image}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-gray-100 rounded flex items-center justify-center shrink-0 text-gray-400">
                            <Gem className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.productSlug}`}
                            className="text-xs font-serif font-bold text-gray-900 hover:text-[#064E3B] transition-colors line-clamp-1"
                          >
                            {item.productName}
                          </Link>
                          <p className="text-[11px] text-gray-600 mt-0.5">
                            Metal: <strong>{item.metal}</strong> | Size: <strong>{item.size}</strong>
                            {item.carat ? ` | Carat: ${item.carat}` : ''}
                          </p>
                          {item.engraving && (
                            <p className="text-[10px] text-[#B89035] italic mt-0.5">
                              Engraving: &ldquo;{item.engraving}&rdquo;
                            </p>
                          )}
                          <p className="text-xs font-bold text-gray-900 mt-1">
                            {order.currencySymbol}
                            {item.totalPrice.toLocaleString()} {order.currency}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right 5 cols: Address & Payment Summary */}
                <div className="md:col-span-5 bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4 text-xs">
                  <div>
                    <h5 className="text-[11px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-[#064E3B]" />
                      Shipping Address
                    </h5>
                    <p className="font-semibold text-gray-900">
                      {order.customer.firstName} {order.customer.lastName}
                    </p>
                    <p className="text-gray-600 mt-0.5">
                      {order.customer.streetAddress}
                      {order.customer.apartment ? `, ${order.customer.apartment}` : ''}
                    </p>
                    <p className="text-gray-600">
                      {order.customer.city}, {order.customer.state || ''} {order.customer.postalCode}
                    </p>
                    <p className="text-gray-600 font-medium">{order.customer.country}</p>
                    <p className="text-gray-500 text-[11px] pt-1">
                      Phone: {order.customer.phone}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <h5 className="text-[11px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1 mb-2">
                      <CreditCard className="w-3.5 h-3.5 text-[#B89035]" />
                      Payment Method
                    </h5>
                    <p className="capitalize font-semibold text-gray-900">
                      {order.payment.method === 'paypal'
                        ? 'PayPal / Credit Card'
                        : order.payment.method === 'bank_transfer'
                        ? 'Kotak Mahindra Bank / UPI'
                        : order.payment.method}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Status: <strong className={isPaid ? 'text-emerald-700' : 'text-amber-700'}>{order.payment.status.toUpperCase()}</strong>
                      {order.payment.transactionId && ` (Txn: ${order.payment.transactionId})`}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-sm font-bold text-gray-900">
                    <span>Total Due / Paid:</span>
                    <span className="text-base text-[#064E3B]">
                      {order.currencySymbol}
                      {order.total.toLocaleString()} {order.currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {searched && orders.length === 0 && !error && (
          <div className="text-center py-12 bg-white rounded-xl border border-[#E5E0D8] p-8">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-serif text-gray-900 mb-1">No Orders Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
              We couldn&apos;t find an order matching that query. Please make sure you have entered the correct Order ID or email address.
            </p>
            <Link
              href="/shop"
              className="px-5 py-2.5 bg-[#18181B] text-white text-xs font-bold uppercase tracking-wider rounded"
            >
              Return to Jewelry Collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
