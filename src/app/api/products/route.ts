import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { products as defaultProducts, Product } from '@/lib/data';

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'products-store.json');

// Helper to read products
function readProductsFromFile(): Product[] {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error reading products file, falling back to defaults:', error);
  }
  return defaultProducts;
}

// Helper to write products
function writeProductsToFile(products: Product[]): boolean {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing products file:', error);
    return false;
  }
}

// GET /api/products — Live from Supabase PostgreSQL (Cloud Database) with fallback
export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma');
    const dbProducts = await prisma.product.findMany({
      include: { images: true, variants: true, category: true },
      orderBy: { createdAt: 'desc' },
    });

    if (dbProducts && dbProducts.length > 0) {
      const fileProducts = readProductsFromFile();
      const fileMap = new Map(fileProducts.map((p) => [p.id, p]));

      // Merge Supabase DB items with rich metadata (shapes, tags, badges)
      const merged: Product[] = dbProducts.map((p) => {
        const cached = fileMap.get(p.id);
        const primaryVariant = p.variants?.[0];
        const price = primaryVariant ? Number(primaryVariant.price) : (cached?.price || 4999);
        const images = p.images?.length > 0 ? p.images.map((im) => im.url) : (cached?.images || ['/images/ai_ring1_front.jpg']);

        if (cached) {
          return {
            ...cached,
            price: price || cached.price,
            images: images.length > 0 ? images : cached.images,
          };
        }

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          category: p.category?.slug || 'rings',
          shape: 'Round',
          price,
          originalPrice: Math.round(price * 1.8),
          carat: primaryVariant?.stone || '2.00 CT',
          clarity: 'VVS1',
          colorGrade: 'D Color',
          cut: 'Brilliant Cut',
          certification: 'GRA Certified with Authenticity Card',
          badge: 'BESTSELLER',
          rating: 4.9,
          reviewsCount: 52,
          metal: primaryVariant?.metal || '925 Sterling Silver',
          images,
          features: [
            'Handcrafted by master artisans at foreverjewellstudio',
            'GRA Certified with Authenticity Card & Warranty',
            'Arrives in Signature Luxury Ring Box',
            'Free Express Insured Delivery',
          ],
          readyToShip: true,
          variants: p.variants?.map((v) => ({
            metal: v.metal,
            colorCode: v.metal.toLowerCase().includes('rose') ? '#FB7185' : v.metal.toLowerCase().includes('yellow') ? '#CA8A04' : '#E5E7EB',
            image: images[0] || '/images/ai_ring1_front.jpg',
          })) || [],
        };
      });

      return NextResponse.json({ success: true, products: merged, source: 'supabase-cloud' });
    }
  } catch (dbErr) {
    console.warn('Supabase DB fetch failed, using stored catalog:', dbErr);
  }

  const currentProducts = readProductsFromFile();
  return NextResponse.json({ success: true, products: currentProducts, source: 'file-store' });
}

// POST /api/products (Add or Update)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product, resetToDefault } = body;

    if (resetToDefault) {
      writeProductsToFile(defaultProducts);
      return NextResponse.json({ success: true, products: defaultProducts });
    }

    if (!product || !product.id || !product.name) {
      return NextResponse.json(
        { success: false, error: 'Product must have an id and name.' },
        { status: 400 }
      );
    }

    const currentProducts = readProductsFromFile();
    const existingIndex = currentProducts.findIndex((p) => p.id === product.id || p.slug === product.slug);

    let updatedProducts: Product[];
    if (existingIndex >= 0) {
      // Update existing product
      updatedProducts = [...currentProducts];
      updatedProducts[existingIndex] = { ...updatedProducts[existingIndex], ...product };
    } else {
      // Add new product to top of list
      updatedProducts = [product, ...currentProducts];
    }

    writeProductsToFile(updatedProducts);
    return NextResponse.json({ success: true, products: updatedProducts });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products (Delete a product by id)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product id is required for deletion.' },
        { status: 400 }
      );
    }

    const currentProducts = readProductsFromFile();
    const updatedProducts = currentProducts.filter((p) => p.id !== id);

    writeProductsToFile(updatedProducts);
    return NextResponse.json({ success: true, products: updatedProducts });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
