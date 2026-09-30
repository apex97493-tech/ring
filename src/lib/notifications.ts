import { Order } from '@/lib/types/order';

interface SendOrderNotificationOptions {
  order: Order;
  siteUrl?: string;
}

/**
 * Generate luxury branded HTML receipt for the Customer
 */
export function generateCustomerEmailHtml(order: Order, siteUrl: string): string {
  const itemsRows = order.items
    .map((item) => {
      const unitPrice = Number(item.unitPrice || 0);
      const totalPrice = Number(item.totalPrice || unitPrice * item.quantity);
      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0ede6; font-size: 14px; color: #1f2937;">
            <strong>${item.productName}</strong><br/>
            <span style="font-size: 12px; color: #6b7280;">Metal: ${item.metal} | Size: ${item.size} ${item.carat ? `| Carat: ${item.carat}` : ''}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #f0ede6; text-align: center; font-size: 14px; color: #4b5563;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #f0ede6; text-align: right; font-size: 14px; color: #111827; font-weight: 600;">
            ${order.currencySymbol}${totalPrice.toLocaleString()} ${order.currency}
          </td>
        </tr>
      `;
    })
    .join('');

  const trackingLink = `${siteUrl}/track-order?id=${order.id}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - #${order.id}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fdfbf7; margin: 0; padding: 30px 15px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e0d8; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background-color: #18181b; padding: 28px 24px; text-align: center;">
          <h1 style="color: #c5a059; font-size: 20px; font-weight: 400; letter-spacing: 3px; margin: 0; text-transform: uppercase;">Forever Jewell Studio</h1>
          <p style="color: #a1a1aa; font-size: 11px; letter-spacing: 2px; margin: 6px 0 0 0; text-transform: uppercase;">Handcrafted Fine Moissanite Jewelry</p>
        </div>

        <!-- Body -->
        <div style="padding: 30px 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #ecfdf5; color: #064e3b; padding: 6px 16px; border-radius: 9999px; font-size: 13px; font-weight: 600;">
              ✓ Payment Confirmed & Order Placed
            </div>
            <h2 style="color: #111827; font-size: 22px; margin: 16px 0 6px 0;">Thank you, ${order.customer.firstName}!</h2>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">We have received your order <strong>#${order.id}</strong>. Our master artisans have begun preparing your jewelry piece.</p>
          </div>

          <!-- Items Table -->
          <div style="border: 1px solid #f0ede6; border-radius: 6px; overflow: hidden; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr style="background-color: #faf8f5;">
                  <th style="padding: 10px 12px; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 1px;">Item</th>
                  <th style="padding: 10px 12px; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; text-align: center;">Qty</th>
                  <th style="padding: 10px 12px; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 12px; text-align: right; font-size: 14px; color: #4b5563;">Shipping (Express Insured):</td>
                  <td style="padding: 12px; text-align: right; font-size: 14px; color: #064e3b; font-weight: bold;">FREE</td>
                </tr>
                <tr style="background-color: #faf8f5; border-top: 1px solid #e5e0d8;">
                  <td colspan="2" style="padding: 12px; text-align: right; font-size: 16px; font-weight: bold; color: #111827;">Total Paid:</td>
                  <td style="padding: 12px; text-align: right; font-size: 16px; font-weight: bold; color: #111827;">
                    ${order.currencySymbol}${Number(order.total || 0).toLocaleString()} ${order.currency}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Shipping Address -->
          <div style="background-color: #faf8f5; border-radius: 6px; padding: 16px; margin-bottom: 24px; font-size: 13px; color: #374151;">
            <strong style="display: block; color: #111827; margin-bottom: 6px; font-size: 14px;">📍 Shipping To:</strong>
            ${order.customer.firstName} ${order.customer.lastName}<br/>
            ${order.customer.streetAddress}${order.customer.apartment ? `, ${order.customer.apartment}` : ''}<br/>
            ${order.customer.city}, ${order.customer.state || ''} ${order.customer.postalCode}<br/>
            ${order.customer.country}<br/>
            Phone: ${order.customer.phone}
          </div>

          <!-- CTA Buttons -->
          <div style="text-align: center; margin-top: 30px;">
            <a href="${trackingLink}" style="display: inline-block; background-color: #c5a059; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; padding: 14px 28px; border-radius: 4px; box-shadow: 0 2px 6px rgba(197,160,89,0.4);">
              Track Your Order Status
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #faf8f5; border-top: 1px solid #e5e0d8; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
          Questions? Reply to this email or message our artisan concierge on WhatsApp at +91 98289 30454.<br/>
          &copy; ${new Date().getFullYear()} Forever Jewell Studio. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate admin notification email for the Store Owner (You)
 */
export function generateAdminEmailHtml(order: Order, siteUrl: string): string {
  const itemsText = order.items
    .map(
      (it) =>
        `• ${it.productName} (Metal: ${it.metal} | Size: ${it.size} | Qty: ${it.quantity}) - ${order.currencySymbol}${Number(it.totalPrice || 0).toLocaleString()}`
    )
    .join('<br/>');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; background: #f3f4f6; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h2 style="color: #064e3b; margin-top: 0;">🎉 New Order Received: #${order.id}</h2>
        <p style="font-size: 16px; font-weight: bold; color: #111827;">Amount: ${order.currencySymbol}${Number(order.total || 0).toLocaleString()} ${order.currency}</p>
        <p><strong>Payment Method:</strong> ${order.payment.method.toUpperCase()} (${order.payment.status})<br/>
           <strong>Transaction ID:</strong> ${order.payment.transactionId || 'N/A'}</p>
        
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
        
        <h3 style="margin-bottom: 8px;">Customer Information:</h3>
        <p style="margin: 0; line-height: 1.6;">
          <strong>Name:</strong> ${order.customer.firstName} ${order.customer.lastName}<br/>
          <strong>Email:</strong> <a href="mailto:${order.customer.email}">${order.customer.email}</a><br/>
          <strong>Phone:</strong> <a href="tel:${order.customer.phone}">${order.customer.phone}</a><br/>
          <strong>Address:</strong><br/>
          ${order.customer.streetAddress}${order.customer.apartment ? `, ${order.customer.apartment}` : ''}<br/>
          ${order.customer.city}, ${order.customer.state || ''} ${order.customer.postalCode}<br/>
          ${order.customer.country}
        </p>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 16px 0;" />

        <h3 style="margin-bottom: 8px;">Ordered Items:</h3>
        <p style="margin: 0; line-height: 1.8;">${itemsText}</p>

        <div style="margin-top: 24px;">
          <a href="${siteUrl}/burger" style="display: inline-block; background: #18181b; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 13px;">
            Open Admin Dashboard
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Dispatches email notifications to both Customer and Store Owner
 * NOTE: On Resend's free plan (no custom domain), emails can ONLY be sent to your own verified address.
 * We detect this and always ensure the admin gets a full notification including customer details.
 */
export async function sendOrderNotifications({ order, siteUrl = 'https://ring-pearl.vercel.app' }: SendOrderNotificationOptions) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_2FA_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL || 'ash33876@gmail.com';
  const fromEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

  if (!resendApiKey) {
    console.log(`[Notification]: RESEND_API_KEY not configured. Order #${order.id} alert skipped.`);
    return { success: false, reason: 'RESEND_API_KEY_NOT_CONFIGURED' };
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(resendApiKey);

    // 1. Always send admin notification (works on free tier - sends to your own verified email)
    if (adminEmail && adminEmail.includes('@')) {
      try {
        await resend.emails.send({
          from: `Forever Jewell Store Alert <${fromEmail}>`,
          replyTo: order.customer.email || adminEmail,
          to: adminEmail,
          subject: `🎉 NEW ORDER #${order.id} (${order.currencySymbol}${Number(order.total || 0).toLocaleString()} ${order.currency}) - ${order.customer.firstName} ${order.customer.lastName}`,
          html: generateAdminEmailHtml(order, siteUrl),
        });
        console.log(`[Email ✓]: Admin order alert delivered to ${adminEmail}`);
      } catch (adminErr: any) {
        console.error(`[Email ✗]: Admin alert failed:`, adminErr?.message);
      }
    }

    // 2. Try to send confirmation to Customer
    // On free Resend plan (no domain verified), this will only work if customer email = admin email
    // When a custom domain is added to Resend, this will work for all customers automatically
    if (order.customer.email && order.customer.email.includes('@') && order.customer.email !== adminEmail) {
      try {
        const customerResult = await resend.emails.send({
          from: `Forever Jewell Studio <${fromEmail}>`,
          replyTo: adminEmail,
          to: order.customer.email,
          subject: `✨ Order Confirmation #${order.id} - Forever Jewell Studio`,
          html: generateCustomerEmailHtml(order, siteUrl),
        });

        if (customerResult.error) {
          // Domain not verified - send customer receipt to admin instead (CC workaround)
          console.warn(`[Email]: Cannot send to customer ${order.customer.email} - domain not verified. Forwarding receipt to admin.`);
          await resend.emails.send({
            from: `Forever Jewell Studio <${fromEmail}>`,
            to: adminEmail,
            subject: `📋 Customer Receipt (FWD) #${order.id} → Please forward to ${order.customer.email}`,
            html: `
              <div style="background:#fff3cd;padding:16px;border-radius:6px;margin-bottom:20px;font-family:Arial,sans-serif;">
                <strong>⚠️ ACTION REQUIRED:</strong> Please forward this receipt to your customer at 
                <a href="mailto:${order.customer.email}">${order.customer.email}</a> or 
                send it via WhatsApp to ${order.customer.phone}.<br/>
                <small>This happens because your Resend account doesn't have a verified domain yet. 
                Add your domain at <a href="https://resend.com/domains">resend.com/domains</a> to auto-send to all customers.</small>
              </div>
              ${generateCustomerEmailHtml(order, siteUrl)}
            `,
          });
          console.log(`[Email ✓]: Customer receipt forwarded to admin (${adminEmail}) for manual delivery to ${order.customer.email}`);
        } else {
          console.log(`[Email ✓]: Customer receipt delivered to ${order.customer.email}`);
        }
      } catch (custErr: any) {
        console.warn(`[Email]: Customer email skipped:`, custErr?.message);
      }
    } else if (order.customer.email === adminEmail) {
      // Customer is the admin (testing scenario) - already received above
      await resend.emails.send({
        from: `Forever Jewell Studio <${fromEmail}>`,
        to: adminEmail,
        subject: `✨ Order Confirmation #${order.id} - Forever Jewell Studio`,
        html: generateCustomerEmailHtml(order, siteUrl),
      });
      console.log(`[Email ✓]: Customer receipt delivered (same as admin email)`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('[Notification Error]:', error?.message);
    return { success: false, error: error?.message };
  }
}

/**
 * Dispatches status update notification (e.g. Crafting, Shipped, Delivered) to customer
 */
export async function sendOrderStatusUpdateNotification({
  order,
  siteUrl = 'https://ring-pearl.vercel.app',
}: SendOrderNotificationOptions) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_2FA_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL || 'ash33876@gmail.com';
  const fromEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

  if (!resendApiKey) return { success: false };

  const trackingLink = `${siteUrl}/my-orders?id=${order.id}`;
  const statusLabel =
    order.orderStatus === 'shipped'
      ? '📦 Your Order Has Been Dispatched!'
      : order.orderStatus === 'delivered'
      ? '🎉 Your Order Has Been Delivered!'
      : order.orderStatus === 'processing'
      ? '💎 Master Artisans are Crafting Your Jewelry'
      : order.orderStatus === 'confirmed'
      ? '✓ Order Confirmed & In Production'
      : `Order Status: ${order.orderStatus.toUpperCase()}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fdfbf7; margin: 0; padding: 30px 15px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e0d8; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background-color: #064e3b; padding: 24px; text-align: center;">
          <h1 style="color: #c5a059; font-size: 20px; font-weight: 400; letter-spacing: 3px; margin: 0; text-transform: uppercase;">Forever Jewell Studio</h1>
          <p style="color: #a7f3d0; font-size: 11px; letter-spacing: 2px; margin: 6px 0 0 0; text-transform: uppercase;">Order Status Update</p>
        </div>
        <div style="padding: 28px 24px;">
          <h2 style="color: #111827; font-size: 20px; margin: 0 0 12px 0;">${statusLabel}</h2>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
            Hello <strong>${order.customer.firstName}</strong>, your order <strong>#${order.id}</strong> has been updated.
          </p>

          ${
            order.trackingNumber
              ? `
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #1e40af; text-transform: uppercase; font-weight: bold;">Courier Tracking Details</p>
              <p style="margin: 0; font-size: 15px; color: #1e3a8a; font-family: monospace;">
                <strong>${order.carrier || 'Express Courier'}:</strong> ${order.trackingNumber}
              </p>
            </div>
            `
              : ''
          }

          <div style="text-align: center; margin: 28px 0;">
            <a href="${trackingLink}" style="background-color: #064e3b; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
              Track Order Live
            </a>
          </div>

          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
            Questions? Contact us on WhatsApp (+91 98289 30454) or reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(resendApiKey);

    // Try customer first
    if (order.customer.email && order.customer.email.includes('@')) {
      const custRes = await resend.emails.send({
        from: `Forever Jewell Studio <${fromEmail}>`,
        replyTo: adminEmail,
        to: order.customer.email,
        subject: `Update on Order #${order.id} - ${statusLabel}`,
        html,
      });

      if (custRes.error && adminEmail) {
        // Forward to admin if domain restriction blocks customer delivery
        await resend.emails.send({
          from: `Forever Jewell Studio <${fromEmail}>`,
          to: adminEmail,
          subject: `📋 Status Update for #${order.id} (${order.customer.email})`,
          html,
        }).catch(() => {});
      }
    }

    return { success: true };
  } catch (err: any) {
    console.warn('[Status Notification Warning]:', err?.message);
    return { success: false, error: err?.message };
  }
}

