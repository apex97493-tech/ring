import React from 'react';
import Link from 'next/link';
import { getProductsByCategory } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const products = getProductsByCategory(slug);

  if (!products || products.length === 0) {
    notFound();
  }

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      {/* Category Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="font-serif text-5xl md:text-6xl text-[var(--color-brand-emerald-dark)] mb-4 uppercase tracking-wider">
          {categoryName}
        </h1>
        <div className="w-24 h-[1px] bg-[var(--color-brand-gold)] mx-auto mb-6"></div>
        <p className="font-serif text-xl italic text-[var(--color-brand-emerald-dark)]/80 max-w-2xl mx-auto">
          Explore our exclusive collection of 20 stunning {slug}. Each piece is meticulously crafted to showcase the brilliance of its stones.
        </p>
      </div>

      {/* Products Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
          {products.map((product) => {
            const originalPrice = product.price * 2; // Simulating 50% off

            return (
              <Link href={`/products/${product.slug}`} key={product.id} className="group flex flex-col bg-transparent">
                {/* Image Container */}
                <div className="relative aspect-square mb-3 overflow-hidden rounded-xl shadow-sm border border-gray-100 bg-[#f9f9f9]">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Remove the stone tag to match the clean UI of the screenshot, or keep a small heart icon */}
                </div>
                
                {/* Product Title */}
                <h3 className="font-sans text-sm text-gray-900 group-hover:underline line-clamp-1 mb-1">
                  {product.name}
                </h3>
                
                {/* Pricing row matching screenshot */}
                <div className="flex items-center gap-1.5 flex-wrap font-sans mb-2">
                  <span className="text-[15px] font-bold text-[#146b2b]">
                    ₹ {product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[12px] text-gray-500 line-through">
                    ₹ {originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[12px] text-gray-500">
                    (50% off)
                  </span>
                </div>

                {/* FREE delivery badge matching screenshot */}
                <div className="mt-auto">
                  <span className="inline-block bg-[#c9e8ca] text-[#146b2b] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    FREE delivery
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
