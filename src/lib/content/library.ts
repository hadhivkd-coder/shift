export interface LibraryArticle {
  slug: string;
  category: 'Nutrition' | 'Movement' | 'Sleep' | 'Skin' | 'Cravings' | 'Restaurants' | 'Plateaus' | 'Maintenance';
  title: string;
  readTime: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
}

export const LIBRARY_ARTICLES: LibraryArticle[] = [
  {
    slug: 'five-dials-explained',
    category: 'Nutrition',
    title: 'The Five Dials Framework: Why All-or-Nothing Diets Fail',
    readTime: '4 min read',
    summary: 'How PLATE, MOVE, LIFT, REST, and REPEAT interact as a unified lifestyle operating system.',
    content: [
      'Most fitness programs demand that you change everything at once: wake up at 5 AM, cut all carbohydrates, lift heavy weights 6 days a week, and drink gallons of water. Within two weeks, willpower runs out, life intervenes, and you feel like a failure.',
      'SHIFT replaces all-or-nothing thinking with The Five Dials: Plate, Move, Lift, Rest, and Repeat. Instead of turning every dial to 10 immediately, we tune each dial gradually to your life situation.',
      'If you have a brutal work deadline, your Lift dial might dial down to 2 while your Move dial stays at 3 with a post-lunch walk. As long as your Repeat dial keeps ticking, your momentum remains unbroken.',
    ],
    keyTakeaways: [
      'Never try to turn every dial to maximum simultaneously.',
      'Consistency at Level 3 outperforms intermittent bursts at Level 5.',
      'The Repeat dial is the master dial that compounds your progress.',
    ],
  },
  {
    slug: 'kerala-indian-food-mastery',
    category: 'Nutrition',
    title: 'Mastering Kerala & Indian Foods Without Fear or Guilt',
    readTime: '5 min read',
    summary: 'The science of eating Rice, Dosa, Puttu, and Curries while optimizing fat loss and steady energy.',
    content: [
      'A common misconception in commercial dieting is that traditional Indian staples like rice, chapati, dosa, or puttu cause weight gain. In reality, traditional cuisines evolved over centuries with deep wisdom around digestive spices, fermentation, and vegetable variety.',
      'The issue is rarely the carbohydrate itself; it is the ratio of carbohydrate to protein and dietary fiber on the plate. When a plate consists of 85% white rice and only a small spoonful of dal, the glycemic curve spikes rapidly and crashes within two hours.',
      'In The 20 KG Blueprint, we use the Balanced Plate Protocol: 1/2 plate vegetables (cabbage thoran, beans, cucumber), 1/4 plate protein (country chicken roast, boiled eggs, fish if not allergic, or spiced paneer/kadala), and 1/4 plate quality carbs (Kerala Matta rice or dosa). You eat the exact foods you love, but structured to nourish satiety.',
    ],
    keyTakeaways: [
      'No food is forbidden: portion, sequence, and meal structure matter most.',
      'Eat protein and fiber first before starting your rice or breads.',
      'Fermented foods like dosa and appam actively support healthy gut flora.',
    ],
  },
  {
    slug: '15-minute-craving-protocol',
    category: 'Cravings',
    title: 'The 15-Minute Craving Protocol: Decoupling Stress from Sugar',
    readTime: '3 min read',
    summary: 'A physiological step-by-step method to dismantle sudden urges for sweets and snacks.',
    content: [
      'Cravings are not moral failures; they are neurochemical pulses. When you are tired, stressed, or dehydrated, dopamine levels drop, and your subconscious reaches for the fastest concentrated energy source available: refined sugar.',
      'Fighting a craving with white-knuckle willpower triggers a stress response that actually intensifies the urge. Instead, apply the 15-Minute Protocol.',
      'Step 1: Drink 300ml of water with a pinch of mineral salt or lemon. Step 2: Eat a small protein anchor like 2 boiled eggs or roasted foxnuts. Step 3: Change your physical environment for 15 minutes. In 85% of cases, the dopamine signal settles naturally.',
    ],
    keyTakeaways: [
      'Willpower is a depleting resource; use environmental friction instead.',
      'Dehydration frequently mimics acute sugar hunger.',
      'If you still want the treat after 15 minutes, enjoy a measured portion without guilt.',
    ],
  },
  {
    slug: 'restaurant-navigation-blueprint',
    category: 'Restaurants',
    title: 'The Social Dining & Restaurant Survival Blueprint',
    readTime: '4 min read',
    summary: 'How to dine out with family and colleagues without undoing your hard-earned progress.',
    content: [
      'Social meals and family gatherings are essential for mental health and connection. You should never avoid weddings, dinners, or celebrations because of a wellness plan.',
      'The #1 mistake people make is arriving at a restaurant ravenously hungry after starving themselves all day. This guarantees impulsive ordering of deep-fried appetizers and breads.',
      'Instead, drink a glass of water and eat a pre-dining protein bridge (e.g. 2 boiled eggs or a cup of curd) 30 minutes before leaving. At the table, look for grilled or tandoori preparations, double the fresh salad or raita, and savor the meal slowly in good company.',
    ],
    keyTakeaways: [
      'Never arrive at a restaurant completely starving.',
      'Use a pre-dining protein bridge before you head out.',
      'Prioritize grilled or slow-simmered dishes over battered deep-fried items.',
    ],
  },
  {
    slug: 'plateau-troubleshooting',
    category: 'Plateaus',
    title: 'Plateau Troubleshooting: Why the Scale Pauses When Fat is Still Dropping',
    readTime: '5 min read',
    summary: 'Understanding the biology of water retention, cortisol, and non-scale metabolic victories.',
    content: [
      'Seeing the scale stay identical for 10–14 days is one of the most frustrating experiences in wellness. Most people panic and slash calories further, which elevates cortisol and worsens water retention.',
      'When fat cells (adipocytes) release triglycerides during sustained fat loss, they temporarily fill with water to maintain cellular volume. Eventually, the water is expelled in what physiologists call the "whoosh effect".',
      'During this period, your waist measurement, clothing fit, posture, and energy levels continue improving. Look at 30-day moving averages rather than daily single-digit fluctuations.',
    ],
    keyTakeaways: [
      'Plateaus are normal physiological milestones, not signs of failure.',
      'Elevated stress and lack of sleep increase water retention.',
      'Rely on waist measurements and clothing fit as primary non-scale indicators.',
    ],
  },
  {
    slug: 'skin-barrier-restoration',
    category: 'Skin',
    title: 'The Skin Barrier Shield: Science-Backed Skin Wellness',
    readTime: '4 min read',
    summary: 'Why gentle minimalism and daily sunscreen outperform expensive complex regimens.',
    content: [
      'Modern skincare marketing pushes 10-step regimens loaded with high-strength exfoliating acids and harsh cleansers that frequently damage the stratum corneum (skin barrier).',
      'When the barrier is compromised, trans-epidermal water loss increases, leading to paradoxical oiliness, redness, and breakouts.',
      'The 20 KG Blueprint advocates for a simple, gentle approach: a mild non-stripping cleanser, a ceramide or glycerin-based moisturizer, and non-negotiable broad-spectrum SPF 50+ sunscreen every morning. Healthy skin reflects systemic cellular hydration and steady nutrition.',
    ],
    keyTakeaways: [
      'Gentle barrier protection is superior to aggressive exfoliation.',
      'Daily morning sunscreen is the single most proven anti-aging lifestyle habit.',
      'Severe or persistent cystic skin issues require direct dermatologist consultation.',
    ],
  },
];
