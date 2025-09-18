-- Add user_id to existing tables to connect with authenticated users
ALTER TABLE public.weeks ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.days ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;  
ALTER TABLE public.exercises ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable Row Level Security on all tables
ALTER TABLE public.weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for weeks
CREATE POLICY "Users can view their own weeks" 
ON public.weeks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weeks" 
ON public.weeks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weeks" 
ON public.weeks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weeks" 
ON public.weeks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for days
CREATE POLICY "Users can view their own days" 
ON public.days 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own days" 
ON public.days 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own days" 
ON public.days 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own days" 
ON public.days 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for exercises  
CREATE POLICY "Users can view their own exercises" 
ON public.exercises 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exercises" 
ON public.exercises 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercises" 
ON public.exercises 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercises" 
ON public.exercises 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for usuarios
CREATE POLICY "Users can view their own profile" 
ON public.usuarios 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.usuarios 
FOR UPDATE 
USING (auth.uid() = id);

-- Add foreign key constraints
ALTER TABLE public.days ADD CONSTRAINT fk_days_weeks FOREIGN KEY (weekId) REFERENCES public.weeks(id) ON DELETE CASCADE;
ALTER TABLE public.exercises ADD CONSTRAINT fk_exercises_days FOREIGN KEY (dayId) REFERENCES public.days(id) ON DELETE CASCADE;