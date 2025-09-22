/*
  # Create custom meal types table for flexible meal organization

  1. New Tables
    - `custom_meal_types`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, meal type name)
      - `order_index` (integer, display order)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `custom_meal_types` table
    - Add policies for authenticated users to manage their own meal types
*/

CREATE TABLE IF NOT EXISTS custom_meal_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE custom_meal_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own custom meal types"
  ON custom_meal_types
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own custom meal types"
  ON custom_meal_types
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom meal types"
  ON custom_meal_types
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom meal types"
  ON custom_meal_types
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);