'use client';

import React from 'react';
import { ShieldCheck, Award, CheckCircle, Sparkles } from 'lucide-react';

export default function TrustCertificationRibbon() {
  return (
    <div className="py-6 border-t border-b border-[#E8E5DF] bg-[#FAF8F5]/80 my-8">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="font-serif text-xs md:text-sm text-gray-600 tracking-wider mb-4 font-medium uppercase">
          Trusted by 10,000+ luxury shoppers across India & worldwide
        </p>

        {/* 4 Major Certification Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-items-center">
          {/* GIA */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8E2D7] rounded-xl shadow-2xs w-full max-w-[190px] justify-center">
            <div className="w-7 h-7 rounded-full bg-[#18181B] text-white flex items-center justify-center font-serif font-black text-xs">
              G
            </div>
            <div className="text-left">
              <span className="font-serif font-bold text-xs text-[#18181B] tracking-widest block leading-tight">
                GIA
              </span>
              <span className="text-[9px] text-gray-500 font-sans block leading-tight">
                Standards Tested
              </span>
            </div>
          </div>

          {/* IGI */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8E2D7] rounded-xl shadow-2xs w-full max-w-[190px] justify-center">
            <div className="w-7 h-7 rounded-full bg-[#8C6A1F] text-white flex items-center justify-center font-serif font-black text-xs">
              I
            </div>
            <div className="text-left">
              <span className="font-serif font-bold text-xs text-[#18181B] tracking-widest block leading-tight">
                IGI
              </span>
              <span className="text-[9px] text-gray-500 font-sans block leading-tight">
                Lab Graded
              </span>
            </div>
          </div>

          {/* GRA Certified */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8E2D7] rounded-xl shadow-2xs w-full max-w-[190px] justify-center">
            <div className="w-7 h-7 rounded-full bg-[#B76E79] text-[#D39EAA] flex items-center justify-center font-serif font-black text-xs">
              ★
            </div>
            <div className="text-left">
              <span className="font-serif font-bold text-xs text-[#18181B] tracking-widest block leading-tight">
                GRA
              </span>
              <span className="text-[9px] text-gray-500 font-sans block leading-tight">
                Report & Serial Card
              </span>
            </div>
          </div>

          {/* BIS Hallmark */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8E2D7] rounded-xl shadow-2xs w-full max-w-[190px] justify-center">
            <div className="w-7 h-7 rounded-full bg-[#B91C1C] text-white flex items-center justify-center font-serif font-black text-[10px]">
              BIS
            </div>
            <div className="text-left">
              <span className="font-serif font-bold text-xs text-[#18181B] tracking-widest block leading-tight">
                HALLMARK
              </span>
              <span className="text-[9px] text-gray-500 font-sans block leading-tight">
                925 / 14K Purity
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
