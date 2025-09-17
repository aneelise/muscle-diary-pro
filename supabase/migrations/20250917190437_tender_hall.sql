/*
  # Create diet and diary tables

  1. New Tables
    - `meals` - Stores user's diet plan organized by meal types
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `meal_type` (text, enum: breakfast, pre_workout, lunch, afternoon_snack, dinner)
      - `food_name` (text)
      - `quantity` (text)
      - `created_at` (timestamp)
    
    - `diary_entries` - Daily diary entries with goals tracking
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `date` (date)
      - `diary_text` (text, optional)
      - `free_meal` (boolean, default false)
      - `free_meal_description` (text, optional)
      - `water_goal` (boolean, default false)
      - `workout_done` (boolean, default false)
      - `cardio_done` (boolean, default false)
      - `diet_followed` (boolean, default false)
      - `notes` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'pre_workout', 'lunch', 'afternoon_snack', 'dinner')),
  food_name text NOT NULL,
  quantity text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS diary_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  date date NOT NULL,
  diary_text text,
  free_meal boolean DEFAULT false,
  free_meal_description text,
  water_goal boolean DEFAULT false,
  workout_done boolean DEFAULT false,
  cardio_done boolean DEFAULT false,
  diet_followed boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

-- Policies for meals
CREATE POLICY "Users can view their own meals"
  ON meals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meals"
  ON meals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals"
  ON meals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals"
  ON meals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for diary entries
CREATE POLICY "Users can view their own diary entries"
  ON diary_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own diary entries"
  ON diary_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diary entries"
  ON diary_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diary entries"
  ON diary_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);