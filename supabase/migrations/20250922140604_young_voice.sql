/*
  # Create exercise sets table for multiple sets per exercise

  1. New Tables
    - `exercise_sets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `exercise_id` (uuid, foreign key to exercises)
      - `set_number` (integer, set order)
      - `reps` (integer, repetitions)
      - `weight` (numeric, weight used)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `exercise_sets` table
    - Add policies for authenticated users to manage their own exercise sets
*/

CREATE TABLE IF NOT EXISTS exercise_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  set_number integer NOT NULL,
  reps integer NOT NULL,
  weight numeric(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own exercise sets"
  ON exercise_sets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exercise sets"
  ON exercise_sets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise sets"
  ON exercise_sets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercise sets"
  ON exercise_sets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);