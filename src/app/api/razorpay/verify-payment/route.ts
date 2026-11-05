import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Order, OrderItem, ShippingAddress } from '@/lib/types/order';
import { formatWhatsAppOrderMessage } from '@/app/api/orders/route';

export const dynamic = 'force-dynamic';

const ordersFilePath = path.join(process.cwd(), 'src', 'lib', 'orders-store.json');

function readOrdersFromFile(): Order[] {
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

function writeOrdersToFile(orders: Order[]): boolean {
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing orders file:', error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      items,
      currency,
      currencySymbol,
      total,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing Razorpay payment verification parameters' },
        { status: 400 }
      );
    }

    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
    if (!keySecret) {
      return NextResponse.json(
        { error: 'Razorpay secret key not configured on server' },
        { status: 500 }
      );
    }

    // 1. Verify HMAC SHA-256 signature
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('[Razorpay Verify Error]: Signature mismatch', {
        expected: expectedSignature,
        received: razorpay_signature,
      });
      return NextResponse.json(
        { error: 'Payment verification failed: Invalid transaction signature' },
        { status: 400 }
      );
    }

    // 2. Check if already recorded under this payment ID
    const existingOrders = readOrdersFromFile();
    const existingByPayment = existingOrders.find(
      (o) =>
        o.payment?.transactionId === razorpay_payment_id ||
        o.payment?.razorpayPaymentId === razorpay_payment_id
    );

    if (existingByPayment) {
      const clientPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919828930454';
      const message = formatWhatsAppOrderMessage(existingByPayment);
      const whatsAppUrl = `https://wa.me/${clientPhone}?text=${message}`;
      return NextResponse.json({
        success: true,
        order: existingByPayment,
        whatsAppUrl,
        alreadyProcessed: true,
      });
    }

    // 3. Format customer and items
    const finalCustomer: ShippingAddress = {
      firstName: (customer?.firstName || 'Valued').trim(),
      lastName: (customer?.lastName || 'Customer').trim(),
      email: (customer?.email || '').trim(),
      phone: (customer?.phone || '').trim(),
      streetAddress: (customer?.streetAddress || '').trim(),
      apartment: (customer?.apartment || '').trim(),
      city: (customer?.city || '').trim(),
      state: (customer?.state || '').trim(),
      postalCode: (customer?.postalCode || '').trim(),
      country: (customer?.country || 'India').trim(),
    };

    const finalItems: OrderItem[] = Array.isArray(items) && items.length > 0
      ? items.map((it: any) => {
          const qty = Number(it.quantity || 1);
          const unitPrice = Number(it.price || it.unitPrice || 0);
          return {
            productId: String(it.productId || it.product?.id || 'FJ-ITEM'),
            productName: String(it.productName || it.product?.name || 'Handcrafted Moissanite Ring'),
            productSlug: String(it.productSlug || it.product?.slug || ''),
            metal: String(it.metal || it.selectedMetal || 'Solid Gold / Silver'),
            size: String(it.size || it.selectedSize || 'US 7'),
            carat: it.carat || it.selectedCarat || it.product?.carat,
            engraving: it.engraving || it.engravingText,
            quantity: qty,
            unitPrice: unitPrice,
            totalPrice: Number(it.totalPrice ?? unitPrice * qty),
            image: it.image || it.product?.images?.[0] || '',
          };
        })
      : [];

    const orderNumber = `FJ-${Date.now().toString().slice(-6)}`;
    const finalTotal = Number(total || 0);

    const newOrder: Order = {
      id: orderNumber,
      customer: finalCustomer,
      items: finalItems,
      currency: currency || 'INR',
      currencySymbol: currencySymbol || '₹',
      subtotal: finalTotal,
      shippingFee: 0,
      total: finalTotal,
      payment: {
        method: 'razorpay',
        status: 'paid',
        transactionId: razorpay_payment_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      },
      orderStatus: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // 4. Save to Supabase Cloud Database (Prisma)
    try {
      const { prisma } = await import('@/lib/prisma');
      const phone = String(finalCustomer.phone || '9999999999').trim();
      const fullName = `${finalCustomer.firstName} ${finalCustomer.lastName}`.trim();
      const email = String(finalCustomer.email || '').trim();

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
            data: { phone, name: fullName, email: email || null },
          });
          userId = newUser.id;
        }
      } catch (userErr) {
        console.warn('Razorpay user lookup warning:', userErr);
      }

      await prisma.order.create({
        data: {
          id: orderNumber,
          userId: userId,
          totalAmount: finalTotal,
          status: 'PROCESSING',
          paymentStatus: 'SUCCESS',
          paymentId: razorpay_payment_id,
          shippingAddress: finalCustomer as any,
          orderItemsJson: finalItems as any,
          currency: currency || 'INR',
          currencySymbol: currencySymbol || '₹',
        },
      });
      console.log(`[Supabase] Razorpay Order #${orderNumber} successfully saved to cloud database!`);
    } catch (dbErr) {
      console.error('[Supabase Save Error]:', dbErr);
    }

    // 5. Save to local fallback store
    const orders = readOrdersFromFile();
    orders.unshift(newOrder);
    writeOrdersToFile(orders);

    // 6. Generate WhatsApp link
    const clientPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919828930454';
    const message = formatWhatsAppOrderMessage(newOrder);
    const whatsAppUrl = `https://wa.me/${clientPhone}?text=${message}`;

    // 7. Dispatch email notifications (customer + store owner)
    try {
      const { sendOrderNotifications } = await import('@/lib/notifications');
      const forwardedHost = req.headers.get('x-forwarded-host');
      const host = forwardedHost || req.headers.get('host');
      const proto = req.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
      const origin = host
        ? `${proto}://${host}`
        : (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
            ? process.env.NEXT_PUBLIC_SITE_URL
            : new URL(req.url).origin);

      await sendOrderNotifications({ order: newOrder, siteUrl: origin });
    } catch (notifErr) {
      console.warn('Failed to dispatch Razorpay notifications:', notifErr);
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
      whatsAppUrl,
    });
  } catch (error: any) {
    console.error('Server Razorpay Verify Payment Exception:', error);
    return NextResponse.json(
      { error: error?.message || 'Server error verifying Razorpay payment' },
      { status: 500 }
    );
  }
}

