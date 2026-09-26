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

// GET /api/products
export async function GET() {
  const currentProducts = readProductsFromFile();
  return NextResponse.json({ success: true, products: currentProducts });
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
