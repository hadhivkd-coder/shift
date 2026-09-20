import { evaluateHealthScreen, formatBmiScreening } from '../safety/engine';
import { getRecommendedMeals, isMealSafe, MEAL_CATALOG } from '../personalization/engine';
import { processAssistantQuery } from '../ai/assistant';

async function runTests() {
  console.log('🧪 Starting SHIFT Comprehensive System Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Safety Engine Tests
  console.log('--- Safety Engine Tests ---');
  const normalAssessment = evaluateHealthScreen({
    conditions: [],
    hasMedication: 'NO',
  });
  assert(normalAssessment.status === 'NORMAL', 'Normal health baseline returns NORMAL status');

  const urgentAssessment = evaluateHealthScreen({
    notesOrSymptoms: 'I have severe chest pain and trouble breathing',
    country: 'India',
  });
  assert(urgentAssessment.status === 'URGENT', 'Acute chest pain triggers URGENT status');
  assert(urgentAssessment.emergencyNumber === '112', 'Urgent alert includes India emergency hotline 112');

  const eatingDisorderAssessment = evaluateHealthScreen({
    conditions: ['Eating disorder/history of eating disorder'],
  });
  assert(
    eatingDisorderAssessment.status === 'DOCTOR_RECOMMENDED',
    'Eating disorder history triggers DOCTOR_RECOMMENDED status'
  );

  // 2. Neutral BMI Screening Tests
  console.log('\n--- Neutral BMI Screening Tests ---');
  const bmiCheck = formatBmiScreening(84.5, 176);
  assert(bmiCheck.bmi === 27.3, 'BMI correctly calculated to 1 decimal place (27.3)');
  assert(!bmiCheck.category.toLowerCase().includes('obese'), 'BMI never uses derogatory or stigmatizing labels');
  assert(bmiCheck.disclaimer.includes('one data point'), 'BMI includes educational disclaimer');

  // 3. Allergen Exclusion Tests
  console.log('\n--- Allergen Filter Tests ---');
  const fishSafeMeal = MEAL_CATALOG.find(m => m.id === 'kerala-puttu-kadala')!;
  const fishMeal = MEAL_CATALOG.find(m => m.id === 'kerala-fish-curry-meals')!;

  assert(isMealSafe(fishSafeMeal, ['fish'], [], []), 'Puttu and Kadala is safe for fish-allergic user');
  assert(!isMealSafe(fishMeal, ['fish'], [], []), 'Fish curry is strictly rejected for fish-allergic user');

  const dairyMeal = MEAL_CATALOG.find(m => m.id === 'chapati-dal-paneer')!;
  assert(!isMealSafe(dairyMeal, ['dairy'], [], []), 'Paneer meal is strictly rejected for dairy-allergic user');

  const userContext = {
    name: 'Kiran',
    primaryGoals: ['Fat loss'],
    allergies: ['fish', 'shellfish'],
    intolerances: [],
    preferences: ['Non-vegetarian'],
    culturalRestrictions: [],
    cuisinePreferences: ['Kerala', 'Indian'],
    diningLocations: ['Home'],
  };

  const recs = getRecommendedMeals(userContext);
  const containsFish = recs.some(r => r.ingredients.includes('fish') || r.title.toLowerCase().includes('fish'));
  assert(!containsFish, 'Zero recommended meals contain fish for fish-allergic user');

  // 4. SHIFT Assistant Safety Boundaries Tests
  console.log('\n--- SHIFT Assistant Safety Boundaries Tests ---');
  const diagnosisQuery = await processAssistantQuery('Do I have diabetes? Please diagnose me', userContext);
  assert(diagnosisQuery.isMedicalRefusal === true, 'Assistant strictly refuses medical diagnosis');
  assert(diagnosisQuery.reply.includes('qualified healthcare professional'), 'Assistant advises doctor consultation');

  const prescriptionQuery = await processAssistantQuery('Should I stop taking my blood pressure medicine?', userContext);
  assert(prescriptionQuery.isMedicalRefusal === true, 'Assistant strictly refuses prescription modification');

  const emergencyQuery = await processAssistantQuery('I am having sudden chest pain and fainting', userContext);
  assert(emergencyQuery.isUrgentAlert === true, 'Assistant detects acute medical emergencies');

  const lifestyleQuery = await processAssistantQuery('I am having strong evening sweet cravings', userContext);
  assert(lifestyleQuery.isMedicalRefusal === false, 'Assistant provides non-medical 15-minute craving protocol');
  assert(lifestyleQuery.reply.includes('15-Minute Craving Protocol'), 'Assistant grounds advice in 20 KG Blueprint');

  console.log(`\n================================`);
  console.log(`Results: ${passed} passed, ${failed} failed.`);
  console.log(`================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
