import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store (in-memory, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // max 60 calls per minute per IP
const RATE_LIMIT_TRACK_MAX = 20; // max 20 order track queries per minute
const RATE_LIMIT_ORDER_POST = 10; // max 10 order placements per minute

function getRealIp(req: NextRequest): string {
  return (
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

function checkRateLimit(key: string, maxRequests: number, windowMs = RATE_LIMIT_WINDOW_MS): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > maxRequests;
}

/**
 * Fast Edge-safe token structure verification.
 * Deep cryptographic verification is performed by route handlers in Node runtime.
 */
function isRecognizedTokenFormat(token?: string | null): boolean {
  if (!token) return false;
  const clean = token.trim();

  // 1. Signed Cryptographic Token format: fjs_v2.<payloadB64>.<hexSignature64>
  if (clean.startsWith('fjs_v2.')) {
    const parts = clean.split('.');
    if (parts.length === 3 && parts[1].length > 10 && parts[2].length === 64) {
      return true;
    }
    return false;
  }

  // 2. Active 2FA session token format: fjs_sec_<64 hex chars>
  if (clean.startsWith('fjs_sec_') && clean.length === 72) {
    return true;
  }

  // 3. Explicit owner token configured in environment (if any)
  const envTokens = process.env.ADMIN_TOKENS;
  if (envTokens) {
    const valid = envTokens.split(',').map((t) => t.trim());
    if (valid.includes(clean)) return true;
  }

  // Reject all legacy, weak, or unrecognized tokens
  return false;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getRealIp(req);

  // ── 1. Public order tracking rate limit ────────────────
  if (pathname.startsWith('/api/orders/track')) {
    if (checkRateLimit(`track:${ip}`, RATE_LIMIT_TRACK_MAX)) {
      return NextResponse.json(
        { success: false, error: 'Too many search requests. Please slow down.' },
        { status: 429 }
      );
    }
    return NextResponse.next();
  }

  // ── 2. Rate limit customer order placements ──────────────
  const isPublicOrderPost = pathname.startsWith('/api/orders') && req.method === 'POST';
  if (isPublicOrderPost) {
    if (checkRateLimit(`order_post:${ip}`, RATE_LIMIT_ORDER_POST)) {
      return NextResponse.json(
        { success: false, error: 'Too many order attempts. Please wait a moment.' },
        { status: 429 }
      );
    }
    return NextResponse.next();
  }

  // ── 3. Protect Admin API Routes ──────────────────────────
  const isOrdersAdminRoute =
    pathname.startsWith('/api/orders') && ['GET', 'PATCH', 'DELETE'].includes(req.method);

  const isAdminApiWrite =
    (pathname.startsWith('/api/products') && ['POST', 'DELETE', 'PUT', 'PATCH'].includes(req.method)) ||
    (pathname.startsWith('/api/upload') && req.method === 'POST') ||
    isOrdersAdminRoute;

  if (isAdminApiWrite) {
    // Admin rate limiting (defense against automated brute-force)
    if (checkRateLimit(`admin_api:${ip}`, RATE_LIMIT_MAX_REQUESTS)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please slow down.' },
        { status: 429 }
      );
    }

    // Token extraction (Case-preserving for cryptographic tokens)
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    const tokenFromHeader = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : null;

    const tokenFromCustomHeader = req.headers.get('x-admin-token')?.trim() || null;
    const tokenFromQuery = req.nextUrl.searchParams.get('token')?.trim() || null;
    const token = tokenFromHeader || tokenFromCustomHeader || tokenFromQuery;

    // Structural token verification at proxy gateway
    if (!token || !isRecognizedTokenFormat(token)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid admin authentication token required.' },
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
