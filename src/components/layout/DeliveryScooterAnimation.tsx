'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

export default function DeliveryScooterAnimation() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Hide the animation after it completes its run (e.g. 5 seconds)
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full h-[100px] pointer-events-none z-[9999] overflow-hidden">
      <motion.div
        initial={{ x: '-20vw', y: 0 }}
        animate={{ 
          x: '110vw',
          y: [0, -4, 0, -4, 0] // subtle bouncing effect simulating a bumpy road
        }}
        transition={{ 
          x: { duration: 4, ease: 'linear' },
          y: { repeat: Infinity, duration: 0.4 }
        }}
        className="absolute bottom-2 flex items-center"
      >
        <div className="relative flex items-center text-[#B76E79]">
          {/* Custom SVG for a classic delivery scooter */}
          <svg width="80" height="60" viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M46.5 28C46.5 26.6 45.4 25.5 44 25.5H35.5C32.7 25.5 30.2 27.2 29 29.7L25 38H15C13.9 38 13 38.9 13 40V41C13 42.1 13.9 43 15 43H18.2C19.2 47 22.8 50 27 50C31.2 50 34.8 47 35.8 43H45.2C46.2 47 49.8 50 54 50C58.2 50 61.8 47 62.8 43H64V41C64 38.9 63.2 36.9 61.7 35.4L54 28V15C54 13.9 53.1 13 52 13H42C40.9 13 40 13.9 40 15V25.5H44C45.4 25.5 46.5 26.6 46.5 28ZM27 46C24.2 46 22 43.8 22 41C22 38.2 24.2 36 27 36C29.8 36 32 38.2 32 41C32 43.8 29.8 46 27 46ZM54 46C51.2 46 49 43.8 49 41C49 38.2 51.2 36 54 36C56.8 36 59 38.2 59 41C59 43.8 56.8 46 54 46ZM50 28.5V36.2C48.8 35.4 47.3 35 45.7 35H40V25.5H44C44.3 25.5 44.5 25.7 44.5 26V28.5H50Z" />
            <path d="M49 15H42V23H49V15Z" fill="#D39EAA"/>
          </svg>
          
          {/* Parcel securely mounted on the back of the scooter */}
          <motion.div 
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 0.3 }}
            className="absolute -top-3 left-1 bg-[#8C6A1F] text-white p-1 rounded-sm shadow-md border border-[#592D37]"
          >
            <Package className="w-6 h-6" />
          </motion.div>

          {/* Speed lines */}
          <motion.div 
            animate={{ opacity: [0, 1, 0], x: [-10, -40] }}
            transition={{ repeat: Infinity, duration: 0.3 }}
            className="absolute top-1/2 -left-12 w-8 h-1 bg-gray-300 rounded-full"
          />
          <motion.div 
            animate={{ opacity: [0, 1, 0], x: [-5, -30] }}
            transition={{ repeat: Infinity, duration: 0.4, delay: 0.15 }}
            className="absolute bottom-2 -left-8 w-5 h-0.5 bg-gray-300 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
