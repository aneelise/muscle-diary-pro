/*
  # Create meals table for diet functionality

  1. New Tables
    - `meals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `meal_type` (text, type of meal)
      - `food_name` (text, name of the food)
      - `quantity` (text, quantity description)
      - `time` (text, optional time)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `meals` table
    - Add policies for authenticated users to manage their own meals
*/

CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meal_type text NOT NULL,
  food_name text NOT NULL,
  quantity text NOT NULL,
  time text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

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