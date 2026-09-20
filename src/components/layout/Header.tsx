'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, Menu, X, PhoneCall } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import { useCart } from '@/context/CartContext';
import { products } from '@/lib/data';

export default function Header() {
  const { totalItems, setIsCartOpen, wishlist } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.shape.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.metal.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-[#022C22] text-[#FDFBF7] border-b border-[#D4AF37]/25 shadow-royal transition-all">
        {/* Top Gold Announcement Bar */}
        <AnnouncementBar />

        {/* Main Navbar */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-[#FDFBF7] hover:text-[#D4AF37] transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-initial flex items-center justify-center lg:justify-start">
              <Link href="/" className="group flex flex-col items-center lg:items-start">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-bold text-[#D4AF37] group-hover:text-white transition-colors uppercase">
                  AURA
                </span>
                <span className="font-sans text-[9px] tracking-[0.35em] text-[#F3E5AB]/90 uppercase font-semibold -mt-1">
                  Royal Moissanite Atelier
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 xl:space-x-8">
              {[
                { name: 'Shop All', href: '/shop' },
                { name: 'Solitaire Rings', href: '/category/rings' },
                { name: 'Eternity Bands', href: '/category/band' },
                { name: 'Ring Stacks', href: '/category/ring-set' },
                { name: 'Pendants', href: '/category/pendant' },
                { name: 'Earrings', href: '/category/earrings' },
                { name: 'Why Moissanite', href: '/#comparison' },
                { name: 'Ring Size Guide', href: '/#size-guide' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="font-sans text-[11px] xl:text-[12px] font-semibold tracking-[0.15em] text-[#FDFBF7]/90 hover:text-[#D4AF37] transition-colors uppercase relative group py-2"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* WhatsApp Concierge */}
              <a
                href="https://wa.me/919999999999?text=Hello!%20I%20am%20interested%20in%20custom%20Moissanite%20Jewelry."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-sans font-bold tracking-wider text-[#022C22] bg-[#D4AF37] hover:bg-[#F3E5AB] rounded-full transition-colors shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Concierge</span>
              </a>

              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors p-1"
                aria-label="Search"
              >
                <Search className="w-5 h-5" strokeWidth={1.75} />
              </button>

              {/* Wishlist Icon */}
              <Link
                href="/category/rings"
                className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors relative p-1 hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" strokeWidth={1.75} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-[#D4AF37] text-[#022C22] font-sans text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors relative p-1 flex items-center"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.75} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-[#D4AF37] text-[#022C22] font-sans text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#FDFBF7] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[#D4AF37]/40"
            >
              <div className="p-4 border-b border-[#E8E5DF] flex items-center gap-3 bg-[#022C22] text-[#FDFBF7]">
                <Search className="w-5 h-5 text-[#D4AF37]" />
                <input
                  type="text"
                  placeholder="Search by ring style, oval, emerald cut, silver, gold..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full font-sans text-base text-white bg-transparent focus:outline-none placeholder:text-gray-400"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full text-gray-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick suggestions or results */}
              <div className="max-h-[60vh] overflow-y-auto p-4">
                {searchQuery.trim() === '' ? (
                  <div className="py-6">
                    <p className="font-sans text-xs font-semibold tracking-wider text-gray-400 uppercase mb-3">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Oval Solitaire',
                        'Emerald Cut',
                        'Tennis Band',
                        'Princess Cut',
                        '18K Yellow Gold',
                        'Rose Gold',
                      ].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="px-3 py-1.5 bg-[#F5F2EC] hover:bg-[#D4AF37]/20 text-xs font-sans rounded-full text-[#022C22] transition-colors border border-[#E8E5DF]"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-3">
                    <p className="font-sans text-xs font-semibold text-gray-400 uppercase">
                      {searchResults.length} Products Found
                    </p>
                    {searchResults.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-4 p-2 hover:bg-[#F5F2EC] rounded-xl transition-colors group"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-sm font-medium text-[#022C22] group-hover:text-[#B89035] truncate">
                            {prod.name}
                          </h4>
                          <p className="font-sans text-xs text-gray-500">
                            {prod.shape} Cut • {prod.carat} • {prod.clarity}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-sans text-sm font-bold text-[#064E3B]">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-400 font-sans text-sm">
                    No matching jewelry designs found. Try searching for "Oval", "Band", or "Round".
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#022C22] text-[#FDFBF7] border-r border-[#D4AF37]/30 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between p-6 border-b border-[#D4AF37]/20">
                  <div>
                    <span className="font-serif text-2xl font-bold tracking-widest text-[#D4AF37] uppercase">
                      AURA
                    </span>
                    <p className="font-sans text-[9px] tracking-widest text-[#F3E5AB] uppercase font-semibold">
                      Royal Moissanite Atelier
                    </p>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="p-6 space-y-4">
                  {[
                    { name: 'Shop All Jewelry', href: '/shop', count: 'Explore' },
                    { name: 'Moissanite Solitaire Rings', href: '/category/rings', count: 'Bestsellers' },
                    { name: 'Eternity Bands', href: '/category/band', count: 'Classic' },
                    { name: 'Ring Stacks & Tiara', href: '/category/ring-set', count: 'Trending' },
                    { name: 'Solitaire Pendants', href: '/category/pendant', count: 'Gifting' },
                    { name: 'Moissanite Stud Earrings', href: '/category/earrings', count: 'Daily Wear' },
                    { name: 'Moissanite vs Diamond Guide', href: '/#comparison', count: 'Guide' },
                    { name: 'Interactive Ring Sizer', href: '/#size-guide', count: 'Tool' },
                    { name: 'Client Reviews & FAQs', href: '/#faqs', count: 'Help' },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2 border-b border-[#D4AF37]/15 text-[#FDFBF7] hover:text-[#D4AF37] transition-colors"
                    >
                      <span className="font-serif text-lg">{item.name}</span>
                      <span className="font-sans text-[10px] text-[#D4AF37]/80 uppercase tracking-wider">
                        {item.count}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-6 bg-[#011C15] border-t border-[#D4AF37]/20 space-y-3">
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#D4AF37] text-[#022C22] rounded-xl font-sans text-xs font-bold tracking-wider uppercase shadow-md hover:bg-[#F3E5AB] transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
                <p className="text-center font-sans text-[11px] text-gray-400">
                  Mon - Sat • 10:00 AM - 8:00 PM IST
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
