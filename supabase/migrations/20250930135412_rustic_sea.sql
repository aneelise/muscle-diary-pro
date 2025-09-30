/*
  # Fix all database tables and relationships

  1. New Tables
    - `evolution_weeks` - Semanas de evolução
    - `evolution_exercises` - Exercícios de evolução
    - `evolution_exercise_sets` - Séries dos exercícios de evolução
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
  
  3. Changes
    - Fix all foreign key references
    - Ensure proper data types
    - Add missing constraints
*/

-- Create evolution_weeks table if not exists
CREATE TABLE IF NOT EXISTS evolution_weeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create evolution_exercises table if not exists
CREATE TABLE IF NOT EXISTS evolution_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  evolution_week_id uuid NOT NULL REFERENCES evolution_weeks(id) ON DELETE CASCADE,
  day_of_week text NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  name text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create evolution_exercise_sets table if not exists
CREATE TABLE IF NOT EXISTS evolution_exercise_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  evolution_exercise_id uuid NOT NULL REFERENCES evolution_exercises(id) ON DELETE CASCADE,
  set_number integer NOT NULL CHECK (set_number > 0),
  reps integer NOT NULL CHECK (reps > 0),
  weight numeric NOT NULL CHECK (weight >= 0),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on evolution tables
ALTER TABLE evolution_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE evolution_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE evolution_exercise_sets ENABLE ROW LEVEL SECURITY;

-- Create policies for evolution_weeks
CREATE POLICY "Users can manage their own evolution weeks"
  ON evolution_weeks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for evolution_exercises
CREATE POLICY "Users can manage their own evolution exercises"
  ON evolution_exercises
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for evolution_exercise_sets
CREATE POLICY "Users can manage their own evolution exercise sets"
  ON evolution_exercise_sets
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Fix existing tables foreign keys if needed
DO $$
BEGIN
  -- Fix weeks table user_id reference
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'weeks_user_id_fkey' AND table_name = 'weeks'
  ) THEN
    ALTER TABLE weeks ADD CONSTRAINT weeks_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  -- Fix days table user_id reference
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'days_user_id_fkey' AND table_name = 'days'
  ) THEN
    ALTER TABLE days ADD CONSTRAINT days_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  -- Fix exercises table user_id reference
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'exercises_user_id_fkey' AND table_name = 'exercises'
  ) THEN
    ALTER TABLE exercises ADD CONSTRAINT exercises_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;