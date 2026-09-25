import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Home, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#FDFBF7] px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#064E3B] text-[#D4AF37] mb-6 shadow-royal border border-[#D4AF37]/40">
          <Sparkles className="w-8 h-8" />
        </div>

        <span className="font-sans text-xs font-bold tracking-[0.25em] text-[#8C6A1F] uppercase block mb-2">
          Page Not Found • 404
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#18181B] mb-3">
          This Gemstone Could Not Be Found
        </h1>

        <p className="font-sans text-xs sm:text-sm text-gray-600 mb-8 leading-relaxed">
          The page or piece you are searching for might have been moved, renamed, or is currently reserved in our private vault.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#022C22] hover:bg-[#B89035] text-[#D4AF37] hover:text-white rounded-xl font-sans text-xs font-bold tracking-widest uppercase transition-all shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Return to Boutique</span>
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-[#E8E5DF] hover:border-[#D4AF37] text-gray-800 rounded-xl font-sans text-xs font-bold tracking-widest uppercase transition-all shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-[#8C6A1F]" />
            <span>Browse Collection</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
