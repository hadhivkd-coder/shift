import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const profile = db.prepare('SELECT * FROM skin_profiles WHERE user_id = ?').get(user.id) as any;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLog = db.prepare('SELECT * FROM skin_logs WHERE user_id = ? AND date = ?').get(user.id, todayStr);
    const history = db.prepare(`
      SELECT * FROM skin_logs
      WHERE user_id = ?
      ORDER BY date DESC
      LIMIT 14
    `).all(user.id);

    return NextResponse.json({
      profile: profile ? { ...profile, concerns: JSON.parse(profile.concerns || '[]') } : null,
      todayLog,
      history,
    });
  } catch (error) {
    console.error('Fetch skin error:', error);
    return NextResponse.json({ error: 'Failed to fetch skin logs' }, { status: 500 });
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
      date = new Date().toISOString().split('T')[0],
      amCleanse = 0,
      amMoisturize = 0,
      amSunscreen = 0,
      pmCleanse = 0,
      pmTreatment = 0,
      pmMoisturize = 0,
      acneLevel,
      drynessLevel,
      oilinessLevel,
      irritationLevel,
      notes = '',
    } = data;

    const id = `skin_${user.id}_${date}`;

    db.prepare(`
      INSERT OR REPLACE INTO skin_logs (
        id, user_id, date,
        am_cleanse, am_moisturize, am_sunscreen,
        pm_cleanse, pm_treatment, pm_moisturize,
        acne_level, dryness_level, oiliness_level, irritation_level, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      user.id,
      date,
      amCleanse ? 1 : 0,
      amMoisturize ? 1 : 0,
      amSunscreen ? 1 : 0,
      pmCleanse ? 1 : 0,
      pmTreatment ? 1 : 0,
      pmMoisturize ? 1 : 0,
      acneLevel ? parseInt(acneLevel) : null,
      drynessLevel ? parseInt(drynessLevel) : null,
      oilinessLevel ? parseInt(oilinessLevel) : null,
      irritationLevel ? parseInt(irritationLevel) : null,
      notes
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Save skin error:', error);
    return NextResponse.json({ error: 'Failed to save skin routine' }, { status: 500 });
  }
}
