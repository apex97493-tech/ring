import { NextRequest, NextResponse } from 'next/server';

// Allowed admin tokens — comma-separated list from env var ADMIN_TOKENS
// Falls back to the hardcoded passcodes if env var is not set.
// In production on Hostinger, set ADMIN_TOKENS=forever2026,aura2026,admin in your .env
function getAdminTokens(): Set<string> {
  const envTokens = process.env.ADMIN_TOKENS;
  if (envTokens) {
    return new Set(envTokens.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean));
  }
  // Default fallback (same as PASSCODES in the admin panel)
  return new Set(['forever2026', 'aura2026', 'admin']);
}

// Rate limiting store (in-memory, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // max 60 admin API calls per minute per IP

function getRealIp(req: NextRequest): string {
  return (
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Protect admin API routes ────────────────
  const isAdminApiWrite =
    (pathname.startsWith('/api/products') && ['POST', 'DELETE', 'PUT', 'PATCH'].includes(req.method)) ||
    (pathname.startsWith('/api/upload') && req.method === 'POST') ||
    (pathname.startsWith('/api/orders') && ['GET', 'PATCH', 'DELETE'].includes(req.method));

  // ── Rate limit public order placements ────────────────
  const isPublicOrderPost = pathname.startsWith('/api/orders') && req.method === 'POST';
  if (isPublicOrderPost) {
    const ip = getRealIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many order attempts. Please wait a moment.' },
        { status: 429 }
      );
    }
  }

  if (isAdminApiWrite) {
    const ip = getRealIp(req);

    // Rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please slow down.' },
        { status: 429 }
      );
    }

    // Token authentication
    const authHeader = req.headers.get('Authorization');
    const tokenFromHeader = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7).trim().toLowerCase()
      : null;

    // Also accept token as query param (backup for upload calls)
    const tokenFromQuery = req.nextUrl.searchParams.get('token')?.toLowerCase();
    const token = tokenFromHeader || tokenFromQuery;

    const validTokens = getAdminTokens();

    if (!token || !validTokens.has(token)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/products/:path*',
    '/api/upload/:path*',
    '/api/orders/:path*',
  ],
};
