import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { generateTodaysShift, generateTopPriorities } from '@/lib/personalization/engine';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(user.id) as any;
    const bodyProfile = db.prepare('SELECT * FROM body_profiles WHERE user_id = ?').get(user.id) as any;
    const goals = db.prepare('SELECT * FROM goals WHERE user_id = ?').get(user.id) as any;
    const healthScreen = db.prepare('SELECT * FROM health_screens WHERE user_id = ?').get(user.id) as any;
    const allergyProfile = db.prepare('SELECT * FROM allergy_profiles WHERE user_id = ?').get(user.id) as any;
    const foodProfile = db.prepare('SELECT * FROM food_profiles WHERE user_id = ?').get(user.id) as any;
    const lifestyle = db.prepare('SELECT * FROM lifestyle_profiles WHERE user_id = ?').get(user.id) as any;
    const skin = db.prepare('SELECT * FROM skin_profiles WHERE user_id = ?').get(user.id) as any;
    const dials = db.prepare('SELECT * FROM five_dials WHERE user_id = ?').get(user.id) as any;
    const journey = db.prepare('SELECT * FROM journey_progress WHERE user_id = ?').get(user.id) as any;

    const todayStr = new Date().toISOString().split('T')[0];
    const todaysCheckin = db.prepare('SELECT * FROM daily_checkins WHERE user_id = ? AND date = ?').get(user.id, todayStr) as any;
    const todaysMeals = db.prepare('SELECT * FROM meal_logs WHERE user_id = ? AND date = ? ORDER BY created_at ASC').all(user.id, todayStr) as any[];
    const todaysSkin = db.prepare('SELECT * FROM skin_logs WHERE user_id = ? AND date = ?').get(user.id, todayStr) as any;
    const latestNudge = db.prepare('SELECT * FROM admin_nudges WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(user.id) as any;
    const bcastActive = db.prepare("SELECT value FROM platform_settings WHERE key = 'broadcast_active'").get() as { value: string } | undefined;
    const bcastMsg = db.prepare("SELECT value FROM platform_settings WHERE key = 'broadcast_message'").get() as { value: string } | undefined;
    const globalBroadcast = bcastActive?.value === '1' ? bcastMsg?.value : null;

    const parsedGoals = goals ? JSON.parse(goals.primary_goals || '[]') : [];
    const parsedAllergies = allergyProfile ? JSON.parse(allergyProfile.allergies || '[]') : [];
    const parsedIntolerances = allergyProfile ? JSON.parse(allergyProfile.intolerances || '[]') : [];
    const parsedCuisines = foodProfile ? JSON.parse(foodProfile.cuisine_preferences || '[]') : [];
    const parsedFavFoods = foodProfile ? JSON.parse(foodProfile.favorite_foods || '[]') : [];
    const parsedSkinConcerns = skin ? JSON.parse(skin.concerns || '[]') : [];

    const userContext = {
      name: profile?.name || user.name || 'Member',
      primaryGoals: parsedGoals,
      allergies: parsedAllergies,
      intolerances: parsedIntolerances,
      preferences: allergyProfile ? JSON.parse(allergyProfile.preferences || '[]') : [],
      culturalRestrictions: allergyProfile ? JSON.parse(allergyProfile.cultural_restrictions || '[]') : [],
      cuisinePreferences: parsedCuisines,
      diningLocations: foodProfile ? JSON.parse(foodProfile.dining_locations || '[]') : [],
      occupation: profile?.occupation,
      activityLevel: bodyProfile?.activity_level,
      sleepHours: lifestyle?.sleep_hours || 7,
      bedtime: lifestyle?.bedtime,
      skinConcerns: parsedSkinConcerns,
    };

    const todaysShift = generateTodaysShift(userContext);
    const topPriorities = generateTopPriorities(userContext);

    return NextResponse.json({
      authenticated: true,
      user,
      profile,
      bodyProfile,
      goals: goals ? { ...goals, primary_goals: parsedGoals, past_barriers: JSON.parse(goals.past_barriers || '[]') } : null,
      healthScreen: healthScreen ? { ...healthScreen, conditions: JSON.parse(healthScreen.conditions || '[]') } : null,
      allergyProfile: allergyProfile ? {
        ...allergyProfile,
        allergies: parsedAllergies,
        intolerances: parsedIntolerances,
        preferences: JSON.parse(allergyProfile.preferences || '[]'),
        cultural_restrictions: JSON.parse(allergyProfile.cultural_restrictions || '[]')
      } : null,
      foodProfile: foodProfile ? {
        ...foodProfile,
        dining_locations: JSON.parse(foodProfile.dining_locations || '[]'),
        favorite_foods: parsedFavFoods,
        cuisine_preferences: parsedCuisines
      } : null,
      lifestyle,
      skin: skin ? { ...skin, concerns: parsedSkinConcerns, product_allergies: JSON.parse(skin.product_allergies || '[]') } : null,
      dials,
      journey: journey ? {
        ...journey,
        completed_days: JSON.parse(journey.completed_days || '[]'),
        reflections: JSON.parse(journey.reflections || '{}')
      } : null,
      todaysCheckin,
      todaysMeals,
      todaysSkin,
      todaysShift,
      topPriorities,
      latestNudge,
      globalBroadcast,
      hasCompletedOnboarding: Boolean(bodyProfile && goals && allergyProfile),
    });
  } catch (error) {
    console.error('Fetch me error:', error);
    return NextResponse.json({ error: 'Failed to load user profile' }, { status: 500 });
  }
}
