/*
  # Create all required tables for fitness tracking app

  1. New Tables
    - `users` - User profiles
    - `weeks` - Training weeks for weight tracking
    - `days` - Individual training days
    - `exercises` - Exercises with weight/reps tracking
    - `cardio` - Cardio activities
    - `meals` - Diet meals/foods
    - `custom_meal_types` - Custom meal type definitions
    - `food_substitutions` - Alternative foods for meals
    - `diary_entries` - Daily diet diary
    - `evolution_weeks` - Weekly training plans (exercise list only)
    - `evolution_exercises` - Exercises in weekly plans
    - `evolution_exercise_sets` - Sets and reps (no weight tracking)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Important Notes
    - Evolution tables: for planning exercises, sets, and reps (no weight)
    - Week/Day/Exercise tables: for tracking actual weights and progress over time
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Create weeks table (for weight tracking progression)
CREATE TABLE IF NOT EXISTS weeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  createdAt timestamptz DEFAULT now()
);

ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own weeks" ON weeks
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create days table
CREATE TABLE IF NOT EXISTS days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weekId uuid NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  date date NOT NULL,
  dayName text NOT NULL
);

ALTER TABLE days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own days" ON days
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create exercises table (for tracking weights)
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dayId uuid NOT NULL REFERENCES days(id) ON DELETE CASCADE,
  exerciseId text NOT NULL,
  exerciseName text NOT NULL,
  muscleGroup text NOT NULL,
  sets integer NOT NULL DEFAULT 3,
  reps integer NOT NULL DEFAULT 10,
  weight numeric NOT NULL DEFAULT 0,
  notes text,
  createdAt timestamptz DEFAULT now()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own exercises" ON exercises
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create cardio table
CREATE TABLE IF NOT EXISTS cardio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_id uuid NOT NULL REFERENCES days(id) ON DELETE CASCADE,
  cardio_type text NOT NULL,
  duration_minutes integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cardio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cardio" ON cardio
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create custom_meal_types table
CREATE TABLE IF NOT EXISTS custom_meal_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE custom_meal_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own custom meal types" ON custom_meal_types
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_type text NOT NULL,
  food_name text NOT NULL,
  quantity text NOT NULL,
  time text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own meals" ON meals
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create food_substitutions table
CREATE TABLE IF NOT EXISTS food_substitutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_id uuid NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  substitute_name text NOT NULL,
  quantity text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE food_substitutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own food substitutions" ON food_substitutions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create diary_entries table
CREATE TABLE IF NOT EXISTS diary_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  diary_text text DEFAULT '',
  free_meal boolean DEFAULT false,
  free_meal_description text DEFAULT '',
  water_goal boolean DEFAULT false,
  workout_done boolean DEFAULT false,
  cardio_done boolean DEFAULT false,
  diet_followed boolean DEFAULT false,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own diary entries" ON diary_entries
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create evolution_weeks table (for exercise planning - NO weights)
CREATE TABLE IF NOT EXISTS evolution_weeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE evolution_weeks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own evolution weeks" ON evolution_weeks
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create evolution_exercises table (exercise planning)
CREATE TABLE IF NOT EXISTS evolution_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  evolution_week_id uuid NOT NULL REFERENCES evolution_weeks(id) ON DELETE CASCADE,
  day_of_week text NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  name text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE evolution_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own evolution exercises" ON evolution_exercises
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create evolution_exercise_sets table (sets and reps only - NO weight tracking)
CREATE TABLE IF NOT EXISTS evolution_exercise_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  evolution_exercise_id uuid NOT NULL REFERENCES evolution_exercises(id) ON DELETE CASCADE,
  set_number integer NOT NULL CHECK (set_number > 0),
  reps integer NOT NULL CHECK (reps > 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE evolution_exercise_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own evolution exercise sets" ON evolution_exercise_sets
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weeks_user_id ON weeks(user_id);
CREATE INDEX IF NOT EXISTS idx_days_user_id ON days(user_id);
CREATE INDEX IF NOT EXISTS idx_days_week_id ON days(weekId);
CREATE INDEX IF NOT EXISTS idx_exercises_user_id ON exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_exercises_day_id ON exercises(dayId);
CREATE INDEX IF NOT EXISTS idx_cardio_user_id ON cardio(user_id);
CREATE INDEX IF NOT EXISTS idx_cardio_day_id ON cardio(day_id);
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);
CREATE INDEX IF NOT EXISTS idx_food_substitutions_user_id ON food_substitutions(user_id);
CREATE INDEX IF NOT EXISTS idx_food_substitutions_meal_id ON food_substitutions(meal_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_user_id ON diary_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_evolution_weeks_user_id ON evolution_weeks(user_id);
CREATE INDEX IF NOT EXISTS idx_evolution_exercises_user_id ON evolution_exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_evolution_exercises_week_id ON evolution_exercises(evolution_week_id);
CREATE INDEX IF NOT EXISTS idx_evolution_exercise_sets_user_id ON evolution_exercise_sets(user_id);
CREATE INDEX IF NOT EXISTS idx_evolution_exercise_sets_exercise_id ON evolution_exercise_sets(evolution_exercise_id);