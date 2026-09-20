import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession, setSessionCookie, verifyPassword } from '@/lib/auth/session';
import { seedDemoData } from '@/lib/db/seed';

export async function POST(req: Request) {
  try {
    seedDemoData(); // Ensure demo accounts exist

    const { email, password, isDemo, demoType } = await req.json();

    if (isDemo) {
      const demoEmail =
        demoType === 'admin'
          ? 'admin@shift.health'
          : demoType === 'operator'
          ? 'coach@shift.health'
          : 'hadhi@example.com';
      const user = db.prepare('SELECT id, email, role FROM users WHERE email = ?').get(demoEmail) as { id: string; email: string; role: string } | undefined;
      
      if (!user) {
        return NextResponse.json({ error: 'Demo user not found' }, { status: 404 });
      }

      const token = createSession(user.id);
      await setSessionCookie(token);

      db.prepare('INSERT INTO audit_logs (id, user_id, action, details) VALUES (?, ?, ?, ?)').run(
        `aud_${Date.now()}`,
        user.id,
        'DEMO_LOGIN',
        `User logged in via 1-click demo as ${user.email}`
      );

      return NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = db.prepare('SELECT id, email, password_hash, role FROM users WHERE email = ?').get(email) as { id: string; email: string; password_hash: string; role: string } | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = createSession(user.id);
    await setSessionCookie(token);

    db.prepare('INSERT INTO audit_logs (id, user_id, action, details) VALUES (?, ?, ?, ?)').run(
      `aud_${Date.now()}`,
      user.id,
      'USER_LOGIN',
      'Authenticated successfully'
    );

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
