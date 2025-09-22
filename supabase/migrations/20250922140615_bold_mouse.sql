/*
  # Create evolution exercise sets table for multiple sets per evolution exercise

  1. New Tables
    - `evolution_exercise_sets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `evolution_exercise_id` (uuid, foreign key to evolution_exercises)
      - `set_number` (integer, set order)
      - `reps` (integer, repetitions)
      - `weight` (numeric, weight used)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `evolution_exercise_sets` table
    - Add policies for authenticated users to manage their own evolution exercise sets
*/

CREATE TABLE IF NOT EXISTS evolution_exercise_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  evolution_exercise_id uuid REFERENCES evolution_exercises(id) ON DELETE CASCADE NOT NULL,
  set_number integer NOT NULL,
  reps integer NOT NULL,
  weight numeric(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE evolution_exercise_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own evolution exercise sets"
  ON evolution_exercise_sets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own evolution exercise sets"
  ON evolution_exercise_sets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own evolution exercise sets"
  ON evolution_exercise_sets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own evolution exercise sets"
  ON evolution_exercise_sets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);