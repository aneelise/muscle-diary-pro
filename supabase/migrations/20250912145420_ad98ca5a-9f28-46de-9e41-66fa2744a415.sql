-- Fix exercises.exerciseId type to align with app data (string ids like '1', '2', ...)
-- and remove unintended default that generated uuids
begin;

-- 1) Drop default on exerciseId if exists
ALTER TABLE public.exercises ALTER COLUMN "exerciseId" DROP DEFAULT;

-- 2) Change column type from uuid to text, safely casting existing values
ALTER TABLE public.exercises 
  ALTER COLUMN "exerciseId" TYPE text USING ("exerciseId")::text;

commit;