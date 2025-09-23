/*
  # Criar tabelas faltantes para o sistema

  1. Novas Tabelas
    - `custom_meal_types` - Tipos de refeições personalizadas
    - `food_substitutions` - Substituições de alimentos
    - `evolution_weeks` - Semanas de evolução
    - `evolution_exercises` - Exercícios de evolução
    - `evolution_exercise_sets` - Séries dos exercícios de evolução

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Adicionar políticas para usuários autenticados

  3. Relacionamentos
    - Chaves estrangeiras apropriadas
    - Cascata de exclusão onde necessário
*/

-- Criar tabela de tipos de refeições personalizadas
CREATE TABLE IF NOT EXISTS custom_meal_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  name text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE custom_meal_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own meal types"
  ON custom_meal_types
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Criar tabela de substituições de alimentos
CREATE TABLE IF NOT EXISTS food_substitutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  meal_id uuid NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  substitute_name text NOT NULL,
  quantity text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE food_substitutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own food substitutions"
  ON food_substitutions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Criar tabela de semanas de evolução
CREATE TABLE IF NOT EXISTS evolution_weeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE evolution_weeks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own evolution weeks"
  ON evolution_weeks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Criar tabela de exercícios de evolução
CREATE TABLE IF NOT EXISTS evolution_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  evolution_week_id uuid NOT NULL REFERENCES evolution_weeks(id) ON DELETE CASCADE,
  day_of_week text NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  name text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE evolution_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own evolution exercises"
  ON evolution_exercises
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Criar tabela de séries dos exercícios de evolução
CREATE TABLE IF NOT EXISTS evolution_exercise_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  evolution_exercise_id uuid NOT NULL REFERENCES evolution_exercises(id) ON DELETE CASCADE,
  set_number integer NOT NULL CHECK (set_number > 0),
  reps integer NOT NULL CHECK (reps > 0),
  weight numeric NOT NULL CHECK (weight >= 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE evolution_exercise_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own evolution exercise sets"
  ON evolution_exercise_sets
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_custom_meal_types_user_id ON custom_meal_types(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_meal_types_order ON custom_meal_types(user_id, order_index);
CREATE INDEX IF NOT EXISTS idx_food_substitutions_meal_id ON food_substitutions(meal_id);
CREATE INDEX IF NOT EXISTS idx_evolution_weeks_user_id ON evolution_weeks(user_id);
CREATE INDEX IF NOT EXISTS idx_evolution_exercises_week_id ON evolution_exercises(evolution_week_id);
CREATE INDEX IF NOT EXISTS idx_evolution_exercise_sets_exercise_id ON evolution_exercise_sets(evolution_exercise_id);