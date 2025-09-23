/*
  # Create custom_meal_types table

  1. New Tables
    - `custom_meal_types`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to usuarios table)
      - `name` (text, meal type name)
      - `order_index` (integer, for ordering meal types)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `custom_meal_types` table
    - Add policies for authenticated users to manage their own meal types
*/

CREATE TABLE IF NOT EXISTS custom_meal_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES usuarios(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE custom_meal_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own custom meal types"
  ON custom_meal_types
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom meal types"
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