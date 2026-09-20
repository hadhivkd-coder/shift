import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const meals = db.prepare(`
      SELECT * FROM meal_logs
      WHERE user_id = ? AND date = ?
      ORDER BY created_at ASC
    `).all(user.id, date);

    return NextResponse.json({ meals });
  } catch (error) {
    console.error('Fetch meals error:', error);
    return NextResponse.json({ error: 'Failed to fetch meals' }, { status: 500 });
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
      mealType = 'Lunch',
      foodItems,
      portionDesc = 'Standard portion',
      proteinPresent = false,
      plantsPresent = false,
      hungerBefore = 3,
      fullnessAfter = 4,
      notes = '',
    } = data;

    if (!foodItems) {
      return NextResponse.json({ error: 'Food items description is required' }, { status: 400 });
    }

    const mealId = `meal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    db.prepare(`
      INSERT INTO meal_logs (
        id, user_id, date, meal_type, food_items, portion_desc,
        protein_present, plants_present, hunger_before, fullness_after, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      mealId,
      user.id,
      date,
      mealType,
      foodItems,
      portionDesc,
      proteinPresent ? 1 : 0,
      plantsPresent ? 1 : 0,
      hungerBefore,
      fullnessAfter,
      notes
    );

    return NextResponse.json({ success: true, mealId });
  } catch (error) {
    console.error('Log meal error:', error);
    return NextResponse.json({ error: 'Failed to log meal' }, { status: 500 });
  }
}
