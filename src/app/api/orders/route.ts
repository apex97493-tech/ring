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
  const itemsText = order.items
    .map(
      (it, idx) =>
        `${idx + 1}. *${it.productName}*\n   • Metal: ${it.metal}\n   • Size: ${it.size}${it.carat ? ` | Carat: ${it.carat}` : ''}\n   • Qty: ${it.quantity} × ${order.currencySymbol}${it.unitPrice.toLocaleString()}`
    )
    .join('\n\n');

  const paymentText =
    order.payment.method === 'paypal'
      ? `✅ Paid via PayPal (Txn: ${order.payment.transactionId || 'Verified'})`
      : order.payment.method === 'card'
      ? `✅ Paid via Card (Txn: ${order.payment.transactionId || 'Verified'})`
      : order.payment.method === 'payoneer'
      ? `⏳ Payoneer Transfer (Ref: ${order.payment.payoneerReference || 'Pending verification'})`
      : `💬 WhatsApp Quick Order`;

  return encodeURIComponent(
    `*✨ NEW ORDER RECEIVED — #${order.id}*\n\n` +
      `👤 *CUSTOMER DETAILS:*\n` +
      `• Name: ${order.customer.firstName} ${order.customer.lastName}\n` +
      `• Phone: ${order.customer.phone}\n` +
      `• Email: ${order.customer.email}\n\n` +
      `📍 *SHIPPING ADDRESS:*\n` +
      `• Address: ${order.customer.streetAddress}${order.customer.apartment ? `, ${order.customer.apartment}` : ''}\n` +
      `• City: ${order.customer.city}, ${order.customer.state || ''} ${order.customer.postalCode}\n` +
      `• Country: ${order.customer.country}\n\n` +
      `💍 *ORDER ITEMS:*\n${itemsText}\n\n` +
      `💵 *TOTAL: ${order.currencySymbol}${order.total.toLocaleString()} ${order.currency}*\n` +
      `💳 *PAYMENT: ${paymentText}*\n\n` +
      `📅 *Date:* ${new Date(order.createdAt).toLocaleString()}\n` +
      `🌐 *ForeverJewellStudio Online Store*`
  );
}

// GET /api/orders — Fetch orders list (latest first)
export async function GET() {
  const orders = readOrdersFromFile();
  return NextResponse.json({
    success: true,
    orders: orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
  });
}

// POST /api/orders — Create new customer order
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

    const currentOrders = readOrdersFromFile();
    const updatedOrders = [newOrder, ...currentOrders];
    writeOrdersToFile(updatedOrders);

    const waEncodedMessage = formatWhatsAppOrderMessage(newOrder);
    const clientPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
    const waUrl = `https://wa.me/${clientPhone}?text=${waEncodedMessage}`;

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
