import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = 'INR', customer, items } = body;

    const keyId = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay API keys not configured on server' },
        { status: 500 }
      );
    }

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Amount in paise (e.g. ₹5000 -> 500000 paise). Minimum is ₹1 (100 paise)
    const numericAmount = Math.max(1, Math.round(Number(amount || 0)));
    const amountInPaise = numericAmount * 100;

    const receipt = `rcpt_${Date.now().toString().slice(-8)}`;

    const options = {
      amount: amountInPaise,
      currency: (currency || 'INR').toUpperCase(),
      receipt,
      notes: {
        customerName: `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim(),
        customerEmail: customer?.email || '',
        customerPhone: customer?.phone || '',
        itemsCount: String(items?.length || 1),
      },
    };

    const razorpayOrder = await instance.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId,
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json(
      { error: error?.error?.description || error?.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}

