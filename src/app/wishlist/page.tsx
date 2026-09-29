'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { products } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import { Heart, ShoppingBag, ArrowRight, Trash2, Send } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, setIsCartOpen } = useCart();
  const { formatPrice, selectedCurrency } = useCurrency();

  // Find full product details for each wishlisted ID
  const wishlistedProducts = React.useMemo(() => {
    return wishlist
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is (typeof products)[0] => !!p);
  }, [wishlist]);

  const handleAddAllToCart = () => {
    wishlistedProducts.forEach((product) => {
      addToCart({
        product,
        selectedMetal: product.metal || '14K White Gold',
        selectedSize: 'US 7',
        selectedCarat: product.carat || '2.00 CT',
        price: product.price,
        quantity: 1,
        image: product.images?.[0] || '/images/ai_ring1_front.jpg',
      });
    });
    setIsCartOpen(true);
  };

  const handleShareWishlistWhatsApp = () => {
    if (wishlistedProducts.length === 0) return;
    let text = `*MY FOREVERJEWELLSTUDIO WISHLIST* 💍✨%0A%0A`;
    wishlistedProducts.forEach((p, idx) => {
      text += `${idx + 1}. *${p.name}*%0A`;
      text += `• Price: ${formatPrice(p.price)} (${selectedCurrency.code})%0A`;
      text += `• Shape: ${p.shape} | Carat: ${p.carat || '2.00 CT'}%0A`;
      text += `• Link: https://foreverjewellstudio.com/products/${p.slug}%0A%0A`;
    });
    text += `Please help me check the ring sizing and availability!`;
    window.open(`https://wa.me/919828930454?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs text-gray-500 font-sans mb-3">
            <Link href="/" className="hover:text-[#022C22] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#022C22] font-semibold">Wishlist</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E5DF] pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl text-[#022C22] font-bold">
                  My Saved Jewelry
                </h1>
              </div>
              <p className="font-sans text-xs sm:text-sm text-gray-600 mt-2">
                Keep track of your dream solitaire rings and fine jewelry designs.
              </p>
            </div>

            {wishlistedProducts.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleShareWishlistWhatsApp}
                  className="px-4 py-2.5 bg-[#064E3B] hover:bg-[#043327] active:scale-95 text-[#D4AF37] font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Share Wishlist on WhatsApp
                </button>

                <button
                  type="button"
                  onClick={handleAddAllToCart}
                  className="px-4 py-2.5 bg-[#022C22] hover:bg-[#D4AF37] hover:text-[#022C22] active:scale-95 text-[#D4AF37] font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer border border-[#D4AF37]/30"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Move All to Bag ({wishlistedProducts.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {wishlistedProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#E8E5DF] p-8 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-[#FDFBF7] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8E5DF]">
              <Heart className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="font-serif text-2xl text-[#022C22] font-bold mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="font-sans text-xs sm:text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Tap the heart icon on any moissanite ring or fine jewelry piece while browsing to save your favorite designs for later.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#022C22] text-[#D4AF37] font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#022C22] active:scale-95 transition-all rounded-xl shadow-md"
            >
              Explore Solitaire Rings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {wishlistedProducts.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard product={product} />
                  <div className="mt-2 text-center">
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className="text-xs text-gray-500 hover:text-rose-600 transition-colors inline-flex items-center gap-1 cursor-pointer font-sans py-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove from Wishlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
