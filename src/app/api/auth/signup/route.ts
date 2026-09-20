import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession, hashPassword, setSessionCookie } from '@/lib/auth/session';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: 'Email and a password of at least 6 characters are required.' },
        { status: 400 }
      );
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const userId = `usr_${crypto.randomUUID()}`;
    const passwordHash = await hashPassword(password);

    db.prepare(`
      INSERT INTO users (id, email, password_hash, role)
      VALUES (?, ?, ?, 'user')
    `).run(userId, email, passwordHash);

    // Create preliminary profile
    db.prepare(`
      INSERT INTO profiles (user_id, name)
      VALUES (?, ?)
    `).run(userId, name || 'Member');

    // Create preliminary consents
    db.prepare(`
      INSERT INTO consents (user_id, health_profile_consent, recommendations_consent, analytics_consent)
      VALUES (?, 1, 1, 0)
    `).run(userId);

    const token = createSession(userId);
    await setSessionCookie(token);

    db.prepare('INSERT INTO audit_logs (id, user_id, action, details) VALUES (?, ?, ?, ?)').run(
      `aud_${Date.now()}`,
      userId,
      'USER_SIGNUP',
      'Account created and authenticated'
    );

    return NextResponse.json({
      success: true,
      user: { id: userId, email, role: 'user', name: name || 'Member' },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 });
  }
}
