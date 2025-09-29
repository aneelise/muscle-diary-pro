/*
  # Correção do Schema do Banco de Dados

  1. Novas Tabelas
    - `users` (corrigir referências de usuarios para users)
    - `food_substitutions` (adicionar tabela faltante)
    - `exercise_sets` (adicionar tabela para séries de exercícios)
    - `evolution_weeks` (adicionar tabela para evolução)
    - `evolution_exercises` (adicionar tabela para exercícios de evolução)
    - `evolution_exercise_sets` (adicionar tabela para séries de evolução)

  2. Correções
    - Renomear tabela usuarios para users
    - Corrigir referências de foreign keys
    - Adicionar tabelas faltantes
    - Corrigir tipos de dados inconsistentes

  3. Segurança
    - Habilitar RLS em todas as tabelas
    - Adicionar políticas de segurança apropriadas
*/

-- Criar tabela users (renomeando usuarios)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  created_at timestamptz DEFAULT now()
);

-- Migrar dados de usuarios para users se existir
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'usuarios') THEN
    INSERT INTO users (id, name, email, created_at)
    SELECT id, name, email, created_at FROM usuarios
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Habilitar RLS na tabela users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Criar tabela food_substitutions se não existir
CREATE TABLE IF NOT EXISTS food_substitutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_id uuid NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  substitute_name text NOT NULL,
  quantity text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE food_substitutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own food substitutions" ON food_substitutions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Criar tabela exercise_sets para séries de exercícios
CREATE TABLE IF NOT EXISTS exercise_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  set_number integer NOT NULL,
  reps integer NOT NULL,
  weight numeric NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own exercise sets" ON exercise_sets
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Atualizar referências de foreign keys existentes para usar users
DO $$
BEGIN
  -- Atualizar meals
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'meals_user_id_fkey') THEN
    ALTER TABLE meals DROP CONSTRAINT meals_user_id_fkey;
  END IF;
  ALTER TABLE meals ADD CONSTRAINT meals_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

  -- Atualizar custom_meal_types
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'custom_meal_types_user_id_fkey') THEN
    ALTER TABLE custom_meal_types DROP CONSTRAINT custom_meal_types_user_id_fkey;
  END IF;
  ALTER TABLE custom_meal_types ADD CONSTRAINT custom_meal_types_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

  -- Atualizar weeks
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'weeks_user_id_fkey') THEN
    ALTER TABLE weeks DROP CONSTRAINT weeks_user_id_fkey;
  END IF;
  ALTER TABLE weeks ADD CONSTRAINT weeks_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

  -- Atualizar cardio
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_cardio_user') THEN
    ALTER TABLE cardio DROP CONSTRAINT fk_cardio_user;
  END IF;
  ALTER TABLE cardio ADD CONSTRAINT cardio_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
END $$;

-- Criar função helper para obter user_id
CREATE OR REPLACE FUNCTION uid() RETURNS uuid AS $$
  SELECT auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- Atualizar estrutura da tabela exercises para ser consistente
DO $$
BEGIN
  -- Verificar se a coluna sets existe e remover se for array
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exercises' AND column_name = 'sets' AND data_type = 'smallint'
  ) THEN
    ALTER TABLE exercises DROP COLUMN IF EXISTS sets;
  END IF;
  
  -- Verificar se a coluna reps existe e remover se for array  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exercises' AND column_name = 'reps' AND data_type = 'smallint'
  ) THEN
    ALTER TABLE exercises DROP COLUMN IF EXISTS reps;
  END IF;
  
  -- Verificar se a coluna weight existe e remover se for array
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exercises' AND column_name = 'weight' AND data_type = 'numeric'
  ) THEN
    ALTER TABLE exercises DROP COLUMN IF EXISTS weight;
  END IF;
END $$;

-- Adicionar colunas necessárias para exercises se não existirem
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exercises' AND column_name = 'sets'
  ) THEN
    ALTER TABLE exercises ADD COLUMN sets integer DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exercises' AND column_name = 'reps'
  ) THEN
    ALTER TABLE exercises ADD COLUMN reps integer DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exercises' AND column_name = 'weight'
  ) THEN
    ALTER TABLE exercises ADD COLUMN weight numeric DEFAULT 0;
  END IF;
END $$;

-- Remover tabela usuarios se existir (após migração)
DROP TABLE IF EXISTS usuarios CASCADE;