// ═══════════════════════════════════════════════════════════
// DIET PLAN GENERATOR
// Creates personalized meal plans with cultural awareness
// ═══════════════════════════════════════════════════════════

const { foods } = require('./data');
const { analyzeProfile } = require('./engine');

/**
 * Filter foods based on dietary restrictions
 */
function filterByRestrictions(foodList, restrictions) {
  // Normalize restriction names: convert hyphens to underscores for consistent comparison
  const normalized = restrictions.map(r => r.replace(/-/g, '_'));
  return foodList.filter(food => {
    if (normalized.includes('vegetarian') && !food.veg) return false;
    if (normalized.includes('vegan') && !food.vegan) return false;
    if (normalized.includes('gluten_free') && !food.gluten_free) return false;
    if (normalized.includes('lactose_free') && !food.vegan && food.description && food.description.toLowerCase().includes('yogurt')) return false;
    return true;
  });
}

/**
 * Filter foods based on budget
 */
function filterByBudget(foodList, budget) {
  if (budget === 'tight') {
    return foodList.filter(f => f.cost === 'low');
  }
  if (budget === 'moderate') {
    return foodList.filter(f => f.cost === 'low' || f.cost === 'moderate');
  }
  return foodList; // flexible budget — all foods
}

/**
 * Pick random items from array
 */
function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Select a meal that fits within remaining calorie/macro budget
 */
function selectMeal(availableFoods, targetCalories, tolerance = 0.3) {
  const minCal = targetCalories * (1 - tolerance);
  const maxCal = targetCalories * (1 + tolerance);
  
  // Try to find a meal within range
  const inRange = availableFoods.filter(f => f.calories >= minCal && f.calories <= maxCal);
  
  if (inRange.length > 0) {
    return inRange[Math.floor(Math.random() * inRange.length)];
  }
  
  // If nothing in range, find closest
  availableFoods.sort((a, b) => 
    Math.abs(a.calories - targetCalories) - Math.abs(b.calories - targetCalories)
  );
  
  return availableFoods[0] || null;
}

/**
 * Generate meal plan for a single day
 */
function generateDayMeals(cultureFoods, mealsPerDay, targetCalories, targetMacros, restrictions, budget) {
  const meals = [];
  let remainingCalories = targetCalories;

  // Calorie distribution based on meals per day
  const distributions = {
    3: { breakfast: 0.30, lunch: 0.40, dinner: 0.30 },
    4: { breakfast: 0.25, snack1: 0.10, lunch: 0.35, dinner: 0.30 },
    5: { breakfast: 0.22, snack1: 0.10, lunch: 0.30, snack2: 0.10, dinner: 0.28 },
    6: { breakfast: 0.20, snack1: 0.08, lunch: 0.28, snack2: 0.08, dinner: 0.26, snack3: 0.10 }
  };

  const dist = distributions[mealsPerDay] || distributions[3];
  const mealOrder = Object.keys(dist);

  mealOrder.forEach((mealType, index) => {
    const mealCalTarget = Math.round(targetCalories * dist[mealType]);
    
    // Determine food category
    let foodCategory;
    if (mealType === 'breakfast') foodCategory = 'breakfast';
    else if (mealType === 'lunch') foodCategory = 'lunch';
    else if (mealType === 'dinner') foodCategory = 'dinner';
    else foodCategory = 'snacks';

    let availableFoods = cultureFoods[foodCategory] || [];
    availableFoods = filterByRestrictions(availableFoods, restrictions);
    availableFoods = filterByBudget(availableFoods, budget);

    if (availableFoods.length === 0) {
      // Fallback to any available food
      availableFoods = Object.values(cultureFoods).flat();
      availableFoods = filterByRestrictions(availableFoods, restrictions);
      availableFoods = filterByBudget(availableFoods, budget);
    }

    const selectedFood = selectMeal(availableFoods, mealCalTarget);
    
    if (selectedFood) {
      const mealLabel = formatMealLabel(mealType);
      const mealTime = getMealTime(mealType, mealsPerDay);
      
      meals.push({
        type: mealType,
        label: mealLabel,
        time: mealTime,
        food: selectedFood,
        targetCalories: mealCalTarget
      });
      
      remainingCalories -= selectedFood.calories;
    }
  });

  // Calculate actual totals
  const totals = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.food.calories,
    protein: acc.protein + meal.food.protein,
    carbs: acc.carbs + meal.food.carbs,
    fat: acc.fat + meal.food.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return { meals, totals };
}

/**
 * Format meal type to display label
 */
function formatMealLabel(type) {
  const labels = {
    breakfast: '🌅 Breakfast',
    snack1: '🍎 Morning Snack',
    lunch: '☀️ Lunch',
    snack2: '🥜 Afternoon Snack',
    dinner: '🌙 Dinner',
    snack3: '🥛 Evening Snack'
  };
  return labels[type] || type;
}

/**
 * Get suggested meal time
 */
function getMealTime(type, mealsPerDay) {
  const times = {
    3: { breakfast: '8:00 AM', lunch: '1:00 PM', dinner: '7:30 PM' },
    4: { breakfast: '8:00 AM', snack1: '10:30 AM', lunch: '1:00 PM', dinner: '7:30 PM' },
    5: { breakfast: '7:30 AM', snack1: '10:00 AM', lunch: '12:30 PM', snack2: '3:30 PM', dinner: '7:00 PM' },
    6: { breakfast: '7:00 AM', snack1: '9:30 AM', lunch: '12:00 PM', snack2: '3:00 PM', dinner: '6:30 PM', snack3: '8:30 PM' }
  };
  return (times[mealsPerDay] || times[3])[type] || '12:00 PM';
}

/**
 * Get foods for a culture (with fallback mixing)
 */
function getCultureFoods(culturalPreference) {
  if (culturalPreference === 'mixed') {
    // Combine all cultures
    const combined = { breakfast: [], lunch: [], dinner: [], snacks: [] };
    Object.values(foods).forEach(culture => {
      Object.keys(combined).forEach(meal => {
        combined[meal] = combined[meal].concat(culture[meal] || []);
      });
    });
    return combined;
  }
  return foods[culturalPreference] || foods.indian;
}

/**
 * Generate a shopping list from meal plan
 */
function generateShoppingList(weekPlan) {
  const items = new Map();
  
  weekPlan.forEach(day => {
    day.meals.forEach(meal => {
      const name = meal.food.name;
      if (items.has(name)) {
        items.set(name, items.get(name) + 1);
      } else {
        items.set(name, 1);
      }
    });
  });

  return Array.from(items.entries()).map(([name, count]) => ({
    item: name,
    frequency: count,
    note: count >= 5 ? 'Buy in bulk' : count >= 3 ? 'Stock up' : 'Regular purchase'
  }));
}

/**
 * Generate a complete 7-day diet plan
 */
function generateDietPlan(profile) {
  const analysis = analyzeProfile(profile);
  const cultureFoods = getCultureFoods(profile.cultural_preference || 'mixed');
  const restrictions = profile.dietary_restrictions || [];
  const budget = profile.budget || 'moderate';
  const mealsPerDay = profile.meals_per_day || 3;

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const weekPlan = weekDays.map(dayName => {
    const dayPlan = generateDayMeals(
      cultureFoods,
      mealsPerDay,
      analysis.caloricTarget,
      analysis.macros,
      restrictions,
      budget
    );
    
    return {
      day: dayName,
      ...dayPlan
    };
  });

  const shoppingList = generateShoppingList(weekPlan);

  // Calculate weekly averages
  const weeklyAvg = weekPlan.reduce((acc, day) => ({
    calories: acc.calories + day.totals.calories,
    protein: acc.protein + day.totals.protein,
    carbs: acc.carbs + day.totals.carbs,
    fat: acc.fat + day.totals.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  Object.keys(weeklyAvg).forEach(key => {
    weeklyAvg[key] = Math.round(weeklyAvg[key] / 7);
  });

  return {
    weekPlan,
    shoppingList,
    targets: {
      dailyCalories: analysis.caloricTarget,
      macros: analysis.macros,
      waterIntake: analysis.waterIntake
    },
    weeklyAverages: weeklyAvg,
    metadata: {
      culture: profile.cultural_preference || 'mixed',
      restrictions,
      budget,
      mealsPerDay,
      generatedAt: new Date().toISOString()
    }
  };
}

module.exports = { generateDietPlan };
