/*
  # Create evolution exercises table for exercises in evolution weeks

  1. New Tables
    - `evolution_exercises`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `evolution_week_id` (uuid, foreign key to evolution_weeks)
      - `day_of_week` (text, day of the week)
      - `name` (text, exercise name)
      - `notes` (text, optional notes)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `evolution_exercises` table
    - Add policies for authenticated users to manage their own evolution exercises
*/

CREATE TABLE IF NOT EXISTS evolution_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  evolution_week_id uuid REFERENCES evolution_weeks(id) ON DELETE CASCADE NOT NULL,
  day_of_week text NOT NULL,
  name text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE evolution_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own evolution exercises"
  ON evolution_exercises
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own evolution exercises"
  ON evolution_exercises
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own evolution exercises"
  ON evolution_exercises
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own evolution exercises"
  ON evolution_exercises
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);