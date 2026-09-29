"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package, Search, Truck, CheckCircle2, Clock,
  MapPin, CreditCard, ShieldCheck, ChevronDown, ChevronUp,
  Mail, Phone, Gem, Star, RefreshCw, AlertCircle,
  Box, Loader2,
} from "lucide-react";
import { Order } from "@/lib/types/order";

const STATUS_STEPS = [
  { key: "confirmed", label: "Order Confirmed", icon: CheckCircle2, desc: "We received your order" },
  { key: "processing", label: "Crafting", icon: Gem, desc: "Artisans at work" },
  { key: "shipped", label: "Shipped", icon: Truck, desc: "On the way to you" },
  { key: "delivered", label: "Delivered", icon: Box, desc: "Enjoy your jewelry!" },
];
const STATUS_ORDER = ["confirmed", "processing", "shipped", "delivered"];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending:    { label: "Pending Payment", cls: "bg-amber-100 text-amber-800 border border-amber-200" },
    confirmed:  { label: "Order Confirmed", cls: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
    processing: { label: "Being Crafted",   cls: "bg-purple-100 text-purple-800 border border-purple-200" },
    shipped:    { label: "Shipped",         cls: "bg-blue-100 text-blue-800 border border-blue-200" },
    delivered:  { label: "Delivered",       cls: "bg-green-100 text-green-800 border border-green-200" },
    cancelled:  { label: "Cancelled",       cls: "bg-red-100 text-red-800 border border-red-200" },
  };
  const s = map[status] || map["pending"];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

function OrderProgressBar({ status }: { status: string }) {
  const currentIdx = STATUS_ORDER.indexOf(status);
  if (currentIdx < 0) return null;
  return (
    <div className="py-5">
      <div className="flex items-start justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 mx-10" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-[#064E3B] mx-10 transition-all duration-500"
          style={{ width: `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
        />
        {STATUS_STEPS.map(({ key, label, icon: Icon, desc }, idx) => {
          const done = idx <= currentIdx;
          return (
            <div key={key} className="flex flex-col items-center z-10 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${done ? "bg-[#064E3B] border-[#064E3B] text-white shadow-md" : "bg-white border-gray-300 text-gray-400"}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className={`mt-2 text-[10px] font-semibold text-center leading-tight ${done ? "text-[#064E3B]" : "text-gray-400"}`}>{label}</p>
              <p className="text-[9px] text-gray-400 text-center">{desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const isPaid = order.payment?.status === "paid";
  const payLabel: Record<string, string> = {
    paypal: "PayPal", card: "Credit / Debit Card",
    payoneer: "Payoneer", bank_transfer: "Bank Transfer / UPI", whatsapp: "WhatsApp Order",
  };
  const dateFormatted = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Order Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Order ID</p>
            <p className="font-mono font-bold text-[#064E3B] text-sm">#{order.id}</p>
          </div>
          <div className="h-8 w-px bg-gray-300 hidden sm:block" />
          <div>
            <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Date</p>
            <p className="text-sm font-medium text-gray-800">{dateFormatted}</p>
          </div>
          <div className="h-8 w-px bg-gray-300 hidden sm:block" />
          <div>
            <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Total</p>
            <p className="text-sm font-bold text-gray-900">{order.currencySymbol}{Number(order.total).toLocaleString()} {order.currency}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={order.orderStatus} />
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${isPaid ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
            {isPaid ? "✓ Paid" : "Awaiting Payment"}
          </span>
        </div>
      </div>

      {/* Items preview */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex flex-col gap-2.5">
          {order.items.slice(0, expanded ? undefined : 2).map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#064E3B]/10 flex items-center justify-center shrink-0">
                <Gem className="w-4 h-4 text-[#064E3B]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.productName}</p>
                <p className="text-[11px] text-gray-500">{item.metal}{item.size ? ` · Size ${item.size}` : ""} · Qty {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-gray-900 shrink-0">{order.currencySymbol}{Number(item.totalPrice ?? item.unitPrice ?? 0).toLocaleString()}</p>
            </div>
          ))}
          {!expanded && order.items.length > 2 && (
            <p className="text-xs text-[#064E3B] font-medium">+{order.items.length - 2} more item(s)</p>
          )}
          {order.items.length === 0 && (
            <p className="text-xs text-gray-400 italic">Item details loading…</p>
          )}
        </div>
      </div>

      {/* Expand Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 border-t border-gray-100 text-xs text-[#064E3B] font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
      >
        {expanded ? <><ChevronUp className="w-3.5 h-3.5" /> Hide Details</> : <><ChevronDown className="w-3.5 h-3.5" /> View Full Order Details</>}
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-5 bg-gray-50/50">
          {/* Progress */}
          {order.orderStatus !== "cancelled" && order.orderStatus !== "pending" && (
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Order Progress</p>
              <OrderProgressBar status={order.orderStatus} />
            </div>
          )}

          {/* Address + Payment */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-3.5 h-3.5 text-[#064E3B]" />
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Delivery Address</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{order.customer.firstName} {order.customer.lastName}</p>
              <p className="text-xs text-gray-600">{order.customer.streetAddress}</p>
              {order.customer.apartment && <p className="text-xs text-gray-600">{order.customer.apartment}</p>}
              <p className="text-xs text-gray-600">{order.customer.city}, {order.customer.state} {order.customer.postalCode}</p>
              <p className="text-xs font-semibold text-gray-700">{order.customer.country}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-3.5 h-3.5 text-[#064E3B]" />
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Payment</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{payLabel[order.payment?.method || ""] || "Unknown"}</p>
              <p className={`text-xs mt-0.5 font-semibold ${isPaid ? "text-green-600" : "text-amber-600"}`}>
                {isPaid ? "✓ Payment Confirmed" : "⏳ Awaiting Verification"}
              </p>
              {order.payment?.transactionId && (
                <p className="text-[10px] text-gray-500 mt-1 font-mono">Ref: {order.payment.transactionId}</p>
              )}
              <div className="border-t border-gray-100 mt-3 pt-2 flex justify-between">
                <span className="text-xs text-gray-500">Total</span>
                <span className="text-sm font-bold text-gray-900">{order.currencySymbol}{Number(order.total).toLocaleString()} {order.currency}</span>
              </div>
            </div>
          </div>

          {/* Courier tracking */}
          {(order as any).trackingNumber && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Truck className="w-4 h-4 text-blue-700" />
                <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Courier Tracking</p>
              </div>
              <p className="text-sm font-mono font-bold text-blue-900">{(order as any).courier}: {(order as any).trackingNumber}</p>
              <p className="text-[11px] text-blue-600 mt-0.5">Visit the courier website and enter this tracking number.</p>
            </div>
          )}

          {/* Support */}
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919828930454'}?text=Hi%20ForeverJewell%20Team,%20I%20need%20help%20with%20order%20%23${order.id}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#064E3B] text-white text-xs font-semibold rounded-lg hover:bg-[#043327] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> WhatsApp Support
            </a>
            <a
              href={`mailto:Foreverjewels98@gmail.com?subject=Order%20%23${order.id}%20Support`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 bg-white text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> Email Support
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyOrdersPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("orderId") || params.get("id");
    const email = params.get("email");
    const term = id || email;
    if (term) { setQuery(term); handleSearch(term); }
  }, []);

  const handleSearch = async (searchTerm?: string) => {
    const term = (searchTerm !== undefined ? searchTerm : query).trim();
    if (!term) { setError("Please enter your Order ID (e.g. FJ-450892) or the email address used at checkout."); return; }
    setIsLoading(true); setError(null); setSearched(true);
    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
        setOrders(data.orders);
      } else {
        setOrders([]);
        setError(data.error || `No orders found for "${term}". Please verify your Order ID or the email used during checkout.`);
      }
    } catch { setError("Could not connect to the server. Please try again."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFDF8] to-[#F5F5F0]">
      {/* Hero Banner */}
      <div className="bg-[#064E3B] text-white py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Package className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">My Orders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Order History & Tracking</h1>
          <p className="text-sm text-emerald-200 mt-2 max-w-lg mx-auto">
            Enter your Order ID or the email you used at checkout to view all your orders, track shipments, and get support.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 mt-5">
            {[{ icon: ShieldCheck, text: "SSL Secured" }, { icon: Star, text: "Premium Craftsmanship" }, { icon: Truck, text: "Global Shipping" }].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-emerald-200 text-xs">
                <Icon className="w-3.5 h-3.5" /><span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Search Box */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Look Up Your Order</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. FJ-450892  or  your@email.com"
                className="w-full pl-9 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064E3B]/30 focus:border-[#064E3B] transition-all"
              />
            </div>
            <button
              onClick={() => handleSearch()} disabled={isLoading}
              className="px-5 py-3 bg-[#064E3B] hover:bg-[#043327] text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-60 shrink-0 cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span className="hidden sm:inline">Find Orders</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#064E3B]" />
            Your order details are private. Only accessible by you with your Order ID or email.
          </p>
        </div>

        {/* Error */}
        {error && !isLoading && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Order Not Found</p>
              <p className="text-xs text-amber-700 mt-0.5">{error}</p>
              <p className="text-xs text-amber-600 mt-2">Need help? <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919828930454'}?text=Hi%2C%20I%20cannot%20find%20my%20order`} target="_blank" rel="noopener noreferrer" className="underline font-semibold">Chat on WhatsApp</a></p>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#064E3B] mb-3" />
            <p className="text-sm">Looking up your orders…</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && orders.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Found <span className="text-[#064E3B] font-bold">{orders.length}</span> order{orders.length > 1 ? "s" : ""}</p>
              <button onClick={() => handleSearch()} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#064E3B] transition-colors cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>
            {orders.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        )}

        {/* Empty initial state */}
        {!isLoading && !searched && (
          <div className="text-center py-14">
            <div className="w-16 h-16 bg-[#064E3B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-[#064E3B]" />
            </div>
            <p className="text-sm font-medium text-gray-600">Enter your Order ID or email above to view your orders</p>
            <p className="text-xs text-gray-400 mt-1">Your Order ID is in the format FJ-XXXXXX and was shown at checkout</p>
          </div>
        )}

        {/* Trust Strip */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { icon: ShieldCheck, title: "100% Secure", sub: "SSL encrypted" },
              { icon: Star, title: "GIA Certified", sub: "Lab report included" },
              { icon: Truck, title: "Insured Shipping", sub: "Tracked to your door" },
              { icon: RefreshCw, title: "30-Day Returns", sub: "Hassle-free policy" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-full bg-[#064E3B]/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#064E3B]" />
                </div>
                <p className="text-xs font-bold text-gray-800">{title}</p>
                <p className="text-[10px] text-gray-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer help */}
        <p className="text-center text-xs text-gray-500">
          Still need help?{" "}
          <Link href="/contact" className="text-[#064E3B] font-semibold hover:underline">Contact us</Link>{" "}or{" "}
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919828930454'}`} target="_blank" rel="noopener noreferrer" className="text-[#064E3B] font-semibold hover:underline">WhatsApp us</a>
          . We respond within 2 hours.
        </p>
      </div>
    </div>
  );
}
