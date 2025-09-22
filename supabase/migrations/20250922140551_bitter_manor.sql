/*
  # Create diary entries table for diet tracking

  1. New Tables
    - `diary_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `date` (date, entry date)
      - `diary_text` (text, optional diary content)
      - `free_meal` (boolean, had free meal)
      - `free_meal_description` (text, optional free meal description)
      - `water_goal` (boolean, achieved water goal)
      - `workout_done` (boolean, completed workout)
      - `cardio_done` (boolean, completed cardio)
      - `diet_followed` (boolean, followed diet)
      - `notes` (text, optional notes)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `diary_entries` table
    - Add policies for authenticated users to manage their own entries
*/

CREATE TABLE IF NOT EXISTS diary_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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

ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

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