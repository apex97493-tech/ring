'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

export default function FlyToCartAnimation() {
  const { flyingItems, removeFlyingItem } = useCart();
  const [cartPos, setCartPos] = useState({ x: 0, y: 0 });

  // Update cart icon position
  useEffect(() => {
    const updateTarget = () => {
      // Find the cart icon in the header
      const cartIcon = document.getElementById('header-cart-icon');
      if (cartIcon) {
        const rect = cartIcon.getBoundingClientRect();
        setCartPos({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      } else {
        // Fallback to top right
        setCartPos({ x: window.innerWidth - 40, y: 40 });
      }
    };
    
    updateTarget();
    window.addEventListener('resize', updateTarget);
    window.addEventListener('scroll', updateTarget);
    return () => {
      window.removeEventListener('resize', updateTarget);
      window.removeEventListener('scroll', updateTarget);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <AnimatePresence>
        {flyingItems.map((item) => {
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
          const swing = isMobile ? 50 : 150;
          const maxSwing = isMobile ? 70 : 200;
          const peakScale = isMobile ? 1.5 : 2.8;

          return (
          <motion.div
            key={item.id}
            initial={{ 
              x: item.startX - 60, 
              y: item.startY - 60, 
              scale: 1, 
              opacity: 1,
              rotate: 0 
            }}
            animate={{ 
              x: item.type === 'drop' ? [
                item.startX - 60,                  
                item.startX - 60,                  
                item.startX > window.innerWidth/2 ? item.startX - swing : item.startX + swing,
                item.startX > window.innerWidth/2 ? item.startX - maxSwing : item.startX + maxSwing
              ] : [
                item.startX - 60,                  
                item.startX - 60,                  
                item.startX > window.innerWidth/2 ? item.startX - swing : item.startX + swing,
                cartPos.x - 30                     
              ], 
              y: item.type === 'drop' ? [
                item.startY - 60,                  
                item.startY - 180,                 
                window.innerHeight + 150,          
                window.innerHeight + 300           
              ] : [
                item.startY - 60,                  
                item.startY - 180,                 
                window.innerHeight - 150,          
                cartPos.y - 30                     
              ], 
              scale: item.type === 'drop' ? [1, peakScale, 1, 0.5] : [1, peakScale, 1, 0.1],
              opacity: item.type === 'drop' ? [1, 1, 0, 0] : [1, 1, 0.9, 0],
              rotate: [0, -15, 120, 720]           
            }}
            transition={{ 
              duration: isMobile ? 1.8 : 2.2,                       // Faster on mobile
              times: [0, 0.35, 0.7, 1],            // Control timing of each bounce
              ease: ["easeOut", "easeIn", "easeInOut"] // Up fast, drop heavy, swoosh to cart
            }}
            onAnimationComplete={() => removeFlyingItem(item.id)}
            className="absolute rounded-2xl overflow-hidden shadow-2xl border-4 border-[#D39EAA] bg-white z-[9999]"
            style={{ width: '120px', height: '120px', transformOrigin: 'center' }}
          >
            <Image 
              src={item.image} 
              alt="Flying Product" 
              fill 
              className="object-cover"
              unoptimized
            />
          </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
