'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Shield,
  AlertTriangle,
  Sparkles,
  Info,
  Heart,
  Utensils,
  Moon,
  Footprints,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { formatBmiScreening } from '@/lib/safety/engine';
import QuestionContextCard from '@/components/onboarding/QuestionContextCard';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 10;
  const [loading, setLoading] = useState(false);
  const [safetyResult, setSafetyResult] = useState<any>(null);
  const [generatedPriorities, setGeneratedPriorities] = useState<string[]>([]);

  // Step 1: About You
  const [name, setName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [dob, setDob] = useState('');
  const [sex, setSex] = useState('Male');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Kerala');
  const [city, setCity] = useState('Kochi');
  const [occupation, setOccupation] = useState('Software Engineer');
  const [workSchedule, setWorkSchedule] = useState('9 AM - 6 PM Desk-based');
  const [routine, setRoutine] = useState('Desk work throughout the day; evenings free.');

  // Step 2: Body Profile
  const [heightCm, setHeightCm] = useState('176');
  const [weightKg, setWeightKg] = useState('84.5');
  const [waistCm, setWaistCm] = useState('92');
  const [hipsCm, setHipsCm] = useState('102');
  const [bodyFatPct, setBodyFatPct] = useState('24');
  const [weightGoal, setWeightGoal] = useState('Fat-loss & sustainable body recomposition');
  const [activityLevel, setActivityLevel] = useState('Moderate');
  const [dailyStepsEst, setDailyStepsEst] = useState('7500');
  const [exerciseFreq, setExerciseFreq] = useState('3 days/week');

  // Step 3: Goals & Barriers
  const [primaryGoals, setPrimaryGoals] = useState<string[]>([
    'Weight management',
    'Fat loss',
    'Energy',
    'Daily consistency',
  ]);
  const [successDefinition, setSuccessDefinition] = useState(
    'Fitting effortlessly into clothes, sustained afternoon energy without brain fog, and building lifelong health without giving up traditional food.'
  );
  const [pastBarriers, setPastBarriers] = useState<string[]>([
    'Lack of time',
    'Inconsistent sleep',
    'Social dining on weekends',
  ]);

  // Step 4: Health Screen
  const [conditions, setConditions] = useState<string[]>([]);
  const [hasMedication, setHasMedication] = useState<'YES' | 'NO' | 'NOT_SURE'>('NO');
  const [medicationDetails, setMedicationDetails] = useState('');
  const [pregnantOrPostpartum, setPregnantOrPostpartum] = useState(false);

  // Step 5: Allergy & Food Safety
  const [allergies, setAllergies] = useState<string[]>(['Fish', 'Shellfish']);
  const [intolerances, setIntolerances] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(['Non-vegetarian']);
  const [culturalRestrictions, setCulturalRestrictions] = useState<string[]>(['Halal']);

  // Step 6: Food Culture & Kerala/Indian Profile
  const [diningLocations, setDiningLocations] = useState<string[]>(['Home', 'Office canteen']);
  const [outsideEatingFreq, setOutsideEatingFreq] = useState('1-2 times per week');
  const [cookSource, setCookSource] = useState('Family and self');
  const [favoriteFoods, setFavoriteFoods] = useState<string[]>([
    'Rice',
    'Dosa',
    'Appam',
    'Chicken roast',
    'Egg curry',
    'Thoran',
    'Curd',
    'Chapatis',
    'Biriyani',
  ]);
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([
    'Kerala',
    'South Indian',
    'Continental',
  ]);

  // Step 7: Lifestyle
  const [sleepHours, setSleepHours] = useState('6.5');
  const [bedtime, setBedtime] = useState('23:15');
  const [wakeTime, setWakeTime] = useState('06:45');
  const [waterLiters, setWaterLiters] = useState('2.6');
  const [stressLevel, setStressLevel] = useState('Moderate');
  const [nightShift, setNightShift] = useState(false);

  // Step 8: Skin Wellness
  const [perceivedType, setPerceivedType] = useState('Combination');
  const [skinConcerns, setSkinConcerns] = useState<string[]>([
    'Mild breakouts',
    'Afternoon oiliness',
  ]);
  const [sunscreenUse, setSunscreenUse] = useState('Daily in morning');
  const [currentSkinRoutine, setCurrentSkinRoutine] = useState(
    'Gentle foaming cleanser, light gel moisturizer, SPF 50 sunscreen.'
  );

  // Calculate live neutral BMI
  const currentBmi = formatBmiScreening(parseFloat(weightKg) || 0, parseFloat(heightCm) || 0);

  // Check authentication on mount
  useEffect(() => {
    async function checkAuth() {
      const res = await fetch('/api/auth/me');
      if (res.status === 401) {
        // Not logged in, create guest session or redirect
      } else {
        const data = await res.json();
        if (data.user?.name) {
          setName(data.user.name);
          setPreferredName(data.user.name.split(' ')[0]);
        }
      }
    }
    checkAuth();
  }, []);

  function toggleItem(list: string[], setList: (l: string[]) => void, item: string) {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  }

  async function handleFinalSubmit() {
    setLoading(true);
    try {
      const payload = {
        about: {
          name,
          preferredName: preferredName || name,
          dob,
          sex,
          country,
          state,
          city,
          occupation,
          workSchedule,
          routine,
        },
        body: {
          heightCm,
          weightKg,
          waistCm,
          hipsCm,
          bodyFatPct,
          weightGoal,
          activityLevel,
          dailyStepsEst,
          exerciseFreq,
        },
        goals: {
          primaryGoals,
          successDefinition,
          pastBarriers,
        },
        health: {
          conditions,
          hasMedication,
          medicationDetails,
          pregnantOrPostpartum,
        },
        allergies: {
          allergies,
          intolerances,
          preferences: dietaryPreferences,
          culturalRestrictions,
        },
        food: {
          diningLocations,
          outsideEatingFreq,
          cookSource,
          favoriteFoods,
          cuisinePreferences,
        },
        lifestyle: {
          sleepHours,
          bedtime,
          wakeTime,
          waterLiters,
          stressLevel,
          nightShift,
        },
        skin: {
          perceivedType,
          concerns: skinConcerns,
          sunscreenUse,
          currentRoutine: currentSkinRoutine,
        },
      };

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSafetyResult(data.safetyAssessment);
        setGeneratedPriorities(data.topPriorities || []);
        setStep(10); // Show Digital Health Profile Identity Card
      }
    } catch (err) {
      console.error('Onboarding submission error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07090A] text-[#F3F4F6] flex flex-col justify-between p-4 sm:p-8 md:p-12 max-w-3xl mx-auto selection:bg-[#D8F224] selection:text-black">
      {/* Top Header & Progress Bar */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D8F224] text-black font-black flex items-center justify-center text-sm shadow-[0_0_15px_rgba(216,242,36,0.3)]">
              S
            </div>
            <div>
              <span className="font-bold text-sm tracking-wider text-white">SHIFT ONBOARDING</span>
              <p className="text-[10px] text-[#8E98A0] font-mono">Personal Health Consultation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#D8F224]">
              Step {step} of {totalSteps}
            </span>
            <div className="w-20 sm:w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D8F224] transition-all duration-300 rounded-full"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Views */}
        <div className="py-8">
          {/* STEP 1: ABOUT YOU */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-mono text-[#D8F224] uppercase tracking-wider">
                  Step 01 / 10
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">About You</h1>
                <p className="text-sm text-[#8E98A0] mt-1">
                  We start by understanding who you are and your daily life pattern.
                </p>
              </div>

              <QuestionContextCard
                title="Why we ask for Biological Sex, Location & Routine"
                whyWeAsk="Biological sex is solely used to calculate your resting metabolic rate (Mifflin-St Jeor formula) and hormonal baseline. Location helps us calibrate regional cuisines (e.g. Kerala Matta rice vs North Indian atta) without invading your privacy through GPS."
                howToAnswer="Select your biological sex for metabolic equations. Enter your city and state. For routine, describe how you spend your dominant 8-hour working day."
                confusionsBusted={[
                  'I go to the gym in the evening; am I active? If you sit for 8 hours at an office desk, your daily baseline is still desk-based. Your gym workouts are accounted for in the Movement and Lift dials!',
                  'Do you track my live location? Absolutely not. We only store country, state, and city to recommend culturally accessible foods and appropriate hydration reminders.',
                ]}
                mythBuster="Sedentary work does not prevent fat loss. Tailoring meal timing and a 15-minute post-lunch walk effortlessly overcomes 8 hours of sitting."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Preferred Name / Nickname</label>
                  <input
                    type="text"
                    value={preferredName}
                    onChange={e => setPreferredName(e.target.value)}
                    placeholder="e.g. Rahul"
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Date of Birth / Age</label>
                  <input
                    type="text"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    placeholder="e.g. 1996-05-14 (Age 30)"
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Biological Sex (Health Ref)</label>
                  <select
                    value={sex}
                    onChange={e => setSex(e.target.value)}
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other / Prefer not to state</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="e.g. India"
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">State & City</label>
                  <input
                    type="text"
                    value={`${state}, ${city}`}
                    onChange={e => {
                      const parts = e.target.value.split(',');
                      setState(parts[0]?.trim() || '');
                      setCity(parts[1]?.trim() || '');
                    }}
                    placeholder="Kerala, Kochi"
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Occupation & Work Pattern</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={e => setOccupation(e.target.value)}
                    placeholder="e.g. Software Engineer (Desk Job)"
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-xs text-[#8E98A0]">
                <Shield className="w-4 h-4 text-[#D8F224] shrink-0" />
                <span>
                  Privacy guarantee: We store broad city & state info to personalize cultural food recommendations. We never track exact GPS coordinates.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: BODY PROFILE & NEUTRAL BMI */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-mono text-[#D8F224] uppercase tracking-wider">
                  Step 02 / 10
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Body Profile</h1>
                <p className="text-sm text-[#8E98A0] mt-1">
                  Measurements are neutral baseline data points used to calibrate energy requirements.
                </p>
              </div>

              <QuestionContextCard
                title="Accurate Measuring, Waist Tips & Understanding BMI"
                whyWeAsk="Height, weight, and waist measurements establish your basal metabolic rate and visceral fat screening without emotional bias or shame."
                howToAnswer="Weigh yourself in the morning after using the washroom. For waist, measure midway between your lowest rib and the top of your hip bone (usually 1-2 inches above your navel). Relax your belly naturally—do not suck in."
                confusionsBusted={[
                  'I don’t have a measuring tape: Use any USB charging cable, headphone wire, or string! Wrap it around your waist, mark with a pen, and measure it against a standard 30cm ruler or phone measuring app.',
                  'My scale weight fluctuates 1–2 kg daily: That is 100% normal fluid, glycogen, and sodium shifts. It is biologically impossible to gain or lose 1.5 kg of actual body fat in 24 hours.',
                  'I don’t know my body fat percentage: Leave it blank! It is completely optional.',
                ]}
                mythBuster="BMI is an epidemiological screening reference, not a diagnosis of personal health. It cannot distinguish dense muscle from body fat."
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={e => setHeightCm(e.target.value)}
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={e => setWeightKg(e.target.value)}
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    value={waistCm}
                    onChange={e => setWaistCm(e.target.value)}
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Hips (Optional cm)</label>
                  <input
                    type="number"
                    value={hipsCm}
                    onChange={e => setHipsCm(e.target.value)}
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
              </div>

              {/* Neutral BMI Card */}
              <div className="p-4 rounded-2xl bg-[#0F1418] border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#8E98A0] uppercase">Baseline Screening</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D8F224]/10 text-[#D8F224] text-xs font-mono font-bold">
                    BMI {currentBmi.bmi}
                  </span>
                </div>
                <p className="text-xs text-[#8E98A0] leading-relaxed">
                  {currentBmi.disclaimer}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Activity Level</label>
                  <select
                    value={activityLevel}
                    onChange={e => setActivityLevel(e.target.value)}
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  >
                    <option value="Sedentary">Sedentary (mostly sitting)</option>
                    <option value="Moderate">Moderate (daily walking, desk job)</option>
                    <option value="Active">Active (standing work, gym 4+ days)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Typical Daily Steps</label>
                  <input
                    type="number"
                    value={dailyStepsEst}
                    onChange={e => setDailyStepsEst(e.target.value)}
                    placeholder="e.g. 7500"
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: GOALS & BARRIERS */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-mono text-[#D8F224] uppercase tracking-wider">
                  Step 03 / 10
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Goal Assessment</h1>
                <p className="text-sm text-[#8E98A0] mt-1">
                  What are you mainly trying to improve? Select all that matter to you.
                </p>
              </div>

              <QuestionContextCard
                title="Goal Clarity & Learning from Past Friction"
                whyWeAsk="Diets fail when they ignore your past obstacles. By knowing what stopped you before, we engineer safeguards into your routine rather than relying on depleting willpower."
                howToAnswer="Select all areas you want to optimize. In the success definition, describe tangible daily life changes (e.g. no 4 PM brain fog, fitting favorite clothes, feeling energetic with family)."
                confusionsBusted={[
                  'Can I select both Fat Loss and Muscle/Strength? Absolutely. Body recomposition (maintaining or gaining lean mass while losing fat) is the exact scientific framework of The 20 KG Blueprint.',
                  'Why ask about past barriers? If evening cravings or travel threw you off before, we activate the 15-Minute Craving Protocol and restaurant guides instead of unsustainable crash diets.',
                ]}
                mythBuster="You do not have to choose between reaching your weight goal and enjoying social dinners. The Blueprint builds systems that work in real restaurants."
              />

              <div className="flex flex-wrap gap-2">
                {[
                  'Weight management',
                  'Fat loss',
                  'Fitness',
                  'Strength',
                  'Energy',
                  'Better eating',
                  'Sleep',
                  'Hydration',
                  'Skin',
                  'Stress management',
                  'Daily consistency',
                  'General wellness',
                ].map(g => {
                  const active = primaryGoals.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleItem(primaryGoals, setPrimaryGoals, g)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors ${
                        active
                          ? 'bg-[#D8F224] text-black font-bold border-[#D8F224]'
                          : 'bg-white/[0.02] border-white/10 text-[#8E98A0] hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="text-xs text-[#8E98A0] block mb-1">
                  What would success look like to you? (In your own words)
                </label>
                <textarea
                  rows={3}
                  value={successDefinition}
                  onChange={e => setSuccessDefinition(e.target.value)}
                  placeholder="e.g. Fitting comfortably into my clothes, staying energized through long workdays..."
                  className="w-full bg-[#11161A] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                />
              </div>

              <div>
                <label className="text-xs text-[#8E98A0] block mb-2">
                  What has stopped you before in past attempts?
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Lack of time',
                    'Cravings',
                    'Family/social food',
                    'Travel',
                    'Night shifts',
                    'Lack of motivation',
                    'Inconsistent sleep',
                    'Eating out',
                    'Not knowing what to eat',
                    'Exercise difficulty',
                    'Stress',
                  ].map(b => {
                    const active = pastBarriers.includes(b);
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => toggleItem(pastBarriers, setPastBarriers, b)}
                        className={`px-3 py-1.5 rounded-xl text-xs border transition-colors ${
                          active
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                            : 'bg-white/[0.02] border-white/10 text-[#8E98A0]'
                        }`}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: HEALTH SCREEN */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-mono text-[#D8F224] uppercase tracking-wider">
                  Step 04 / 10
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Health Screening</h1>
                <p className="text-sm text-[#8E98A0] mt-1">
                  Please self-report if you currently manage any of the following so we can activate safety guardrails:
                </p>
              </div>

              <QuestionContextCard
                title="Why We Screen Conditions & How Medications Are Handled"
                whyWeAsk="Safety is our absolute foundation. Knowing your health history ensures the system never suggests unaccustomed strain, dangerous caloric deficits, or conflicting food timing."
                howToAnswer="Select any medical diagnosis you currently manage with your doctor. If you take regular prescription medicines (e.g. for thyroid, blood pressure, or blood sugar), indicate YES and enter the names if known."
                confusionsBusted={[
                  'Will SHIFT ever tell me to change, taper, or stop medication? NEVER. SHIFT provides lifestyle companionship and strictly defers all medication management to your licensed physician.',
                  'What about routine vitamins or supplements? You can mention them or skip them; our screening specifically watches for medications that affect blood pressure, glucose, or electrolyte balance.',
                  'What if I have had an eating disorder in the past? We flag this to ensure all recommendations strictly prioritize nourishment, adequate fuel, and zero aggressive deficit goals.',
                ]}
                mythBuster="Managing thyroid conditions (hypothyroidism) or PCOS does not mean weight loss is impossible. It simply requires prioritizing steady protein, anti-inflammatory sleep, and strength stimulus."
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Diabetes',
                  'High blood pressure',
                  'Heart disease',
                  'Kidney disease',
                  'Liver disease',
                  'Thyroid conditions',
                  'PCOS',
                  'High cholesterol',
                  'Gastrointestinal conditions',
                  'Asthma',
                  'Joint/mobility limitations',
                  'Eating disorder/history of eating disorder',
                  'Pregnancy/postpartum status where relevant',
                ].map(c => {
                  const active = conditions.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleItem(conditions, setConditions, c)}
                      className={`p-2.5 rounded-xl text-xs text-left border transition-colors ${
                        active
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold'
                          : 'bg-white/[0.02] border-white/5 text-[#8E98A0]'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-[#11161A] border border-white/10 space-y-3">
                <label className="text-xs text-white font-semibold block">
                  Are you currently taking any medicines that affect your weight, appetite, blood sugar, or blood pressure?
                </label>
                <div className="flex gap-2">
                  {(['YES', 'NO', 'NOT_SURE'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setHasMedication(opt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors ${
                        hasMedication === opt
                          ? 'bg-[#D8F224] text-black font-bold border-[#D8F224]'
                          : 'bg-white/[0.02] border-white/10 text-[#8E98A0]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {hasMedication === 'YES' && (
                  <input
                    type="text"
                    value={medicationDetails}
                    onChange={e => setMedicationDetails(e.target.value)}
                    placeholder="Enter medicine names if known (stored strictly for safety)"
                    className="w-full bg-[#151C22] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D8F224]"
                  />
                )}

                <p className="text-[11px] text-[#8E98A0] leading-relaxed">
                  ⚠️ Safety Guarantee: Medication information is stored to personalize safety boundaries. Do not change or stop any medication based on SHIFT recommendations.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: ALLERGY & FOOD SAFETY */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-mono text-[#D8F224] uppercase tracking-wider">
                  Step 05 / 10
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Allergies & Food Safety</h1>
                <p className="text-sm text-[#8E98A0] mt-1">
                  Stated allergies are treated as non-negotiable hard exclusions in all recommendation engines.
                </p>
              </div>

              <QuestionContextCard
                title="Crucial Distinctions: Allergy vs Intolerance vs Choice"
                whyWeAsk="Allergies can cause immediate immunological emergencies. We separate true allergies from digestive intolerances and lifestyle choices so your recommendations are both 100% safe and deliciously flexible."
                howToAnswer="Select serious medical allergies under Red (Strict Allergies). Select digestive bloating or gas triggers under Amber (Intolerances). Select your cultural or ethical dietary preferences below."
                confusionsBusted={[
                  'What is the difference between an allergy and an intolerance? An allergy triggers your immune system (e.g. hives, throat tightness, anaphylaxis). An intolerance (like lactose) is an enzyme deficiency causing digestive discomfort. We never treat a stated allergy as a mere preference.',
                  'Will declared allergens be excluded everywhere? Yes. The meal catalog, grocery list generator, and SHIFT Assistant will strictly reject recipes containing your declared allergens.',
                ]}
                mythBuster="Having food allergies or intolerances does not restrict you from rich culinary variety. Traditional Indian and Kerala cuisine features thousands of naturally gluten-free and dairy-free options like Appam, Puttu, Kadala, and spiced curries."
              />

              <div>
                <label className="text-xs text-red-400 font-bold block mb-2">
                  Strict Food Allergies (Never Recommend)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Peanuts',
                    'Tree nuts',
                    'Milk',
                    'Egg',
                    'Fish',
                    'Shellfish',
                    'Wheat',
                    'Soy',
                    'Sesame',
                  ].map(a => {
                    const active = allergies.includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleItem(allergies, setAllergies, a)}
                        className={`px-3 py-1.5 rounded-xl text-xs border transition-colors ${
                          active
                            ? 'bg-red-500/20 border-red-500 text-red-200 font-bold'
                            : 'bg-white/[0.02] border-white/10 text-[#8E98A0]'
                        }`}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs text-amber-300 font-semibold block mb-2">
                  Intolerances (Digestive Discomfort)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Lactose intolerance', 'Gluten avoidance', 'FODMAP sensitivity'].map(it => {
                    const active = intolerances.includes(it);
                    return (
                      <button
                        key={it}
                        type="button"
                        onClick={() => toggleItem(intolerances, setIntolerances, it)}
                        className={`px-3 py-1.5 rounded-xl text-xs border transition-colors ${
                          active
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                            : 'bg-white/[0.02] border-white/10 text-[#8E98A0]'
                        }`}
                      >
                        {it}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Dietary Preferences</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Non-vegetarian', 'Vegetarian', 'Vegan', 'Pescatarian'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => toggleItem(dietaryPreferences, setDietaryPreferences, p)}
                        className={`px-2.5 py-1 rounded-lg text-xs border ${
                          dietaryPreferences.includes(p)
                            ? 'bg-white/10 text-[#D8F224] border-[#D8F224]/30'
                            : 'bg-white/[0.02] border-white/5 text-[#8E98A0]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Cultural / Religious</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Halal', 'No pork', 'No beef', 'Jain vegetarian'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleItem(culturalRestrictions, setCulturalRestrictions, c)}
                        className={`px-2.5 py-1 rounded-lg text-xs border ${
                          culturalRestrictions.includes(c)
                            ? 'bg-white/10 text-[#D8F224] border-[#D8F224]/30'
                            : 'bg-white/[0.02] border-white/5 text-[#8E98A0]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: FOOD PROFILE & INDIAN FOOD CULTURE */}
          {step === 6 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-mono text-[#D8F224] uppercase tracking-wider">
                  Step 06 / 10
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Food Culture & Favorites</h1>
                <p className="text-sm text-[#8E98A0] mt-1">
                  Indian & Kerala foods are first-class citizens. No food is &ldquo;forbidden&rdquo; — we focus on portion, protein, and sequence.
                </p>
              </div>

              <QuestionContextCard
                title="Kerala & Indian Food Mastery: Zero Forbidden Foods"
                whyWeAsk="Diets that force you to replace warm rice, dosa, and curry with cold bland salads fail within three weeks. We personalize around what you actually love eating."
                howToAnswer="Select all the staples and favorites you genuinely enjoy. Do not hide foods like Biriyani or Parotta out of guilt!"
                confusionsBusted={[
                  'Is white rice, Matta rice, or Dosa bad for fat loss? NO! Carbs do not make you gain fat; unbalanced plates and chronic insulin spikes do. Eating rice with half a plate of cabbage thoran and a chicken/egg protein anchor keeps you full and metabolically active.',
                  'What if I eat at office canteens or order takeout twice a week? We design practical survival tactics for ordering at cafeterias and restaurants rather than demanding unrealistic 100% home cooking.',
                ]}
                mythBuster="Eating Biriyani or Parotta is not a 'cheat meal' or 'failure'. In The 20 KG Blueprint, you simply pair it with a protein bridge and double cucumber raita."
              />

              <div>
                <label className="text-xs text-[#8E98A0] block mb-2">
                  What foods do you genuinely enjoy eating? (Select your staples)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Rice',
                    'Chapati',
                    'Dosa',
                    'Idli',
                    'Puttu',
                    'Appam',
                    'Parotta',
                    'Biriyani',
                    'Fish curry',
                    'Chicken',
                    'Eggs',
                    'Dal',
                    'Kadala',
                    'Curd',
                    'Fruits',
                    'Vegetables',
                    'Shawarma',
                    'Pizza',
                    'Tea',
                    'Coffee',
                  ].map(f => {
                    const active = favoriteFoods.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleItem(favoriteFoods, setFavoriteFoods, f)}
                        className={`px-3 py-1.5 rounded-xl text-xs border transition-colors ${
                          active
                            ? 'bg-[#D8F224]/20 border-[#D8F224] text-[#D8F224] font-bold'
                            : 'bg-white/[0.02] border-white/10 text-[#8E98A0]'
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Where do you normally eat?</label>
                  <input
                    type="text"
                    value={diningLocations.join(', ')}
                    onChange={e => setDiningLocations(e.target.value.split(',').map(s => s.trim()))}
                    placeholder="Home, Office, Canteen"
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">How often do you eat outside?</label>
                  <select
                    value={outsideEatingFreq}
                    onChange={e => setOutsideEatingFreq(e.target.value)}
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  >
                    <option value="Rarely">Rarely (Home-cooked mostly)</option>
                    <option value="1-2 times per week">1-2 times per week</option>
                    <option value="3-5 times per week">3-5 times per week</option>
                    <option value="Daily">Daily</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: LIFESTYLE */}
          {step === 7 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-mono text-[#D8F224] uppercase tracking-wider">
                  Step 07 / 10
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Lifestyle & Recovery</h1>
                <p className="text-sm text-[#8E98A0] mt-1">
                  Sleep and hydration regulate hunger hormones more than willpower ever can.
                </p>
              </div>

              <QuestionContextCard
                title="Circadian Sleep, Cortisol & Hydration Rhythms"
                whyWeAsk="Chronic short sleep increases circulating ghrelin (appetite hormone) by up to 28% and suppresses leptin (fullness). Knowing your wake/sleep pattern helps us schedule your Rest dial."
                howToAnswer="Enter your realistic average sleep duration and typical bedtime. For water, estimate your current daily intake in liters."
                confusionsBusted={[
                  'Why does bedtime timing matter if I sleep 7 hours? Sleeping from 11 PM to 6:30 AM aligns with your core temperature and natural cortisol reset. Sleeping from 2 AM to 9 AM alters circadian rhythms and triggers midnight cravings.',
                  'What if I work night shifts? Select the night shift toggle! We invert your wind-down schedule so you get restorative daytime darkness without social jetlag.',
                ]}
                mythBuster="Drinking 4 liters of water all at once right before bed will disrupt sleep. Pacing 2.5–3.0 liters across active daylight hours delivers 10x better cellular hydration."
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Sleep Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={sleepHours}
                    onChange={e => setSleepHours(e.target.value)}
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Typical Bedtime</label>
                  <input
                    type="time"
                    value={bedtime}
                    onChange={e => setBedtime(e.target.value)}
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Daily Water (Liters)</label>
                  <input
                    type="number"
                    step="0.2"
                    value={waterLiters}
                    onChange={e => setWaterLiters(e.target.value)}
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Perceived Stress Level</label>
                  <select
                    value={stressLevel}
                    onChange={e => setStressLevel(e.target.value)}
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="nightShift"
                    checked={nightShift}
                    onChange={e => setNightShift(e.target.checked)}
                    className="w-4 h-4 accent-[#D8F224]"
                  />
                  <label htmlFor="nightShift" className="text-xs text-white font-medium">
                    I work rotating or night shifts
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: SKIN WELLNESS */}
          {step === 8 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-mono text-[#D8F224] uppercase tracking-wider">
                  Step 08 / 10
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Skin Wellness</h1>
                <p className="text-sm text-[#8E98A0] mt-1">
                  Grounded in barrier health and gentle cosmetic hygiene. (We never diagnose skin diseases).
                </p>
              </div>

              <QuestionContextCard
                title="Cosmetic Barrier Care vs Clinical Dermatology"
                whyWeAsk="Healthy skin is a systemic readout of cellular hydration, sleep quality, and UV shield habits. We help you build a simple, sustainable 2-minute daily barrier routine."
                howToAnswer="Select your perceived skin type (how your face feels mid-day) and report your current morning sunscreen habits."
                confusionsBusted={[
                  'Does SHIFT diagnose skin diseases or prescribe topical treatments? NO. SHIFT provides cosmetic habit guidance (gentle cleanse, barrier moisturizer, SPF 50 sunscreen). If you experience severe cystic acne, sudden rashes, or changing moles, we direct you to see a licensed dermatologist.',
                  'Is sunscreen necessary indoors or on cloudy days? UVA rays penetrate clouds and standard glass windows. Applying SPF 50 daily is the single most proven preventive lifestyle habit for skin health.',
                ]}
                mythBuster="Expensive 12-step skincare regimens often compromise your stratum corneum barrier. Minimalist gentle cleansing, moisturizing, and sun protection outperform complex routines."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Perceived Skin Type</label>
                  <select
                    value={perceivedType}
                    onChange={e => setPerceivedType(e.target.value)}
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  >
                    <option value="Combination">Combination</option>
                    <option value="Oily">Oily</option>
                    <option value="Dry">Dry</option>
                    <option value="Sensitive">Sensitive</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#8E98A0] block mb-1">Sunscreen Use</label>
                  <select
                    value={sunscreenUse}
                    onChange={e => setSunscreenUse(e.target.value)}
                    className="w-full bg-[#11161A] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#D8F224]"
                  >
                    <option value="Daily in morning">Daily in morning</option>
                    <option value="Only when sunny">Only when sunny</option>
                    <option value="Rarely / Never">Rarely / Never</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#8E98A0] block mb-2">Main Skin Concerns</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Mild breakouts',
                    'Afternoon oiliness',
                    'Dryness / Tightness',
                    'Uneven texture',
                    'Sun pigmentation',
                    'Redness',
                  ].map(c => {
                    const active = skinConcerns.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleItem(skinConcerns, setSkinConcerns, c)}
                        className={`px-3 py-1.5 rounded-xl text-xs border transition-colors ${
                          active
                            ? 'bg-[#A78BFA]/20 border-[#A78BFA] text-[#A78BFA] font-semibold'
                            : 'bg-white/[0.02] border-white/10 text-[#8E98A0]'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: REVIEW & SAFETY CHECK */}
          {step === 9 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-mono text-[#D8F224] uppercase tracking-wider">
                  Step 09 / 10
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Review & Safety Check</h1>
                <p className="text-sm text-[#8E98A0] mt-1">
                  Our clinical safety engine will evaluate your profile before generating your personal system.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F1418] border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs text-[#8E98A0] font-mono">ALLERGEN SAFETY FILTER</span>
                  <span className="text-xs font-bold text-red-400">
                    {allergies.length > 0 ? allergies.join(', ') : 'None Reported'}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs text-[#8E98A0] font-mono">CUISINE PREFERENCE</span>
                  <span className="text-xs font-bold text-[#D8F224]">
                    {cuisinePreferences.join(', ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8E98A0] font-mono">REPORTED HEALTH CONDITIONS</span>
                  <span className="text-xs font-bold text-white">
                    {conditions.length > 0 ? conditions.join(', ') : 'None Reported'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-[#8E98A0] leading-relaxed">
                By tapping &ldquo;Generate My System&rdquo;, your profile is synchronized with The Five Dials and 30-Day Transformation Journey.
              </div>
            </div>
          )}

          {/* STEP 10: DIGITAL HEALTH PROFILE ID CARD */}
          {step === 10 && (
            <div className="space-y-6 animate-fadeIn text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8F224]/10 border border-[#D8F224]/30 text-xs font-mono text-[#D8F224]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>YOUR SHIFT IS READY</span>
              </div>

              {/* Digital Health Identity Card */}
              <div className="max-w-md mx-auto p-6 rounded-3xl bg-gradient-to-b from-[#11171C] to-[#0A0D10] border-2 border-[#D8F224]/40 shadow-2xl text-left relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-black text-white">{preferredName || name || 'Member'}</h2>
                    <p className="text-xs text-[#D8F224] font-mono">Personal Health Profile</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#D8F224] text-black font-black flex items-center justify-center text-lg">
                    S
                  </div>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#8E98A0]">Primary Goal</span>
                    <p className="font-semibold text-white">{weightGoal}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-white/[0.03] border border-white/5 font-mono">
                    <div>
                      <span className="text-[9px] text-[#8E98A0] block">WEIGHT</span>
                      <span className="text-white font-bold">{weightKg} kg</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#8E98A0] block">HEIGHT</span>
                      <span className="text-white font-bold">{heightCm} cm</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#8E98A0] block">WAIST</span>
                      <span className="text-white font-bold">{waistCm} cm</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#8E98A0]">Food Culture & Safety</span>
                    <p className="font-semibold text-white">
                      {cuisinePreferences.join(' / ')} • {dietaryPreferences.join(', ')}
                    </p>
                    {allergies.length > 0 && (
                      <p className="text-red-400 text-[11px] mt-0.5">
                        Strict Allergen Exclusions: {allergies.join(', ')}
                      </p>
                    )}
                  </div>

                  {safetyResult && (
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 text-[11px]">
                      <span className="text-[#8E98A0] font-mono uppercase block text-[9px]">
                        Safety Screen
                      </span>
                      <span className="font-bold text-white">{safetyResult.headline}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Top 3 Priorities */}
              {generatedPriorities.length > 0 && (
                <div className="max-w-md mx-auto text-left space-y-2 pt-2">
                  <h3 className="text-xs font-mono uppercase text-[#D8F224] tracking-wider">
                    Your Top 3 Initial Priorities
                  </h3>
                  {generatedPriorities.map((pri, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white/90 flex items-start gap-2.5"
                    >
                      <span className="font-mono text-[#D8F224] font-bold">{idx + 1}.</span>
                      <span>{pri}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => router.push('/dashboard')}
                className="w-full max-w-md mx-auto py-4 rounded-2xl bg-[#D8F224] text-black font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(216,242,36,0.3)] flex items-center justify-center gap-2"
              >
                <span>Enter My Health Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      {step < 10 && (
        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-[#8E98A0] hover:text-white disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {step < 9 ? (
            <button
              type="button"
              onClick={() => setStep(prev => Math.min(totalSteps, prev + 1))}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D8F224] text-black font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(216,242,36,0.2)]"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleFinalSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D8F224] text-black font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(216,242,36,0.3)]"
            >
              <span>{loading ? 'Evaluating...' : 'Generate My System'}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
