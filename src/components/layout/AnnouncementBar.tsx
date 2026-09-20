'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Truck, Percent } from 'lucide-react';

const announcements = [
  { text: 'Complimentary Insured Express Delivery Across India', icon: Truck },
  { text: 'Certified VVS1 D-Color Moissanite With Individual GRA Lab Reports', icon: Sparkles },
  { text: 'Guaranteed 100% Lifetime Buyback & Upgrade Credit', icon: ShieldCheck },
  { text: 'Use Code WOKE10 For 10% Off On Your First Solitaire', icon: Percent },
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const item = announcements[current];
  const Icon = item.icon;

  return (
    <div className="bg-[#D4AF37] text-[#022C22] text-center py-2 px-4 text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.2em] uppercase border-b border-[#022C22]/20 flex items-center justify-center gap-2.5 select-none overflow-hidden transition-all shadow-xs">
      <Icon className="w-3.5 h-3.5 text-[#022C22] flex-shrink-0" strokeWidth={2} />
      <span className="truncate">{item.text}</span>
    </div>
  );
}
