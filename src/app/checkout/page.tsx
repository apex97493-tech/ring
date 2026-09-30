'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Building2,
  Gem,
  QrCode,
  Smartphone,
  Zap,
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

declare global {
  interface Window {
    paypal?: any;
  }
}

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
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const handleClearSavedAddress = () => {
    try {
      localStorage.removeItem('fj_saved_shipping_address');
    } catch (_) {}
    setHasSavedAddress(false);
    setIsEditingAddress(true);
    setFormData({
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
  };

  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'payoneer' | 'bank_transfer' | 'whatsapp'>('paypal');
  const [payoneerReference, setPayoneerReference] = useState('');
  const [bankReference, setBankReference] = useState('');
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);
  const [upiSubTab, setUpiSubTab] = useState<'qr' | 'manual'>('qr');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedPayoneer, setCopiedPayoneer] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState('');

  const copyBankField = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBankField(label);
    setTimeout(() => setCopiedBankField(null), 2500);
  };

  // PayPal SDK & Direct Gateway Integration State
  const [isPayPalLoading, setIsPayPalLoading] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [isRedirectingToPayPal, setIsRedirectingToPayPal] = useState(false);

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

  // Listen for return from official PayPal Portal (Etsy / Shopify style)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const token = params.get('token');

    if (status === 'paypal_success' && token) {
      setIsSubmitting(true);
      const pendingDataStr = localStorage.getItem('fj_pending_paypal_order');
      let pendingData: any = {};
      try {
        if (pendingDataStr) pendingData = JSON.parse(pendingDataStr);
      } catch (_) {}

      fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: token,
          customer: pendingData.customer || formData,
          items: pendingData.items || cart,
          currency: pendingData.currency || 'USD',
          currencySymbol: pendingData.currencySymbol || '$',
          total: pendingData.total || 57,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.order) {
            setCompletedOrder(data.order);
            setWhatsAppUrl(data.whatsAppUrl || '');
            clearCart();
            localStorage.removeItem('fj_pending_paypal_order');
            window.history.replaceState({}, document.title, '/checkout');
          } else {
            alert(data.error || 'Failed to capture PayPal payment.');
          }
        })
        .catch((err) => {
          console.error('Capture error:', err);
          alert('Could not verify PayPal payment.');
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else if (status === 'paypal_cancelled') {
      setPaypalError('PayPal payment was cancelled. You can try again or choose another payment method.');
      window.history.replaceState({}, document.title, '/checkout');
    }
  }, []);

  // Calculate currency converted prices using selectedCurrency object
  const currencyCode = selectedCurrency.code;
  const currencySymbol = selectedCurrency.symbol;
  const convertedSubtotal = Math.round(subtotal * selectedCurrency.rate);
  const shippingFee = 0; // Free express worldwide shipping
  const finalTotal = convertedSubtotal + shippingFee;

  // Supported PayPal direct currencies
  const PAYPAL_DIRECT_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'SGD', 'NZD', 'CHF', 'HKD'];
  const isDirectPayPal = PAYPAL_DIRECT_CURRENCIES.includes(currencyCode);
  const paypalCurrency = isDirectPayPal ? currencyCode : 'USD';
  const paypalAmount = isDirectPayPal
    ? finalTotal
    : Math.max(1, Math.round(finalTotal / 86.5));

  // Indian Shopper Auto-Detection & UPI Configuration
  const isIndianCustomer = selectedCurrency.code === 'INR' || formData.country === 'India';

  useEffect(() => {
    if (selectedCurrency.code === 'INR' && formData.country !== 'India' && !hasSavedAddress) {
      setFormData((prev) => ({ ...prev, country: 'India' }));
    }
  }, [selectedCurrency.code, hasSavedAddress]);

  useEffect(() => {
    if (isIndianCustomer && paymentMethod === 'paypal') {
      setPaymentMethod('bank_transfer');
    }
  }, [isIndianCustomer]);

  // UPI dynamic payment parameters
  const upiAmount = currencyCode === 'INR' ? finalTotal : Math.round(finalTotal * 86.5);
  const upiVpa = process.env.NEXT_PUBLIC_UPI_ID || '982893045@kotak';
  const bankName = process.env.NEXT_PUBLIC_BANK_NAME || 'Kotak Mahindra Bank';
  const bankAccount = process.env.NEXT_PUBLIC_BANK_ACCOUNT || '9848316724';
  const bankIfsc = process.env.NEXT_PUBLIC_BANK_IFSC || 'KKBK0000273';
  const bankBranch = process.env.NEXT_PUBLIC_BANK_BRANCH || 'Jaipur - Vaishali Nagar';
  const bankCrn = process.env.NEXT_PUBLIC_BANK_CRN || '798804404';
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent('Forever Jewell Studio')}&am=${upiAmount}&cu=INR&tn=${encodeURIComponent('Fine Jewelry Order')}`;
  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(upiUri)}`;

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

    if (paymentMethod === 'bank_transfer' && !bankReference.trim()) {
      newErrors.bankReference = 'Please enter your UPI reference number, UTR, or remitter account name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Order to backend
  const handlePlaceOrder = async (
    overridePayment?: {
      method: 'paypal' | 'card' | 'payoneer' | 'bank_transfer' | 'whatsapp';
      status: 'paid' | 'pending';
      transactionId?: string;
    },
    overrideCustomer?: ShippingAddress
  ) => {
    const activeCustomer = overrideCustomer || formData;
    if (!overrideCustomer && !validateForm()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save address if opted in
      if (saveAddress && !overrideCustomer) {
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
        status: (paymentMethod === 'paypal' ? 'paid' : 'pending') as 'paid' | 'pending',
        payoneerReference: paymentMethod === 'payoneer' ? payoneerReference : undefined,
        bankReference: paymentMethod === 'bank_transfer' ? bankReference : undefined,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: activeCustomer,
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
    const email = process.env.NEXT_PUBLIC_PAYONEER_EMAIL || 'Foreverjewels98@gmail.com';
    navigator.clipboard.writeText(email);
    setCopiedPayoneer(true);
    setTimeout(() => setCopiedPayoneer(false), 2500);
  };

  // Synchronize state to refs to prevent re-rendering PayPal iframe on every keystroke
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  const paypalAmountRef = useRef(paypalAmount);
  paypalAmountRef.current = paypalAmount;

  const cartRef = useRef(cart);
  cartRef.current = cart;

  const handlePlaceOrderRef = useRef(handlePlaceOrder);
  handlePlaceOrderRef.current = handlePlaceOrder;

  const validateFormRef = useRef(validateForm);
  validateFormRef.current = validateForm;

  // Handle direct Etsy-Style PayPal Portal Checkout (Redirects directly to official PayPal checkout without popup hangs)
  const handleEtsyStylePayPal = async () => {
    if (saveAddress) {
      try {
        localStorage.setItem('fj_saved_shipping_address', JSON.stringify(formData));
      } catch (_) {}
    }

    setIsRedirectingToPayPal(true);
    setPaypalError(null);

    try {
      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: paypalAmount,
          currency: paypalCurrency,
          customer: formData,
          items: cart,
        }),
      });

      const data = await res.json();

      if (data.success && data.approveUrl) {
        const normalizedItems: OrderItem[] = cart.map((item) => {
          const itemPrice = Math.round(item.price * selectedCurrency.rate);
          return {
            productId: item.product.id,
            productName: item.product.name,
            productSlug: item.product.slug,
            metal: item.selectedMetal,
            size: item.selectedSize || 'US 7',
            carat: item.selectedCarat || item.product.carat,
            engraving: item.engravingText,
            quantity: item.quantity,
            unitPrice: itemPrice,
            totalPrice: itemPrice * item.quantity,
            image: item.image || item.product.images?.[0] || '',
          };
        });

        localStorage.setItem(
          'fj_pending_paypal_order',
          JSON.stringify({
            customer: formData,
            items: normalizedItems,
            currency: currencyCode,
            currencySymbol: currencySymbol,
            total: finalTotal,
          })
        );

        // Open official PayPal checkout page directly (Etsy style!)
        window.location.href = data.approveUrl;
      } else {
        setPaypalError(data.error || 'Could not initiate PayPal checkout session. Please try again.');
        setIsRedirectingToPayPal(false);
      }
    } catch (err: any) {
      console.error('PayPal redirect error:', err);
      setPaypalError('Could not connect to PayPal server. Please try again.');
      setIsRedirectingToPayPal(false);
    }
  };

  // Clean up any pending state
  useEffect(() => {
    setIsPayPalLoading(false);
  }, [paymentMethod]);

  // SUCCESS SCREEN — Premium Amazon-Style Order Confirmation
  if (completedOrder) {
    const isPaid = completedOrder.payment?.status === 'paid';
    const payMethodLabel: Record<string, string> = {
      paypal: 'PayPal', card: 'Credit / Debit Card',
      payoneer: 'Payoneer', bank_transfer: 'Bank Transfer / UPI', whatsapp: 'WhatsApp Order',
    };
    const estDelivery = () => {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F0FDF8] to-[#FAFAF7] py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* ── TOP CONFIRMATION CARD ── */}
          <div className="bg-white rounded-2xl border border-[#BBF7D0] shadow-lg overflow-hidden">
            {/* Green top bar */}
            <div className="bg-[#064E3B] px-6 py-5 text-white text-center">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 mb-1">
                {isPaid ? '✓ Payment Received' : '✓ Order Received — Awaiting Payment Verification'}
              </p>
              <h1 className="text-2xl font-serif font-bold text-white">
                Thank you, {completedOrder.customer.firstName}! 🎉
              </h1>
              <p className="text-sm text-emerald-200 mt-1.5">
                Your order has been confirmed and our artisans have been notified.
              </p>
            </div>

            {/* Order ID + Email notice */}
            <div className="px-6 py-4 bg-emerald-50/60 border-b border-emerald-100 text-center">
              <p className="text-xs text-gray-500 mb-1">Your Order Reference</p>
              <p className="font-mono text-lg font-bold text-[#064E3B] tracking-wider">#{completedOrder.id}</p>
              <p className="text-[11px] text-gray-500 mt-1">
                {completedOrder.customer.email
                  ? `A confirmation has been sent to ${completedOrder.customer.email}`
                  : 'Save this Order ID to track your shipment'}
              </p>
            </div>

            {/* Progress Stepper */}
            <div className="px-6 py-5 border-b border-gray-100">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4 text-center">Order Journey</p>
              <div className="flex items-start justify-between relative">
                <div className="absolute top-5 left-10 right-10 h-0.5 bg-gray-200" />
                <div className="absolute top-5 left-10 h-0.5 bg-[#064E3B]" style={{ width: '0%' }} />
                {[
                  { icon: CheckCircle2, label: 'Confirmed', sub: 'Just now', done: true },
                  { icon: Sparkles, label: 'Crafting', sub: '3–5 days', done: false },
                  { icon: Truck, label: 'Shipped', sub: '5–10 days', done: false },
                  { icon: Package, label: 'Delivered', sub: `Est. ${estDelivery()}`, done: false },
                ].map(({ icon: Icon, label, sub, done }, idx) => (
                  <div key={idx} className="flex flex-col items-center z-10 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${done ? 'bg-[#064E3B] border-[#064E3B] text-white shadow-md' : 'bg-white border-gray-200 text-gray-300'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className={`mt-2 text-[10px] font-bold text-center leading-tight ${done ? 'text-[#064E3B]' : 'text-gray-400'}`}>{label}</p>
                    <p className="text-[9px] text-gray-400 text-center">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Items Ordered */}
            {completedOrder.items.length > 0 && (
              <div className="px-6 py-4 border-b border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Items Ordered</p>
                <div className="space-y-2.5">
                  {completedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#064E3B]/10 rounded-lg flex items-center justify-center shrink-0">
                        <Gem className="w-4 h-4 text-[#064E3B]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{it.productName}</p>
                        <p className="text-[11px] text-gray-500">{it.metal}{it.size ? ` · Size ${it.size}` : ''} · Qty {it.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 shrink-0">
                        {completedOrder.currencySymbol}{Number(it.totalPrice ?? it.unitPrice ?? 0).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <span className="text-sm font-bold text-gray-900">Total {isPaid ? 'Paid' : 'Due'}</span>
                  <span className="text-base font-bold text-[#064E3B]">
                    {completedOrder.currencySymbol}{Number(completedOrder.total || 0).toLocaleString()} {completedOrder.currency}
                  </span>
                </div>
              </div>
            )}

            {/* Delivery + Payment side-by-side */}
            <div className="grid sm:grid-cols-2 gap-0 border-b border-gray-100">
              <div className="px-6 py-4 border-b sm:border-b-0 sm:border-r border-gray-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#064E3B]" />
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Shipping To</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{completedOrder.customer.firstName} {completedOrder.customer.lastName}</p>
                <p className="text-xs text-gray-600">{completedOrder.customer.streetAddress}</p>
                {completedOrder.customer.apartment && <p className="text-xs text-gray-600">{completedOrder.customer.apartment}</p>}
                <p className="text-xs text-gray-600">{completedOrder.customer.city}, {completedOrder.customer.state} {completedOrder.customer.postalCode}</p>
                <p className="text-xs font-semibold text-gray-700">{completedOrder.customer.country}</p>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <CreditCard className="w-3.5 h-3.5 text-[#064E3B]" />
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Payment</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{payMethodLabel[completedOrder.payment?.method || ''] || 'Unknown'}</p>
                <p className={`text-xs mt-0.5 font-bold ${isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                  {isPaid ? '✓ Payment Confirmed' : '⏳ Pending Verification'}
                </p>
                {completedOrder.payment?.bankReference && (
                  <p className="text-[10px] text-gray-600 font-mono mt-0.5">
                    Ref / UTR: <strong className="text-gray-900">{completedOrder.payment.bankReference}</strong>
                  </p>
                )}
                {!isPaid && (
                  <p className="text-[10px] text-amber-600 mt-1">
                    {completedOrder.payment?.method === 'bank_transfer'
                      ? 'UTR submitted! Our artisans in Jaipur verify deposits within 15–30 mins to begin crafting.'
                      : 'We will confirm your order once payment is verified (usually within 2–4 hrs).'}
                  </p>
                )}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#064E3B] text-white flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#064E3B]">
                    {completedOrder.payment?.method === 'bank_transfer'
                      ? 'Send UPI Payment Receipt Screenshot'
                      : 'Send to our Concierge on WhatsApp'}
                  </p>
                  <p className="text-[11px] text-gray-600">
                    {completedOrder.payment?.method === 'bank_transfer'
                      ? 'Share your UPI transaction screenshot with our Jaipur studio for instant order confirmation.'
                      : 'Confirm ring size, engraving, or get order updates instantly.'}
                  </p>
                </div>
              </div>
              {whatsAppUrl && (
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#064E3B] hover:bg-[#043327] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {completedOrder.payment?.method === 'bank_transfer'
                    ? 'Open WhatsApp — Share UPI Payment Screenshot'
                    : 'Open WhatsApp — Send Order Details'}
                </a>
              )}
            </div>

            {/* Trust Badges */}
            <div className="px-6 py-4 bg-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: ShieldCheck, text: 'SSL Secured' },
                { icon: Lock, text: 'Data Private' },
                { icon: Truck, text: 'Tracked Shipping' },
                { icon: Sparkles, text: 'GIA Certified' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1 text-center">
                  <Icon className="w-4 h-4 text-[#064E3B]" />
                  <p className="text-[10px] font-semibold text-gray-600">{text}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="px-6 py-5 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/my-orders?orderId=${completedOrder.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#064E3B] hover:bg-[#043327] text-white text-xs font-bold tracking-widest uppercase transition-all shadow-md rounded-xl"
              >
                <Package className="w-4 h-4" />
                View My Orders
              </Link>
              <Link
                href="/shop"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold tracking-widest uppercase transition-colors rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Reassurance note */}
          <p className="text-center text-[11px] text-gray-400">
            Questions? <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919828930454'}`} target="_blank" rel="noopener noreferrer" className="text-[#064E3B] font-semibold hover:underline">WhatsApp us</a> · We reply within 2 hours · ForeverJewellStudio
          </p>
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
            {/* SAVED ADDRESS CARD (When customer has a saved profile) */}
            {hasSavedAddress && !isEditingAddress ? (
              <div className="bg-white border border-[#E5E0D8] rounded-xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#064E3B] text-white text-xs font-bold flex items-center justify-center">
                      ✓
                    </span>
                    <h2 className="text-base font-serif font-bold text-gray-900 tracking-wide">
                      Delivery & Contact Details
                    </h2>
                  </div>
                  <span className="text-[11px] text-[#064E3B] bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Saved in your browser
                  </span>
                </div>

                <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          {formData.firstName} {formData.lastName}
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          Default Address
                        </span>
                      </div>
                      <p className="text-xs text-gray-700">
                        {formData.streetAddress}{formData.apartment ? `, ${formData.apartment}` : ''}
                      </p>
                      <p className="text-xs text-gray-700">
                        {formData.city}, {formData.state} {formData.postalCode}, {formData.country}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 border-t border-gray-200/80 text-xs text-gray-600">
                        <span>📧 {formData.email}</span>
                        <span>📞 {formData.phone}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(true)}
                        className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        ✏️ Edit Details
                      </button>
                      <button
                        type="button"
                        onClick={handleClearSavedAddress}
                        className="px-4 py-1.5 text-xs text-red-600 hover:text-red-800 hover:underline cursor-pointer text-center"
                      >
                        Clear Saved
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1">
                  <Lock className="w-3.5 h-3.5 text-[#064E3B]" />
                  <span>Your details are loaded securely from your device. You won&apos;t need to retype them.</span>
                </div>
              </div>
            ) : (
              <>
                {/* Step 1: Customer Contact Info */}
                <div className="bg-white border border-[#E5E0D8] rounded-xl p-6 sm:p-7 shadow-xs">
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
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(false)}
                        className="text-xs text-[#064E3B] font-semibold hover:underline cursor-pointer"
                      >
                        ← Back to Saved Address
                      </button>
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
                        } rounded-lg focus:outline-none focus:border-[#B89035]`}
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
                        } rounded-lg focus:outline-none focus:border-[#B89035]`}
                      />
                      {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Step 2: Shipping Address */}
                <div className="bg-white border border-[#E5E0D8] rounded-xl p-6 sm:p-7 shadow-xs">
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
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#B89035]"
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
                          } rounded-lg focus:outline-none focus:border-[#B89035]`}
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
                          } rounded-lg focus:outline-none focus:border-[#B89035]`}
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
                        } rounded-lg focus:outline-none focus:border-[#B89035]`}
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
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#B89035]"
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
                          } rounded-lg focus:outline-none focus:border-[#B89035]`}
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
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#B89035]"
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
                          } rounded-lg focus:outline-none focus:border-[#B89035]`}
                        />
                        {errors.postalCode && (
                          <p className="text-[11px] text-red-600 mt-1">{errors.postalCode}</p>
                        )}
                      </div>
                    </div>

                    {/* Save this address checkbox */}
                    <div className="pt-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                          className="w-4 h-4 text-[#064E3B] rounded border-gray-300 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-xs text-gray-700 font-medium">
                          Save this address securely in my browser for 1-click checkout next time
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* CUSTOMER DATA & PAYMENT SECURITY PROMISE (Crucial for US/UK clients) */}
            <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-[#064E3B] font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-[#064E3B]" />
                <span>Customer Data Security & Privacy Guarantee</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px] text-gray-600">
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#064E3B]" /> Zero Card Storage
                  </p>
                  <p className="leading-relaxed">
                    We never store credit/debit card numbers or bank logins. All payments are securely handled by official PayPal & banking networks.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#064E3B]" /> Device-Level Privacy
                  </p>
                  <p className="leading-relaxed">
                    Your address is saved privately in your own browser for convenience. We never sell, rent, or monetize personal customer details.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 flex items-center gap-1">
                    <Package className="w-3 h-3 text-[#064E3B]" /> Passwordless Tracking
                  </p>
                  <p className="leading-relaxed">
                    Your orders can be accessed anytime from the &quot;My Orders&quot; hub with just your Order ID or Email without creating accounts.
                  </p>
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-gray-100 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`relative py-3 px-2 text-xs font-semibold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-white text-gray-900 shadow-md border border-[#064E3B]/20 font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {isIndianCustomer && (
                    <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 bg-[#064E3B] text-[#D4AF37] text-[9px] font-extrabold rounded-full tracking-wider shadow">
                      🇮🇳 BEST FOR INDIA
                    </span>
                  )}
                  <Zap className="w-4 h-4 text-[#064E3B]" />
                  <span>UPI / Bank Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`py-3 px-2 text-xs font-semibold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'paypal'
                      ? 'bg-white text-gray-900 shadow-md border border-gray-200 font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#B89035]" />
                  <span>{isIndianCustomer ? 'Intl. Cards / PayPal' : 'PayPal / Cards'}</span>
                </button>

                {!isIndianCustomer && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('payoneer')}
                    className={`py-3 px-2 text-xs font-semibold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'payoneer'
                        ? 'bg-white text-gray-900 shadow-md border border-gray-200 font-bold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#FF4800] text-white text-[10px] font-bold flex items-center justify-center">
                      P
                    </span>
                    <span>Payoneer</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`py-3 px-2 text-xs font-semibold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'whatsapp'
                      ? 'bg-white text-gray-900 shadow-md border border-gray-200 font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Send className="w-4 h-4 text-[#064E3B]" />
                  <span>WhatsApp Order</span>
                </button>
              </div>

              {/* TAB 1: PAYPAL & CARDS */}
              {paymentMethod === 'paypal' && (
                <div className="space-y-4">
                  <div className="bg-[#F8FAFC] border border-gray-200 rounded-lg p-4">
                    {/* Notice for Indian visitors selecting PayPal */}
                    {isIndianCustomer && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4 text-xs text-amber-900 flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-amber-950">Notice for Indian Shoppers:</p>
                          <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                            PayPal processes transactions internationally in <strong>USD ($)</strong> for overseas credit cards. For 100% free and instant payments in Indian Rupees (₹), please select the <strong>UPI / Bank Transfer</strong> tab above using Google Pay, PhonePe, Paytm, or NetBanking.
                          </p>
                        </div>
                      </div>
                    )}

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

                    {!isDirectPayPal && (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-2.5 mb-4 text-[11px] text-amber-900 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span>
                            PayPal processes international transactions in <strong>USD ($)</strong>. Your order of{' '}
                            <strong>{currencySymbol}{finalTotal.toLocaleString()}</strong> will be charged as{' '}
                            <strong>${paypalAmount.toLocaleString()} USD</strong> at real-time conversion.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Direct Server-to-Server PayPal & Card Gateway (Zero Popups, 100% Mobile & Edge Compatible) */}
                    <div className="space-y-3 mt-4">
                      {isRedirectingToPayPal ? (
                        <div className="py-8 px-4 bg-white rounded-xl border-2 border-[#D4AF37] text-center space-y-3 shadow-md">
                          <div className="w-9 h-9 rounded-full border-3 border-[#003087] border-t-transparent animate-spin mx-auto" />
                          <h4 className="font-serif text-sm font-bold text-[#003087]">
                            Connecting to PayPal Secure Bank Gateway...
                          </h4>
                          <p className="text-xs text-gray-500 max-w-xs mx-auto font-sans">
                            Redirecting you directly to the official portal. No popups or browser blockers.
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Button 1: PayPal Account / Wallet */}
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleEtsyStylePayPal}
                            className="w-full py-4 px-4 bg-[#FFC439] hover:bg-[#F4B728] active:scale-95 text-[#003087] font-sans font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#E0A800]"
                          >
                            <span className="font-serif italic font-black text-2xl tracking-tight text-[#003087]">
                              Pay<span className="text-[#0079C1]">Pal</span>
                            </span>
                            <span className="text-xs uppercase tracking-wider font-extrabold text-[#003087] ml-1">
                              • Checkout (${paypalAmount} USD)
                            </span>
                          </button>

                          {/* Button 2: Direct Debit / Credit Card (PayPal Guest Checkout) */}
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleEtsyStylePayPal}
                            className="w-full py-3.5 px-4 bg-[#18181B] hover:bg-black active:scale-95 text-white font-sans font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-gray-800"
                          >
                            <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                            <span>Debit or Credit Card (Visa, MasterCard, AMEX)</span>
                          </button>
                        </>
                      )}

                      {paypalError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                          <p className="font-semibold mb-1">PayPal connection notice:</p>
                          <p>{paypalError}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-center gap-1.5 text-[10px] text-gray-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#064E3B]" />
                      <span>Direct 256-bit bank encryption via PayPal Official Checkout • 0% Extra Surcharge</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: BANK / UPI TRANSFER (COMPREHENSIVE INDIAN PAYMENT FLOW) */}
              {paymentMethod === 'bank_transfer' && (
                <div className="space-y-5">
                  <div className="bg-gradient-to-b from-[#F0FDF4] to-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-5 sm:p-6 shadow-xs">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#A7F3D0]/60 pb-4 mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-[#064E3B] uppercase tracking-wider flex items-center gap-2">
                          <Zap className="w-4 h-4 text-emerald-600 fill-emerald-500" />
                          <span>Instant UPI & Kotak Mahindra Bank Direct Transfer</span>
                        </h4>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Pay directly from Google Pay, PhonePe, Paytm, BHIM, CRED or NetBanking with zero gateway surcharges.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2.5 py-1 bg-[#064E3B] text-[#D4AF37] text-[10px] font-bold rounded-full tracking-wider shadow-xs">
                          ⚡ 0% FEES • INSTANT
                        </span>
                      </div>
                    </div>

                    {/* Sub-Tabs: UPI QR Code vs Bank Details */}
                    <div className="flex items-center gap-2 p-1 bg-white/80 border border-[#A7F3D0] rounded-xl mb-5">
                      <button
                        type="button"
                        onClick={() => setUpiSubTab('qr')}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          upiSubTab === 'qr'
                            ? 'bg-[#064E3B] text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Scan UPI QR Code</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiSubTab('manual')}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          upiSubTab === 'manual'
                            ? 'bg-[#064E3B] text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>NetBanking Details (NEFT/IMPS)</span>
                      </button>
                    </div>

                    {/* VIEW A: DYNAMIC UPI QR CODE */}
                    {upiSubTab === 'qr' && (
                      <div className="space-y-4">
                        <div className="bg-white border-2 border-emerald-500/20 rounded-2xl p-5 text-center shadow-sm space-y-3.5">
                          <div>
                            <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#064E3B] block">
                              Scan with Any UPI App
                            </span>
                            <div className="text-2xl font-serif font-black text-gray-900 mt-1">
                              ₹{upiAmount.toLocaleString('en-IN')}
                            </div>
                            <p className="text-[11px] text-gray-500">
                              Amount pre-configured • Beneficiary: Forever Jewell Studio
                            </p>
                          </div>

                          {/* Dynamic QR Code */}
                          <div className="relative inline-block mx-auto bg-white p-3 rounded-2xl border-2 border-[#D4AF37]/50 shadow-md">
                            <img
                              src={upiQrUrl}
                              alt="Forever Jewell Studio UPI Payment QR"
                              className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain rounded-xl"
                            />
                            <div className="absolute inset-x-0 bottom-1 flex justify-center">
                              <span className="text-[9px] bg-[#064E3B] text-white px-2 py-0.5 rounded-full font-mono font-bold tracking-wider shadow">
                                NPCI • BHIM UPI
                              </span>
                            </div>
                          </div>

                          {/* Supported Apps Pills */}
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2">
                              Supported UPI Apps
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-bold text-gray-700">
                              {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'CRED', 'Amazon Pay', 'Any Bank App'].map((app) => (
                                <span key={app} className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-md">
                                  {app}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Mobile 1-Click Tap to Pay Button */}
                          <div className="pt-1 sm:hidden">
                            <a
                              href={upiUri}
                              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#064E3B] to-[#043327] hover:from-[#043327] hover:to-[#064E3B] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-600"
                            >
                              <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                              <span>Tap to Pay ₹{upiAmount.toLocaleString('en-IN')} in Any UPI App</span>
                            </a>
                            <p className="text-[10px] text-gray-400 mt-1.5">
                              Tapping opens your installed UPI app with the exact amount filled.
                            </p>
                          </div>

                          {/* Copyable UPI ID Box */}
                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between bg-gray-50/80 px-3 py-2 rounded-xl text-xs">
                            <div className="text-left">
                              <span className="text-[10px] text-gray-400 block font-semibold uppercase">Or Pay to UPI ID / VPA</span>
                              <span className="font-mono font-bold text-gray-900 text-xs sm:text-sm">{upiVpa}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyBankField(upiVpa, 'UPI ID')}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-800 cursor-pointer shadow-xs transition-colors"
                            >
                              {copiedBankField === 'UPI ID' ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-600">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy UPI ID</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* VIEW B: KOTAK MAHINDRA BANK NETBANKING DETAILS */}
                    {upiSubTab === 'manual' && (
                      <div className="bg-white border border-[#A7F3D0] rounded-xl p-4 sm:p-5 space-y-3 shadow-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-gray-400 block">Beneficiary Name</span>
                            <span className="font-bold text-gray-900 text-xs sm:text-sm">Forever Jewell Studio</span>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                            Current Account
                          </span>
                        </div>

                        {/* Account Number */}
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-gray-400 block">Bank Account Number</span>
                            <span className="font-mono font-bold text-gray-900 text-sm sm:text-base tracking-wider">{bankAccount}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyBankField(bankAccount, 'Account Number')}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-800 cursor-pointer shadow-xs transition-colors"
                          >
                            {copiedBankField === 'Account Number' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* IFSC Code */}
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-gray-400 block">Branch IFSC Code</span>
                            <span className="font-mono font-bold text-gray-900 text-sm tracking-wider">{bankIfsc}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyBankField(bankIfsc, 'IFSC')}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-800 cursor-pointer shadow-xs transition-colors"
                          >
                            {copiedBankField === 'IFSC' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Bank & Branch Info */}
                        <div className="text-xs text-gray-600 pt-1 space-y-1">
                          <p>
                            <strong>Beneficiary Bank:</strong> {bankName} {bankCrn && <span>| <strong>CRN:</strong> {bankCrn}</span>}
                          </p>
                          <p>
                            <strong>Branch:</strong> {bankBranch}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Enter Transaction ID / UTR */}
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-gray-900 mb-1.5">
                        Enter 12-Digit UPI Reference ID / UTR Number *
                      </label>
                      <input
                        type="text"
                        value={bankReference}
                        onChange={(e) => setBankReference(e.target.value)}
                        placeholder="e.g. 428192847291 or UTR from payment receipt"
                        className={`w-full px-4 py-3 text-xs bg-white border ${
                          errors.bankReference ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                        } rounded-xl font-mono text-gray-900 focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 shadow-xs`}
                      />
                      {errors.bankReference ? (
                        <p className="text-[11px] text-red-600 mt-1 font-semibold">{errors.bankReference}</p>
                      ) : (
                        <p className="text-[11px] text-gray-500 mt-1">
                          💡 You will find the 12-digit UTR in your payment details in Google Pay, PhonePe, or Paytm once completed.
                        </p>
                      )}
                    </div>

                    {/* Confirm Button */}
                    <div className="mt-4 pt-1">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handlePlaceOrder()}
                        className="w-full py-4 bg-gradient-to-r from-[#064E3B] to-[#022C22] hover:from-[#022C22] hover:to-[#064E3B] active:scale-95 text-[#D4AF37] font-sans text-xs font-extrabold tracking-widest uppercase transition-all shadow-lg rounded-xl flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/30"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                        {isSubmitting
                          ? 'Registering Order...'
                          : `Confirm UPI / Bank Order (${currencySymbol}${finalTotal.toLocaleString()})`}
                      </button>
                    </div>

                    {/* Jaipur Artisan Concierge Support */}
                    <div className="pt-3 border-t border-[#A7F3D0]/60 flex items-center justify-between text-[11px] text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#064E3B]" />
                        <span>Direct Studio Confirmation • Jaipur, Rajasthan</span>
                      </span>
                      <a
                        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919828930454'}?text=Hi%20ForeverJewell%20Team,%20I%20have%20a%20question%20regarding%20UPI%20payment%20for%20my%20order.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#064E3B] font-bold hover:underline flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>WhatsApp Help</span>
                      </a>
                    </div>
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
                            {process.env.NEXT_PUBLIC_PAYONEER_EMAIL || 'Foreverjewels98@gmail.com'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={copyPayoneerEmail}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 active:scale-90 text-gray-700 cursor-pointer transition-all"
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
                        className="w-full py-3.5 bg-[#EA580C] hover:bg-[#C2410C] active:scale-95 text-white font-sans text-xs font-bold tracking-widest uppercase transition-all shadow-md rounded-lg flex items-center justify-center gap-2 cursor-pointer"
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
                      className="w-full py-3.5 bg-[#064E3B] hover:bg-[#043327] active:scale-95 text-[#D4AF37] font-sans text-xs font-bold tracking-widest uppercase transition-all shadow-md rounded-lg flex items-center justify-center gap-2 cursor-pointer"
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

              {/* Pricing Breakdown (Exact Etsy Styling) */}
              <div className="border-t border-gray-150 pt-4 mt-4 space-y-2.5 text-xs font-sans text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Item(s) total</span>
                  <span className="font-semibold text-gray-900">
                    {currencySymbol}{(convertedSubtotal * 2).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[#0F6F2C]">
                  <span className="font-medium">Shop discount</span>
                  <span className="font-bold">
                    -{currencySymbol}{convertedSubtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-gray-150">
                  <span className="font-medium text-gray-700">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {currencySymbol}{convertedSubtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <Truck className="w-3.5 h-3.5 text-[#064E3B]" />
                    Delivery (Worldwide Express)
                  </span>
                  <span className="text-[#0F6F2C] font-bold uppercase tracking-wider text-[11px]">
                    FREE
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <Sparkles className="w-3.5 h-3.5 text-[#B89035]" />
                    Velvet Ring Box & GRA Certificate
                  </span>
                  <span className="text-[#0F6F2C] font-bold uppercase tracking-wider text-[11px]">
                    INCLUDED
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-500 text-[11px]">Included in total</span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">
                    Total ({cart.reduce((sum, item) => sum + item.quantity, 0)} {cart.length === 1 ? 'item' : 'items'})
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-serif font-bold text-gray-900">
                      {currencySymbol}{finalTotal.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-gray-500">
                      {selectedCurrency.code} · Includes all applicable duties & packaging
                    </span>
                  </div>
                </div>

                {/* Secure options in checkout + Payment logos (Exact Etsy style) */}
                <div className="pt-3 border-t border-gray-150 text-center space-y-2">
                  <p className="text-xs font-semibold text-gray-800 flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-gray-600" />
                    Secure options in checkout
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    <span className="px-2 py-0.5 bg-white border border-gray-250 rounded text-[10px] font-black tracking-wider text-[#1A1F71] shadow-2xs">
                      VISA
                    </span>
                    <span className="px-2 py-0.5 bg-white border border-gray-250 rounded text-[10px] font-bold text-gray-900 flex items-center gap-0.5 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-[#EB001B] inline-block -mr-1" />
                      <span className="w-2 h-2 rounded-full bg-[#F79E1B] inline-block opacity-90" />
                      <span className="text-[9px] ml-1">Mastercard</span>
                    </span>
                    <span className="px-2 py-0.5 bg-[#006FCF] text-white rounded text-[9px] font-bold tracking-wider shadow-2xs">
                      AMEX
                    </span>
                    <span className="px-2 py-0.5 bg-white border border-gray-250 rounded text-[10px] font-bold text-[#003087] shadow-2xs">
                      PayPal
                    </span>
                    <span className="px-2 py-0.5 bg-white border border-gray-250 rounded text-[9px] font-bold text-[#FF6000] shadow-2xs">
                      DISCOVER
                    </span>
                    <span className="px-2 py-0.5 bg-black text-white rounded text-[9px] font-bold tracking-tight shadow-2xs">
                       Pay
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Additional duties and fees <span className="underline cursor-pointer">may apply</span>.
                  </p>
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
