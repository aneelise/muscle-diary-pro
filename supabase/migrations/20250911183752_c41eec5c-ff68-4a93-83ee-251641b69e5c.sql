-- Add proper foreign key constraints that were missing
ALTER TABLE public.days 
DROP CONSTRAINT IF EXISTS days_weekId_fkey;

ALTER TABLE public.days 
ADD CONSTRAINT days_weekId_fkey 
FOREIGN KEY (weekId) REFERENCES public.weeks(id) ON DELETE CASCADE;

ALTER TABLE public.exercises 
DROP CONSTRAINT IF EXISTS exercises_dayId_fkey;

ALTER TABLE public.exercises 
ADD CONSTRAINT exercises_dayId_fkey 
FOREIGN KEY (dayId) REFERENCES public.days(id) ON DELETE CASCADE;