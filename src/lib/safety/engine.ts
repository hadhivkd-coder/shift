export type SafetyStatus = 'NORMAL' | 'WATCH' | 'DOCTOR_RECOMMENDED' | 'URGENT';

export interface SafetyAssessment {
  status: SafetyStatus;
  headline: string;
  message: string;
  emergencyNumber?: string;
  recommendedActions: string[];
  requiresDoctorAcknowledgment: boolean;
}

const EMERGENCY_NUMBERS: Record<string, string> = {
  India: '112',
  UAE: '998 (Ambulance) / 999 (Police)',
  UK: '999 (Urgent) / 111 (Advice)',
  USA: '911',
  Canada: '911',
  Australia: '000',
  Default: '112',
};

const URGENT_SYMPTOMS_PATTERNS = [
  /chest pain/i,
  /shortness of breath/i,
  /difficulty breathing/i,
  /fainted|fainting|passed out/i,
  /severe dizziness/i,
  /sudden weakness|slurred speech/i,
  /swelling of (lips|throat|tongue)/i,
  /anaphylaxis/i,
  /coughing blood/i,
];

export function evaluateHealthScreen(params: {
  conditions?: string[];
  hasMedication?: string;
  medicationDetails?: string;
  pregnantOrPostpartum?: boolean;
  notesOrSymptoms?: string;
  country?: string;
}): SafetyAssessment {
  const { conditions = [], hasMedication, pregnantOrPostpartum, notesOrSymptoms = '', country = 'Default' } = params;
  const emergencyNum = EMERGENCY_NUMBERS[country] || EMERGENCY_NUMBERS.Default;

  // 1. Check for acute urgent medical red-flags
  const hasUrgentSymptom = URGENT_SYMPTOMS_PATTERNS.some(regex => regex.test(notesOrSymptoms));
  if (hasUrgentSymptom) {
    return {
      status: 'URGENT',
      headline: 'Immediate Medical Attention Recommended',
      message:
        'Based on the acute symptoms described, please do not use this app for guidance right now. Seek urgent medical care or contact local emergency services immediately.',
      emergencyNumber: emergencyNum,
      recommendedActions: [
        `Call your local emergency number (${emergencyNum}) or visit the nearest emergency department immediately.`,
        'Rest in a safe position and alert someone nearby.',
        'Do not undertake any exercise, dietary shifts, or self-treatment.',
      ],
      requiresDoctorAcknowledgment: true,
    };
  }

  // 2. High-priority screening flags warranting clinical oversight
  const highPriorityConditions = [
    'Eating disorder/history of eating disorder',
    'Heart disease',
    'Kidney disease',
    'Liver disease',
  ];

  const hasHighPriorityCondition = conditions.some(c => highPriorityConditions.includes(c));
  const isPregnantOrPostpartum = Boolean(pregnantOrPostpartum) || conditions.includes('Pregnancy/postpartum status where relevant');

  if (hasHighPriorityCondition || isPregnantOrPostpartum) {
    return {
      status: 'DOCTOR_RECOMMENDED',
      headline: 'Specialized Clinical Guidance Advised',
      message:
        'Based on what you shared, your health journey requires personalized supervision from your doctor, registered dietitian, or obstetric team. SHIFT provides general educational companionship, but cannot replace personalized clinical care.',
      emergencyNumber: emergencyNum,
      recommendedActions: [
        'Share SHIFT lifestyle tracking logs with your healthcare provider.',
        'Follow your clinical team’s specific guidance on nutrition, caloric intake, and physical activity.',
        'Do not engage in rapid weight-loss protocols or fasts.',
      ],
      requiresDoctorAcknowledgment: true,
    };
  }

  // 3. Chronic manageable conditions or medications needing careful pacing
  const watchConditions = [
    'Diabetes',
    'High blood pressure',
    'Thyroid conditions',
    'PCOS',
    'High cholesterol',
    'Gastrointestinal conditions',
    'Asthma',
    'Joint/mobility limitations',
  ];

  const hasWatchCondition = conditions.some(c => watchConditions.includes(c));
  const hasActiveMedication = hasMedication === 'YES';

  if (hasWatchCondition || hasActiveMedication) {
    return {
      status: 'WATCH',
      headline: 'Personalized Safety Precautions Active',
      message:
        'We have noted your health history and reported medications. SHIFT will prioritize sustainable, steady lifestyle habits without extreme caloric restriction or unaccustomed strain.',
      recommendedActions: [
        'Continue all prescribed medications exactly as directed by your physician.',
        'Never stop or adjust medication dosages based on SHIFT recommendations.',
        'Report any dizziness, unusual fatigue, or joint discomfort immediately.',
      ],
      requiresDoctorAcknowledgment: false,
    };
  }

  // 4. Normal baseline wellness companion state
  return {
    status: 'NORMAL',
    headline: 'Wellness Baseline Established',
    message:
      'No critical medical contraindications reported. SHIFT will customize your daily Plate, Movement, and Rest routines around your preferences.',
    recommendedActions: [
      'Focus on gradual, sustainable habits.',
      'Stay hydrated and prioritize consistent sleep.',
      'Listen to your body and rest when fatigued.',
    ],
    requiresDoctorAcknowledgment: false,
  };
}

export function formatBmiScreening(weightKg: number, heightCm: number): {
  bmi: number;
  category: string;
  disclaimer: string;
} {
  if (!weightKg || !heightCm || heightCm <= 0) {
    return {
      bmi: 0,
      category: 'Pending measurements',
      disclaimer: 'Measurements will help calculate a baseline screening reference.',
    };
  }

  const heightM = heightCm / 100;
  const rawBmi = weightKg / (heightM * heightM);
  const bmi = Math.round(rawBmi * 10) / 10;

  let category = 'Reference Band: Standard';
  if (bmi < 18.5) category = 'Reference Band: Lower';
  else if (bmi >= 18.5 && bmi < 25) category = 'Reference Band: Moderate';
  else if (bmi >= 25 && bmi < 30) category = 'Reference Band: Elevated';
  else category = 'Reference Band: Higher Range';

  return {
    bmi,
    category,
    disclaimer:
      'Your BMI is one data point. It does not fully describe your health, muscle mass, or body composition. We use it neutrally to guide steady energy pacing.',
  };
}
