'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/data';

export type CartItem = {
  id: string; // unique cart item id (product.id + metal + size + carat)
  product: Product;
  quantity: number;
  selectedMetal: string;
  selectedSize: string;
  selectedCarat: string;
  engravingText?: string;
  price: number;
  image: string;
};

type CartContextType = {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  freeShippingThreshold: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load from localStorage on mount with strict schema validation
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('aurora_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          // Validate structure of each cart item to avoid injection / corrupt data
          const validItems = parsed.filter(
            (item) =>
              item &&
              typeof item === 'object' &&
              typeof item.id === 'string' &&
              typeof item.price === 'number' &&
              item.price > 0 &&
              typeof item.quantity === 'number' &&
              item.quantity > 0 &&
              item.product &&
              typeof item.product.id === 'string'
          ).map((item) => ({
            ...item,
            quantity: Math.min(Math.max(1, Math.floor(item.quantity)), 20),
            engravingText: typeof item.engravingText === 'string'
              ? item.engravingText.replace(/<[^>]*>?/gm, '').slice(0, 30)
              : undefined,
          }));
          setCart(validItems);
        }
      }

      const savedWishlist = localStorage.getItem('aurora_wishlist');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          setWishlist(parsedWishlist.filter((id) => typeof id === 'string'));
        }
      }
    } catch (e) {
      console.error('Storage validation error handled safely:', e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aurora_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('aurora_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    // Sanitize any input engraving text
    const cleanEngraving = item.engravingText
      ? item.engravingText.replace(/<[^>]*>?/gm, '').slice(0, 30)
      : undefined;

    const safeQty = Math.min(Math.max(1, Math.floor(item.quantity || 1)), 20);
    const uniqueId = `${item.product.id}-${item.selectedMetal}-${item.selectedSize}-${item.selectedCarat}-${cleanEngraving || ''}`;
    
    setCart((prev) => {
      const existing = prev.find((i) => i.id === uniqueId);
      if (existing) {
        return prev.map((i) =>
          i.id === uniqueId ? { ...i, quantity: Math.min(i.quantity + safeQty, 20) } : i
        );
      }
      return [...prev, { ...item, quantity: safeQty, engravingText: cleanEngraving, id: uniqueId }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    const safeQty = Math.min(Math.max(1, Math.floor(qty)), 20);
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: safeQty } : i))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 2500; // Free shipping above ₹2500

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        freeShippingThreshold,
        wishlist,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
