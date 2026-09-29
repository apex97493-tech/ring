import { NextResponse } from 'next/server';
import {
  verifyMasterPassword,
  createTwoFactorChallenge,
  verifyTwoFactorCode,
  isValidAdminToken,
  revokeAdminToken,
  isIpLockedOut,
  recordFailedAttempt,
  resetFailedAttempts,
  getAdminTeam,
  addAdminMember,
  removeAdminMember,
} from '@/lib/adminAuth';

function getClientIp(req: Request): string {
  return (
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '127.0.0.1'
  );
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // Check for IP brute force lockout
    const lockout = isIpLockedOut(ip);
    if (lockout.locked) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. This IP is locked out for ${lockout.remainingMinutes} minutes for security.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { action } = body;

    // ── ACTION 1: Step 1 Password Login & Send 2FA OTP ───────────────────
    if (action === 'login') {
      const { password } = body;

      if (!password) {
        return NextResponse.json(
          { success: false, error: 'Password is required.' },
          { status: 400 }
        );
      }

      const isValidPassword = verifyMasterPassword(password);
      if (!isValidPassword) {
        const { attemptsLeft } = recordFailedAttempt(ip);
        return NextResponse.json(
          {
            success: false,
            error: attemptsLeft > 0
              ? `Incorrect Master Password. ${attemptsLeft} attempts remaining before temporary lockout.`
              : `Too many incorrect attempts. This IP has been locked out for 15 minutes.`,
          },
          { status: 401 }
        );
      }

      // Password is correct! Reset failed attempts
      resetFailedAttempts(ip);

      // Create 2FA challenge and send OTP
      const challenge = await createTwoFactorChallenge();

      return NextResponse.json({
        success: true,
        step: '2FA_REQUIRED',
        sessionId: challenge.sessionId,
        maskedEmail: challenge.maskedEmail,
        // In local development, also provide the code so you don't have to check email during quick tests
        devCode: challenge.devCode,
        message: `Security code sent to ${challenge.maskedEmail}`,
      });
    }

    // ── ACTION 2: Step 2 Verify 2FA OTP Code ─────────────────────────────
    if (action === 'verify_2fa') {
      const { sessionId, code } = body;

      if (!sessionId || !code) {
        return NextResponse.json(
          { success: false, error: 'Session ID and verification code are required.' },
          { status: 400 }
        );
      }

      const result = verifyTwoFactorCode(sessionId, code);
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error || 'Verification code failed.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        token: result.token,
        role: 'SUPER_ADMIN',
        message: 'Admin identity verified successfully.',
      });
    }

    // ── ACTION 3: Logout ─────────────────────────────────────────────────
    if (action === 'logout') {
      const { token } = body;
      if (token) {
        revokeAdminToken(token);
      }
      return NextResponse.json({ success: true, message: 'Logged out successfully.' });
    }

    // ── ACTION 4: Team Management (Invite or Remove Admin) ───────────────
    if (action === 'add_admin') {
      const authHeader = req.headers.get('Authorization');
      const token = authHeader?.replace('Bearer ', '').trim();
      if (!isValidAdminToken(token)) {
        return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
      }

      const { email, role, name } = body;
      if (!email || !email.includes('@')) {
        return NextResponse.json({ success: false, error: 'Valid email is required.' }, { status: 400 });
      }

      addAdminMember(email, role || 'MANAGER', name || 'Admin Team Member');
      return NextResponse.json({
        success: true,
        team: getAdminTeam(),
        message: `Admin ${email} added successfully.`,
      });
    }

    if (action === 'remove_admin') {
      const authHeader = req.headers.get('Authorization');
      const token = authHeader?.replace('Bearer ', '').trim();
      if (!isValidAdminToken(token)) {
        return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
      }

      const { email } = body;
      const removed = removeAdminMember(email);
      if (!removed) {
        return NextResponse.json(
          { success: false, error: 'Cannot remove owner/super-admin account.' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        team: getAdminTeam(),
        message: `Admin ${email} access revoked.`,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin Auth API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error processing authentication.' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '').trim();

    if (!token || !isValidAdminToken(token)) {
      return NextResponse.json(
        { success: false, authenticated: false, error: 'Session invalid or expired.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      role: 'SUPER_ADMIN',
      team: getAdminTeam(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
