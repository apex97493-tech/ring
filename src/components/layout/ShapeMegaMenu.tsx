'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const SHAPES = [
  { id: 'round', name: 'Round' },
  { id: 'oval', name: 'Oval' },
  { id: 'princess', name: 'Princess' },
  { id: 'emerald', name: 'Emerald' },
  { id: 'radiant', name: 'Radiant' },
  { id: 'pear', name: 'Pear' },
  { id: 'heart', name: 'Heart' },
  { id: 'cushion', name: 'Cushion' },
  { id: 'marquise', name: 'Marquise' },
];

function DiamondShapeIcon({ shapeType }: { shapeType: string }) {
  const strokeColor = '#022C22';
  const fillColor = 'rgba(2, 44, 34, 0.05)';

  switch (shapeType) {
    case 'round':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4.5" strokeDasharray="1 1" />
        </svg>
      );
    case 'oval':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1">
          <ellipse cx="12" cy="12" rx="7" ry="10.5" />
        </svg>
      );
    case 'emerald':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1">
          <polygon points="7,3 17,3 21,7 21,17 17,21 7,21 3,17 3,7" />
          <rect x="7" y="7" width="10" height="10" strokeDasharray="1 1" />
        </svg>
      );
    case 'radiant':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1">
          <polygon points="6,3 18,3 21,6 21,18 18,21 6,21 3,18 3,6" />
          <line x1="3" y1="3" x2="21" y2="21" strokeWidth="0.5" />
          <line x1="21" y1="3" x2="3" y2="21" strokeWidth="0.5" />
        </svg>
      );
    case 'cushion':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1">
          <rect x="4" y="4" width="16" height="16" rx="5" />
          <circle cx="12" cy="12" r="4" strokeDasharray="1 1" />
        </svg>
      );
    case 'pear':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1">
          <path d="M12 2 C12 2, 4.5 10.5, 4.5 16 A 7.5 7.5 0 0 0 19.5 16 C 19.5 10.5, 12 2, 12 2 Z" />
        </svg>
      );
    case 'princess':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1">
          <rect x="4" y="4" width="16" height="16" />
          <line x1="4" y1="4" x2="20" y2="20" strokeWidth="0.5" />
          <line x1="20" y1="4" x2="4" y2="20" strokeWidth="0.5" />
        </svg>
      );
    case 'marquise':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1">
          <path d="M12 2 C5 7, 2.5 12, 2.5 12 C 2.5 12, 5 17, 12 22 C 19 17, 21.5 12, 21.5 12 C 21.5 12, 19 7, 12 2 Z" />
        </svg>
      );
    case 'heart':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      );
    default:
      return null;
  }
}

interface ShapeMegaMenuProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function ShapeMegaMenu({ isOpen, onMouseEnter, onMouseLeave }: ShapeMegaMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="absolute top-full left-0 w-max max-w-4xl bg-[#FDFBF7] shadow-royal border border-[#D4AF37]/30 rounded-b-xl z-50 pt-2 pb-6 px-8 mt-[1px]"
        >
          <div className="text-center mb-6 pt-4">
            <h3 className="font-serif text-2xl text-[#022C22] font-semibold">Shop By Shape</h3>
            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mt-2"></div>
          </div>
          
          <div className="grid grid-cols-5 gap-x-8 gap-y-8">
            {SHAPES.map((shape) => (
              <Link
                key={shape.id}
                href={`/shop?shape=${shape.id}`}
                className="flex flex-col items-center group"
              >
                <div className="w-16 h-16 rounded-full bg-white border border-[#E8E5DF] flex items-center justify-center group-hover:border-[#D4AF37] group-hover:shadow-md transition-all group-hover:scale-105 mb-3">
                  <DiamondShapeIcon shapeType={shape.id} />
                </div>
                <span className="font-sans text-[11px] font-semibold text-[#18181B] group-hover:text-[#D4AF37] uppercase tracking-wider transition-colors">
                  {shape.name}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
