// ═══════════════════════════════════════════════════════════
// EXERCISE & FOOD DATABASE
// Comprehensive data for AI-powered plan generation
// ═══════════════════════════════════════════════════════════

// ─── Exercise Database ──────────────────────────────────────
const exercises = {
  chest: [
    { name: 'Push-ups', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 7, sets: 3, reps: '12-15', rest: 60, instructions: 'Keep body straight, lower chest to ground, push back up.' },
    { name: 'Wide Push-ups', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 7, sets: 3, reps: '10-12', rest: 60, instructions: 'Hands wider than shoulders, focus on chest stretch.' },
    { name: 'Diamond Push-ups', equipment: 'bodyweight', difficulty: 'intermediate', calories_per_min: 8, sets: 3, reps: '8-12', rest: 60, instructions: 'Hands form diamond shape under chest.' },
    { name: 'Decline Push-ups', equipment: 'bodyweight', difficulty: 'intermediate', calories_per_min: 8, sets: 3, reps: '10-12', rest: 60, instructions: 'Feet elevated on bench or chair.' },
    { name: 'Dumbbell Bench Press', equipment: 'dumbbells', difficulty: 'beginner', calories_per_min: 6, sets: 4, reps: '10-12', rest: 90, instructions: 'Lie on bench, press dumbbells up, squeeze chest at top.' },
    { name: 'Dumbbell Flyes', equipment: 'dumbbells', difficulty: 'intermediate', calories_per_min: 5, sets: 3, reps: '12-15', rest: 60, instructions: 'Arms wide, arc motion, squeeze at top.' },
    { name: 'Barbell Bench Press', equipment: 'full_gym', difficulty: 'intermediate', calories_per_min: 7, sets: 4, reps: '8-10', rest: 120, instructions: 'Grip slightly wider than shoulders, lower bar to chest.' },
    { name: 'Incline Dumbbell Press', equipment: 'dumbbells', difficulty: 'intermediate', calories_per_min: 6, sets: 3, reps: '10-12', rest: 90, instructions: 'Bench at 30-45 degrees, press up.' },
    { name: 'Cable Crossovers', equipment: 'full_gym', difficulty: 'intermediate', calories_per_min: 5, sets: 3, reps: '12-15', rest: 60, instructions: 'Pull cables together in arc motion at chest level.' },
    { name: 'Chest Dips', equipment: 'full_gym', difficulty: 'advanced', calories_per_min: 8, sets: 3, reps: '8-12', rest: 90, instructions: 'Lean forward on parallel bars, lower and push up.' }
  ],
  back: [
    { name: 'Superman Hold', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 5, sets: 3, reps: '20s hold', rest: 45, instructions: 'Lie face down, lift arms and legs off ground.' },
    { name: 'Reverse Snow Angels', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 4, sets: 3, reps: '12-15', rest: 45, instructions: 'Lie face down, move arms in arc from sides to overhead.' },
    { name: 'Dumbbell Rows', equipment: 'dumbbells', difficulty: 'beginner', calories_per_min: 6, sets: 4, reps: '10-12', rest: 90, instructions: 'One arm on bench, pull dumbbell to hip.' },
    { name: 'Dumbbell Deadlifts', equipment: 'dumbbells', difficulty: 'intermediate', calories_per_min: 8, sets: 4, reps: '8-10', rest: 120, instructions: 'Hinge at hips, keep back straight, lift with glutes and hamstrings.' },
    { name: 'Pull-ups', equipment: 'pull_up_bar', difficulty: 'intermediate', calories_per_min: 9, sets: 3, reps: '6-10', rest: 120, instructions: 'Overhand grip, pull chin above bar.' },
    { name: 'Chin-ups', equipment: 'pull_up_bar', difficulty: 'intermediate', calories_per_min: 9, sets: 3, reps: '6-10', rest: 120, instructions: 'Underhand grip, pull chin above bar.' },
    { name: 'Lat Pulldowns', equipment: 'full_gym', difficulty: 'beginner', calories_per_min: 5, sets: 4, reps: '10-12', rest: 90, instructions: 'Wide grip, pull bar to upper chest.' },
    { name: 'Barbell Rows', equipment: 'full_gym', difficulty: 'intermediate', calories_per_min: 7, sets: 4, reps: '8-10', rest: 90, instructions: 'Bend over, pull barbell to lower chest.' },
    { name: 'Seated Cable Rows', equipment: 'full_gym', difficulty: 'beginner', calories_per_min: 5, sets: 3, reps: '12-15', rest: 60, instructions: 'Sit upright, pull cable to midsection.' },
    { name: 'Inverted Rows', equipment: 'bodyweight', difficulty: 'intermediate', calories_per_min: 7, sets: 3, reps: '8-12', rest: 60, instructions: 'Hang under a bar or table, pull chest to bar.' }
  ],
  shoulders: [
    { name: 'Pike Push-ups', equipment: 'bodyweight', difficulty: 'intermediate', calories_per_min: 7, sets: 3, reps: '8-12', rest: 60, instructions: 'Hips high, lower head toward ground.' },
    { name: 'Arm Circles', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 3, sets: 3, reps: '20 each direction', rest: 30, instructions: 'Extended arms, make circles forward and backward.' },
    { name: 'Dumbbell Shoulder Press', equipment: 'dumbbells', difficulty: 'beginner', calories_per_min: 6, sets: 4, reps: '10-12', rest: 90, instructions: 'Press dumbbells overhead from shoulder level.' },
    { name: 'Lateral Raises', equipment: 'dumbbells', difficulty: 'beginner', calories_per_min: 4, sets: 3, reps: '12-15', rest: 60, instructions: 'Raise dumbbells to sides until parallel with ground.' },
    { name: 'Front Raises', equipment: 'dumbbells', difficulty: 'beginner', calories_per_min: 4, sets: 3, reps: '12-15', rest: 60, instructions: 'Raise dumbbells in front to shoulder height.' },
    { name: 'Arnold Press', equipment: 'dumbbells', difficulty: 'intermediate', calories_per_min: 6, sets: 3, reps: '10-12', rest: 90, instructions: 'Start palms facing you, rotate as you press up.' },
    { name: 'Face Pulls', equipment: 'full_gym', difficulty: 'beginner', calories_per_min: 4, sets: 3, reps: '15-20', rest: 60, instructions: 'Pull rope to face level, squeeze rear delts.' },
    { name: 'Military Press', equipment: 'full_gym', difficulty: 'intermediate', calories_per_min: 7, sets: 4, reps: '8-10', rest: 120, instructions: 'Press barbell overhead from front of shoulders.' },
    { name: 'Handstand Push-ups (Wall)', equipment: 'bodyweight', difficulty: 'advanced', calories_per_min: 9, sets: 3, reps: '5-8', rest: 120, instructions: 'Kick up against wall, lower head toward ground.' }
  ],
  legs: [
    { name: 'Bodyweight Squats', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 8, sets: 4, reps: '15-20', rest: 60, instructions: 'Feet shoulder-width, lower until thighs parallel.' },
    { name: 'Lunges', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 7, sets: 3, reps: '12 each leg', rest: 60, instructions: 'Step forward, lower back knee toward ground.' },
    { name: 'Jump Squats', equipment: 'bodyweight', difficulty: 'intermediate', calories_per_min: 10, sets: 3, reps: '12-15', rest: 60, instructions: 'Squat down, explode upward.' },
    { name: 'Bulgarian Split Squats', equipment: 'bodyweight', difficulty: 'intermediate', calories_per_min: 8, sets: 3, reps: '10 each leg', rest: 90, instructions: 'Rear foot on bench, squat on front leg.' },
    { name: 'Wall Sit', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 5, sets: 3, reps: '30-60s hold', rest: 60, instructions: 'Back against wall, thighs parallel to ground.' },
    { name: 'Goblet Squats', equipment: 'dumbbells', difficulty: 'beginner', calories_per_min: 8, sets: 4, reps: '12-15', rest: 90, instructions: 'Hold dumbbell at chest, squat deep.' },
    { name: 'Dumbbell Lunges', equipment: 'dumbbells', difficulty: 'intermediate', calories_per_min: 7, sets: 3, reps: '10 each leg', rest: 90, instructions: 'Hold dumbbells at sides, lunge forward.' },
    { name: 'Barbell Squats', equipment: 'full_gym', difficulty: 'intermediate', calories_per_min: 10, sets: 4, reps: '8-10', rest: 120, instructions: 'Bar on upper back, squat to parallel or below.' },
    { name: 'Leg Press', equipment: 'full_gym', difficulty: 'beginner', calories_per_min: 7, sets: 4, reps: '12-15', rest: 90, instructions: 'Push platform away, don\'t lock knees.' },
    { name: 'Romanian Deadlifts', equipment: 'dumbbells', difficulty: 'intermediate', calories_per_min: 7, sets: 3, reps: '10-12', rest: 90, instructions: 'Hinge at hips, slight knee bend, feel hamstring stretch.' },
    { name: 'Calf Raises', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 4, sets: 3, reps: '20-25', rest: 45, instructions: 'Rise up on toes, squeeze calves at top.' },
    { name: 'Step-ups', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 7, sets: 3, reps: '12 each leg', rest: 60, instructions: 'Step onto elevated surface, drive through heel.' }
  ],
  arms: [
    { name: 'Tricep Dips (Chair)', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 6, sets: 3, reps: '12-15', rest: 60, instructions: 'Hands on chair edge, lower body by bending elbows.' },
    { name: 'Close-grip Push-ups', equipment: 'bodyweight', difficulty: 'intermediate', calories_per_min: 7, sets: 3, reps: '10-12', rest: 60, instructions: 'Hands close together, elbows tight to body.' },
    { name: 'Bicep Curls', equipment: 'dumbbells', difficulty: 'beginner', calories_per_min: 4, sets: 3, reps: '12-15', rest: 60, instructions: 'Curl dumbbells up, squeeze biceps at top.' },
    { name: 'Hammer Curls', equipment: 'dumbbells', difficulty: 'beginner', calories_per_min: 4, sets: 3, reps: '12-15', rest: 60, instructions: 'Neutral grip, curl dumbbells up.' },
    { name: 'Tricep Extensions', equipment: 'dumbbells', difficulty: 'beginner', calories_per_min: 4, sets: 3, reps: '12-15', rest: 60, instructions: 'Overhead, lower dumbbell behind head, extend up.' },
    { name: 'Concentration Curls', equipment: 'dumbbells', difficulty: 'intermediate', calories_per_min: 4, sets: 3, reps: '10-12', rest: 60, instructions: 'Seated, elbow on inner thigh, curl up.' },
    { name: 'Skull Crushers', equipment: 'dumbbells', difficulty: 'intermediate', calories_per_min: 5, sets: 3, reps: '10-12', rest: 60, instructions: 'Lie on bench, lower dumbbells to forehead, extend up.' },
    { name: 'Cable Curls', equipment: 'full_gym', difficulty: 'beginner', calories_per_min: 4, sets: 3, reps: '12-15', rest: 60, instructions: 'Use low pulley, curl bar up.' },
    { name: 'Rope Pushdowns', equipment: 'full_gym', difficulty: 'beginner', calories_per_min: 4, sets: 3, reps: '12-15', rest: 60, instructions: 'High pulley, push rope down, spread at bottom.' }
  ],
  core: [
    { name: 'Plank', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 5, sets: 3, reps: '30-60s hold', rest: 45, instructions: 'Forearms on ground, body straight, engage core.' },
    { name: 'Bicycle Crunches', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 7, sets: 3, reps: '20 total', rest: 45, instructions: 'Alternate elbow to opposite knee.' },
    { name: 'Mountain Climbers', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 10, sets: 3, reps: '20 total', rest: 45, instructions: 'Plank position, alternate driving knees to chest.' },
    { name: 'Russian Twists', equipment: 'bodyweight', difficulty: 'intermediate', calories_per_min: 6, sets: 3, reps: '20 total', rest: 45, instructions: 'Seated, lean back, twist torso side to side.' },
    { name: 'Leg Raises', equipment: 'bodyweight', difficulty: 'intermediate', calories_per_min: 6, sets: 3, reps: '12-15', rest: 45, instructions: 'Lie flat, raise legs to 90 degrees, lower slowly.' },
    { name: 'Dead Bugs', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 5, sets: 3, reps: '10 each side', rest: 45, instructions: 'On back, extend opposite arm and leg.' },
    { name: 'Flutter Kicks', equipment: 'bodyweight', difficulty: 'intermediate', calories_per_min: 7, sets: 3, reps: '30s', rest: 45, instructions: 'Lie flat, alternate kicking legs up and down.' },
    { name: 'Cable Woodchops', equipment: 'full_gym', difficulty: 'intermediate', calories_per_min: 6, sets: 3, reps: '12 each side', rest: 60, instructions: 'Rotate torso pulling cable diagonally.' },
    { name: 'Ab Rollouts', equipment: 'full_gym', difficulty: 'advanced', calories_per_min: 7, sets: 3, reps: '8-12', rest: 60, instructions: 'Kneel, roll wheel forward, pull back with core.' },
    { name: 'V-ups', equipment: 'bodyweight', difficulty: 'advanced', calories_per_min: 8, sets: 3, reps: '12-15', rest: 60, instructions: 'Lie flat, simultaneously raise legs and torso to form V.' }
  ],
  cardio: [
    { name: 'Jumping Jacks', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 10, sets: 1, reps: '60s', rest: 30, instructions: 'Jump, spread arms and legs, jump back.' },
    { name: 'High Knees', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 11, sets: 1, reps: '45s', rest: 30, instructions: 'Run in place, driving knees high.' },
    { name: 'Burpees', equipment: 'bodyweight', difficulty: 'intermediate', calories_per_min: 12, sets: 3, reps: '10-12', rest: 60, instructions: 'Squat, plank, push-up, jump up.' },
    { name: 'Spot Jogging', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 8, sets: 1, reps: '5 min', rest: 60, instructions: 'Jog in place at a comfortable pace.' },
    { name: 'Skipping Rope', equipment: 'bodyweight', difficulty: 'beginner', calories_per_min: 12, sets: 3, reps: '60s', rest: 45, instructions: 'Jump rope at steady pace.' },
    { name: 'Box Jumps', equipment: 'bodyweight', difficulty: 'intermediate', calories_per_min: 10, sets: 3, reps: '10-12', rest: 60, instructions: 'Jump onto elevated surface, step down.' },
    { name: 'Treadmill Run', equipment: 'full_gym', difficulty: 'beginner', calories_per_min: 11, sets: 1, reps: '20-30 min', rest: 0, instructions: 'Run at moderate pace on treadmill.' },
    { name: 'Cycling', equipment: 'full_gym', difficulty: 'beginner', calories_per_min: 9, sets: 1, reps: '20-30 min', rest: 0, instructions: 'Pedal at moderate resistance.' }
  ]
};

// ─── Food Database with Cultural Tags ───────────────────────
const foods = {
  // ── Indian Foods ──
  indian: {
    breakfast: [
      { name: 'Poha', calories: 250, protein: 5, carbs: 45, fat: 6, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Flattened rice with veggies, peanuts & turmeric' },
      { name: 'Upma', calories: 220, protein: 6, carbs: 38, fat: 5, cost: 'low', veg: true, vegan: true, gluten_free: false, description: 'Semolina cooked with veggies & mustard seeds' },
      { name: 'Idli (3 pcs) + Sambar', calories: 280, protein: 9, carbs: 50, fat: 3, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Steamed rice cakes with lentil soup' },
      { name: 'Moong Dal Chilla', calories: 200, protein: 14, carbs: 28, fat: 4, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Lentil crepe with green chutney' },
      { name: 'Paratha + Curd', calories: 350, protein: 10, carbs: 45, fat: 14, cost: 'low', veg: true, vegan: false, gluten_free: false, description: 'Stuffed flatbread with yogurt' },
      { name: 'Dosa + Chutney', calories: 230, protein: 6, carbs: 40, fat: 5, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Rice-lentil crepe with coconut chutney' },
      { name: 'Besan Chilla', calories: 210, protein: 12, carbs: 25, fat: 7, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Chickpea flour pancake with onions & tomatoes' },
      { name: 'Paneer Bhurji + Roti', calories: 380, protein: 20, carbs: 35, fat: 16, cost: 'moderate', veg: true, vegan: false, gluten_free: false, description: 'Scrambled cottage cheese with flatbread' },
      { name: 'Egg Bhurji + Toast', calories: 320, protein: 22, carbs: 28, fat: 12, cost: 'moderate', veg: false, vegan: false, gluten_free: false, description: 'Indian-style scrambled eggs with toast' },
      { name: 'Oats Porridge (Masala)', calories: 180, protein: 7, carbs: 30, fat: 4, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Savory oats with veggies & spices' }
    ],
    lunch: [
      { name: 'Dal + Rice + Sabzi', calories: 450, protein: 15, carbs: 70, fat: 10, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Lentils, rice, and vegetable curry' },
      { name: 'Rajma Chawal', calories: 420, protein: 16, carbs: 68, fat: 8, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Kidney bean curry with rice' },
      { name: 'Chole + 2 Roti', calories: 400, protein: 14, carbs: 60, fat: 10, cost: 'low', veg: true, vegan: true, gluten_free: false, description: 'Chickpea curry with flatbread' },
      { name: 'Chicken Curry + Rice', calories: 500, protein: 30, carbs: 55, fat: 16, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Spiced chicken curry with steamed rice' },
      { name: 'Paneer Tikka + Roti', calories: 450, protein: 22, carbs: 40, fat: 20, cost: 'moderate', veg: true, vegan: false, gluten_free: false, description: 'Grilled cottage cheese with flatbread' },
      { name: 'Fish Curry + Rice', calories: 420, protein: 28, carbs: 50, fat: 12, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Fish in tangy curry with rice' },
      { name: 'Egg Curry + 2 Roti', calories: 380, protein: 20, carbs: 42, fat: 14, cost: 'low', veg: false, vegan: false, gluten_free: false, description: 'Boiled eggs in spiced gravy with flatbread' },
      { name: 'Sambar Rice + Papad', calories: 380, protein: 12, carbs: 65, fat: 6, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'South Indian lentil stew with rice' },
      { name: 'Kadhi Chawal', calories: 370, protein: 10, carbs: 60, fat: 8, cost: 'low', veg: true, vegan: false, gluten_free: true, description: 'Yogurt-based curry with rice' },
      { name: 'Biryani (Veg)', calories: 440, protein: 10, carbs: 65, fat: 14, cost: 'moderate', veg: true, vegan: true, gluten_free: true, description: 'Fragrant rice with mixed vegetables & spices' }
    ],
    dinner: [
      { name: 'Roti + Palak Paneer', calories: 380, protein: 18, carbs: 38, fat: 16, cost: 'moderate', veg: true, vegan: false, gluten_free: false, description: 'Flatbread with spinach-cottage cheese curry' },
      { name: 'Khichdi + Raita', calories: 320, protein: 12, carbs: 50, fat: 6, cost: 'low', veg: true, vegan: false, gluten_free: true, description: 'Rice-lentil porridge with yogurt side' },
      { name: 'Grilled Chicken + Salad', calories: 350, protein: 35, carbs: 15, fat: 16, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Tandoori-style grilled chicken with fresh salad' },
      { name: 'Moong Dal + Roti', calories: 340, protein: 14, carbs: 50, fat: 7, cost: 'low', veg: true, vegan: true, gluten_free: false, description: 'Yellow lentils with whole wheat flatbread' },
      { name: 'Vegetable Soup + Toast', calories: 200, protein: 6, carbs: 30, fat: 5, cost: 'low', veg: true, vegan: true, gluten_free: false, description: 'Mixed vegetable soup with whole wheat toast' },
      { name: 'Tandoori Fish + Veggies', calories: 300, protein: 30, carbs: 12, fat: 14, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Spiced baked fish with roasted vegetables' },
      { name: 'Egg Omelette + 2 Roti', calories: 360, protein: 20, carbs: 35, fat: 14, cost: 'low', veg: false, vegan: false, gluten_free: false, description: 'Masala omelette with flatbread' },
      { name: 'Tofu Bhurji + Roti', calories: 320, protein: 18, carbs: 35, fat: 12, cost: 'moderate', veg: true, vegan: true, gluten_free: false, description: 'Scrambled tofu with spices and flatbread' }
    ],
    snacks: [
      { name: 'Roasted Chana', calories: 120, protein: 7, carbs: 18, fat: 2, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Roasted chickpeas with spices' },
      { name: 'Sprouts Chaat', calories: 150, protein: 10, carbs: 22, fat: 2, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Mixed sprouts with onion, lemon & chaat masala' },
      { name: 'Banana + Peanuts', calories: 200, protein: 7, carbs: 30, fat: 8, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Banana with a handful of peanuts' },
      { name: 'Paneer Tikka (5 pcs)', calories: 180, protein: 14, carbs: 5, fat: 12, cost: 'moderate', veg: true, vegan: false, gluten_free: true, description: 'Grilled cottage cheese cubes' },
      { name: 'Boiled Eggs (2)', calories: 140, protein: 12, carbs: 1, fat: 10, cost: 'low', veg: false, vegan: false, gluten_free: true, description: 'Hard-boiled eggs with salt & pepper' },
      { name: 'Makhana (Fox Nuts)', calories: 100, protein: 4, carbs: 18, fat: 1, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Roasted fox nuts, light & crunchy' },
      { name: 'Lassi (Sweet/Salt)', calories: 160, protein: 6, carbs: 22, fat: 5, cost: 'low', veg: true, vegan: false, gluten_free: true, description: 'Yogurt-based Indian drink' },
      { name: 'Fruit Chaat', calories: 130, protein: 2, carbs: 30, fat: 1, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Mixed fruits with chaat masala' }
    ]
  },

  // ── Western Foods ──
  western: {
    breakfast: [
      { name: 'Oatmeal + Berries', calories: 280, protein: 8, carbs: 48, fat: 6, cost: 'moderate', veg: true, vegan: true, gluten_free: true, description: 'Rolled oats with fresh mixed berries' },
      { name: 'Greek Yogurt Parfait', calories: 300, protein: 18, carbs: 35, fat: 10, cost: 'moderate', veg: true, vegan: false, gluten_free: true, description: 'Greek yogurt with granola & honey' },
      { name: 'Scrambled Eggs + Toast', calories: 350, protein: 22, carbs: 30, fat: 14, cost: 'moderate', veg: false, vegan: false, gluten_free: false, description: 'Fluffy scrambled eggs with whole wheat toast' },
      { name: 'Protein Smoothie', calories: 320, protein: 25, carbs: 40, fat: 6, cost: 'moderate', veg: true, vegan: true, gluten_free: true, description: 'Banana, oats, peanut butter, milk blend' },
      { name: 'Avocado Toast', calories: 300, protein: 8, carbs: 30, fat: 18, cost: 'moderate', veg: true, vegan: true, gluten_free: false, description: 'Mashed avocado on whole grain toast' },
      { name: 'Pancakes + Maple Syrup', calories: 400, protein: 10, carbs: 65, fat: 12, cost: 'moderate', veg: true, vegan: false, gluten_free: false, description: 'Fluffy pancakes with maple syrup' },
      { name: 'Egg White Omelette', calories: 200, protein: 24, carbs: 5, fat: 8, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Egg whites with spinach, tomatoes & peppers' }
    ],
    lunch: [
      { name: 'Grilled Chicken Salad', calories: 400, protein: 35, carbs: 20, fat: 20, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Mixed greens with grilled chicken & vinaigrette' },
      { name: 'Turkey Sandwich', calories: 420, protein: 28, carbs: 45, fat: 14, cost: 'moderate', veg: false, vegan: false, gluten_free: false, description: 'Whole wheat bread, turkey, lettuce, tomato' },
      { name: 'Chicken Wrap', calories: 450, protein: 30, carbs: 40, fat: 16, cost: 'moderate', veg: false, vegan: false, gluten_free: false, description: 'Grilled chicken, veggies, hummus in tortilla' },
      { name: 'Quinoa Buddha Bowl', calories: 420, protein: 16, carbs: 55, fat: 14, cost: 'moderate', veg: true, vegan: true, gluten_free: true, description: 'Quinoa, roasted veggies, chickpeas, tahini' },
      { name: 'Tuna Salad', calories: 350, protein: 30, carbs: 15, fat: 18, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Tuna with mixed veggies & light mayo' },
      { name: 'Pasta Primavera', calories: 450, protein: 14, carbs: 65, fat: 12, cost: 'moderate', veg: true, vegan: true, gluten_free: false, description: 'Whole wheat pasta with seasonal vegetables' }
    ],
    dinner: [
      { name: 'Grilled Salmon + Veggies', calories: 450, protein: 35, carbs: 20, fat: 24, cost: 'high', veg: false, vegan: false, gluten_free: true, description: 'Baked salmon with roasted vegetables' },
      { name: 'Chicken Stir-fry + Rice', calories: 480, protein: 30, carbs: 55, fat: 14, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Chicken with vegetables in soy sauce over rice' },
      { name: 'Veggie Burger + Side Salad', calories: 400, protein: 18, carbs: 45, fat: 16, cost: 'moderate', veg: true, vegan: true, gluten_free: false, description: 'Plant-based burger patty with fresh salad' },
      { name: 'Baked Chicken Breast + Sweet Potato', calories: 420, protein: 38, carbs: 40, fat: 10, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Herb-baked chicken with roasted sweet potato' },
      { name: 'Lentil Soup + Bread', calories: 350, protein: 16, carbs: 50, fat: 8, cost: 'low', veg: true, vegan: true, gluten_free: false, description: 'Hearty lentil soup with whole grain bread' },
      { name: 'Steak + Mashed Potatoes', calories: 550, protein: 40, carbs: 35, fat: 26, cost: 'high', veg: false, vegan: false, gluten_free: true, description: 'Grilled steak with creamy mashed potatoes' }
    ],
    snacks: [
      { name: 'Protein Bar', calories: 200, protein: 20, carbs: 22, fat: 7, cost: 'moderate', veg: true, vegan: false, gluten_free: true, description: 'High-protein energy bar' },
      { name: 'Apple + Peanut Butter', calories: 250, protein: 7, carbs: 30, fat: 14, cost: 'moderate', veg: true, vegan: true, gluten_free: true, description: 'Sliced apple with natural peanut butter' },
      { name: 'Trail Mix', calories: 180, protein: 6, carbs: 18, fat: 10, cost: 'moderate', veg: true, vegan: true, gluten_free: true, description: 'Mixed nuts, seeds & dried fruits' },
      { name: 'Cottage Cheese + Fruit', calories: 170, protein: 14, carbs: 18, fat: 5, cost: 'moderate', veg: true, vegan: false, gluten_free: true, description: 'Low-fat cottage cheese with fresh fruit' },
      { name: 'Hummus + Veggies', calories: 150, protein: 6, carbs: 18, fat: 7, cost: 'moderate', veg: true, vegan: true, gluten_free: true, description: 'Hummus with carrot & cucumber sticks' },
      { name: 'Hard Boiled Eggs (2)', calories: 140, protein: 12, carbs: 1, fat: 10, cost: 'low', veg: false, vegan: false, gluten_free: true, description: 'Simple high-protein snack' }
    ]
  },

  // ── Mediterranean Foods ──
  mediterranean: {
    breakfast: [
      { name: 'Shakshuka', calories: 300, protein: 16, carbs: 20, fat: 18, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Eggs poached in spiced tomato sauce' },
      { name: 'Labneh + Za\'atar Toast', calories: 280, protein: 12, carbs: 30, fat: 12, cost: 'moderate', veg: true, vegan: false, gluten_free: false, description: 'Strained yogurt with olive oil & za\'atar on toast' },
      { name: 'Foul Medames', calories: 300, protein: 16, carbs: 42, fat: 8, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Mashed fava beans with lemon, garlic & olive oil' },
      { name: 'Mediterranean Omelette', calories: 320, protein: 20, carbs: 10, fat: 22, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Eggs with feta, olives, tomatoes & herbs' }
    ],
    lunch: [
      { name: 'Falafel Wrap', calories: 450, protein: 16, carbs: 55, fat: 18, cost: 'moderate', veg: true, vegan: true, gluten_free: false, description: 'Crispy falafel in pita with tahini & veggies' },
      { name: 'Greek Salad + Grilled Chicken', calories: 420, protein: 32, carbs: 18, fat: 24, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Classic Greek salad with herbs-grilled chicken' },
      { name: 'Hummus Bowl + Pita', calories: 400, protein: 14, carbs: 50, fat: 16, cost: 'low', veg: true, vegan: true, gluten_free: false, description: 'Creamy hummus with warm pita & pickled veggies' },
      { name: 'Grilled Fish + Couscous', calories: 440, protein: 30, carbs: 45, fat: 14, cost: 'moderate', veg: false, vegan: false, gluten_free: false, description: 'Herb-grilled fish with fluffy couscous' }
    ],
    dinner: [
      { name: 'Grilled Lamb Kofta + Tabbouleh', calories: 480, protein: 28, carbs: 35, fat: 24, cost: 'moderate', veg: false, vegan: false, gluten_free: false, description: 'Spiced lamb skewers with parsley-bulgur salad' },
      { name: 'Stuffed Bell Peppers', calories: 380, protein: 16, carbs: 45, fat: 14, cost: 'moderate', veg: true, vegan: true, gluten_free: true, description: 'Bell peppers stuffed with rice, herbs & pine nuts' },
      { name: 'Baked Fish + Roasted Veggies', calories: 400, protein: 32, carbs: 22, fat: 20, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Olive oil baked fish with Mediterranean vegetables' },
      { name: 'Lentil Mujaddara', calories: 380, protein: 14, carbs: 58, fat: 8, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Lentils & rice with caramelized onions' }
    ],
    snacks: [
      { name: 'Dates + Almonds', calories: 180, protein: 5, carbs: 28, fat: 7, cost: 'moderate', veg: true, vegan: true, gluten_free: true, description: 'Medjool dates stuffed with almonds' },
      { name: 'Labneh Dip + Cucumbers', calories: 120, protein: 8, carbs: 8, fat: 6, cost: 'moderate', veg: true, vegan: false, gluten_free: true, description: 'Thick yogurt dip with fresh cucumbers' },
      { name: 'Olives + Feta', calories: 150, protein: 6, carbs: 4, fat: 12, cost: 'moderate', veg: true, vegan: false, gluten_free: true, description: 'Mixed olives with crumbled feta cheese' }
    ]
  },

  // ── Asian Foods ──
  asian: {
    breakfast: [
      { name: 'Congee (Rice Porridge)', calories: 200, protein: 6, carbs: 38, fat: 3, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Savory rice porridge with toppings' },
      { name: 'Miso Soup + Rice', calories: 250, protein: 10, carbs: 42, fat: 4, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Traditional miso soup with steamed rice' },
      { name: 'Steamed Buns (Baozi)', calories: 300, protein: 12, carbs: 45, fat: 8, cost: 'low', veg: false, vegan: false, gluten_free: false, description: 'Fluffy steamed buns with meat filling' },
      { name: 'Egg Fried Rice', calories: 350, protein: 14, carbs: 50, fat: 10, cost: 'low', veg: false, vegan: false, gluten_free: true, description: 'Quick fried rice with eggs & scallions' }
    ],
    lunch: [
      { name: 'Chicken Teriyaki + Rice', calories: 480, protein: 30, carbs: 60, fat: 12, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Glazed chicken with steamed rice' },
      { name: 'Tofu Stir-fry + Noodles', calories: 420, protein: 18, carbs: 55, fat: 14, cost: 'low', veg: true, vegan: true, gluten_free: false, description: 'Crispy tofu with vegetables over noodles' },
      { name: 'Sushi Bowl', calories: 400, protein: 22, carbs: 55, fat: 10, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Deconstructed sushi with fish, rice & veggies' },
      { name: 'Pho (Vietnamese Soup)', calories: 380, protein: 24, carbs: 45, fat: 10, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Aromatic broth with rice noodles & herbs' },
      { name: 'Bibimbap', calories: 450, protein: 20, carbs: 60, fat: 14, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Korean mixed rice with veggies & egg' }
    ],
    dinner: [
      { name: 'Steamed Fish + Bok Choy', calories: 320, protein: 30, carbs: 15, fat: 14, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Light steamed fish with ginger & greens' },
      { name: 'Vegetable Curry + Rice', calories: 400, protein: 10, carbs: 60, fat: 14, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Thai-style coconut vegetable curry' },
      { name: 'Grilled Chicken Satay + Salad', calories: 380, protein: 32, carbs: 18, fat: 20, cost: 'moderate', veg: false, vegan: false, gluten_free: true, description: 'Peanut-glazed chicken skewers with fresh salad' },
      { name: 'Miso Ramen', calories: 450, protein: 20, carbs: 55, fat: 16, cost: 'moderate', veg: false, vegan: false, gluten_free: false, description: 'Rich miso broth ramen with toppings' }
    ],
    snacks: [
      { name: 'Edamame', calories: 120, protein: 11, carbs: 10, fat: 5, cost: 'moderate', veg: true, vegan: true, gluten_free: true, description: 'Steamed soybeans with sea salt' },
      { name: 'Seaweed Snacks', calories: 60, protein: 2, carbs: 4, fat: 4, cost: 'moderate', veg: true, vegan: true, gluten_free: true, description: 'Crispy roasted seaweed sheets' },
      { name: 'Rice Cakes', calories: 140, protein: 3, carbs: 30, fat: 1, cost: 'low', veg: true, vegan: true, gluten_free: true, description: 'Puffed rice cakes, light & crunchy' },
      { name: 'Mochi (2 pcs)', calories: 160, protein: 3, carbs: 35, fat: 1, cost: 'moderate', veg: true, vegan: true, gluten_free: true, description: 'Sweet rice cake with filling' }
    ]
  }
};

// ─── Motivational Quotes ────────────────────────────────────
const quotes = [
  "The only bad workout is the one that didn't happen. 💪",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Don't wish for a good body, work for it.",
  "Strive for progress, not perfection.",
  "Success isn't always about greatness. It's about consistency.",
  "Your health is an investment, not an expense.",
  "A healthy outside starts from the inside.",
  "Push yourself because no one else is going to do it for you.",
  "Every champion was once a contender that refused to give up.",
  "The secret of getting ahead is getting started.",
  "Eat clean. Train dirty. 🏋️",
  "Wake up with determination. Go to bed with satisfaction.",
  "Small daily improvements are the key to staggering long-term results."
];

module.exports = { exercises, foods, quotes };
