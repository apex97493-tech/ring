'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, Menu, X, PhoneCall, ChevronDown, MessageCircle } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import ShapeMegaMenu from './ShapeMegaMenu';
import { useCart } from '@/context/CartContext';
import { products } from '@/lib/data';

export default function Header() {
  const { totalItems, setIsCartOpen, wishlist } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShapeMenuOpen, setIsShapeMenuOpen] = useState(false);
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

        {/* Main Navbar: compact on mobile (h-14), spacious on desktop (h-20) */}
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Mobile Menu Trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 text-[#FDFBF7] hover:text-[#D4AF37] transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-initial flex items-center justify-center lg:justify-start">
              <Link href="/" className="group flex flex-col items-center lg:items-start">
                <span className="font-serif text-xl sm:text-2xl lg:text-3xl tracking-[0.2em] sm:tracking-[0.25em] font-bold text-[#D4AF37] group-hover:text-white transition-colors uppercase">
                  AURA
                </span>
                <span className="font-sans text-[7.5px] sm:text-[9px] tracking-[0.22em] sm:tracking-[0.28em] text-[#F3E5AB]/90 uppercase font-semibold -mt-0.5 sm:-mt-1">
                  Royal Moissanite & Fine Jewelry
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:gap-x-5 xl:gap-x-6">
              <div 
                className="relative py-2 hidden xl:block"
                onMouseEnter={() => setIsShapeMenuOpen(true)}
                onMouseLeave={() => setIsShapeMenuOpen(false)}
              >
                <button
                  className="font-sans flex items-center gap-1 text-[11px] xl:text-[12px] font-semibold tracking-[0.15em] text-[#FDFBF7]/90 hover:text-[#D4AF37] transition-colors uppercase relative group cursor-default"
                >
                  Shop By Shape
                  <ChevronDown className="w-3 h-3" />
                  <span className={`absolute -bottom-2 left-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 ${isShapeMenuOpen ? 'w-full' : 'w-0'}`}></span>
                </button>
                <ShapeMegaMenu 
                  isOpen={isShapeMenuOpen} 
                  onMouseEnter={() => setIsShapeMenuOpen(true)}
                  onMouseLeave={() => setIsShapeMenuOpen(false)}
                />
              </div>

              {[
                { name: 'Shop All', href: '/shop' },
                { name: 'Rings', href: '/category/rings' },
                { name: 'Band', href: '/category/band' },
                { name: 'Lesbian Ring', href: '/category/lesbian-ring' },
                { name: 'Pendant', href: '/category/pendant' },
                { name: 'Earrings', href: '/category/earrings' },
                { name: 'Necklace', href: '/category/necklace' },
                { name: 'Bracelet', href: '/category/bracelet' },
                { name: 'Nose', href: '/category/nose-ring' },
                { name: 'Belly', href: '/category/belly-rings' },
                { name: 'Sets', href: '/category/ring-set' },
                { name: 'Contact', href: '/contact' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="font-sans text-[11px] xl:text-[12px] font-semibold tracking-[0.15em] text-[#FDFBF7]/90 hover:text-[#D4AF37] transition-colors uppercase relative group py-2"
                >
                  {item.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* WhatsApp Support - hidden on mobile (handled by floating button) */}
              <a
                href="https://wa.me/919999999999?text=Hello!%20I%20am%20interested%20in%20custom%20Moissanite%20Jewelry."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-sans font-bold tracking-wider text-[#022C22] bg-[#D4AF37] hover:bg-[#F3E5AB] rounded-full transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp</span>
              </a>

              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors p-1"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.75} />
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
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#FDFBF7] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[#D4AF37]/40"
            >
              <div className="p-3.5 sm:p-4 border-b border-[#E8E5DF] flex items-center gap-3 bg-[#022C22] text-[#FDFBF7]">
                <Search className="w-5 h-5 text-[#D4AF37]" />
                <input
                  type="text"
                  placeholder="Search by ring style, oval, emerald cut..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full font-sans text-sm sm:text-base text-white bg-transparent focus:outline-none placeholder:text-gray-400"
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
                  <div className="py-4">
                    <p className="font-sans text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2.5">
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
                          className="px-3 py-1 bg-[#F5F2EC] hover:bg-[#D4AF37]/20 text-xs font-sans rounded-full text-[#022C22] transition-colors border border-[#E8E5DF]"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2.5">
                    <p className="font-sans text-xs font-semibold text-gray-400 uppercase">
                      {searchResults.length} Products Found
                    </p>
                    {searchResults.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-3 p-2 hover:bg-[#F5F2EC] rounded-xl transition-colors group"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-sm font-medium text-[#022C22] group-hover:text-[#B89035] truncate">
                            {prod.name}
                          </h4>
                          <p className="font-sans text-[11px] text-gray-500">
                            {prod.shape} Cut • {prod.carat}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-sans text-xs sm:text-sm font-bold text-[#064E3B]">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-400 font-sans text-sm">
                    No matching jewelry designs found. Try searching for "Oval" or "Round".
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
              transition={{ type: 'tween', duration: 0.28 }}
              className="fixed inset-y-0 left-0 w-[82%] max-w-sm bg-[#022C22] text-[#FDFBF7] border-r border-[#D4AF37]/30 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between p-5 border-b border-[#D4AF37]/20">
                  <div>
                    <span className="font-serif text-2xl font-bold tracking-widest text-[#D4AF37] uppercase">
                      AURA
                    </span>
                    <p className="font-sans text-[8.5px] tracking-widest text-[#F3E5AB] uppercase font-semibold">
                      Royal Moissanite & Fine Jewelry
                    </p>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="p-5 space-y-3.5">
                  {[
                    { name: 'Shop All Jewelry', href: '/shop', count: 'Explore' },
                    { name: 'Rings', href: '/category/rings', count: 'Bestsellers' },
                    { name: 'Band', href: '/category/band', count: 'Classic' },
                    { name: 'Lesbian Ring', href: '/category/lesbian-ring', count: 'Trending' },
                    { name: 'Pendant', href: '/category/pendant', count: 'Gifting' },
                    { name: 'Earrings', href: '/category/earrings', count: 'Daily Wear' },
                    { name: 'Necklace', href: '/category/necklace', count: 'New' },
                    { name: 'Bracelet', href: '/category/bracelet', count: 'Essentials' },
                    { name: 'Nose Ring', href: '/category/nose-ring', count: 'Trendy' },
                    { name: 'Belly Rings', href: '/category/belly-rings', count: 'Trendy' },
                    { name: 'Ring Set', href: '/category/ring-set', count: 'Trending' },
                    { name: 'Moissanite vs Diamond Guide', href: '/#comparison', count: 'Guide' },
                    { name: 'Interactive Ring Sizer', href: '/#size-guide', count: 'Tool' },
                    { name: 'Contact Us & Store Location', href: '/contact', count: 'Help' },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-1.5 border-b border-[#D4AF37]/15 text-[#FDFBF7] hover:text-[#D4AF37] transition-colors"
                    >
                      <span className="font-serif text-base">{item.name}</span>
                      <span className="font-sans text-[9px] text-[#D4AF37]/80 uppercase tracking-wider">
                        {item.count}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-5 bg-[#011C15] border-t border-[#D4AF37]/20 space-y-2.5">
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#D4AF37] text-[#022C22] rounded-xl font-sans text-xs font-bold tracking-wider uppercase shadow-md hover:bg-[#F3E5AB] transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
                <p className="text-center font-sans text-[10px] text-gray-400">
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
