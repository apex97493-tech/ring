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
    <div className="bg-[var(--color-brand-cream)] min-h-screen pt-32 pb-24">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
            <Link href={`/products/${product.slug}`} key={product.id} className="group flex flex-col">
              <div className="relative aspect-[4/5] bg-[var(--color-brand-emerald-dark)] mb-6 overflow-hidden border border-[var(--color-brand-gold)]/20 shadow-md">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100 mix-blend-luminosity hover:mix-blend-normal"
                />
                {/* Stone Tag */}
                <div className="absolute top-3 left-3 bg-[var(--color-brand-gold)] text-[var(--color-brand-emerald-dark)] px-2 py-1 font-sans text-[9px] uppercase tracking-widest font-bold">
                  {product.stone}
                </div>
              </div>
              <h3 className="font-serif text-lg leading-snug text-[var(--color-brand-emerald-dark)] group-hover:text-[var(--color-brand-gold)] transition-colors mb-2 line-clamp-2 min-h-[3rem]">
                {product.name}
              </h3>
              <p className="font-serif text-lg italic text-[var(--color-brand-emerald-dark)]/80 mt-auto">
                ${product.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
