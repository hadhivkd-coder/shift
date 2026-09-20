import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const data = await req.json();
    const {
      date = new Date().toISOString().split('T')[0],
      sleepHours,
      sleepQuality = 'Restful',
      waterMl = 2500,
      movementType = 'Walking',
      movementDurationMins = 20,
      mealsFollowedPlan = 'Mostly',
      energyLevel = 4,
      stressLevel = 2,
      weightKg,
      waistCm,
      mood = 'Focused',
      notes = '',
    } = data;

    const checkinId = `chk_${user.id}_${date}`;

    db.prepare(`
      INSERT OR REPLACE INTO daily_checkins (
        id, user_id, date, sleep_hours, sleep_quality, water_ml,
        movement_type, movement_duration_mins, meals_followed_plan,
        energy_level, stress_level, weight_kg, waist_cm, mood, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      checkinId,
      user.id,
      date,
      parseFloat(sleepHours) || null,
      sleepQuality,
      parseInt(waterMl) || 2500,
      movementType,
      parseInt(movementDurationMins) || 20,
      mealsFollowedPlan,
      parseInt(energyLevel) || 4,
      parseInt(stressLevel) || 2,
      weightKg ? parseFloat(weightKg) : null,
      waistCm ? parseFloat(waistCm) : null,
      mood,
      notes
    );

    // Update Repeat Dial streak
    const dials = db.prepare('SELECT * FROM five_dials WHERE user_id = ?').get(user.id) as any;
    if (dials) {
      const newRepeatStreak = (dials.repeat_streak || 0) + 1;
      const newMoveStreak = movementDurationMins >= 15 ? (dials.move_streak || 0) + 1 : dials.move_streak;
      const newPlateStreak = mealsFollowedPlan !== 'Off-plan' ? (dials.plate_streak || 0) + 1 : dials.plate_streak;

      db.prepare(`
        UPDATE five_dials
        SET repeat_streak = ?,
            move_streak = ?,
            plate_streak = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).run(newRepeatStreak, newMoveStreak, newPlateStreak, user.id);
    }

    // Also update body profile current weight if provided
    if (weightKg) {
      db.prepare('UPDATE body_profiles SET weight_kg = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?').run(
        parseFloat(weightKg),
        user.id
      );
    }

    return NextResponse.json({ success: true, checkinId });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Failed to record daily check-in' }, { status: 500 });
  }
}
