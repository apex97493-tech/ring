'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Sparkles, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#18181B] text-[#FDFBF7] pt-16 pb-12 border-t border-[#D4AF37]/20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter & Brand Spotlight */}
        <div className="pb-12 border-b border-[#27272A] grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="font-serif text-3xl font-bold tracking-widest text-[#D4AF37] uppercase">
              AURA
            </span>
            <p className="font-sans text-xs tracking-[0.25em] text-gray-400 uppercase mt-1 mb-4 font-semibold">
              Woke Moissanite & Fine Jewelry
            </p>
            <p className="font-sans text-sm text-gray-400 max-w-md leading-relaxed">
              Crafting ethical, lab-grown high jewelry with certified VVS1 D-Color Moissanite that rivals mined diamonds in fire, brilliance, and lifetime durability.
            </p>
          </div>

          <div className="bg-[#27272A]/60 p-6 rounded-2xl border border-[#D4AF37]/20">
            <h4 className="font-serif text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              Join the AURA Circle & Get 10% Off
            </h4>
            <p className="font-sans text-xs text-gray-400 mb-4">
              Receive secret drop access, bespoke ring customization discounts, and care guides.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#064E3B] text-[#D4AF37] text-xs font-sans rounded-xl font-bold">
                Welcome to the AURA Circle. Use code <strong>WOKE10</strong> at checkout for 10% off.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-[#18181B] border border-[#3F3F46] rounded-xl px-4 py-2.5 text-xs font-sans text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#B89035] text-[#18181B] font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Multi-Column Links */}
        <div className="py-12 border-b border-[#27272A] grid grid-cols-2 md:grid-cols-4 gap-8 font-sans text-xs">
          {/* Col 1: Shop Collections */}
          <div>
            <h5 className="font-serif text-base font-bold text-[#D4AF37] uppercase tracking-wider mb-4">
              Collections
            </h5>
            <ul className="space-y-2.5 text-gray-400">
              <li>
                <Link href="/category/rings" className="hover:text-white transition-colors">
                  Moissanite Solitaire Rings
                </Link>
              </li>
              <li>
                <Link href="/category/band" className="hover:text-white transition-colors">
                  Eternity Bands & Wedding Bands
                </Link>
              </li>
              <li>
                <Link href="/category/ring-set" className="hover:text-white transition-colors">
                  Bridal Stacks & Tiara Rings
                </Link>
              </li>
              <li>
                <Link href="/category/pendant" className="hover:text-white transition-colors">
                  Moissanite Pendants
                </Link>
              </li>
              <li>
                <Link href="/category/earrings" className="hover:text-white transition-colors">
                  Moissanite Stud Earrings
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Educational & Guides */}
          <div>
            <h5 className="font-serif text-base font-bold text-[#D4AF37] uppercase tracking-wider mb-4">
              Knowledge & Care
            </h5>
            <ul className="space-y-2.5 text-gray-400">
              <li>
                <Link href="/#comparison" className="hover:text-white transition-colors">
                  Moissanite vs Diamond Guide
                </Link>
              </li>
              <li>
                <Link href="/#size-guide" className="hover:text-white transition-colors">
                  Interactive Ring Sizing Chart
                </Link>
              </li>
              <li>
                <Link href="/#faqs" className="hover:text-white transition-colors">
                  GRA Certificate Verification
                </Link>
              </li>
              <li>
                <Link href="/#faqs" className="hover:text-white transition-colors">
                  Jewelry Care & Cleaning Tips
                </Link>
              </li>
              <li>
                <Link href="/#faqs" className="hover:text-white transition-colors">
                  100% Lifetime Buyback Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h5 className="font-serif text-base font-bold text-[#D4AF37] uppercase tracking-wider mb-4">
              Client Support
            </h5>
            <ul className="space-y-2.5 text-gray-400">
              <li>
                <Link href="/#faqs" className="hover:text-white transition-colors">
                  Free Insured Express Shipping
                </Link>
              </li>
              <li>
                <Link href="/#faqs" className="hover:text-white transition-colors">
                  15-Day Free Exchange & Pickup
                </Link>
              </li>
              <li>
                <Link href="/#faqs" className="hover:text-white transition-colors">
                  Track Your Armored Package
                </Link>
              </li>
              <li>
                <Link href="/#faqs" className="hover:text-white transition-colors">
                  Lifetime Polish & Repair Service
                </Link>
              </li>
              <li>
                <Link href="/#faqs" className="hover:text-white transition-colors">
                  Terms of Service & Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Store & Concierge */}
          <div>
            <h5 className="font-serif text-base font-bold text-[#D4AF37] uppercase tracking-wider mb-4">
              Atelier & Contact
            </h5>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>Jewelry Atelier, Bandra West, Mumbai, Maharashtra 400050</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>+91 99999 99999 (WhatsApp Concierge)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>care@aurajewelry.com</span>
              </li>
              <li className="pt-2 flex gap-4 text-gray-400 text-xs">
                <a href="#" className="hover:text-[#D4AF37] flex items-center gap-1">
                  <span>Instagram</span>
                </a>
                <span>•</span>
                <a href="#" className="hover:text-[#D4AF37] flex items-center gap-1">
                  <span>Facebook</span>
                </a>
                <span>•</span>
                <a href="#" className="hover:text-[#D4AF37] flex items-center gap-1">
                  <span>YouTube</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Payment Gateways */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-gray-500">
          <p>© 2026 AURA Fine Jewelry Atelier. All Rights Reserved. Crafted for eternal sparkle.</p>

          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider text-gray-400">
              Accepted Payments:
            </span>
            <div className="flex gap-2">
              {['UPI / GPay', 'Visa', 'Mastercard', 'RuPay', 'NetBanking', 'COD Available'].map((method) => (
                <span
                  key={method}
                  className="px-2 py-1 bg-[#27272A] text-[10px] text-gray-300 rounded font-medium border border-[#3F3F46]"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
