-- Ensure user ownership and safe RLS across weeks/days/exercises
-- 1) Add user_id columns (nullable for safe backfill)
ALTER TABLE public.weeks ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.days ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS user_id uuid;

-- 2) Enable RLS
ALTER TABLE public.weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- 3) Idempotent policies for weeks
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='weeks' AND policyname='Users can view their own weeks'
  ) THEN
    CREATE POLICY "Users can view their own weeks"
    ON public.weeks
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='weeks' AND policyname='Users can create their own weeks'
  ) THEN
    CREATE POLICY "Users can create their own weeks"
    ON public.weeks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='weeks' AND policyname='Users can update their own weeks'
  ) THEN
    CREATE POLICY "Users can update their own weeks"
    ON public.weeks
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='weeks' AND policyname='Users can delete their own weeks'
  ) THEN
    CREATE POLICY "Users can delete their own weeks"
    ON public.weeks
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- 4) Idempotent policies for days
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='days' AND policyname='Users can view their own days'
  ) THEN
    CREATE POLICY "Users can view their own days"
    ON public.days
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='days' AND policyname='Users can create their own days'
  ) THEN
    CREATE POLICY "Users can create their own days"
    ON public.days
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='days' AND policyname='Users can update their own days'
  ) THEN
    CREATE POLICY "Users can update their own days"
    ON public.days
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='days' AND policyname='Users can delete their own days'
  ) THEN
    CREATE POLICY "Users can delete their own days"
    ON public.days
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- 5) Idempotent policies for exercises
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='exercises' AND policyname='Users can view their own exercises'
  ) THEN
    CREATE POLICY "Users can view their own exercises"
    ON public.exercises
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='exercises' AND policyname='Users can create their own exercises'
  ) THEN
    CREATE POLICY "Users can create their own exercises"
    ON public.exercises
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='exercises' AND policyname='Users can update their own exercises'
  ) THEN
    CREATE POLICY "Users can update their own exercises"
    ON public.exercises
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='exercises' AND policyname='Users can delete their own exercises'
  ) THEN
    CREATE POLICY "Users can delete their own exercises"
    ON public.exercises
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- 6) Add missing FKs with proper quoting of camelCase columns, idempotently
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_days_weeks'
  ) THEN
    ALTER TABLE public."days"
    ADD CONSTRAINT fk_days_weeks FOREIGN KEY ("weekId") REFERENCES public.weeks(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_exercises_days'
  ) THEN
    ALTER TABLE public."exercises"
    ADD CONSTRAINT fk_exercises_days FOREIGN KEY ("dayId") REFERENCES public."days"(id) ON DELETE CASCADE;
  END IF;
END $$;