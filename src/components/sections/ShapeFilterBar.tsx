'use client';

import React from 'react';
import { SHAPES } from '@/lib/data';

function DiamondShapeIcon({ shapeType, isSelected }: { shapeType: string; isSelected: boolean }) {
  const strokeColor = isSelected ? '#022C22' : '#8C6A1F';
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
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1.5">
          <polygon points="12,2 22,8.5 18,21 6,21 2,8.5" />
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
  return (
    <div className="w-full py-5 border-y border-[#E8E5DF] bg-[#F7F5F0]/80 mb-10 overflow-x-auto no-scrollbar">
      <div className="max-w-[1440px] mx-auto px-4 flex items-center justify-start md:justify-center gap-2.5 sm:gap-3.5 min-w-max">
        {SHAPES.map((shape) => {
          const isSelected = selectedShape === shape.value;
          return (
            <button
              key={shape.value}
              onClick={() => onSelectShape(shape.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-sans text-xs font-semibold tracking-wider uppercase transition-all select-none cursor-pointer ${
                isSelected
                  ? 'bg-[#D4AF37] text-[#022C22] shadow-md scale-105 border border-[#B89035]'
                  : 'bg-white text-[#27272A] border border-[#E8E5DF] hover:border-[#D4AF37] hover:text-[#022C22]'
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
