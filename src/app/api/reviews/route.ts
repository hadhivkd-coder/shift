import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const reviews = db.prepare(`
      SELECT * FROM weekly_reviews
      WHERE user_id = ?
      ORDER BY week_start_date DESC
    `).all(user.id);

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const data = await req.json();
    const {
      weekStartDate = new Date().toISOString().split('T')[0],
      wins = '',
      difficulties = '',
      dialImprovements = 'Plate',
      dialNeedsAttention = 'Lift',
      nextWeekFocus1 = 'Maintain 1/2 plate vegetables',
      nextWeekFocus2 = '15-min post-meal walk',
      nextWeekFocus3 = '10:30 PM digital curfew',
    } = data;

    const id = `rev_${user.id}_${weekStartDate}`;

    db.prepare(`
      INSERT OR REPLACE INTO weekly_reviews (
        id, user_id, week_start_date, wins, difficulties,
        dial_improvements, dial_needs_attention,
        next_week_focus_1, next_week_focus_2, next_week_focus_3
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      user.id,
      weekStartDate,
      wins,
      difficulties,
      dialImprovements,
      dialNeedsAttention,
      nextWeekFocus1,
      nextWeekFocus2,
      nextWeekFocus3
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Save review error:', error);
    return NextResponse.json({ error: 'Failed to record weekly review' }, { status: 500 });
  }
}
