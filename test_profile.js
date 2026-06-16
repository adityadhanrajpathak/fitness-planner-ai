const { createClient } = require('@libsql/client');
const client = createClient({ url: 'file:fitness.db' });

const sql = `
  INSERT INTO profiles
    (user_id, age, gender, height, weight, activity_level, fitness_goal,
     dietary_restrictions, cultural_preference, budget, equipment,
     meals_per_day, workout_days, workout_duration, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  ON CONFLICT(user_id) DO UPDATE SET
    age=excluded.age, gender=excluded.gender, height=excluded.height,
    weight=excluded.weight, activity_level=excluded.activity_level,
    fitness_goal=excluded.fitness_goal,
    dietary_restrictions=excluded.dietary_restrictions,
    cultural_preference=excluded.cultural_preference, budget=excluded.budget,
    equipment=excluded.equipment, meals_per_day=excluded.meals_per_day,
    workout_days=excluded.workout_days, workout_duration=excluded.workout_duration,
    updated_at=CURRENT_TIMESTAMP
`;

client.execute({
  sql,
  args: [1, 22, 'male', 175, 70, 'moderate', 'maintain', '[]', 'mixed', 'moderate', '["gym"]', 3, 4, 45]
})
.then(r => console.log('upsertProfile OK:', JSON.stringify(r)))
.catch(e => console.error('upsertProfile FAILED:', e.message));
