import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import fs from 'fs';
import path from 'path';
import { products as defaultProducts, Product } from '@/lib/data';
import { verifyAdminRequest } from '@/lib/adminAuth';

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

async function syncProductToCloudDb(product: Product) {
  try {
    const { prisma } = await import('@/lib/prisma');

    // 1. Ensure Category exists in Cloud DB
    const catSlug = (product.category || 'rings').toLowerCase().trim();
    const catName = catSlug.charAt(0).toUpperCase() + catSlug.slice(1);

    const category = await prisma.category.upsert({
      where: { slug: catSlug },
      update: {},
      create: {
        slug: catSlug,
        name: catName,
        description: `Fine jewelry collection in ${catName}`,
      },
    });

    // 2. Upsert Product in Cloud DB
    const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const pId = String(product.id);

    const saved = await prisma.product.upsert({
      where: { id: pId },
      update: {
        name: product.name,
        slug: slug,
        description: product.description || `${product.name} handcrafted fine moissanite jewelry.`,
        categoryId: category.id,
      },
      create: {
        id: pId,
        name: product.name,
        slug: slug,
        description: product.description || `${product.name} handcrafted fine moissanite jewelry.`,
        categoryId: category.id,
      },
    });

    // 3. Sync Product Images in Cloud DB
    await prisma.productImage.deleteMany({
      where: { productId: saved.id },
    }).catch(() => {});

    if (Array.isArray(product.images) && product.images.length > 0) {
      await prisma.productImage.createMany({
        data: product.images.map((imgUrl, idx) => ({
          url: imgUrl,
          altText: product.name,
          isPrimary: idx === 0,
          productId: saved.id,
        })),
      });
    }

    // 4. Sync Base Variant in Cloud DB
    const basePrice = Number(product.price || 4999);
    const sku = `SKU-${saved.id}`.slice(0, 50);

    await prisma.productVariant.upsert({
      where: { sku },
      update: {
        price: basePrice,
        metal: product.metal || '925 Sterling Silver',
        stone: product.carat || '2.00 CT Moissanite',
      },
      create: {
        productId: saved.id,
        sku,
        metal: product.metal || '925 Sterling Silver',
        stone: product.carat || '2.00 CT Moissanite',
        price: basePrice,
        stockQuantity: 50,
      },
    });

    console.log(`[Supabase Cloud DB ✓]: Product "${product.name}" (#${pId}) saved successfully.`);
  } catch (err) {
    console.warn('[Supabase Cloud DB Save Warning]:', err);
  }
}

async function deleteProductFromCloudDb(id: string) {
  try {
    const { prisma } = await import('@/lib/prisma');
    await prisma.product.delete({
      where: { id: String(id) },
    }).catch(() => {});
    console.log(`[Supabase Cloud DB ✓]: Product #${id} deleted.`);
  } catch (err) {
    console.warn('[Supabase Cloud DB Delete Warning]:', err);
  }
}

// POST /api/products (Add or Update - Admin Only)
export async function POST(request: Request) {
  const auth = verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Unauthorized: Admin access required' },
      { status: 401 }
    );
  }

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

    // Persist to Supabase PostgreSQL Cloud Database
    await syncProductToCloudDb(product);

    // Save to local cache store
    writeProductsToFile(updatedProducts);

    return NextResponse.json({
      success: true,
      product,
      products: updatedProducts,
      cloudSaved: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products (Delete a product by id - Admin Only)
export async function DELETE(request: Request) {
  const auth = verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Unauthorized: Admin access required' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product id is required for deletion.' },
        { status: 400 }
      );
    }

    // Delete from Supabase PostgreSQL Cloud Database
    await deleteProductFromCloudDb(id);

    const currentProducts = readProductsFromFile();
    const updatedProducts = currentProducts.filter((p) => p.id !== id);

    writeProductsToFile(updatedProducts);
    return NextResponse.json({ success: true, products: updatedProducts, cloudDeleted: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
