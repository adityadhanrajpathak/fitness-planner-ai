// ═══════════════════════════════════════════════════════════
// CORE AI ENGINE
// Calculates BMR, TDEE, macros, and personalizes plans
// ═══════════════════════════════════════════════════════════

/**
 * Calculate BMR using Mifflin-St Jeor Equation
 * More accurate than Harris-Benedict for modern populations
 */
function calculateBMR(weight, height, age, gender) {
  // weight in kg, height in cm
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
function calculateTDEE(bmr, activityLevel) {
  const multipliers = {
    sedentary: 1.2,        // Little or no exercise
    light: 1.375,          // Light exercise 1-3 days/week
    moderate: 1.55,        // Moderate exercise 3-5 days/week
    active: 1.725,         // Hard exercise 6-7 days/week
    very_active: 1.9       // Very hard exercise, physical job
  };
  return bmr * (multipliers[activityLevel] || 1.55);
}

/**
 * Calculate caloric target based on fitness goal
 */
function calculateCaloricTarget(tdee, goal) {
  switch (goal) {
    case 'lose_weight':
      return Math.round(tdee - 500);  // ~0.5kg/week loss
    case 'lose_weight_fast':
      return Math.round(tdee - 750);  // ~0.75kg/week loss
    case 'gain_muscle':
      return Math.round(tdee + 300);  // Lean bulk
    case 'gain_weight':
      return Math.round(tdee + 500);  // Weight gain
    case 'maintain':
    default:
      return Math.round(tdee);
  }
}

/**
 * Calculate macro split based on goal
 * Returns grams of each macro
 */
function calculateMacros(calories, goal, weight) {
  let proteinRatio, carbRatio, fatRatio;

  switch (goal) {
    case 'lose_weight':
    case 'lose_weight_fast':
      // High protein to preserve muscle, moderate fat, lower carbs
      proteinRatio = 0.35;
      fatRatio = 0.30;
      carbRatio = 0.35;
      break;
    case 'gain_muscle':
      // High protein, high carbs for energy, moderate fat
      proteinRatio = 0.30;
      fatRatio = 0.25;
      carbRatio = 0.45;
      break;
    case 'gain_weight':
      // Balanced with higher carbs
      proteinRatio = 0.25;
      fatRatio = 0.25;
      carbRatio = 0.50;
      break;
    case 'maintain':
    default:
      proteinRatio = 0.30;
      fatRatio = 0.25;
      carbRatio = 0.45;
      break;
  }

  // Minimum protein: 1.6g per kg body weight for active individuals
  const minProtein = Math.round(weight * 1.6);
  const calculatedProtein = Math.round((calories * proteinRatio) / 4);

  return {
    protein: Math.max(minProtein, calculatedProtein),  // 4 cal/g
    carbs: Math.round((calories * carbRatio) / 4),     // 4 cal/g
    fat: Math.round((calories * fatRatio) / 9),        // 9 cal/g
    fiber: Math.round(calories / 100)                  // ~1g per 100 cal
  };
}

/**
 * Calculate BMI
 */
function calculateBMI(weight, heightCm) {
  const heightM = heightCm / 100;
  return Math.round((weight / (heightM * heightM)) * 10) / 10;
}

/**
 * Get BMI category
 */
function getBMICategory(bmi) {
  if (bmi < 18.5) return { category: 'Underweight', color: '#fbbf24', advice: 'Focus on nutrient-dense foods and gradual weight gain.' };
  if (bmi < 25) return { category: 'Normal', color: '#34d399', advice: 'Great! Maintain your healthy weight with balanced nutrition.' };
  if (bmi < 30) return { category: 'Overweight', color: '#fb923c', advice: 'Consider a moderate caloric deficit with regular exercise.' };
  return { category: 'Obese', color: '#f87171', advice: 'Consult a healthcare provider. Focus on sustainable lifestyle changes.' };
}

/**
 * Generate complete health analysis from profile
 */
function analyzeProfile(profile) {
  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
  const tdee = calculateTDEE(bmr, profile.activity_level);
  const bmi = calculateBMI(profile.weight, profile.height);
  const bmiInfo = getBMICategory(bmi);
  const caloricTarget = calculateCaloricTarget(tdee, profile.fitness_goal);
  const macros = calculateMacros(caloricTarget, profile.fitness_goal, profile.weight);

  // Water intake recommendation (ml)
  const waterIntake = Math.round(profile.weight * 35);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    bmi,
    bmiCategory: bmiInfo.category,
    bmiColor: bmiInfo.color,
    bmiAdvice: bmiInfo.advice,
    caloricTarget,
    macros,
    waterIntake,
    idealWeightRange: {
      min: Math.round(18.5 * Math.pow(profile.height / 100, 2)),
      max: Math.round(24.9 * Math.pow(profile.height / 100, 2))
    }
  };
}

/**
 * Determine difficulty level based on profile
 */
function determineFitnessLevel(profile) {
  const { activity_level, age } = profile;
  
  if (activity_level === 'sedentary' || activity_level === 'light') {
    return 'beginner';
  }
  if (activity_level === 'moderate') {
    return age > 45 ? 'beginner' : 'intermediate';
  }
  if (activity_level === 'active' || activity_level === 'very_active') {
    return age > 50 ? 'intermediate' : 'advanced';
  }
  return 'beginner';
}

module.exports = {
  calculateBMR,
  calculateTDEE,
  calculateCaloricTarget,
  calculateMacros,
  calculateBMI,
  getBMICategory,
  analyzeProfile,
  determineFitnessLevel
};
