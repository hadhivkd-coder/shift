const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'shift.db');
const db = new Database(dbPath);

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
  const createdDate = new Date(today);
  createdDate.setDate(createdDate.getDate() - m.daysEnrolled);
  const createdStr = createdDate.toISOString().replace('T', ' ').substring(0, 19);

  db.prepare(`
    INSERT OR IGNORE INTO users (id, email, password_hash, role, created_at)
    VALUES (?, ?, ?, 'user', ?)
  `).run(m.id, m.email, userPasswordHash, createdStr);

  db.prepare(`
    INSERT OR REPLACE INTO profiles (user_id, name, preferred_name, city, country, occupation, created_at)
    VALUES (?, ?, ?, ?, 'India', ?, ?)
  `).run(m.id, m.name, m.preferredName, m.city, m.occupation, createdStr);

  db.prepare(`
    INSERT OR REPLACE INTO body_profiles (user_id, weight_kg, waist_cm, bmi, desired_direction, activity_level)
    VALUES (?, ?, ?, ?, 'Sustainable Fat Loss & Energy', 'Moderate')
  `).run(m.id, m.weightKg, m.waistCm, m.bmi);

  db.prepare(`
    INSERT OR REPLACE INTO goals (user_id, primary_goals, past_barriers, success_definition)
    VALUES (?, ?, ?, ?)
  `).run(
    m.id,
    JSON.stringify(['Sustainable weight management', 'Energy', 'Habit Consistency']),
    JSON.stringify(m.barriers),
    'Sustainable daily rhythm without extreme restrictions.'
  );

  db.prepare(`
    INSERT OR REPLACE INTO health_screens (user_id, conditions, has_medication, safety_status)
    VALUES (?, '[]', 'NO', 'NORMAL')
  `).run(m.id);

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

  db.prepare(`
    INSERT OR IGNORE INTO consents (user_id, health_profile_consent, recommendations_consent, analytics_consent)
    VALUES (?, 1, 1, 1)
  `).run(m.id);
}

const count = db.prepare('SELECT count(*) as c FROM users').get();
console.log('Seeding complete! Total users now in shift.db:', count.c);
