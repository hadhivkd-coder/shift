import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { evaluateHealthScreen, formatBmiScreening } from '@/lib/safety/engine';
import { generateTodaysShift, generateTopPriorities } from '@/lib/personalization/engine';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const data = await req.json();
    const {
      about,
      body,
      goals,
      health,
      allergies,
      food,
      lifestyle,
      skin,
    } = data;

    // 1. Profile / About You
    if (about) {
      db.prepare(`
        INSERT OR REPLACE INTO profiles (user_id, name, preferred_name, dob, sex, country, state, city, occupation, work_schedule, routine)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        user.id,
        about.name || user.name || 'Member',
        about.preferredName || about.name,
        about.dob || '',
        about.sex || '',
        about.country || 'India',
        about.state || '',
        about.city || '',
        about.occupation || '',
        about.workSchedule || '',
        about.routine || ''
      );
    }

    // 2. Body Profile & Neutral BMI calculation
    let bmiValue = 0;
    if (body) {
      const height = parseFloat(body.heightCm) || 170;
      const weight = parseFloat(body.weightKg) || 70;
      const bmiResult = formatBmiScreening(weight, height);
      bmiValue = bmiResult.bmi;

      db.prepare(`
        INSERT OR REPLACE INTO body_profiles (user_id, height_cm, weight_kg, waist_cm, hips_cm, body_fat_pct, weight_goal, desired_direction, activity_level, daily_steps_est, exercise_freq, bmi)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        user.id,
        height,
        weight,
        parseFloat(body.waistCm) || null,
        parseFloat(body.hipsCm) || null,
        parseFloat(body.bodyFatPct) || null,
        body.weightGoal || 'Sustainable health & weight management',
        body.desiredDirection || 'Gradual fat loss & strength maintenance',
        body.activityLevel || 'Moderate',
        parseInt(body.dailyStepsEst) || 7000,
        body.exerciseFreq || '3 days/week',
        bmiValue
      );
    }

    // 3. Goals
    if (goals) {
      db.prepare(`
        INSERT OR REPLACE INTO goals (user_id, primary_goals, success_definition, past_barriers)
        VALUES (?, ?, ?, ?)
      `).run(
        user.id,
        JSON.stringify(goals.primaryGoals || []),
        goals.successDefinition || '',
        JSON.stringify(goals.pastBarriers || [])
      );
    }

    // 4. Health Screen & Safety Engine
    let safetyAssessment = evaluateHealthScreen({
      conditions: health?.conditions || [],
      hasMedication: health?.hasMedication,
      medicationDetails: health?.medicationDetails,
      pregnantOrPostpartum: health?.pregnantOrPostpartum,
      country: about?.country || 'India',
    });

    if (health) {
      db.prepare(`
        INSERT OR REPLACE INTO health_screens (user_id, conditions, has_medication, medication_details, pregnant_or_postpartum, safety_status, safety_notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        user.id,
        JSON.stringify(health.conditions || []),
        health.hasMedication || 'NO',
        health.medicationDetails || '',
        health.pregnantOrPostpartum ? 1 : 0,
        safetyAssessment.status,
        safetyAssessment.message
      );
    }

    // 5. Allergies & Food Safety
    if (allergies) {
      db.prepare(`
        INSERT OR REPLACE INTO allergy_profiles (user_id, allergies, intolerances, preferences, cultural_restrictions)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        user.id,
        JSON.stringify(allergies.allergies || []),
        JSON.stringify(allergies.intolerances || []),
        JSON.stringify(allergies.preferences || []),
        JSON.stringify(allergies.culturalRestrictions || [])
      );
    }

    // 6. Food Profile
    if (food) {
      db.prepare(`
        INSERT OR REPLACE INTO food_profiles (user_id, dining_locations, outside_eating_freq, cook_source, favorite_foods, cuisine_preferences)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        user.id,
        JSON.stringify(food.diningLocations || []),
        food.outsideEatingFreq || '1-2 times/week',
        food.cookSource || 'Home',
        JSON.stringify(food.favoriteFoods || []),
        JSON.stringify(food.cuisinePreferences || ['Kerala', 'Indian'])
      );
    }

    // 7. Lifestyle Profile
    if (lifestyle) {
      db.prepare(`
        INSERT OR REPLACE INTO lifestyle_profiles (user_id, sleep_hours, bedtime, wake_time, sleep_consistency, water_liters, daily_steps, work_hours, screen_time, stress_level, smoking_status, alcohol_use, travel_freq, night_shift)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        user.id,
        parseFloat(lifestyle.sleepHours) || 7,
        lifestyle.bedtime || '23:00',
        lifestyle.wakeTime || '07:00',
        lifestyle.sleepConsistency || 'Moderate',
        parseFloat(lifestyle.waterLiters) || 2.5,
        parseInt(lifestyle.dailySteps) || 7000,
        parseFloat(lifestyle.workHours) || 8,
        parseFloat(lifestyle.screenTime) || 8,
        lifestyle.stressLevel || 'Moderate',
        lifestyle.smokingStatus || 'Non-smoker',
        lifestyle.alcoholUse || 'Non-drinker',
        lifestyle.travelFreq || 'Rarely',
        lifestyle.nightShift ? 1 : 0
      );
    }

    // 8. Skin Profile
    if (skin) {
      db.prepare(`
        INSERT OR REPLACE INTO skin_profiles (user_id, perceived_type, concerns, sensitivity, redness, sun_exposure, sunscreen_use, current_routine, product_allergies)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        user.id,
        skin.perceivedType || 'Combination',
        JSON.stringify(skin.concerns || []),
        skin.sensitivity || 'Low',
        skin.redness || 'Minimal',
        skin.sunExposure || 'Moderate',
        skin.sunscreenUse || 'Daily',
        skin.currentRoutine || '',
        JSON.stringify(skin.productAllergies || [])
      );
    }

    // Initialize Five Dials tailored to user
    const existingDials = db.prepare('SELECT user_id FROM five_dials WHERE user_id = ?').get(user.id);
    if (!existingDials) {
      db.prepare(`
        INSERT INTO five_dials (user_id, dial_plate, dial_move, dial_lift, dial_rest, dial_repeat, plate_action, move_action, lift_action, rest_action, repeat_action)
        VALUES (?, 3, 3, 2, 3, 4, ?, ?, ?, ?, ?)
      `).run(
        user.id,
        'Anchor your first main meal with a palm-sized protein source',
        'Incorporate a 15-minute brisk walk after your largest meal',
        '2 short strength sessions this week to preserve lean muscle',
        'Establish a dim-lighting electronic wind-down 45 minutes before sleep',
        'Log a 60-second daily check-in to build momentum'
      );
    }

    // Initialize 30-Day Journey Progress at Day 1
    const existingJourney = db.prepare('SELECT user_id FROM journey_progress WHERE user_id = ?').get(user.id);
    if (!existingJourney) {
      db.prepare(`
        INSERT INTO journey_progress (user_id, current_day, completed_days, streak)
        VALUES (?, 1, '[]', 0)
      `).run(user.id);
    }

    // Initialize Smart Groceries based on diet
    const existingGroceries = db.prepare('SELECT id FROM smart_groceries WHERE user_id = ? LIMIT 1').get(user.id);
    if (!existingGroceries) {
      const initialGroceries = [
        { cat: 'PROTEIN', name: 'Fresh Farm Eggs', qty: '1 dozen' },
        { cat: 'PROTEIN', name: 'Black Chickpeas / Kadala', qty: '500g' },
        { cat: 'VEGETABLES', name: 'Cabbage for Thoran', qty: '1 head' },
        { cat: 'VEGETABLES', name: 'Shallots (Cheriya Ulli)', qty: '500g' },
        { cat: 'CARBOHYDRATES', name: 'Kerala Matta Rice', qty: '2 kg' },
        { cat: 'PANTRY', name: 'Roasted Makhana (Foxnuts)', qty: '100g' },
      ];
      for (const item of initialGroceries) {
        db.prepare(`
          INSERT INTO smart_groceries (id, user_id, category, item_name, quantity, purchased)
          VALUES (?, ?, ?, ?, ?, 0)
        `).run(`groc_${Math.random().toString(36).substring(2, 9)}`, user.id, item.cat, item.name, item.qty);
      }
    }

    // Log in audit table
    db.prepare('INSERT INTO audit_logs (id, user_id, action, details) VALUES (?, ?, ?, ?)').run(
      `aud_${Date.now()}`,
      user.id,
      'ONBOARDING_COMPLETED',
      `Health profile created with safety status: ${safetyAssessment.status}`
    );

    const userContext = {
      name: about?.name || user.name || 'Member',
      primaryGoals: goals?.primaryGoals || [],
      allergies: allergies?.allergies || [],
      intolerances: allergies?.intolerances || [],
      preferences: allergies?.preferences || [],
      culturalRestrictions: allergies?.culturalRestrictions || [],
      cuisinePreferences: food?.cuisinePreferences || ['Kerala', 'Indian'],
      diningLocations: food?.diningLocations || [],
      occupation: about?.occupation,
      activityLevel: body?.activityLevel,
      sleepHours: parseFloat(lifestyle?.sleepHours) || 7,
      bedtime: lifestyle?.bedtime,
      skinConcerns: skin?.concerns || [],
    };

    const topPriorities = generateTopPriorities(userContext);
    const todaysShift = generateTodaysShift(userContext);

    return NextResponse.json({
      success: true,
      safetyAssessment,
      bmi: bmiValue,
      topPriorities,
      todaysShift,
    });
  } catch (error) {
    console.error('Onboarding save error:', error);
    return NextResponse.json({ error: 'Failed to complete profile' }, { status: 500 });
  }
}
