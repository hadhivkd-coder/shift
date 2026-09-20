import { db, initDatabase } from './index';
import bcrypt from 'bcryptjs';

export function seedDemoData() {
  initDatabase();

  const coachExisting = db.prepare('SELECT id FROM users WHERE email = ?').get('coach@shift.health');
  if (!coachExisting) {
    const salt = bcrypt.genSaltSync(10);
    const coachPasswordHash = bcrypt.hashSync('demo1234', salt);
    const coachId = 'usr_demo_coach_2026';
    db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `).run(coachId, 'coach@shift.health', coachPasswordHash, 'operator');

    db.prepare(`
      INSERT OR IGNORE INTO profiles (user_id, name, preferred_name, occupation)
      VALUES (?, ?, ?, ?)
    `).run(coachId, 'Coach Anjali', 'Anjali', 'Lead Wellness Concierge');

    // Add sample coach note if notes table exists
    try {
      db.prepare(`
        INSERT OR IGNORE INTO operator_notes (id, user_id, operator_id, note_text)
        VALUES (?, ?, ?, ?)
      `).run(
        'op_note_1',
        'usr_demo_hadhi_2026',
        coachId,
        'Member is doing exceptionally well with Plate and Repeat dials (5-day streaks). Fish allergy verified active. Recommending extra Kadala portion with breakfast Dosa to maintain afternoon satiety.'
      );
    } catch {}
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('hadhi@example.com');
  if (existing) {
    seedCohortMembers();
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const userPasswordHash = bcrypt.hashSync('demo1234', salt);
  const adminPasswordHash = bcrypt.hashSync('admin1234', salt);
  const coachPasswordHash = bcrypt.hashSync('demo1234', salt);

  const hadhiId = 'usr_demo_hadhi_2026';
  const adminId = 'usr_demo_admin_2026';
  const coachId = 'usr_demo_coach_2026';

  // Insert Users
  db.prepare(`
    INSERT INTO users (id, email, password_hash, role)
    VALUES (?, ?, ?, ?)
  `).run(hadhiId, 'hadhi@example.com', userPasswordHash, 'user');

  db.prepare(`
    INSERT INTO users (id, email, password_hash, role)
    VALUES (?, ?, ?, ?)
  `).run(adminId, 'admin@shift.health', adminPasswordHash, 'admin');

  db.prepare(`
    INSERT INTO users (id, email, password_hash, role)
    VALUES (?, ?, ?, ?)
  `).run(coachId, 'coach@shift.health', coachPasswordHash, 'operator');

  db.prepare(`
    INSERT INTO profiles (user_id, name, preferred_name, occupation)
    VALUES (?, ?, ?, ?)
  `).run(coachId, 'Coach Anjali', 'Anjali', 'Lead Wellness Concierge');

  // Hadhi Profile
  db.prepare(`
    INSERT INTO profiles (user_id, name, preferred_name, dob, sex, country, state, city, timezone, occupation, work_schedule, routine)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    hadhiId,
    'Hadhi Rahman',
    'Hadhi',
    '1996-05-14',
    'Male',
    'India',
    'Kerala',
    'Kochi',
    'Asia/Kolkata',
    'Software Engineer',
    '9 AM - 6 PM Desk-based',
    'Works predominantly sitting; short morning rush; evening relaxation window.'
  );

  // Body Profile (84.5 kg, 176 cm, 92 cm waist -> BMI ~27.3 neutral reference)
  db.prepare(`
    INSERT INTO body_profiles (user_id, height_cm, weight_kg, waist_cm, hips_cm, body_fat_pct, weight_goal, desired_direction, activity_level, daily_steps_est, exercise_freq, bmi)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(hadhiId, 176, 84.5, 92, 102, 24.5, 'Fat-loss & sustainable weight management', 'Gradual fat loss & strength maintenance', 'Moderate', 7500, '3 days/week', 27.3);

  // Goals
  db.prepare(`
    INSERT INTO goals (user_id, primary_goals, success_definition, past_barriers)
    VALUES (?, ?, ?, ?)
  `).run(
    hadhiId,
    JSON.stringify(['Weight management', 'Fat loss', 'Energy', 'Skin', 'Daily consistency']),
    'Fitting comfortably into my clothes, having sustained energy during afternoon coding without 4 PM brain fog, and building lifelong habits without giving up Kerala food.',
    JSON.stringify(['Lack of time', 'Late work shifts', 'Social dining on weekends', 'Inconsistent sleep'])
  );

  // Health Screen (NORMAL, fish allergy noted, no dangerous meds)
  db.prepare(`
    INSERT INTO health_screens (user_id, conditions, has_medication, medication_details, pregnant_or_postpartum, safety_status, safety_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    hadhiId,
    JSON.stringify([]),
    'NO',
    '',
    0,
    'NORMAL',
    'Baseline health screen passed. Strict allergy filter active for Fish and Shellfish.'
  );

  // Allergy Profile
  db.prepare(`
    INSERT INTO allergy_profiles (user_id, allergies, intolerances, preferences, cultural_restrictions)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    hadhiId,
    JSON.stringify(['Fish', 'Shellfish']),
    JSON.stringify([]),
    JSON.stringify(['Non-vegetarian', 'Prefers home-cooked traditional meals']),
    JSON.stringify(['Halal'])
  );

  // Food Profile
  db.prepare(`
    INSERT INTO food_profiles (user_id, dining_locations, outside_eating_freq, cook_source, favorite_foods, cuisine_preferences)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    hadhiId,
    JSON.stringify(['Home', 'Office canteen']),
    '1-2 times per week',
    'Family and self',
    JSON.stringify(['Rice', 'Dosa', 'Appam', 'Chicken roast', 'Egg curry', 'Thoran', 'Curd', 'Chapatis', 'Biriyani']),
    JSON.stringify(['Kerala', 'South Indian', 'Continental'])
  );

  // Lifestyle Profile
  db.prepare(`
    INSERT INTO lifestyle_profiles (user_id, sleep_hours, bedtime, wake_time, sleep_consistency, water_liters, daily_steps, work_hours, screen_time, stress_level, smoking_status, alcohol_use, travel_freq, night_shift)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    hadhiId,
    6.5,
    '23:15',
    '06:45',
    'Moderate',
    2.6,
    7800,
    8.5,
    9.0,
    'Moderate',
    'Non-smoker',
    'Non-drinker',
    'Rarely',
    0
  );

  // Skin Profile
  db.prepare(`
    INSERT INTO skin_profiles (user_id, perceived_type, concerns, sensitivity, redness, sun_exposure, sunscreen_use, current_routine, product_allergies)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    hadhiId,
    'Combination',
    JSON.stringify(['Mild forehead breakouts', 'Afternoon oiliness', 'Sun protection in coastal humidity']),
    'Low',
    'Minimal',
    'Moderate commute exposure',
    'Daily in morning',
    'Gentle foaming cleanser, light gel moisturizer, SPF 50 sunscreen',
    JSON.stringify([])
  );

  // Five Dials Initial
  db.prepare(`
    INSERT INTO five_dials (user_id, dial_plate, dial_move, dial_lift, dial_rest, dial_repeat, plate_action, move_action, lift_action, rest_action, repeat_action, plate_streak, move_streak, lift_streak, rest_streak, repeat_streak)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    hadhiId,
    4, 4, 3, 3, 5,
    'Keep 1/2 plate thoran/vegetables with lunch and dinner',
    '15-minute post-lunch walk + 7,500 daily steps',
    '3 home bodyweight/dumbbell sessions completed this week',
    'Begin 10:30 PM dim-lighting and phone wind-down',
    '6 consecutive daily check-ins logged',
    5, 6, 3, 4, 6
  );

  // Seed 14 days of realistic check-ins trending downward healthily
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const weight = (85.4 - (13 - i) * 0.07).toFixed(1);
    const waist = (92.8 - (13 - i) * 0.05).toFixed(1);
    const sleep = (6.2 + (i % 3) * 0.4).toFixed(1);
    const water = 2400 + (i % 4) * 200;
    const steps = 6800 + (i % 5) * 450;

    db.prepare(`
      INSERT OR REPLACE INTO daily_checkins (id, user_id, date, sleep_hours, sleep_quality, water_ml, movement_type, movement_duration_mins, meals_followed_plan, energy_level, stress_level, weight_kg, waist_cm, mood, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `chk_${hadhiId}_${dateStr}`,
      hadhiId,
      dateStr,
      parseFloat(sleep),
      i % 2 === 0 ? 'Good' : 'Restful',
      water,
      'Brisk Walk + Resistance',
      35,
      i === 3 ? 'Mostly' : 'Yes',
      4,
      2,
      parseFloat(weight),
      parseFloat(waist),
      'Energetic & focused',
      i === 0 ? 'Felt sustained energy throughout afternoon coding.' : null
    );
  }

  // Today's Meals
  const todayStr = today.toISOString().split('T')[0];
  db.prepare(`
    INSERT INTO meal_logs (id, user_id, date, meal_type, food_items, portion_desc, protein_present, plants_present, hunger_before, fullness_after, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    `meal_${hadhiId}_1`,
    hadhiId,
    todayStr,
    'Breakfast',
    '2 Dosas with 2 Boiled Eggs & Coconut Sambar',
    '2 medium dosas, 2 whole eggs, 1 bowl sambar',
    1, 1, 3, 4, 'Eggs kept me full past 1 PM.'
  );

  db.prepare(`
    INSERT INTO meal_logs (id, user_id, date, meal_type, food_items, portion_desc, protein_present, plants_present, hunger_before, fullness_after, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    `meal_${hadhiId}_2`,
    hadhiId,
    todayStr,
    'Lunch',
    'Matta Rice, Kerala Spiced Chicken Roast, Cabbage Thoran & Fresh Curd',
    '1 cup rice, 1 palm chicken, 1 big cup cabbage thoran, 1 bowl curd',
    1, 1, 4, 4, 'Balanced plate rule followed.'
  );

  // 30-Day Journey Progress (Day 6 completed, Day 7 next)
  const completedDays = [1, 2, 3, 4, 5, 6];
  const reflections = {
    1: 'Understood that I do not need to starve to lose body fat.',
    2: 'Added boiled eggs to my morning breakfast; immediate difference in 11 AM cravings.',
    3: 'Walked 20 minutes outside in the evening. Cleared my mental fog.',
    4: 'Organized my grocery list with high-protein staples.',
    5: 'Tried the 15-minute craving protocol when offered sweets at the office. Worked like a charm.',
    6: 'Restructured my dinner plate with 1/2 vegetables. Slept much lighter.'
  };

  db.prepare(`
    INSERT INTO journey_progress (user_id, current_day, completed_days, streak, last_completed_at, reflections)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    hadhiId,
    7,
    JSON.stringify(completedDays),
    6,
    todayStr,
    JSON.stringify(reflections)
  );

  // Smart Groceries
  const groceries = [
    { cat: 'PROTEIN', name: 'Fresh Eggs (Farm pack)', qty: '2 dozen', purchased: 1 },
    { cat: 'PROTEIN', name: 'Country Chicken Breast', qty: '1 kg', purchased: 1 },
    { cat: 'PROTEIN', name: 'Black Chickpeas (Kadala)', qty: '500 g', purchased: 0 },
    { cat: 'VEGETABLES', name: 'Cabbage for Thoran', qty: '1 head', purchased: 1 },
    { cat: 'VEGETABLES', name: 'French Beans', qty: '500 g', purchased: 1 },
    { cat: 'VEGETABLES', name: 'Shallots (Cheriya Ulli)', qty: '500 g', purchased: 0 },
    { cat: 'CARBOHYDRATES', name: 'Kerala Matta Rice', qty: '5 kg', purchased: 1 },
    { cat: 'CARBOHYDRATES', name: 'Whole Wheat Atta', qty: '2 kg', purchased: 1 },
    { cat: 'DAIRY / ALTERNATIVES', name: 'Set Curd / Dahi', qty: '1 kg', purchased: 1 },
    { cat: 'PANTRY', name: 'Roasted Foxnuts (Makhana)', qty: '200 g', purchased: 0 },
  ];

  for (const g of groceries) {
    db.prepare(`
      INSERT INTO smart_groceries (id, user_id, category, item_name, quantity, purchased)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(`groc_${Math.random().toString(36).substring(2, 9)}`, hadhiId, g.cat, g.name, g.qty, g.purchased);
  }

  // Consents
  db.prepare(`
    INSERT INTO consents (user_id, health_profile_consent, recommendations_consent, analytics_consent)
    VALUES (?, 1, 1, 0)
  `).run(hadhiId);

  // Seed sample operator notes & custom actions
  db.prepare(`
    INSERT INTO operator_notes (id, user_id, operator_id, note_text)
    VALUES (?, ?, ?, ?)
  `).run(
    'op_note_1',
    hadhiId,
    coachId,
    'Member is doing exceptionally well with Plate and Repeat dials (5-day streaks). Fish allergy verified active. Recommending extra Kadala portion with breakfast Dosa to maintain afternoon satiety.'
  );

  db.prepare(`
    INSERT INTO operator_custom_actions (id, user_id, operator_id, dial, title, subtitle, why_it_matters)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'op_act_1',
    hadhiId,
    coachId,
    'PLATE',
    'Add Kadala or boiled eggs to morning Dosa',
    'Pair traditional breakfast with 15g+ plant/egg protein',
    'Prevents the 11 AM insulin dip and stabilizes hunger until 1:30 PM lunch.'
  );

  // Audit log
  db.prepare(`
    INSERT INTO audit_logs (id, user_id, action, details)
    VALUES (?, ?, ?, ?)
  `).run('aud_seed_1', hadhiId, 'INITIAL_HEALTH_PROFILE_CREATED', 'Demo user Hadhi seeded with complete 20 KG Blueprint profile.');

  seedCohortMembers();
}

export function seedCohortMembers() {
  const salt = bcrypt.genSaltSync(10);
  const userPasswordHash = bcrypt.hashSync('demo1234', salt);

  const cohort = [
    {
      id: 'usr_priya_2026',
      email: 'priya.nair@shiftapp.io',
      name: 'Priya Nair',
      preferredName: 'Priya',
      city: 'Bengaluru',
      occupation: 'Marketing Director',
      status: 'DOING_GOOD',
      streak: 5,
      journeyDay: 10,
      weightKg: 68.2,
      waistCm: 76,
      bmi: 24.1,
      dials: { plate: 4, move: 4, lift: 3, rest: 4, repeat: 5 },
      barriers: ['Afternoon desk fatigue', 'Frequent client dinners'],
      topFriction: 'Managing portion sizes during late client dinners',
      daysAgoLastCheckin: 0,
      daysEnrolled: 12,
      weeklyDifficulties: 'Client dinners twice this week; managed to prioritize salad and grilled fish first.'
    },
    {
      id: 'usr_arun_2026',
      email: 'arun.kumar@shiftapp.io',
      name: 'Arun Kumar',
      preferredName: 'Arun',
      city: 'Mumbai',
      occupation: 'Financial Analyst',
      status: 'NEEDS_ATTENTION',
      streak: 0,
      journeyDay: 3,
      weightKg: 91.4,
      waistCm: 104,
      bmi: 29.2,
      dials: { plate: 2, move: 2, lift: 1, rest: 2, repeat: 1 },
      barriers: ['Late office hours', '12-hour desk shifts', 'Evening exhaustion'],
      topFriction: 'Stalled on Day 3 for 5 days. Late night shifts (12 hrs) causing missed check-ins and skipped breakfast.',
      daysAgoLastCheckin: 4,
      daysEnrolled: 9,
      weeklyDifficulties: 'Deadlines pushed dinner past 11 PM. Woke up unrefreshed and skipped breakfast.'
    },
    {
      id: 'usr_meera_2026',
      email: 'meera.k@shiftapp.io',
      name: 'Meera Krishnan',
      preferredName: 'Meera',
      city: 'Chennai',
      occupation: 'Architect',
      status: 'NEEDS_ATTENTION',
      streak: 0,
      journeyDay: 4,
      weightKg: 76.8,
      waistCm: 86,
      bmi: 27.5,
      dials: { plate: 2, move: 3, lift: 1, rest: 1, repeat: 2 },
      barriers: ['Weekend social dining', 'Blue light insomnia', 'Irregular meals'],
      topFriction: 'Stalled on Day 4 after weekend dining. Rest dial at lowest level (sleep deficit & high stress).',
      daysAgoLastCheckin: 3,
      daysEnrolled: 8,
      weeklyDifficulties: 'Weekend party completely derailed routine. Felt guilty and avoided tracking.'
    },
    {
      id: 'usr_vikram_2026',
      email: 'vikram.p@shiftapp.io',
      name: 'Vikram Patel',
      preferredName: 'Vikram',
      city: 'Ahmedabad',
      occupation: 'Tech Founder',
      status: 'DOING_GOOD',
      streak: 9,
      journeyDay: 23,
      weightKg: 81.0,
      waistCm: 90,
      bmi: 25.8,
      dials: { plate: 5, move: 4, lift: 4, rest: 3, repeat: 5 },
      barriers: ['High work stress', 'Frequent investor calls'],
      topFriction: 'Occasional screen time overruns past 11 PM',
      daysAgoLastCheckin: 0,
      daysEnrolled: 25,
      weeklyDifficulties: 'Late strategy calls cut sleep to 6 hours on Thursday, but hit 8,000 steps every day.'
    },
    {
      id: 'usr_sneha_2026',
      email: 'sneha.rao@shiftapp.io',
      name: 'Sneha Rao',
      preferredName: 'Sneha',
      city: 'Hyderabad',
      occupation: 'HR Operations Lead',
      status: 'NEEDS_ATTENTION',
      streak: 1,
      journeyDay: 6,
      weightKg: 72.5,
      waistCm: 82,
      bmi: 26.3,
      dials: { plate: 2, move: 2, lift: 2, rest: 2, repeat: 2 },
      barriers: ['Skipping breakfast', 'Evening sugar cravings', 'Low water intake'],
      topFriction: 'Struggling with 4 PM sugar cravings after skipping breakfast protein anchor.',
      daysAgoLastCheckin: 2,
      daysEnrolled: 10,
      weeklyDifficulties: 'Skipped breakfast 3 days in a row; ended up ordering pastries at 4:30 PM.'
    },
    {
      id: 'usr_tariq_2026',
      email: 'tariq.m@shiftapp.io',
      name: 'Tariq Mansoor',
      preferredName: 'Tariq',
      city: 'Kozhikode',
      occupation: 'Product Designer',
      status: 'DOING_GOOD',
      streak: 4,
      journeyDay: 16,
      weightKg: 79.2,
      waistCm: 88,
      bmi: 25.4,
      dials: { plate: 4, move: 4, lift: 3, rest: 4, repeat: 4 },
      barriers: ['Late night snacking while designing'],
      topFriction: 'Balancing late design deadlines with 11 PM wind-down curfew',
      daysAgoLastCheckin: 0,
      daysEnrolled: 18,
      weeklyDifficulties: 'Substituted late evening cookies with salted makhana and chamomile tea.'
    },
    {
      id: 'usr_divya_2026',
      email: 'divya.s@shiftapp.io',
      name: 'Divya Sharma',
      preferredName: 'Divya',
      city: 'New Delhi',
      occupation: 'University Professor',
      status: 'DOING_GOOD',
      streak: 7,
      journeyDay: 29,
      weightKg: 64.1,
      waistCm: 72,
      bmi: 23.2,
      dials: { plate: 4, move: 5, lift: 3, rest: 4, repeat: 5 },
      barriers: ['Exam grading stress', 'Varied lecture timings'],
      topFriction: 'Maintaining resistance training frequency during semester evaluations',
      daysAgoLastCheckin: 0,
      daysEnrolled: 32,
      weeklyDifficulties: 'Only got 2 gym sessions instead of 3, but maintained daily 9,000 steps campus walking.'
    },
    {
      id: 'usr_rohan_2026',
      email: 'rohan.v@shiftapp.io',
      name: 'Rohan Varma',
      preferredName: 'Rohan',
      city: 'Pune',
      occupation: 'Regional Sales Manager',
      status: 'NEEDS_ATTENTION',
      streak: 0,
      journeyDay: 2,
      weightKg: 88.6,
      waistCm: 98,
      bmi: 28.7,
      dials: { plate: 1, move: 2, lift: 1, rest: 2, repeat: 1 },
      barriers: ['Frequent inter-city highway travel', 'Highway restaurant food', 'Zero regular routine'],
      topFriction: 'Stuck on Day 2 for 7 days. High road travel frequency, no check-in logged for 6 days.',
      daysAgoLastCheckin: 6,
      daysEnrolled: 14,
      weeklyDifficulties: 'Traveled between Pune and Kolhapur; all meals were from highway dhabas.'
    },
    {
      id: 'usr_ananya_2026',
      email: 'ananya.s@shiftapp.io',
      name: 'Ananya Sen',
      preferredName: 'Ananya',
      city: 'Kolkata',
      occupation: 'Data Scientist',
      status: 'DOING_GOOD',
      streak: 4,
      journeyDay: 8,
      weightKg: 62.0,
      waistCm: 70,
      bmi: 23.8,
      dials: { plate: 4, move: 3, lift: 3, rest: 3, repeat: 4 },
      barriers: ['Sitting 10+ hours uninterrupted', 'Office canteen fried snacks'],
      topFriction: 'Taking regular movement breaks during remote coding sprints',
      daysAgoLastCheckin: 1,
      daysEnrolled: 9,
      weeklyDifficulties: 'Long machine learning debugging sprint made me forget afternoon steps.'
    }
  ];

  const today = new Date();

  for (const m of cohort) {
    // Insert User with staggered created_at
    const createdDate = new Date(today);
    createdDate.setDate(createdDate.getDate() - m.daysEnrolled);
    const createdStr = createdDate.toISOString().replace('T', ' ').substring(0, 19);

    db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash, role, created_at)
      VALUES (?, ?, ?, 'user', ?)
    `).run(m.id, m.email, userPasswordHash, createdStr);

    // Profile
    db.prepare(`
      INSERT OR REPLACE INTO profiles (user_id, name, preferred_name, city, country, occupation, created_at)
      VALUES (?, ?, ?, ?, 'India', ?, ?)
    `).run(m.id, m.name, m.preferredName, m.city, m.occupation, createdStr);

    // Body Profile
    db.prepare(`
      INSERT OR REPLACE INTO body_profiles (user_id, weight_kg, waist_cm, bmi, desired_direction, activity_level)
      VALUES (?, ?, ?, ?, 'Sustainable Fat Loss & Energy', 'Moderate')
    `).run(m.id, m.weightKg, m.waistCm, m.bmi);

    // Goals & Barriers
    db.prepare(`
      INSERT OR REPLACE INTO goals (user_id, primary_goals, past_barriers, success_definition)
      VALUES (?, ?, ?, ?)
    `).run(
      m.id,
      JSON.stringify(['Sustainable weight management', 'Energy', 'Habit Consistency']),
      JSON.stringify(m.barriers),
      'Sustainable daily rhythm without extreme restrictions.'
    );

    // Health Screen (NORMAL)
    db.prepare(`
      INSERT OR REPLACE INTO health_screens (user_id, conditions, has_medication, safety_status)
      VALUES (?, '[]', 'NO', 'NORMAL')
    `).run(m.id);

    // Five Dials
    db.prepare(`
      INSERT OR REPLACE INTO five_dials (user_id, dial_plate, dial_move, dial_lift, dial_rest, dial_repeat, plate_streak, move_streak, lift_streak, rest_streak, repeat_streak)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      m.id,
      m.dials.plate,
      m.dials.move,
      m.dials.lift,
      m.dials.rest,
      m.dials.repeat,
      m.streak,
      m.streak,
      Math.max(1, m.streak - 1),
      Math.max(1, m.streak - 1),
      m.streak
    );

    // Journey Progress
    const completedArr = Array.from({ length: m.journeyDay }, (_, i) => i + 1);
    db.prepare(`
      INSERT OR REPLACE INTO journey_progress (user_id, current_day, completed_days, streak, last_completed_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      m.id,
      m.journeyDay,
      JSON.stringify(completedArr),
      m.streak,
      createdStr
    );

    // Seed recent check-in if active
    if (m.daysAgoLastCheckin <= 2) {
      const chkDate = new Date(today);
      chkDate.setDate(chkDate.getDate() - m.daysAgoLastCheckin);
      const chkStr = chkDate.toISOString().split('T')[0];
      db.prepare(`
        INSERT OR REPLACE INTO daily_checkins (id, user_id, date, sleep_hours, sleep_quality, water_ml, movement_type, movement_duration_mins, meals_followed_plan, energy_level, stress_level, weight_kg, waist_cm, mood)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `chk_${m.id}_${chkStr}`,
        m.id,
        chkStr,
        m.dials.rest >= 3 ? 7.2 : 5.8,
        m.dials.rest >= 3 ? 'Good' : 'Restless',
        2600,
        'Brisk Walking',
        30,
        m.status === 'DOING_GOOD' ? 'Yes' : 'Mostly',
        m.status === 'DOING_GOOD' ? 4 : 2,
        m.status === 'DOING_GOOD' ? 2 : 4,
        m.weightKg,
        m.waistCm,
        m.status === 'DOING_GOOD' ? 'Focused & motivated' : 'Fatigued'
      );
    }

    // Weekly review
    db.prepare(`
      INSERT OR REPLACE INTO weekly_reviews (id, user_id, week_start_date, wins, difficulties, dial_improvements, dial_needs_attention)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      `rev_${m.id}_1`,
      m.id,
      createdStr.split(' ')[0],
      m.status === 'DOING_GOOD' ? 'Consistently anchored breakfast protein and hit daily step target.' : 'Started strong on Day 1-2.',
      m.weeklyDifficulties,
      m.status === 'DOING_GOOD' ? 'Plate and Repeat dials feeling automatic.' : 'Move dial was okay.',
      m.status === 'DOING_GOOD' ? 'Work on wind-down rest routine.' : 'Rest and Plate dials completely slipped.'
    );

    // Consents
    db.prepare(`
      INSERT OR IGNORE INTO consents (user_id, health_profile_consent, recommendations_consent, analytics_consent)
      VALUES (?, 1, 1, 1)
    `).run(m.id);
  }
}

