/*
  # Create evolution weeks table for custom week names in evolution tab

  1. New Tables
    - `evolution_weeks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, week name)
      - `description` (text, optional description)
      - `order_index` (integer, display order)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `evolution_weeks` table
    - Add policies for authenticated users to manage their own evolution weeks
*/

CREATE TABLE IF NOT EXISTS evolution_weeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE evolution_weeks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own evolution weeks"
  ON evolution_weeks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own evolution weeks"
  ON evolution_weeks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own evolution weeks"
  ON evolution_weeks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own evolution weeks"
  ON evolution_weeks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);