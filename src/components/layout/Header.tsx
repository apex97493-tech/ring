'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  PhoneCall,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import { useCart } from '@/context/CartContext';
import { products } from '@/lib/data';

export default function Header() {
  const router = useRouter();
  const { totalItems, setIsCartOpen, wishlist } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcut: Cmd/Ctrl + K or / to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // Robust multi-token and multi-field search across catalog
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const tokens = query.split(/\s+/).filter(Boolean);

    return products.filter((p) => {
      const searchableText = [
        p.name,
        p.category,
        p.shape,
        p.metal,
        p.primaryGemstone || '',
        p.secondaryGemstone || '',
        p.ringStyle || '',
        p.description || '',
        p.badge || '',
        ...(p.tags || []),
        p.sku || '',
      ]
        .join(' ')
        .toLowerCase();

      return tokens.every((token) => searchableText.includes(token));
    });
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleChipClick = (term: string) => {
    setSearchQuery(term);
    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-[#022C22] text-[#FDFBF7] border-b border-[#D4AF37]/25 shadow-royal transition-all">
        {/* Top Gold Announcement Bar */}
        <AnnouncementBar />

        {/* Main Navbar */}
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 gap-2 sm:gap-4">
            {/* Mobile Menu Trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 text-[#FDFBF7] hover:text-[#D4AF37] transition-colors cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center justify-start shrink-0">
              <Link href="/" className="group flex items-center">
                <span className="font-serif italic text-[22px] sm:text-[30px] lg:text-[36px] font-bold text-[#D4AF37] group-hover:text-white transition-colors tracking-wide">
                  ForeverJewellStudio
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex flex-nowrap items-center justify-center gap-x-8 xl:gap-x-12">
              {[
                { name: 'Home', href: '/' },
                { name: 'Contact', href: '/contact' },
                { name: 'Help', href: '/#faqs' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="font-serif italic text-[16px] xl:text-[20px] font-medium tracking-[0.05em] text-[#FDFBF7] hover:text-[#D4AF37] transition-colors relative group py-2"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-3.5">
              {/* WhatsApp Support */}
              <a
                href="https://wa.me/919999999999?text=Hello!%20I%20am%20interested%20in%20custom%20Moissanite%20Jewelry."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-sans font-bold tracking-wider text-[#022C22] bg-[#D4AF37] hover:bg-[#F3E5AB] rounded-full transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              {/* Etsy Shop Button */}
              <a
                href="https://www.etsy.com/shop/foreverjewellstudio?section_id=59060242"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors p-1 flex items-center justify-center group"
                aria-label="Visit our Etsy Shop"
                title="Visit our Etsy Shop"
              >
                <div className="bg-[#F1641E] text-white px-2 sm:px-2.5 h-6 flex items-center justify-center rounded shadow-sm group-hover:shadow-md transition-all group-hover:scale-105">
                  <span className="font-serif font-bold text-[11px] sm:text-[12px] leading-none tracking-wide">
                    Etsy
                  </span>
                </div>
              </a>

              {/* Search Button (Mobile/Tablet visible, Desktop quick click) */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors p-1.5 cursor-pointer rounded-full hover:bg-white/10"
                aria-label="Search jewelry and rings"
                title="Search (⌘K)"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.8} />
              </button>

              {/* Wishlist Icon */}
              <Link
                href="/category/rings"
                className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors relative p-1.5 hidden sm:block rounded-full hover:bg-white/10"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.8} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-[#022C22] font-sans text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-[#FDFBF7] hover:text-[#D4AF37] transition-colors relative p-1.5 flex items-center rounded-full hover:bg-white/10 cursor-pointer"
                aria-label="Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.8} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-[#022C22] font-sans text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── LUXURY SEARCH OVERLAY MODAL ─────────────────────────────────────── */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4 bg-black/75 backdrop-blur-sm">
            {/* Backdrop click to close */}
            <div
              className="fixed inset-0"
              onClick={() => setIsSearchOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 bg-[#FDFBF7] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[#D4AF37]/50"
            >
              {/* Search Bar Input Form */}
              <form
                onSubmit={handleSearchSubmit}
                className="p-3.5 sm:p-4 border-b border-[#E8E5DF] flex items-center gap-3 bg-[#022C22] text-[#FDFBF7]"
              >
                <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search rings, gemstones, shapes, styles (e.g. Oval, Signet, Opal)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full font-sans text-sm sm:text-base text-white bg-transparent focus:outline-none placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-gray-300 hover:text-white cursor-pointer"
                    title="Clear query"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="hidden sm:inline-block px-3.5 py-1.5 bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#022C22] rounded-lg font-sans text-xs font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full text-gray-300 hover:text-white cursor-pointer"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>

              {/* Suggestions or Live Results Area */}
              <div className="max-h-[65vh] overflow-y-auto p-4">
                {searchQuery.trim() === '' ? (
                  <div className="py-3">
                    <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold tracking-wider text-gray-400 uppercase font-sans">
                      <Sparkles className="w-3.5 h-3.5 text-[#B89035]" />
                      Popular Jewelry Searches
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Moissanite Rings',
                        'Oval Solitaire',
                        'Emerald Cut',
                        'Signet Ring',
                        'Opal Ring',
                        'Vintage Art Deco',
                        'Eternity Band',
                        'Lesbian Pride Ring',
                        '14k Yellow Gold',
                        'Rose Gold Ring',
                      ].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleChipClick(tag)}
                          className="px-3.5 py-1.5 bg-[#F5F2EC] hover:bg-[#D4AF37]/25 text-xs font-sans rounded-full text-[#022C22] transition-colors border border-[#E8E5DF] cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-sans">
                      <span>Tip: Press <kbd className="font-mono bg-gray-100 px-1 py-0.5 rounded border border-gray-300">Enter</kbd> to view full results page</span>
                      <Link
                        href="/shop"
                        onClick={() => setIsSearchOpen(false)}
                        className="text-[#8C6A1F] hover:underline font-semibold flex items-center gap-1"
                      >
                        Browse all rings <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                      <p className="font-sans text-xs font-semibold text-gray-400 uppercase">
                        {searchResults.length} {searchResults.length === 1 ? 'Design' : 'Designs'} Found
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                        }}
                        className="text-xs font-semibold text-[#8C6A1F] hover:underline font-sans flex items-center gap-1 cursor-pointer"
                      >
                        View all in full grid <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {searchResults.slice(0, 8).map((prod) => (
                        <Link
                          key={prod.id}
                          href={`/products/${prod.slug}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-3 py-2.5 px-2 hover:bg-[#F5F2EC] rounded-xl transition-colors group"
                        >
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border border-gray-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#022C22] group-hover:text-[#B89035] truncate">
                              {prod.name}
                            </h4>
                            <p className="font-sans text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                              <span>{prod.shape} Cut</span>
                              {prod.carat && prod.carat !== 'N/A' && (
                                <>
                                  <span>•</span>
                                  <span>{prod.carat}</span>
                                </>
                              )}
                              <span>•</span>
                              <span className="capitalize">{prod.category}</span>
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-sans text-xs sm:text-sm font-bold text-[#064E3B] block">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </span>
                            <span className="font-sans text-[10px] text-gray-400 line-through">
                              ₹{prod.originalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {searchResults.length > 8 && (
                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setIsSearchOpen(false);
                            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                          }}
                          className="w-full py-2 bg-[#F5F2EC] hover:bg-[#D4AF37]/20 text-[#022C22] font-sans text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-[#E8E5DF]"
                        >
                          View all {searchResults.length} results on Search Page →
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-10 text-center space-y-3 font-sans">
                    <p className="text-gray-500 text-sm">
                      No matching rings or jewelry found for &ldquo;{searchQuery}&rdquo;.
                    </p>
                    <p className="text-xs text-gray-400">
                      Try searching for &ldquo;Oval&rdquo;, &ldquo;Emerald&rdquo;, &ldquo;Signet&rdquo;, or &ldquo;Moissanite&rdquo;.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#022C22] text-[#D4AF37] rounded-xl text-xs font-semibold cursor-pointer hover:bg-[#D4AF37] hover:text-[#022C22] transition-colors"
                      >
                        Explore Advanced Search Page <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MOBILE MENU DRAWER ──────────────────────────────────────────────── */}
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
              className="fixed inset-y-0 left-0 w-[84%] max-w-sm bg-[#022C22] text-[#FDFBF7] border-r border-[#D4AF37]/30 shadow-2xl flex flex-col justify-between"
            >
              <div className="overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-[#D4AF37]/20">
                  <div>
                    <span className="font-serif text-xl font-bold tracking-widest text-[#D4AF37] uppercase">
                      ForeverJewellStudio
                    </span>
                    <p className="font-sans text-[8.5px] tracking-widest text-[#F3E5AB] uppercase font-semibold">
                      Royal Moissanite & Fine Jewelry
                    </p>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-gray-400 hover:text-white cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Search in Mobile Drawer */}
                <div className="p-3 border-b border-[#D4AF37]/20">
                  <div
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-black/30 rounded-xl border border-[#D4AF37]/30 text-xs text-gray-300 cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-sans">Search all 280+ rings & jewels...</span>
                  </div>
                </div>

                <nav className="p-4 space-y-2.5">
                  {[
                    { name: 'Search Product Catalog', href: '/search', count: 'Search' },
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
                      <span className="font-serif text-sm sm:text-base">{item.name}</span>
                      <span className="font-sans text-[9px] text-[#D4AF37]/80 uppercase tracking-wider">
                        {item.count}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-4 bg-[#011C15] border-t border-[#D4AF37]/20 space-y-2">
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#D4AF37] text-[#022C22] rounded-xl font-sans text-xs font-bold tracking-wider uppercase shadow-md hover:bg-[#F3E5AB] transition-colors"
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
