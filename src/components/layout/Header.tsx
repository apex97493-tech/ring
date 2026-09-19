'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Search, ShoppingBag, Menu, X, User } from 'lucide-react';

export default function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[var(--color-brand-emerald-dark)] shadow-royal py-3' : 'bg-[var(--color-brand-emerald-dark)] py-5 border-b border-[var(--color-brand-gold)]/20'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button type="button" className="text-[var(--color-brand-cream)] hover:text-[var(--color-brand-gold)] transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center lg:w-1/4">
            <Link href="/" className="font-serif text-2xl lg:text-3xl font-bold tracking-widest uppercase text-[var(--color-brand-gold)]">
              AURORA
            </Link>
          </div>
          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex flex-grow justify-center space-x-10">
            {['Shop', 'Collections', 'High Jewelry', 'Heritage'].map((item) => (
              <Link key={item} href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="font-sans text-xs font-medium tracking-[0.15em] text-[var(--color-brand-cream)] hover:text-[var(--color-brand-gold)] transition-colors uppercase relative group">
                {item}
                <span className="absolute -bottom-1.5 left-0 w-0 h-[1px] bg-[var(--color-brand-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
          {/* Right Icons */}
          <div className="flex items-center justify-end space-x-6 lg:w-1/4">
            <button className="text-[var(--color-brand-cream)] hover:text-[var(--color-brand-gold)] transition-colors hidden sm:block">
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button className="text-[var(--color-brand-cream)] hover:text-[var(--color-brand-gold)] transition-colors hidden sm:block">
              <User className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button className="text-[var(--color-brand-cream)] hover:text-[var(--color-brand-gold)] transition-colors relative group">
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-2 bg-[var(--color-brand-gold)] text-[var(--color-brand-emerald-dark)] font-sans text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
            </button>
          </div>
        </div>
      </div>
      {/* Top Banner */}
      <div className="bg-[var(--color-brand-gold)] text-[var(--color-brand-emerald-dark)] text-center py-2 font-sans text-[10px] tracking-[0.2em] uppercase font-bold absolute top-full left-0 right-0 border-b border-[var(--color-brand-emerald-dark)]/10">
        Complimentary Secured Global Delivery
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-full max-w-sm bg-[var(--color-brand-emerald-dark)] border-r border-[var(--color-brand-gold)]/20 shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-brand-gold)]/20">
              <span className="font-serif text-2xl tracking-widest font-bold text-[var(--color-brand-gold)] uppercase">AURORA</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6 text-[var(--color-brand-gold)] hover:text-[var(--color-brand-cream)] transition-colors" />
              </button>
            </div>
            <nav className="p-8 flex flex-col space-y-6 mt-4">
              {['Shop', 'Collections', 'High Jewelry', 'Heritage'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="font-serif text-xl tracking-wider text-[var(--color-brand-cream)] hover:text-[var(--color-brand-gold)] transition-colors uppercase">
                  {item}
                </Link>
              ))}
            </nav>
          </motion.div>
        </div>
      )}
    </header>
  );
}
