export interface UserHealthContext {
  name: string;
  primaryGoals: string[];
  allergies: string[];
  intolerances: string[];
  preferences: string[];
  culturalRestrictions: string[];
  cuisinePreferences: string[];
  diningLocations: string[];
  occupation?: string;
  activityLevel?: string;
  sleepHours?: number;
  bedtime?: string;
  hasGymAccess?: boolean;
  skinConcerns?: string[];
}

export interface MealRecommendation {
  id: string;
  title: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  cuisine: string;
  description: string;
  ingredients: string[];
  proteinSource: string;
  plantSource: string;
  portionGuide: string;
  swaps: string[];
  allergyCheckPassed: boolean;
  blueprintTip: string;
}

export interface DailyShiftAction {
  id: string;
  dial: 'PLATE' | 'MOVE' | 'LIFT' | 'REST' | 'REPEAT';
  emoji: string;
  title: string;
  subtitle: string;
  whyItMatters: string;
  actionableStep: string;
  completed?: boolean;
}

// Master Indian & Global Meal Catalog curated for The 20 KG Blueprint
export const MEAL_CATALOG: Omit<MealRecommendation, 'allergyCheckPassed'>[] = [
  {
    id: 'kerala-dosa-egg',
    title: 'Warm Crispy Dosa with Boiled Eggs & Coconut Chammanthi',
    mealType: 'Breakfast',
    cuisine: 'Kerala / Indian',
    description: '2 medium dosas paired with 2 pasture eggs and freshly grated coconut chammanthi.',
    ingredients: ['rice', 'urad dal', 'egg', 'coconut', 'green chili'],
    proteinSource: '2 whole eggs (~13g protein)',
    plantSource: 'Coconut & tempered curry leaves',
    portionGuide: '2 dosas maximum; prioritize finishing the eggs first for satiety.',
    swaps: ['Boiled eggs -> Egg bhurji or Sprouted green gram (cherupayar) for vegetarian'],
    blueprintTip: 'Anchoring your first meal with protein minimizes afternoon sugar cravings.',
  },
  {
    id: 'kerala-puttu-kadala',
    title: 'Steamed Rice Puttu with Black Chickpea (Kadala) Curry',
    mealType: 'Breakfast',
    cuisine: 'Kerala / Indian',
    description: 'Traditional roasted red or white rice puttu served with slow-cooked kadala curry rich in fiber and plant protein.',
    ingredients: ['rice flour', 'coconut', 'black chickpeas', 'onion', 'ginger', 'garam masala'],
    proteinSource: 'Slow-simmered black chickpeas (~12g protein)',
    plantSource: 'Chickpeas, onion, tomato, spices',
    portionGuide: '1/2 cylinder of puttu with 1 generous cup of thick kadala curry.',
    swaps: ['Kadala -> Egg curry or Chicken stew'],
    blueprintTip: 'Eat double the gravy and chickpeas compared to the puttu portion.',
  },
  {
    id: 'kerala-appam-stew',
    title: 'Soft Appam with Vegetable & Coconut Milk Stew',
    mealType: 'Breakfast',
    cuisine: 'Kerala / Indian',
    description: 'Fermented lace appams served with comforting potato, carrot, and green pea stew in light coconut milk.',
    ingredients: ['fermented rice', 'coconut milk', 'potato', 'carrot', 'green peas', 'ginger'],
    proteinSource: 'Can add 2 boiled eggs or paneer cubes (~12g protein)',
    plantSource: 'Carrots, green peas, green chilies',
    portionGuide: '2 appams with 1.5 bowls of hearty stew.',
    swaps: ['Veg stew -> Chicken stew or Egg stew'],
    blueprintTip: 'Fermented foods support gut microbiome diversity and smooth digestion.',
  },
  {
    id: 'kerala-rice-chicken-thoran',
    title: 'Matta Rice with Kerala Chicken Roast, Cabbage Thoran & Curd',
    mealType: 'Lunch',
    cuisine: 'Kerala / Indian',
    description: 'Red Matta rice alongside tender country chicken roasted with shallots, warm cabbage thoran, and fresh cooling curd.',
    ingredients: ['matta rice', 'chicken', 'shallots', 'cabbage', 'coconut', 'curd', 'milk'],
    proteinSource: 'Pan-roasted chicken breast/thigh (~28g protein) + Curd',
    plantSource: 'A generous cup of shredded cabbage thoran',
    portionGuide: '1 cup cooked rice, 1 palm chicken, 1 generous fist cabbage, 1 bowl curd.',
    swaps: ['Chicken -> Soya chunks or Paneer roast'],
    blueprintTip: 'The 20 KG Blueprint Plate Rule: 1/2 plate vegetables, 1/4 protein, 1/4 starches.',
  },
  {
    id: 'kerala-fish-curry-meals',
    title: 'Traditional Kudampuli Fish Curry with Rice, Moru & Beans Mezhukkupuratti',
    mealType: 'Lunch',
    cuisine: 'Kerala / Indian',
    description: 'Kingfish or Sardines slow-simmered in earthen clay pots with tangy Malabar kokum (kudampuli), beans stir-fry, and seasoned buttermilk.',
    ingredients: ['fish', 'kudampuli', 'chili powder', 'turmeric', 'french beans', 'rice', 'curd', 'milk'],
    proteinSource: 'Fresh sea fish (~26g protein, rich in Omega-3 EPA/DHA)',
    plantSource: 'French beans and shallots',
    portionGuide: '1 cup rice, 2 pieces fish, generous ladle of fish gravy, large cup of beans.',
    swaps: ['Fish -> Paneer or Mushroom curry (if allergic or vegetarian)'],
    blueprintTip: 'Kudampuli adds rich authentic tang without needing excess added oils.',
  },
  {
    id: 'kerala-biriyani-balanced',
    title: 'Thalassery Style Biriyani with Mint Raita & Pickle',
    mealType: 'Lunch',
    cuisine: 'Kerala / Indian',
    description: 'Aromatic kaima rice layered with fragrant spices and tender meat, enjoyed mindfully with a big bowl of cucumber mint raita.',
    ingredients: ['kaima rice', 'chicken', 'ghee', 'onion', 'curd', 'cucumber', 'milk'],
    proteinSource: 'Chicken pieces (~25g protein) + Greek style curd raita',
    plantSource: 'Cucumber, mint, onion in the raita',
    portionGuide: 'Moderate plate. Start by eating the raita and half the chicken before touching the rice.',
    swaps: ['Chicken biriyani -> Egg or Vegetable biriyani with soya'],
    blueprintTip: 'No food is forbidden. When eating biriyani, double the raita to balance glycemic response.',
  },
  {
    id: 'chapati-dal-paneer',
    title: 'Soft Whole-Wheat Chapatis with Dal Tadka & Palak Paneer',
    mealType: 'Dinner',
    cuisine: 'Indian',
    description: 'Fresh hand-rolled chapatis paired with yellow toor dal tempered with cumin and spinach paneer.',
    ingredients: ['wheat', 'toor dal', 'spinach', 'paneer', 'tomato', 'cumin', 'milk'],
    proteinSource: 'Toor dal + Paneer (~20g protein)',
    plantSource: 'Fresh pureed spinach and tomato tadka',
    portionGuide: '2 chapatis, 1 cup thick dal, 1 cup palak paneer.',
    swaps: ['Paneer -> Tofu (for lactose intolerant / vegan)'],
    blueprintTip: 'Spreading protein evenly across dinner supports overnight muscle protein synthesis.',
  },
  {
    id: 'grilled-shawarma-bowl',
    title: 'Deconstructed Shawarma Bowl with Garlic Tahini & Fresh Salad',
    mealType: 'Dinner',
    cuisine: 'Middle Eastern / Mixed',
    description: 'Tender spiced grilled chicken strips served over diced romaine, cucumbers, tomatoes, and pickled turnip with sesame tahini.',
    ingredients: ['chicken', 'sesame', 'tahini', 'garlic', 'cucumber', 'tomato', 'olive oil'],
    proteinSource: 'Grilled chicken breast (~32g protein)',
    plantSource: 'Crisp lettuce, cucumber, tomato, parsley salad',
    portionGuide: 'Large salad base, 1.5 palms chicken, 2 tbsp tahini dressing.',
    swaps: ['Chicken -> Falafel or Grilled Halloumi'],
    blueprintTip: 'Choosing the bowl version over white pita bread cuts excess refined carbs effortlessly.',
  },
  {
    id: 'snack-roasted-makhana-tea',
    title: 'Spiced Roasted Makhana (Foxnuts) with Cardamom Black Tea',
    mealType: 'Snack',
    cuisine: 'Indian',
    description: 'Crisp foxnuts gently dry roasted with turmeric, black pepper, and rock salt.',
    ingredients: ['foxnuts', 'turmeric', 'black pepper', 'tea'],
    proteinSource: 'Light plant protein and crunchy volume (~4g protein)',
    plantSource: 'Foxnuts (water lily seeds)',
    portionGuide: '1 full cereal bowl (approx 30g).',
    swaps: ['Makhana -> Roasted chana (kala chana)'],
    blueprintTip: 'High-volume, low-density snacks satisfy the mechanical chewing urge without sluggishness.',
  },
  {
    id: 'snack-boiled-eggs-fruit',
    title: '2 Soft-Boiled Eggs with Fresh Papaya or Apple Slices',
    mealType: 'Snack',
    cuisine: 'Global / Indian',
    description: 'Lightly peppered eggs with seasonal fresh digestive enzyme-rich papaya.',
    ingredients: ['egg', 'papaya', 'black pepper'],
    proteinSource: '2 eggs (~13g protein)',
    plantSource: 'Fresh papaya (papain enzymes for gut health)',
    portionGuide: '2 eggs + 1 cup diced fruit.',
    swaps: ['Eggs -> Handful of roasted almonds or curd cup'],
    blueprintTip: 'Pairing protein with whole fruit slows fruit sugar absorption.',
  },
];

// Helper to check if a meal violates any allergies or restrictions
export function isMealSafe(meal: { ingredients: string[] }, allergies: string[], intolerances: string[], cultural: string[]): boolean {
  const normalize = (s: string) => s.toLowerCase().trim();
  const userRestrictions = [...allergies, ...intolerances, ...cultural].map(normalize);

  for (const allergen of userRestrictions) {
    if (!allergen) continue;
    
    // Check direct ingredient match
    for (const ing of meal.ingredients) {
      const lowerIng = normalize(ing);
      if (lowerIng.includes(allergen) || allergen.includes(lowerIng)) {
        return false;
      }
      // Special mappings:
      if (allergen === 'fish' && (lowerIng === 'fish' || lowerIng === 'shellfish' || lowerIng === 'kingfish' || lowerIng === 'sardines')) return false;
      if (allergen === 'dairy' || allergen === 'milk' || allergen === 'lactose intolerance') {
        if (['milk', 'curd', 'ghee', 'paneer', 'yogurt', 'cheese'].includes(lowerIng)) return false;
      }
      if (allergen === 'egg' || allergen === 'eggs') {
        if (lowerIng.includes('egg')) return false;
      }
      if (allergen === 'wheat' || allergen === 'gluten') {
        if (['wheat', 'chapati', 'parotta', 'bread', 'pita'].includes(lowerIng)) return false;
      }
      if (allergen === 'peanuts' || allergen === 'tree nuts') {
        if (['peanut', 'peanuts', 'cashew', 'almond', 'walnut'].includes(lowerIng)) return false;
      }
    }
  }

  return true;
}

// Generate filtered meal recommendations
export function getRecommendedMeals(
  context: UserHealthContext,
  targetMealType?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
): MealRecommendation[] {
  const filtered = MEAL_CATALOG.filter(meal => {
    if (targetMealType && meal.mealType !== targetMealType) return false;
    return isMealSafe(meal, context.allergies, context.intolerances, context.culturalRestrictions);
  });

  return filtered.map(m => ({
    ...m,
    allergyCheckPassed: true,
  }));
}

// Generate Today's Shift (3 personalized action items)
export function generateTodaysShift(context: UserHealthContext): DailyShiftAction[] {
  const isDeskJob = (context.occupation || '').toLowerCase().includes('desk') || (context.occupation || '').toLowerCase().includes('engineer') || (context.occupation || '').toLowerCase().includes('software');
  const sleepLow = (context.sleepHours || 7) < 7;
  const isKerala = context.cuisinePreferences.some(c => c.toLowerCase().includes('kerala') || c.toLowerCase().includes('south indian'));

  const plateAction: DailyShiftAction = {
    id: 'plate-1',
    dial: 'PLATE',
    emoji: '🥗',
    title: 'Protein anchor on first meal',
    subtitle: isKerala ? 'Add 2 eggs or boiled cherupayar alongside your breakfast' : 'Ensure 20g+ protein in your primary breakfast',
    whyItMatters: 'Stabilizes morning ghrelin and blood sugar spikes, keeping cravings muted until lunchtime.',
    actionableStep: 'Pair whatever carbohydrate you choose with an explicit palm-sized protein source.',
  };

  const moveAction: DailyShiftAction = {
    id: 'move-1',
    dial: 'MOVE',
    emoji: '🚶',
    title: isDeskJob ? '15-minute post-meal outdoor walk' : 'Accumulate 7,500 brisk steps',
    subtitle: 'Step away from your desk right after lunch',
    whyItMatters: 'Contracting major leg muscles blunts postprandial glucose excursions by up to 34%.',
    actionableStep: 'Leave your phone on audio-only or podcast mode and walk briskly for 15 unbroken minutes.',
  };

  const restAction: DailyShiftAction = {
    id: 'rest-1',
    dial: 'REST',
    emoji: '🌙',
    title: sleepLow ? '30-minute electronic curfew' : 'Hydration + dim lighting wind-down',
    subtitle: `Begin room dimming at ${context.bedtime ? '10:30 PM' : '10:15 PM'}`,
    whyItMatters: 'Melatonin secretion requires reducing high-energy blue wavelength light 45 minutes prior to sleep.',
    actionableStep: 'Switch phone to grayscale or bedtime mode and charge it away from your bedside table.',
  };

  return [plateAction, moveAction, restAction];
}

// Generate Top 3 Priorities for Digital Health Profile Card
export function generateTopPriorities(context: UserHealthContext): string[] {
  const priorities: string[] = [];

  if (context.primaryGoals.includes('Weight management') || context.primaryGoals.includes('Fat loss')) {
    priorities.push('Master the 1/2 plate vegetables & palm-protein structure across main meals without cutting out staple foods like rice or dosa.');
  }

  if ((context.sleepHours || 7) < 7) {
    priorities.push('Protect a non-negotiable 7-hour sleep window to restore insulin sensitivity and suppress night hunger hormones.');
  } else {
    priorities.push('Incorporate consistent daily non-exercise physical activity (7,000–9,000 steps daily baseline).');
  }

  if (context.skinConcerns && context.skinConcerns.length > 0) {
    priorities.push('Establish a gentle two-step skin barrier routine (cleanse + moisturize + daily broad-spectrum sunscreen).');
  } else {
    priorities.push('Target 2.5–3.0 liters of structured daily hydration with a glass upon waking and before each meal.');
  }

  return priorities;
}
