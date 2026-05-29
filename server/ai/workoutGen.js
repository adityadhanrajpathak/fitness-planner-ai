// ═══════════════════════════════════════════════════════════
// WORKOUT PLAN GENERATOR
// Creates personalized workout routines
// ═══════════════════════════════════════════════════════════

const { exercises } = require('./data');
const { determineFitnessLevel } = require('./engine');

/**
 * Get available exercises based on equipment and difficulty
 */
function getAvailableExercises(muscleGroup, equipment, difficulty) {
  const allExercises = exercises[muscleGroup] || [];
  
  const equipmentHierarchy = {
    bodyweight: ['bodyweight'],
    dumbbells: ['bodyweight', 'dumbbells'],
    pull_up_bar: ['bodyweight', 'pull_up_bar'],
    home_gym: ['bodyweight', 'dumbbells', 'pull_up_bar'],
    full_gym: ['bodyweight', 'dumbbells', 'pull_up_bar', 'full_gym']
  };

  const difficultyLevels = {
    beginner: ['beginner'],
    intermediate: ['beginner', 'intermediate'],
    advanced: ['beginner', 'intermediate', 'advanced']
  };

  const allowedEquipment = equipmentHierarchy[equipment] || ['bodyweight'];
  const allowedDifficulty = difficultyLevels[difficulty] || ['beginner'];

  return allExercises.filter(ex => 
    allowedEquipment.includes(ex.equipment) && 
    allowedDifficulty.includes(ex.difficulty)
  );
}

/**
 * Pick random exercises from array (Fisher-Yates shuffle)
 */
function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Create a workout split based on days per week
 */
function createWorkoutSplit(daysPerWeek, goal) {
  const splits = {
    3: {
      lose_weight: [
        { day: 'Day 1', focus: 'Full Body + Cardio', muscles: ['chest', 'back', 'legs', 'cardio'] },
        { day: 'Day 2', focus: 'Rest', muscles: [] },
        { day: 'Day 3', focus: 'Upper Body + Core', muscles: ['shoulders', 'arms', 'core', 'cardio'] },
        { day: 'Day 4', focus: 'Rest', muscles: [] },
        { day: 'Day 5', focus: 'Lower Body + HIIT', muscles: ['legs', 'core', 'cardio'] },
        { day: 'Day 6', focus: 'Rest / Light Walk', muscles: [] },
        { day: 'Day 7', focus: 'Rest', muscles: [] }
      ],
      default: [
        { day: 'Day 1', focus: 'Push (Chest, Shoulders, Triceps)', muscles: ['chest', 'shoulders', 'arms'] },
        { day: 'Day 2', focus: 'Rest', muscles: [] },
        { day: 'Day 3', focus: 'Pull (Back, Biceps) + Core', muscles: ['back', 'arms', 'core'] },
        { day: 'Day 4', focus: 'Rest', muscles: [] },
        { day: 'Day 5', focus: 'Legs + Cardio', muscles: ['legs', 'core', 'cardio'] },
        { day: 'Day 6', focus: 'Rest / Active Recovery', muscles: [] },
        { day: 'Day 7', focus: 'Rest', muscles: [] }
      ]
    },
    4: {
      default: [
        { day: 'Day 1', focus: 'Upper Body Push', muscles: ['chest', 'shoulders', 'arms'] },
        { day: 'Day 2', focus: 'Lower Body', muscles: ['legs', 'core'] },
        { day: 'Day 3', focus: 'Rest', muscles: [] },
        { day: 'Day 4', focus: 'Upper Body Pull', muscles: ['back', 'arms', 'core'] },
        { day: 'Day 5', focus: 'Legs + Cardio', muscles: ['legs', 'cardio'] },
        { day: 'Day 6', focus: 'Rest / Active Recovery', muscles: [] },
        { day: 'Day 7', focus: 'Rest', muscles: [] }
      ]
    },
    5: {
      default: [
        { day: 'Day 1', focus: 'Chest + Triceps', muscles: ['chest', 'arms'] },
        { day: 'Day 2', focus: 'Back + Biceps', muscles: ['back', 'arms'] },
        { day: 'Day 3', focus: 'Legs', muscles: ['legs', 'core'] },
        { day: 'Day 4', focus: 'Shoulders + Core', muscles: ['shoulders', 'core'] },
        { day: 'Day 5', focus: 'Full Body + Cardio', muscles: ['chest', 'back', 'legs', 'cardio'] },
        { day: 'Day 6', focus: 'Rest / Active Recovery', muscles: [] },
        { day: 'Day 7', focus: 'Rest', muscles: [] }
      ]
    },
    6: {
      default: [
        { day: 'Day 1', focus: 'Push (Chest, Shoulders, Triceps)', muscles: ['chest', 'shoulders', 'arms'] },
        { day: 'Day 2', focus: 'Pull (Back, Biceps)', muscles: ['back', 'arms'] },
        { day: 'Day 3', focus: 'Legs + Core', muscles: ['legs', 'core'] },
        { day: 'Day 4', focus: 'Push (Variation)', muscles: ['chest', 'shoulders', 'arms'] },
        { day: 'Day 5', focus: 'Pull (Variation) + Core', muscles: ['back', 'arms', 'core'] },
        { day: 'Day 6', focus: 'Legs + Cardio', muscles: ['legs', 'cardio'] },
        { day: 'Day 7', focus: 'Rest', muscles: [] }
      ]
    }
  };

  const daySplit = splits[daysPerWeek] || splits[4];
  return daySplit[goal] || daySplit.default;
}

/**
 * Adjust sets/reps based on goal
 */
function adjustForGoal(exercise, goal) {
  const ex = { ...exercise };
  
  switch (goal) {
    case 'lose_weight':
    case 'lose_weight_fast':
      // Higher reps, shorter rest for calorie burn
      ex.sets = Math.max(3, ex.sets);
      ex.reps = typeof ex.reps === 'string' && ex.reps.includes('-') 
        ? ex.reps.split('-').map(n => parseInt(n) + 3).join('-')
        : ex.reps;
      ex.rest = Math.max(30, ex.rest - 15);
      break;
    case 'gain_muscle':
      // Moderate reps, longer rest for hypertrophy
      ex.sets = Math.min(5, ex.sets + 1);
      ex.rest = Math.min(120, ex.rest + 15);
      break;
    case 'gain_weight':
      // Lower reps, heavier (implied), longer rest
      ex.sets = Math.min(5, ex.sets + 1);
      ex.reps = typeof ex.reps === 'string' && ex.reps.includes('-')
        ? ex.reps.split('-').map(n => Math.max(5, parseInt(n) - 2)).join('-')
        : ex.reps;
      ex.rest = Math.min(150, ex.rest + 30);
      break;
  }
  
  return ex;
}

/**
 * Generate a complete workout plan
 */
function generateWorkoutPlan(profile) {
  const fitnessLevel = determineFitnessLevel(profile);
  const equipment = determineEquipmentLevel(profile.equipment || []);
  const workoutDays = profile.workout_days || 4;
  const duration = profile.workout_duration || 45;
  const goal = profile.fitness_goal || 'maintain';

  const split = createWorkoutSplit(workoutDays, goal);

  // How many exercises per muscle group based on duration
  const exercisesPerGroup = duration <= 30 ? 2 : duration <= 45 ? 3 : 4;

  const plan = split.map(dayPlan => {
    if (dayPlan.muscles.length === 0) {
      return {
        day: dayPlan.day,
        focus: dayPlan.focus,
        isRest: true,
        exercises: [],
        tips: getRestDayTips()
      };
    }

    const dayExercises = [];
    
    // Add warm-up
    const warmup = {
      name: '🔥 Warm-up',
      sets: 1,
      reps: '5 min',
      rest: 0,
      instructions: 'Light cardio (jumping jacks, spot jogging) + dynamic stretches (arm circles, leg swings, hip circles)',
      isWarmup: true
    };
    dayExercises.push(warmup);

    // Generate exercises for each muscle group
    dayPlan.muscles.forEach(muscle => {
      const available = getAvailableExercises(muscle, equipment, fitnessLevel);
      const count = muscle === 'cardio' ? 1 : 
                    dayPlan.muscles.length > 3 ? Math.max(1, exercisesPerGroup - 1) : exercisesPerGroup;
      const selected = pickRandom(available, count);
      
      selected.forEach(ex => {
        dayExercises.push(adjustForGoal({
          ...ex,
          muscleGroup: muscle
        }, goal));
      });
    });

    // Add cooldown
    const cooldown = {
      name: '🧊 Cool-down',
      sets: 1,
      reps: '5 min',
      rest: 0,
      instructions: 'Static stretches: hold each stretch for 20-30 seconds. Focus on worked muscle groups.',
      isCooldown: true
    };
    dayExercises.push(cooldown);

    // Estimate total time
    const totalTime = estimateWorkoutTime(dayExercises);

    return {
      day: dayPlan.day,
      focus: dayPlan.focus,
      isRest: false,
      exercises: dayExercises,
      estimatedTime: totalTime,
      estimatedCalories: estimateCaloriesBurned(dayExercises, profile.weight)
    };
  });

  return {
    plan,
    metadata: {
      fitnessLevel,
      equipment,
      daysPerWeek: workoutDays,
      targetDuration: duration,
      goal,
      generatedAt: new Date().toISOString()
    }
  };
}

/**
 * Determine highest equipment level from user's list
 */
function determineEquipmentLevel(equipment) {
  if (equipment.includes('full_gym')) return 'full_gym';
  if (equipment.includes('home_gym')) return 'home_gym';
  if (equipment.includes('pull_up_bar') && equipment.includes('dumbbells')) return 'home_gym';
  if (equipment.includes('dumbbells')) return 'dumbbells';
  if (equipment.includes('pull_up_bar')) return 'pull_up_bar';
  return 'bodyweight';
}

/**
 * Estimate workout duration in minutes
 */
function estimateWorkoutTime(exercises) {
  let totalSeconds = 0;
  exercises.forEach(ex => {
    if (ex.isWarmup || ex.isCooldown) {
      totalSeconds += 300; // 5 minutes
      return;
    }
    const sets = ex.sets || 3;
    const timePerSet = 45; // average 45 seconds per set
    const rest = ex.rest || 60;
    totalSeconds += sets * timePerSet + (sets - 1) * rest;
  });
  return Math.round(totalSeconds / 60);
}

/**
 * Estimate calories burned
 */
function estimateCaloriesBurned(exercises, bodyWeight) {
  let total = 0;
  exercises.forEach(ex => {
    if (ex.isWarmup || ex.isCooldown) {
      total += 25;
      return;
    }
    const calPerMin = ex.calories_per_min || 5;
    const sets = ex.sets || 3;
    const timePerSet = 0.75; // ~45 sec per set in minutes
    total += calPerMin * sets * timePerSet * (bodyWeight / 70); // normalized to 70kg
  });
  return Math.round(total);
}

/**
 * Get rest day tips
 */
function getRestDayTips() {
  const tips = [
    'Take a 20-30 minute walk to keep blood flowing.',
    'Do 10-15 minutes of light stretching or yoga.',
    'Focus on hydration — drink at least 2-3 liters of water.',
    'Get 7-8 hours of quality sleep for recovery.',
    'Use a foam roller to reduce muscle soreness.',
    'Prepare your meals for the next day.'
  ];
  return pickRandom(tips, 3);
}

module.exports = { generateWorkoutPlan };
