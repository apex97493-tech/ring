'use client';

import React, { useState } from 'react';
import { Tag, MapPin, Check, Copy } from 'lucide-react';

export default function WokeOfferCard() {
  const [copiedCode, setCopiedCode] = useState<string>('');

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  return (
    <div className="space-y-4 font-sans mt-5">
      {/* 1. AVAILABLE OFFERS CARD */}
      <div className="bg-[#F8F5EE] border border-[#E9E3D6] rounded-xl p-4 sm:p-5 relative overflow-hidden shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EAE2D2] text-[#8C6A1F] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Tag className="w-4 h-4 text-[#8C6A1F]" />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-bold text-[#8C6A1F] tracking-[0.15em] block">
              EXCLUSIVE SAVINGS
            </span>
            <h4 className="font-serif text-base font-bold text-[#18181B] mt-0.5 mb-2.5">
              Available Offers
            </h4>

            <ul className="space-y-2 text-xs text-gray-700">
              {/* Offer 1 */}
              <li className="flex items-center justify-between gap-2 bg-white/70 px-2.5 py-1.5 rounded-lg border border-[#E3DBD0]/50">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6A1F] flex-shrink-0" />
                  <span className="font-mono font-bold text-[#18181B]">FOREVER10</span>
                  <span className="text-gray-600 truncate">: FLAT 10% OFF FIRST ORDER</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyCoupon('FOREVER10')}
                  className="text-[10px] font-bold text-[#8C6A1F] hover:text-black uppercase tracking-wider px-2 py-0.5 bg-[#FAF6EE] hover:bg-gray-100 rounded border border-[#E0D7C7] transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0"
                >
                  {copiedCode === 'FOREVER10' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </li>

              {/* Offer 2 */}
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C6A1F] flex-shrink-0" />
                <span>
                  <strong className="text-[#18181B]">UPTO ₹5,000 OFF</strong> on Certified Moissanite & Fine Gold rings
                </span>
              </li>

              {/* Offer 3 */}
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C6A1F] flex-shrink-0" />
                <span>
                  <strong className="text-[#18181B]">Free Gift</strong> worth ₹3,999 on spends above ₹14,999. For first-time buyers only.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. VISIT OUR STORE / ATELIER CARD */}
      <div className="bg-[#F8F5EE] border border-[#E9E3D6] rounded-xl p-4 sm:p-5 relative overflow-hidden shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#18181B] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-bold text-[#8C6A1F] tracking-[0.15em] block">
              VISIT OUR ATELIER & STORE
            </span>
            <p className="font-serif text-sm font-bold text-[#18181B] mt-0.5">
              Flagship Workshop & Salon: Jaipur & Surat, India
            </p>
            <p className="text-[11px] text-gray-600 mt-1">
              Complimentary in-person ring sizing, custom bridal consultations, and live stone selection appointments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
