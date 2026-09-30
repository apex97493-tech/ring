'use client';

import React from 'react';
import { SHAPES } from '@/lib/data';

function DiamondShapeIcon({ shapeType, isSelected }: { shapeType: string; isSelected: boolean }) {
  const strokeColor = isSelected ? '#592D37' : '#8C6A1F';
  const fillColor = isSelected ? 'rgba(2, 44, 34, 0.15)' : 'none';

  switch (shapeType) {
    case 'round':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4.5" strokeDasharray="1 1" />
        </svg>
      );
    case 'oval':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1.5">
          <ellipse cx="12" cy="12" rx="7" ry="9.5" />
        </svg>
      );
    case 'emerald':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1.5">
          <polygon points="7,4 17,4 20,7 20,17 17,20 7,20 4,17 4,7" />
          <rect x="7" y="7" width="10" height="10" strokeDasharray="1 1" />
        </svg>
      );
    case 'radiant':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1.5">
          <polygon points="6,4 18,4 20,6 20,18 18,20 6,20 4,18 4,6" />
          <line x1="4" y1="4" x2="20" y2="20" strokeWidth="0.75" />
          <line x1="20" y1="4" x2="4" y2="20" strokeWidth="0.75" />
        </svg>
      );
    case 'cushion':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1.5">
          <rect x="4" y="4" width="16" height="16" rx="5" />
        </svg>
      );
    case 'pear':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1.5">
          <path d="M12 3 C12 3, 5 11, 5 16 A 7 7 0 0 0 19 16 C 19 11, 12 3, 12 3 Z" />
        </svg>
      );
    case 'princess':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1.5">
          <rect x="5" y="5" width="14" height="14" />
          <line x1="5" y1="5" x2="19" y2="19" strokeWidth="0.75" />
          <line x1="19" y1="5" x2="5" y2="19" strokeWidth="0.75" />
        </svg>
      );
    case 'marquise':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1.5">
          <path d="M12 2 C6 7, 3 12, 3 12 C 3 12, 6 17, 12 22 C 18 17, 21 12, 21 12 C 21 12, 18 7, 12 2 Z" />
        </svg>
      );
    case 'heart':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1.5">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    case 'asscher':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1.5">
          <polygon points="7,5 17,5 19,7 19,17 17,19 7,19 5,17 5,7" />
          <rect x="8" y="8" width="8" height="8" strokeDasharray="1 1" />
        </svg>
      );
    case 'trillion':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1.5">
          <polygon points="12,3 22,20 2,20" />
          <polygon points="12,6 19,18 5,18" strokeDasharray="1 1" />
        </svg>
      );
    case 'baguette':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1.5">
          <rect x="8" y="3" width="8" height="18" />
          <rect x="10" y="5" width="4" height="14" strokeDasharray="1 1" />
        </svg>
      );
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

export default function ShapeFilterBar({
  selectedShape,
  onSelectShape,
}: {
  selectedShape: string;
  onSelectShape: (shape: string) => void;
}) {
  const currentNormalized = (selectedShape || 'all').toLowerCase();

  return (
    <div className="w-full max-w-full py-3 sm:py-5 border-y border-[#E8E5DF] bg-[#F7F5F0]/80 mb-6 sm:mb-10 overflow-x-auto no-scrollbar touch-pan-x">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 flex items-center justify-start md:justify-center gap-2 sm:gap-3.5 min-w-max">
        {SHAPES.map((shape) => {
          const isSelected = currentNormalized === shape.value.toLowerCase();
          return (
            <button
              type="button"
              key={shape.value}
              onClick={(e) => {
                e.preventDefault();
                onSelectShape(shape.value);
              }}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-sans text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all select-none cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-[#D39EAA] text-[#592D37] shadow-md scale-105 border border-[#C88E91]'
                  : 'bg-white text-[#27272A] border border-[#E8E5DF] hover:border-[#D39EAA] hover:text-[#592D37]'
              }`}
            >
              <DiamondShapeIcon shapeType={shape.shapeType} isSelected={isSelected} />
              <span>{shape.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
