'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error securely without exposing stack traces to client
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#FDFBF7] px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 text-rose-600 mb-6 border border-rose-200 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>

        <span className="font-sans text-xs font-bold tracking-[0.2em] text-rose-600 uppercase block mb-2">
          Temporary Session Interruption
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#18181B] mb-3">
          Something Went Unexpectedly Wrong
        </h1>

        <p className="font-sans text-xs sm:text-sm text-gray-600 mb-8 leading-relaxed">
          Your security and connection remain protected. Please refresh your view or return to our homepage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#022C22] hover:bg-[#B89035] text-[#D4AF37] hover:text-white rounded-xl font-sans text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#E8E5DF] text-gray-800 rounded-xl font-sans text-xs font-bold tracking-widest uppercase transition-all shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return to Boutique</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
