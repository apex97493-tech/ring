import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Order } from '@/lib/types/order';

const ordersFilePath = path.join(process.cwd(), 'src', 'lib', 'orders-store.json');

function readOrders(): Order[] {
  try {
    if (fs.existsSync(ordersFilePath)) {
      const data = fs.readFileSync(ordersFilePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error('Error reading orders file:', error);
  }
  return [];
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || searchParams.get('orderId') || searchParams.get('email') || '').trim().toLowerCase();

    if (!query) {
      return NextResponse.json({ success: false, error: 'Please enter an Order ID or Email address.' }, { status: 400 });
    }

    const cleanId = query.replace(/^#/, '').replace(/^fj-/, '').toLowerCase();
    let matched: Order[] = [];

    // 1. Try querying Supabase Cloud Database first
    try {
      const { prisma } = await import('@/lib/prisma');
      const dbOrders = await prisma.order.findMany({
        where: {
          OR: [
            { id: { contains: cleanId, mode: 'insensitive' } },
            { user: { email: { contains: query, mode: 'insensitive' } } },
            { user: { phone: { contains: query.replace(/[^0-9]/g, '') } } },
          ],
        },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });

      if (dbOrders && dbOrders.length > 0) {
        const localOrders = readOrders();
        const localMap = new Map(localOrders.map((o) => [o.id, o]));

        matched = dbOrders.map((o) => {
          const local = localMap.get(o.id);
          const addr = (o.shippingAddress as any) || local?.customer || {};
          return {
            id: o.id,
            createdAt: o.createdAt.toISOString(),
            customer: addr,
            items: local?.items || [],
            currency: local?.currency || 'USD',
            currencySymbol: local?.currencySymbol || '$',
            subtotal: Number(o.totalAmount),
            shippingFee: 0,
            total: Number(o.totalAmount),
            payment: local?.payment || {
              method: 'paypal',
              status: o.paymentStatus === 'SUCCESS' ? 'paid' : 'pending',
              transactionId: o.paymentId || undefined,
            },
            orderStatus: o.status === 'PROCESSING' ? 'confirmed' : (o.status.toLowerCase() as any),
          };
        });
      }
    } catch (e) {
      console.warn('[Supabase Track Warning]:', e);
    }

    // 2. Fallback / supplement with local JSON store
    if (matched.length === 0) {
      const allOrders = readOrders();
      matched = allOrders.filter((order) => {
        const orderIdLower = order.id.toLowerCase();
        const customerEmail = (order.customer?.email || '').toLowerCase();
        const customerPhone = (order.customer?.phone || '').replace(/[^0-9]/g, '');
        const queryPhone = query.replace(/[^0-9]/g, '');

        return (
          orderIdLower === query ||
          orderIdLower.includes(cleanId) ||
          customerEmail === query ||
          customerEmail.includes(query) ||
          (queryPhone.length >= 7 && customerPhone.includes(queryPhone))
        );
      });
    }

    if (matched.length === 0) {
      return NextResponse.json({
        success: false,
        error: `No order found matching "${query}". Please verify your Order ID (e.g. #FJ-123456) or the email used during checkout.`,
      });
    }

    return NextResponse.json({
      success: true,
      orders: matched,
    });
  } catch (err: any) {
    console.error('Track order error:', err);
    return NextResponse.json({ success: false, error: 'Server error looking up order.' }, { status: 500 });
  }
}
