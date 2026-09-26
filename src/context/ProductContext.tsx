'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { products as defaultProducts, Product, findMatchingProduct } from '@/lib/data';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Product) => Promise<boolean>;
  updateProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  resetToDefaults: () => Promise<boolean>;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

function deduplicateProducts(list: Product[]): Product[] {
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const result: Product[] = [];
  for (const item of list) {
    if (!item || !item.id) continue;
    if (seenIds.has(item.id) || (item.slug && seenSlugs.has(item.slug))) continue;
    seenIds.add(item.id);
    if (item.slug) seenSlugs.add(item.slug);
    result.push(item);
  }
  return result;
}

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(deduplicateProducts(defaultProducts));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch products from API and fall back to local storage
  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          const clean = deduplicateProducts(data.products);
          setProducts(clean);
          localStorage.setItem('aura_custom_products', JSON.stringify(clean));
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Could not fetch from /api/products, falling back to local storage', err);
    }

    // Fallback: check localStorage
    try {
      const saved = localStorage.getItem('aura_custom_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const clean = deduplicateProducts(parsed);
          setProducts(clean);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error('LocalStorage parse error:', e);
    }

    // Default fallback
    setProducts(deduplicateProducts(defaultProducts));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const addProduct = async (product: Product): Promise<boolean> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
        localStorage.setItem('aura_custom_products', JSON.stringify(data.products));
        return true;
      }
    } catch (error) {
      console.error('Error adding product via API:', error);
    }

    // Client-side fallback
    const updated = [product, ...products.filter((p) => p.id !== product.id && p.slug !== product.slug)];
    setProducts(updated);
    localStorage.setItem('aura_custom_products', JSON.stringify(updated));
    return true;
  };

  const updateProduct = async (product: Product): Promise<boolean> => {
    return addProduct(product);
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
        localStorage.setItem('aura_custom_products', JSON.stringify(data.products));
        return true;
      }
    } catch (error) {
      console.error('Error deleting product via API:', error);
    }

    // Client-side fallback
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('aura_custom_products', JSON.stringify(updated));
    return true;
  };

  const resetToDefaults = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToDefault: true }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
        localStorage.setItem('aura_custom_products', JSON.stringify(data.products));
        return true;
      }
    } catch (error) {
      console.error('Error resetting products via API:', error);
    }

    setProducts(defaultProducts);
    localStorage.setItem('aura_custom_products', JSON.stringify(defaultProducts));
    return true;
  };

  const getProductBySlug = useCallback(
    (slug: string): Product | undefined => {
      return findMatchingProduct(products, slug);
    },
    [products]
  );

  const getProductsByCategory = useCallback(
    (category: string): Product[] => {
      if (category === 'all' || category === 'shop') return products;
      return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    },
    [products]
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefaults,
        getProductBySlug,
        getProductsByCategory,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
