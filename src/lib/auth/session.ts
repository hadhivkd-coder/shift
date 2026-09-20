import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'shift_session_token';
const SESSION_EXPIRY_DAYS = 30;

export interface SessionUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  preferredName?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createSession(userId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const id = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  db.prepare(`
    INSERT INTO sessions (id, user_id, token, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(id, userId, token, expiresAt.toISOString());

  return token;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * SESSION_EXPIRY_DAYS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    db.prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const row = db.prepare(`
      SELECT u.id, u.email, u.role, p.name, p.preferred_name as preferredName, s.expires_at
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE s.token = ?
    `).get(token) as { id: string; email: string; role: string; name?: string; preferredName?: string; expires_at: string } | undefined;

    if (!row) {
      return null;
    }

    if (new Date(row.expires_at) < new Date()) {
      db.prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
      return null;
    }

    return {
      id: row.id,
      email: row.email,
      role: row.role,
      name: row.name,
      preferredName: row.preferredName || row.name,
    };
  } catch {
    return null;
  }
}
