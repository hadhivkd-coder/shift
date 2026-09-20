import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { getRecommendedMeals, UserHealthContext } from '@/lib/personalization/engine';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { mealType } = await req.json();

    const allergyRow = db.prepare('SELECT * FROM allergy_profiles WHERE user_id = ?').get(user.id) as any;
    const foodRow = db.prepare('SELECT * FROM food_profiles WHERE user_id = ?').get(user.id) as any;
    const goalsRow = db.prepare('SELECT * FROM goals WHERE user_id = ?').get(user.id) as any;

    const userContext: UserHealthContext = {
      name: user.name || 'Member',
      primaryGoals: goalsRow ? JSON.parse(goalsRow.primary_goals || '[]') : [],
      allergies: allergyRow ? JSON.parse(allergyRow.allergies || '[]') : [],
      intolerances: allergyRow ? JSON.parse(allergyRow.intolerances || '[]') : [],
      preferences: allergyRow ? JSON.parse(allergyRow.preferences || '[]') : [],
      culturalRestrictions: allergyRow ? JSON.parse(allergyRow.cultural_restrictions || '[]') : [],
      cuisinePreferences: foodRow ? JSON.parse(foodRow.cuisine_preferences || '[]') : ['Kerala', 'Indian'],
      diningLocations: foodRow ? JSON.parse(foodRow.dining_locations || '[]') : [],
    };

    const recommendations = getRecommendedMeals(userContext, mealType);

    return NextResponse.json({
      recommendations,
      activeAllergies: userContext.allergies,
      cuisine: userContext.cuisinePreferences[0] || 'Kerala / Indian',
    });
  } catch (error) {
    console.error('Recommend meals error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}
