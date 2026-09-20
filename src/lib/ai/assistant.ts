import { UserHealthContext } from '../personalization/engine';

export interface AssistantMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AssistantResponse {
  reply: string;
  isMedicalRefusal: boolean;
  isUrgentAlert: boolean;
  emergencyNumber?: string;
  suggestedFollowUps?: string[];
}

const MEDICAL_DIAGNOSIS_PATTERNS = [
  /do i have (cancer|diabetes|pcos|appendicitis|lupus|covid|stroke|infection)/i,
  /diagnose me/i,
  /what disease do i have/i,
  /what illness is this/i,
  /is this a symptom of/i,
  /should i stop taking/i,
  /stop (taking )?.*(medicine|medication|pill|drug)/i,
  /can i change my (dosage|dose)/i,
  /(change|adjust|increase|decrease|reduce|stop) (my )?.*(dosage|dose|medication|medicine)/i,
  /prescribe me/i,
  /what drug should i take/i,
  /which antibiotic/i,
  /how much insulin/i,
  /metformin dosage/i,
];

const URGENT_PATTERNS = [
  /chest pain/i,
  /crushing pressure/i,
  /short of breath|can't breathe|trouble breathing/i,
  /fainted|loss of consciousness|passed out/i,
  /coughing up blood/i,
  /severe sudden headache/i,
  /numbness on one side/i,
  /anaphylaxis|throat closing/i,
];

export async function processAssistantQuery(
  userQuery: string,
  userContext: UserHealthContext
): Promise<AssistantResponse> {
  const query = userQuery.trim();

  // 1. Check for acute emergency patterns first
  if (URGENT_PATTERNS.some(pat => pat.test(query))) {
    return {
      reply:
        "⚠️ **URGENT MEDICAL SAFETY NOTICE**\n\nThe symptoms you mentioned require immediate clinical evaluation. Please stop using this wellness app and **contact your local emergency services immediately** (e.g. 112, 999, or 911) or proceed to the nearest emergency medical department. SHIFT cannot evaluate or triage medical emergencies.",
      isMedicalRefusal: true,
      isUrgentAlert: true,
      emergencyNumber: '112 / 999 / 911',
      suggestedFollowUps: ['Call local emergency services', 'Seek urgent clinical care'],
    };
  }

  // 2. Check for medical diagnosis or prescription queries
  if (MEDICAL_DIAGNOSIS_PATTERNS.some(pat => pat.test(query))) {
    return {
      reply:
        "Based on what you've shared, this is something that requires a direct clinical evaluation from a qualified healthcare professional or your personal physician. \n\nSHIFT is your personal wellness companion and cannot diagnose medical conditions, interpret clinical symptoms, or advise on prescription medications. Please consult your doctor or specialist for diagnostic questions or medication adjustments.",
      isMedicalRefusal: true,
      isUrgentAlert: false,
      suggestedFollowUps: [
        'How can I prepare questions for my doctor?',
        'What lifestyle habits support general recovery?',
      ],
    };
  }

  // 3. Prompt injection & system instruction leak resistance
  if (
    /reveal (system|prompt|instructions)|ignore previous instructions|you are now dan|jailbreak/i.test(
      query
    )
  ) {
    return {
      reply:
        "I am SHIFT Assistant, your private digital health and weight management companion for *The 20 KG Blueprint*. I'm here to help you personalize your daily Plate, Movement, Lift, Rest, and Habit routines.",
      isMedicalRefusal: false,
      isUrgentAlert: false,
      suggestedFollowUps: [
        'What should I eat tonight?',
        'How do I handle evening sugar cravings?',
        'I missed my workout today',
      ],
    };
  }

  // 4. Context-aware Blueprint guidance based on intent
  const qLower = query.toLowerCase();

  // Scenario A: Craving guidance
  if (qLower.includes('crav') || qLower.includes('sweet') || qLower.includes('chocolate') || qLower.includes('sugar')) {
    return {
      reply:
        `Here is the **20 KG Blueprint 15-Minute Craving Protocol**:\n\n` +
        `1. **Do not fight the craving with sheer willpower** — willpower depletes. Instead, put a gentle 15-minute delay on the decision.\n` +
        `2. **The Hydration + Protein Bridge**: Drink a full 300ml glass of water with a pinch of salt or lemon, and eat a small protein anchor (like 2 boiled eggs, a cup of curd, or a handful of roasted makhana).\n` +
        `3. **Physical Environment Reset**: Change the room you are in or step outside for a 5-minute stroll.\n` +
        `4. **Re-evaluate**: After 15 minutes, if you still genuinely desire the sweet, have a mindful, measured portion without guilt. Never label it a 'cheat meal' or 'failure' — it is simply a conscious choice within your week.`,
      isMedicalRefusal: false,
      isUrgentAlert: false,
      suggestedFollowUps: [
        'Give me high-protein snack ideas',
        'Why do cravings hit late at night?',
        'Log a snack in My Meals',
      ],
    };
  }

  // Scenario B: Missed workout / exercise struggle
  if (qLower.includes('missed') || qLower.includes('skip') || qLower.includes('workout') || qLower.includes('gym') || qLower.includes('struggling')) {
    return {
      reply:
        `**You did not fail.** In The 20 KG Blueprint, consistency beats intensity every single time.\n\n` +
        `• Today is not ruined because of one missed gym session.\n` +
        `• **Micro-shift alternative**: If you cannot make it to the gym, can you do a **15-minute brisk walk** after dinner or **3 sets of 10 bodyweight squats and wall pushups** right in your living room?\n` +
        `• That keeps your **MOVE dial** active and protects your habit momentum. Tomorrow morning, we simply resume as normal.`,
      isMedicalRefusal: false,
      isUrgentAlert: false,
      suggestedFollowUps: [
        'Show me a 10-minute home movement routine',
        'How many steps should I target today?',
        'Log 15 minutes of walking',
      ],
    };
  }

  // Scenario C: Dinner / meal recommendation query
  if (qLower.includes('eat') || qLower.includes('dinner') || qLower.includes('lunch') || qLower.includes('chicken') || qLower.includes('rice') || qLower.includes('food')) {
    const isFishAllergic = userContext.allergies.some(a => a.toLowerCase().includes('fish'));
    const isKerala = userContext.cuisinePreferences.some(c => c.toLowerCase().includes('kerala') || c.toLowerCase().includes('south indian'));

    return {
      reply:
        `Based on your profile${isKerala ? ' and preference for Kerala/Indian cuisine' : ''}${isFishAllergic ? ' (excluding fish for your safety)' : ''}, here is a balanced dinner framework:\n\n` +
        `🍽 **The 20 KG Blueprint Balanced Plate**:\n` +
        `• **1/4 Protein**: Pan-roasted spiced chicken, paneer, or 3-egg bhurji (~25–30g protein).\n` +
        `• **1/4 Smart Carbs**: 1 cup of Kerala Matta rice or 2 whole wheat chapatis.\n` +
        `• **1/2 Fiber & Plants**: A generous bowl of cabbage or beans thoran, or fresh cucumber & onion salad.\n\n` +
        `💡 *Portion Sequence Tip*: Eat half the vegetables and protein first before tucking into the rice. This slows stomach emptying and keeps morning fasting glucose steady.`,
      isMedicalRefusal: false,
      isUrgentAlert: false,
      suggestedFollowUps: [
        'What if I am eating at a restaurant tonight?',
        'Suggest a quick vegetarian option instead',
        'Add items to My Smart Grocery List',
      ],
    };
  }

  // Scenario D: Sleep / wind-down difficulty
  if (qLower.includes('sleep') || qLower.includes('tired') || qLower.includes('insomnia') || qLower.includes('rest')) {
    return {
      reply:
        `Quality sleep is the master dial that regulates leptin (fullness) and ghrelin (hunger) for the entire next day.\n\n` +
        `🌙 **Tonight's 3-Step Sleep Wind-Down Protocol**:\n` +
        `1. **Light Curfew**: Dim overhead lights 45 minutes before your intended sleep. Switch to warm ambient lamps.\n` +
        `2. **Cool & Dark Environment**: Keep your bedroom cool (around 20–22°C if AC is available) and pitch dark.\n` +
        `3. **Mental Offload**: Write down your top 3 tasks for tomorrow on a physical notepad so your subconscious lets them go.\n` +
        `4. **Hydration Stop**: Sip warm herbal tea or water, but stop large liquid volumes 60 minutes before bed to prevent interrupted sleep.`,
      isMedicalRefusal: false,
      isUrgentAlert: false,
      suggestedFollowUps: [
        'How does poor sleep impact fat loss?',
        'Log today’s sleep in Quick Check-in',
      ],
    };
  }

  // Scenario E: Skincare routine advice
  if (qLower.includes('skin') || qLower.includes('dry') || qLower.includes('acne') || qLower.includes('routine')) {
    return {
      reply:
        `For skin health, consistency with a gentle barrier-protective routine is much more effective than aggressive treatments.\n\n` +
        `🧴 **Core Daily Routine**:\n` +
        `• **Morning (AM)**: Gentle non-stripping cleanser $\\rightarrow$ Light ceramide or hyaluronic moisturizer $\\rightarrow$ Broad-spectrum SPF 50+ sunscreen.\n` +
        `• **Evening (PM)**: Thorough gentle wash to remove sunscreen and pollution $\\rightarrow$ Barrier-replenishing moisturizer.\n\n` +
        `⚠️ *Safety Reminder*: SHIFT provides general cosmetic hygiene education. For persistent painful cysts, sudden rashes, or suspicious moles, always consult a licensed dermatologist. Never self-prescribe medicated ointments.`,
      isMedicalRefusal: false,
      isUrgentAlert: false,
      suggestedFollowUps: [
        'How much water should I drink for skin barrier hydration?',
        'Check my Skin AM/PM checklist',
      ],
    };
  }

  // Default intelligent assistant response grounded in profile
  return {
    reply:
      `Hello ${userContext.name || 'there'}! As your SHIFT companion, I am actively synchronizing with your Five Dials (Plate, Move, Lift, Rest, and Repeat).\n\n` +
      `How can I make your health decisions easier right now? We can plan your next meal, troubleshoot a busy work schedule, log a quick check-in, or prepare for your evening wind-down.`,
    isMedicalRefusal: false,
    isUrgentAlert: false,
    suggestedFollowUps: [
      'What should I eat for my next meal?',
      'How are my Five Dials tracking this week?',
      'Start my 60-second daily check-in',
    ],
  };
}
