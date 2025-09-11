begin;

-- 1) Remove problematic defaults on FK columns
ALTER TABLE public.days ALTER COLUMN "weekId" DROP DEFAULT;
ALTER TABLE public.exercises ALTER COLUMN "dayId" DROP DEFAULT;

-- 2) Clean up orphan records so constraints can be re-created safely
DELETE FROM public.exercises e
WHERE e."dayId" IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.days d WHERE d.id = e."dayId");

DELETE FROM public.days d
WHERE NOT EXISTS (SELECT 1 FROM public.weeks w WHERE w.id = d."weekId");

-- 3) Fix the foreign key for days.weekId -> weeks.id (it mistakenly pointed to days.id)
ALTER TABLE public.days DROP CONSTRAINT IF EXISTS "days_weekId_fkey";
ALTER TABLE public.days
  ADD CONSTRAINT "days_weekId_fkey"
  FOREIGN KEY ("weekId") REFERENCES public.weeks(id) ON DELETE CASCADE;

-- 4) Ensure exercises.dayId -> days.id foreign key exists and is correct
ALTER TABLE public.exercises DROP CONSTRAINT IF EXISTS "fk_exercises_days";
ALTER TABLE public.exercises DROP CONSTRAINT IF EXISTS "exercises_dayId_fkey";
ALTER TABLE public.exercises
  ADD CONSTRAINT "exercises_dayId_fkey"
  FOREIGN KEY ("dayId") REFERENCES public.days(id) ON DELETE CASCADE;

commit;