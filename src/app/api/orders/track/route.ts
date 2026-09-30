import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Order, ShippingAddress } from '@/lib/types/order';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

// Helper to mask customer PII on public tracking responses
function maskCustomerPII(customer: any): ShippingAddress {
  const c = customer || {};
  const fn = String(c.firstName || 'Customer');
  const ln = String(c.lastName || '');
  const maskedLastName = ln.length > 0 ? `${ln[0]}.` : '';
  const email = String(c.email || '');
  const [user, domain] = email.split('@');
  const maskedEmail = user && domain
    ? `${user.slice(0, 2)}***@${domain}`
    : '***@***.com';

  const rawPhone = String(c.phone || '').replace(/[^0-9]/g, '');
  const maskedPhone = rawPhone.length > 4
    ? `••••••${rawPhone.slice(-4)}`
    : '••••••••';

  return {
    firstName: fn,
    lastName: maskedLastName,
    email: maskedEmail,
    phone: maskedPhone,
    city: String(c.city || ''),
    state: String(c.state || ''),
    country: String(c.country || ''),
    postalCode: c.postalCode ? `•••${String(c.postalCode).slice(-2)}` : '',
    streetAddress: '•••••••••••• (Hidden for privacy)',
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || searchParams.get('orderId') || searchParams.get('email') || '').trim().toLowerCase();

    if (!query || query.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid Order ID (e.g. #FJ-123456) or Email address (at least 3 characters).' },
        { status: 400 }
      );
    }

    const cleanId = query.replace(/^#/, '').replace(/^fj-/, '').trim();
    if (!cleanId && !query.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid Order ID or Email address.' },
        { status: 400 }
      );
    }

    let matched: Order[] = [];

    // 1. Try querying Supabase Cloud Database first
    try {
      const { prisma } = await import('@/lib/prisma');
      const conditions: any[] = [];

      if (cleanId.length >= 4) {
        conditions.push({ id: { contains: cleanId, mode: 'insensitive' } });
      }
      if (query.includes('@')) {
        conditions.push({ user: { email: { equals: query, mode: 'insensitive' } } });
      }
      const rawDigits = query.replace(/[^0-9]/g, '');
      if (rawDigits.length >= 7) {
        conditions.push({ user: { phone: { contains: rawDigits } } });
      }

      if (conditions.length > 0) {
        const dbOrders = await prisma.order.findMany({
          where: { OR: conditions },
          include: { user: true },
          orderBy: { createdAt: 'desc' },
          take: 10, // Prevent unbounded memory dumps
        });

        if (dbOrders && dbOrders.length > 0) {
          const localOrders = readOrders();
          const localMap = new Map(localOrders.map((o) => [o.id, o]));

          matched = dbOrders.map((o) => {
            const local = localMap.get(o.id);
            const addr = (o.shippingAddress as any) || local?.customer || {};
            const dbItems = (o as any).orderItemsJson;
            const items = Array.isArray(dbItems) && dbItems.length > 0 ? dbItems : (local?.items || []);

            const exactStatus = addr._orderStatus || (
              o.status === 'SHIPPED' ? 'shipped' :
              o.status === 'DELIVERED' ? 'delivered' :
              o.status === 'CANCELLED' ? 'cancelled' :
              o.status === 'PROCESSING' ? 'confirmed' : 'pending'
            );
            const trackingNumber = addr._trackingNumber || local?.trackingNumber || undefined;
            const carrier = addr._carrier || local?.carrier || undefined;

            return {
              id: o.id,
              createdAt: o.createdAt.toISOString(),
              customer: maskCustomerPII(addr),
              items,
              currency: (o as any).currency || local?.currency || 'USD',
              currencySymbol: (o as any).currencySymbol || local?.currencySymbol || '$',
              subtotal: Number(o.totalAmount),
              shippingFee: 0,
              total: Number(o.totalAmount),
              payment: {
                method: (addr as any)?.paymentMethod || 'paypal',
                status: o.paymentStatus === 'SUCCESS' ? 'paid' : 'pending',
              },
              orderStatus: exactStatus,
              trackingNumber,
              carrier,
            };
          });
        }
      }
    } catch (e) {
      console.warn('[Supabase Track Warning]:', e);
    }

    // 2. Fallback / supplement with local JSON store
    if (matched.length === 0) {
      const allOrders = readOrders();
      const rawDigits = query.replace(/[^0-9]/g, '');

      matched = allOrders.filter((order) => {
        const orderIdLower = order.id.toLowerCase();
        const customerEmail = (order.customer?.email || '').toLowerCase();
        const customerPhone = (order.customer?.phone || '').replace(/[^0-9]/g, '');

        const idMatch = cleanId.length >= 4 && (orderIdLower === query || orderIdLower.includes(cleanId));
        const emailMatch = query.includes('@') && customerEmail === query;
        const phoneMatch = rawDigits.length >= 7 && customerPhone.includes(rawDigits);

        return idMatch || emailMatch || phoneMatch;
      }).map((order) => ({
        ...order,
        customer: maskCustomerPII(order.customer),
      }));
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
