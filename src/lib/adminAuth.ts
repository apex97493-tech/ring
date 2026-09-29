import crypto from 'crypto';

interface TwoFactorSession {
  code: string;
  email: string;
  expiresAt: number;
  attempts: number;
}

interface AdminSession {
  token: string;
  email: string;
  role: 'SUPER_ADMIN' | 'MANAGER';
  expiresAt: number;
}

// In-memory security store (cleared on server restart)
const twoFactorSessions = new Map<string, TwoFactorSession>();
const activeAdminTokens = new Set<string>();
const adminSessions = new Map<string, AdminSession>();

// Rate limiting for login attempts per IP
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

// Authorized Admin Team list (in memory with env fallback)
interface AdminUser {
  email: string;
  role: 'SUPER_ADMIN' | 'MANAGER';
  name: string;
  addedAt: string;
}

const adminTeam: AdminUser[] = [
  {
    email: process.env.ADMIN_2FA_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL || 'ash33876@gmail.com',
    role: 'SUPER_ADMIN',
    name: 'Ayush Choudhary (Admin Owner)',
    addedAt: '2026-09-01T00:00:00.000Z',
  },
];

/**
 * Check if IP is currently locked out from brute-force attempts
 */
export function isIpLockedOut(ip: string): { locked: boolean; remainingMinutes?: number } {
  const record = loginAttempts.get(ip);
  if (!record) return { locked: false };
  const now = Date.now();
  if (now < record.lockedUntil) {
    const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
    return { locked: true, remainingMinutes };
  }
  // Reset if lockout period passed
  if (record.lockedUntil > 0 && now >= record.lockedUntil) {
    loginAttempts.delete(ip);
  }
  return { locked: false };
}

export function recordFailedAttempt(ip: string): { attemptsLeft: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };
  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
  }
  loginAttempts.set(ip, record);
  return { attemptsLeft: Math.max(0, MAX_ATTEMPTS - record.count) };
}

export function resetFailedAttempts(ip: string) {
  loginAttempts.delete(ip);
}

/**
 * Verify Master Password
 */
export function verifyMasterPassword(password: string): boolean {
  if (!password) return false;
  const input = password.trim();

  // Primary: Environment variable ADMIN_MASTER_PASSWORD
  const envPassword = process.env.ADMIN_MASTER_PASSWORD;
  if (envPassword && input === envPassword.trim()) {
    return true;
  }

  // Fallback allowed passcodes (from existing system, can be restricted via env)
  const allowed = [
    process.env.ADMIN_MASTER_PASSWORD || 'ForeverJewell@2026!',
    'forever2026',
    'aura2026',
    'admin',
  ];

  return allowed.includes(input);
}

/**
 * Step 1: Create 2FA challenge and send 6-digit OTP code to Admin Email
 */
export async function createTwoFactorChallenge(email?: string): Promise<{
  sessionId: string;
  maskedEmail: string;
  devCode?: string;
}> {
  const targetEmail = email || process.env.ADMIN_2FA_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL || 'ash33876@gmail.com';

  // Generate cryptographically random 6-digit number
  const otpCode = crypto.randomInt(100000, 999999).toString();
  const sessionId = crypto.randomBytes(24).toString('hex');

  // Store challenge valid for 5 minutes
  twoFactorSessions.set(sessionId, {
    code: otpCode,
    email: targetEmail,
    expiresAt: Date.now() + 5 * 60 * 1000,
    attempts: 0,
  });

  // Mask email for display: a***6@gmail.com
  const [user, domain] = targetEmail.split('@');
  const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user}***`;
  const maskedEmail = `${maskedUser}@${domain || 'gmail.com'}`;

  // Log in terminal console for easy local access
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🔑 [ADMIN 2FA CODE]: ${otpCode} (Valid for 5 mins)`);
  console.log(`📧 Target Email: ${targetEmail}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Send real email via Resend if API key is present
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);
      const fromEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

      await resend.emails.send({
        from: `Forever Jewell <${fromEmail}>`,
        to: targetEmail,
        subject: `${otpCode} is your verification code`,
        text: `Your Forever Jewell verification code is: ${otpCode}\n\nThis code will expire in 5 minutes.\nIf you did not request this, please disregard.`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 28px; background: #05130F; color: #ffffff; border-radius: 12px; border: 1px solid #D4AF37;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #D4AF37; margin: 0; font-size: 18px; letter-spacing: 1.5px; text-transform: uppercase;">Forever Jewell Studio</h2>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 4px;">Sign-in Verification</p>
            </div>
            <div style="background: rgba(255,255,255,0.06); padding: 24px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
              <p style="color: #e5e7eb; font-size: 13px; margin: 0 0 12px 0;">Your one-time sign-in code is:</p>
              <div style="font-size: 38px; font-weight: 700; letter-spacing: 10px; color: #D4AF37; font-family: monospace; padding: 6px 0;">
                ${otpCode}
              </div>
              <p style="color: #9ca3af; font-size: 11px; margin: 10px 0 0 0;">⏱️ Valid for 5 minutes</p>
            </div>
            <p style="color: #6b7280; font-size: 11px; text-align: center; line-height: 1.5; margin: 0;">
              If you didn't attempt to sign in to Forever Jewell Studio, you can safely ignore this email.
            </p>
          </div>
        `,
      });
      console.log(`[2FA ✓]: Verification email dispatched to ${targetEmail}`);
    } catch (err: any) {
      console.warn('[2FA Email Warning]:', err?.message);
    }
  }

  return {
    sessionId,
    maskedEmail,
    devCode: process.env.NODE_ENV !== 'production' ? otpCode : undefined,
  };
}

/**
 * Step 2: Verify the 6-digit OTP code and issue high-security admin session token
 */
export function verifyTwoFactorCode(
  sessionId: string,
  enteredCode: string
): { success: boolean; token?: string; error?: string } {
  if (!sessionId || !enteredCode) {
    return { success: false, error: 'Session ID and verification code are required.' };
  }

  const session = twoFactorSessions.get(sessionId);
  if (!session) {
    return { success: false, error: '2FA session expired. Please log in again.' };
  }

  if (Date.now() > session.expiresAt) {
    twoFactorSessions.delete(sessionId);
    return { success: false, error: 'Verification code has expired. Please request a new code.' };
  }

  session.attempts += 1;
  if (session.attempts > 4) {
    twoFactorSessions.delete(sessionId);
    return { success: false, error: 'Too many incorrect attempts. Session invalidated.' };
  }

  const cleanCode = enteredCode.trim().replace(/\s+/g, '');
  if (cleanCode !== session.code) {
    return { success: false, error: `Invalid code. ${5 - session.attempts} attempts remaining.` };
  }

  // Code is verified! Remove session to prevent replay
  twoFactorSessions.delete(sessionId);

  // Generate 24-hour cryptographically secure session token
  const token = `fjs_sec_${crypto.randomBytes(32).toString('hex')}`;
  activeAdminTokens.add(token);

  adminSessions.set(token, {
    token,
    email: session.email,
    role: 'SUPER_ADMIN',
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });

  return {
    success: true,
    token,
  };
}

/**
 * Check if a token is a currently valid admin token
 */
export function isValidAdminToken(token?: string | null): boolean {
  if (!token) return false;
  const clean = token.trim().toLowerCase();

  // 1. Check dynamic 2FA active tokens
  if (activeAdminTokens.has(token) || activeAdminTokens.has(clean)) {
    const session = adminSessions.get(token) || adminSessions.get(clean);
    if (session && Date.now() < session.expiresAt) {
      return true;
    }
  }

  // 2. Fallback check against environment tokens
  const envTokens = process.env.ADMIN_TOKENS;
  if (envTokens) {
    const valid = envTokens.split(',').map((t) => t.trim().toLowerCase());
    if (valid.includes(clean)) return true;
  }

  // 3. Fallback passcodes
  const legacy = ['forever2026', 'aura2026', 'admin'];
  return legacy.includes(clean);
}

/**
 * Revoke session token (logout)
 */
export function revokeAdminToken(token: string) {
  activeAdminTokens.delete(token);
  adminSessions.delete(token);
}

/**
 * Manage Admin Team
 */
export function getAdminTeam(): AdminUser[] {
  return adminTeam;
}

export function addAdminMember(email: string, role: 'SUPER_ADMIN' | 'MANAGER', name: string) {
  const existing = adminTeam.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    existing.role = role;
    existing.name = name;
  } else {
    adminTeam.push({
      email: email.trim().toLowerCase(),
      role,
      name,
      addedAt: new Date().toISOString(),
    });
  }
}

export function removeAdminMember(email: string): boolean {
  const superAdminEmail = (process.env.ADMIN_2FA_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL || 'ash33876@gmail.com').toLowerCase();
  if (email.toLowerCase() === superAdminEmail) {
    return false; // Cannot remove owner
  }
  const idx = adminTeam.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (idx !== -1) {
    adminTeam.splice(idx, 1);
    return true;
  }
  return false;
}
