import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { JOURNEY_DAYS } from '@/lib/content/journey30';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let progress = db.prepare('SELECT * FROM journey_progress WHERE user_id = ?').get(user.id) as any;
    if (!progress) {
      db.prepare(`
        INSERT INTO journey_progress (user_id, current_day, completed_days, streak)
        VALUES (?, 1, '[]', 0)
      `).run(user.id);
      progress = { current_day: 1, completed_days: '[]', streak: 0, reflections: '{}' };
    }

    const completedDays: number[] = JSON.parse(progress.completed_days || '[]');
    const reflections: Record<string, string> = JSON.parse(progress.reflections || '{}');

    return NextResponse.json({
      currentDay: progress.current_day || 1,
      completedDays,
      streak: progress.streak || 0,
      lastCompletedAt: progress.last_completed_at,
      reflections,
      days: JOURNEY_DAYS,
    });
  } catch (error) {
    console.error('Fetch journey error:', error);
    return NextResponse.json({ error: 'Failed to load 30-day journey' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { day, reflection } = await req.json();

    const progress = db.prepare('SELECT * FROM journey_progress WHERE user_id = ?').get(user.id) as any;
    const completedDays: number[] = progress ? JSON.parse(progress.completed_days || '[]') : [];
    const reflections: Record<string, string> = progress ? JSON.parse(progress.reflections || '{}') : {};

    if (!completedDays.includes(day)) {
      completedDays.push(day);
      completedDays.sort((a, b) => a - b);
    }

    if (reflection) {
      reflections[day] = reflection;
    }

    const nextDay = Math.min(30, Math.max(day + 1, progress ? progress.current_day : 1));
    const newStreak = (progress?.streak || 0) + 1;
    const todayStr = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT OR REPLACE INTO journey_progress (
        user_id, current_day, completed_days, streak, last_completed_at, reflections, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      user.id,
      nextDay,
      JSON.stringify(completedDays),
      newStreak,
      todayStr,
      JSON.stringify(reflections)
    );

    // Also update Repeat dial
    db.prepare(`
      UPDATE five_dials
      SET repeat_streak = repeat_streak + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(user.id);

    return NextResponse.json({
      success: true,
      currentDay: nextDay,
      completedDays,
      streak: newStreak,
      message: day === 30 ? 'Congratulations! You have completed the 30-Day Blueprint.' : 'Day completed. Keep your momentum going!',
    });
  } catch (error) {
    console.error('Complete journey day error:', error);
    return NextResponse.json({ error: 'Failed to complete day' }, { status: 500 });
  }
}
