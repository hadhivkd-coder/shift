import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { processAssistantQuery } from '@/lib/ai/assistant';
import { UserHealthContext } from '@/lib/personalization/engine';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Build context
    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(user.id) as any;
    const allergyRow = db.prepare('SELECT * FROM allergy_profiles WHERE user_id = ?').get(user.id) as any;
    const foodRow = db.prepare('SELECT * FROM food_profiles WHERE user_id = ?').get(user.id) as any;
    const lifestyleRow = db.prepare('SELECT * FROM lifestyle_profiles WHERE user_id = ?').get(user.id) as any;
    const skinRow = db.prepare('SELECT * FROM skin_profiles WHERE user_id = ?').get(user.id) as any;
    const goalsRow = db.prepare('SELECT * FROM goals WHERE user_id = ?').get(user.id) as any;

    const userContext: UserHealthContext = {
      name: profile?.preferred_name || profile?.name || user.name || 'Member',
      primaryGoals: goalsRow ? JSON.parse(goalsRow.primary_goals || '[]') : [],
      allergies: allergyRow ? JSON.parse(allergyRow.allergies || '[]') : [],
      intolerances: allergyRow ? JSON.parse(allergyRow.intolerances || '[]') : [],
      preferences: allergyRow ? JSON.parse(allergyRow.preferences || '[]') : [],
      culturalRestrictions: allergyRow ? JSON.parse(allergyRow.cultural_restrictions || '[]') : [],
      cuisinePreferences: foodRow ? JSON.parse(foodRow.cuisine_preferences || '[]') : ['Kerala', 'Indian'],
      diningLocations: foodRow ? JSON.parse(foodRow.dining_locations || '[]') : [],
      occupation: profile?.occupation,
      sleepHours: lifestyleRow?.sleep_hours || 7,
      bedtime: lifestyleRow?.bedtime,
      skinConcerns: skinRow ? JSON.parse(skinRow.concerns || '[]') : [],
    };

    const response = await processAssistantQuery(message, userContext);

    // Audit log without recording private health text
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, details)
      VALUES (?, ?, ?, ?)
    `).run(
      `aud_${Date.now()}`,
      user.id,
      'ASSISTANT_QUERY',
      `Safety flags - Medical refusal: ${response.isMedicalRefusal}, Urgent alert: ${response.isUrgentAlert}`
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Assistant route error:', error);
    return NextResponse.json({ error: 'Failed to process assistant request' }, { status: 500 });
  }
}
