import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Order } from '@/lib/types/order';

const ordersFilePath = path.join(process.cwd(), 'src', 'lib', 'orders-store.json');

// Read orders from file
function readOrdersFromFile(): Order[] {
  try {
    if (fs.existsSync(ordersFilePath)) {
      const data = fs.readFileSync(ordersFilePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error reading orders file:', error);
  }
  return [];
}

// Write orders to file
function writeOrdersToFile(orders: Order[]): boolean {
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing orders file:', error);
    return false;
  }
}

// Helper: Format WhatsApp order message
export function formatWhatsAppOrderMessage(order: Order): string {
  const itemsText = (order.items || [])
    .map((it: any, idx) => {
      const name = it.productName || it.product?.name || 'Jewelry Piece';
      const metal = it.metal || it.selectedMetal || 'Fine Metal';
      const size = it.size || it.selectedSize || 'Standard';
      const carat = it.carat || it.selectedCarat || '';
      const qty = it.quantity || 1;
      const unitPrice = Number(it.unitPrice ?? it.price ?? 0);
      return `${idx + 1}. *${name}*\n   • Metal: ${metal}\n   • Size: ${size}${carat ? ` | Carat: ${carat}` : ''}\n   • Qty: ${qty} × ${order.currencySymbol || '$'}${unitPrice.toLocaleString()}`;
    })
    .join('\n\n');

  const paymentText =
    order.payment?.method === 'paypal'
      ? `✅ Paid via PayPal (Txn: ${order.payment.transactionId || 'Verified'})`
      : order.payment?.method === 'card'
      ? `✅ Paid via Card (Txn: ${order.payment.transactionId || 'Verified'})`
      : order.payment?.method === 'payoneer'
      ? `⏳ Payoneer Transfer (Ref: ${order.payment.payoneerReference || 'Pending verification'})`
      : order.payment?.method === 'bank_transfer'
      ? `🏦 Bank / UPI Transfer (Ref: ${order.payment.bankReference || 'Pending verification'})`
      : `💬 WhatsApp Quick Order`;

  const totalNum = Number(order.total ?? 0);
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString();

  return encodeURIComponent(
    `*✨ NEW ORDER RECEIVED — #${order.id}*\n\n` +
      `👤 *CUSTOMER DETAILS:*\n` +
      `• Name: ${order.customer?.firstName || ''} ${order.customer?.lastName || ''}\n` +
      `• Phone: ${order.customer?.phone || ''}\n` +
      `• Email: ${order.customer?.email || ''}\n\n` +
      `📍 *SHIPPING ADDRESS:*\n` +
      `• Address: ${order.customer?.streetAddress || ''}${order.customer?.apartment ? `, ${order.customer.apartment}` : ''}\n` +
      `• City: ${order.customer?.city || ''}, ${order.customer?.state || ''} ${order.customer?.postalCode || ''}\n` +
      `• Country: ${order.customer?.country || ''}\n\n` +
      `💍 *ORDER ITEMS:*\n${itemsText}\n\n` +
      `💵 *TOTAL: ${order.currencySymbol || '$'}${totalNum.toLocaleString()} ${order.currency || 'USD'}*\n` +
      `💳 *PAYMENT: ${paymentText}*\n\n` +
      `📅 *Date:* ${orderDate}\n` +
      `🌐 *ForeverJewellStudio Online Store*`
  );
}

// GET /api/orders — Fetch orders list (latest first from Supabase, fallback to JSON)
export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma');
    const dbOrders = await prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    if (dbOrders && dbOrders.length > 0) {
      const localOrders = readOrdersFromFile();
      const localMap = new Map(localOrders.map((o) => [o.id, o]));

      const mappedOrders: Order[] = dbOrders.map((o) => {
        const local = localMap.get(o.id);
        const addr = (o.shippingAddress as any) || local?.customer || {};
        // Prefer orderItemsJson from Supabase (persistent), fallback to local JSON backup
        const dbItems = (o as any).orderItemsJson;
        const items = Array.isArray(dbItems) && dbItems.length > 0 ? dbItems : (local?.items || []);
        return {
          id: o.id,
          createdAt: o.createdAt.toISOString(),
          customer: addr,
          items,
          currency: (o as any).currency || local?.currency || 'USD',
          currencySymbol: (o as any).currencySymbol || local?.currencySymbol || '$',
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

      return NextResponse.json({ success: true, orders: mappedOrders });
    }
  } catch (dbErr) {
    console.warn('Supabase read warning, using local file store:', dbErr);
  }

  const orders = readOrdersFromFile();
  return NextResponse.json({
    success: true,
    orders: orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
  });
}

// POST /api/orders — Create new customer order (saves to Supabase & local store)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, currency, currencySymbol, subtotal, shippingFee, total, payment } = body;

    // Validation
    if (!customer || !customer.firstName || !customer.email || !customer.phone || !customer.streetAddress) {
      return NextResponse.json(
        { success: false, error: 'Incomplete shipping address or contact info.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot create an order with an empty cart.' },
        { status: 400 }
      );
    }

    // Generate human-friendly ID: FJ-XXXXXX
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `FJ-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer,
      items,
      currency: currency || 'USD',
      currencySymbol: currencySymbol || '$',
      subtotal: subtotal || total,
      shippingFee: shippingFee || 0,
      total: total,
      payment: payment || {
        method: 'whatsapp',
        status: 'pending',
      },
      orderStatus: payment?.status === 'paid' ? 'confirmed' : 'pending',
    };

    // Save to Supabase Cloud Database (Prisma)
    try {
      const { prisma } = await import('@/lib/prisma');
      const phone = String(customer.phone || '').trim();
      const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
      const email = String(customer.email || '').trim();

      // Robust user lookup that avoids unique constraint collisions on phone/email
      let userId: string | null = null;
      try {
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              ...(phone ? [{ phone }] : []),
              ...(email ? [{ email }] : []),
            ],
          },
        });

        if (existingUser) {
          userId = existingUser.id;
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: fullName || existingUser.name,
              email: email || existingUser.email,
              phone: phone || existingUser.phone,
            },
          }).catch(() => {});
        } else {
          const newUser = await prisma.user.create({
            data: { phone: phone || `guest_${orderId}`, name: fullName, email: email || null },
          });
          userId = newUser.id;
        }
      } catch (userErr) {
        console.warn('Customer user lookup warning:', userErr);
      }

      await prisma.order.create({
        data: {
          id: orderId,
          userId: userId,
          totalAmount: total,
          status: payment?.status === 'paid' ? 'PROCESSING' : 'PENDING',
          paymentStatus: payment?.status === 'paid' ? 'SUCCESS' : 'PENDING',
          paymentId: payment?.transactionId || payment?.bankReference || payment?.payoneerReference || null,
          shippingAddress: customer as any,
          orderItemsJson: items as any,
          currency: currency || 'USD',
          currencySymbol: currencySymbol || '$',
        },
      });
      console.log(`[Supabase] Order #${orderId} saved to cloud database!`);
    } catch (dbErr) {
      console.error('[Supabase Save Error]:', dbErr);
    }

    // Also persist to local backup store
    const currentOrders = readOrdersFromFile();
    const updatedOrders = [newOrder, ...currentOrders];
    writeOrdersToFile(updatedOrders);

    const waEncodedMessage = formatWhatsAppOrderMessage(newOrder);
    const clientPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918387072406';
    const waUrl = `https://wa.me/${clientPhone}?text=${waEncodedMessage}`;

    // Dispatch email notifications (customer + admin) - AWAIT so Vercel doesn't freeze the execution context
    try {
      const { sendOrderNotifications } = await import('@/lib/notifications');
      const forwardedHost = request.headers.get('x-forwarded-host');
      const host = forwardedHost || request.headers.get('host');
      const proto = request.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
      const origin = host
        ? `${proto}://${host}`
        : (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
            ? process.env.NEXT_PUBLIC_SITE_URL
            : new URL(request.url).origin);

      await sendOrderNotifications({ order: newOrder, siteUrl: origin });
    } catch (notifErr) {
      console.warn('Failed to dispatch notifications:', notifErr);
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
      whatsAppUrl: waUrl,
      whatsAppText: decodeURIComponent(waEncodedMessage),
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders — Update order status / tracking info (Admin)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, orderStatus, trackingNumber, carrier, notes, paymentStatus } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const currentOrders = readOrdersFromFile();
    const orderIdx = currentOrders.findIndex((o) => o.id === id);

    if (orderIdx === -1) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const targetOrder = { ...currentOrders[orderIdx] };
    if (orderStatus) targetOrder.orderStatus = orderStatus;
    if (trackingNumber !== undefined) targetOrder.trackingNumber = trackingNumber;
    if (carrier !== undefined) targetOrder.carrier = carrier;
    if (notes !== undefined) targetOrder.notes = notes;
    if (paymentStatus && targetOrder.payment) {
      targetOrder.payment.status = paymentStatus;
    }

    currentOrders[orderIdx] = targetOrder;
    writeOrdersToFile(currentOrders);

    return NextResponse.json({
      success: true,
      order: targetOrder,
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}
