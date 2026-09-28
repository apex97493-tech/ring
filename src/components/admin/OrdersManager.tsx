'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Order } from '@/lib/types/order';
import {
  Package,
  Search,
  RefreshCw,
  Copy,
  Check,
  Send,
  Phone,
  Mail,
  MapPin,
  Truck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

interface OrdersManagerProps {
  orders: Order[];
  isLoading: boolean;
  onRefresh: () => void;
  onUpdateStatus: (id: string, status: string, trackingNumber?: string, carrier?: string) => Promise<void>;
  updatingOrderId: string | null;
}

const CARRIERS = ['DHL Express', 'FedEx', 'UPS', 'IndiaPost Speed Post', 'USPS', 'Blue Dart'];

export default function OrdersManager({
  orders,
  isLoading,
  onRefresh,
  onUpdateStatus,
  updatingOrderId,
}: OrdersManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Tracking inputs per order
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { tracking: string; carrier: string }>>({});

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (statusFilter !== 'all' && order.orderStatus !== statusFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(q);
      const matchEmail = order.customer.email.toLowerCase().includes(q);
      const matchPhone = order.customer.phone.toLowerCase().includes(q);
      const matchCity = order.customer.city.toLowerCase().includes(q);
      const matchCountry = order.customer.country.toLowerCase().includes(q);
      const matchItems = order.items.some((it) => it.productName.toLowerCase().includes(q));
      return matchId || matchName || matchEmail || matchPhone || matchCity || matchCountry || matchItems;
    }

    return true;
  });

  // Calculate metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending').length;
  const confirmedOrders = orders.filter((o) => o.orderStatus === 'confirmed' || o.orderStatus === 'processing').length;
  const shippedOrders = orders.filter((o) => o.orderStatus === 'shipped' || o.orderStatus === 'delivered').length;

  const copyAddress = (order: Order) => {
    const text = `${order.customer.firstName} ${order.customer.lastName}\n${order.customer.streetAddress}${
      order.customer.apartment ? `, ${order.customer.apartment}` : ''
    }\n${order.customer.city}, ${order.customer.state || ''} ${order.customer.postalCode}\n${
      order.customer.country
    }\nPhone: ${order.customer.phone}\nEmail: ${order.customer.email}`;
    navigator.clipboard.writeText(text);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const openCustomerWhatsApp = (order: Order) => {
    const cleanPhone = order.customer.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${order.customer.firstName}! Greetings from ForeverJewellStudio.\n` +
      `Regarding your order *#${order.id}* for *${order.items.map((i) => i.productName).join(', ')}*:\n` +
      (order.trackingNumber
        ? `Your parcel has been dispatched via ${order.carrier || 'Express Courier'} with tracking: *${order.trackingNumber}*.\n`
        : `Your order is currently being prepared by our master artisans with care.\n`) +
      `Please let us know if you need any assistance!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleSaveTracking = (orderId: string, currentStatus: string) => {
    const info = trackingInputs[orderId] || { tracking: '', carrier: 'DHL Express' };
    onUpdateStatus(orderId, currentStatus === 'pending' ? 'shipped' : currentStatus, info.tracking, info.carrier);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full text-white">
      {/* HEADER & METRIC STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#032019] border border-white/10 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Orders</span>
            <Package className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <p className="text-2xl font-serif font-bold text-white mt-2">{totalOrders}</p>
          <span className="text-[10px] text-gray-400">All customer bookings</span>
        </div>

        <div className="bg-[#032019] border border-white/10 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Pending Action</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-amber-300 mt-2">{pendingOrders}</p>
          <span className="text-[10px] text-amber-400/80">Awaiting confirmation</span>
        </div>

        <div className="bg-[#032019] border border-white/10 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">In Production</span>
            <RefreshCw className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-blue-300 mt-2">{confirmedOrders}</p>
          <span className="text-[10px] text-blue-400/80">Cast & sizing in progress</span>
        </div>

        <div className="bg-[#032019] border border-white/10 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-medium uppercase tracking-wider">Dispatched</span>
            <Truck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-emerald-300 mt-2">{shippedOrders}</p>
          <span className="text-[10px] text-emerald-400/80">Shipped or delivered</span>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-[#032019] border border-white/15 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, Phone, Email, City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/20 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'processing', label: 'Processing' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-[#D4AF37] text-[#022C22] shadow'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              {st.label}
            </button>
          ))}

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="ml-2 p-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg border border-white/10 transition-colors cursor-pointer"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#D4AF37]' : ''}`} />
          </button>
        </div>
      </div>

      {/* ORDERS LIST */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#032019] border border-white/10 rounded-2xl p-12 text-center">
          <Package className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-serif font-bold text-white mb-1">No Orders Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'No customer orders match the current filter criteria.'
              : 'Orders placed on the store or via PayPal/Payoneer/WhatsApp will appear here automatically.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const currentTrackingInfo = trackingInputs[order.id] || {
              tracking: order.trackingNumber || '',
              carrier: order.carrier || 'DHL Express',
            };

            const isUpdating = updatingOrderId === order.id;

            return (
              <div
                key={order.id}
                className="bg-[#032019] border border-white/15 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 transition-all hover:border-[#D4AF37]/50"
              >
                {/* Top Row: Order ID, Date, Status, Total */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-[#D4AF37] bg-[#D4AF37]/15 px-2.5 py-1 rounded-lg border border-[#D4AF37]/30">
                      #{order.id}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block text-[10px] uppercase font-mono">Total Value</span>
                      <span className="text-base font-serif font-bold text-white">
                        {order.currencySymbol}
                        {order.total.toLocaleString()} {order.currency}
                      </span>
                    </div>

                    {/* Order Status Badge & Dropdown */}
                    <div className="relative">
                      <select
                        value={order.orderStatus}
                        disabled={isUpdating}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer uppercase tracking-wider ${
                          order.orderStatus === 'confirmed' || order.orderStatus === 'delivered'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            : order.orderStatus === 'shipped'
                            ? 'bg-blue-950/80 text-blue-300 border-blue-500/40'
                            : order.orderStatus === 'processing'
                            ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-red-950/80 text-red-300 border-red-500/40'
                            : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Middle Grid: Customer & Shipping | Ordered Items */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  {/* Customer & Shipping Details (5 Cols) */}
                  <div className="md:col-span-5 bg-black/40 border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        Customer & Shipping Address
                      </span>
                      <button
                        onClick={() => copyAddress(order)}
                        className="flex items-center gap-1 text-[11px] text-gray-300 hover:text-white px-2 py-0.5 rounded border border-white/10 bg-white/5 transition-colors cursor-pointer"
                        title="Copy full shipping label"
                      >
                        {copiedId === order.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-xs text-gray-300 space-y-1">
                      <p className="font-bold text-white text-sm">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="text-gray-300">
                        {order.customer.streetAddress}
                        {order.customer.apartment && `, ${order.customer.apartment}`}
                      </p>
                      <p className="text-gray-300">
                        {order.customer.city}, {order.customer.state || ''} {order.customer.postalCode}
                      </p>
                      <p className="font-semibold text-white">{order.customer.country}</p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
                      <a
                        href={`tel:${order.customer.phone}`}
                        className="flex items-center gap-1 text-gray-300 hover:text-[#D4AF37]"
                      >
                        <Phone className="w-3 h-3 text-[#D4AF37]" />
                        <span>{order.customer.phone}</span>
                      </a>
                      <span className="text-gray-600">•</span>
                      <a
                        href={`mailto:${order.customer.email}`}
                        className="flex items-center gap-1 text-gray-300 hover:text-[#D4AF37] truncate max-w-[180px]"
                      >
                        <Mail className="w-3 h-3 text-[#D4AF37]" />
                        <span className="truncate">{order.customer.email}</span>
                      </a>

                      <button
                        onClick={() => openCustomerWhatsApp(order)}
                        className="ml-auto flex items-center gap-1 px-2.5 py-1 bg-[#064E3B] hover:bg-[#043327] text-[#D4AF37] text-[11px] font-bold rounded transition-colors cursor-pointer"
                        title="Message customer on WhatsApp"
                      >
                        <Send className="w-3 h-3" />
                        <span>WhatsApp Customer</span>
                      </button>
                    </div>

                    {/* Payment Info */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-gray-400">Payment:</span>
                      <span className="font-semibold text-white flex items-center gap-1">
                        {order.payment.method === 'paypal' ? (
                          <span className="text-[#FFC439]">PayPal / Card</span>
                        ) : order.payment.method === 'payoneer' ? (
                          <span className="text-[#FF7A00]">
                            Payoneer ({order.payment.payoneerReference || 'Pending Ref'})
                          </span>
                        ) : (
                          <span className="text-emerald-400">WhatsApp Order</span>
                        )}
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            order.payment.status === 'paid'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {order.payment.status.toUpperCase()}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Ordered Items List (7 Cols) */}
                  <div className="md:col-span-7 bg-black/40 border border-white/10 rounded-xl p-4 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" />
                      Ordered Jewelry Items ({order.items.length})
                    </span>

                    <div className="divide-y divide-white/10 space-y-2">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="pt-2 first:pt-0 flex items-center gap-3 text-xs">
                          <div className="w-12 h-12 relative rounded bg-white/5 border border-white/10 overflow-hidden shrink-0">
                            {it.image && (
                              <Image
                                src={it.image}
                                alt={it.productName}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate">{it.productName}</p>
                            <p className="text-[11px] text-gray-400">
                              Metal: <strong className="text-gray-200">{it.metal}</strong> | Size:{' '}
                              <strong className="text-[#D4AF37]">{it.size}</strong>
                              {it.carat ? ` | Carat: ${it.carat}` : ''}
                            </p>
                            {it.engraving && (
                              <p className="text-[10px] text-[#D4AF37] italic">
                                Engraving: &ldquo;{it.engraving}&rdquo;
                              </p>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs text-gray-400">
                              {it.quantity} × {order.currencySymbol}
                              {it.unitPrice.toLocaleString()}
                            </span>
                            <p className="font-bold text-white">
                              {order.currencySymbol}
                              {it.totalPrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Carrier & Tracking Input Box */}
                    <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <select
                        value={currentTrackingInfo.carrier}
                        onChange={(e) =>
                          setTrackingInputs((prev) => ({
                            ...prev,
                            [order.id]: {
                              carrier: e.target.value,
                              tracking: currentTrackingInfo.tracking,
                            },
                          }))
                        }
                        className="bg-black/50 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-[#D4AF37]"
                      >
                        {CARRIERS.map((c) => (
                          <option key={c} value={c} className="bg-[#032019]">
                            {c}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        placeholder="Enter Courier Tracking # (e.g. 192837482)"
                        value={currentTrackingInfo.tracking}
                        onChange={(e) =>
                          setTrackingInputs((prev) => ({
                            ...prev,
                            [order.id]: {
                              carrier: currentTrackingInfo.carrier,
                              tracking: e.target.value,
                            },
                          }))
                        }
                        className="flex-1 bg-black/50 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                      />

                      <button
                        type="button"
                        onClick={() => handleSaveTracking(order.id, order.orderStatus)}
                        disabled={isUpdating}
                        className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#B89035] text-[#022C22] text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        Save Tracking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
