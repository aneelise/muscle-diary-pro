/*
  # Create food substitutions table for meal alternatives

  1. New Tables
    - `food_substitutions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `meal_id` (uuid, foreign key to meals)
      - `substitute_name` (text, name of substitute food)
      - `quantity` (text, quantity description)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `food_substitutions` table
    - Add policies for authenticated users to manage their own substitutions
*/

CREATE TABLE IF NOT EXISTS food_substitutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meal_id uuid REFERENCES meals(id) ON DELETE CASCADE NOT NULL,
  substitute_name text NOT NULL,
  quantity text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE food_substitutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own food substitutions"
  ON food_substitutions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own food substitutions"
  ON food_substitutions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food substitutions"
  ON food_substitutions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food substitutions"
  ON food_substitutions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);