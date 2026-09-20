import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET() {
  try {
    const operator = await getCurrentUser();
    if (!operator || (operator.role !== 'operator' && operator.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized: Operator or Admin privileges required.' }, { status: 403 });
    }

    // Fetch all members with their health profile and latest vitals
    const users = db.prepare(`
      SELECT 
        u.id, u.email, u.role, u.created_at,
        p.name, p.preferred_name as preferredName, p.city, p.country, p.occupation,
        bp.weight_kg as weightKg, bp.height_cm as heightCm, bp.waist_cm as waistCm, bp.bmi, bp.weight_goal as weightGoal,
        hs.safety_status as safetyStatus, hs.conditions, hs.has_medication as hasMedication, hs.medication_details as medicationDetails,
        ap.allergies, ap.preferences,
        fp.cuisine_preferences as cuisinePreferences,
        fd.dial_plate as dialPlate, fd.dial_move as dialMove, fd.dial_lift as dialLift, fd.dial_rest as dialRest, fd.dial_repeat as dialRepeat,
        fd.plate_streak as plateStreak, fd.move_streak as moveStreak, fd.repeat_streak as repeatStreak,
        jp.current_day as journeyDay, jp.streak as journeyStreak
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN body_profiles bp ON u.id = bp.user_id
      LEFT JOIN health_screens hs ON u.id = hs.user_id
      LEFT JOIN allergy_profiles ap ON u.id = ap.user_id
      LEFT JOIN food_profiles fp ON u.id = fp.user_id
      LEFT JOIN five_dials fd ON u.id = fd.user_id
      LEFT JOIN journey_progress jp ON u.id = jp.user_id
      WHERE u.role = 'user'
      ORDER BY 
        CASE 
          WHEN hs.safety_status = 'URGENT' THEN 1
          WHEN hs.safety_status = 'DOCTOR_RECOMMENDED' THEN 2
          WHEN hs.safety_status = 'WATCH' THEN 3
          ELSE 4 
        END,
        u.created_at DESC
    `).all() as any[];

    // Format member records
    const members = users.map(m => {
      // Get recent 5 checkins
      const recentCheckins = db.prepare(`
        SELECT date, sleep_hours, water_ml, movement_duration_mins, meals_followed_plan, weight_kg
        FROM daily_checkins
        WHERE user_id = ?
        ORDER BY date DESC
        LIMIT 5
      `).all(m.id);

      // Get operator notes
      const notes = db.prepare(`
        SELECT n.id, n.note_text as noteText, n.created_at as createdAt, op.name as operatorName
        FROM operator_notes n
        LEFT JOIN profiles op ON n.operator_id = op.user_id
        WHERE n.user_id = ?
        ORDER BY n.created_at DESC
      `).all(m.id);

      // Get custom actions pushed by operator
      const customActions = db.prepare(`
        SELECT id, dial, title, subtitle, why_it_matters as whyItMatters, created_at as createdAt
        FROM operator_custom_actions
        WHERE user_id = ?
        ORDER BY created_at DESC
      `).all(m.id);

      return {
        ...m,
        preferredName: m.preferredName || m.name || m.email?.split('@')[0] || 'Member',
        safetyStatus: m.safetyStatus || 'NORMAL',
        conditions: JSON.parse(m.conditions || '[]'),
        allergies: JSON.parse(m.allergies || '[]'),
        cuisinePreferences: JSON.parse(m.cuisinePreferences || '[]'),
        recentCheckins,
        notes,
        customActions,
      };
    });

    // Triage metrics
    const urgentCount = members.filter(m => m.safetyStatus === 'URGENT').length;
    const doctorRecCount = members.filter(m => m.safetyStatus === 'DOCTOR_RECOMMENDED').length;
    const watchCount = members.filter(m => m.safetyStatus === 'WATCH').length;

    return NextResponse.json({
      operator: {
        id: operator.id,
        name: operator.name || operator.preferredName || 'Coach',
        role: operator.role,
      },
      triageMetrics: {
        totalMembers: members.length,
        urgentCount,
        doctorRecCount,
        watchCount,
      },
      members,
    });
  } catch (error) {
    console.error('Operator GET error:', error);
    return NextResponse.json({ error: 'Failed to load operator console' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const operator = await getCurrentUser();
    if (!operator || (operator.role !== 'operator' && operator.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await req.json();
    const { action, userId } = data;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 1. Add Coach Note
    if (action === 'add_note') {
      const { noteText } = data;
      if (!noteText?.trim()) {
        return NextResponse.json({ error: 'Note text is required' }, { status: 400 });
      }

      const noteId = `op_note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      db.prepare(`
        INSERT INTO operator_notes (id, user_id, operator_id, note_text)
        VALUES (?, ?, ?, ?)
      `).run(noteId, userId, operator.id, noteText.trim());

      db.prepare('INSERT INTO audit_logs (id, user_id, action, details) VALUES (?, ?, ?, ?)').run(
        `aud_${Date.now()}`,
        operator.id,
        'COACH_NOTE_ADDED',
        `Coach added note for member ${userId}`
      );

      return NextResponse.json({ success: true, noteId });
    }

    // 2. Push Custom Action to Member's Today's Shift
    if (action === 'push_action') {
      const { dial = 'PLATE', title, subtitle, whyItMatters } = data;
      if (!title || !subtitle) {
        return NextResponse.json({ error: 'Title and subtitle are required' }, { status: 400 });
      }

      const actionId = `op_act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      db.prepare(`
        INSERT INTO operator_custom_actions (id, user_id, operator_id, dial, title, subtitle, why_it_matters)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(actionId, userId, operator.id, dial, title, subtitle, whyItMatters || '');

      return NextResponse.json({ success: true, actionId });
    }

    // 3. Update Safety Status
    if (action === 'update_safety_status') {
      const { safetyStatus } = data;
      db.prepare(`
        UPDATE health_screens
        SET safety_status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).run(safetyStatus, userId);

      return NextResponse.json({ success: true });
    }

    // 4. Adjust Dial Level
    if (action === 'adjust_dial') {
      const { dialField, level, actionText } = data;
      // dialField e.g. 'dial_plate' | 'dial_move' | 'dial_lift' | 'dial_rest' | 'dial_repeat'
      const validFields = ['dial_plate', 'dial_move', 'dial_lift', 'dial_rest', 'dial_repeat'];
      if (!validFields.includes(dialField)) {
        return NextResponse.json({ error: 'Invalid dial field' }, { status: 400 });
      }

      const actionCol = dialField.replace('dial_', '') + '_action';
      db.prepare(`
        UPDATE five_dials
        SET ${dialField} = ?, ${actionCol} = COALESCE(?, ${actionCol}), updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).run(parseInt(level), actionText || null, userId);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown operator action' }, { status: 400 });
  } catch (error) {
    console.error('Operator POST error:', error);
    return NextResponse.json({ error: 'Operator action failed' }, { status: 500 });
  }
}
